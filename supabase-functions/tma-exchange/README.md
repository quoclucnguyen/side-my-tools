# Supabase Edge Function: tma-exchange (Telegram Mini App → Supabase session, B1)

Mục tiêu:
- Xác thực `initDataRaw` của Telegram bằng HMAC-SHA256 (BOT token) theo tài liệu TMA.
- Đảm bảo có user Supabase (alias email `tg_<telegram_id>@tma.local`).
- Tạo phiên Supabase cho client bằng cơ chế magic link OTP → verify để lấy `{ access_token, refresh_token }`.

Đầu vào/Đầu ra:
- Endpoint: POST /tma-exchange
- Body:
  {
    "initDataRaw": "query-string Telegram gửi vào WebView (tgWebAppData)"
  }
- 200 OK:
  {
    "access_token": "…",
    "refresh_token": "…",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": { ... },
    "telegram_user": {
      "id": 12345678,
      "username": "john",
      "first_name": "John",
      "last_name": "Doe",
      "language_code": "en"
    }
  }

Cần thiết lập biến môi trường (Function secrets):
- TELEGRAM_BOT_TOKEN: Bot token từ BotFather.
- SUPABASE_URL: URL project (vd: https://xxxx.supabase.co).
- SUPABASE_SERVICE_ROLE: Service Role key (KHÔNG lộ ra client).
- SUPABASE_ANON_KEY: Anon key (dùng verify OTP).
- GOTRUE_URL (tùy chọn): Mặc định ${SUPABASE_URL}/auth/v1.

Triển khai:
1) Cấu trúc file
   supabase-functions/
   └─ tma-exchange/
      ├─ index.ts      (đã tạo)
      └─ README.md     (file này)

2) Nếu dùng Supabase CLI (khuyến nghị):
   - Thư mục chuẩn của CLI là supabase/functions/<name>/index.ts
   - Bạn có thể:
     - Sao chép: cp -r supabase-functions/tma-exchange supabase/functions/tma-exchange
     - Hoặc tạo symlink: ln -s ../../supabase-functions/tma-exchange supabase/functions/tma-exchange

3) Thiết lập secrets:
   supabase secrets set --env-file ./path/to/.env  # chứa TELEGRAM_BOT_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE, SUPABASE_ANON_KEY
   # Hoặc set lẻ:
   supabase secrets set TELEGRAM_BOT_TOKEN=xxx SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE=xxx SUPABASE_ANON_KEY=xxx

4) Deploy:
   supabase functions deploy tma-exchange
   # Kiểm tra logs:
   supabase functions logs tma-exchange

5) Gọi thử (cURL):
   curl -i -X POST "https://<project-ref>.supabase.co/functions/v1/tma-exchange" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <ANON_OR_SERVICE_KEY>" \
     -d '{"initDataRaw":"<dán nguyên chuỗi tgWebAppData>"}'

Thuật toán xác thực hash (rút gọn):
- data_check_string = join các cặp key=value từ initData (exclude 'hash'), sort theo key, dùng '\n' để nối.
- secret_key = HMAC_SHA256(key='WebAppData', data=BOT_TOKEN)
- check_hash = HMAC_SHA256(key=secret_key, data=data_check_string) (hex)
- So sánh với 'hash' trong initData.
- Nên kiểm tra TTL (auth_date trong khoảng an toàn, ví dụ 24h).

Lưu ý bảo mật:
- Không log `initDataRaw`/secrets trong production.
- Giới hạn tần suất (rate-limit) theo IP/chat_instance nếu cần.
- Service Role chỉ dùng ở Edge Function, không trả về client.

Tích hợp client (ví dụ):
```ts
// TypeScript
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { supabase } from '@/lib/supabaseClient'

const { initDataRaw } = retrieveLaunchParams()
if (initDataRaw) {
  const res = await fetch('/api/tma/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initDataRaw }),
  })
  if (res.ok) {
    const { access_token, refresh_token, user, telegram_user } = await res.json()
    await supabase.auth.setSession({ access_token, refresh_token })
    // Lưu trạng thái "TMA mode" + telegram_user vào store nếu cần
  } else {
    console.error('TMA exchange failed', await res.text())
  }
}
```

Troubleshooting:
- 401 Invalid initData hash: kiểm tra đúng thuật toán HMAC và không thay đổi thứ tự cặp key=value.
- 401 initData expired: lệch thời gian hoặc TTL quá ngắn.
- 500 Failed to generate OTP: kiểm tra Service Role quyền Admin Auth.
- 500 OTP verify failed: kiểm tra `GOTRUE_URL` và `SUPABASE_ANON_KEY`.

Ghi chú triển khai:
- File đã thêm `// @ts-nocheck` vì VSCode TypeScript local không biết môi trường Deno; khi deploy Edge Function sẽ chạy chuẩn Deno.
