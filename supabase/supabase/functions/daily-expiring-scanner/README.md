# Daily Expiring Scanner Function

## Mô tả

Edge Function này tự động quét các **Food Items** và **Cosmetics** sắp hết hạn trong vòng 7 ngày tới, sau đó đưa chúng vào bảng `expiring_items_queue` để xử lý thông báo.

## Tính năng chính

- ✅ Quét cả **Food Items** và **Cosmetics**
- ✅ Quét từ ngày 0 đến ngày 7 (8 ngày)
- ✅ Tự động phân loại độ ưu tiên (urgent, high, medium, low)
- ✅ Chỉ xử lý users có `chat_id` (đã kết nối Telegram)
- ✅ Tự động dọn dẹp queue items cũ (> 7 ngày)
- ✅ Xử lý theo batch để tối ưu hiệu suất
- ✅ Tránh trùng lặp với unique constraints

## Cách sử dụng

### 1. Deploy function

```bash
supabase functions deploy daily-expiring-scanner
```

### 2. Test thủ công

```bash
curl -i --location --request POST 'https://your-project.supabase.co/functions/v1/daily-expiring-scanner' \
  --header 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  --header 'Content-Type: application/json'
```

### 3. Thiết lập Cron Job (Chạy tự động hằng ngày)

#### Sử dụng Supabase pg_cron

1. Vào **Database > Extensions** trong Supabase Dashboard
2. Enable extension `pg_cron`
3. Chạy SQL sau:

```sql
-- Enable pg_cron extension
create extension if not exists pg_cron;

-- Schedule the function to run daily at midnight (UTC)
select cron.schedule(
  'daily-expiring-scanner',
  '0 0 * * *',
  $$
  select net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/daily-expiring-scanner',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

## Response Format

### Success Response

```json
{
  "success": true,
  "total_processed": 15,
  "results": [
    {"days_ahead": 0, "processed": 3},
    {"days_ahead": 1, "processed": 5}
  ],
  "timestamp": "2024-12-02T08:00:00.000Z"
}
```

## Cấu hình

Biến môi trường:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Constants:
- `DEFAULT_DAYS_AHEAD`: 7
- `BATCH_SIZE`: 100
