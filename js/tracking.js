(function () {
  "use strict";

  var modules = [
    "js/tracking-utils.js",
    "js/tracking-storage.js",
    "js/tracking-session.js",
    "js/tracking-core.js",
    "js/tracking-meta.js"
  ];

  for (var i = 0; i < modules.length; i += 1) {
    document.write('<script src="' + modules[i] + '"><\/script>');
  }
})();
