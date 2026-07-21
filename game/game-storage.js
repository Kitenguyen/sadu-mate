(function (window) {
  "use strict";

  var KEYS = {
    cards: "cards_collected",
    completed: "journey_completed",
    unlocked: "voucher_unlocked"
  };

  function parseCards(raw) {
    if (!raw) return [];
    try {
      return normalizeCards(JSON.parse(raw));
    } catch (error) {
      return [];
    }
  }

  function normalizeCards(value) {
    return Array.isArray(value) ? value.slice(0, 5).filter(Boolean) : [];
  }

  function read() {
    return {
      cards_collected: parseCards(window.localStorage.getItem(KEYS.cards)),
      journey_completed: window.localStorage.getItem(KEYS.completed) === "true",
      voucher_unlocked: window.localStorage.getItem(KEYS.unlocked) === "true"
    };
  }

  function write(state) {
    var cards = normalizeCards(state.cards_collected);
    var completed = !!state.journey_completed;
    var unlocked = !!state.voucher_unlocked;

    try {
      window.localStorage.setItem(KEYS.cards, JSON.stringify(cards));
      window.localStorage.setItem(KEYS.completed, String(completed));
      window.localStorage.setItem(KEYS.unlocked, String(unlocked));
    } catch (error) {}

    return {
      cards_collected: cards,
      journey_completed: completed,
      voucher_unlocked: unlocked
    };
  }

  function update(partial) {
    var current = read();
    return write({
      cards_collected: Object.prototype.hasOwnProperty.call(partial, "cards_collected")
        ? partial.cards_collected
        : current.cards_collected,
      journey_completed: Object.prototype.hasOwnProperty.call(partial, "journey_completed")
        ? partial.journey_completed
        : current.journey_completed,
      voucher_unlocked: Object.prototype.hasOwnProperty.call(partial, "voucher_unlocked")
        ? partial.voucher_unlocked
        : current.voucher_unlocked
    });
  }

  function clearLegacy() {
    var keys = [
      "sadu_game_state_v1",
      "sadu_leaf_hunt_state",
      "sadu_voucher_hunt_state",
      "sadu_healthy_journey_v1"
    ];

    keys.forEach(function (key) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {}
    });
  }

  window.SADUGameStorage = {
    read: read,
    write: write,
    update: update,
    clearLegacy: clearLegacy,
    keys: KEYS
  };
})(window);
