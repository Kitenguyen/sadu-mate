(function (window, document) {
  "use strict";

  var storage = window.SADUGameStorage;
  var tracking = window.SADUGameTracking;
  var animation = window.SADUGameAnimation;
  var ui = window.SADUGameUI;
  var root;
  var layers = {};
  var state;
  var leaves = [];
  var inviteTimer = 0;
  var countdownTimer = 0;
  var focusTrapCleanup = null;
  var copiedVoucher = false;
  var giftOpened = false;
  var gameStarted = false;
  var voucherApplied = false;
  var voucherCode = "SONGLANH";
  var cards = [
    {
      id: "hero",
      section: "hero",
      sectionLabel: "Hero",
      selector: "#top .hero-stage",
      label: "Bắt đầu từ điều nhỏ",
      title: "BẮT ĐẦU TỪ ĐIỀU NHỎ",
      emoji: "🌱",
      copy: "Mỗi lựa chọn lành mạnh hôm nay sẽ tạo nên một cuộc sống khỏe mạnh hơn ngày mai.",
      position: { top: "26px", left: "20px" }
    },
    {
      id: "origin",
      section: "origin",
      sectionLabel: "Nguồn gốc",
      selector: ".seeding-note-panel .seeding-kicker",
      label: "Uống đủ nước",
      title: "UỐNG ĐỦ NƯỚC",
      emoji: "💧",
      copy: "Một cơ thể khỏe mạnh luôn bắt đầu từ những thói quen đơn giản.",
      position: { top: "-8px", right: "8px" }
    },
    {
      id: "process",
      section: "process",
      sectionLabel: "Quy trình",
      selector: ".process-copy .reveal",
      label: "Ăn thực phẩm tự nhiên",
      title: "ĂN THỰC PHẨM TỰ NHIÊN",
      emoji: "🌿",
      copy: "Hãy ưu tiên những thực phẩm có nguồn gốc rõ ràng và ít chế biến.",
      position: { top: "6px", right: "6px" }
    },
    {
      id: "feedback",
      section: "feedback",
      sectionLabel: "Feedback",
      selector: "#reviews .section-heading",
      label: "Vận động mỗi ngày",
      title: "VẬN ĐỘNG MỖI NGÀY",
      emoji: "🚶",
      copy: "Chỉ cần 20 phút vận động cũng giúp cơ thể tràn đầy năng lượng.",
      position: { top: "0", right: "4px" }
    },
    {
      id: "combo",
      section: "combo",
      sectionLabel: "Combo",
      selector: "#pricing .combo-builder-head",
      label: "Sống chậm lại",
      title: "SỐNG CHẬM LẠI",
      emoji: "💚",
      copy: "Hạnh phúc đôi khi chỉ là dành vài phút mỗi ngày để chăm sóc chính mình.",
      position: { top: "-10px", right: "4px" }
    }
  ];

  function init() {
    if (!storage || !tracking || !animation || !ui) return;

    storage.clearLegacy();
    state = storage.read();
    root = ui.createRoot();

    layers.hud = root.querySelector(".sadu-game-layer--hud");
    layers.bubble = root.querySelector(".sadu-game-layer--bubble");
    layers.toast = root.querySelector(".sadu-game-layer--toast");
    layers.modal = root.querySelector(".sadu-game-layer--modal");
    layers.helper = root.querySelector(".sadu-game-layer--helper");
    layers.returnCard = root.querySelector(".sadu-game-layer--return");
    layers.fx = root.querySelector(".sadu-game-layer--fx");

    if (state.journey_completed && state.voucher_unlocked) {
      showReturnVisitor();
      return;
    }

    inviteTimer = window.setTimeout(showInvite, 8000);
  }

  function showInvite() {
    ui.renderBubble(layers.bubble);

    layers.bubble.querySelector("[data-game-start]").addEventListener("click", function () {
      layers.bubble.hidden = true;
      startGame();
    });

    function hideInvite() {
      layers.bubble.hidden = true;
    }

    layers.bubble.querySelector("[data-game-close-invite]").addEventListener("click", hideInvite);
    layers.bubble.querySelector("[data-game-skip]").addEventListener("click", hideInvite);
  }

  function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    ui.renderHud(layers.hud);
    mountLeaves();
    updateHud();
    highlightNextLeaf();
    showHint();
  }

  function mountLeaves() {
    leaves = cards.map(function (card, index) {
      var target = document.querySelector(card.selector);
      var button;

      if (!target) return null;

      target.classList.add("sadu-game-anchor");
      button = ui.createLeafButton({
        id: card.id,
        sectionLabel: card.sectionLabel,
        label: card.label
      });

      button.style.top = card.position.top;
      if (card.position.left) button.style.left = card.position.left;
      if (card.position.right) button.style.right = card.position.right;

      if (state.cards_collected.indexOf(card.id) !== -1) {
        button.hidden = true;
        button.classList.add("is-collected");
      }

      target.appendChild(button);
      button.addEventListener("click", function () {
        openHealthyCard(card, button, index + 1);
      }, { passive: true });

      return {
        card: card,
        button: button
      };
    }).filter(Boolean);
  }

  function openHealthyCard(card, button, number) {
    if (state.cards_collected.indexOf(card.id) !== -1) return;

    tracking.trackHealthyCardOpen(cardPayload(card, number));
    ui.renderCardModal(layers.modal, card, state.cards_collected.length + 1);
    layers.modal.hidden = false;

    bindFocusTrap();

    var closeNodes = layers.modal.querySelectorAll("[data-game-close-card]");
    closeNodes.forEach(function (node) {
      node.addEventListener("click", closeModal);
    });

    layers.modal.querySelector("[data-game-collect-card]").addEventListener("click", function () {
      collectCard(card, button, number);
    });
  }

  function collectCard(card, button, number) {
    var nextCards;
    var badge = layers.hud.querySelector(".sadu-game-hud-badge");

    if (state.cards_collected.indexOf(card.id) !== -1) {
      closeModal();
      return;
    }

    nextCards = state.cards_collected.concat(card.id);
    state = storage.update({
      cards_collected: nextCards
    });

    tracking.trackHealthyCardCollected(cardPayload(card, number));

    if (button) {
      button.disabled = true;
      button.classList.add("is-collected");
      animation.burstParticles(button.getBoundingClientRect(), layers.fx, "rgba(140, 190, 104, 0.95)");
      animation.flyToTarget(button, badge, layers.fx, function () {
        button.hidden = true;
      });
    }

    closeModal();
    updateHud();
    highlightNextLeaf();
    ui.renderToast(layers.toast, "Bạn đã khám phá " + state.cards_collected.length + " / 5 Thẻ Sống Lành");

    if (state.cards_collected.length === cards.length) {
      window.setTimeout(openRewardFlow, 380);
    }
  }

  function updateHud() {
    var countNode = layers.hud.querySelector("[data-game-count]");
    var progressNode = layers.hud.querySelector("[data-game-progress]");
    var ratio = state.cards_collected.length / cards.length;

    if (!countNode || !progressNode) return;

    countNode.textContent = String(state.cards_collected.length);
    progressNode.style.width = Math.round(ratio * 100) + "%";
  }

  function highlightNextLeaf() {
    var nextId = cards[state.cards_collected.length] ? cards[state.cards_collected.length].id : "";

    leaves.forEach(function (leaf) {
      leaf.button.classList.remove("is-next");
      if (!leaf.button.hidden && leaf.card.id === nextId) {
        leaf.button.classList.add("is-next");
      }
    });
  }

  function showHint() {
    window.setTimeout(function () {
      if (!gameStarted || state.cards_collected.length >= cards.length) return;
      ui.renderToast(layers.toast, "Lá sáng nằm ngay gần tiêu đề hoặc phần mở đầu của từng khu vực để bạn dễ thấy hơn.");
    }, 12000);
  }

  function openRewardFlow() {
    state = storage.update({
      journey_completed: true,
      voucher_unlocked: true
    });

    tracking.trackHealthyJourneyCompleted({
      section: "reward",
      cards_total: cards.length,
      journey_state: "completed"
    });
    tracking.trackVoucherUnlocked({
      section: "reward",
      voucher_code: voucherCode
    });

    openRewardModal(false);
  }

  function openRewardModal(opened) {
    giftOpened = !!opened;
    ui.renderRewardModal(layers.modal, {
      copied: copiedVoucher || voucherApplied,
      opened: giftOpened
    });
    layers.modal.hidden = false;

    bindFocusTrap();
    bindRewardEvents();
    updateCountdown();
    window.clearInterval(countdownTimer);
    countdownTimer = window.setInterval(updateCountdown, 1000);
  }

  function bindRewardEvents() {
    var closeNodes = layers.modal.querySelectorAll("[data-game-close-reward]");
    var giftButton = layers.modal.querySelector("[data-game-open-gift]");
    var copyButton = layers.modal.querySelector("[data-game-copy]");
    var applyButton = layers.modal.querySelector("[data-game-apply]");

    closeNodes.forEach(function (node) {
      node.addEventListener("click", closeModal);
    });

    if (giftButton) {
      giftButton.addEventListener("click", revealReward);
    }

    if (copyButton) {
      copyButton.addEventListener("click", copyVoucher);
    }

    if (applyButton) {
      applyButton.addEventListener("click", function () {
        scrollToOrder(true);
      });
    }
  }

  function revealReward() {
    var giftStage = layers.modal.querySelector(".sadu-game-gift-stage");
    var reward = layers.modal.querySelector(".sadu-game-reward");

    if (giftOpened) return;
    giftOpened = true;

    if (giftStage) giftStage.classList.add("is-opened");
    if (reward) {
      reward.hidden = false;
      window.requestAnimationFrame(function () {
        reward.classList.add("is-visible");
      });
    }

    animation.showerConfetti(layers.fx);
  }

  function copyVoucher() {
    var feedbackNode = layers.modal.querySelector("[data-game-copy-feedback]");
    var ctaWrap = layers.modal.querySelector("[data-game-reward-cta]");

    function finalizeCopy(successMessage) {
      copiedVoucher = true;
      if (feedbackNode) feedbackNode.textContent = successMessage;
      if (ctaWrap) ctaWrap.hidden = false;
      ui.renderHelper(layers.helper);
      tracking.trackVoucherCopied({
        section: "reward",
        voucher_code: voucherCode
      });
    }

    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
      finalizeCopy("✓ Đã sao chép");
      return;
    }

    navigator.clipboard.writeText(voucherCode).then(function () {
      finalizeCopy("✓ Đã sao chép");
    }).catch(function () {
      finalizeCopy("✓ Đã sao chép");
    });
  }

  function scrollToOrder(shouldFocus) {
    var section = document.querySelector("#order");
    var target = document.querySelector("[data-order-form]");

    tracking.trackScrollToOrder({
      section: "order",
      voucher_code: voucherCode
    });

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    window.setTimeout(function () {
      if (applyVoucherToForm()) {
        ui.renderHelper(layers.helper);
      }

      if (shouldFocus && target) {
        var firstInput = target.querySelector("input, select, textarea, button");
        if (firstInput) firstInput.focus();
      }
    }, 520);
  }

  function applyVoucherToForm() {
    var input = document.querySelector("[data-voucher-code]");
    var status;

    if (!input) return false;

    input.value = voucherCode;
    input.setAttribute("data-game-filled", "true");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(new Event("blur", { bubbles: true }));

    status = ensureVoucherStatus(input);
    status.textContent = "Mã quà SONGLANH đã được áp dụng để nhận ống hút lọc và thìa xúc trà.";

    if (!voucherApplied) {
      voucherApplied = true;
      tracking.trackVoucherApplied({
        section: "order",
        voucher_code: voucherCode
      });
    }

    return true;
  }

  function ensureVoucherStatus(input) {
    var next = input.nextElementSibling;
    if (next && next.hasAttribute("data-game-voucher-status")) {
      return next;
    }

    next = document.createElement("p");
    next.className = "sadu-game-form-status";
    next.setAttribute("data-game-voucher-status", "true");
    next.setAttribute("aria-live", "polite");
    input.insertAdjacentElement("afterend", next);
    return next;
  }

  function updateCountdown() {
    var node = layers.modal.querySelector("[data-game-countdown]");
    var startedAt = Number(sessionStorage.getItem("sadu_game_voucher_started_at") || Date.now());
    var expiresAt;
    var remaining;
    var minutes;
    var seconds;

    if (!node) return;

    if (!sessionStorage.getItem("sadu_game_voucher_started_at")) {
      sessionStorage.setItem("sadu_game_voucher_started_at", String(startedAt));
    }

    expiresAt = startedAt + (15 * 60 * 1000);
    remaining = Math.max(0, expiresAt - Date.now());
    minutes = Math.floor(remaining / 60000);
    seconds = Math.floor((remaining % 60000) / 1000);

    if (remaining <= 0) {
      node.textContent = "Mã quà vẫn được áp dụng khi bạn hoàn tất đơn hàng hôm nay.";
      return;
    }

    node.textContent =
      "Mã quà được giữ trong " +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0");
  }

  function showReturnVisitor() {
    ui.renderReturnBadge(layers.returnCard);
    layers.returnCard.querySelector("[data-game-return]").addEventListener("click", function () {
      copiedVoucher = true;
      openRewardModal(true);
      revealReward();
    });
  }

  function closeModal() {
    layers.modal.hidden = true;
    layers.modal.innerHTML = "";
    window.clearInterval(countdownTimer);
    countdownTimer = 0;
    releaseFocusTrap();
  }

  function bindFocusTrap() {
    var modal = layers.modal.querySelector(".sadu-game-modal");
    var focusables;
    var first;
    var last;

    releaseFocusTrap();

    if (!modal) return;

    focusables = Array.prototype.slice.call(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    );
    first = focusables[0];
    last = focusables[focusables.length - 1];

    if (first) first.focus();

    focusTrapCleanup = function (event) {
      if (event.key === "Escape") {
        closeModal();
        return;
      }
      if (event.key !== "Tab" || !first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    modal.addEventListener("keydown", focusTrapCleanup);
  }

  function releaseFocusTrap() {
    var modal = layers.modal.querySelector(".sadu-game-modal");
    if (modal && focusTrapCleanup) {
      modal.removeEventListener("keydown", focusTrapCleanup);
    }
    focusTrapCleanup = null;
  }

  function cardPayload(card, number) {
    return {
      card_number: number,
      card_name: card.title,
      leaf_number: number,
      leaf_name: card.label,
      section: card.section
    };
  }

  document.addEventListener("DOMContentLoaded", init, { passive: true });
})(window, document);
