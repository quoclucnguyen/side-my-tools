# Tài liệu dự án Side My Tools

Chào mừng bạn đến với tài liệu chi tiết của dự án **Side My Tools** - ứng dụng quản lý thực phẩm cá nhân.

## 📚 Cấu trúc tài liệu

### 📋 Software Requirements Specification (SRS)
Tài liệu đặc tả yêu cầu phần mềm theo chuẩn IEEE 830:

- **[Giới thiệu](srs/introduction.md)** - Mục đích, phạm vi, định nghĩa
- **[Mô tả tổng quan](srs/overall-description.md)** - Quan điểm sản phẩm, chức năng, đặc điểm người dùng
- **[Yêu cầu chức năng](srs/functional-requirements.md)** - Chi tiết các tính năng cần triển khai
- **[Yêu cầu phi chức năng](srs/non-functional-requirements.md)** - Hiệu suất, bảo mật, khả năng sử dụng
- **[Yêu cầu giao diện](srs/interface-requirements.md)** - UI/UX design specifications
- **[Phụ lục](srs/appendices.md)** - Thuật ngữ, database schema, use cases

### 🎨 Wireframes & Design
Thiết kế giao diện và mockups:

- **[Tổng quan](./wireframes/overview.md)** - Layout tổng thể và design principles
- **[Các trang](./wireframes/screens.md)** - Wireframes chi tiết cho từng screen
- **[Components](./wireframes/components.md)** - Thư viện components và patterns

## 🎯 Tổng quan dự án

**Side My Tools** là ứng dụng web responsive được thiết kế theo mô hình mobile-first, giúp người dùng quản lý thực phẩm gia đình một cách hiệu quả.

### Tính năng chính
- ✅ **Xác thực người dùng** - Đăng ký, đăng nhập với Supabase Auth
- ✅ **Quản lý kho thực phẩm** - Theo dõi số lượng, hạn sử dụng
- ✅ **Cấu hình AI** - Tích hợp Google Gemini AI
- ✅ **Giao diện trực quan** - Responsive design với bottom navigation
- ✅ **Sắp xếp thông minh** - Tự động sắp xếp theo hạn sử dụng

### Tech Stack
- **Frontend:** React 19 + TypeScript 5.9 + Vite 7
- **Backend:** Supabase (Database + Auth)
- **Styling:** Tailwind CSS 4.1 + shadcn/ui
- **Icons:** Lucide React
- **Language:** Tiếng Việt

## 🚀 Cách sử dụng

### Chạy documentation locally
```bash
cd docs
yarn install
yarn start
```

### Build documentation
```bash
cd docs
yarn build
```

### Deploy
```bash
cd docs
yarn deploy
```

## 📱 Responsive Design

Ứng dụng được tối ưu hóa cho:
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px+

## 🎨 Design System

### Color Palette
- **Primary:** #007AFF (Blue)
- **Success:** #34C759 (Green)
- **Warning:** #FF9500 (Orange)
- **Danger:** #FF3B30 (Red)

### Typography
- **Headings:** 32px, 24px, 20px
- **Body:** 16px
- **Caption:** 14px, 12px

## 🔐 Security

- JWT tokens với expiration
- Row Level Security trong Supabase
- Input validation và sanitization
- HTTPS cho tất cả communications
- API keys được mã hóa

## 📊 Performance

- Lighthouse Score ≥ 90
- First Contentful Paint ≤ 2s
- Bundle size < 500KB
- Smooth 60fps animations

## 🤝 Contributing

Để đóng góp cho dự án:
1. Đọc kỹ tài liệu SRS
2. Tham khảo wireframes trước khi implement
3. Tuân thủ coding standards
4. Viết tests cho features mới
5. Update documentation khi cần

## 📞 Support

Nếu có câu hỏi về documentation:
- Tạo issue trong repository
- Tham khảo memory-bank files
- Liên hệ development team

---

**Version:** 1.0.0
**Last Updated:** 13/10/2025
**Authors:** Business Analyst Team
