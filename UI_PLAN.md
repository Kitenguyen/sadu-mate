# STEP 2 UI PLAN

## Mục tiêu UI Architecture

- Chuyển landing page hiện tại thành Premium D2C Ecommerce Landing
- Giữ nguyên business logic, pricing, tracking, schema, Meta Pixel, Google Apps Script
- Chỉ nâng cấp:
  - visual hierarchy
  - component presentation
  - shopping clarity
  - trust architecture
  - conversion flow

## Nguyên tắc thiết kế

- Premium nhưng không xa lạ với người dùng Việt Nam 30-55 tuổi
- Sản phẩm phải là trung tâm, không để hiệu ứng lấn át sản phẩm
- CTA rõ ràng, lặp lại hợp lý
- Trust signal xuất hiện đúng thời điểm, không dồn dập
- Shopping flow ngắn, dễ hiểu, giảm do dự
- Mỗi section phải phục vụ một vai trò rõ ràng trong funnel

## UI Architecture tổng thể

### Funnel đề xuất

1. Hero tạo cảm nhận cao cấp + trust ban đầu
2. Story ngắn để tạo nền thương hiệu
3. Product selection rõ ràng
4. Combo / Pricing làm nổi bật quyết định mua
5. Review / Social proof giảm nghi ngại
6. FAQ xử lý objection cuối
7. Order form như checkout rút gọn

### Trục ưu tiên nội dung

1. Hero + CTA
2. Product / Combo / Pricing
3. Trust / Review / Press / Certification
4. Order
5. Story / Lifestyle / Awards
6. FAQ / Footer

## Desktop

### Mục tiêu

- Tạo cảm giác high-end storefront
- Giữ hero lớn, có chiều sâu
- Tăng khả năng scan ở vùng sản phẩm và bảng giá
- Order zone rõ như mini checkout

### Bố cục đề xuất

- Header:
  - logo trái
  - nav giữa
  - CTA phải
- Hero:
  - historical note: cấu trúc hero 3 cột bên dưới là phương án planning ban đầu
  - trạng thái triển khai hiện tại: hero đã bỏ preview/product cards ở first screen
  - cột 1: copy + proof + CTA
  - cột 2: visual sản phẩm / key scene
  - cột 3: preview / quick selection / trust snippets
- Story:
  - 2 cột media + copy
- Product collection:
  - 3 card ngang
- Pricing:
  - 3 tier card
  - gói giữa nổi bật mạnh nhất
- Reviews:
  - grid hoặc masonry nhẹ
- Order section:
  - trái: chọn sản phẩm + summary
  - phải: form checkout

### Desktop behavior

- Sticky header tinh gọn khi scroll
- Floating CTA chỉ hiện sau khi qua vùng hero
- Preview / carousel / awards có điều hướng rõ
- Hover phải tinh tế, dưới 300ms

## Tablet

### Mục tiêu

- Giữ trải nghiệm premium nhưng giảm độ phức tạp
- Chuyển các vùng 3 cột thành 1-2 cột linh hoạt
- Giảm độ dày hero, tăng khả năng đọc

### Bố cục đề xuất

- Header:
  - logo + CTA + hamburger/menu tối giản
- Hero:
  - historical note: dòng `preview cards chuyển sang hàng ngang cuộn` bên dưới là plan cũ
  - trạng thái triển khai hiện tại: hero tablet/mobile không còn product preview cards
  - xếp dọc
  - visual trước hoặc sau copy tùy hierarchy cuối
  - preview cards chuyển sang hàng ngang cuộn
- Story:
  - 1 cột hoặc 2 cột nén
- Product / Pricing / Reviews:
  - 2 cột nếu đủ rộng
  - nếu không thì 1 cột với spacing thoáng
- Order section:
  - summary trên
  - form dưới

### Tablet behavior

- Các cụm card phải chạm dễ
- CTA luôn đủ lớn
- Carousel/slider ưu tiên swipe

## Mobile

### Mục tiêu

- Tập trung chuyển đổi, không sa đà trưng bày
- Hero ngắn gọn, CTA sớm
- Mọi khối phải chạm dễ, đọc nhanh
- Sticky CTA và order flow phải rất rõ

### Bố cục đề xuất

- Header:
  - logo nhỏ gọn
  - menu
  - CTA phụ nếu đủ chỗ
- Hero:
  - copy ngắn
  - visual mạnh
  - CTA full-width
  - trust chips nhỏ gọn
- Story:
  - copy ngắn hơn desktop
  - media theo sau hoặc trên đầu
- Product:
  - card dọc
  - giá và nút tăng giảm nằm trong vùng nhìn đầu tiên
- Pricing:
  - stack 1 cột
  - combo nổi bật đứng đầu hoặc giữa tùy A/B reasoning
- Reviews:
  - card cuộn ngang hoặc stack ngắn
- Order:
  - chọn sản phẩm
  - summary
  - form
  - sticky CTA dưới màn

### Mobile behavior

- Sticky bottom CTA luôn rõ nhưng không quá che nội dung
- Form input lớn, dễ bấm
- Review / awards / gallery ưu tiên swipe
- Bảng so sánh dùng cuộn ngang có kiểm soát

## Wireframe

### Desktop wireframe

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Header: Logo | Nav | CTA                                           │
├─────────────────────────────────────────────────────────────────────┤
│ Hero Copy         │ Main Product Visual        │ Quick Preview      │
│ Title             │ Premium Scene              │ Preview Cards      │
│ Lead              │                            │ Trust highlights   │
│ CTA + trust       │                            │                    │
├─────────────────────────────────────────────────────────────────────┤
│ Story / Brand credibility                                           │
├─────────────────────────────────────────────────────────────────────┤
│ Why choose                                                     4up  │
├─────────────────────────────────────────────────────────────────────┤
│ Product cards                                                3 cols │
├─────────────────────────────────────────────────────────────────────┤
│ Pricing tiers                                                 3 cols│
├─────────────────────────────────────────────────────────────────────┤
│ Reviews / Press / Certification / Comparison                        │
├─────────────────────────────────────────────────────────────────────┤
│ Order Summary                         │ Checkout Form               │
├─────────────────────────────────────────────────────────────────────┤
│ FAQ                                                             │   │
├─────────────────────────────────────────────────────────────────────┤
│ Footer                                                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Tablet wireframe

```text
┌──────────────────────────────────────────────┐
│ Header: Logo | CTA | Menu                    │
├──────────────────────────────────────────────┤
│ Hero Copy                                    │
│ Hero Visual                                  │
│ Preview row                                  │
├──────────────────────────────────────────────┤
│ Story                                        │
├──────────────────────────────────────────────┤
│ Why choose grid 2 cols                       │
├──────────────────────────────────────────────┤
│ Product cards 2 cols / stacked               │
├──────────────────────────────────────────────┤
│ Pricing cards stacked or 2+1                 │
├──────────────────────────────────────────────┤
│ Reviews / Press / Trust                      │
├──────────────────────────────────────────────┤
│ Order Summary                                │
│ Form                                         │
├──────────────────────────────────────────────┤
│ FAQ                                          │
├──────────────────────────────────────────────┤
│ Footer                                       │
└──────────────────────────────────────────────┘
```

### Mobile wireframe

```text
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│ Hero Title                  │
│ Hero Lead                   │
│ CTA                         │
│ Product Visual              │
│ Trust chips                 │
├─────────────────────────────┤
│ Story                       │
├─────────────────────────────┤
│ Product 1                   │
│ Product 2                   │
│ Product 3                   │
├─────────────────────────────┤
│ Combo / Pricing             │
├─────────────────────────────┤
│ Reviews                     │
├─────────────────────────────┤
│ Trust / Awards / Press      │
├─────────────────────────────┤
│ Order Summary               │
│ Checkout Form               │
├─────────────────────────────┤
│ FAQ                         │
├─────────────────────────────┤
│ Footer                      │
└─────────────────────────────┘
      Sticky Bottom CTA
```

## Component Tree

```text
Page
├─ Header
│  ├─ Brand
│  ├─ Nav Links
│  ├─ Primary CTA
│  └─ Mobile Menu
├─ Hero
│  ├─ Background Visual Layer
│  ├─ Hero Copy
│  │  ├─ Eyebrow
│  │  ├─ Title
│  │  ├─ Lead
│  │  ├─ Journey Copy
│  │  └─ CTA Group
│  ├─ Hero Product Visual
│  └─ Hero Preview Rail
├─ Brand Story
│  ├─ Media
│  ├─ Copy
│  ├─ CTA
│  └─ Stats
├─ Why Choose
│  └─ Benefit Cards
├─ Ingredients
│  └─ Ingredient Cards
├─ Product Collection
│  └─ Product Cards
│     ├─ Image
│     ├─ Tagline
│     ├─ Description
│     ├─ Notes
│     ├─ Price
│     └─ Qty Control
├─ Routine
├─ Process
├─ Certifications
├─ Press
├─ Reviews
│  └─ Review Cards
├─ Comparison
├─ Pricing
│  ├─ Pricing Tier Cards
│  └─ Calculator
├─ FAQ
├─ Social Proof Section
├─ Order Section
│  ├─ Product Picker
│  ├─ Order Summary
│  └─ Checkout Form
├─ Order Success State
├─ Awards Gallery
├─ Guarantee
├─ Footer
├─ Sticky Mobile CTA
├─ Floating CTA
├─ Floating Zalo CTA
├─ Social Proof Toast
└─ Exit Intent Modal
```

## User Flow

### Flow tổng quát

1. Người dùng vào trang
2. Nhìn thấy hero + trust + CTA
3. Cuộn để hiểu sản phẩm / thương hiệu
4. So sánh các dòng trà
5. Xem combo / pricing
6. Xem review / press / trust
7. Chuyển sang order
8. Điền form
9. Gửi đơn
10. Thấy trạng thái thành công

### Flow nhận thức

1. Đây là sản phẩm gì?
2. Có đáng tin không?
3. Dòng nào phù hợp với tôi?
4. Mua combo nào lời nhất?
5. Có ai khác đã mua chưa?
6. Đặt hàng có dễ không?
7. Có an toàn nếu thử không?

## Shopping Flow

### Flow mua hàng mong muốn

1. Hero CTA kéo về khu mua
2. User nhìn thấy product cards
3. User tăng giảm số lượng trực tiếp
4. Pricing engine tự tính:
   - số hộp
   - quà tặng
   - tiết kiệm
   - free ship
5. Pricing tier reinforce quyết định
6. Summary xác nhận lợi ích mua hàng
7. User điền form
8. Submit sang Google Apps Script
9. Trigger lead + purchase tracking như hiện tại

### Conversion assist points

- Hero CTA
- Sticky mobile CTA
- Floating desktop CTA
- Pricing cards CTA
- Brand story CTA
- Exit intent CTA

### Friction points cần giảm ở các STEP sau

- Hero hiện có thể hơi nhiều hiệu ứng trước khi thấy rõ action
- Product selection và combo value chưa được nhấn mạnh đủ theo chuẩn ecommerce
- Trust signals đang phân tán
- Order zone chưa mang cảm giác checkout premium rõ ràng

## Visual Direction cho các STEP UI sau

- Cảm giác thương hiệu:
  - sạch
  - cao cấp
  - thảo mộc thật
  - đáng tin
- Tham chiếu tinh thần:
  - Apple Store về khoảng thở
  - Shopify Plus về clarity commerce
  - Shopee Mall về quyết định mua nhanh
  - TikTok Shop về social proof / conversion momentum

## Mapping STEP sau theo UI plan

- STEP 3:
  - Header rõ premium nav + CTA hierarchy
- STEP 4:
  - Hero tối ưu perception + CTA + product focus
- STEP 5:
  - Product card thành chuẩn commerce card
- STEP 6:
  - Cart nếu xuất hiện phải hòa cùng order flow hiện có
- STEP 7:
  - Combo builder phải đứng trên pricing engine hiện hữu
- STEP 8:
  - Cross-sell gắn logic visual, không đổi data structure lõi nếu chưa cần
- STEP 9:
  - Reviews chuyển sang trust gallery / masonry premium
- STEP 10:
  - Story thành storytelling + certification system
- STEP 11:
  - FAQ tinh gọn, dễ quét
- STEP 12:
  - Animation chỉ tinh tế, dưới 300ms
- STEP 13:
  - Responsive unify theo architecture này

## Kết luận STEP 2

- UI architecture nên xoay quanh 3 trục:
  - Premium Brand Perception
  - Fast Shopping Decision
  - Low-friction Checkout
- Không cần thêm framework hay rewrite
- Nền tảng hiện tại đủ tốt để refactor từng STEP mà vẫn giữ nguyên logic hiện có
