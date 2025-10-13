# Yêu cầu giao diện

## REQ-UI-001: Layout chính

**Mô tả:** Hệ thống phải có layout nhất quán và responsive trên tất cả các thiết bị.

**Cấu trúc layout:**
```
┌─────────────────────────────────────┐
│ ┌──────────┐ ┌─────┐                │ ← Status bar
│ │  [Back]  │ │Title│ ┌─────────┐    │
│ └──────────┘ └─────┘ │ [User]  │    │ ← Header (sticky)
│                     │ [Menu]  │    │
├─────────────────────────────────────┤
│                                     │
│         Main Content Area           │ ← Nội dung chính
│         (scrollable)               │
│                                     │
├─────────────────────────────────────┤
│  [Tab1]    [Tab2]    [Tab3]         │ ← Bottom navigation
│  Tổng     Kho TP    Cài đặt        │
└─────────────────────────────────────┘
```

**Responsive breakpoints:**
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px+

## REQ-UI-002: Navigation

**Mô tả:** Hệ thống phải có navigation trực quan và dễ sử dụng.

**Bottom Navigation:**
- 3 tab chính: Tổng quan, Kho thực phẩm, Cài đặt
- Active state với màu primary
- Icons từ Lucide React
- Text labels bằng tiếng Việt
- Touch-friendly (min 44px height)

**Header:**
- Sticky positioning
- Context-aware title
- User menu dropdown
- Back button khi cần thiết

## REQ-UI-003: Components

### Food Item Card
**Layout:**
```
┌─────────────────────────────────────┐
│ ┌───┐ ┌───────────────────────────┐ │
│ │ 📷 │ │ Tên thực phẩm             │ │
│ │     │ │ Số lượng: 1 kg           │ │
│ │     │ │ Hạn sử dụng: 2024-12-31  │ │
│ │     │ │ Danh mục: Rau củ         │ │
│ └─────┘ └───────────────────────────┘ │
└─────────────────────────────────────┘
```

**Trạng thái hiển thị:**
- **Bình thường:** Màu xanh lá, icon thông thường
- **Sắp hết hạn (≤3 ngày):** Màu cam, icon cảnh báo ⚠️
- **Đã hết hạn:** Màu đỏ, icon cảnh báo mạnh 🚫

### Forms
**Login Form:**
- Email input với validation
- Password input với show/hide toggle
- Remember me checkbox (tương lai)
- Social login buttons (tương lai)

**Settings Form:**
- API key input với validation
- Model selection dropdown
- Save/Cancel buttons
- Loading states

**Add Item Form:**
- Tên thực phẩm input với validation
- Số lượng number input với decimal support
- Đơn vị selection dropdown
- Hạn sử dụng date picker
- Danh mục selection dropdown
- Hình ảnh upload (tương lai)
- Save/Cancel buttons với loading states

## REQ-UI-004: Typography

**Font Hierarchy:**
- **H1:** 32px (2xl) - Tiêu đề trang
- **H2:** 24px (xl) - Tiêu đề card/section
- **H3:** 20px (lg) - Tiêu đề phụ
- **Body:** 16px (base) - Nội dung chính
- **Caption:** 14px (sm) - Nhãn phụ
- **Small:** 12px (xs) - Thông tin chi tiết

**Font Weight:**
- **Bold (700):** Tiêu đề quan trọng
- **Semi-bold (600):** Tiêu đề phụ
- **Regular (400):** Nội dung chính
- **Light (300):** Ghi chú

## REQ-UI-005: Color System

**Primary Colors:**
- **Primary:** `#007AFF` (Blue) - Actions, links, active states
- **Secondary:** `#5856D6` (Purple) - Secondary actions
- **Success:** `#34C759` (Green) - Success states, valid inputs
- **Warning:** `#FF9500` (Orange) - Warnings, sắp hết hạn
- **Danger:** `#FF3B30` (Red) - Errors, hết hạn

**Neutral Colors:**
- **Background:** `#FFFFFF` (White) - Main background
- **Surface:** `#F2F2F7` (Light Gray) - Cards, surfaces
- **Border:** `#C6C6C8` (Gray) - Borders, dividers
- **Text:** `#000000` (Black) - Primary text
- **Text Secondary:** `#8E8E93` (Dark Gray) - Secondary text

## REQ-UI-006: Spacing & Layout

**Spacing Scale:**
- **XS:** 4px - Small gaps
- **SM:** 8px - Component spacing
- **MD:** 16px - Section spacing
- **LG:** 24px - Large sections
- **XL:** 32px - Page margins
- **2XL:** 48px - Major sections

**Component Spacing:**
- Cards: 16px margin, 16px padding
- Buttons: 12px padding, 8px margin
- Form inputs: 12px padding, 16px margin-bottom
- Navigation items: 8px padding

## REQ-UI-007: Interactive Elements

**Buttons:**
- Primary: Filled, primary color
- Secondary: Outlined, neutral color
- Ghost: Text only, no background
- Disabled: Reduced opacity, no interaction

**Form Controls:**
- Text inputs: 44px min height
- Dropdowns: Clear selection indicator
- Checkboxes: 20px size
- Radio buttons: 20px size

**Feedback:**
- Loading spinners cho async actions
- Success/error alerts
- Progress indicators
- Skeleton loading cho content

## REQ-UI-008: Responsive Design

**Mobile (≤768px):**
- Single column layout
- Bottom navigation
- Touch-optimized interactions
- Thumb-friendly navigation

**Tablet (768px-1024px):**
- Two-column layout khi có thể
- Side navigation hoặc bottom
- Larger touch targets
- Better use of screen space

**Desktop (≥1024px):**
- Three-column layout
- Side navigation
- Mouse-optimized interactions
- Full feature set

## REQ-UI-009: Accessibility

**WCAG 2.1 AA Compliance:**
- Color contrast ratio ≥ 4.5:1
- Focus indicators visible
- Keyboard navigation support
- Screen reader compatibility
- Alt text cho images
- Semantic HTML structure

**Accessibility Features:**
- Skip links
- ARIA labels
- Keyboard shortcuts
- High contrast mode (tương lai)
- Font size adjustment (tương lai)