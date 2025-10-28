/* Telegram Mini Apps helpers (SDK-free, safe in non-Telegram browsers) */

export type TmaExchangeResponse = {
  access_token: string
  refresh_token: string
  token_type?: string
  expires_in?: number
  user?: unknown
  telegram_user?: {
    id: number
    username?: string | null
    first_name?: string | null
    last_name?: string | null
    language_code?: string | null
  } | null
}

/**
 * Phát hiện WebView của Telegram và lấy initDataRaw.
 * Ưu tiên dùng window.Telegram.WebApp.initData (chuỗi ký bởi Telegram).
 * Fallback: tìm trong URL query (?tgWebAppData=... | ?initData=...)
 */
export function getInitDataRaw(): string | null {
  try {
    const w = window as unknown as {
      Telegram?: { WebApp?: { initData?: string; initDataUnsafe?: unknown } }
      location: Location
    }
    const tg = w?.Telegram?.WebApp
    if (tg?.initData && typeof tg.initData === 'string' && tg.initData.length > 0) {
      return tg.initData
    }
    const p = new URLSearchParams(w.location.search)
    const qs = p.get('tgWebAppData') || p.get('initData')
    return qs ?? null
  } catch {
    return null
  }
}

/** Kiểm tra có đang chạy trong Telegram WebView không */
export function isInTelegramWebView(): boolean {
  try {
    const w = window as unknown as { Telegram?: { WebApp?: unknown } }
    return !!w?.Telegram?.WebApp
  } catch {
    return false
  }
}

/**
 * Gọi Edge Function để xác thực initData và đổi lấy phiên Supabase.
 * Endpoint:
 *  - Ưu tiên VITE_TMA_EXCHANGE_URL
 *  - Mặc định: `${VITE_SUPABASE_URL}/functions/v1/tma-exchange`
 * Yêu cầu header Authorization: Bearer ANON_KEY (thường bắt buộc với Supabase Functions)
 */
export async function exchangeTma(initDataRaw: string): Promise<TmaExchangeResponse> {
  const base =
    import.meta.env.VITE_TMA_EXCHANGE_URL ||
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tma-exchange`

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    headers.Authorization = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
  }

  const res = await fetch(base, {
    method: 'POST',
    headers,
    body: JSON.stringify({ initDataRaw }),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`TMA exchange failed: ${res.status} ${txt}`)
  }
  return res.json()
}
