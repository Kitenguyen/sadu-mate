(function (window) {
  "use strict";

  var core = window.SADUTrackingCore;
  var utils = window.SADUTrackingUtils;
  var originalFetch = window.fetch ? window.fetch.bind(window) : null;
  var LAST_ORDER = null;

  function fireMeta(metaType, metaName, params, eventId) {
    if (typeof window.fbq !== "function") return;
    window.fbq(metaType, metaName, params, { eventID: eventId });
  }

  function metaTrack(eventName, metaType, metaName, payload, dedupeKey, once) {
    return core.track({
      eventName: eventName,
      payload: payload,
      dedupeKey: dedupeKey,
      once: once,
      dispatch: function (envelope, buildMetaParams) {
        fireMeta(metaType, metaName, buildMetaParams(envelope), envelope.event_id);
      }
    });
  }

  function getComboLabel(orderData) {
    if (!orderData || !orderData.pricing || !orderData.pricing.tier) return "";
    if (orderData.pricing.tier.id === "combo5") return "5_tang_2";
    if (orderData.pricing.tier.id === "combo3") return "3_tang_1";
    return "1_hop";
  }

  function getOrderData() {
    var DATA = window.SADU_DATA;
    if (!DATA || typeof DATA.calculatePricing !== "function") {
      return null;
    }

    var productRows = Array.prototype.slice.call(document.querySelectorAll("[data-order-product-list] [data-order-item], [data-order-product-list] [data-product-row]"));
    var selectedProducts = [];
    var totalRequested = 0;

    productRows.forEach(function (row) {
      var quantityInput = row.querySelector('input[type="number"]');
      var nameEl = row.querySelector(".order-product-name, .product-name, [data-product-name]");
      var quantity = quantityInput ? Number(quantityInput.value || 0) : 0;
      var name = nameEl ? nameEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (!quantity || quantity < 0) return;
      totalRequested += quantity;
      if (quantity > 0) {
        selectedProducts.push({
          product_id: utils.sanitizeKey(name || ("product_" + selectedProducts.length)),
          product_name: name || "SADU Mate",
          quantity: quantity
        });
      }
    });

    if (!totalRequested) {
      selectedProducts.push({
        product_id: "sadu-mate",
        product_name: "SADU Mate",
        quantity: 0
      });
    }

    var pricing = DATA.calculatePricing(totalRequested);
    var upsellButtons = Array.prototype.slice.call(document.querySelectorAll(".upsell-showcase-btn.is-selected, .cross-sell-btn.is-selected, .cross-bundle-btn.is-selected"));
    var upsellProducts = [];
    var upsellSubtotal = 0;

    upsellButtons.forEach(function (button) {
      var card = button.closest(".upsell-showcase-card, .cross-sell-card, .cross-bundle-card, article, li, div");
      var nameEl = card ? card.querySelector(".upsell-showcase-name, .cross-sell-name, .cross-bundle-name, [data-upsell-name]") : null;
      var priceEl = card ? card.querySelector(".upsell-showcase-price, .cross-sell-price, .cross-bundle-price, [data-upsell-price]") : null;
      var productId = button.getAttribute("data-upsell-showcase-add") || button.getAttribute("data-upsell-quick") || utils.sanitizeKey(nameEl && nameEl.textContent);
      var productName = nameEl ? nameEl.textContent.replace(/\s+/g, " ").trim() : productId;
      var priceValue = priceEl ? Number(String(priceEl.textContent).replace(/[^\d]/g, "")) : 0;

      upsellSubtotal += priceValue;
      upsellProducts.push({
        product_id: productId,
        product_name: productName,
        quantity: 1,
        value: priceValue
      });
    });

    return {
      pricing: pricing,
      totalBoxes: pricing.boxesTotal,
      grandTotal: pricing.subtotal + upsellSubtotal,
      upsellSubtotal: upsellSubtotal,
      products: selectedProducts,
      upsells: upsellProducts,
      orderId: ""
    };
  }

  function trackViewContent() {
    return metaTrack("lp_view_content", "track", "ViewContent", {
      content_name: "SADU Mate",
      content_type: "product_group"
    }, "view_content", true);
  }

  function trackScroll(percent) {
    return metaTrack("lp_scroll_depth", "trackCustom", "ScrollDepth", {
      scroll_percent: percent
    }, "scroll_" + percent, true);
  }

  function trackCTA(details) {
    var payload = {
      button_name: details.button_name || "",
      section: details.section || "",
      page_position: details.page_position || "",
      destination: details.destination || ""
    };
    var key = "cta_" + utils.sanitizeKey(payload.button_name + "_" + payload.section + "_" + payload.destination);
    return metaTrack("lp_cta_click", "trackCustom", "CTA_Click", payload, key, true);
  }

  function trackContact(details) {
    var payload = details || {};
    var key = "contact_" + utils.sanitizeKey(payload.channel || payload.button_name || "contact");
    return metaTrack("lp_contact", "track", "Contact", payload, key, true);
  }

  function trackViewOffer(details) {
    return metaTrack("lp_view_offer", "trackCustom", "ViewOffer", details || {}, "view_offer", true);
  }

  function trackFormView(details) {
    return metaTrack("lp_form_view", "trackCustom", "FormView", details || {}, "form_view", true);
  }

  function trackFormStart(details) {
    var suffix = details && details.field_name ? "_" + utils.sanitizeKey(details.field_name) : "";
    return metaTrack("lp_form_start", "trackCustom", "FormStart", details || {}, "form_start" + suffix, true);
  }

  function trackFormField(fieldName, details) {
    return metaTrack("lp_form_field_input", "trackCustom", "FormFieldInput", {
      field_name: fieldName,
      field_value_state: details && details.field_value_state ? details.field_value_state : "filled"
    }, "field_" + utils.sanitizeKey(fieldName), true);
  }

  function trackComboChange(details) {
    return metaTrack("lp_combo_change", "trackCustom", "ComboChange", details || {}, "combo_" + utils.sanitizeKey((details && details.combo) || ""), true);
  }

  function trackAddToCart(orderData) {
    if (!orderData || !orderData.pricing) return { skipped: true };
    var payload = {
      value: orderData.grandTotal,
      currency: "VND",
      num_items: orderData.pricing.boxesTotal,
      combo: getComboLabel(orderData),
      product_id: "sadu-mate",
      product_name: "SADU Mate"
    };
    return metaTrack("lp_add_to_cart", "track", "AddToCart", payload, "add_to_cart_" + utils.sanitizeKey(payload.combo), true);
  }

  function trackSubmitClick(orderData) {
    if (!orderData || !orderData.pricing) return { skipped: true };
    return metaTrack("lp_submit_click", "trackCustom", "SubmitClick", {
      value: orderData.grandTotal,
      currency: "VND",
      combo: getComboLabel(orderData),
      num_items: orderData.pricing.boxesTotal
    }, "submit_click", true);
  }

  function trackSubmitSuccess(orderData) {
    if (!orderData || !orderData.pricing) return { skipped: true };
    return metaTrack("lp_submit_success", "trackCustom", "SubmitSuccess", {
      value: orderData.grandTotal,
      currency: "VND",
      combo: getComboLabel(orderData),
      num_items: orderData.pricing.boxesTotal
    }, "submit_success", true);
  }

  function trackSubmitError(details) {
    return metaTrack("lp_submit_error", "trackCustom", "SubmitError", details || {}, "submit_error_" + utils.sanitizeKey((details && details.reason) || "generic"), true);
  }

  function trackLead(orderData) {
    if (!orderData || !orderData.pricing || orderData.__confirmed !== true) {
      return { skipped: true, reason: "lead_requires_confirmed_backend_success" };
    }

    return metaTrack("lp_lead", "track", "Lead", {
      value: orderData.grandTotal,
      currency: "VND",
      product_id: "sadu-mate",
      product_name: "SADU Mate",
      quantity: orderData.pricing.boxesPaid,
      combo: getComboLabel(orderData),
      num_items: orderData.pricing.boxesTotal
    }, "lead_" + utils.sanitizeKey(orderData.orderId || "order"), true);
  }

  function trackPurchase() {
    return { skipped: true, reason: "purchase_reserved_for_capi" };
  }

  function trackUpsell(action, details) {
    var payload = details || {};
    payload.upsell_action = action;
    return metaTrack("lp_upsell", "trackCustom", "Upsell", payload, "upsell_" + utils.sanitizeKey(action + "_" + (payload.product_id || payload.section || "")), true);
  }

  function trackPhoneInput() {
    return trackFormField("phone");
  }

  function trackAddressInput() {
    return trackFormField("address");
  }

  function resolveCtaName(element) {
    var mapping = [
      { selector: "[data-hero-primary-cta]", name: "Hero CTA" },
      { selector: "[data-floating-cta], [data-sticky-cta]", name: "Sticky CTA" },
      { selector: ".combo-builder-cta", name: "Combo CTA" },
      { selector: ".footer-cta", name: "Footer CTA" },
      { selector: "[data-open-cart]", name: "Review CTA" },
      { selector: "[data-exit-cta]", name: "Exit CTA" },
      { selector: "[data-zalo-cta]", name: "Zalo CTA" }
    ];
    var i;
    for (i = 0; i < mapping.length; i += 1) {
      if (element.closest(mapping[i].selector)) return mapping[i].name;
    }
    if (element.closest("[data-cart-checkout]")) return "Cart Checkout CTA";
    if (element.closest('a[href="#order"]')) return "Order CTA";
    if (element.closest('a[href^="tel:"]')) return "Hotline CTA";
    return utils.pickText(element) || "CTA";
  }

  function observeVisibility(selector, callback, threshold) {
    if (!("IntersectionObserver" in window)) return;
    var elements = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        callback(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: threshold || 0.35 });

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function bindDomTracking() {
    var scrollMilestones = [25, 50, 75, 90];

    trackViewContent();

    observeVisibility("[data-order-form-section]", function () {
      trackFormView({
        section: "order_form",
        page_position: "form_section"
      });
      trackViewOffer({
        section: "order_form",
        offer_type: "main_offer"
      });
    }, 0.35);

    observeVisibility("[data-upsell-showcase-grid] .upsell-showcase-card", function (card) {
      var button = card.querySelector("[data-upsell-showcase-add]");
      var productId = button ? button.getAttribute("data-upsell-showcase-add") : "";
      if (!productId) return;
      trackUpsell("view", {
        product_id: productId,
        section: "upsell_showcase"
      });
    }, 0.45);

    window.addEventListener("scroll", function () {
      var scrollTop = window.scrollY || window.pageYOffset || 0;
      var docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      var scrollable = docHeight - viewportHeight;
      if (scrollable <= 0) return;
      var progress = (scrollTop / scrollable) * 100;
      scrollMilestones.forEach(function (threshold) {
        if (progress >= threshold) trackScroll(threshold);
      });
    }, { passive: true });

    document.addEventListener("focusin", function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.closest("[data-order-form]")) return;
      var fieldName = target.name || target.id || target.getAttribute("data-field") || "field";
      trackFormStart({
        field_name: fieldName
      });
    });

    document.addEventListener("input", function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.closest("[data-order-form]")) return;

      var fieldName = target.name || target.id || target.getAttribute("data-field") || "";
      if (fieldName === "phone") trackPhoneInput();
      if (fieldName === "address") trackAddressInput();
    });

    document.addEventListener("change", function (event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.closest("[data-order-form]")) return;

      var orderData = getOrderData();
      if (!orderData) return;
      trackComboChange({
        combo: getComboLabel(orderData),
        value: orderData.pricing.subtotal,
        quantity: orderData.pricing.boxesTotal
      });
    });

    document.addEventListener("click", function (event) {
      var target = event.target.closest("a, button");
      var orderData;
      var card;
      var productId;
      var productNameEl;
      var productPriceEl;
      if (!target) return;

      if (
        target.closest('a[href="#order"]') ||
        target.closest("[data-open-cart]") ||
        target.closest("[data-floating-cta]") ||
        target.closest("[data-sticky-cta]") ||
        target.closest("[data-cart-checkout]") ||
        target.closest("[data-exit-cta]") ||
        target.closest("[data-zalo-cta]")
      ) {
        trackCTA({
          button_name: resolveCtaName(target),
          section: utils.getSectionName(target),
          page_position: utils.getPagePosition(target),
          destination: target.getAttribute("href") || ""
        });
      }

      if (target.closest('a[href^="tel:"]')) {
        trackContact({
          channel: "phone",
          button_name: resolveCtaName(target),
          section: utils.getSectionName(target)
        });
      }

      if (target.closest("[data-zalo-cta]")) {
        trackContact({
          channel: "zalo",
          button_name: resolveCtaName(target),
          section: utils.getSectionName(target)
        });
      }

      if (target.closest("[data-cart-checkout]")) {
        orderData = getOrderData();
        if (orderData) trackAddToCart(orderData);
      }

      if (target.closest("[data-order-submit]")) {
        LAST_ORDER = getOrderData();
        if (LAST_ORDER) trackSubmitClick(LAST_ORDER);
      }

      if (target.closest("[data-upsell-showcase-add], [data-upsell-quick]")) {
        card = target.closest(".upsell-showcase-card, .cross-sell-card, .cross-bundle-card, article, li, div");
        productId = target.getAttribute("data-upsell-showcase-add") || target.getAttribute("data-upsell-quick") || "";
        productNameEl = card ? card.querySelector(".upsell-showcase-name, .cross-sell-name, .cross-bundle-name") : null;
        productPriceEl = card ? card.querySelector(".upsell-showcase-price, .cross-sell-price, .cross-bundle-price") : null;

        trackUpsell(target.classList.contains("is-selected") ? "remove" : "add", {
          product_id: productId,
          product_name: productNameEl ? productNameEl.textContent.replace(/\s+/g, " ").trim() : productId,
          value: productPriceEl ? Number(String(productPriceEl.textContent).replace(/[^\d]/g, "")) : 0,
          section: utils.getSectionName(target)
        });
      }
    });
  }

  function patchFetch() {
    if (!originalFetch) return;

    window.fetch = function (input, init) {
      var requestUrl = typeof input === "string" ? input : (input && input.url) || "";
      var requestInit = init || {};
      var requestBody = requestInit.body || (typeof input !== "string" && input ? input.body : null);
      var isAppsScript = /script\.google\.com\/macros\/s\//i.test(requestUrl);
      var orderData;

      if (!isAppsScript) {
        return originalFetch(input, init);
      }

      orderData = LAST_ORDER || getOrderData();
      LAST_ORDER = orderData;

      return originalFetch(requestUrl, {
        method: requestInit.method || "POST",
        mode: "cors",
        redirect: "follow",
        headers: requestInit.headers || {
          "Content-Type": "text/plain;charset=utf-8",
          Accept: "application/json, text/plain;q=0.9, */*;q=0.8"
        },
        body: requestBody
      }).then(function (response) {
        return response.clone().text().then(function (text) {
          var data = null;

          if (text) {
            try {
              data = JSON.parse(text);
            } catch (error) {
              data = null;
            }
          }

          if (response.ok && data && data.success === true && orderData) {
            orderData = orderData || {};
            orderData.__confirmed = true;
            orderData.orderId = data.event_id || data.order_id || data.orderId || "";
            trackSubmitSuccess(orderData);
            trackLead(orderData);
          } else {
            trackSubmitError({
              reason: (data && data.message) || (response.ok ? "submit_not_confirmed" : "apps_script_http_error")
            });
          }

          return response;
        }).catch(function () {
          trackSubmitError({
            reason: "apps_script_response_parse_error"
          });
          return response;
        });
      }).catch(function (error) {
        trackSubmitError({
          reason: "network_error"
        });
        throw error;
      });
    };
  }

  window.Tracking = {
    DEBUG: core.DEBUG,
    getContext: core.getContext,
    trackViewContent: trackViewContent,
    trackScroll: trackScroll,
    trackCTA: trackCTA,
    trackFormView: trackFormView,
    trackFormStart: trackFormStart,
    trackFormField: trackFormField,
    trackPhoneInput: trackPhoneInput,
    trackAddressInput: trackAddressInput,
    trackComboChange: trackComboChange,
    trackLead: trackLead,
    trackPurchase: trackPurchase,
    trackContact: trackContact,
    trackViewOffer: trackViewOffer,
    trackUpsell: trackUpsell,
    trackAddToCart: trackAddToCart,
    trackSubmitClick: trackSubmitClick,
    trackSubmitSuccess: trackSubmitSuccess,
    trackSubmitError: trackSubmitError,
    getOrderData: getOrderData
  };

  window.SADUTracking = {
    viewContent: trackViewContent,
    initiateCheckout: function () {
      return { skipped: true, reason: "legacy_initiate_checkout_replaced_by_cta_tracking" };
    },
    lead: trackLead,
    purchase: trackPurchase,
    contact: function () {
      return { skipped: true, reason: "legacy_contact_replaced_by_dom_tracking" };
    },
    scroll50: function () {
      return trackScroll(50);
    }
  };

  patchFetch();
  document.addEventListener("DOMContentLoaded", bindDomTracking);
})(window);
