/* ==========================================================================
   SADU Mate — Hành vi trang (thuần JavaScript, không dùng framework)
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.SADU_DATA;

  // ------------------------------------------------------------------
  // WEBHOOK CONFIG — dán URL Apps Script /exec của bạn vào đây
  // ------------------------------------------------------------------
  var GOOGLE_SHEETS_WEBHOOK_URL = "";
  // Ví dụ:
  // var GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec";

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
      toggle.addEventListener("click", function () {
        var isOpen = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        toggle.innerHTML = isOpen ? ICONS.x : ICONS.menu;
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          menu.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.innerHTML = ICONS.menu;
        });
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

  // ==========================================================================
  // 6. RENDER: Product Collection cards + qty controls
  // ==========================================================================
  function renderProductCollection() {
    var container = document.querySelector("[data-product-collection]");
    if (!container) return;
    var accentClass = { rose: "accent-rose", amber: "accent-amber", teal: "accent-teal" };

    container.innerHTML = DATA.PRODUCTS.map(function (p) {
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
        "</div>" +
        '<div class="product-body">' +
        "<h3>" +
        p.vietnameseName +
        "</h3>" +
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
        '<span class="product-price">' +
        DATA.formatVND(DATA.UNIT_PRICE) +
        "</span>" +
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

    var savingsRow = document.querySelector("[data-summary-savings-row]");
    if (savingsRow) {
      if (pricing.savings > 0) {
        savingsRow.style.display = "flex";
        setText("[data-summary-savings]", DATA.formatVND(pricing.savings));
      } else {
        savingsRow.style.display = "none";
      }
    }

    setText("[data-summary-total]", DATA.formatVND(pricing.subtotal));

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

    // Sticky mobile CTA price
    setText("[data-sticky-price]", "từ " + DATA.formatVND(pricing.perBoxEffective || DATA.UNIT_PRICE) + "/hộp");
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = text;
    });
  }

  // ==========================================================================
  // 8. RENDER: Reviews, Pricing tiers, Calculator, FAQ
  // ==========================================================================
  function renderReviews() {
    var container = document.querySelector("[data-reviews]");
    if (!container) return;
    container.innerHTML = DATA.TESTIMONIALS.map(function (t) {
      return (
        '<div class="reveal">' +
        '<figure class="review-card">' +
        '<div class="review-stars">' +
        starRow(t.rating) +
        "</div>" +
        '<blockquote class="review-quote">&ldquo;' +
        t.quote +
        "&rdquo;</blockquote>" +
        '<figcaption class="review-footer">' +
        '<p class="review-name">' +
        t.name +
        "</p>" +
        '<p class="review-role">' +
        t.role +
        "</p>" +
        "</figcaption>" +
        "</figure>" +
        "</div>"
      );
    }).join("");
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
        '<a href="#order" class="pricing-cta">Chọn gói này</a>' +
        "</div>" +
        "</div>"
      );
    }).join("");
  }

  function initCalculator() {
    var slider = document.querySelector("[data-calc-slider]");
    if (!slider) return;

    function update() {
      var boxes = Number(slider.value);
      var result = DATA.calculatePricing(boxes);
      setText("[data-calc-chosen]", boxes + " hộp");
      setText("[data-calc-total-boxes]", result.boxesTotal + " hộp");
      setText("[data-calc-subtotal]", DATA.formatVND(result.subtotal));
      setText("[data-calc-savings]", DATA.formatVND(result.savings));

      var shipNote = document.querySelector("[data-calc-ship-note]");
      if (shipNote) {
        shipNote.style.display = boxes >= DATA.FREE_SHIP_THRESHOLD_BOXES ? "flex" : "none";
      }
    }

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
        "<span>" +
        item.question +
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
    if (!sticky && !floating) return;

    function onScroll() {
      var show = window.scrollY > 480;
      if (sticky) sticky.classList.toggle("is-visible", show);
      if (floating) floating.classList.toggle("is-visible", show);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ==========================================================================
  // 11. EXIT INTENT OFFER — once per session
  // ==========================================================================
  function initExitIntent() {
    var overlay = document.querySelector("[data-exit-overlay]");
    if (!overlay) return;
    var STORAGE_KEY = "sadu_exit_offer_shown";
    var shown = false;

    try {
      shown = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      // sessionStorage unavailable (private mode) — skip persistence
    }
    if (shown) return;

    function open() {
      shown = true;
      overlay.classList.add("is-open");
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch (e) {}
    }

    function close() {
      overlay.classList.remove("is-open");
    }

    document.addEventListener("mouseleave", function (e) {
      if (e.clientY <= 0 && !shown) open();
    });

    overlay.querySelectorAll("[data-exit-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    overlay.querySelectorAll("[data-exit-cta]").forEach(function (el) {
      el.addEventListener("click", close);
    });
  }

  // ==========================================================================
  // 12. ORDER FORM — validation + submit (Google Sheets webhook)
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
        if (errorEls[key]) errorEls[key].textContent = "";
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = fields.name.value.trim();
      var phone = fields.phone.value.trim();
      var province = fields.province.value;
      var address = fields.address.value.trim();
      var note = fields.note ? fields.note.value.trim() : "";
      var totalBoxes = getTotalBoxes();
      var pricing = getPricing();

      var hasError = false;
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
        .join(", ");

      var payload = {
        name: name,
        phone: phone,
        province: province,
        address: address,
        note: note,
        products: productsSummary,
        totalBoxes: pricing.boxesTotal,
        subtotal: pricing.subtotal,
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
    renderHeroRating();
    renderProductCollection();
    renderOrderProductList();
    renderReviews();
    renderPricingTiers();
    initCalculator();
    renderFaq();
    initFloatingCtas();
    initExitIntent();
    initOrderForm();

    onOrderChange(function () {
      syncQtyControls();
      renderOrderSummary();
    });

    renderOrderSummary();
    syncQtyControls();

    // Reveal phải chạy SAU khi mọi nội dung động đã render xong, để các thẻ
    // .reveal mới tạo (sản phẩm, đánh giá, bảng giá) cũng được quan sát.
    initReveal();
  });
})();

