/**
 * portfolio.js — Lungile Shadreck Portfolio
 * Premium UX enhancements: scroll progress, typed text,
 * mobile menu, Intersection Observer, nav active state.
 * Vanilla JS — no dependencies. GitHub Pages compatible.
 */

(function () {
  'use strict';

  /* =========================================================
     1. SCROLL PROGRESS BAR
     ========================================================= */
  var progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var scrollTop  = window.scrollY || document.documentElement.scrollTop;
      var docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* =========================================================
     2. SCROLL-TO-TOP BUTTON
     ========================================================= */
  var scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.classList.toggle('visible', window.scrollY > 320);
    }, { passive: true });

    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================
     3. FADE-IN ON SCROLL — Intersection Observer
     ========================================================= */
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      fadeEls.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: show all immediately
      fadeEls.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* =========================================================
     4. NAV ACTIVE STATE — mark current page link
     ========================================================= */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '') currentPage = 'index.html';

  var navLinks = document.querySelectorAll('nav#nav a');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href === currentPage) {
      link.classList.add('active');
    }
  });

  /* =========================================================
     5. TYPED TEXT EFFECT — banner subtitle
     Cycles through roles with a subtle cursor blink.
     Only runs if #typed-text element exists on page.
     ========================================================= */
  var typedEl = document.getElementById('typed-text');
  if (typedEl) {
    var roles = [
      'Creative Designer',
      'Web Developer',
      'Brand Strategist',
      'Social Media Consultant',
      'Visual Director'
    ];
    var roleIndex  = 0;
    var charIndex  = 0;
    var isDeleting = false;
    var typeDelay  = 90;
    var deleteDelay = 55;
    var pauseDelay  = 2200;

    function typeLoop() {
      var current = roles[roleIndex];

      if (isDeleting) {
        charIndex--;
        typedEl.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex  = (roleIndex + 1) % roles.length;
          setTimeout(typeLoop, 400);
          return;
        }
        setTimeout(typeLoop, deleteDelay);
      } else {
        charIndex++;
        typedEl.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeLoop, pauseDelay);
          return;
        }
        setTimeout(typeLoop, typeDelay);
      }
    }

    // Small delay before starting
    setTimeout(typeLoop, 1200);
  }

  /* =========================================================
     6. HEADER TRANSPARENCY → SOLID on scroll (landing page only)
     On the landing page the header starts transparent;
     this adds a subtle background when user scrolls down
     so the nav text stays readable over content.
     ========================================================= */
  var header = document.getElementById('header');
  var isLanding = document.body.classList.contains('landing');

  if (header && isLanding) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }, { passive: true });
  }

  /* =========================================================
     8. IMAGE LAZY LOADING POLYFILL
     For browsers that don't support native loading="lazy"
     ========================================================= */
  if ('loading' in HTMLImageElement.prototype) {
    // Native support — nothing to do
  } else {
    // Simple scroll-based lazy load fallback
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });

      lazyImages.forEach(function (img) { imgObserver.observe(img); });
    }
  }

  /* =========================================================
     9. SMOOTH ANCHOR SCROLLING — for in-page # links
     ========================================================= */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').substring(1);
      var target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
