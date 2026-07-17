# RELEASE CHECKLIST

Date: 2026-07-17

## Before Upload

- Xác nhận file `js/main.js` đang trỏ đúng `GOOGLE_SHEETS_WEBHOOK_URL`
- Xác nhận không thay đổi:
  - Meta Pixel trong `index.html`
  - `js/tracking.js`
  - `js/schema.js`
  - pricing logic trong `js/sadu-data.js`
- Xác nhận thư mục upload đủ:
  - `index.html`
  - `css/`
  - `js/`
  - `assets/`
  - `image/`
  - `fonts/`
  - `robots.txt`
  - `sitemap.xml`

## After Upload

- Mở trang trên desktop
- Mở trang trên mobile
- Kiểm tra nhanh:
  - hero CTA
  - menu mobile
  - pricing CTA
  - FAQ accordion
  - sticky mobile CTA
  - footer CTA

## Final Live Check

- Gửi 1 đơn test thật
- Xác nhận:
  - đơn vào Google Sheet
  - trang success hiển thị đúng
  - tracking chạy trong trình duyệt thực tế

## Reference Docs

- `DOCS_INDEX.md`
- `DELIVERY_MANIFEST.md`
- `PROJECT_STATUS.md`
- `FINAL_UI_HANDOFF.md`
- `FINAL_QA_REPORT.md`
