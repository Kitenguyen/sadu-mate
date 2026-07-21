(function (window) {
  "use strict";

  function nowIso() {
    return new Date().toISOString();
  }

  function randomId(prefix) {
    var seed = Math.random().toString(36).slice(2, 10);
    return (prefix || "trk") + "_" + Date.now().toString(36) + "_" + seed;
  }

  function safeParse(json, fallback) {
    if (!json) return fallback;
    try {
      return JSON.parse(json);
    } catch (error) {
      return fallback;
    }
  }

  function getQueryParams() {
    var params = new URLSearchParams(window.location.search || "");
    return {
      fbclid: params.get("fbclid") || "",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || ""
    };
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : "";
  }

  function setCookie(name, value, maxAgeSeconds) {
    var cookie = name + "=" + encodeURIComponent(value) + "; path=/; SameSite=Lax";
    if (window.location.protocol === "https:") cookie += "; Secure";
    if (maxAgeSeconds) cookie += "; max-age=" + maxAgeSeconds;
    document.cookie = cookie;
  }

  function ensureFbp() {
    var existing = getCookie("_fbp");
    if (existing) return existing;
    var value = "fb.1." + Date.now() + "." + Math.floor(Math.random() * 1000000000);
    setCookie("_fbp", value, 90 * 24 * 60 * 60);
    return value;
  }

  function ensureFbc(fbclid) {
    if (!fbclid) return getCookie("_fbc") || "";
    var value = "fb.1." + Date.now() + "." + fbclid;
    setCookie("_fbc", value, 90 * 24 * 60 * 60);
    return value;
  }

  function getDeviceType() {
    var width = window.innerWidth || document.documentElement.clientWidth || screen.width || 0;
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  }

  function getBrowser() {
    var ua = navigator.userAgent;
    if (/edg/i.test(ua)) return "Edge";
    if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
    if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) return "Safari";
    if (/firefox|fxios/i.test(ua)) return "Firefox";
    return "Other";
  }

  function getPagePosition(element) {
    if (!element || !element.getBoundingClientRect) return "unknown";
    var rect = element.getBoundingClientRect();
    var mid = rect.top + (rect.height / 2);
    var viewport = window.innerHeight || document.documentElement.clientHeight || 0;
    if (mid < viewport * 0.33) return "above_fold";
    if (mid < viewport * 0.66) return "mid_fold";
    return "below_fold";
  }

  function getSectionName(element) {
    var section = element && element.closest && element.closest("section, header, footer, aside, nav, main, div[id]");
    if (!section) return "page";
    return (
      section.getAttribute("data-tracking-section") ||
      section.id ||
      section.className.split(" ")[0] ||
      section.tagName.toLowerCase()
    );
  }

  function pickText(element) {
    if (!element) return "";
    return (element.getAttribute("aria-label") || element.textContent || "").replace(/\s+/g, " ").trim();
  }

  function sanitizeKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  window.SADUTrackingUtils = {
    nowIso: nowIso,
    randomId: randomId,
    safeParse: safeParse,
    getQueryParams: getQueryParams,
    getCookie: getCookie,
    ensureFbp: ensureFbp,
    ensureFbc: ensureFbc,
    getDeviceType: getDeviceType,
    getBrowser: getBrowser,
    getPagePosition: getPagePosition,
    getSectionName: getSectionName,
    pickText: pickText,
    sanitizeKey: sanitizeKey
  };
})(window);
