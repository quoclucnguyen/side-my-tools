# TMA Exchange Debugging Guide

## Logs Added

The function now logs at each critical step to help diagnose 401 errors:

### 1. Environment Check
```
[TMA-Exchange] Env check: { hasBotToken, hasSupabaseUrl, ... }
```
**Action**: If any are `false`, the corresponding secret is missing in Supabase.

### 2. Request Parsing
```
[TMA-Exchange] Body parsed, initDataRaw present: true/false
[TMA-Exchange] Parsed params: { hasHash, hasUser, hasAuthDate, hasQueryId }
```
**Action**: If initDataRaw is missing or params are incomplete, the request body is malformed.

### 3. Hash Verification (Most Likely 401 Cause)
```
[TMA-Exchange] Hash verification: { providedHash, calculatedHash, match }
```
**Action**: If `match: false`, the issue is:
- Wrong `TELEGRAM_BOT_TOKEN` in Supabase secrets
- initDataRaw was modified/corrupted in transit
- The algorithm expects key "WebAppData" but Telegram changed it

### 4. TTL Check (Second Most Likely 401 Cause)
```
[TMA-Exchange] TTL check: { authDate, nowSec, ageDelta, isExpired }
```
**Action**: If `isExpired: true`, the initDataRaw is older than 24 hours. The user needs fresh initData from Telegram.

### 5. User & Session Creation
```
[TMA-Exchange] Email alias created: tg_<id>@tma.local
[TMA-Exchange] User ensured, createErr: ...
[TMA-Exchange] OTP generated, length: ...
[TMA-Exchange] Session created successfully
```
**Action**: If errors appear here, it's a Supabase configuration issue (RLS, auth settings, etc.).

## How to Test

After deploying the updated function:

```bash
# Run your curl command
curl 'https://dsutiulwgwhwwegiioxl.supabase.co/functions/v1/tma-exchange' \
  -H 'authorization: Bearer sb_publishable_...' \
  -H 'content-type: application/json' \
  --data-raw '{"initDataRaw":"query_id=...&user=...&hash=..."}'
```

Then check logs in Supabase Dashboard:
1. Go to **Edge Functions** → **tma-exchange**
2. Click **Logs** tab
3. Look for `[TMA-Exchange]` entries

## Common 401 Causes

### Hash Mismatch
**Symptom**: `[TMA-Exchange] Hash mismatch - provided: ... calculated: ...`

**Fix**:
- Verify `TELEGRAM_BOT_TOKEN` secret matches your actual bot token
- Ensure initDataRaw hasn't been URL-decoded/re-encoded (must be raw string)
- Check that buildDataCheckString sorts keys correctly

### Expired auth_date
**Symptom**: `[TMA-Exchange] initData expired or invalid auth_date`

**Fix**:
- The initDataRaw timestamp (`auth_date=1762144935`) is too old
- Generate fresh initData from Telegram Mini App
- Consider increasing `maxAgeSec` if testing (not recommended for production)

### Missing Environment Variables
**Symptom**: `[TMA-Exchange] Missing required environment variables`

**Fix**:
- Go to Supabase Dashboard → Edge Functions → Secrets
- Ensure all are set:
  - `TELEGRAM_BOT_TOKEN`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE`
  - `SUPABASE_ANON_KEY`

## Next Steps

1. Deploy the updated function to Supabase
2. Run the curl command again
3. Check the logs to identify which validation step is failing
4. Apply the corresponding fix based on the log output
