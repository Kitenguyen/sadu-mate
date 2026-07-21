(function (window) {
  "use strict";

  var utils = window.SADUTrackingUtils;
  var storage = window.SADUTrackingStorage;
  var session = window.SADUTrackingSession;
  var memoryFired = Object.create(null);
  var DEBUG = /[?&]tracking_debug=1\b/.test(window.location.search) || window.DEBUG === true;

  window.dataLayer = window.dataLayer || [];

  function hasFired(key) {
    return !!memoryFired[key] || storage.hasFired(key);
  }

  function markFired(key) {
    memoryFired[key] = true;
    storage.markFired(key);
  }

  function buildEnvelope(eventName, payload) {
    var context = session.getContext();
    return {
      event: eventName,
      event_id: utils.randomId("evt"),
      timestamp: utils.nowIso(),
      page: window.location.pathname + window.location.search,
      page_url: window.location.href,
      fbclid: context.fbclid,
      fbc: context.fbc,
      fbp: context.fbp,
      visitor_id: context.visitor_id,
      session_id: context.session_id,
      first_visit: context.first_visit,
      utm: context.utm,
      landing_page: context.landing_page,
      referrer: context.referrer,
      device: context.device,
      browser: context.browser,
      screen_size: context.screen_size,
      timezone: context.timezone,
      language: context.language,
      payload: payload || {}
    };
  }

  function logEvent(envelope) {
    if (!DEBUG || !window.console || !window.console.log) return;
    console.log("[Tracking]", envelope.event, {
      event_id: envelope.event_id,
      time: envelope.timestamp,
      payload: envelope.payload,
      context: {
        session_id: envelope.session_id,
        visitor_id: envelope.visitor_id,
        fbp: envelope.fbp,
        fbc: envelope.fbc
      }
    });
  }

  function pushDataLayer(envelope) {
    window.dataLayer.push({
      event: envelope.event,
      event_id: envelope.event_id,
      tracking: envelope
    });
  }

  function buildMetaParams(envelope, params) {
    var payload = envelope.payload || {};
    var metaParams = {};
    var key;

    for (key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) metaParams[key] = payload[key];
    }

    metaParams.event_id = envelope.event_id;
    metaParams.page = envelope.page;
    metaParams.visitor_id = envelope.visitor_id;
    metaParams.session_id = envelope.session_id;
    metaParams.fbp = envelope.fbp;
    metaParams.fbc = envelope.fbc;
    metaParams.utm_source = envelope.utm.source;
    metaParams.utm_medium = envelope.utm.medium;
    metaParams.utm_campaign = envelope.utm.campaign;
    metaParams.utm_content = envelope.utm.content;
    metaParams.utm_term = envelope.utm.term;
    metaParams.landing_page = envelope.landing_page;
    metaParams.referrer = envelope.referrer;
    metaParams.device = envelope.device;
    metaParams.browser = envelope.browser;
    metaParams.screen_size = envelope.screen_size;
    metaParams.timezone = envelope.timezone;
    metaParams.language = envelope.language;

    if (params) {
      for (key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) metaParams[key] = params[key];
      }
    }

    return metaParams;
  }

  function track(config) {
    var dedupeKey = config.dedupeKey || utils.sanitizeKey(config.eventName);
    if (config.once !== false && hasFired(dedupeKey)) {
      return { skipped: true, dedupe_key: dedupeKey };
    }

    var envelope = buildEnvelope(config.eventName, config.payload || {});
    pushDataLayer(envelope);
    logEvent(envelope);

    if (typeof config.dispatch === "function") {
      config.dispatch(envelope, buildMetaParams);
    }

    if (config.once !== false) markFired(dedupeKey);

    return envelope;
  }

  window.SADUTrackingCore = {
    DEBUG: DEBUG,
    track: track,
    getContext: session.getContext
  };
})(window);
