# Yêu cầu chức năng

## REQ-001: Hệ thống xác thực

**Mô tả:** Hệ thống phải cho phép người dùng đăng ký, đăng nhập và quản lý phiên đăng nhập một cách an toàn.

**Yêu cầu chi tiết:**
- Hệ thống phải cho phép người dùng đăng ký tài khoản mới với email và mật khẩu
- Hệ thống phải xác thực thông tin đăng nhập (email/mật khẩu)
- Hệ thống phải duy trì phiên đăng nhập an toàn
- Hệ thống phải cho phép đăng xuất và xóa phiên đăng nhập
- Hệ thống phải validate định dạng email hợp lệ
- Hệ thống phải yêu cầu mật khẩu tối thiểu 8 ký tự

**Use Case: Đăng nhập**
1. Người dùng nhập email và mật khẩu
2. Hệ thống validate thông tin
3. Hệ thống xác thực với Supabase Auth
4. Redirect đến dashboard nếu thành công
5. Hiển thị lỗi nếu thông tin không đúng

**Use Case: Đăng ký**
1. Người dùng nhập email và mật khẩu
2. Hệ thống validate thông tin
3. Hệ thống tạo tài khoản mới
4. Gửi email xác thực (nếu cần)
5. Redirect đến đăng nhập

## REQ-002: Quản lý thực phẩm

**Mô tả:** Hệ thống phải cho phép người dùng quản lý kho thực phẩm với các thao tác CRUD cơ bản.

**Yêu cầu chi tiết:**
- Hiển thị danh sách thực phẩm với phân trang (8 items/trang)
- Sắp xếp thực phẩm theo hạn sử dụng (tăng dần)
- Hiển thị thông tin chi tiết: tên, số lượng, đơn vị, hạn sử dụng, danh mục
- Hỗ trợ tìm kiếm theo tên thực phẩm
- Lọc theo danh mục và trạng thái hết hạn
- Highlight thực phẩm sắp hết hạn (≤3 ngày)
- Hiển thị trạng thái hết hạn với màu đỏ
- Quick actions: chỉnh sửa, xóa từ item card
- Bulk operations: xóa nhiều items cùng lúc (tương lai)

**Use Case: Xem kho thực phẩm**
1. Hệ thống load danh sách từ database
2. Sắp xếp theo hạn sử dụng
3. Hiển thị với infinite scroll
4. Fallback data khi database rỗng
5. Load thêm khi scroll xuống cuối

**Use Case: Tìm kiếm thực phẩm**
1. Người dùng nhập từ khóa vào search box
2. Hệ thống filter real-time theo tên
3. Hiển thị kết quả phù hợp
4. Highlight kết quả tìm kiếm
5. Clear search để về danh sách đầy đủ

**Use Case: Lọc theo danh mục**
1. Người dùng chọn danh mục từ dropdown
2. Hệ thống filter theo category
3. Hiển thị chỉ items thuộc category được chọn
4. Hiển thị số lượng items trong mỗi category
5. Cho phép multiple selection (tương lai)

## REQ-003: Cấu hình AI

**Mô tả:** Hệ thống phải cho phép cấu hình Google Gemini AI để sử dụng các tính năng thông minh.

**Yêu cầu chi tiết:**
- Cho phép cấu hình Google Gemini API key
- Validate định dạng API key (bắt đầu bằng "AIza")
- Lưu trữ API key an toàn trong database
- Cho phép chọn model AI ưa thích
- Hiển thị danh sách models khả dụng
- Cập nhật cấu hình real-time

**Use Case: Cấu hình API Key**
1. Người dùng nhập API key
2. Hệ thống validate format
3. Lưu vào user_settings table
4. Hiển thị trạng thái thành công
5. Enable model selection

## REQ-004: Giao diện người dùng

**Mô tả:** Hệ thống phải cung cấp giao diện trực quan, responsive và dễ sử dụng.

**Yêu cầu chi tiết:**
- Navigation với bottom tab bar cố định
- Sticky header với tiêu đề ngữ cảnh
- Responsive layout cho mobile/desktop
- Loading states cho tất cả async operations
- Error handling với thông báo rõ ràng
- Touch-friendly buttons (min 44px)

**Use Case: Navigation**
1. Bottom tab bar với 3 tab chính
2. Active state indicators
3. Semantic icons (Lucide)
4. Accessibility support
5. Smooth transitions

## REQ-005: Tạo mới thực phẩm

**Mô tả:** Hệ thống phải cho phép người dùng tạo mới các mặt hàng thực phẩm với đầy đủ thông tin.

**Yêu cầu chi tiết:**
- Form tạo mới với các trường: tên, số lượng, đơn vị, hạn sử dụng, danh mục
- Validation cho tất cả các trường bắt buộc
- Dropdown selection cho danh mục và đơn vị
- Date picker cho hạn sử dụng
- Nút "Dùng AI" (khi đã cấu hình API key) cho phép mô tả bằng ngôn ngữ tự nhiên
- Tự động điền các trường dựa trên đề xuất AI và cho phép chỉnh sửa trước khi lưu
- Tùy chọn thêm hình ảnh (tương lai)
- Auto-save draft (tương lai)

**Use Case: Tạo thực phẩm mới**
1. Người dùng click nút "Thêm mới" từ trang inventory
2. Hệ thống hiển thị form tạo mới
3. Người dùng nhập thủ công hoặc nhấn "Dùng AI" để mô tả thông tin thực phẩm
4. Nếu dùng AI, hệ thống gửi mô tả đến Gemini và điền sẵn các trường
5. Người dùng rà soát và chỉnh sửa thông tin
6. Hệ thống validate dữ liệu
7. Lưu vào database
8. Refresh danh sách và hiển thị item mới

**Validation Rules:**
- Tên thực phẩm: Bắt buộc, tối thiểu 2 ký tự
- Số lượng: Bắt buộc, phải > 0, tối đa 2 decimal places
- Đơn vị: Bắt buộc, từ danh sách cho phép
- Hạn sử dụng: Bắt buộc, phải ≥ ngày hiện tại
- Danh mục: Bắt buộc, từ danh sách cho phép
- Dữ liệu được AI gợi ý vẫn phải tuân thủ các quy tắc trên

**Categories hỗ trợ:**
- Rau củ, Trái cây, Thịt, Cá, Sữa, Đồ uống, Đồ khô, Khác

**Units hỗ trợ:**
- kg, gram, g, lít, ml, cái, hộp, gói, túi

## REQ-006: Chỉnh sửa thực phẩm

**Mô tả:** Hệ thống phải cho phép người dùng chỉnh sửa thông tin thực phẩm đã có.

**Yêu cầu chi tiết:**
- Form chỉnh sửa với dữ liệu hiện tại được preload
- Cập nhật tất cả các trường: tên, số lượng, đơn vị, hạn sử dụng, danh mục
- Validation giống như form tạo mới
- Optimistic updates để UX mượt mà
- Undo functionality (tương lai)

**Use Case: Chỉnh sửa thực phẩm**
1. Người dùng click nút "Sửa" từ item card
2. Hệ thống hiển thị form với dữ liệu hiện tại
3. Người dùng chỉnh sửa thông tin
4. Hệ thống validate dữ liệu
5. Lưu thay đổi vào database
6. Cập nhật item trong danh sách
7. Hiển thị thông báo thành công

## REQ-007: Xóa thực phẩm

**Mô tả:** Hệ thống phải cho phép người dùng xóa thực phẩm khỏi kho.

**Yêu cầu chi tiết:**
- Xóa đơn lẻ từ item card
- Bulk delete nhiều items (tương lai)
- Confirmation dialog trước khi xóa
- Soft delete để khôi phục (tương lai)
- Undo functionality (tương lai)

**Use Case: Xóa thực phẩm**
1. Người dùng click nút "Xóa" từ item card
2. Hệ thống hiển thị confirmation dialog
3. Người dùng xác nhận xóa
4. Hệ thống xóa khỏi database
5. Remove item khỏi danh sách
6. Hiển thị thông báo đã xóa

## REQ-008: Tìm kiếm và lọc

**Mô tả:** Hệ thống phải cung cấp khả năng tìm kiếm và lọc thực phẩm hiệu quả.

**Yêu cầu chi tiết:**
- Tìm kiếm real-time theo tên thực phẩm
- Lọc theo danh mục
- Lọc theo trạng thái (còn hạn, sắp hết hạn, hết hạn)
- Lọc theo khoảng thời gian hết hạn
- Clear filters để về trạng thái ban đầu
- Persistent filters trong session

**Use Case: Tìm kiếm nâng cao**
1. Người dùng nhập từ khóa tìm kiếm
2. Hệ thống filter real-time
3. Hiển thị kết quả phù hợp
4. Highlight từ khóa trong kết quả
5. Cho phép combine với filters khác

## REQ-009: Hệ thống thông báo

**Mô tả:** Hệ thống phải thông báo cho người dùng về các sự kiện quan trọng.

**Yêu cầu chi tiết:**
- Thông báo thực phẩm sắp hết hạn
- Thông báo thực phẩm đã hết hạn
- Reminder trước 1 ngày, 3 ngày, 7 ngày
- Cấu hình tần suất thông báo
- Multiple notification channels (tương lai)

**Use Case: Nhắc nhở hết hạn**
1. Hệ thống check daily thực phẩm hết hạn
2. Gửi thông báo cho user
3. Hiển thị trong app notification center
4. Mark as read khi user xem
5. Snooze functionality (tương lai)
