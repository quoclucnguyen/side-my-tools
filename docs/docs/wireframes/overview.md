# Tổng quan Wireframes

## Layout tổng thể

### Mobile Layout (375px width)

```
┌─────────────────────────────────────┐
│ ┌──────────┐ ┌─────┐                │ ← Status bar
│ │  [Back]  │ │Title│ ┌─────────┐    │
│ └──────────┘ └─────┘ │ [User]  │    │ ← Header (sticky)
│                     │ [Menu]  │    │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        Nội dung chính           │ │ ← Main content
│ │      (scrollable)              │ │
│ │                                 │ │
│ │ ┌───┐ ┌───┐ ┌───┐               │ │
│ │ │ A │ │ B │ │ C │               │ │
│ │ └───┘ └───┘ └───┘               │ │
│ │Tab 1 Tab 2 Tab 3                │ │ ← Bottom navigation
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Responsive Breakpoints

**Mobile:** 320px - 768px
- Single column layout
- Bottom navigation
- Touch-friendly buttons (44px min)
- Optimized for thumb navigation

**Tablet:** 768px - 1024px
- Two column layout khi có thể
- Side navigation hoặc bottom
- Larger touch targets
- Better use of screen space

**Desktop:** 1024px+
- Three column layout
- Side navigation
- Mouse-friendly interactions
- Full feature set

## Navigation Structure

### Bottom Tab Bar

```
┌─────────────────────────────────────────┐
│  ┌───┐  ┌───┐  ┌───┐                   │
│  │ A │  │ B │  │ C │                   │
│  │Tổng│ │Kho │ │Cài │                   │
│  └─●─┘  └───┘  └─●─┘                   │
│   │      │      │                      │
│   └──────┬──────┼──────────────────────┘
│          │      │
│    Active state │
└─────────────────┘
```

**Icons sử dụng:**
- **Tổng quan:** `LayoutDashboard`
- **Kho thực phẩm:** `UtensilsCrossed`
- **Cài đặt:** `Settings`

## Color Palette & Typography

### Primary Colors
- **Primary:** `#007AFF` (Blue) - Actions, links, active states
- **Secondary:** `#5856D6` (Purple) - Secondary actions
- **Success:** `#34C759` (Green) - Success states, valid inputs
- **Warning:** `#FF9500` (Orange) - Warnings, sắp hết hạn
- **Danger:** `#FF3B30` (Red) - Errors, hết hạn

### Typography Hierarchy
- **H1:** 32px (2xl) - Tiêu đề trang
- **H2:** 24px (xl) - Tiêu đề card
- **H3:** 20px (lg) - Tiêu đề section
- **Body:** 16px (base) - Nội dung chính
- **Caption:** 14px (sm) - Nhãn phụ
- **Small:** 12px (xs) - Thông tin chi tiết

## Design Principles

### Mobile-First Approach
- **Progressive Enhancement:** Base mobile experience, enhance for larger screens
- **Touch-First:** 44px minimum touch targets
- **Thumb-Friendly:** Easy one-handed navigation
- **Content Priority:** Most important content visible without scrolling

### Accessibility
- **WCAG 2.1 AA:** Color contrast ≥ 4.5:1
- **Focus Management:** Visible focus indicators
- **Screen Readers:** Proper semantic structure
- **Keyboard Navigation:** Full keyboard support