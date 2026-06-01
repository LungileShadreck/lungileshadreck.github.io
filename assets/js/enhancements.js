/**
 * enhancements.js
 * Portfolio UX enhancements — scroll-to-top + fade-in on scroll
 */

(function () {

    /* === Scroll-to-top button === */
    const btn = document.getElementById('scroll-top');
    if (btn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* === Fade-in on scroll (Intersection Observer) === */
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        fadeEls.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        /* Fallback: just make everything visible if no observer support */
        fadeEls.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* === Nav active state — mark current page link === */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('nav#nav a');
    navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href && href === currentPage) {
            link.classList.add('active');
        }
    });

})();
