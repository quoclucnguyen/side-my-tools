# Cấu trúc Database

Dự án sử dụng Supabase làm backend. Dưới đây là cấu trúc các bảng và storage bucket được sử dụng trong ứng dụng.

## Tables

### 1. `user_settings`

Lưu trữ cài đặt và tùy chọn của người dùng.

| Column Name      | Type          | Description                                                       |
| :--------------- | :------------ | :---------------------------------------------------------------- |
| `id`             | `uuid`        | Primary Key                                                       |
| `user_id`        | `uuid`        | Foreign Key tới `auth.users`. Unique.                             |
| `preferences`    | `jsonb`       | Lưu trữ các tùy chọn (ví dụ: `gemini` preferences). Default: `{}` |
| `gemini_api_key` | `text`        | API key cho Gemini. Nullable.                                     |
| `created_at`     | `timestamptz` | Thời gian tạo. Default: `now()`                                   |
| `updated_at`     | `timestamptz` | Thời gian cập nhật. Default: `now()`                              |

### 2. `users`

Lưu trữ thông tin người dùng được đồng bộ từ Telegram. Bảng này được tạo và cập nhật khi người dùng tương tác với Telegram Bot.

| Column Name  | Type          | Description                                                              |
| :----------- | :------------ | :----------------------------------------------------------------------- |
| `id`         | `uuid`        | Primary Key. Foreign Key tới `auth.users.id`.                            |
| `telegram_id`| `bigint`      | ID người dùng từ Telegram. Unique.                                       |
| `chat_id`    | `bigint`      | ID cuộc trò chuyện với người dùng.                                        |
| `email`      | `text`        | Email được tạo tự động (`tg-<telegram_id>@telegram.local`). Unique.       |
| `first_name` | `text`        | Tên người dùng từ Telegram. Nullable.                                    |
| `last_name`  | `text`        | Họ người dùng từ Telegram. Nullable.                                     |
| `username`   | `text`        | Username từ Telegram. Nullable.                                          |
| `last_login` | `timestamptz` | Thời gian tương tác cuối cùng.                                            |
| `created_at` | `timestamptz` | Thời gian tạo. Default: `now()`                                          |
| `updated_at` | `timestamptz` | Thời gian cập nhật. Default: `now()`                                     |

### 3. `food_items`

Lưu trữ thông tin thực phẩm trong kho.

| Column Name       | Type          | Description                                    |
| :---------------- | :------------ | :--------------------------------------------- |
| `id`              | `uuid`        | Primary Key                                    |
| `user_id`         | `uuid`        | Foreign Key tới `auth.users`.                  |
| `name`            | `text`        | Tên thực phẩm.                                 |
| `quantity`        | `numeric`     | Số lượng.                                      |
| `unit`            | `text`        | Đơn vị tính (ví dụ: 'kg', 'gram', 'cái', ...). |
| `expiration_date` | `date`        | Hạn sử dụng. Nullable.                         |
| `category`        | `text`        | Danh mục (ví dụ: 'Rau củ', 'Thịt', ...).       |
| `image_url`       | `text`        | URL hình ảnh thực phẩm (từ Storage). Nullable. |
| `created_at`      | `timestamptz` | Thời gian tạo. Default: `now()`                |

## Storage Buckets

### `food-images`

Lưu trữ hình ảnh của thực phẩm.

- **Public**: Có thể (để hiển thị ảnh).
- **Path**: `{user_id}/{uuid}.jpg`