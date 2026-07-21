(function (window, document) {
  "use strict";

  var core = window.SADUTrackingCore;
  var tracking = window.Tracking;
  var fired = {};

  function getContext() {
    if (tracking && typeof tracking.getContext === "function") {
      return tracking.getContext();
    }
    if (core && typeof core.getContext === "function") {
      return core.getContext();
    }
    return {
      fbclid: "",
      visitor_id: "",
      utm: {}
    };
  }

  function getScrollDepth() {
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var doc = document.documentElement;
    var body = document.body;
    var docHeight = Math.max(doc.scrollHeight, body.scrollHeight);
    var viewport = window.innerHeight || doc.clientHeight || 0;
    var available = docHeight - viewport;

    if (available <= 0) return 0;
    return Math.round((scrollTop / available) * 100);
  }

  function enrich(payload) {
    var context = getContext();
    var data = {};
    var key;

    payload = payload || {};

    for (key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        data[key] = payload[key];
      }
    }

    data.time_on_page = Math.round(performance.now() / 1000);
    data.scroll_depth = getScrollDepth();
    data.utm = context.utm || {};
    data.fbclid = context.fbclid || "";
    data.visitor_id = context.visitor_id || "";

    return data;
  }

  function emit(eventName, payload, onceKey) {
    var data = enrich(payload);

    if (onceKey && fired[onceKey]) {
      return { skipped: true, onceKey: onceKey };
    }
    if (onceKey) fired[onceKey] = true;

    if (core && typeof core.track === "function") {
      return core.track({
        eventName: eventName,
        payload: data,
        dedupeKey: onceKey || ("sadu_game_" + eventName + "_" + (data.card_number || data.leaf_number || "event")),
        once: !!onceKey,
        dispatch: function (envelope, buildMetaParams) {
          if (typeof window.fbq === "function") {
            window.fbq("trackCustom", eventName, buildMetaParams(envelope), {
              eventID: envelope.event_id
            });
          }
        }
      });
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      payload: data
    });

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, data);
    }

    return data;
  }

  window.SADUGameTracking = {
    trackHealthyCardOpen: function (payload) {
      return emit("HealthyCardOpen", payload);
    },
    trackHealthyCardCollected: function (payload) {
      return emit("HealthyCardCollected", payload, "healthy_card_collected_" + payload.card_number);
    },
    trackHealthyJourneyCompleted: function (payload) {
      return emit("HealthyJourneyCompleted", payload, "healthy_journey_completed");
    },
    trackVoucherUnlocked: function (payload) {
      return emit("VoucherUnlocked", payload, "healthy_voucher_unlocked");
    },
    trackVoucherCopied: function (payload) {
      return emit("VoucherCopied", payload, "healthy_voucher_copied");
    },
    trackScrollToOrder: function (payload) {
      return emit("ScrollToOrder", payload);
    },
    trackVoucherApplied: function (payload) {
      return emit("VoucherApplied", payload, "healthy_voucher_applied");
    }
  };
})(window, document);
