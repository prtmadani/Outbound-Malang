/* ==========================================================================
   OUTBOUND MALANG — ANIMATION JAVASCRIPT (Vanilla JS)
   Features: Reveal-on-scroll (IntersectionObserver), Counter animation,
   Progress bar animation, Hero parallax, Text reveal, Typing effect.
   ========================================================================== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initRevealOnScroll();
        initCounters();
        initProgressBars();
        initHeroParallax();
        initTextReveal();
    });

    /* ------------------------------------------------------------------------
       REVEAL ON SCROLL — adds .is-visible when element enters viewport
       ------------------------------------------------------------------------ */
    function initRevealOnScroll() {
        var elements = document.querySelectorAll('.reveal, .text-reveal');
        if (!elements.length) return;

        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        elements.forEach(function (el) { observer.observe(el); });
    }

    /* ------------------------------------------------------------------------
       COUNTER ANIMATION — animated number count-up for statistics
       Usage: <span class="js-counter" data-target="500" data-suffix="+">0</span>
       ------------------------------------------------------------------------ */
    function initCounters() {
        var counters = document.querySelectorAll('.js-counter');
        if (!counters.length) return;

        var animateCounter = function (el) {
            var target = parseFloat(el.getAttribute('data-target')) || 0;
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 1800;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
                var current = Math.floor(eased * target);
                el.textContent = current + suffix;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = target + suffix;
                    el.classList.add('is-counted');
                }
            }
            window.requestAnimationFrame(step);
        };

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    /* ------------------------------------------------------------------------
       PROGRESS BAR ANIMATION — fills bar width when scrolled into view
       ------------------------------------------------------------------------ */
    function initProgressBars() {
        var bars = document.querySelectorAll('.progress-bar-fill');
        if (!bars.length) return;

        if (!('IntersectionObserver' in window)) {
            bars.forEach(function (bar) { bar.classList.add('is-filled'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-filled');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        bars.forEach(function (bar) { observer.observe(bar); });
    }

    /* ------------------------------------------------------------------------
       HERO PARALLAX — light parallax on hero background (transform only)
       ------------------------------------------------------------------------ */
    function initHeroParallax() {
        var target = document.querySelector('[data-parallax]');
        if (!target) return;
        var ticking = false;

        function update() {
            var scrolled = window.scrollY;
            var speed = 0.35;
            // Cap the offset so the image never reveals empty space
            var offset = Math.min(scrolled * speed, 140);
            target.style.transform = 'translate3d(0,' + offset + 'px,0) scale(1.08)';
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }

    /* ------------------------------------------------------------------------
       TEXT REVEAL — masked line reveal wrapper (works with .reveal observer)
       ------------------------------------------------------------------------ */
    function initTextReveal() {
        // Handled by the shared IntersectionObserver in initRevealOnScroll(),
        // which also targets .text-reveal elements. This function is kept as an
        // extension point for future per-character/word text animations.
    }

})();
