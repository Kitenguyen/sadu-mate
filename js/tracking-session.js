(function (window) {
  "use strict";

  var utils = window.SADUTrackingUtils;
  var storage = window.SADUTrackingStorage;
  var SESSION_TIMEOUT_MS = 30 * 60 * 1000;

  function ensureVisitor() {
    var visitorId = storage.getItem("localStorage", "visitor_id");
    var firstVisit = storage.getItem("localStorage", "first_visit");

    if (!visitorId) {
      visitorId = utils.randomId("visitor");
      firstVisit = utils.nowIso();
      storage.setItem("localStorage", "visitor_id", visitorId);
      storage.setItem("localStorage", "first_visit", firstVisit);
    }

    return {
      visitor_id: visitorId,
      first_visit: firstVisit || utils.nowIso()
    };
  }

  function ensureSession() {
    var current = storage.getJson("sessionStorage", "session_meta", null);
    var now = Date.now();

    if (!current || !current.session_id || (now - (current.last_seen_at || 0)) > SESSION_TIMEOUT_MS) {
      current = {
        session_id: utils.randomId("session"),
        started_at: utils.nowIso(),
        last_seen_at: now
      };
    } else {
      current.last_seen_at = now;
    }

    storage.setJson("sessionStorage", "session_meta", current);
    return current;
  }

  function persistAttribution() {
    var query = utils.getQueryParams();
    var stored = storage.getJson("localStorage", "attribution", {});
    var merged = {
      fbclid: query.fbclid || stored.fbclid || "",
      utm_source: query.utm_source || stored.utm_source || "",
      utm_medium: query.utm_medium || stored.utm_medium || "",
      utm_campaign: query.utm_campaign || stored.utm_campaign || "",
      utm_content: query.utm_content || stored.utm_content || "",
      utm_term: query.utm_term || stored.utm_term || "",
      landing_page: stored.landing_page || window.location.href,
      referrer: stored.referrer || document.referrer || ""
    };

    storage.setJson("localStorage", "attribution", merged);
    return merged;
  }

  function getContext() {
    var visitor = ensureVisitor();
    var session = ensureSession();
    var attribution = persistAttribution();
    var query = utils.getQueryParams();
    var fbp = utils.ensureFbp();
    var fbc = utils.ensureFbc(query.fbclid || attribution.fbclid);

    return {
      visitor_id: visitor.visitor_id,
      session_id: session.session_id,
      first_visit: visitor.first_visit,
      fbclid: query.fbclid || attribution.fbclid || "",
      fbc: fbc,
      fbp: fbp,
      utm: {
        source: attribution.utm_source || "",
        medium: attribution.utm_medium || "",
        campaign: attribution.utm_campaign || "",
        content: attribution.utm_content || "",
        term: attribution.utm_term || ""
      },
      landing_page: attribution.landing_page || window.location.href,
      referrer: attribution.referrer || "",
      device: utils.getDeviceType(),
      browser: utils.getBrowser(),
      screen_size: (window.screen && window.screen.width ? window.screen.width : 0) + "x" + (window.screen && window.screen.height ? window.screen.height : 0),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      language: navigator.language || ""
    };
  }

  window.SADUTrackingSession = {
    getContext: getContext
  };
})(window);
