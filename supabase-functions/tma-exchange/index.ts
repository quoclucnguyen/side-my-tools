/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

/* Supabase Edge Function: Telegram Mini App auth exchange (B1 - bridge to Supabase session)
   - Verifies Telegram initData (HMAC-SHA256) using BOT token
   - Ensures a Supabase user exists (email = tg_<id>@tma.local)
   - Generates a magic link OTP via Admin API and exchanges it for a Supabase session
   - Returns { access_token, refresh_token, user, token_type, expires_in }
   Notes:
   - Deploy as a Supabase Edge Function (Deno). Ensure secrets are set:
     TELEGRAM_BOT_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE, SUPABASE_ANON_KEY
     Optional: GOTRUE_URL (defaults to ${SUPABASE_URL}/auth/v1)
*/

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders: HeadersInit = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
};

type TgUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
};

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(keyRaw: ArrayBuffer | Uint8Array | string, data: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const keyMaterial = typeof keyRaw === 'string' ? enc.encode(keyRaw) : keyRaw instanceof Uint8Array ? keyRaw : new Uint8Array(keyRaw);
  const cryptoKey = await crypto.subtle.importKey('raw', keyMaterial, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data));
}

function buildDataCheckString(params: URLSearchParams): string {
  const pairs: string[] = [];
  for (const [k, v] of params) {
    if (k === 'hash') continue;
    pairs.push(`${k}=${v}`);
  }
  pairs.sort();
  return pairs.join('\n');
}

function badRequest(msg: string, code = 400) {
  return new Response(JSON.stringify({ error: msg }), { status: code, headers: corsHeaders });
}

function okJson(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

function parseInitUser(raw: string | null): TgUser | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TgUser;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return badRequest('Method Not Allowed', 405);
  }

  try {
    const env = {
      BOT_TOKEN: Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '',
      SUPABASE_URL: Deno.env.get('SUPABASE_URL') ?? '',
      SUPABASE_SERVICE_ROLE: Deno.env.get('SUPABASE_SERVICE_ROLE') ?? '',
      SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      GOTRUE_URL: Deno.env.get('GOTRUE_URL') || (Deno.env.get('SUPABASE_URL') ? `${Deno.env.get('SUPABASE_URL')}/auth/v1` : ''),
    };

    if (!env.BOT_TOKEN || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE || !env.SUPABASE_ANON_KEY || !env.GOTRUE_URL) {
      return badRequest('Missing required environment variables', 500);
    }

    const body = await req.json().catch(() => ({}));
    const initDataRaw: unknown = body?.initDataRaw;
    if (!initDataRaw || typeof initDataRaw !== 'string') {
      return badRequest('initDataRaw is required');
    }

    // Parse and verify Telegram initData
    const params = new URLSearchParams(initDataRaw);
    const providedHash = params.get('hash');
    if (!providedHash) {
      return badRequest('Missing hash in initDataRaw');
    }

    const dataCheckString = buildDataCheckString(params);

    // Telegram algorithm:
    // secret_key = HMAC_SHA256(key=BOT_TOKEN, data='WebAppData')
    // check_hash = HMAC_SHA256(key=secret_key, data=data_check_string)
    // Telegram secret key must be HMAC_SHA256 with key "WebAppData" over the bot token
    const secretKeyBuf = await hmacSha256('WebAppData', env.BOT_TOKEN);
    const checkHashBuf = await hmacSha256(secretKeyBuf, dataCheckString);
    const calculatedHashHex = toHex(checkHashBuf);

    if (calculatedHashHex !== providedHash) {
      return badRequest('Invalid initData hash', 401);
    }

    // Optional TTL check to mitigate replay (default 24h)
    const authDateStr = params.get('auth_date');
    const authDate = authDateStr ? Number(authDateStr) : NaN;
    const nowSec = Math.floor(Date.now() / 1000);
    const maxAgeSec = 86400; // 24h
    if (!Number.isFinite(authDate) || Math.abs(nowSec - authDate) > maxAgeSec) {
      return badRequest('initData expired', 401);
    }

    const tgUser = parseInitUser(params.get('user'));
    if (!tgUser || !tgUser.id) {
      return badRequest('Invalid Telegram user payload');
    }

    // Compose Supabase identity (email alias for Telegram user)
    const email = `tg_${tgUser.id}@tma.local`;

    // Admin client
    const supaAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Ensure user exists (idempotent)
    // Attempt create; if already exists, ignore error
    {
      const { error: createErr } = await supaAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        app_metadata: { provider: 'telegram', telegram_id: tgUser.id, username: tgUser.username || null },
        user_metadata: {
          telegram_id: tgUser.id,
          username: tgUser.username || null,
          first_name: tgUser.first_name || null,
          last_name: tgUser.last_name || null,
          language_code: tgUser.language_code || null,
        },
      });
      if (createErr && !/already|exists/i.test(createErr.message || '')) {
        // Non-idempotent error
        return badRequest('Failed to ensure user', 500);
      }
    }

    // Generate magic link OTP and exchange to session
    const { data: linkData, error: linkErr } = await supaAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        // keep metadata in sync
        data: {
          telegram_id: tgUser.id,
          username: tgUser.username || null,
          first_name: tgUser.first_name || null,
          last_name: tgUser.last_name || null,
          language_code: tgUser.language_code || null,
        },
      },
    });

    if (linkErr || !linkData?.properties?.email_otp) {
      return badRequest('Failed to generate OTP', 500);
    }

    const emailOtp = linkData.properties.email_otp as string;

    // Exchange OTP to session tokens
    const verifyResp = await fetch(`${env.GOTRUE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        type: 'email',
        email,
        token: emailOtp,
      }),
    });

    if (!verifyResp.ok) {
      const txt = await verifyResp.text().catch(() => '');
      return badRequest(`OTP verify failed: ${txt || verifyResp.status}`, 500);
    }

    const session = await verifyResp.json();

    // Return session to the client
    return okJson({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      token_type: session.token_type,
      expires_in: session.expires_in,
      user: session.user,
      telegram_user: {
        id: tgUser.id,
        username: tgUser.username || null,
        first_name: tgUser.first_name || null,
        last_name: tgUser.last_name || null,
        language_code: tgUser.language_code || null,
      },
    });
  } catch (e) {
    // Avoid leaking secrets in errors
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return badRequest(`Internal Error: ${msg}`, 500);
  }
});
