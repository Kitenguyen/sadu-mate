(function (window) {
  "use strict";

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function rafAnimate(options) {
    var start = 0;

    function frame(ts) {
      var progress;
      if (!start) start = ts;
      progress = Math.min(1, (ts - start) / options.duration);
      options.onUpdate((options.easing || easeOutCubic)(progress), progress);
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      } else if (typeof options.onComplete === "function") {
        options.onComplete();
      }
    }

    window.requestAnimationFrame(frame);
  }

  function burstParticles(originRect, host, color) {
    var count = 12;
    var i;

    for (i = 0; i < count; i += 1) {
      createParticle(originRect, host, color, i, count);
    }
  }

  function createParticle(originRect, host, color, index, total) {
    var node = document.createElement("span");
    var angle = (Math.PI * 2 * index) / total;
    var distance = 30 + Math.random() * 26;
    var dx = Math.cos(angle) * distance;
    var dy = Math.sin(angle) * distance;

    node.className = "sadu-game-particle";
    node.style.left = originRect.left + (originRect.width / 2) + "px";
    node.style.top = originRect.top + (originRect.height / 2) + "px";
    node.style.background = color || "rgba(149, 198, 117, 0.85)";
    host.appendChild(node);

    rafAnimate({
      duration: 700,
      easing: easeOutCubic,
      onUpdate: function (value) {
        node.style.transform = "translate(" + (dx * value) + "px, " + (dy * value) + "px) scale(" + (1 - value * 0.4) + ")";
        node.style.opacity = String(1 - value);
      },
      onComplete: function () {
        node.remove();
      }
    });
  }

  function flyToTarget(sourceEl, targetEl, host, onComplete) {
    var clone = sourceEl.cloneNode(true);
    var sourceRect = sourceEl.getBoundingClientRect();
    var targetRect = targetEl.getBoundingClientRect();
    var dx = (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
    var dy = (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);

    clone.classList.add("sadu-game-leaf-fly");
    clone.style.left = sourceRect.left + "px";
    clone.style.top = sourceRect.top + "px";
    clone.style.width = sourceRect.width + "px";
    clone.style.height = sourceRect.height + "px";
    host.appendChild(clone);

    rafAnimate({
      duration: 900,
      easing: easeInOutQuad,
      onUpdate: function (value) {
        var scale = 1 - value * 0.38;
        var rotate = value * 18;
        clone.style.transform =
          "translate(" + (dx * value) + "px, " + (dy * value) + "px) scale(" + scale + ") rotate(" + rotate + "deg)";
        clone.style.opacity = String(1 - value * 0.08);
      },
      onComplete: function () {
        clone.remove();
        if (typeof onComplete === "function") onComplete();
      }
    });
  }

  function showerConfetti(host) {
    var i;
    for (i = 0; i < 24; i += 1) {
      createConfetti(host, i);
    }
  }

  function createConfetti(host, index) {
    var node = document.createElement("span");
    var startX = 12 + (index * 3.1);
    var drift = -60 + Math.random() * 120;
    var duration = 1600 + Math.random() * 600;
    var hue = index % 3 === 0 ? "rgba(114, 160, 88, 0.95)" : index % 3 === 1 ? "rgba(198, 227, 168, 0.95)" : "rgba(213, 183, 108, 0.95)";

    node.className = "sadu-game-confetti";
    node.style.left = startX + "%";
    node.style.background = hue;
    host.appendChild(node);

    rafAnimate({
      duration: duration,
      easing: easeOutCubic,
      onUpdate: function (value) {
        node.style.transform =
          "translate(" + (drift * value) + "px, " + (220 * value) + "px) rotate(" + (460 * value) + "deg)";
        node.style.opacity = String(1 - value);
      },
      onComplete: function () {
        node.remove();
      }
    });
  }

  window.SADUGameAnimation = {
    animate: rafAnimate,
    burstParticles: burstParticles,
    flyToTarget: flyToTarget,
    showerConfetti: showerConfetti
  };
})(window);
