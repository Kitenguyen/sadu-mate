(function (window, document) {
  "use strict";

  function createRoot() {
    var root = document.createElement("div");
    root.className = "sadu-game-root";
    root.innerHTML = [
      '<div class="sadu-game-layer sadu-game-layer--hud" hidden></div>',
      '<div class="sadu-game-layer sadu-game-layer--bubble" hidden></div>',
      '<div class="sadu-game-layer sadu-game-layer--toast" aria-live="polite" aria-atomic="true"></div>',
      '<div class="sadu-game-layer sadu-game-layer--modal" hidden></div>',
      '<div class="sadu-game-layer sadu-game-layer--helper" hidden></div>',
      '<div class="sadu-game-layer sadu-game-layer--return" hidden></div>',
      '<div class="sadu-game-layer sadu-game-layer--fx"></div>'
    ].join("");
    document.body.appendChild(root);
    return root;
  }

  function leafMarkup(label) {
    return [
      '<span class="sadu-game-leaf-icon" aria-hidden="true">',
      '<svg viewBox="0 0 48 48" focusable="false">',
      '<defs>',
      '<linearGradient id="saduGameLeafFill" x1="0%" y1="0%" x2="100%" y2="100%">',
      '<stop offset="0%" stop-color="#d8efbc"></stop>',
      '<stop offset="52%" stop-color="#89b267"></stop>',
      '<stop offset="100%" stop-color="#4f7443"></stop>',
      '</linearGradient>',
      '</defs>',
      '<path d="M39.6 8.3c-8.2-.2-15.1 2.7-20.9 8.8-6 6.3-8.7 13.6-8 21.8 8.3.4 15.4-2.2 21.4-7.8 6-5.6 9-13.2 8.9-22.8z" fill="url(#saduGameLeafFill)"></path>',
      '<path d="M13.4 33.2c6.1-8.4 12.8-14.4 20-18" fill="none" stroke="rgba(246,255,239,.78)" stroke-width="1.7" stroke-linecap="round"></path>',
      '<path d="M19 25.7c2.2.2 4.2 1 5.9 2.1" fill="none" stroke="rgba(246,255,239,.42)" stroke-width="1.15" stroke-linecap="round"></path>',
      '</svg>',
      '</span>',
      '<span class="sadu-game-sr">' + label + "</span>"
    ].join("");
  }

  function giftBoxMarkup() {
    return [
      '<button type="button" class="sadu-game-giftbox" data-game-open-gift aria-label="Mở Hộp Quà SADU">',
      '<span class="sadu-game-giftbox-glow"></span>',
      '<span class="sadu-game-giftbox-spark"></span>',
      '<span class="sadu-game-giftbox-lid"></span>',
      '<span class="sadu-game-giftbox-base"></span>',
      '<span class="sadu-game-giftbox-ribbon sadu-game-giftbox-ribbon--vertical"></span>',
      '<span class="sadu-game-giftbox-ribbon sadu-game-giftbox-ribbon--horizontal"></span>',
      "</button>"
    ].join("");
  }

  function createLeafButton(config) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "sadu-game-leaf";
    button.setAttribute("data-leaf-id", config.id);
    button.setAttribute("aria-label", "Khám phá thẻ sống lành tại " + config.sectionLabel);
    button.innerHTML = leafMarkup(config.label);
    return button;
  }

  function renderBubble(layer) {
    layer.hidden = false;
    layer.innerHTML = [
      '<div class="sadu-game-bubble" role="dialog" aria-label="Khởi động Hành Trình Sống Lành">',
      '<button type="button" class="sadu-game-bubble-dismiss" data-game-close-invite aria-label="Đóng lời mời">×</button>',
      '<div class="sadu-game-bubble-icon">🌿</div>',
      '<p class="sadu-game-bubble-title">Khám phá Hành Trình Sống Lành để nhận quà từ SADU</p>',
      '<p class="sadu-game-bubble-note">Tìm 5 thẻ để mở quà tặng dành riêng cho khách hàng mới.</p>',
      '<div class="sadu-game-bubble-actions">',
      '<button type="button" class="sadu-game-btn sadu-game-btn--primary" data-game-start>Bắt đầu</button>',
      '<button type="button" class="sadu-game-btn sadu-game-btn--ghost" data-game-skip>Để sau</button>',
      "</div>",
      "</div>"
    ].join("");
  }

  function renderHud(layer) {
    layer.hidden = false;
    layer.innerHTML = [
      '<div class="sadu-game-hud">',
      '<div class="sadu-game-hud-head">',
      '<div class="sadu-game-hud-badge">🌿</div>',
      "<div>",
      '<p class="sadu-game-hud-kicker">Hành Trình Sống Lành</p>',
      '<p class="sadu-game-hud-count"><span data-game-count>0</span>/5 Thẻ</p>',
      "</div>",
      "</div>",
      '<div class="sadu-game-progress" aria-hidden="true"><span data-game-progress></span></div>',
      "</div>"
    ].join("");
  }

  function renderToast(layer, message) {
    var toast = document.createElement("div");
    toast.className = "sadu-game-toast";
    toast.innerHTML = '<span class="sadu-game-toast-icon">🌿</span><span>' + message + "</span>";
    layer.appendChild(toast);

    window.setTimeout(function () {
      toast.classList.add("is-visible");
    }, 10);

    window.setTimeout(function () {
      toast.classList.remove("is-visible");
      window.setTimeout(function () {
        toast.remove();
      }, 220);
    }, 2400);
  }

  function renderCardModal(layer, card, count) {
    layer.hidden = false;
    layer.innerHTML = [
      '<div class="sadu-game-modal-shell" data-game-shell="card">',
      '<button type="button" class="sadu-game-modal-backdrop" data-game-close-card aria-label="Đóng thẻ"></button>',
      '<div class="sadu-game-modal sadu-game-modal--card" role="dialog" aria-modal="true" aria-labelledby="sadu-game-card-title">',
      '<button type="button" class="sadu-game-modal-close" data-game-close-card aria-label="Đóng thẻ">×</button>',
      '<div class="sadu-game-card-flip is-flipped">',
      '<div class="sadu-game-card-face sadu-game-card-face--front">',
      '<span class="sadu-game-card-kicker">Thẻ Sống Lành</span>',
      '<div class="sadu-game-card-emoji">' + card.emoji + "</div>",
      '<h2 id="sadu-game-card-title">' + card.title + "</h2>",
      '<p class="sadu-game-card-copy">' + card.copy + "</p>",
      '<div class="sadu-game-card-progress">Bạn đã khám phá <strong>' + count + " / 5</strong> Thẻ Sống Lành</div>",
      '<button type="button" class="sadu-game-btn sadu-game-btn--primary sadu-game-btn--wide" data-game-collect-card>Tiếp tục khám phá</button>',
      "</div>",
      "</div>",
      "</div>",
      "</div>"
    ].join("");
  }

  function renderRewardModal(layer, options) {
    var copied = options && options.copied;
    var opened = options && options.opened;

    layer.hidden = false;
    layer.innerHTML = [
      '<div class="sadu-game-modal-shell" data-game-shell="reward">',
      '<button type="button" class="sadu-game-modal-backdrop" data-game-close-reward aria-label="Đóng hộp quà"></button>',
      '<div class="sadu-game-modal sadu-game-modal--reward" role="dialog" aria-modal="true" aria-labelledby="sadu-game-reward-title">',
      '<button type="button" class="sadu-game-modal-close" data-game-close-reward aria-label="Đóng hộp quà">×</button>',
      '<div class="sadu-game-modal-stage">',
      '<div class="sadu-game-gift-stage' + (opened ? " is-opened" : "") + '">',
      giftBoxMarkup(),
      "</div>",
      '<div class="sadu-game-reward' + (opened ? " is-visible" : "") + '"' + (opened ? "" : ' hidden') + ">",
      '<p class="sadu-game-reward-kicker">🎉 Bạn đã hoàn thành</p>',
      '<h2 id="sadu-game-reward-title">Hành Trình Sống Lành</h2>',
      '<p class="sadu-game-reward-subtitle">Cảm ơn bạn đã cùng SADU khám phá những thói quen nhỏ giúp cuộc sống trở nên lành mạnh hơn.</p>',
      '<div class="sadu-game-voucher-intro">',
      '<span class="sadu-game-voucher-intro-icon">🎁</span>',
      '<p>SADU gửi tặng bạn <strong>1 ống hút lọc và 1 thìa xúc trà</strong> khi hoàn tất đơn hàng với mã quà tặng bên dưới.</p>',
      "</div>",
      '<div class="sadu-game-voucher-card">',
      '<div class="sadu-game-voucher-chip">Mã quà tặng từ SADU</div>',
      '<div class="sadu-game-voucher-code-wrap">',
      '<span class="sadu-game-voucher-code">SONGLANH</span>',
      '<button type="button" class="sadu-game-copy" data-game-copy>Sao chép</button>',
      "</div>",
      '<p class="sadu-game-voucher-timer" data-game-countdown></p>',
      '<p class="sadu-game-copy-feedback" data-game-copy-feedback>' + (copied ? "✓ Đã sao chép" : "") + "</p>",
      "</div>",
      '<div class="sadu-game-reward-cta" data-game-reward-cta' + (copied ? "" : " hidden") + ">",
      '<p class="sadu-game-reward-note">Áp dụng ngay để giữ quà tặng mini game trong đơn hàng hôm nay.</p>',
      '<button type="button" class="sadu-game-btn sadu-game-btn--primary sadu-game-btn--wide" data-game-apply>ÁP DỤNG NGAY</button>',
      "</div>",
      "</div>",
      "</div>",
      "</div>",
      "</div>"
    ].join("");
  }

  function renderHelper(layer) {
    layer.hidden = false;
    layer.innerHTML = [
      '<div class="sadu-game-helper">',
      '<span class="sadu-game-helper-icon">🎁</span>',
      "<div>",
      '<p class="sadu-game-helper-title">Bạn còn thiếu 1 bước nữa để nhận quà mini game.</p>',
      '<p class="sadu-game-helper-copy">Điền thông tin đặt hàng để SADU giữ quà cho bạn.</p>',
      "</div>",
      "</div>"
    ].join("");
  }

  function renderReturnBadge(layer) {
    layer.hidden = false;
    layer.innerHTML = [
      '<button type="button" class="sadu-game-return-card" data-game-return>',
      '<span class="sadu-game-return-icon">🌿</span>',
      "<span>",
      "<strong>Bạn đã hoàn thành Hành Trình Sống Lành.</strong>",
      "<small>Mã quà SONGLANH vẫn sẵn sàng để nhận quà tặng.</small>",
      "</span>",
      "</button>"
    ].join("");
  }

  window.SADUGameUI = {
    createRoot: createRoot,
    createLeafButton: createLeafButton,
    renderBubble: renderBubble,
    renderHud: renderHud,
    renderToast: renderToast,
    renderCardModal: renderCardModal,
    renderRewardModal: renderRewardModal,
    renderHelper: renderHelper,
    renderReturnBadge: renderReturnBadge
  };
})(window, document);
