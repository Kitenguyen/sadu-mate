/* ==========================================================================
   SADU Mate — Hành vi trang (thuần JavaScript, không dùng framework)
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.SADU_DATA;

  // ------------------------------------------------------------------
  // WEBHOOK CONFIG — dán URL Apps Script /exec của bạn vào đây
  // ------------------------------------------------------------------
  var GOOGLE_SHEETS_WEBHOOK_URL =
    "https://script.google.com/macros/s/AKfycbxx5Mq_Te0scuf3LqdIIKw-Rvq3UzKqLdB4ENdQ4u7wCkAAmdbpcs6bewRhZfwgKi0V5Q/exec";
  // Ví dụ:
  // var GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec";

  var UPSELL_PRODUCTS = [
    {
      id: "herbal-eggs",
      name: "Trá»©ng gÃ  tháº£o dÆ°á»£c Sadu 1 há»™p (12 quáº£)",
      tagline: "Bá»• sung thá»±c pháº©m sáº¡ch, dá»… dÃ¹ng háº±ng ngÃ y cho gia Ä‘Ã¬nh.",
      priceText: "119.500â‚«",
      priceValue: 119500,
      image: "assets/farm-sunrise.webp",
      href: "https://www.sadu.com.vn/product-page/tr%E1%BB%A9ng-g%C3%A0-th%E1%BA%A3o-d%C6%B0%E1%BB%A3c-sadu-1-h%E1%BB%99p-12-qu%E1%BA%A3"
    },
    {
      id: "perilla-nightshade-tea",
      name: "TrÃ  cÃ  gai leo tÃ­a tÃ´ Sadu gÃ³i 250g",
      tagline: "PhiÃªn báº£n trÃ  Ä‘áº­m vá»‹ hÆ¡n cho khÃ¡ch muá»‘n má»Ÿ rá»™ng lá»±a chá»n.",
      priceText: "126.000â‚«",
      priceValue: 126000,
      image: "assets/product-nightshade.webp",
      href: "https://www.sadu.com.vn/product-page/tr%C3%A0-c%C3%A0-gai-leo-t%C3%ADa-t%C3%B4"
    },
    {
      id: "nightshade-black-weed-1kg",
      name: "TrÃ  cÃ  gai leo xáº¡ Ä‘en Sadu 1kg",
      tagline: "DÃ²ng khá»‘i lÆ°á»£ng lá»›n phÃ¹ há»£p cho nhu cáº§u dÃ¹ng Ä‘á»u vÃ  dÃ i ngÃ y.",
      priceText: "396.000â‚«",
      priceValue: 396000,
      image: "assets/product-nightshade-lotus.webp",
      href: "https://www.sadu.com.vn/product-page/c%C3%A0-gai-leo-x%E1%BA%A1-%C4%91ensadu"
    },
    {
      id: "nightshade-bagged-1kg",
      name: "TrÃ  tÃºi lá»c cÃ  gai leo Sadu 1kg",
      tagline: "TÃºi lá»c tiá»‡n pha nhanh, há»£p khÃ¡ch Æ°u tiÃªn sá»± tiá»‡n lá»£i.",
      priceText: "396.000â‚«",
      priceValue: 396000,
      image: "assets/product-chrysanthemum.webp",
      href: "https://www.sadu.com.vn/product-page/tr%C3%A0-t%C3%BAi-l%E1%BB%8Dc-c%C3%A0-gai-leo-sadu-1kg"
    },
    {
      id: "phuc-loc-tho-combo",
      name: "Combo TrÃ  PhÃºc Lá»™c Thá»",
      tagline: "Combo thÃ£o má»™c phÃ¹ há»£p cho khÃ¡ch muá»‘n mua theo bá»™ quÃ  hoáº·c dÃ¹ng gia Ä‘Ã¬nh.",
      priceText: "Xem giÃ¡ trÃªn web",
      priceValue: 2200000,
      image: "assets/product-nightshade-lotus.webp",
      href: "https://www.sadu.com.vn/product-page/combo-tr%C3%A0-ph%C3%BAc-l%E1%BB%99c-th%E1%BB%8D"
    }
  ];

  var UPSELL_PRODUCT_COPY = {
    "herbal-eggs": {
      name: "Tr\u1EE9ng g\u00E0 th\u1EA3o d\u01B0\u1EE3c Sadu 1 h\u1ED9p (12 qu\u1EA3)",
      tagline: "B\u1ED5 sung th\u1EF1c ph\u1EA9m s\u1EA1ch, d\u1EC5 d\u00F9ng h\u1EB1ng ng\u00E0y cho gia \u0111\u00ECnh.",
      priceText: "119.500\u20AB"
    },
    "perilla-nightshade-tea": {
      name: "Tr\u00E0 c\u00E0 gai leo t\u00EDa t\u00F4 Sadu g\u00F3i 250g",
      tagline: "Phi\u00EAn b\u1EA3n tr\u00E0 \u0111\u1EADm v\u1ECB h\u01A1n cho kh\u00E1ch mu\u1ED1n m\u1EDF r\u1ED9ng l\u1EF1a ch\u1ECDn.",
      priceText: "126.000\u20AB"
    },
    "nightshade-black-weed-1kg": {
      name: "Tr\u00E0 c\u00E0 gai leo x\u1EA1 \u0111en Sadu 1kg",
      tagline: "D\u00F2ng kh\u1ED1i l\u01B0\u1EE3ng l\u1EDBn ph\u00F9 h\u1EE3p cho nhu c\u1EA7u d\u00F9ng \u0111\u1EC1u v\u00E0 d\u00E0i ng\u00E0y.",
      priceText: "396.000\u20AB"
    },
    "nightshade-bagged-1kg": {
      name: "Tr\u00E0 t\u00FAi l\u1ECDc c\u00E0 gai leo Sadu 1kg",
      tagline: "T\u00FAi l\u1ECDc ti\u1EC7n pha nhanh, h\u1EE3p kh\u00E1ch \u01B0u ti\u00EAn s\u1EF1 ti\u1EC7n l\u1EE3i.",
      priceText: "396.000\u20AB"
    },
    "phuc-loc-tho-combo": {
      name: "Combo Tr\u00E0 Ph\u00FAc L\u1ED9c Th\u1ECD",
      tagline: "Combo th\u1EA3o m\u1ED9c ph\u00F9 h\u1EE3p cho kh\u00E1ch mu\u1ED1n mua theo b\u1ED9 qu\u00E0 ho\u1EB7c d\u00F9ng gia \u0111\u00ECnh.",
      priceText: "2.200.000\u20AB"
    }
  };

  UPSELL_PRODUCTS.forEach(function (product) {
    var copy = UPSELL_PRODUCT_COPY[product.id];
    if (!copy) return;
    product.name = copy.name;
    product.tagline = copy.tagline;
    product.priceText = copy.priceText;
  });

  var selectedUpsellQuantities = {};

  function getSelectedUpsellProducts() {
    return UPSELL_PRODUCTS.filter(function (product) {
      return (selectedUpsellQuantities[product.id] || 0) > 0;
    });
  }

  function isUpsellSelected(productId) {
    return (selectedUpsellQuantities[productId] || 0) > 0;
  }

  function toggleUpsellSelection(productId) {
    if (selectedUpsellQuantities[productId]) {
      delete selectedUpsellQuantities[productId];
    } else {
      selectedUpsellQuantities[productId] = 1;
    }
  }

  function getUpsellSubtotal() {
    return getSelectedUpsellProducts().reduce(function (sum, product) {
      return sum + ((product.priceValue || 0) * (selectedUpsellQuantities[product.id] || 0));
    }, 0);
  }

  function getGrandTotal() {
    return getPricing().subtotal + getUpsellSubtotal();
  }

  function buildUpsellNote() {
    var selected = getSelectedUpsellProducts();
    if (!selected.length) return "";
    return "Mua k\u00E8m tham kh\u1EA3o: " + selected.map(function (product) {
      return product.name + " x" + (selectedUpsellQuantities[product.id] || 1);
    }).join(", ");
  }

  function mergeOrderNote(baseNote) {
    var upsellNote = buildUpsellNote();
    if (!upsellNote) return baseNote;
    if (!baseNote) return upsellNote;
    return baseNote + " | " + upsellNote;
  }

  function renderUpsellSummary() {
    var summary = document.querySelector("[data-upsell-summary]");
    var summaryText = document.querySelector("[data-upsell-summary-text]");
    if (!summary || !summaryText) return;

    var upsellNote = buildUpsellNote();
    if (!upsellNote) {
      summary.hidden = true;
      summaryText.textContent = "";
      return;
    }

    summary.hidden = false;
    summaryText.textContent = upsellNote.replace("Mua k\u00E8m tham kh\u1EA3o: ", "");
  }

  function renderUpsellShowcase() {
    var container = document.querySelector("[data-upsell-showcase-grid]");
    if (!container) return;

    container.innerHTML = UPSELL_PRODUCTS.map(function (product) {
      var selected = isUpsellSelected(product.id);
      var fakeSold = getFakeSoldCount(product.id, 120, 360);
      return (
        '<article class="upsell-showcase-card">' +
        '<img src="' + product.image + '" alt="' + product.name + '" width="320" height="320" loading="lazy">' +
        '<div class="upsell-showcase-copy">' +
        '<p class="upsell-showcase-name">' + product.name + "</p>" +
        '<span class="upsell-sold-badge">Đã bán ' + fakeSold.toLocaleString("vi-VN") + "</span>" +
        '<p class="upsell-showcase-tagline">' + product.tagline + "</p>" +
        '<p class="upsell-showcase-price">' + product.priceText + "</p>" +
        "</div>" +
        '<button type="button" class="upsell-showcase-btn' + (selected ? " is-selected" : "") + '" data-upsell-showcase-add="' + product.id + '">' + (selected ? "\u0110\u00E3 th\u00EAm x" + (selectedUpsellQuantities[product.id] || 1) : "Th\u00EAm v\u00E0o gi\u1ECF") + "</button>" +
        "</article>"
      );
    }).join("");

    Array.prototype.slice.call(container.querySelectorAll("[data-upsell-showcase-add]")).forEach(function (button) {
      button.addEventListener("click", function () {
        toggleUpsellSelection(button.getAttribute("data-upsell-showcase-add"));
        renderUpsellShowcase();
        renderCrossSell();
        renderOrderSummary();
        renderCartUi();
      });
    });

    initUpsellShowcaseSlider();
  }

  function initUpsellShowcaseSlider() {
    var container = document.querySelector("[data-upsell-showcase-grid]");
    if (!container) return;

    if (container._upsellAutoplayTimer) {
      window.clearInterval(container._upsellAutoplayTimer);
      container._upsellAutoplayTimer = null;
    }

    if (window.innerWidth >= 768) {
      container.scrollLeft = 0;
      return;
    }

    var cards = Array.prototype.slice.call(container.querySelectorAll(".upsell-showcase-card"));
    if (cards.length < 2) return;

    function getStepWidth() {
      var card = cards[0];
      if (!card) return 0;
      var cardWidth = card.getBoundingClientRect().width;
      var styles = window.getComputedStyle(container);
      var gap = parseFloat(styles.columnGap || styles.gap || "0");
      return cardWidth + gap;
    }

    function nextSlide() {
      var step = getStepWidth();
      if (!step) return;
      var maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
      var nextLeft = container.scrollLeft + step;

      if (nextLeft >= maxScroll - 2) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollTo({ left: nextLeft, behavior: "smooth" });
      }
    }

    function stopAutoplay() {
      if (container._upsellAutoplayTimer) {
        window.clearInterval(container._upsellAutoplayTimer);
        container._upsellAutoplayTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      container._upsellAutoplayTimer = window.setInterval(nextSlide, 3200);
    }

    if (!container._upsellSliderBound) {
      container.addEventListener("mouseenter", stopAutoplay);
      container.addEventListener("mouseleave", startAutoplay);
      container.addEventListener("focusin", stopAutoplay);
      container.addEventListener("focusout", function () {
        window.setTimeout(function () {
          if (!container.contains(document.activeElement) && window.innerWidth < 768) {
            startAutoplay();
          }
        }, 0);
      });
      container.addEventListener("touchstart", stopAutoplay, { passive: true });
      container.addEventListener("touchend", function () {
        if (window.innerWidth < 768) {
          startAutoplay();
        }
      }, { passive: true });
      container._upsellSliderBound = true;
    }

    startAutoplay();
  }

  function hexToRgbChannels(hex) {
    if (!hex) return "47, 107, 60";
    var normalized = String(hex).replace("#", "").trim();
    if (normalized.length === 3) {
      normalized = normalized.split("").map(function (char) { return char + char; }).join("");
    }
    if (normalized.length !== 6) return "47, 107, 60";

    var intVal = parseInt(normalized, 16);
    if (Number.isNaN(intVal)) return "47, 107, 60";

    return [
      (intVal >> 16) & 255,
      (intVal >> 8) & 255,
      intVal & 255
    ].join(", ");
  }

  function initHeroAdsVariant() {
    var storageKey = "sadu_hero_variant_v1";
    var hero = document.querySelector(".hero");
    var eyebrowEl = document.querySelector("[data-hero-eyebrow]");
    var titleEl = document.querySelector("[data-hero-title]");
    var descEl = document.querySelector("[data-hero-description]");
    var sublineEl = document.querySelector("[data-hero-subline]");
    var journeyLabelEl = document.querySelector("[data-hero-journey-label]");
    var journeyMoodEl = document.querySelector("[data-hero-journey-mood]");
    var journeyNoteEl = document.querySelector("[data-hero-journey-note]");
    var primaryCtaEl = document.querySelector("[data-hero-primary-cta]");
    var primaryLabelEl = document.querySelector("[data-hero-primary-label]");
    var secondaryCtaEl = document.querySelector("[data-hero-secondary-cta]");
    var secondaryLabelEl = document.querySelector("[data-hero-secondary-label]");
    var proofValueEls = Array.prototype.slice.call(document.querySelectorAll("[data-hero-proof-value]"));
    var proofLabelEls = Array.prototype.slice.call(document.querySelectorAll("[data-hero-proof-label]"));

    if (
      !hero ||
      !eyebrowEl ||
      !titleEl ||
      !descEl ||
      !sublineEl ||
      !primaryCtaEl ||
      !primaryLabelEl ||
      !secondaryCtaEl ||
      !secondaryLabelEl ||
      proofValueEls.length < 3 ||
      proofLabelEls.length < 3
    ) {
      return;
    }

    var variants = {
      lifestyle: {
        eyebrow: "Thói quen sống lành mạnh dễ bắt đầu mỗi ngày",
        title: "Bắt đầu sống lành mạnh hơn mỗi ngày từ một tách trà thảo mộc dễ uống.",
        description: "SADU MATE kết hợp xạ đen, lá sen và hoa cúc trong công thức thanh nhẹ, tiện pha và phù hợp với người muốn bắt đầu một thói quen tốt đơn giản, sạch và bền vững.",
        subline: "Dễ uống mỗi ngày • Thanh toán khi nhận hàng • Đổi trả trong 14 ngày",
        accent: "#2f6b3c",
        journeyLabel: "SADU MATE mỗi ngày",
        journeyMood: "Lành mạnh",
        journeyNote: "Một lựa chọn nhẹ nhàng để bắt đầu thói quen chăm sóc bản thân đều đặn và bền vững hơn mỗi ngày.",
        primaryLabel: "Bắt đầu với SADU MATE",
        primaryHref: "#pricing",
        secondaryLabel: "Xem combo phù hợp",
        secondaryHref: "#pricing",
        proofs: [
          {
            value: "Dễ uống",
            label: "Hương vị thanh nhẹ, phù hợp để bắt đầu thói quen uống trà đều đặn."
          },
          {
            value: "VietGAP",
            label: "Nguồn nguyên liệu được kiểm soát nghiêm ngặt tại Chương Mỹ, Hà Nội."
          },
          {
            value: "COD",
            label: "Đặt hàng tiện lợi trên toàn quốc và thanh toán khi nhận hàng."
          }
        ]
      },
      trust: {
        eyebrow: "Trà xạ đen lá sen từ vùng trồng đạt chuẩn VietGAP",
        title: "Trà xạ đen lá sen sạch, rõ nguồn gốc cho người chọn sống an tâm hơn mỗi ngày.",
        description: "Từ cảm hứng cây xạ đen vùng Mường đến vùng nguyên liệu được chăm sóc theo tiêu chuẩn VietGAP, SADU MATE mang đến một lựa chọn trà thảo mộc sạch, minh bạch và phù hợp với nhịp sống hiện đại.",
        subline: "Nguồn gốc rõ ràng • Sao sấy thủ công • Không chất bảo quản",
        accent: "#6e7a39",
        journeyLabel: "Vùng trồng VietGAP",
        journeyMood: "An tâm",
        journeyNote: "Từ vùng nguyên liệu kiểm soát nghiêm ngặt đến túi trà tiện lợi, mọi điểm chạm đều hướng đến sự minh bạch và sạch.",
        primaryLabel: "Xem sản phẩm ngay",
        primaryHref: "#products",
        secondaryLabel: "Tìm hiểu vùng trồng",
        secondaryHref: "#story",
        proofs: [
          {
            value: "VietGAP",
            label: "Nguyên liệu được trồng và kiểm soát theo quy trình nghiêm ngặt."
          },
          {
            value: "Thủ công",
            label: "Sao sấy để giữ hương thơm và vị tự nhiên của từng loại thảo mộc."
          },
          {
            value: "Minh bạch",
            label: "Lựa chọn phù hợp cho người mua ưu tiên sự rõ ràng và an tâm."
          }
        ]
      },
      offer: {
        eyebrow: "Combo tiết kiệm hơn cho đơn trà thảo mộc hôm nay",
        title: "Chọn combo trà xạ đen lá sen dễ uống mỗi ngày, càng mua càng tiết kiệm.",
        description: "SADU MATE phù hợp cho người muốn duy trì thói quen trà thảo mộc sạch lâu dài. Mua từ 2 hộp được miễn phí ship, combo nhiều hộp có quà tặng và tối ưu chi phí hơn cho đơn đầu tiên.",
        subline: "Mua 3 tặng 1 • Mua 5 tặng 2 • Miễn phí ship từ 2 hộp",
        accent: "#b17a2e",
        journeyLabel: "Combo tiết kiệm",
        journeyMood: "Ưu đãi",
        journeyNote: "Phù hợp cho khách mới muốn vào đơn nhanh với ưu đãi rõ ràng, dễ chốt hơn ngay từ lần truy cập đầu tiên.",
        primaryLabel: "Chọn combo tiết kiệm",
        primaryHref: "#pricing",
        secondaryLabel: "Nhận ưu đãi hôm nay",
        secondaryHref: "#order",
        proofs: [
          {
            value: "Free ship",
            label: "Đơn từ 2 hộp được hỗ trợ miễn phí vận chuyển toàn quốc."
          },
          {
            value: "Ưu đãi",
            label: "Combo nhiều hộp giúp tiết kiệm tốt hơn cho người dùng lâu dài."
          },
          {
            value: "14 ngày",
            label: "Hỗ trợ đổi trả hoặc hoàn tiền nếu trải nghiệm chưa phù hợp."
          }
        ]
      }
    };

    var variantKeys = Object.keys(variants);
    if (!variantKeys.length) return;

    var selectedKey = null;
    try {
      selectedKey = window.localStorage.getItem(storageKey);
    } catch (error) {
      selectedKey = null;
    }

    if (!variants[selectedKey]) {
      selectedKey = variantKeys[Math.floor(Math.random() * variantKeys.length)];
      try {
        window.localStorage.setItem(storageKey, selectedKey);
      } catch (error) {
        // Ignore storage write failures.
      }
    }

    var selected = variants[selectedKey];
    var accent = selected.accent || "#2f6b3c";
    var accentRgb = hexToRgbChannels(accent);
    hero.setAttribute("data-hero-variant", selectedKey);
    hero.style.setProperty("--hero-accent", accent);
    hero.style.setProperty("--hero-accent-rgb", accentRgb);
    hero.style.setProperty("--hero-accent-soft", "rgba(" + accentRgb + ", 0.18)");
    eyebrowEl.textContent = selected.eyebrow;
    titleEl.textContent = selected.title;
    descEl.textContent = selected.description;
    sublineEl.textContent = selected.subline;
    if (journeyLabelEl) journeyLabelEl.textContent = selected.journeyLabel || "";
    if (journeyMoodEl) journeyMoodEl.textContent = selected.journeyMood || "";
    if (journeyNoteEl) journeyNoteEl.textContent = selected.journeyNote || "";
    primaryLabelEl.textContent = selected.primaryLabel;
    primaryCtaEl.setAttribute("href", selected.primaryHref);
    secondaryLabelEl.textContent = selected.secondaryLabel;
    secondaryCtaEl.setAttribute("href", selected.secondaryHref);

    selected.proofs.forEach(function (proof, index) {
      if (proofValueEls[index]) proofValueEls[index].textContent = proof.value;
      if (proofLabelEls[index]) proofLabelEls[index].textContent = proof.label;
    });
  }

  function initHeroMotion() {
    var hero = document.querySelector(".hero");
    var panel = document.querySelector(".hero-copy-body");
    var eyebrow = panel ? panel.querySelector(".eyebrow") : null;
    var title = document.querySelector("[data-hero-title]");
    var description = document.querySelector("[data-hero-description]");
    var journeyCopy = document.querySelector(".hero-journey-copy");
    var actions = document.querySelector(".hero-actions");
    var backgroundImage = document.querySelector(".hero-stage-image");
    var leaves = document.querySelectorAll(".hero-leaf");
    var parallaxRoot = document.querySelector("[data-hero-parallax-root]");
    var contentLayer = document.querySelector('[data-parallax-layer="content"]');
    var primaryCta = document.querySelector(".hero-primary-cta");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var isDesktop = window.matchMedia("(min-width: 1200px)");
    if (!hero) return;

    function updateScrollState() {
      var rect = hero.getBoundingClientRect();
      var total = Math.max(rect.height * 0.72, 1);
      var progress = Math.min(Math.max((-rect.top) / total, 0), 1);
      hero.style.setProperty("--hero-scroll-progress", progress.toFixed(3));
      hero.setAttribute("data-scrolled", progress > 0.02 ? "true" : "false");
    }

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    if (primaryCta) {
      primaryCta.addEventListener("pointermove", function (event) {
        var rect = primaryCta.getBoundingClientRect();
        primaryCta.style.setProperty("--ripple-x", (((event.clientX - rect.left) / rect.width) * 100).toFixed(2) + "%");
        primaryCta.style.setProperty("--ripple-y", (((event.clientY - rect.top) / rect.height) * 100).toFixed(2) + "%");
      });
    }

    if (reduceMotion.matches || !window.gsap) return;

    var tl = window.gsap.timeline({ defaults: { ease: "power3.out" } });

    if (panel) {
      tl.from(panel, {
        y: 28,
        opacity: 0,
        duration: 0.9
      });
    }

    if (eyebrow) {
      tl.from(eyebrow, {
        y: 12,
        opacity: 0,
        duration: 0.4
      }, "-=0.54");
    }

    if (title) {
      tl.from(title, {
        y: 26,
        opacity: 0,
        duration: 0.72
      }, "-=0.28");
    }

    if (description) {
      tl.from(description, {
        y: 22,
        opacity: 0,
        duration: 0.6
      }, "-=0.4");
    }

    if (journeyCopy) {
      tl.from(journeyCopy, {
        y: 18,
        opacity: 0,
        duration: 0.52
      }, "-=0.34");
    }

    if (actions) {
      tl.from(actions.children, {
        y: 14,
        opacity: 0,
        duration: 0.46,
        stagger: 0.08
      }, "-=0.3");
    }

    if (!parallaxRoot || !contentLayer || !backgroundImage) return;

    var removeParallax = null;

    function bindParallax() {
      if (!isDesktop.matches) {
        if (removeParallax) removeParallax();
        removeParallax = null;
        window.gsap.set([contentLayer, backgroundImage], { x: 0, y: 0 });
        return;
      }

      function onMove(e) {
        var rect = parallaxRoot.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;

        window.gsap.to(contentLayer, {
          x: relX * 10,
          y: relY * 8,
          duration: 0.6,
          overwrite: true
        });

        window.gsap.to(backgroundImage, {
          x: relX * -12,
          y: relY * -8,
          duration: 1.2,
          overwrite: true
        });

        if (leaves.length) {
          window.gsap.to(leaves[0], {
            x: relX * -12,
            y: relY * -8,
            duration: 0.7,
            overwrite: true
          });
        }

        if (leaves.length > 1) {
          window.gsap.to(leaves[1], {
            x: relX * 10,
            y: relY * 8,
            duration: 0.75,
            overwrite: true
          });
        }
      }

      function onLeave() {
        window.gsap.to([contentLayer, backgroundImage], {
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "power3.out"
        });

        if (leaves.length) {
          window.gsap.to(leaves, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power3.out"
          });
        }
      }

      parallaxRoot.addEventListener("mousemove", onMove);
      parallaxRoot.addEventListener("mouseleave", onLeave);
      removeParallax = function () {
        parallaxRoot.removeEventListener("mousemove", onMove);
        parallaxRoot.removeEventListener("mouseleave", onLeave);
      };
    }

    bindParallax();
    isDesktop.addEventListener("change", bindParallax);
  }

  function initMetaTrackingBindings() {
    if (!window.SADUTracking) return;

    // Fire ViewContent once after the landing page finishes booting.
    window.SADUTracking.viewContent();

    // Track any CTA that navigates the visitor into the order section.
    document.addEventListener("click", function (event) {
      var orderTarget = event.target.closest('a[href="#order"]');
      if (orderTarget) {
        window.SADUTracking.initiateCheckout();
      }

      var contactTarget = event.target.closest('a[href^="tel:"]');
      if (contactTarget) {
        window.SADUTracking.contact();
      }
    });
  }

  // ==========================================================================
  // 1. NAV — sticky background on scroll + mobile menu toggle
  // ==========================================================================
  function initNav() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-menu");
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && menu) {
      function setMenuState(isOpen) {
        menu.classList.toggle("is-open", isOpen);
        menu.hidden = !isOpen;
        menu.setAttribute("aria-hidden", isOpen ? "false" : "true");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        toggle.innerHTML = isOpen ? ICONS.x : ICONS.menu;
      }

      setMenuState(false);

      toggle.addEventListener("click", function () {
        setMenuState(!menu.classList.contains("is-open"));
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          setMenuState(false);
        });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("is-open")) {
          setMenuState(false);
          toggle.focus();
        }
      });
    }
  }

  // ==========================================================================
  // 2. COUNTDOWN BANNER — daily reset to midnight
  // ==========================================================================
  function initCountdown() {
    var el = document.querySelector("[data-countdown]");
    if (!el) return;

    function getNextMidnight() {
      var now = new Date();
      var midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      return midnight.getTime();
    }

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    var target = getNextMidnight();

    function tick() {
      var remaining = Math.max(0, target - Date.now());
      var total = Math.floor(remaining / 1000);
      var h = Math.floor(total / 3600);
      var m = Math.floor((total % 3600) / 60);
      var s = total % 60;
      el.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
    }

    tick();
    window.setInterval(tick, 1000);
  }

  // ==========================================================================
  // 3. REVEAL — scroll-in animation via IntersectionObserver
  // ==========================================================================
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ==========================================================================
  // 4. ORDER STATE — shared quantity state across Product Collection + Order Form
  // ==========================================================================
  var orderState = {
    quantities: { "nightshade-lotus": 1, nightshade: 1, chrysanthemum: 1 },
    listeners: [],
  };

  function getTotalBoxes() {
    return DATA.PRODUCTS.reduce(function (sum, p) {
      return sum + orderState.quantities[p.id];
    }, 0);
  }

  function getPricing() {
    return DATA.calculatePricing(getTotalBoxes());
  }

  function setQuantity(id, qty) {
    orderState.quantities[id] = Math.max(0, Math.min(30, qty));
    notifyOrderChange();
  }

  function increment(id) {
    setQuantity(id, orderState.quantities[id] + 1);
  }

  function decrement(id) {
    setQuantity(id, orderState.quantities[id] - 1);
  }

  function onOrderChange(fn) {
    orderState.listeners.push(fn);
  }

  function notifyOrderChange() {
    orderState.listeners.forEach(function (fn) {
      fn(getTotalBoxes(), getPricing());
    });
  }

  // ==========================================================================
  // 5. Inline icon helpers (SVG strings — no icon-font dependency)
  // ==========================================================================
  var ICONS = {
    menu:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>',
    x:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    minus:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    plus:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    star:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"></polygon></svg>',
    truck:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"></path><path d="M16 8h4l3 3v5h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
    check:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    shield:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    shoppingBag:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
    chevronDown:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>',
  };

  function starRow(count, filled) {
    var html = "";
    for (var i = 0; i < count; i++) {
      html += ICONS.star;
    }
    return html;
  }

  function getFakeSoldCount(seed, base, spread) {
    var input = String(seed || "");
    var hash = 0;
    for (var i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash |= 0;
    }
    return base + Math.abs(hash % spread);
  }

  // ==========================================================================
  // 6. RENDER: Product Collection cards + qty controls
  // ==========================================================================
  function renderProductCollection() {
    var container = document.querySelector("[data-product-collection]");
    if (!container) return;
    var accentClass = { rose: "accent-rose", amber: "accent-amber", teal: "accent-teal" };
    var featureBadges = {
      "nightshade-lotus": "Dễ uống mỗi ngày",
      "nightshade": "Nguyên bản bán chạy",
      "chrysanthemum": "Êm dịu cuối ngày"
    };

    container.innerHTML = DATA.PRODUCTS.map(function (p) {
      var fakeSold = getFakeSoldCount(p.id, 320, 580);
      return (
        '<div class="reveal">' +
        '<div class="product-card">' +
        '<div class="product-photo ' +
        accentClass[p.accent] +
        '">' +
        '<img src="' +
        p.image +
        '" alt="Hộp ' +
        p.name +
        ' cùng tách trà và nguyên liệu thảo mộc" loading="lazy" width="900" height="1125">' +
        '<span class="product-badge">' +
        (featureBadges[p.id] || "SADU Mate chọn lọc") +
        "</span>" +
        "</div>" +
        '<div class="product-body">' +
        '<div class="product-rating" aria-label="Đánh giá trung bình ' +
        DATA.AVERAGE_RATING +
        ' trên 5">' +
        '<span class="product-rating-stars">' +
        starRow(5, 5) +
        "</span>" +
        '<span class="product-rating-score">' +
        DATA.AVERAGE_RATING +
        "/5</span>" +
        '<span class="product-rating-count">(' +
        Number(DATA.REVIEW_COUNT || 0).toLocaleString("vi-VN") +
        " đánh giá)</span>" +
        "</div>" +
        "<h3>" +
        p.vietnameseName +
        "</h3>" +
        '<span class="product-sold-badge">' + fakeSold.toLocaleString("vi-VN") + ' đã bán</span>' +
        '<p class="product-tagline">' +
        p.tagline +
        "</p>" +
        '<p class="product-desc">' +
        p.description +
        "</p>" +
        '<ul class="product-notes">' +
        p.notes.map(function (n) { return "<li>" + n + "</li>"; }).join("") +
        "</ul>" +
        '<div class="product-footer">' +
        '<div class="product-price-stack">' +
        '<span class="product-price-label">Giá niêm yết</span>' +
        '<span class="product-price">' +
        DATA.formatVND(DATA.UNIT_PRICE) +
        '</span>' +
        '<span class="product-price-note">Ưu đãi tốt hơn khi mua combo</span>' +
        "</div>" +
        '<div class="product-buybox">' +
        '<div class="qty-control">' +
        '<button type="button" class="qty-btn" data-qty-decrement="' +
        p.id +
        '" aria-label="Giảm số lượng ' +
        p.vietnameseName +
        '">' +
        ICONS.minus +
        "</button>" +
        '<input type="number" inputmode="numeric" class="qty-input" data-qty-input="' +
        p.id +
        '" aria-label="Số lượng ' +
        p.vietnameseName +
        '" value="' +
        orderState.quantities[p.id] +
        '">' +
        '<button type="button" class="qty-btn" data-qty-increment="' +
        p.id +
        '" aria-label="Tăng số lượng ' +
        p.vietnameseName +
        '">' +
        ICONS.plus +
        "</button>" +
        "</div>" +
        '<a href="#order" class="product-cta" aria-label="Thêm ' +
        p.vietnameseName +
        ' vào đơn hàng">Thêm vào đơn</a>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
      );
    }).join("");

    bindQtyControls(container);
  }

  function bindQtyControls(scope) {
    scope.querySelectorAll("[data-qty-increment]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        increment(btn.getAttribute("data-qty-increment"));
      });
    });
    scope.querySelectorAll("[data-qty-decrement]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        decrement(btn.getAttribute("data-qty-decrement"));
      });
    });
    scope.querySelectorAll("[data-qty-input]").forEach(function (input) {
      input.addEventListener("input", function () {
        setQuantity(input.getAttribute("data-qty-input"), Number(input.value) || 0);
      });
    });
  }

  // Keep every rendered qty control (product collection + order form) in sync
  function syncQtyControls() {
    document.querySelectorAll("[data-qty-input]").forEach(function (input) {
      var id = input.getAttribute("data-qty-input");
      if (document.activeElement !== input) {
        input.value = orderState.quantities[id];
      }
    });
    document.querySelectorAll("[data-qty-decrement]").forEach(function (btn) {
      var id = btn.getAttribute("data-qty-decrement");
      btn.disabled = orderState.quantities[id] === 0;
    });
  }

  // ==========================================================================
  // 7. RENDER: Order Form product list + summary
  // ==========================================================================
  function renderOrderProductList() {
    var container = document.querySelector("[data-order-product-list]");
    if (!container) return;
    container.innerHTML = DATA.PRODUCTS.map(function (p) {
      return (
        '<div class="order-product-row">' +
        '<img src="' +
        p.image +
        '" alt="" aria-hidden="true" width="56" height="56" loading="lazy">' +
        '<div class="order-product-info">' +
        '<p class="name">' +
        p.vietnameseName +
        "</p>" +
        '<p class="price">' +
        DATA.formatVND(DATA.UNIT_PRICE) +
        "</p>" +
        "</div>" +
        '<div class="qty-control">' +
        '<button type="button" class="qty-btn" data-qty-decrement="' +
        p.id +
        '" aria-label="Giảm ' +
        p.vietnameseName +
        '">' +
        ICONS.minus +
        "</button>" +
        '<input type="number" inputmode="numeric" class="qty-input" data-qty-input="' +
        p.id +
        '" aria-label="Số lượng ' +
        p.vietnameseName +
        '" value="' +
        orderState.quantities[p.id] +
        '">' +
        '<button type="button" class="qty-btn" data-qty-increment="' +
        p.id +
        '" aria-label="Tăng ' +
        p.vietnameseName +
        '">' +
        ICONS.plus +
        "</button>" +
        "</div>" +
        "</div>"
      );
    }).join("");
    bindQtyControls(container);
  }

  function renderOrderSummary() {
    var totalBoxes = getTotalBoxes();
    var pricing = getPricing();
    var upsellSubtotal = getUpsellSubtotal();
    var grandTotal = getGrandTotal();

    setText("[data-summary-boxes]", totalBoxes);
    var freeRow = document.querySelector("[data-summary-free-row]");
    if (freeRow) {
      if (pricing.boxesFree > 0) {
        freeRow.style.display = "flex";
        setText("[data-summary-free-label]", "Tặng thêm (" + pricing.tier.label + ")");
        setText("[data-summary-free-value]", pricing.boxesFree + " hộp");
      } else {
        freeRow.style.display = "none";
      }
    }
    setText("[data-summary-shipping]", pricing.freeShipping ? "Miễn phí" : "Tính khi xác nhận");

    var upsellRow = document.querySelector("[data-summary-upsell-row]");
    if (upsellRow) {
      if (upsellSubtotal > 0) {
        upsellRow.style.display = "flex";
        setText("[data-summary-upsell-total]", DATA.formatVND(upsellSubtotal));
      } else {
        upsellRow.style.display = "none";
      }
    }

    var savingsRow = document.querySelector("[data-summary-savings-row]");
    if (savingsRow) {
      if (pricing.savings > 0) {
        savingsRow.style.display = "flex";
        setText("[data-summary-savings]", DATA.formatVND(pricing.savings));
      } else {
        savingsRow.style.display = "none";
      }
    }

    setText("[data-summary-total]", DATA.formatVND(grandTotal));

    var shipHint = document.querySelector("[data-shipping-hint]");
    if (shipHint) {
      if (!pricing.freeShipping && totalBoxes > 0) {
        shipHint.style.display = "flex";
        setText(
          "[data-shipping-hint-text]",
          "Mua thêm " + (DATA.FREE_SHIP_THRESHOLD_BOXES - totalBoxes) + " hộp nữa để được miễn phí vận chuyển."
        );
      } else {
        shipHint.style.display = "none";
      }
    }

    var submitBtn = document.querySelector("[data-order-submit]");
    if (submitBtn && !submitBtn.disabled) {
      submitBtn.textContent = "Xác nhận đặt hàng · " + DATA.formatVND(pricing.subtotal);
    }

    if (submitBtn && !submitBtn.disabled) {
      submitBtn.textContent = "Xác nhận đặt hàng · " + DATA.formatVND(grandTotal);
    }

    // Sticky mobile CTA price
    setText("[data-sticky-price]", "từ " + DATA.formatVND(pricing.perBoxEffective || DATA.UNIT_PRICE) + "/hộp");
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = text;
    });
  }

  function getCrossSellSuggestions() {
    var selectedProducts = DATA.PRODUCTS.filter(function (p) {
      return orderState.quantities[p.id] > 0;
    });
    var relatedMap = {
      "nightshade-lotus": ["chrysanthemum", "nightshade"],
      "nightshade": ["nightshade-lotus", "chrysanthemum"],
      "chrysanthemum": ["nightshade-lotus", "nightshade"]
    };
    var bundleMap = {
      "nightshade-lotus": { title: "Bộ thanh nhẹ mỗi ngày", items: ["nightshade-lotus", "chrysanthemum"], qty: 1 },
      "nightshade": { title: "Bộ nguyên bản + dễ uống", items: ["nightshade", "nightshade-lotus"], qty: 1 },
      "chrysanthemum": { title: "Bộ thư giãn cuối ngày", items: ["chrysanthemum", "nightshade-lotus"], qty: 1 }
    };

    var anchor = selectedProducts[0] || DATA.PRODUCTS[0];
    var relatedIds = relatedMap[anchor.id] || [];
    var relatedProducts = relatedIds.map(function (id) {
      return DATA.PRODUCTS.find(function (p) { return p.id === id; });
    }).filter(Boolean);
    var bundle = bundleMap[anchor.id] || bundleMap["nightshade-lotus"];

    return {
      anchor: anchor,
      relatedProducts: relatedProducts,
      bundle: bundle
    };
  }

  function renderCrossSell() {
    var relatedContainer = document.querySelector("[data-related-products]");
    var bundleContainer = document.querySelector("[data-fbt-list]");
    if (!relatedContainer || !bundleContainer) return;

    var suggestions = getCrossSellSuggestions();

    relatedContainer.innerHTML = suggestions.relatedProducts.map(function (product) {
      return (
        '<article class="cross-sell-card">' +
        '<img src="' + product.image + '" alt="" aria-hidden="true" width="72" height="72" loading="lazy">' +
        '<div class="cross-sell-copy">' +
        '<p class="cross-sell-name">' + product.vietnameseName + "</p>" +
        '<p class="cross-sell-desc">' + product.tagline + "</p>" +
        '<p class="cross-sell-price">' + DATA.formatVND(DATA.UNIT_PRICE) + "</p>" +
        "</div>" +
        '<button type="button" class="cross-sell-btn" data-cross-add="' + product.id + '">Thêm nhanh</button>' +
        "</article>"
      );
    }).join("");

    var bundleProducts = suggestions.bundle.items.map(function (id) {
      return DATA.PRODUCTS.find(function (p) { return p.id === id; });
    }).filter(Boolean);
    var bundleQty = suggestions.bundle.qty || 1;
    var bundleTotal = bundleProducts.length * bundleQty;
    var bundlePricing = DATA.calculatePricing(bundleTotal);

    bundleContainer.innerHTML =
      '<article class="cross-bundle-card">' +
      '<div class="cross-bundle-meta">' +
      '<p class="cross-bundle-title">' + suggestions.bundle.title + "</p>" +
      '<p class="cross-bundle-items">' +
      bundleProducts.map(function (product) { return product.vietnameseName + " x" + bundleQty; }).join(" + ") +
      "</p>" +
      '<p class="cross-bundle-benefit">Nhận ' + bundlePricing.boxesTotal + " hộp, tiết kiệm " + DATA.formatVND(bundlePricing.savings) + "</p>" +
      "</div>" +
      '<button type="button" class="cross-bundle-btn" data-cross-bundle="' + bundleProducts.map(function (product) { return product.id; }).join(",") + '" data-cross-bundle-qty="' + bundleQty + '">Thêm cả bộ</button>' +
      "</article>";

    relatedContainer.querySelectorAll("[data-cross-add]").forEach(function (button) {
      button.addEventListener("click", function () {
        increment(button.getAttribute("data-cross-add"));
      });
    });

    bundleContainer.querySelectorAll("[data-cross-bundle]").forEach(function (button) {
      button.addEventListener("click", function () {
        var ids = button.getAttribute("data-cross-bundle").split(",");
        var qty = Number(button.getAttribute("data-cross-bundle-qty")) || 1;
        ids.forEach(function (id) {
          setQuantity(id, orderState.quantities[id] + qty);
        });
      });
    });
  }

  function renderCrossSell() {
    var relatedContainer = document.querySelector("[data-related-products]");
    var bundleContainer = document.querySelector("[data-fbt-list]");
    if (!relatedContainer || !bundleContainer) return;

    var section = document.querySelector("[data-cross-sell-section]");
    var kickerEls = Array.prototype.slice.call(document.querySelectorAll(".order-cross-kicker"));
    var headingEl = section ? section.querySelector(".order-cross-head h4") : null;
    var noteEl = section ? section.querySelector(".order-cross-note") : null;
    var bundleHeadingEl = section ? section.querySelector(".cross-bundle-copy h4") : null;
    var sectionKickerText = "Mua th\u00eam t\u1EEB SADU";
    var sectionHeadingText = "S\u1EA3n ph\u1EA9m n\u00EAn \u0111\u1EC1 xu\u1EA5t th\u00EAm cho kh\u00E1ch";
    var sectionNoteText = "Ch\u1EA1m th\u00EAm nhanh \u0111\u1EC3 ghi nh\u1EADn nhu c\u1EA7u mua k\u00E8m ngay trong \u0111\u01A1n h\u00E0ng hi\u1EC7n t\u1EA1i.";
    var sectionFeatureText = "G\u1EE3i \u00FD n\u1ED5i b\u1EADt \u0111\u1EC3 m\u1EDF r\u1ED9ng \u0111\u01A1n h\u00E0ng";
    var sectionPricePrefix = "Gi\u00E1 tham kh\u1EA3o ";
    var sectionCtaText = "Th\u00EAm nhanh";
    var sectionSelectedText = "\u0110\u00E3 th\u00EAm";

    kickerEls.forEach(function (el) {
      el.textContent = sectionKickerText;
    });
    if (headingEl) headingEl.textContent = sectionHeadingText;
    if (noteEl) {
      noteEl.textContent = sectionNoteText;
    }
    if (bundleHeadingEl) bundleHeadingEl.textContent = sectionFeatureText;

    relatedContainer.innerHTML = UPSELL_PRODUCTS.slice(0, 3).map(function (product) {
      var selected = isUpsellSelected(product.id);
      return (
        '<article class="cross-sell-card">' +
        '<img src="' + product.image + '" alt="' + product.name + '" width="72" height="72" loading="lazy">' +
        '<div class="cross-sell-copy">' +
        '<p class="cross-sell-name">' + product.name + "</p>" +
        '<p class="cross-sell-desc">' + product.tagline + "</p>" +
        '<p class="cross-sell-price">' + product.priceText + "</p>" +
        "</div>" +
        '<button type="button" class="cross-sell-btn' + (selected ? " is-selected" : "") + '" data-upsell-quick="' + product.id + '">' + (selected ? sectionSelectedText + " x" + (selectedUpsellQuantities[product.id] || 1) : sectionCtaText) + "</button>" +
        "</article>"
      );
    }).join("");

    bundleContainer.innerHTML = UPSELL_PRODUCTS.slice(3).map(function (product) {
      var selected = isUpsellSelected(product.id);
      return (
        '<article class="cross-bundle-card">' +
        '<div class="cross-bundle-meta">' +
        '<p class="cross-bundle-title">' + product.name + "</p>" +
        '<p class="cross-bundle-items">' + product.tagline + "</p>" +
        '<p class="cross-bundle-benefit">' + sectionPricePrefix + product.priceText + "</p>" +
        "</div>" +
        '<button type="button" class="cross-bundle-btn' + (selected ? " is-selected" : "") + '" data-upsell-quick="' + product.id + '">' + (selected ? sectionSelectedText + " x" + (selectedUpsellQuantities[product.id] || 1) : sectionCtaText) + "</button>" +
        "</article>"
      );
    }).join("");

    Array.prototype.slice.call(document.querySelectorAll("[data-upsell-quick]")).forEach(function (button) {
      button.addEventListener("click", function () {
        toggleUpsellSelection(button.getAttribute("data-upsell-quick"));
        renderCrossSell();
        renderUpsellShowcase();
        renderOrderSummary();
        renderCartUi();
      });
    });

    renderUpsellSummary();
  }

  function renderCartSummaryNode(root, pricing) {
    var freeRow = root.querySelector("[data-cart-free-row]");
    var savingsRow = root.querySelector("[data-cart-savings-row]");

    if (freeRow) {
      if (pricing.boxesFree > 0) {
        freeRow.style.display = "flex";
        var freeLabel = freeRow.querySelector("[data-cart-free-label]");
        var freeValue = freeRow.querySelector("[data-cart-free-value]");
        if (freeLabel) freeLabel.textContent = "Tặng thêm (" + pricing.tier.label + ")";
        if (freeValue) freeValue.textContent = pricing.boxesFree + " hộp";
      } else {
        freeRow.style.display = "none";
      }
    }

    if (savingsRow) {
      if (pricing.savings > 0) {
        savingsRow.style.display = "flex";
        var savings = savingsRow.querySelector("[data-cart-savings]");
        if (savings) savings.textContent = DATA.formatVND(pricing.savings);
      } else {
        savingsRow.style.display = "none";
      }
    }

    var subtotal = root.querySelector("[data-cart-subtotal]");
    var shipping = root.querySelector("[data-cart-shipping]");
    var ctaTotal = root.querySelector("[data-cart-cta-total]");
    var grandTotal = getGrandTotal();

    if (subtotal) subtotal.textContent = DATA.formatVND(pricing.subtotal);
    if (shipping) shipping.textContent = pricing.freeShipping ? "Miễn phí" : "Tính khi xác nhận";
    if (ctaTotal) ctaTotal.textContent = DATA.formatVND(pricing.subtotal);
    if (subtotal) subtotal.textContent = DATA.formatVND(grandTotal);
    if (ctaTotal) ctaTotal.textContent = DATA.formatVND(grandTotal);
  }

  function renderCartUi() {
    var totalBoxes = getTotalBoxes();
    var pricing = getPricing();
    var remainingForFreeShip = Math.max(0, DATA.FREE_SHIP_THRESHOLD_BOXES - totalBoxes);
    var progressPercent = Math.min(100, Math.round((Math.max(totalBoxes, 0) / DATA.FREE_SHIP_THRESHOLD_BOXES) * 100));

    document.querySelectorAll("[data-cart-items]").forEach(function (container) {
      if (!container) return;

      var activeProducts = DATA.PRODUCTS.filter(function (p) {
        return orderState.quantities[p.id] > 0;
      });

      if (!activeProducts.length) {
        container.innerHTML =
          '<div class="cart-empty-state">' +
          '<strong>Chưa có sản phẩm nào trong giỏ</strong>' +
          "<p>Chọn số lượng ở phần sản phẩm để SADU chuẩn bị đơn cho bạn.</p>" +
          "</div>";
        return;
      }

      container.innerHTML = activeProducts.map(function (p) {
        return (
          '<article class="cart-item-row">' +
          '<img src="' +
          p.image +
          '" alt="" aria-hidden="true" width="64" height="64" loading="lazy">' +
          '<div class="cart-item-info">' +
          '<p class="cart-item-name">' +
          p.vietnameseName +
          "</p>" +
          '<p class="cart-item-price">' +
          DATA.formatVND(DATA.UNIT_PRICE) +
          "</p>" +
          "</div>" +
          '<div class="qty-control">' +
          '<button type="button" class="qty-btn" data-qty-decrement="' +
          p.id +
          '" aria-label="Giảm ' +
          p.vietnameseName +
          '">' +
          ICONS.minus +
          "</button>" +
          '<input type="number" inputmode="numeric" class="qty-input" data-qty-input="' +
          p.id +
          '" aria-label="Số lượng ' +
          p.vietnameseName +
          '" value="' +
          orderState.quantities[p.id] +
          '">' +
          '<button type="button" class="qty-btn" data-qty-increment="' +
          p.id +
          '" aria-label="Tăng ' +
          p.vietnameseName +
          '">' +
          ICONS.plus +
          "</button>" +
          "</div>" +
          "</article>"
        );
      }).join("");

      bindQtyControls(container);
    });

    document.querySelectorAll("[data-cart-progress-title]").forEach(function (el) {
      el.textContent = pricing.freeShipping
        ? "Đã đạt miễn phí vận chuyển"
        : "Còn " + remainingForFreeShip + " hộp nữa để miễn phí ship";
    });

    document.querySelectorAll("[data-cart-progress-text]").forEach(function (el) {
      el.textContent = pricing.freeShipping
        ? "Đơn hiện tại đã đủ điều kiện freeship toàn quốc."
        : "Mốc freeship được áp dụng từ " + DATA.FREE_SHIP_THRESHOLD_BOXES + " hộp trong một đơn.";
    });

    document.querySelectorAll("[data-cart-progress-bar]").forEach(function (el) {
      el.style.width = progressPercent + "%";
    });

    document.querySelectorAll("[data-cart-voucher-badge]").forEach(function (el) {
      el.textContent = pricing.savings > 0 ? "Ưu đãi đang áp dụng" : "Mở khóa ưu đãi";
    });

    document.querySelectorAll("[data-cart-voucher-title]").forEach(function (el) {
      el.textContent = pricing.savings > 0 ? pricing.tier.label : "Mua thêm để nhận quà tặng";
    });

    document.querySelectorAll("[data-cart-voucher-note]").forEach(function (el) {
      if (pricing.savings > 0) {
        el.textContent =
          "Bạn đang tiết kiệm " +
          DATA.formatVND(pricing.savings) +
          " và nhận thêm " +
          pricing.boxesFree +
          " hộp theo ưu đãi hiện tại.";
      } else {
        el.textContent = "Chọn từ 3 hộp để nhận ưu đãi Mua 3 tặng 1 và tối ưu chi phí mỗi hộp.";
      }
    });

    document.querySelectorAll("[data-sticky-boxes]").forEach(function (el) {
      el.textContent = totalBoxes + " hộp đang chọn";
    });

    document.querySelectorAll("[data-floating-boxes]").forEach(function (el) {
      el.textContent = totalBoxes + " hộp";
    });

    document.querySelectorAll("[data-cart-checkout]").forEach(function (el) {
      el.classList.toggle("is-disabled", totalBoxes === 0);
      el.setAttribute("aria-disabled", totalBoxes === 0 ? "true" : "false");
      el.tabIndex = totalBoxes === 0 ? -1 : 0;
    });

    document.querySelectorAll("[data-floating-cart], [data-cart-sheet]").forEach(function (root) {
      renderCartSummaryNode(root, pricing);
    });
  }

  function initCartUi() {
    var overlay = document.querySelector("[data-cart-overlay]");
    var sheet = document.querySelector("[data-cart-sheet]");
    var floatingCart = document.querySelector("[data-floating-cart]");
    var desktopMedia = window.matchMedia("(min-width: 1024px)");

    if (!overlay || !sheet || !floatingCart) return;

    function closeCart() {
      overlay.hidden = true;
      overlay.classList.remove("is-open");
      sheet.hidden = true;
      sheet.classList.remove("is-open");
      floatingCart.classList.remove("is-open");
      document.body.classList.remove("cart-open");
    }

    function openCart() {
      overlay.hidden = false;
      overlay.classList.add("is-open");
      document.body.classList.add("cart-open");

      if (desktopMedia.matches) {
        sheet.hidden = true;
        sheet.classList.remove("is-open");
        floatingCart.classList.add("is-open");
      } else {
        floatingCart.classList.remove("is-open");
        sheet.hidden = false;
        window.requestAnimationFrame(function () {
          sheet.classList.add("is-open");
        });
      }
    }

    document.querySelectorAll("[data-open-cart], [data-floating-cta]").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        openCart();
      });
    });

    document.querySelectorAll("[data-cart-close]").forEach(function (trigger) {
      trigger.addEventListener("click", closeCart);
    });

    document.querySelectorAll("[data-cart-checkout]").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        if (getTotalBoxes() === 0) {
          e.preventDefault();
          return;
        }
        closeCart();
      });
    });

    overlay.addEventListener("click", closeCart);
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeCart();
    });
    desktopMedia.addEventListener("change", function () {
      closeCart();
    });
  }

  // ==========================================================================
  // 8. RENDER: Reviews, Pricing tiers, Calculator, FAQ
  // ==========================================================================
  function renderReviews() {
    var container = document.querySelector("[data-reviews]");
    if (!container) return;
    var reviewMedia = [
      { type: "image", src: "image/nu-feedback (3).jpg", alt: "Khach hang chia se trai nghiem dung SADU Mate", layout: "tall", eyebrow: "Anh khach that" },
      { type: "video", src: "image/nu-feedback (14).jpg", alt: "Poster phan hoi dang video cua khach hang", layout: "feature", eyebrow: "Review dang video" },
      { type: "image", src: "image/nam-feedback (5).jpg", alt: "Khach hang nam dung tra SADU Mate moi sang", layout: "square", eyebrow: "Dung moi sang" },
      { type: "image", src: "image/nu-feedback (10).jpg", alt: "Khong gian song lanh cung SADU Mate", layout: "square", eyebrow: "Anh loi song" },
      { type: "video", src: "image/nam-feedback (4).jpg", alt: "Poster video unbox SADU Mate", layout: "tall", eyebrow: "Unbox nhanh" },
      { type: "image", src: "image/nu-feedback (5).jpg", alt: "Khach mua lai va tiep tuc dung SADU Mate", layout: "wide", eyebrow: "Khach mua lai" }
    ];
    container.innerHTML = DATA.TESTIMONIALS.map(function (t, index) {
      var media = reviewMedia[index] || { type: "image", src: t.avatar, alt: t.name, layout: "square", eyebrow: "Khach xac thuc" };
      return (
        '<div class="reveal review-masonry-item">' +
        '<figure class="review-card review-card-' + media.layout + '">' +
        '<div class="review-media review-media-' + media.type + '">' +
        '<img class="review-media-image" src="' +
        media.src +
        '" alt="' +
        media.alt +
        '" loading="lazy" width="720" height="900">' +
        '<div class="review-media-overlay">' +
        '<span class="review-media-eyebrow">' + media.eyebrow + "</span>" +
        (media.type === "video"
          ? '<span class="review-play-badge" aria-hidden="true">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg>' +
            "<span>Phan hoi 30s</span>" +
            "</span>"
          : "") +
        "</div>" +
        "</div>" +
        '<div class="review-content">' +
        '<div class="review-head">' +
        '<div class="review-avatar-wrap">' +
        '<img class="review-avatar" src="' +
        t.avatar +
        '" alt="' +
        t.name +
        '" loading="lazy" width="56" height="56">' +
        "</div>" +
        '<div class="review-meta">' +
        '<p class="review-name">' +
        t.name +
        "</p>" +
        '<p class="review-role">' +
        t.role +
        "</p>" +
        (t.badge ? '<span class="review-badge">' + t.badge + "</span>" : "") +
        "</div>" +
        "</div>" +
        '<div class="review-stars">' +
        starRow(t.rating) +
        "</div>" +
        '<blockquote class="review-quote">&ldquo;' +
        t.quote +
        "&rdquo;</blockquote>" +
        '<figcaption class="review-footer">Khách đã mua hàng xác thực</figcaption>' +
        "</div>" +
        "</figure>" +
        "</div>"
      );
    }).join("");
  }

  function renderOrderFeed() {
    var container = document.querySelector("[data-order-feed]");
    if (!container) return;

    container.innerHTML = DATA.ORDER_FEED.map(function (item) {
      return (
        '<article class="feed-card reveal">' +
        '<div class="feed-card-top">' +
        '<div class="feed-person">' +
        '<img class="feed-avatar" src="' +
        item.avatar +
        '" alt="' +
        item.customer +
        '" loading="lazy" width="44" height="44">' +
        '<div class="feed-person-copy">' +
        '<h3 class="feed-customer">' +
        item.customer +
        "</h3>" +
        '<span class="feed-city">' +
        item.city +
        "</span>" +
        "</div>" +
        "</div>" +
        '<span class="feed-time">' +
        item.timeAgo +
        "</span>" +
        "</div>" +
        '<p class="feed-combo">' +
        item.combo +
        "</p>" +
        '<p class="feed-note">' +
        item.note +
        "</p>" +
        "</article>"
      );
    }).join("");
  }

  function initSocialProofToast() {
    var toast = document.querySelector("[data-social-toast]");
    if (!toast || !DATA.ORDER_FEED || !DATA.ORDER_FEED.length) return;

    var avatarEl = toast.querySelector("[data-social-avatar]");
    var nameEl = toast.querySelector("[data-social-name]");
    var comboEl = toast.querySelector("[data-social-combo]");
    var cityEl = toast.querySelector("[data-social-city]");
    var timeEl = toast.querySelector("[data-social-time]");
    var closeBtn = toast.querySelector("[data-social-close]");
    var currentIndex = -1;
    var showTimer = null;
    var hideTimer = null;
    var paused = false;
    var TOAST_INITIAL_DELAY = 6000;
    var TOAST_VISIBLE_DURATION = 6500;
    var TOAST_NEXT_DELAY = 18000;
    var TOAST_CLOSE_DELAY = 24000;
    var TOAST_RESUME_DELAY = 4000;

    function nextItem() {
      if (DATA.ORDER_FEED.length === 1) return DATA.ORDER_FEED[0];
      var nextIndex = currentIndex;

      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * DATA.ORDER_FEED.length);
      }

      currentIndex = nextIndex;
      return DATA.ORDER_FEED[currentIndex];
    }

    function fillToast(item) {
      if (avatarEl) avatarEl.src = item.avatar;
      if (avatarEl) avatarEl.alt = item.customer;
      if (nameEl) nameEl.textContent = item.customer;
      if (comboEl) comboEl.textContent = "vừa đặt " + item.combo;
      if (cityEl) cityEl.textContent = item.city;
      if (timeEl) timeEl.textContent = item.timeAgo;
    }

    function scheduleNext(delay) {
      window.clearTimeout(showTimer);
      showTimer = window.setTimeout(function () {
        if (!paused) showToast();
      }, delay);
    }

    function hideToast() {
      window.clearTimeout(hideTimer);
      toast.classList.remove("is-visible");
      scheduleNext(TOAST_NEXT_DELAY);
    }

    function showToast() {
      fillToast(nextItem());
      toast.classList.add("is-visible");
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hideToast, TOAST_VISIBLE_DURATION);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        toast.classList.remove("is-visible");
        window.clearTimeout(hideTimer);
        scheduleNext(TOAST_CLOSE_DELAY);
      });
    }

    toast.addEventListener("mouseenter", function () {
      paused = true;
      window.clearTimeout(hideTimer);
      window.clearTimeout(showTimer);
    });

    toast.addEventListener("mouseleave", function () {
      paused = false;
      hideTimer = window.setTimeout(hideToast, TOAST_RESUME_DELAY);
    });

    scheduleNext(TOAST_INITIAL_DELAY);
  }

  function renderPricingTiers() {
    var container = document.querySelector("[data-pricing-tiers]");
    if (!container) return;
    container.innerHTML = DATA.PRICING_TIERS.map(function (tier) {
      var preview = DATA.calculatePricing(tier.buy);
      var featured = tier.id === "combo3";
      return (
        '<div class="reveal">' +
        '<div class="pricing-card' +
        (featured ? " featured" : "") +
        '">' +
        (tier.badge ? '<span class="pricing-badge">' + tier.badge + "</span>" : "") +
        "<h3>" +
        tier.label +
        "</h3>" +
        '<div class="pricing-amount"><span>' +
        DATA.formatVND(preview.subtotal) +
        "</span></div>" +
        '<p class="pricing-for">cho ' +
        preview.boxesTotal +
        " hộp" +
        (preview.boxesFree > 0 ? " (tặng " + preview.boxesFree + " hộp)" : "") +
        "</p>" +
        '<ul class="pricing-list">' +
        "<li>" +
        ICONS.check +
        "Mua " +
        preview.boxesPaid +
        " hộp, nhận " +
        preview.boxesTotal +
        " hộp</li>" +
        "<li>" +
        ICONS.check +
        "Tiết kiệm " +
        DATA.formatVND(preview.savings) +
        "</li>" +
        "<li>" +
        ICONS.truck +
        (preview.freeShipping ? "Miễn phí vận chuyển" : "Phí ship tiêu chuẩn") +
        "</li>" +
        "</ul>" +
        '<a href="#pricing" class="pricing-cta" data-pricing-qty="' +
        tier.buy +
        '">Chọn gói này</a>' +
        "</div>" +
        "</div>"
      );
    }).join("");
  }

  function initCalculator() {
    var slider = document.querySelector("[data-calc-slider]");
    if (!slider) return;
    var presetButtons = Array.prototype.slice.call(document.querySelectorAll("[data-combo-preset]"));
    var pricingCtas = Array.prototype.slice.call(document.querySelectorAll("[data-pricing-qty]"));

    function syncPresetState(boxes) {
      presetButtons.forEach(function (button) {
        var isActive = Number(button.getAttribute("data-combo-preset")) === boxes;
        button.classList.toggle("is-active", isActive);
      });
    }

    function update() {
      var boxes = Number(slider.value);
      var result = DATA.calculatePricing(boxes);
      var tierNote = "Bắt đầu nhẹ nhàng với đơn dùng thử đầu tiên.";

      if (result.tier.id === "combo3") {
        tierNote = "Mốc phổ biến để vừa đủ dùng và có thêm hộp tặng.";
      } else if (result.tier.id === "combo5") {
        tierNote = "Đây là mốc tiết kiệm tốt nhất cho đơn hàng gia đình.";
      }

      setText("[data-calc-chosen]", boxes + " hộp");
      setText("[data-calc-total-boxes]", result.boxesTotal + " hộp");
      setText("[data-calc-free]", result.boxesFree + " hộp");
      setText("[data-calc-paid]", "Thanh toán " + result.boxesPaid + " hộp");
      setText("[data-calc-received]", "Nhận " + result.boxesTotal + " hộp");
      setText("[data-calc-save-chip]", "Tiết kiệm " + DATA.formatVND(result.savings));
      setText("[data-calc-effective]", DATA.formatVND(result.perBoxEffective || DATA.UNIT_PRICE));
      setText("[data-calc-subtotal]", DATA.formatVND(result.subtotal));
      setText("[data-calc-savings]", DATA.formatVND(result.savings));
      setText("[data-calc-tier]", result.tier.label);
      setText("[data-calc-tier-note]", tierNote);

      syncPresetState(boxes);

      var shipNote = document.querySelector("[data-calc-ship-note]");
      if (shipNote) {
        shipNote.style.display = "flex";
        shipNote.lastChild.textContent = boxes >= DATA.FREE_SHIP_THRESHOLD_BOXES
          ? " Đơn này được miễn phí vận chuyển toàn quốc."
          : " Mua thêm " + (DATA.FREE_SHIP_THRESHOLD_BOXES - boxes) + " hộp để được miễn phí vận chuyển toàn quốc.";
      }
    }

    presetButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        slider.value = button.getAttribute("data-combo-preset");
        update();
      });
    });

    pricingCtas.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        slider.value = link.getAttribute("data-pricing-qty");
        update();
        document.getElementById("pricing").scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    slider.addEventListener("input", update);
    update();
  }

  function renderFaq() {
    var container = document.querySelector("[data-faq-list]");
    if (!container) return;
    container.innerHTML = DATA.FAQ_ITEMS.map(function (item, i) {
      return (
        '<div class="faq-item" data-faq-item>' +
        '<button type="button" class="faq-trigger" data-faq-trigger aria-expanded="false">' +
        '<span class="faq-index">0' + (i + 1) + "</span>" +
        '<span class="faq-trigger-copy">' +
        '<span class="faq-question">' +
        item.question +
        "</span>" +
        '<span class="faq-trigger-sub">Chạm để xem câu trả lời ngắn gọn</span>' +
        "</span>" +
        '<span class="chev">' +
        ICONS.chevronDown +
        "</span>" +
        "</button>" +
        '<div class="faq-panel" data-faq-panel>' +
        '<div class="faq-panel-inner">' +
        item.answer +
        "</div>" +
        "</div>" +
        "</div>"
      );
    }).join("");

    container.querySelectorAll("[data-faq-trigger]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest("[data-faq-item]");
        var panel = item.querySelector("[data-faq-panel]");
        var isOpen = item.classList.contains("is-open");

        // Close all others (accordion behavior)
        container.querySelectorAll("[data-faq-item]").forEach(function (other) {
          other.classList.remove("is-open");
          other.querySelector("[data-faq-trigger]").setAttribute("aria-expanded", "false");
          other.querySelector("[data-faq-panel]").style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  // ==========================================================================
  // 9. Hero stars + rating text (static content, rendered for consistency)
  // ==========================================================================
  function renderHeroRating() {
    var starsEl = document.querySelector("[data-hero-stars]");
    if (starsEl) starsEl.innerHTML = starRow(5);
    setText(
      "[data-hero-rating-text]",
      DATA.AVERAGE_RATING + "/5 · " + DATA.REVIEW_COUNT.toLocaleString("vi-VN") + " đánh giá"
    );
    setText("[data-reviews-score]", DATA.AVERAGE_RATING + " / 5");
    setText("[data-reviews-count]", "· " + DATA.REVIEW_COUNT.toLocaleString("vi-VN") + " đánh giá");
    var reviewsStars = document.querySelector("[data-reviews-stars]");
    if (reviewsStars) reviewsStars.innerHTML = starRow(5);
  }

  // ==========================================================================
  // 10. STICKY MOBILE CTA + FLOATING ORDER BUTTON
  // ==========================================================================
  function initFloatingCtas() {
    var sticky = document.querySelector("[data-sticky-cta]");
    var floating = document.querySelector("[data-floating-cta]");
    var zalo = document.querySelector("[data-zalo-cta]");
    if (!sticky && !floating && !zalo) return;
    var firstMeaningfulScrollAt = null;
    var zaloUnlocked = false;

    function onScroll() {
      var isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      var show = window.scrollY > 480;
      var now = Date.now();

      if (window.scrollY > 180 && firstMeaningfulScrollAt === null) {
        firstMeaningfulScrollAt = now;
      }

      if (!zaloUnlocked && firstMeaningfulScrollAt !== null) {
        var scrolledLongEnough = now - firstMeaningfulScrollAt > 150000;
        var scrolledDeepEnough = window.scrollY > 720;
        zaloUnlocked = scrolledLongEnough && scrolledDeepEnough;
      }

      if (sticky) {
        sticky.classList.toggle("is-visible", !isDesktop || show);
      }
      if (floating) {
        floating.classList.toggle("is-visible", isDesktop && show);
      }
      if (zalo) {
        zalo.classList.toggle("is-visible", zaloUnlocked);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.setInterval(onScroll, 1000);
  }

  // ==========================================================================
  // 11. EXIT INTENT OFFER — once per session
  // ==========================================================================
  function initExitIntent() {
    var overlay = document.querySelector("[data-exit-overlay]");
    if (!overlay) return;
    var shown = false;
    var fallbackTimer = null;
    var previouslyFocused = null;
    var focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    var startedAt = Date.now();
    var minElapsedMs = 20000;
    var sessionKey = "saduMateExitIntentShown";

    try {
      if (window.sessionStorage && window.sessionStorage.getItem(sessionKey) === "1") {
        shown = true;
      }
    } catch (error) {}

    function canOpen() {
      return !shown && Date.now() - startedAt >= minElapsedMs;
    }

    function open() {
      if (!canOpen()) return;
      shown = true;
      window.clearTimeout(fallbackTimer);
      try {
        if (window.sessionStorage) window.sessionStorage.setItem(sessionKey, "1");
      } catch (error) {}
      previouslyFocused = document.activeElement;
      overlay.classList.add("is-open");
      var focusables = overlay.querySelectorAll(focusableSelector);
      if (focusables.length) focusables[0].focus();
    }

    function close() {
      overlay.classList.remove("is-open");
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    }

    document.addEventListener("mouseleave", function (e) {
      if (e.clientY <= 0 && canOpen()) open();
    });

    fallbackTimer = window.setTimeout(function () {
      if (canOpen() && window.scrollY > 900) open();
    }, 45000);

    overlay.querySelectorAll("[data-exit-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    overlay.querySelectorAll("[data-exit-cta]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    overlay.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;

      var focusables = Array.prototype.slice.call(overlay.querySelectorAll(focusableSelector));
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // ==========================================================================
  // 12. CERTIFICATION SLIDER
  // ==========================================================================
  function initCertificationSlider() {
    var root = document.querySelector("[data-certification-slider]");
    if (!root) return;

    var viewport = root.querySelector("[data-certification-viewport]");
    var track = root.querySelector("[data-certification-track]");
    var prevBtn = root.querySelector("[data-certification-prev]");
    var nextBtn = root.querySelector("[data-certification-next]");
    var dotsWrap = root.querySelector("[data-certification-dots]");
    var originalSlides = track ? Array.prototype.slice.call(track.children) : [];
    var slides = [];
    var currentIndex = 0;
    var cloneCount = 0;
    var autoplayTimer = null;
    var scrollTimer = null;
    var resizeTimer = null;
    var isPaused = false;
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!viewport || !track || originalSlides.length < 2) return;

    function getVisibleCount() {
      var width = window.innerWidth;
      if (width >= 1280) return 4;
      if (width >= 1024) return 3;
      if (width >= 768) return 2;
      return 1;
    }

    function getStepWidth() {
      var firstRealSlide = track.querySelector("li:not([data-certification-clone])");
      if (!firstRealSlide) return 0;

      var slideWidth = firstRealSlide.getBoundingClientRect().width;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || "0");
      return slideWidth + gap;
    }

    function getLoopedIndex(index) {
      return (index % originalSlides.length + originalSlides.length) % originalSlides.length;
    }

    function getScrollTarget(index) {
      return getStepWidth() * (cloneCount + index);
    }

    function setAriaLabels() {
      originalSlides.forEach(function (slide, index) {
        slide.setAttribute("aria-label", "Chứng nhận " + (index + 1) + " trên " + originalSlides.length);
      });
    }

    function createClone(slide) {
      var clone = slide.cloneNode(true);
      clone.setAttribute("data-certification-clone", "true");
      clone.setAttribute("aria-hidden", "true");
      return clone;
    }

    function renderDots() {
      if (!dotsWrap) return;

      dotsWrap.innerHTML = originalSlides
        .map(function (_, index) {
          return (
            '<button type="button" class="certification-slider__dot' +
            (index === currentIndex ? " is-active" : "") +
            '" data-certification-dot="' +
            index +
            '" aria-label="Xem chứng nhận ' +
            (index + 1) +
            '" aria-current="' +
            (index === currentIndex ? "true" : "false") +
            '"></button>'
          );
        })
        .join("");

      dotsWrap.querySelectorAll("[data-certification-dot]").forEach(function (dot) {
        dot.addEventListener("click", function () {
          goTo(Number(dot.getAttribute("data-certification-dot")));
        });
      });
    }

    function updateActiveState() {
      slides.forEach(function (slide) {
        var slideIndex = Number(slide.getAttribute("data-certification-index"));
        slide.classList.toggle("is-active", slideIndex === currentIndex);
      });
      renderDots();
    }

    function rebuildSlides() {
      Array.prototype.slice.call(track.querySelectorAll("[data-certification-clone]")).forEach(function (clone) {
        clone.remove();
      });

      cloneCount = Math.min(originalSlides.length, Math.max(1, getVisibleCount()));

      originalSlides.forEach(function (slide, index) {
        slide.setAttribute("data-certification-index", index);
      });

      for (var i = originalSlides.length - 1; i >= originalSlides.length - cloneCount; i -= 1) {
        track.insertBefore(createClone(originalSlides[i]), track.firstChild);
      }

      for (var j = 0; j < cloneCount; j += 1) {
        track.appendChild(createClone(originalSlides[j]));
      }

      slides = Array.prototype.slice.call(track.children);
      slides.forEach(function (slide) {
        if (slide.hasAttribute("data-certification-clone")) {
          var image = slide.querySelector("img");
          if (image) image.setAttribute("alt", "");
          slide.setAttribute("tabindex", "-1");
          slide.setAttribute("data-certification-index", slide.getAttribute("data-certification-index") || "0");
        }
      });

      viewport.scrollLeft = getScrollTarget(currentIndex);
      updateActiveState();
    }

    function syncLoopPosition() {
      var stepWidth = getStepWidth();
      if (!stepWidth) return;

      var rawIndex = Math.round(viewport.scrollLeft / stepWidth) - cloneCount;

      if (rawIndex < 0) {
        rawIndex += originalSlides.length;
        viewport.scrollLeft = getScrollTarget(rawIndex);
      } else if (rawIndex >= originalSlides.length) {
        rawIndex -= originalSlides.length;
        viewport.scrollLeft = getScrollTarget(rawIndex);
      }

      currentIndex = getLoopedIndex(rawIndex);
      updateActiveState();
    }

    function goTo(index) {
      var targetIndex = index;

      if (index < 0) {
        targetIndex = -1;
      } else if (index >= originalSlides.length) {
        targetIndex = originalSlides.length;
      }

      currentIndex = getLoopedIndex(index);
      viewport.scrollTo({
        left: getStepWidth() * (cloneCount + targetIndex),
        behavior: "smooth",
      });
      updateActiveState();
    }

    function stopAutoplay() {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    function startAutoplay() {
      stopAutoplay();
      if (isPaused || prefersReducedMotion.matches || originalSlides.length < 2) return;

      autoplayTimer = window.setInterval(function () {
        goTo(currentIndex + 1);
      }, 3500);
    }

    function pauseAutoplay() {
      isPaused = true;
      stopAutoplay();
    }

    function resumeAutoplay() {
      isPaused = false;
      startAutoplay();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(currentIndex + 1);
      });
    }

    viewport.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(currentIndex + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(originalSlides.length - 1);
      }
    });

    viewport.addEventListener(
      "scroll",
      function () {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(syncLoopPosition, 90);
      },
      { passive: true }
    );

    root.addEventListener("mouseenter", pauseAutoplay);
    root.addEventListener("mouseleave", resumeAutoplay);
    root.addEventListener("focusin", pauseAutoplay);
    root.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!root.contains(document.activeElement)) {
          resumeAutoplay();
        }
      }, 0);
    });

    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        rebuildSlides();
      }, 120);
    });

    if (typeof prefersReducedMotion.addEventListener === "function") {
      prefersReducedMotion.addEventListener("change", function () {
        startAutoplay();
      });
    }

    setAriaLabels();
    rebuildSlides();
    startAutoplay();
  }

  // ==========================================================================
  // 13. AWARDS GALLERY - simple slider controls
  // ==========================================================================
  function initAwardsGallery() {
    var gallery = document.querySelector("[data-awards-gallery]");
    if (!gallery) return;

    var track = gallery.querySelector("[data-awards-track]");
    var slides = Array.prototype.slice.call(gallery.querySelectorAll("[data-awards-slide]"));
    var prevBtn = gallery.querySelector("[data-awards-prev]");
    var nextBtn = gallery.querySelector("[data-awards-next]");
    var dotsWrap = document.querySelector("[data-awards-dots]");
    var currentIndex = 0;

    if (!track || !slides.length) return;

    function getStepWidth() {
      if (!slides[0]) return 0;
      var slideWidth = slides[0].getBoundingClientRect().width;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || "0");
      return slideWidth + gap;
    }

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = slides
        .map(function (_, index) {
          return (
             '<button type="button" class="awards-dot' +
             (index === currentIndex ? " is-active" : "") +
             '" data-awards-dot="' +
             index +
             '" aria-label="Xem ảnh giải thưởng ' +
             (index + 1) +
             '" aria-current="' +
             (index === currentIndex ? "true" : "false") +
             '"></button>'
          );
        })
        .join("");

      dotsWrap.querySelectorAll("[data-awards-dot]").forEach(function (dot) {
        dot.addEventListener("click", function () {
          goTo(Number(dot.getAttribute("data-awards-dot")));
        });
        });
    }

    function update() {
      slides.forEach(function (slide, index) {
        slide.classList.toggle("is-active", index === currentIndex);
      });
      renderDots();
    }

    function goTo(index) {
      if (index < 0) currentIndex = slides.length - 1;
      else if (index >= slides.length) currentIndex = 0;
      else currentIndex = index;

      track.scrollTo({
        left: getStepWidth() * currentIndex,
        behavior: "smooth",
      });
      update();
    }

    function syncCurrentIndexFromScroll() {
      var stepWidth = getStepWidth();
      if (!stepWidth) return;
      currentIndex = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / stepWidth)));
      update();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(currentIndex + 1);
      });
    }

    track.addEventListener("scroll", function () {
      window.clearTimeout(track._awardsScrollTimer);
      track._awardsScrollTimer = window.setTimeout(syncCurrentIndexFromScroll, 90);
    }, { passive: true });

    window.addEventListener("resize", function () {
      track.scrollLeft = getStepWidth() * currentIndex;
    });

    update();
  }

  // ==========================================================================
  // 13. ORDER FORM — validation + submit (Google Sheets webhook)
  // ==========================================================================
  function initOrderForm() {
    var form = document.querySelector("[data-order-form]");
    if (!form) return;

    var fields = {
      name: form.querySelector("#name"),
      phone: form.querySelector("#phone"),
      province: form.querySelector("#province"),
      address: form.querySelector("#address"),
      note: form.querySelector("#note"),
    };
    var errorEls = {
      name: form.querySelector("[data-error-name]"),
      phone: form.querySelector("[data-error-phone]"),
      province: form.querySelector("[data-error-province]"),
      address: form.querySelector("[data-error-address]"),
    };
    var submitBtn = form.querySelector("[data-order-submit]");
    var submitError = form.querySelector("[data-order-submit-error]");
    var formSection = document.querySelector("[data-order-form-section]");
    var successSection = document.querySelector("[data-order-success-section]");

    Object.keys(fields).forEach(function (key) {
      var el = fields[key];
      if (!el) return;
      el.addEventListener("input", function () {
        clearFieldError(key);
      });
      el.addEventListener("blur", function () {
        validateField(key);
      });
    });

    function setFieldError(key, message) {
      var field = fields[key];
      if (field) field.setAttribute("aria-invalid", "true");
      if (errorEls[key]) errorEls[key].textContent = message;
    }

    function clearFieldError(key) {
      var field = fields[key];
      if (field) field.removeAttribute("aria-invalid");
      if (errorEls[key]) errorEls[key].textContent = "";
    }

    function validateField(key) {
      if (!fields[key]) return true;
      if (key === "note") return true;

      var value = fields[key].value.trim();
      clearFieldError(key);

      if (key === "name" && !value) {
        setFieldError(key, "Vui lòng nhập họ tên.");
        return false;
      }
      if (key === "phone" && !/^0\d{9}$/.test(value)) {
        setFieldError(key, "Số điện thoại phải có 10 số, bắt đầu bằng 0.");
        return false;
      }
      if (key === "province" && !fields[key].value) {
        setFieldError(key, "Vui lòng chọn tỉnh/thành.");
        return false;
      }
      if (key === "address" && !value) {
        setFieldError(key, "Vui lòng nhập địa chỉ giao hàng.");
        return false;
      }
      return true;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = fields.name.value.trim();
      var phone = fields.phone.value.trim();
      var province = fields.province.value;
      var address = fields.address.value.trim();
      var note = fields.note ? fields.note.value.trim() : "";
      var finalNote = mergeOrderNote(note);
      var totalBoxes = getTotalBoxes();
      var pricing = getPricing();
      var grandTotal = getGrandTotal();

      var hasError = false;
      ["name", "phone", "province", "address"].forEach(function (key) {
        if (!validateField(key)) hasError = true;
      });
      if (totalBoxes === 0) {
        setFieldError("name", errorEls.name.textContent || "Vui lòng chọn ít nhất 1 hộp trà.");
        hasError = true;
      }
      if (hasError) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (!name) {
        errorEls.name.textContent = "Vui lòng nhập họ tên.";
        hasError = true;
      }
      if (!/^0\d{9}$/.test(phone)) {
        errorEls.phone.textContent = "Số điện thoại phải có 10 số, bắt đầu bằng 0.";
        hasError = true;
      }
      if (!address) {
        errorEls.address.textContent = "Vui lòng nhập địa chỉ giao hàng.";
        hasError = true;
      }
      if (!province) {
        errorEls.province.textContent = "Vui lòng chọn tỉnh/thành.";
        hasError = true;
      }
      if (totalBoxes === 0) {
        errorEls.name.textContent = errorEls.name.textContent || "Vui lòng chọn ít nhất 1 hộp trà.";
        hasError = true;
      }

      if (hasError) return;

      var productsSummary = DATA.PRODUCTS.filter(function (p) {
        return orderState.quantities[p.id] > 0;
      })
        .map(function (p) {
          return p.vietnameseName + " x" + orderState.quantities[p.id];
        })
        .concat(
          getSelectedUpsellProducts().map(function (product) {
            return product.name + " x" + (selectedUpsellQuantities[product.id] || 1);
          })
        )
        .join(", ");

      var payload = {
        name: name,
        phone: phone,
        province: province,
        address: address,
        note: finalNote,
        products: productsSummary,
        totalBoxes: pricing.boxesTotal,
        subtotal: grandTotal,
        savings: pricing.savings,
        freeShipping: pricing.freeShipping,
        source: "Landing Page",
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Đang gửi đơn hàng...";
      if (submitError) submitError.textContent = "";

      submitOrder(payload)
        .then(function (result) {
          if (result && result.ok === false) {
            if (submitError) {
              submitError.textContent =
                result.message || "Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline 1900 8952.";
            }
            return;
          }
          showSuccess(name, phone, pricing.boxesTotal);
        })
        .catch(function () {
          if (submitError) {
            submitError.textContent = "Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline 1900 8952.";
          }
        })
        .finally(function () {
          submitBtn.disabled = false;
          renderOrderSummary();
        });
    });

    function showSuccess(name, phone, boxesTotal) {
      if (formSection) formSection.style.display = "none";
      if (successSection) {
        successSection.style.display = "block";
        setText("[data-success-name]", name);
        setText("[data-success-boxes]", boxesTotal);
        setText("[data-success-phone]", phone);
        successSection.focus();
      }

      if (window.SADUTracking) {
        window.SADUTracking.lead({
          value: getGrandTotal()
        });
        window.SADUTracking.purchase({
          value: getGrandTotal(),
          num_items: getPricing().boxesTotal
        });
      }
    }
  }

  /**
   * Gửi đơn hàng tới webhook Google Apps Script.
   *
   * QUAN TRỌNG: nếu GOOGLE_SHEETS_WEBHOOK_URL để trống, đơn hàng sẽ KHÔNG
   * được gửi đi đâu cả — form sẽ chỉ hiển thị thành công trên giao diện.
   * Hãy dán URL /exec từ Apps Script "Triển khai" (Deploy) của bạn vào biến
   * GOOGLE_SHEETS_WEBHOOK_URL ở đầu file này trước khi đưa trang lên server.
   *
   * Vì Apps Script /exec trả về 302 redirect tới script.googleusercontent.com,
   * và một số trình duyệt/CORS có thể chặn đọc phản hồi qua redirect chéo
   * domain, ta gửi request ở chế độ "no-cors": trình duyệt vẫn gửi dữ liệu đi
   * (và Apps Script vẫn ghi vào Sheet) nhưng ta không đọc được nội dung phản
   * hồi JSON — nên luôn coi là thành công nếu request không bị lỗi mạng.
   * Nếu bạn tự host cùng domain với một backend proxy, có thể đổi 'no-cors'
   * thành 'cors' để đọc được thông báo lỗi thật (trùng đơn, sai định dạng...).
   */
  function submitOrder(payload) {
    if (!GOOGLE_SHEETS_WEBHOOK_URL) {
      console.warn("[SADU] GOOGLE_SHEETS_WEBHOOK_URL chưa được cấu hình — đơn hàng chỉ hiển thị trên giao diện, chưa gửi đi đâu.");
      return Promise.resolve({ ok: true, forwarded: false });
    }

    return fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    }).then(function () {
      // mode:'no-cors' luôn trả về response "opaque" (không đọc được nội
      // dung/HTTP status) — coi là thành công nếu fetch không throw lỗi mạng.
      return { ok: true, forwarded: true };
    });
  }

  // ==========================================================================
  // INIT — chạy tất cả khi DOM sẵn sàng
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initCountdown();
    initHeroAdsVariant();
    renderHeroRating();
    initHeroMotion();
    renderProductCollection();
    renderOrderProductList();
    renderUpsellShowcase();
    renderReviews();
    renderOrderFeed();
    renderPricingTiers();
    initCalculator();
    renderFaq();
    initCartUi();
    initFloatingCtas();
    initSocialProofToast();
    initExitIntent();
    initCertificationSlider();
    initAwardsGallery();
    initOrderForm();
    initMetaTrackingBindings();

    onOrderChange(function () {
      syncQtyControls();
      renderCrossSell();
      renderOrderSummary();
      renderCartUi();
    });

    renderCrossSell();
    renderOrderSummary();
    renderCartUi();
    syncQtyControls();

    // Reveal phải chạy SAU khi mọi nội dung động đã render xong, để các thẻ
    // .reveal mới tạo (sản phẩm, đánh giá, bảng giá) cũng được quan sát.
    initReveal();
  });
})();
