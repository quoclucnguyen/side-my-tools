# Phụ lục

## Thuật ngữ chuyên ngành

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| **Food Item** | Mặt hàng thực phẩm với thông tin số lượng, hạn sử dụng, danh mục |
| **Category** | Phân loại thực phẩm (rau, củ, quả, thịt, cá, sữa, đồ uống, v.v.) |
| **Expiration Date** | Ngày hết hạn của thực phẩm, sau ngày này thực phẩm không an toàn sử dụng |
| **Unit** | Đơn vị đo lường (kg, gram, cái, hộp, lít, v.v.) |
| **API Key** | Khóa xác thực cho Google Gemini AI API |
| **Supabase** | Backend-as-a-Service platform cung cấp database và authentication |
| **PWA** | Progressive Web App - ứng dụng web có thể cài đặt và hoạt động offline |
| **Mobile-first** | Phương pháp thiết kế ưu tiên trải nghiệm di động trước |
| **Row Level Security** | Cơ chế bảo mật cấp hàng trong database |
| **JWT Token** | JSON Web Token - phương thức xác thực dựa trên token |

## Sơ đồ cơ sở dữ liệu

### Bảng: food_items

**Mô tả:** Lưu trữ thông tin các mặt hàng thực phẩm của người dùng

**Cấu trúc:**

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của thực phẩm |
| `user_id` | UUID | FK → auth.users(id), ON DELETE CASCADE | ID người dùng sở hữu |
| `name` | TEXT | NOT NULL | Tên thực phẩm |
| `quantity` | NUMERIC | NOT NULL | Số lượng |
| `unit` | TEXT | NOT NULL | Đơn vị đo lường |
| `expiration_date` | DATE | NOT NULL | Ngày hết hạn |
| `category` | TEXT | NOT NULL | Danh mục thực phẩm |
| `image_url` | TEXT | NULL | URL hình ảnh (tùy chọn) |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Thời gian tạo |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Thời gian cập nhật |

**Index:**
- `idx_food_items_expiration` ON (expiration_date)
- `idx_food_items_user_id` ON (user_id)

### Bảng: user_settings

**Mô tả:** Lưu trữ cấu hình và tùy chọn của người dùng

**Cấu trúc:**

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|----------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất |
| `user_id` | UUID | FK → auth.users(id), UNIQUE, ON DELETE CASCADE | ID người dùng |
| `preferences` | JSONB | DEFAULT '{}' | Cấu hình tùy chỉnh dạng JSON |
| `gemini_api_key` | TEXT | NULL | API key cho Google Gemini AI |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Thời gian tạo |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Thời gian cập nhật |

**Index:**
- `idx_user_settings_user_id` ON (user_id)

## Business Rules

### BR-001: Quản lý hạn sử dụng
- Thực phẩm hết hạn (expiration_date < today) → Hiển thị màu đỏ
- Thực phẩm sắp hết hạn (expiration_date ≤ today + 3 ngày) → Hiển thị màu cam và icon cảnh báo
- Thực phẩm còn hạn sử dụng > 3 ngày → Hiển thị màu xanh lá

### BR-002: Validation API Key
- API key phải bắt đầu bằng "AIza"
- API key phải có độ dài hợp lệ (> 20 ký tự)
- API key được mã hóa trước khi lưu vào database

### BR-003: Authentication
- Mật khẩu tối thiểu 8 ký tự
- Email phải có định dạng hợp lệ
- Session timeout sau 24 giờ không hoạt động

### BR-004: Data Integrity
- Quantity phải > 0
- Expiration date phải ≥ today
- Category phải từ danh sách cho phép

### BR-005: Form Validation (Add Item)
- Tên thực phẩm: Bắt buộc, 2-100 ký tự
- Số lượng: Bắt buộc, > 0, tối đa 2 decimal places
- Đơn vị: Bắt buộc, từ danh sách predefined
- Hạn sử dụng: Bắt buộc, định dạng DD/MM/YYYY
- Danh mục: Bắt buộc, từ danh sách predefined

### BR-006: Categories hỗ trợ
- Rau củ, Trái cây, Thịt, Cá, Sữa
- Đồ uống, Đồ khô, Gia vị, Khác

### BR-007: Units hỗ trợ
- kg, gram, g, lít, ml, cái, hộp, gói, túi

## Use Cases chi tiết

### UC-001: Đăng nhập hệ thống

**Actor:** Người dùng

**Preconditions:**
- Người dùng có tài khoản hợp lệ
- Trình duyệt hỗ trợ JavaScript

**Main Flow:**
1. Người dùng truy cập trang đăng nhập
2. Nhập email và mật khẩu
3. Click nút "Đăng nhập"
4. Hệ thống validate thông tin
5. Hệ thống xác thực với Supabase Auth
6. Redirect đến trang tổng quan
7. Hiển thị thông tin người dùng

**Alternative Flow:**
- A1: Thông tin không hợp lệ
  - Hiển thị lỗi "Email hoặc mật khẩu không đúng"
  - Cho phép thử lại

### UC-002: Quản lý thực phẩm

**Actor:** Người dùng đã đăng nhập

**Preconditions:**
- Người dùng đã đăng nhập thành công
- Có kết nối internet

**Main Flow:**
1. Người dùng truy cập trang "Kho thực phẩm"
2. Hệ thống load danh sách thực phẩm từ database
3. Hiển thị danh sách sắp xếp theo hạn sử dụng
4. Người dùng xem thông tin chi tiết
5. Người dùng có thể tìm kiếm/lọc theo danh mục

**Alternative Flow:**
- A1: Database rỗng
  - Hiển thị fallback data mẫu
  - Hiển thị thông báo hướng dẫn

### UC-004: Tạo thực phẩm mới

**Actor:** Người dùng đã đăng nhập

**Preconditions:**
- Người dùng đã đăng nhập thành công
- Truy cập từ trang "Kho thực phẩm"

**Main Flow:**
1. Người dùng click nút "Thêm mới" hoặc "➕"
2. Hệ thống hiển thị form tạo mới
3. Người dùng nhập thông tin:
   - Tên thực phẩm (bắt buộc)
   - Số lượng (bắt buộc, > 0)
   - Đơn vị (bắt buộc)
   - Hạn sử dụng (bắt buộc, ≥ hôm nay)
   - Danh mục (bắt buộc)
4. Người dùng click "Lưu"
5. Hệ thống validate dữ liệu
6. Lưu vào database
7. Hiển thị thông báo thành công
8. Refresh danh sách và hiển thị item mới
9. Đóng form tạo mới

**Alternative Flow:**
- A1: Dữ liệu không hợp lệ
  - Hiển thị lỗi cụ thể cho từng trường
  - Focus vào trường có lỗi đầu tiên
  - Không cho phép lưu

- A2: Lỗi kết nối database
  - Hiển thị thông báo lỗi
  - Cho phép thử lại
  - Giữ dữ liệu đã nhập

### UC-003: Cấu hình AI

**Actor:** Người dùng đã đăng nhập

**Preconditions:**
- Người dùng đã đăng nhập
- Có Google Gemini API key

**Main Flow:**
1. Người dùng truy cập trang "Cài đặt"
2. Nhập API key vào form
3. Click nút "Lưu API Key"
4. Hệ thống validate và lưu API key
5. Chọn model AI ưa thích
6. Lưu cấu hình model

## Performance Metrics

### Core Web Vitals
- **LCP (Largest Contentful Paint):** ≤ 2.5 giây
- **FID (First Input Delay):** ≤ 100 ms
- **CLS (Cumulative Layout Shift):** ≤ 0.1

### Application Metrics
- **Page Load Time:** ≤ 2 giây trên 3G
- **API Response Time:** ≤ 1 giây
- **Bundle Size:** < 500KB gzipped
- **Lighthouse Score:** ≥ 90

## Security Considerations

### Authentication Security
- JWT tokens với expiration time
- Secure cookie settings
- Rate limiting cho login attempts
- Password complexity requirements

### Data Security
- API keys được mã hóa trong database
- Row Level Security trong Supabase
- Input sanitization
- HTTPS cho tất cả communications

### Privacy
- User data chỉ hiển thị cho chủ sở hữu
- No tracking without consent
- Data anonymization khi có thể

## Future Enhancements

### Phase 2 Features
- **CRUD Operations:** Thêm/sửa/xóa thực phẩm
- **Notifications:** Nhắc nhở hạn sử dụng
- **Reports:** Xuất báo cáo thống kê
- **Offline Mode:** Hoạt động khi mất mạng

### Phase 3 Features
- **AI Integration:** Gợi ý món ăn từ thực phẩm có sẵn
- **Barcode Scanner:** Quét mã vạch để thêm thực phẩm
- **Social Features:** Chia sẻ danh sách mua sắm
- **Multi-language:** Hỗ trợ nhiều ngôn ngữ

## Maintenance & Support

### Monitoring
- Error tracking với logging
- Performance monitoring
- User analytics (tùy chọn)
- Database performance metrics

### Backup & Recovery
- Daily database backups
- Point-in-time recovery
- Disaster recovery plan
- Data retention policy

## References

### Standards
- IEEE 830-1998: IEEE Recommended Practice for Software Requirements Specifications
- WCAG 2.1: Web Content Accessibility Guidelines
- ISO 27001: Information Security Management

### Technical Documentation
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide Icons Documentation](https://lucide.dev/)
- [Google Gemini AI Documentation](https://ai.google.dev/)

### Design Guidelines
- [Material Design 3](https://m3.material.io/)
- [Apple HIG](https://developer.apple.com/design/)
- [Google Material Design](https://material.io/design)

---

**Kết thúc phụ lục**

Phụ lục này cung cấp thông tin bổ sung và chi tiết kỹ thuật để hỗ trợ việc hiểu và triển khai hệ thống.