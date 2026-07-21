# Game Architecture

## Overview

`Hành Trình Sống Lành` là một lớp brand experience độc lập, mount sau khi trang tải xong và chỉ dùng namespace `.sadu-game-*`.

Landing page, form, combo builder, pixel cũ, lead tracking và purchase tracking không bị thay đổi logic gốc.

## File Structure

- `game/game.js`
  Điều phối toàn bộ flow game mới: invite bubble, mount 5 lá, mở thẻ sống lành, mở quà, copy voucher, scroll form, auto-fill voucher và return visitor.
- `game/game-ui.js`
  Sinh toàn bộ DOM động của game: HUD, bubble, toast, modal thẻ, modal quà, helper badge, return badge.
- `game/game-storage.js`
  Quản lý localStorage mới với đúng 3 key:
  - `cards_collected`
  - `journey_completed`
  - `voucher_unlocked`
  Đồng thời dọn các key legacy của game cũ.
- `game/game-tracking.js`
  Gửi tracking game mới qua `SADUTrackingCore`, `fbq` và `dataLayer`.
- `game/game-animation.js`
  Chứa animation `requestAnimationFrame` cho particle burst, fly-to-HUD và confetti.
- `game/game.css`
  Toàn bộ style/animation của game mới, được namespace hoàn toàn bằng `.sadu-game-*`.

## Experience Flow

1. Visitor vào landing page.
2. Sau 8 giây, bubble nhỏ hiện ở góc dưới phải:
   - `🌿 Khám phá Hành Trình Sống Lành để nhận quà từ SADU`
3. Visitor bấm `Bắt đầu`.
4. HUD hiện ở góc phải với tiến trình `0 / 5 Thẻ`.
5. 5 lá được gắn vào 5 khu vực:
   - Hero
   - Nguồn gốc
   - Quy trình
   - Feedback
   - Combo
6. Khi click từng lá:
   - Track `HealthyCardOpen`
   - Mở card modal với hiệu ứng lật thẻ
   - Visitor bấm `Tiếp tục khám phá`
   - Lá bay về HUD
   - Progress tăng
   - Toast xác nhận hiện lên
   - Track `HealthyCardCollected`
7. Khi đủ 5 thẻ:
   - Track `HealthyJourneyCompleted`
   - Track `VoucherUnlocked`
   - Mở modal quà
8. Visitor click hộp quà:
   - Hộp mở
   - Ánh sáng, particle lá và confetti chạy
   - Voucher `SONGLANH` xuất hiện
9. Visitor bấm `Sao chép`:
   - Track `VoucherCopied`
   - CTA `ÁP DỤNG NGAY` hiện ra
   - Helper nudge xuất hiện ở góc dưới
10. Visitor bấm `ÁP DỤNG NGAY`:
   - Scroll mượt tới form
   - Nếu có ô voucher, tự điền `SONGLANH`
   - Hiện thông báo `Miễn phí vận chuyển đã được áp dụng.`
   - Track `ScrollToOrder`
   - Track `VoucherApplied`

## Card Content

1. `🌱 BẮT ĐẦU TỪ ĐIỀU NHỎ`
2. `💧 UỐNG ĐỦ NƯỚC`
3. `🌿 ĂN THỰC PHẨM TỰ NHIÊN`
4. `🚶 VẬN ĐỘNG MỖI NGÀY`
5. `💚 SỐNG CHẬM LẠI`

## Placement Strategy

Lá được đặt ở vị trí dễ thấy hơn bản cũ:

- Gần heading hoặc phần mở đầu từng section
- Có hiệu ứng glow/floating nhẹ
- Lá kế tiếp được highlight bằng pulse ring
- Mobile tăng touch target lên `40px`

Mục tiêu là tăng discoverability mà không phá bố cục hiện có.

## State Model

Game mới chỉ lưu 3 trạng thái bền vững:

- `cards_collected`: mảng id các thẻ đã lấy
- `journey_completed`: người dùng đã hoàn thành hành trình
- `voucher_unlocked`: voucher đã sẵn sàng để dùng

Countdown 15 phút dùng `sessionStorage` để không làm ảnh hưởng logic return visitor.

## Return Visitor Logic

Nếu `journey_completed` và `voucher_unlocked` đều là `true`:

- Không hiện lại bubble
- Không bắt tìm lại 5 lá
- Hiện return badge ở góc phải
- Click badge sẽ mở lại reward modal với voucher sẵn sàng dùng

## Tracking Events

Game mới chỉ phát các event sau:

- `HealthyCardOpen`
- `HealthyCardCollected`
- `HealthyJourneyCompleted`
- `VoucherUnlocked`
- `VoucherCopied`
- `ScrollToOrder`
- `VoucherApplied`

## Tracking Payload

Payload được enrich tự động với:

- `card_number`
- `card_name`
- `leaf_number`
- `leaf_name`
- `section`
- `time_on_page`
- `scroll_depth`
- `utm`
- `fbclid`
- `visitor_id`

## Accessibility

- Lá là `button` thật với `aria-label`
- Modal dùng `role="dialog"` và `aria-modal="true"`
- Hỗ trợ `ESC` để đóng
- Có focus trap trong modal
- Thông báo voucher apply dùng `aria-live="polite"`

## Performance Notes

- Không dùng thư viện ngoài
- Chỉ init sau `DOMContentLoaded`
- Bubble delay 8 giây
- Animation dùng `requestAnimationFrame`
- Không sửa CSS cũ ngoài việc thêm file `game/game.css`
- Không gắn listener trùng lặp lên form cũ
