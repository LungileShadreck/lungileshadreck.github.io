/**
 * nav.js — Unified responsive navigation
 * Single nav DOM; desktop inline bar + mobile fullscreen overlay.
 */
(function () {
  'use strict';

  var MOBILE_MQ = window.matchMedia('(max-width: 991px)');
  var body = document.body;
  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  var closeBtn = nav ? nav.querySelector('.nav-close') : null;

  if (!header || !nav || !toggle) {
    return;
  }

  function openNav() {
    body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    nav.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('nav-scroll-lock');
  }

  function closeNav() {
    body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    if (MOBILE_MQ.matches) {
      nav.setAttribute('aria-hidden', 'true');
    } else {
      nav.removeAttribute('aria-hidden');
    }
    document.documentElement.classList.remove('nav-scroll-lock');
  }

  if (MOBILE_MQ.matches) {
    nav.setAttribute('aria-hidden', 'true');
  }

  function isOpen() {
    return body.classList.contains('nav-open');
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) {
      closeNav();
    } else {
      openNav();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (MOBILE_MQ.matches) {
        closeNav();
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      closeNav();
      toggle.focus();
    }
  });

  function onBreakpointChange() {
    if (!MOBILE_MQ.matches) {
      if (isOpen()) {
        closeNav();
      }
      nav.removeAttribute('aria-hidden');
    } else if (!isOpen()) {
      nav.setAttribute('aria-hidden', 'true');
    }
  }

  if (typeof MOBILE_MQ.addEventListener === 'function') {
    MOBILE_MQ.addEventListener('change', onBreakpointChange);
  } else if (typeof MOBILE_MQ.addListener === 'function') {
    MOBILE_MQ.addListener(onBreakpointChange);
  }

  /* Remove any legacy template-injected nav elements */
  ['navPanel', 'titleBar', 'mobile-menu-toggle'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.parentNode.removeChild(el);
    }
  });

  body.classList.remove('navPanel-visible');
})();
