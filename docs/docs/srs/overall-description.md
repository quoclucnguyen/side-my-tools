# Mô tả tổng quan

## Quan điểm sản phẩm

**Side My Tools** là ứng dụng quản lý thực phẩm cá nhân được xây dựng như một PWA (Progressive Web App) với thiết kế mobile-first. Ứng dụng cho phép người dùng:

1. **Quản lý thực phẩm**: Theo dõi số lượng, hạn sử dụng, danh mục
2. **Xác thực an toàn**: Đăng ký/đăng nhập với Supabase Auth
3. **Cấu hình AI**: Tích hợp Google Gemini AI cho tính năng thông minh
4. **Giao diện trực quan**: Responsive design với bottom navigation

**Vị trí của sản phẩm:**
- **Người dùng cuối**: Cá nhân có nhu cầu quản lý thực phẩm gia đình
- **Công nghệ**: React 19 + TypeScript + Supabase + Tailwind CSS
- **Nền tảng**: Web (mobile-first, responsive)
- **Tương tác**: Single-page application với routing

## Chức năng sản phẩm

### 2.2.1 Quản lý xác thực
- Đăng ký tài khoản mới
- Đăng nhập với email/mật khẩu
- Đăng xuất an toàn
- Khôi phục mật khẩu (tương lai)

### 2.2.2 Quản lý thực phẩm
- Hiển thị danh sách thực phẩm với phân trang
- **Thêm thực phẩm mới** với form validation
- **Chỉnh sửa thông tin thực phẩm** với optimistic updates
- **Xóa thực phẩm** với confirmation dialog
- Sắp xếp theo hạn sử dụng
- Lọc theo danh mục

### 2.2.3 Cài đặt và cấu hình
- Quản lý API key cho Google Gemini AI
- Chọn model AI ưa thích
- Cấu hình giao diện (sáng/tối - tương lai)
- **Cài đặt thông báo** hết hạn thực phẩm

### 2.2.4 Giao diện người dùng
- Navigation với bottom tab bar
- Sticky header với tiêu đề ngữ cảnh
- Responsive layout cho mobile/desktop
- Loading states và error handling

## Đặc điểm người dùng

**Người dùng mục tiêu:**
1. **Người nội trợ**: Quản lý thực phẩm gia đình
2. **Người độc thân**: Theo dõi thực phẩm cá nhân
3. **Người bận rộn**: Cần nhắc nhở hạn sử dụng
4. **Người quan tâm sức khỏe**: Theo dõi chất lượng thực phẩm

**Đặc điểm:**
- Độ tuổi: 18-65
- Trình độ công nghệ: Cơ bản đến trung bình
- Thiết bị: Smartphone, tablet, desktop
- Mục tiêu: Tiết kiệm thời gian, giảm lãng phí thực phẩm

## Ràng buộc

### Ràng buộc công nghệ
- Phải sử dụng React 19 và TypeScript
- Tương thích với Vite 7 build tool
- Sử dụng Supabase cho backend
- Mobile-first responsive design
- Tuân thủ cấu trúc project có sẵn

### Ràng buộc kinh doanh
- Dữ liệu người dùng được lưu trữ an toàn
- Tuân thủ các quy định về bảo mật thông tin
- Hỗ trợ tiếng Việt
- Giao diện đơn giản, dễ sử dụng

## Giả định và phụ thuộc

### Giả định
- Người dùng có kết nối internet ổn định
- Trình duyệt hỗ trợ ES2023+ features
- Màn hình có độ phân giải tối thiểu 360px
- JavaScript được bật trong trình duyệt

### Phụ thuộc
- Supabase service hoạt động ổn định
- Google Gemini API khả dụng
- Network connection cho real-time features
- Browser compatibility với React 19