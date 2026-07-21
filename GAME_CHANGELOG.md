# Game Changelog

## Những gì đã xóa

- Xóa toàn bộ flow săn voucher cũ
- Xóa popup `Săn Voucher`
- Xóa logic tìm voucher trực tiếp
- Xóa flow mở hộp quà cũ gắn với gameplay trước
- Xóa tracking game cũ:
  - `LeafFound`
  - `LeafComplete`
  - `VoucherCopied` cũ
  - `ScrollToForm`
  - `FormViewed`
  - `Lead` của game
- Xóa localStorage cũ `sadu_game_state_v1` khỏi flow mới và dọn key legacy khi init
- Xóa text/UI progress kiểu `0/5 Lá`
- Xóa wording và nội dung thưởng của game cũ

## Những gì đã thay

- Thay gameplay sang `Hành Trình Sống Lành`
- Lá không còn mở voucher trực tiếp, mà mở `Thẻ Sống Lành`
- Mỗi lá tương ứng 1 card nội dung thương hiệu/sống lành
- Sau khi đủ 5 thẻ mới mở reward flow
- Reward flow mới gồm:
  - hộp quà SADU
  - voucher card `SONGLANH`
  - copy CTA
  - apply CTA
- Lá được đặt dễ thấy hơn trên mobile và desktop
- Form có thêm ô voucher để game có thể tự điền khi user bấm `ÁP DỤNG NGAY`

## Tracking mới

- `HealthyCardOpen`
- `HealthyCardCollected`
- `HealthyJourneyCompleted`
- `VoucherUnlocked`
- `VoucherCopied`
- `ScrollToOrder`
- `VoucherApplied`

## Local Storage mới

- `cards_collected`
- `journey_completed`
- `voucher_unlocked`

## Cấu trúc game mới

- `game/game.js`: orchestrator flow mới
- `game/game-ui.js`: render UI động mới
- `game/game-storage.js`: storage model mới
- `game/game-tracking.js`: tracking model mới
- `game/game-animation.js`: animation engine giữ lại vì vẫn phù hợp
- `game/game.css`: visual system mới, không đụng CSS cũ của landing page

## Ghi chú tích hợp form

- Nếu form có ô voucher, game sẽ tự điền `SONGLANH`
- Game sẽ phát `input`, `change`, `blur` để tương thích tốt nhất với logic form hiện có
- Sau khi điền, game hiện thông báo:
  - `Miễn phí vận chuyển đã được áp dụng.`
