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
  var countdownTimer = 0;
  var focusTrapCleanup = null;
  var copiedVoucher = false;
  var giftOpened = false;
  var gameStarted = false;
  var voucherApplied = false;
  var quizTriggered = false;
  var hiddenSinceLastVisit = false;
  var activeLeafLayout = null;
  var voucherCode = "SONGLANH";
  var leafLayouts = [
    {
      id: "garden-a",
      placements: {
        hero: { section: "hero", selector: "#top .hero-copy-body, #top .hero-copy", position: { top: "10px", right: "10px" } },
        origin: { section: "origin", selector: ".ingredients-grid .ingredient-card:first-child", position: { top: "10px", right: "10px" } },
        process: { section: "collection", selector: "#products .section-heading", position: { top: "10px", right: "10px" } },
        collection: { section: "story", selector: "#story", position: { top: "12px", right: "12px" } }
      }
    },
    {
      id: "garden-b",
      placements: {
        hero: { section: "hero", selector: "#top .hero-copy-body, #top .hero-copy", position: { top: "12px", left: "10px" } },
        origin: { section: "origin", selector: ".ingredients-grid .ingredient-card:first-child", position: { top: "10px", left: "10px" } },
        process: { section: "story", selector: "#story", position: { top: "12px", right: "12px" } },
        collection: { section: "press", selector: "#press .section-heading", position: { top: "10px", right: "10px" } }
      }
    },
    {
      id: "garden-c",
      placements: {
        hero: { section: "hero", selector: "#top .hero-copy-body, #top .hero-copy", position: { top: "10px", right: "10px" } },
        origin: { section: "collection", selector: "#products .section-heading", position: { top: "10px", left: "10px" } },
        process: { section: "story", selector: "#story", position: { top: "12px", left: "12px" } },
        collection: { section: "press", selector: "#press .section-heading", position: { top: "10px", right: "10px" } }
      }
    },
    {
      id: "garden-d",
      placements: {
        hero: { section: "origin", selector: ".ingredients-grid .ingredient-card:first-child", position: { top: "10px", right: "10px" } },
        origin: { section: "collection", selector: "#products .section-heading", position: { top: "10px", right: "10px" } },
        process: { section: "story", selector: "#story", position: { top: "12px", left: "12px" } },
        collection: { section: "press", selector: "#press .section-heading", position: { top: "10px", left: "10px" } }
      }
    },
    {
      id: "garden-e",
      placements: {
        hero: { section: "hero", selector: "#top .hero-copy-body, #top .hero-copy", position: { top: "12px", left: "10px" } },
        origin: { section: "origin", selector: ".ingredients-grid .ingredient-card:first-child", position: { top: "10px", right: "10px" } },
        process: { section: "press", selector: "#press .section-heading", position: { top: "10px", left: "10px" } },
        collection: { section: "pricing", selector: "#pricing .combo-builder-head", position: { top: "10px", right: "10px" } }
      }
    }
  ];
  var cards = [
    {
      id: "hero",
      section: "hero",
      sectionLabel: "Hero",
      selector: "#top .hero-copy-body, #top .hero-copy",
      label: "Bắt đầu từ điều nhỏ",
      title: "BẮT ĐẦU TỪ ĐIỀU NHỎ",
      emoji: "🌱",
      copy: "Mỗi lựa chọn lành mạnh hôm nay sẽ tạo nên một cuộc sống khỏe mạnh hơn ngày mai.",
      position: { top: "8px", right: "8px" }
    },
    {
      id: "origin",
      section: "origin",
      sectionLabel: "Nguyên liệu",
      selector: ".ingredients-grid .ingredient-card:first-child",
      label: "Uống đủ nước",
      title: "UỐNG ĐỦ NƯỚC",
      emoji: "💧",
      copy: "Một cơ thể khỏe mạnh luôn bắt đầu từ những thói quen đơn giản.",
      position: { top: "10px", right: "10px" }
    },
    {
      id: "process",
      section: "process",
      sectionLabel: "Quy trình",
      selector: "#story",
      label: "Ăn thực phẩm tự nhiên",
      title: "ĂN THỰC PHẨM TỰ NHIÊN",
      emoji: "🌿",
      copy: "Hãy ưu tiên những thực phẩm có nguồn gốc rõ ràng và ít chế biến.",
      position: { top: "6px", right: "6px" }
    },
    {
      id: "collection",
      section: "order",
      sectionLabel: "Bộ sưu tập",
      selector: "#order .section-heading, [data-order-form-section] .section-heading",
      label: "Vận động mỗi ngày",
      title: "VẬN ĐỘNG MỖI NGÀY",
      emoji: "🚶",
      copy: "Chỉ cần 20 phút vận động cũng giúp cơ thể tràn đầy năng lượng.",
      position: { top: "10px", right: "10px" }
    },
    {
      id: "quiz",
      section: "combo",
      sectionLabel: "Combo",
      selector: "#pricing .section-heading",
      label: "Lá câu đố VietGAP",
      title: "CÂU ĐỐ VIETGAP",
      emoji: "🌿",
      copy: "Trả lời đúng để mở hộp quà từ SADU.",
      position: { top: "8px", right: "8px" }
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

    bindVisibilityPrompt();

    if (state.journey_completed && state.voucher_unlocked) {
      showReturnVisitor();
      return;
    }

    window.setTimeout(function () {
      showInvite("start");
    }, 8000);
  }

  function bindVisibilityPrompt() {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        hiddenSinceLastVisit = true;
        return;
      }

      if (!hiddenSinceLastVisit) return;
      hiddenSinceLastVisit = false;

      if (state.journey_completed && state.voucher_unlocked) return;
      if (layers.modal && !layers.modal.hidden) return;

      if (!gameStarted) {
        showInvite("return");
        return;
      }

      ui.renderToast(layers.toast, "Bạn vừa quay lại. Hãy tìm nốt những lá còn lại để mở quà từ SADU.");
    }, { passive: true });
  }

  function showInvite(mode) {
    ui.renderBubble(layers.bubble, { mode: mode });

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
    activeLeafLayout = activeLeafLayout || pickLeafLayout();

    ui.renderHud(layers.hud);
    mountLeaves();
    updateHud();
    highlightNextLeaf();
    showHint();

    if (state.cards_collected.length >= 4 && !state.journey_completed) {
      revealFinalQuiz();
    }
  }

  function mountLeaves() {
    leaves = cards.map(function (card, index) {
      var placement = getLeafPlacement(card);
      var target = resolveTarget(placement.selector);
      var button;
      var isFinal = index === cards.length - 1;

      if (!target) return null;

      card.runtimeSection = placement.section || card.section;

      target.classList.add("sadu-game-anchor");
      button = ui.createLeafButton({
        id: card.id,
        sectionLabel: card.sectionLabel,
        label: card.label
      });

      button.style.top = placement.position.top;
      if (placement.position.left) {
        button.style.left = placement.position.left;
      } else {
        button.style.left = "";
      }
      if (placement.position.right) {
        button.style.right = placement.position.right;
      } else {
        button.style.right = "";
      }

      if (state.cards_collected.indexOf(card.id) !== -1) {
        button.hidden = true;
        button.classList.add("is-collected");
      } else if (card.id === "collection" && state.cards_collected.length < 3) {
        button.hidden = true;
      } else if (isFinal && state.cards_collected.length < 4) {
        button.hidden = true;
      }

      target.appendChild(button);
      button.addEventListener("click", function () {
        if (isFinal) {
          openQuizLeaf(card, button, index + 1);
          return;
        }
        openHealthyCard(card, button, index + 1);
      }, { passive: true });

      return {
        card: card,
        button: button,
        placement: placement
      };
    }).filter(Boolean);
  }

  function pickLeafLayout() {
    return leafLayouts[Math.floor(Math.random() * leafLayouts.length)] || leafLayouts[0];
  }

  function getLeafPlacement(card) {
    var runtimePlacement;
    if (card.id === "quiz") return card;
    if (card.id === "collection") return card;
    runtimePlacement = activeLeafLayout && activeLeafLayout.placements
      ? activeLeafLayout.placements[card.id]
      : null;
    return runtimePlacement || card;
  }

  function resolveTarget(selectorList) {
    var selectors = String(selectorList).split(",");
    var i;
    for (i = 0; i < selectors.length; i += 1) {
      var node = document.querySelector(selectors[i].trim());
      if (node) return node;
    }
    return null;
  }

  function openHealthyCard(card, button, number) {
    if (state.cards_collected.indexOf(card.id) !== -1) return;

    tracking.trackHealthyCardOpen(cardPayload(card, number));
    ui.renderCardModal(layers.modal, card, state.cards_collected.length + 1);
    layers.modal.hidden = false;
    bindFocusTrap();

    layers.modal.querySelectorAll("[data-game-close-card]").forEach(function (node) {
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

    if (state.cards_collected.length === 3) {
      window.setTimeout(revealOrderLeaf, 320);
    }

    if (state.cards_collected.length === 4) {
      window.setTimeout(revealFinalQuiz, 420);
    }
  }

  function revealOrderLeaf() {
    var orderLeaf = getOrderLeaf();

    if (!orderLeaf || state.cards_collected.indexOf("collection") !== -1) return;

    orderLeaf.button.hidden = false;
    orderLeaf.button.classList.add("is-next");
    ui.renderToast(layers.toast, "Lá thứ 4 đã mở tại form đặt hàng. Kéo xuống phần điền thông tin để nhận tiếp thẻ Sống Lành.");
  }

  function revealFinalQuiz() {
    var finalLeaf = getFinalLeaf();

    if (!finalLeaf || quizTriggered || state.journey_completed) return;
    quizTriggered = true;

    finalLeaf.button.hidden = false;
    finalLeaf.button.classList.add("is-next", "is-quiz");
    ui.renderToast(layers.toast, "Lá thứ 5 đã tự mở. Hãy trả lời câu đố về tiêu chuẩn trồng trà SADU.");

    window.setTimeout(function () {
      openQuizLeaf(finalLeaf.card, finalLeaf.button, 5);
    }, 720);
  }

  function openQuizLeaf(card, button, number) {
    var input;

    if (state.cards_collected.indexOf(card.id) !== -1) return;
    if (state.cards_collected.length < 4) return;

    tracking.trackHealthyCardOpen(cardPayload(card, number));
    ui.renderQuizModal(layers.modal);
    layers.modal.hidden = false;
    bindFocusTrap();

    layers.modal.querySelectorAll("[data-game-close-quiz]").forEach(function (node) {
      node.addEventListener("click", closeModal);
    });

    layers.modal.querySelector("[data-game-submit-quiz]").addEventListener("click", function () {
      submitQuizAnswer(card, button, number);
    });

    input = layers.modal.querySelector("#sadu-game-quiz-answer");
    if (input) {
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          submitQuizAnswer(card, button, number);
        }
      });
      input.focus();
    }
  }

  function submitQuizAnswer(card, button, number) {
    var input = layers.modal.querySelector("#sadu-game-quiz-answer");
    var feedback = layers.modal.querySelector("[data-game-quiz-feedback]");
    var value = input ? input.value : "";

    if (containsVietGap(value)) {
      if (feedback) {
        feedback.textContent = "Chính xác. Bạn đã mở khóa hộp quà từ SADU.";
        feedback.classList.remove("is-error");
        feedback.classList.add("is-success");
      }
      window.setTimeout(function () {
        collectFinalLeaf(card, button, number);
      }, 220);
      return;
    }

    if (feedback) {
      feedback.textContent = "Câu trả lời chưa đúng, hãy thử lại.";
      feedback.classList.remove("is-success");
      feedback.classList.add("is-error");
    }
  }

  function collectFinalLeaf(card, button, number) {
    var nextCards;
    var badge = layers.hud.querySelector(".sadu-game-hud-badge");

    if (state.cards_collected.indexOf(card.id) !== -1) return;

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
    ui.renderToast(layers.toast, "Bạn đã vượt qua câu đố lá thứ 5. Hộp quà đang chờ bạn.");
    window.setTimeout(openRewardFlow, 360);
  }

  function containsVietGap(value) {
    return normalizeAnswer(value).indexOf("vietgap") !== -1;
  }

  function normalizeAnswer(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
      .trim();
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
    var nextCard = cards[state.cards_collected.length];
    var nextId = nextCard ? nextCard.id : "";

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
      ui.renderToast(layers.toast, "4 lá đầu đều nằm ngay gần tiêu đề lớn của từng khu vực để bạn dễ thấy hơn.");
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

  function getFinalLeaf() {
    return leaves.find(function (leaf) {
      return leaf.card.id === "quiz";
    });
  }

  function getOrderLeaf() {
    return leaves.find(function (leaf) {
      return leaf.card.id === "collection";
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
      section: card.runtimeSection || card.section
    };
  }

  document.addEventListener("DOMContentLoaded", init, { passive: true });
})(window, document);
