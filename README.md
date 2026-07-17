# SADU Mate — Landing Page (HTML/CSS/JS thuần)

Đây là bản landing page đã chuyển đổi sang HTML, CSS và JavaScript thuần
(không dùng React/framework nào), sẵn sàng upload lên bất kỳ hosting tĩnh nào
(cPanel, Nginx, Apache, Vercel static, Netlify, GitHub Pages, v.v.).

## Cấu trúc thư mục

```
index.html          Toàn bộ nội dung + cấu trúc trang (16 section)
css/styles.css       Toàn bộ style (đã chuyển từ Tailwind sang CSS thuần)
js/sadu-data.js      Dữ liệu sản phẩm, bảng giá, đánh giá, FAQ
js/main.js           Toàn bộ hành vi: nav, đếm ngược, tính giá, form đặt hàng...
assets/*.webp        Ảnh sản phẩm, ảnh minh họa, logo
fonts/*.woff2        Font Be Vietnam Pro + Playfair Display (self-hosted)
```

## Cách chạy thử trên máy của bạn

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một server tĩnh đơn giản:

```
python3 -m http.server 8080
# rồi mở http://localhost:8080
```

## Cách upload lên server của bạn

Copy toàn bộ nội dung thư mục này (giữ nguyên cấu trúc thư mục con
`css/`, `js/`, `assets/`, `fonts/`) vào thư mục gốc web (ví dụ `public_html/`,
`www/`, hoặc `htdocs/`) trên hosting của bạn. Không cần cài đặt gì thêm —
đây là site tĩnh 100%, không cần Node.js, PHP, hay build step nào.

## QUAN TRỌNG: Kết nối đơn hàng tới Google Sheet

Form đặt hàng gửi dữ liệu tới Google Apps Script bằng JavaScript (`fetch`).
Bạn PHẢI dán URL `/exec` của Apps Script vào biến `GOOGLE_SHEETS_WEBHOOK_URL`
ở đầu file `js/main.js`:

```js
var GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec";
```

Nếu để trống, đơn hàng vẫn hiển thị "thành công" trên giao diện nhưng KHÔNG
được gửi đi đâu cả (chỉ cảnh báo trong console trình duyệt).

Request gửi ở chế độ `mode: "no-cors"` (do gọi từ file tĩnh sang domain khác
của Google) — nghĩa là trình duyệt không đọc được nội dung phản hồi JSON thật
từ Apps Script (thành công/lỗi trùng đơn...), nhưng dữ liệu vẫn được gửi đi và
Apps Script vẫn ghi vào Sheet bình thường nếu không có lỗi mạng. Nếu bạn muốn
đọc được thông báo lỗi thật (ví dụ trùng đơn trong 2 phút), bạn cần tự dựng
một backend nhỏ (Node/PHP) trên server của bạn để proxy request đó ở chế độ
`cors` — liên hệ dev nếu cần hỗ trợ phần này.

Payload gửi đi có dạng:
```json
{
  "name": "...", "phone": "...", "province": "...", "address": "...",
  "note": "...", "products": "...", "totalBoxes": 0, "subtotal": 0,
  "savings": 0, "freeShipping": false, "source": "Landing Page"
}
```

Code Apps Script (Code.gs) tương ứng cần đọc các field này qua `e.postData`
(JSON POST) — xem file `Code.gs` bạn đang triển khai trên Google Apps Script.

## Ghi chú

- Toàn bộ animation "reveal khi cuộn trang" dùng `IntersectionObserver` —
  tương thích mọi trình duyệt hiện đại.
- Đếm ngược khuyến mãi tự động reset về 24:00:00 mỗi ngày (giờ máy khách).
- Sticky CTA mobile + nút nổi desktop tự hiện sau khi cuộn qua 480px.
- Popup exit-intent chỉ hiện 1 lần/phiên (dùng `sessionStorage`).

## Tai lieu ban giao

- `DOCS_INDEX.md`
- `FINAL_UI_HANDOFF.md`
- `FINAL_QA_REPORT.md`
- `RELEASE_CHECKLIST.md`
- `UI_REFACTOR_CHANGELOG.md`
