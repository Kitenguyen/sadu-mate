(function () {
  "use strict";

  var STORAGE_PREFIX = "sadu_tracking_";
  var memoryFired = Object.create(null);

  function canUseSessionStorage() {
    try {
      return !!window.sessionStorage;
    } catch (e) {
      return false;
    }
  }

  function hasFired(eventName) {
    if (memoryFired[eventName]) return true;
    if (!canUseSessionStorage()) return false;

    try {
      return window.sessionStorage.getItem(STORAGE_PREFIX + eventName) === "1";
    } catch (e) {
      return false;
    }
  }

  function markFired(eventName) {
    memoryFired[eventName] = true;
    if (!canUseSessionStorage()) return;

    try {
      window.sessionStorage.setItem(STORAGE_PREFIX + eventName, "1");
    } catch (e) {}
  }

  function trackOnce(eventName, tracker) {
    if (hasFired(eventName)) return false;
    if (typeof window.fbq !== "function") return false;

    tracker();
    markFired(eventName);
    return true;
  }

  // Public Meta tracking API for the SADU landing page.
  window.SADUTracking = {
    pageView: function () {
      return trackOnce("pageView", function () {
        window.fbq("track", "PageView");
      });
    },

    viewContent: function () {
      return trackOnce("viewContent", function () {
        window.fbq("track", "ViewContent");
      });
    },

    initiateCheckout: function () {
      return trackOnce("initiateCheckout", function () {
        window.fbq("track", "InitiateCheckout");
      });
    },

    lead: function (payload) {
      return trackOnce("lead", function () {
        window.fbq("track", "Lead", {
          content_name: "SADU Mate",
          value: payload && typeof payload.value !== "undefined" ? payload.value : 0,
          currency: "VND"
        });
      });
    },

    purchase: function (payload) {
      return trackOnce("purchase", function () {
        window.fbq("track", "Purchase", {
          value: payload && typeof payload.value !== "undefined" ? payload.value : 0,
          currency: "VND",
          content_name: "SADU Mate",
          content_type: "product",
          num_items: payload && typeof payload.num_items !== "undefined" ? payload.num_items : 0
        });
      });
    },

    contact: function () {
      return trackOnce("contact", function () {
        window.fbq("track", "Contact");
      });
    },

    scroll50: function () {
      return trackOnce("scroll50", function () {
        window.fbq("trackCustom", "Scroll50");
      });
    }
  };

  function initScroll50Tracking() {
    function onScroll() {
      var scrollTop = window.scrollY || window.pageYOffset || 0;
      var docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      var scrollable = docHeight - viewportHeight;
      if (scrollable <= 0) return;

      var progress = scrollTop / scrollable;
      if (progress >= 0.5) {
        window.SADUTracking.scroll50();
        window.removeEventListener("scroll", onScroll);
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Scroll50 is handled here because it is page-wide behavior and should fire
  // only once after the visitor passes 50% of the landing page.
  document.addEventListener("DOMContentLoaded", initScroll50Tracking);
})();
