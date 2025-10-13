# Components chi tiết

## Food Item Card

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────────────────────┐ │
│ │  [Icon]  │ │ Tên thực phẩm          │ │
│ │          │ │ Số lượng: 1 kg         │ │
│ │          │ │ Hạn sử dụng: 2024-12-31│ │
│ │          │ │ Danh mục: Rau củ       │ │
│ └─────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Variants:**

### Normal State (Green)
```
┌─────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────────────────────┐ │
│ │  🥕     │ │ Cà rốt                  │ │
│ │          │ │ Số lượng: 500g          │ │
│ │          │ │ Hạn sử dụng: 2024-12-25 │ │
│ │          │ │ Danh mục: Rau củ        │ │
│ └─────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Warning State (Orange - sắp hết hạn)
```
┌─────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────────────────────┐ │
│ │  🥛     │ │ Sữa tươi                │ │
│ │          │ │ Số lượng: 2 lít         │ │
│ │          │ │ Hạn sử dụng: 2024-12-15 │ │
│ │          │ │ ⚠️ Sắp hết hạn         │ │
│ └─────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Expired State (Red - đã hết hạn)
```
┌─────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────────────────────┐ │
│ │  🍗     │ │ Thịt gà                 │ │
│ │          │ │ Số lượng: 1 kg          │ │
│ │          │ │ Hạn sử dụng: 2024-12-10 │ │
│ │          │ │ 🚫 Đã hết hạn          │ │
│ └─────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Properties:**
- **Image/Icon:** Tùy chọn, hiển thị category icon hoặc hình ảnh
- **Name:** Tên thực phẩm, bold, truncated nếu quá dài
- **Quantity:** Số lượng với đơn vị, format phù hợp
- **Expiration Date:** Ngày hết hạn, màu theo trạng thái
- **Category:** Nhóm thực phẩm, màu xám nhạt

## Navigation Components

### Bottom Tab Bar
```
┌─────────────────────────────────────────┐
│ ┌───┐    ┌───┐    ┌───┐               │
│ │ 🏠 │    │ 🥫  │    │ ⚙️  │           │
│ │Tổng│    │Kho  │    │Cài  │           │
│ │quan│    │thực│    │đặt │           │
│ └─●─┘    └───┘    └───┘               │
│  │         │        │                  │
│  └─────────┼────────┼──────────────────┘
│            │        │
│      Active state   │
└─────────────────────┘
```

**States:**
- **Active:** Primary background color, white icon
- **Inactive:** Gray background, gray icon
- **Pressed:** Scale animation, haptic feedback

### Header Component
```
┌─────────────────────────────────────────┐
│ ┌─────────┐ ┌──────┐ ┌─────────┐       │
│ │  [Back] │ │Title │ │ [Menu]  │       │ ← Back navigation
│ └─────────┘ └──────┘ └─────────┘       │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │             User Menu               │ │ ← Dropdown menu
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Form Components

### Input Field
```
┌─────────────────────────────────────────┐
│ Label:                                  │
│ ┌─────────────────────────────────────┐ │
│ │ Placeholder text                    │ │ ← Input with focus state
│ └─────────────────────────────────────┘ │
│ Helper text                             │
└─────────────────────────────────────────┘
```

**States:**
- **Default:** Border gray, background white
- **Focus:** Border primary, shadow
- **Error:** Border red, error message
- **Disabled:** Background gray, reduced opacity

### Button Component
```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Primary   │   │  Secondary  │   │    Ghost    │
└─────────────┘   └─────────────┘   └─────────────┘
```

**Variants:**
- **Primary:** Filled with primary color
- **Secondary:** Outlined with border
- **Ghost:** Text only, no background
- **Danger:** Red background for destructive actions

## Loading States

### Skeleton Loading
```
┌─────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────────────────────┐ │
│ │ □□□□□   │ │ □□□□□□□□□□□□□□□□□□□   │ │
│ │ □□□□□   │ │ □□□□□□□□□□□□□□□□□□□   │ │
│ │ □□□□□   │ │ □□□□□□□□□□□□□□□□□□□   │ │
│ └─────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Spinner Loading
```
┌─────────────────────────────────────────┐
│                                         │
│           ┌─────────────┐               │
│           │   Loading   │               │
│           │  ⭕️        │               │
│           │  Đang tải... │               │
│           └─────────────┘               │
│                                         │
└─────────────────────────────────────────┘
```

## Alert Components

### Success Alert
```
┌─────────────────────────────────────────┐
│ ┌───┐                                   │
│ │ ✅ │    Action completed successfully   │
│ └───┘                                   │
└─────────────────────────────────────────┘
```

### Error Alert
```
┌─────────────────────────────────────────┐
│ ┌───┐                                   │
│ │ ❌ │    Something went wrong           │
│ └───┘                                   │
│       Please try again                  │
└─────────────────────────────────────────┘
```

### Warning Alert
```
┌─────────────────────────────────────────┐
│ ┌───┐                                   │
│ │ ⚠️ │    Warning message               │
│ └───┘                                   │
└─────────────────────────────────────────┘
```

## Modal Components

### Confirmation Dialog
```
┌─────────────────────────────────────────┐
│                                         │
│           Confirm Action                 │
│           Are you sure?                 │
│                                         │
│ ┌─────────────┐ ┌─────────────┐         │
│ │   Cancel    │ │   Confirm   │         │
│ └─────────────┘ └─────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Overlay background
- Centered content
- Action buttons
- Close button (X)
- Keyboard navigation (ESC to close)

## Add Item Form

### Form Layout
```
┌─────────────────────────────────────────┐
│         Thêm thực phẩm mới         [✕] │ ← Modal header
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Tên thực phẩm:*                     │ │ ← Required field indicator
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Input field with placeholder    │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │ Helper text or error message       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Số lượng:*                          │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Number input with decimal       │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Đơn vị:*                            │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │     Dropdown selector          │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Hạn sử dụng:*                       │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │    Date picker widget          │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Danh mục:*                          │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │     Category dropdown          │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────┐ ┌─────────────────┐ │
│ │      Hủy        │ │    Thêm mới     │ │ ← Action buttons
│ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────┘
```

### Field Specifications

**Text Input (Tên thực phẩm):**
- Placeholder: "Nhập tên thực phẩm..."
- Required: true
- Min length: 2 characters
- Max length: 100 characters
- Validation: Real-time feedback

**Number Input (Số lượng):**
- Type: number với decimal support
- Min value: 0.01
- Max decimal places: 2
- Step: 0.01
- Placeholder: "0.00"

**Dropdown (Đơn vị):**
- Options: kg, gram, g, lít, ml, cái, hộp, gói, túi
- Default: kg
- Searchable: false (small list)

**Date Picker (Hạn sử dụng):**
- Min date: today
- Max date: +5 years
- Format: DD/MM/YYYY
- Default: tomorrow

**Dropdown (Danh mục):**
- Options: Rau củ, Trái cây, Thịt, Cá, Sữa, Đồ uống, Đồ khô, Gia vị, Khác
- Default: Rau củ
- Color coding tương ứng với danh mục

### Validation States

**Success State:**
```
┌─────────────────────────────────────┐
│ Tên thực phẩm:*                     │
│ ┌─────────────────────────────────┐ │
│ │ ✅ Valid input text             │ │ ← Green border + check icon
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Error State:**
```
┌─────────────────────────────────────┐
│ Tên thực phẩm:*                     │
│ ┌─────────────────────────────────┐ │
│ │ ❌ Too short                    │ │ ← Red border + error icon
│ └─────────────────────────────────┘ │
│ Vui lòng nhập ít nhất 2 ký tự      │ ← Error message
└─────────────────────────────────────┘
```

### Button States

**Primary Button (Thêm mới):**
- **Default:** Primary background, enabled
- **Loading:** Spinner + "Đang thêm..." text
- **Disabled:** Reduced opacity khi form invalid
- **Success:** Brief success state với checkmark

**Secondary Button (Hủy):**
- **Default:** Outlined button
- **Loading:** Disabled state khi đang submit

## Data Visualization

### Stats Cards
```
┌─────────────────────────────────────────┐
│ ┌───┐ Total Items                       │
│ │ 📊 │  25                              │
│ └───┘                                   │
└─────────────────────────────────────────┘
```

### Progress Indicators
```
┌─────────────────────────────────────────┐
│ Loading items...                        │
│ ┌─────────────────────────────────────┐ │
│ │■■■■■■■■■■■■■■■■■■■                  │ │
│ │ 75%                                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Responsive Behavior

### Mobile (< 768px)
- **Layout:** Single column, full width
- **Navigation:** Bottom tab bar
- **Cards:** Stacked vertically
- **Buttons:** Full width, stacked

### Tablet (768px - 1024px)
- **Layout:** Two columns khi có thể
- **Navigation:** Bottom hoặc side navigation
- **Cards:** Side by side (2 per row)
- **Buttons:** Inline, normal size

### Desktop (> 1024px)
- **Layout:** Three columns hoặc dashboard
- **Navigation:** Side navigation
- **Cards:** Grid layout (3-4 per row)
- **Buttons:** Inline, hover effects