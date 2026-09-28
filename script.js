/* ============================================================
   ZaitXCode — Interactions
   ============================================================ */

(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1. Theme toggle (with persistence)
     ---------------------------------------------------------- */
  var THEME_KEY = 'zaitxcode-theme';
  var stored = null;

  try {
    stored = localStorage.getItem(THEME_KEY);
  } catch (e) {
    /* localStorage unavailable (private mode, file:// …) */
  }

  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme, persist) {
    if (theme !== 'light' && theme !== 'dark') theme = 'dark';
    root.setAttribute('data-theme', theme);

    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#090d16');

    var button = doc.getElementById('theme-toggle');
    if (button) {
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }

    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
  }

  applyTheme(stored === 'light' || stored === 'dark'
    ? stored
    : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'), false);

  var toggle = doc.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);

  /* Keep in sync if the user changes their OS preference
     (only while no explicit choice is stored). */
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (event) {
    if (stored !== 'light' && stored !== 'dark') {
      applyTheme(event.matches ? 'light' : 'dark', false);
    }
  });

  if (reducedMotion) return;

  /* ----------------------------------------------------------
     2. Scroll reveal
     ---------------------------------------------------------- */
  var revealables = doc.querySelectorAll('[data-reveal]');
  revealables.forEach(function (el) {
    var delay = parseInt(el.getAttribute('data-delay'), 10);
    if (!isNaN(delay)) el.style.setProperty('--reveal-delay', delay + 'ms');
  });

  if ('IntersectionObserver' in window && revealables.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----------------------------------------------------------
     3. 3D tilt effect for cards (pointer + device orientation)
     ---------------------------------------------------------- */
  var tiltTargets = doc.querySelectorAll('[data-tilt]');
  var activeTilt = null;

  function setTiltTransform(el, rx, ry, scale) {
    el.style.transform =
      'perspective(1100px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)' +
      (scale ? ' scale(' + scale.toFixed(3) + ')' : '');
  }

  function clearTilt(el) {
    el.style.transform = '';
  }

  function bindPointerTilt(el, maxTilt) {
    el.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch') return; /* touch handled below */
      var rect = el.getBoundingClientRect();
      var px = (event.clientX - rect.left) / rect.width;
      var py = (event.clientY - rect.top) / rect.height;
      /* rotateY follows the cursor horizontally, rotateX inverts vertically */
      setTiltTransform(el, (0.5 - py) * maxTilt * 2, (px - 0.5) * maxTilt * 2, 1.015);
    });

    el.addEventListener('pointerleave', function () { clearTilt(el); });
    el.addEventListener('pointercancel', function () { clearTilt(el); });
  }

  function bindTouchTilt(el, maxTilt) {
    el.addEventListener('touchmove', function (event) {
      var touch = event.touches[0];
      if (!touch) return;
      var rect = el.getBoundingClientRect();
      var px = Math.min(Math.max((touch.clientX - rect.left) / rect.width, 0), 1);
      var py = Math.min(Math.max((touch.clientY - rect.top) / rect.height, 0), 1);
      setTiltTiltTouch(el, py, px, maxTilt);
    }, { passive: true });

    el.addEventListener('touchend', function () { clearTilt(el); });
    el.addEventListener('touchcancel', function () { clearTilt(el); });
  }

  function setTiltTiltTouch(el, py, px, maxTilt) {
    setTiltTransform(el, (0.5 - py) * maxTilt * 2, (px - 0.5) * maxTilt * 2, 1.015);
  }

  tiltTargets.forEach(function (el) {
    var maxTilt = parseFloat(el.getAttribute('data-tilt'));
    if (isNaN(maxTilt) || maxTilt <= 0) maxTilt = 6;
    bindPointerTilt(el, maxTilt);
    bindTouchTilt(el, maxTilt);
    el.addEventListener('blur', function () { clearTilt(el); });
  });

  /* Device-orientation tilt on mobile (requires permission on iOS 13+) */
  function handleOrientation(event) {
    if (!activeTilt) return;
    var beta = event.beta || 0;  /* front/back tilt, -180..180 */
    var gamma = event.gamma || 0; /* left/right tilt, -90..90 */
    var maxTilt = parseFloat(activeTilt.getAttribute('data-tilt')) || 6;
    var rect = activeTilt.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    var rx = Math.min(Math.max(beta / 45, -1), 1) * maxTilt;
    var ry = Math.min(Math.max(gamma / 45, -1), 1) * maxTilt;
    setTiltTransform(activeTilt, rx, ry, 1.015);
  }

  function activateOrientationTilt() {
    tiltTargets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) activeTilt = el;
    });
    window.addEventListener('deviceorientation', handleOrientation);
  }

  if ('DeviceOrientationEvent' in window &&
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    /* iOS asks for permission on the first user gesture */
    doc.addEventListener('touchstart', function () {
      DeviceOrientationEvent.requestPermission().then(function (state) {
        if (state === 'granted') activateOrientationTilt();
      }).catch(function () { /* permission denied — pointer tilt still works */ });
    }, { once: true, passive: true });
  } else if ('DeviceOrientationEvent' in window) {
    activateOrientationTilt();
  }

  /* ----------------------------------------------------------
     4. Subtle parallax for the hero orbs
     ---------------------------------------------------------- */
  var orbs = doc.querySelectorAll('.orb');
  if (orbs.length && window.matchMedia('(hover: hover) and (min-width: 769px)').matches) {
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var offset = window.scrollY * 0.18;
        orbs.forEach(function (orb, i) {
          orb.style.translate = '0 ' + (offset * (i === 0 ? 1 : -0.7)).toFixed(2) + 'px';
        });
        ticking = false;
      });
    }, { passive: true });
  }
})();
