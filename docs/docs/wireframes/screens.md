# Wireframes các trang

## Trang đăng nhập (Login Screen)

```
┌─────────────────────────────────────┐
│           Side My Tools             │ ← App title
│       Ứng dụng quản lý thực phẩm    │
├─────────────────────────────────────┤
│                                     │
│ Email:                              │
│ ┌─────────────────────────────────┐ │
│ │ user@example.com                │ │ ← Email input
│ └─────────────────────────────────┘ │
│                                     │
│ Mật khẩu:                           │
│ ┌─────────────────────────────────┐ │
│ │ •••••••••••••••                │ │ ← Password input
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────┐ ┌─────────────────┐ │
│ │  Đăng nhập  │ │  Quên mật khẩu?  │ │ ← Buttons
│ └─────────────┘ └─────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Chưa có tài khoản? Đăng ký ngay │ │ ← Sign up link
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Elements:**
- App branding với tên và slogan
- Email input với placeholder
- Password input với hide/show toggle
- Primary action button
- Secondary link cho forgot password
- Tertiary link cho sign up

## Trang tổng quan (Dashboard)

```
┌─────────────────────────────────────┐
│           Tổng quan              [≡] │ ← Header
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    📊 Thống kê tổng quan        │ │
│ │                                 │ │
│ │ Sản phẩm hết hạn: 3             │ │
│ │ Sắp hết hạn (≤3 ngày): 7       │ │
│ │ Còn lại: 25                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    🔍 Tìm kiếm nhanh           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    📅 Sắp hết hạn              │ │
│ │                                 │ │
│ │ • Sữa tươi - Hết hạn: 2024-12-15│ │
│ │ • Thịt gà - Hết hạn: 2024-12-16 │ │
│ │ • Cá hồi - Hết hạn: 2024-12-17  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Layout:**
- Sticky header với title và menu
- Stats cards với overview metrics
- Search bar cho quick access
- Upcoming expirations list
- Action buttons cho common tasks

## Trang kho thực phẩm (Inventory)

```
┌─────────────────────────────────────┐
│        Kho thực phẩm            [≡] │ ← Header
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    🔍 Tìm kiếm thực phẩm       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  🥛 Sữa tươi                   │ │ ← Food item card
│ │  Số lượng: 2 lít               │ │
│ │  Hạn sử dụng: 2024-12-15       │ │
│ │  ⚠️  Sắp hết hạn               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  🍗 Thịt gà                    │ │
│ │  Số lượng: 1 kg                │ │
│ │  Hạn sử dụng: 2024-12-20       │ │
│ │  Danh mục: Thịt                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  🥕 Cà rốt                     │ │
│ │  Số lượng: 500g                │ │
│ │  Hạn sử dụng: 2024-12-25       │ │
│ │  Danh mục: Rau củ              │ │
│ └─────────────────────────────────┘ │
│                                     │
│           Tải thêm...               │ ← Load more button
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Search functionality
- Sort by expiration date
- Category filtering
- Infinite scroll với load more
- Status indicators (expired/warning/normal)

## Trang cài đặt (Settings)

```
┌─────────────────────────────────────┐
│            Cài đặt              [≡] │ ← Header
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  🔑 Cấu hình Gemini AI         │ │
│ │                                 │ │
│ │ API Key:                        │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ AIzaSyB...                  │ │ │ ← API key input
│ │ └─────────────────────────────┘ │ │
│ │ ┌─────┐ ┌─────┐                 │ │
│ │ │Hiện │ │Lưu  │                 │ │ ← Show/Hide & Save
│ │ └─────┘ └─────┘                 │ │
│ │                                 │ │
│ │ Model:                          │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ gemini-2.5-flash            │ │ │ ← Model selector
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  🎨 Giao diện                  │ │
│ │  Chế độ sáng/tối                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  🔔 Thông báo                  │ │
│ │  Nhắc nhở hết hạn               │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Sections:**
- Gemini AI configuration
- Appearance settings (dark/light mode)
- Notification preferences
- Account management
- Data export/import options

## Trang thêm thực phẩm mới (Add Item)

```
┌─────────────────────────────────────┐
│      Thêm thực phẩm mới        [✕] │ ← Header với close button
├─────────────────────────────────────┤
│                                     │
│ Tên thực phẩm:                      │
│ ┌─────────────────────────────────┐ │
│ │ Nhập tên thực phẩm...           │ │ ← Required field
│ └─────────────────────────────────┘ │
│                                     │
│ Số lượng:                           │
│ ┌─────────────────────────────────┐ │
│ │ 1.5                             │ │ ← Number input
│ └─────────────────────────────────┘ │
│                                     │
│ Đơn vị:                              │
│ ┌─────────────┐                  │
│ │     kg      ▼│                  │ ← Dropdown
│ └─────────────┘                  │
│                                     │
│ Hạn sử dụng:                        │
│ ┌─────────────┐                  │
│ │ 2024-12-31  │                  │ ← Date picker
│ └─────────────┘                  │
│                                     │
│ Danh mục:                           │
│ ┌─────────────┐                  │
│ │   Rau củ    ▼│                  │ ← Dropdown
│ └─────────────┘                  │
│                                     │
│ ┌─────────────┐ ┌─────────────────┐ │
│ │    Hủy      │ │     Thêm mới    │ │ ← Action buttons
│ └─────────────┘ └─────────────────┘ │
└─────────────────────────────────────┘
```

**Form Fields:**
- **Tên thực phẩm:** Text input, required, 2-100 ký tự
- **Số lượng:** Number input với decimal support, required, > 0
- **Đơn vị:** Dropdown với predefined units (kg, gram, cái, v.v.)
- **Hạn sử dụng:** Date picker với min date = today
- **Danh mục:** Dropdown với predefined categories

**Validation States:**
- **Valid:** Green border, success icon
- **Invalid:** Red border, error message
- **Required:** Asterisk (*) indicator

**Categories Dropdown:**
- Rau củ, Trái cây, Thịt, Cá
- Sữa, Đồ uống, Đồ khô, Gia vị, Khác

**Units Dropdown:**
- kg, gram, g, lít, ml
- cái, hộp, gói, túi, thanh