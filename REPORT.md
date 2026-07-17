# STEP 1 REPORT

## Phạm vi đã đọc

- Toàn bộ project tại `E:\Dữ liệu Sadu\Landingpage\sadu-mate-static-html-css-js`
- File tài liệu quy trình: `C:\Users\sangn\Downloads\CODEX_EXECUTION_GUIDE.md`
- Các file nguồn đã đọc:
  - `index.html`
  - `css/styles.css`
  - `js/main.js`
  - `js/sadu-data.js`
  - `js/tracking.js`
  - `js/schema.js`
  - `README.md`
  - `robots.txt`
  - `sitemap.xml`
  - `wrangler.toml`

## Ghi chú về docs

- Trong project hiện tại không có thư mục `docs/` hoặc `doc/` riêng.
- Tài liệu hiện có trong repo chủ yếu nằm ở:
  - `README.md`
  - `robots.txt`
  - `sitemap.xml`
  - `wrangler.toml`

## Cấu trúc project

```text
sadu-mate-static-html-css-js/
├─ index.html
├─ README.md
├─ robots.txt
├─ sitemap.xml
├─ wrangler.toml
├─ css/
│  └─ styles.css
├─ js/
│  ├─ main.js
│  ├─ sadu-data.js
│  ├─ schema.js
│  └─ tracking.js
├─ assets/
│  ├─ product, hero, logo, review avatar, BCT images
│  └─ optimized web assets
├─ image/
│  ├─ award gallery
│  ├─ testimonial photos
│  └─ extra hero/lifestyle images
└─ fonts/
   └─ Be Vietnam Pro + Playfair Display
```

## Kiến trúc hiện tại

### 1. HTML

- Một file `index.html` chứa toàn bộ landing page.
- Cấu trúc section khá đầy đủ cho một D2C landing page:
  - Header / Nav
  - Hero
  - Brand Story
  - Why Choose
  - Ingredients
  - Product Collection
  - Daily Routine
  - Production Process
  - Certifications
  - Press
  - Reviews
  - Comparison
  - Pricing
  - Lifestyle Gallery
  - FAQ
  - Social Proof
  - Order Form
  - Order Success
  - Awards Gallery
  - Guarantee
  - Footer
  - Sticky CTA / Floating CTA / Zalo / Toast / Exit Intent

### 2. CSS

- `css/styles.css` là stylesheet duy nhất.
- File đang chứa:
  - design tokens
  - reset/base
  - layout system
  - section styles
  - responsive overrides
  - hero override lớn theo hướng cinematic
  - nhiều lớp override cuối file
- Hiện có dấu hiệu cascade phức tạp:
  - nhiều block hero override lặp lại
  - mobile overrides xuất hiện ở nhiều vùng
  - final cascade layer đè lên các lớp trước

### 3. JavaScript

- `js/sadu-data.js`
  - chứa data sản phẩm
  - pricing tiers
  - review/testimonial data
  - FAQ data
  - social proof feed
- `js/main.js`
  - điều phối toàn bộ UI
  - quantity state
  - pricing summary
  - render dynamic sections
  - form validation
  - gửi đơn qua Google Apps Script webhook
  - floating CTA, exit intent, awards slider
- `js/tracking.js`
  - wrapper cho Meta Pixel events
  - chống bắn trùng qua sessionStorage
- `js/schema.js`
  - dựng JSON-LD động từ DOM + data

## Dữ liệu và logic quan trọng cần giữ nguyên

### Tracking

- Meta Pixel đã được gắn trực tiếp trong `index.html`
- `tracking.js` quản lý các event:
  - `PageView`
  - `ViewContent`
  - `InitiateCheckout`
  - `Lead`
  - `Purchase`
  - `Contact`
  - `Scroll50`

### Schema

- Có legacy schema trong `index.html` ở trạng thái disabled
- Có schema JSON-LD động trong `js/schema.js`
- Đây là vùng nhạy cảm, không được đổi cấu trúc hoặc nội dung logic

### Pricing Engine

- Pricing engine nằm trong `js/sadu-data.js`
- Quy tắc hiện tại:
  - giá đơn vị: `149000`
  - free ship từ `2` hộp
  - tier:
    - mua lẻ
    - mua 3 tặng 1
    - mua 5 tặng 2
- `calculatePricing()` là logic cốt lõi

### Order / Google Apps Script

- `main.js` đang submit đơn tới Apps Script qua webhook `fetch(..., mode: "no-cors")`
- Payload đã ổn định và đang dùng thực tế
- Không được thay đổi payload shape, field names, hoặc luồng submit

## Component hiện tại

### Layout / Navigation

- Sticky header
- Desktop nav
- Mobile menu
- Skip link accessibility

### Hero

- Hero cinematic nhiều lớp
- Hero journey copy
- Hero preview cards
- Hero indicators
- Hero motion / parallax / glow / dust / mist / leaf effects
- Hero CTA chính + CTA text

### Product Discovery

- Story block
- Why choose cards
- Ingredient cards
- Product collection cards
- Comparison table
- Pricing tier cards
- Calculator panel

### Trust / Conversion

- Press mentions
- Review cards
- Social proof list
- Social proof toast
- Awards gallery
- Guarantee panel
- Certification block

### Commerce

- Shared quantity control
- Order summary
- Shipping hint
- Order form
- Success state
- Sticky mobile CTA
- Floating order CTA
- Floating Zalo CTA
- Exit intent modal

## Component nên giữ

- Header sticky + mobile menu
- Hero preview card concept
- Product cards với quantity control
- Pricing tiers
- Calculator panel
- Order summary + order form
- Reviews
- Press
- FAQ accordion
- Awards gallery
- Guarantee panel
- Footer contact / policy / BCT badge
- Sticky mobile CTA
- Exit intent
- Social proof toast

Lý do giữ:

- Đây là các khối trực tiếp phục vụ funnel bán hàng D2C.
- Chúng đã gắn với state, pricing, tracking hoặc social proof hiện hữu.
- Có thể refactor giao diện mạnh mà không cần đổi business logic.

## Component cần bỏ

Lưu ý: đây là đề xuất bỏ ở tầng UI/visual hierarchy trong các STEP sau, không phải xoá logic ở STEP 1.

- Các lớp visual thừa hoặc trùng vai trò trong hero nếu gây nhiễu:
  - quá nhiều lớp glow/mist/decor khi làm giảm độ rõ sản phẩm
- Các nhãn/copy lặp ý trong hero nếu làm loãng CTA
- Các khối trang trí không tăng chuyển đổi nhưng chiếm chiều cao đầu trang
- Các pattern visual bị trùng:
  - cùng một thông điệp trust xuất hiện nhiều lần ở trust strip, guarantee, pricing, comparison mà không có phân cấp rõ

Không đề xuất bỏ:

- pricing logic
- quantity controls
- form submit
- tracking
- schema
- Meta Pixel
- social proof logic

## Component cần refactor

### Header

- Nâng cấp cảm giác premium hơn
- Tăng độ rõ CTA chính
- Làm nav rõ phân cấp hơn giữa link thường và CTA

### Hero

- Đây là block cần refactor mạnh nhất về visual
- Hiện quá nhiều hiệu ứng và cascade CSS phức tạp
- Cần chuyển thành premium D2C rõ:
  - sản phẩm là trung tâm
  - trust signal rõ
  - CTA rõ
  - hierarchy dễ quét

### Story

- Nội dung tốt nhưng presentation còn thiên landing page thông thường
- Cần nâng cấp thành storytelling premium:
  - nhịp đọc tốt hơn
  - media + credibility tốt hơn

### Product Collection

- Card sản phẩm đã có state tốt
- Cần refactor theo hướng ecommerce:
  - nhấn giá
  - nhấn lợi ích
  - nhấn combo
  - nhấn hành động chọn mua

### Pricing

- Logic tốt, UI hiện chưa đủ “premium commerce”
- Cần tăng phân cấp gói nổi bật
- Cần làm rõ savings / free gift / free ship

### Reviews

- Hiện là card grid cơ bản
- Có thể nâng cấp visual hệ thống review theo hướng D2C premium
- Nhưng phải giữ nguyên source data

### Social Proof / Seeding

- Dữ liệu đang hữu ích
- Presentation cần gọn hơn, tránh cảm giác spam

### Order Form

- Functionally tốt
- Cần refactor layout và thông tin hỗ trợ quyết định
- Nâng cảm giác “checkout lite” chuẩn D2C

### Awards / Certifications / Guarantee

- Nên gom lại thành trust system rõ ràng hơn
- Tránh cảm giác section rời rạc

## Component cần thêm

Lưu ý: “thêm” ở đây là thêm component UI/presentation, không thay đổi data model hay logic nghiệp vụ.

### 1. Premium trust bar

- Một trust rail rõ ràng ngay gần hero / buy zone
- Dùng lại các claim hiện có:
  - VietGAP
  - COD
  - hoàn tiền 14 ngày
  - free ship

### 2. Product benefit chips rõ hơn

- Tăng khả năng scan nhanh ở card sản phẩm
- Không đổi data, chỉ đổi cách trình bày

### 3. Buy intent summary block

- Một vùng tóm tắt “bạn nhận gì / tiết kiệm gì”
- Dùng chung pricing engine hiện tại

### 4. Combo emphasis module

- Làm nổi bật combo 3 và combo 5 theo visual premium
- Không đổi quy tắc tính tiền

### 5. Review credibility layer

- Badge “khách đã mua”
- format avatar/media nhất quán
- có thể thêm masonry/pinned visual ở các STEP sau nếu chỉ là UI

### 6. Sticky checkout context

- Khi người dùng cuộn sâu, giữ context mua hàng tốt hơn
- Tận dụng sticky CTA hiện có, không đổi tracking

## Điểm mạnh hiện tại

- Static stack, dễ deploy
- Đã có pricing engine rõ ràng
- Đã có order flow hoàn chỉnh
- Đã có Meta tracking
- Đã có schema
- Đã có nhiều trust sections
- Đã có nhiều asset hình ảnh thật

## Điểm yếu hiện tại

- CSS đang nặng override, đặc biệt ở hero
- Hero hiện giàu hiệu ứng nhưng có nguy cơ quá tải nhận thức
- Một số section tốt về nội dung nhưng chưa có hierarchy premium D2C
- Chưa có UI architecture nhất quán xuyên suốt giữa:
  - hero
  - product
  - pricing
  - order
- Nhiều điểm mạnh đang bị phân tán thay vì gom thành funnel bán hàng rõ

## Kết luận STEP 1

- Project không cần rewrite.
- Business logic, pricing, form submit, tracking, Meta Pixel, schema và cấu trúc data hiện đã hình thành đầy đủ.
- Hướng đúng là:
  - refactor visual hierarchy
  - nâng cấp component presentation
  - làm rõ shopping flow
  - chuẩn hóa trust system
  - tinh cascade CSS để dễ bảo trì hơn
- Phần rủi ro cao nhất khi triển khai các STEP sau là:
  - vô tình chạm vào logic quantity/pricing/order
  - vô tình làm lệch tracking
  - vô tình làm hỏng schema hoặc webhook submit

## Nguyên tắc thực thi cho các STEP sau

- Không đổi business logic
- Không đổi event tracking
- Không đổi Meta Pixel
- Không đổi schema structure
- Không đổi payload gửi Google Apps Script
- Không đổi rule pricing
- Chỉ refactor UI/UX/CSS/HTML structure theo hướng Premium D2C Ecommerce
