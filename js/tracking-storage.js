(function (window) {
  "use strict";

  var PREFIX = "sadu_tracking_";

  function getStorage(type) {
    try {
      return window[type];
    } catch (error) {
      return null;
    }
  }

  function setItem(type, key, value) {
    var storage = getStorage(type);
    if (!storage) return false;
    try {
      storage.setItem(PREFIX + key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getItem(type, key) {
    var storage = getStorage(type);
    if (!storage) return "";
    try {
      return storage.getItem(PREFIX + key) || "";
    } catch (error) {
      return "";
    }
  }

  function setJson(type, key, value) {
    return setItem(type, key, JSON.stringify(value));
  }

  function getJson(type, key, fallback) {
    return window.SADUTrackingUtils.safeParse(getItem(type, key), fallback);
  }

  function hasFired(key) {
    return getItem("sessionStorage", "fired_" + key) === "1";
  }

  function markFired(key) {
    setItem("sessionStorage", "fired_" + key, "1");
  }

  window.SADUTrackingStorage = {
    setItem: setItem,
    getItem: getItem,
    setJson: setJson,
    getJson: getJson,
    hasFired: hasFired,
    markFired: markFired
  };
})(window);
