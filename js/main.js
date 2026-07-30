/* ==========================================================================
   OUTBOUND MALANG — MAIN JAVASCRIPT (Vanilla JS, no dependencies)
   Features: Preloader, Sticky Navbar, Mobile Menu, Dropdown, Smooth Scroll,
   Scroll Spy, Back To Top, Gallery Filter + Lightbox, FAQ Accordion,
   Contact Form Simulation, Ripple Button Effect, Article TOC Toggle.
   ========================================================================== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initPreloader();
        initStickyNavbar();
        initMobileMenu();
        initDropdownMobile();
        initSmoothScroll();
        initScrollSpy();
        initBackToTop();
        initGalleryFilter();
        initPackageFilter();
        initLightbox();
        initFaqAccordion();
        initContactForm();
        initRippleButtons();
        initCurrentYear();
        initActiveNavByPage();
        initArticleToc();
    });

    /* ------------------------------------------------------------------------
       PRELOADER — hide as soon as the DOM is ready (does NOT wait for every
       image/font/CDN asset via window.load, so pages with many images no
       longer feel stuck behind the spinner).
       ------------------------------------------------------------------------ */
    function initPreloader() {
        var preloader = document.querySelector('.preloader');
        if (!preloader) return;
        // Fungsi ini dipanggil dari listener DOMContentLoaded di bawah, jadi DOM
        // sudah siap dibaca saat titik ini tercapai — cukup beri jeda singkat
        // untuk transisi halus, tanpa menunggu gambar/CDN eksternal selesai.
        setTimeout(function () {
            preloader.classList.add('is-hidden');
        }, 300);
    }

    /* ------------------------------------------------------------------------
       STICKY / TRANSPARENT NAVBAR
       ------------------------------------------------------------------------ */
    function initStickyNavbar() {
        var header = document.querySelector('.site-header');
        if (!header) return;
        var toggle = function () {
            if (window.scrollY > 40) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        toggle();
        window.addEventListener('scroll', toggle, { passive: true });
    }

    /* ------------------------------------------------------------------------
       MOBILE HAMBURGER MENU (offcanvas)
       ------------------------------------------------------------------------ */
    function initMobileMenu() {
        var hamburger = document.querySelector('.hamburger');
        var menu = document.querySelector('.nav-menu');
        var overlay = document.querySelector('.nav-overlay');
        if (!hamburger || !menu) return;

        function closeMenu() {
            hamburger.classList.remove('is-active');
            menu.classList.remove('is-open');
            if (overlay) overlay.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        function openMenu() {
            hamburger.classList.add('is-active');
            menu.classList.add('is-open');
            if (overlay) overlay.classList.add('is-open');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        hamburger.addEventListener('click', function () {
            var isOpen = menu.classList.contains('is-open');
            isOpen ? closeMenu() : openMenu();
        });

        if (overlay) overlay.addEventListener('click', closeMenu);

        // Close on link click (mobile)
        menu.querySelectorAll('.nav-menu__link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 991) closeMenu();
            });
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }

    /* ------------------------------------------------------------------------
       DROPDOWN TOGGLE ON MOBILE (tap to expand submenu)
       ------------------------------------------------------------------------ */
    function initDropdownMobile() {
        var dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(function (dd) {
            var toggle = dd.querySelector('.nav-dropdown__link');
            if (!toggle) return;
            toggle.addEventListener('click', function (e) {
                if (window.innerWidth <= 991) {
                    e.preventDefault();
                    dd.classList.toggle('is-open');
                }
            });
        });
    }

    /* ------------------------------------------------------------------------
       SMOOTH SCROLL for in-page anchors
       ------------------------------------------------------------------------ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    var headerH = document.querySelector('.site-header') ? document.querySelector('.site-header').offsetHeight : 0;
                    var top = target.getBoundingClientRect().top + window.pageYOffset - headerH + 1;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        });
    }

    /* ------------------------------------------------------------------------
       SCROLL SPY — highlight active nav link based on section in view
       ------------------------------------------------------------------------ */
    function initScrollSpy() {
        var sections = document.querySelectorAll('main [id]');
        var navLinks = document.querySelectorAll('.nav-menu__link[href^="#"]');
        if (!sections.length || !navLinks.length) return;

        var spy = function () {
            var scrollPos = window.scrollY + 140;
            sections.forEach(function (section) {
                if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                    navLinks.forEach(function (link) { link.classList.remove('is-active'); });
                    var active = document.querySelector('.nav-menu__link[href="#' + section.id + '"]');
                    if (active) active.classList.add('is-active');
                }
            });
        };
        window.addEventListener('scroll', spy, { passive: true });
        spy();
    }

    /* ------------------------------------------------------------------------
       ACTIVE NAV LINK BY CURRENT PAGE (multi-page navigation state)
       ------------------------------------------------------------------------ */
    function initActiveNavByPage() {
        var path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-menu__link[href]').forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === path || (path === '' && href === 'index.html')) {
                link.classList.add('is-active');
            }
        });
    }

    /* ------------------------------------------------------------------------
       BACK TO TOP BUTTON
       ------------------------------------------------------------------------ */
    function initBackToTop() {
        var btn = document.querySelector('.back-to-top');
        if (!btn) return;
        window.addEventListener('scroll', function () {
            btn.classList.toggle('is-visible', window.scrollY > 500);
        }, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ------------------------------------------------------------------------
       GALLERY FILTER (category filter, vanilla JS)
       ------------------------------------------------------------------------ */
    function initGalleryFilter() {
        var buttons = document.querySelectorAll('.gallery-filter__btn');
        var items = document.querySelectorAll('.masonry-item');
        if (!buttons.length || !items.length) return;

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('is-active'); });
                btn.classList.add('is-active');
                var filter = btn.getAttribute('data-filter');

                items.forEach(function (item) {
                    var cat = item.getAttribute('data-category');
                    var show = filter === 'all' || cat === filter;
                    item.classList.toggle('is-hidden', !show);
                });
            });
        });
    }

    /* ------------------------------------------------------------------------
   PACKAGE CATALOG FILTER (package.html)
   ------------------------------------------------------------------------ */
    function initPackageFilter() {
        var buttons = document.querySelectorAll('.pkg-filter__btn');
        var items = document.querySelectorAll('.pkg-item');
        if (!buttons.length || !items.length) return;

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('is-active'); });
                btn.classList.add('is-active');
                var filter = btn.getAttribute('data-filter');

                items.forEach(function (item) {
                    var cats = (item.getAttribute('data-category') || '').split(' ');
                    var show = filter === 'all' || cats.indexOf(filter) !== -1;
                    item.classList.toggle('is-hidden', !show);
                });
            });
        });
    }

    /* ------------------------------------------------------------------------
       LIGHTBOX for gallery images
       ------------------------------------------------------------------------ */
    function initLightbox() {
        var lightbox = document.querySelector('.lightbox');
        if (!lightbox) return;
        var imgEl = lightbox.querySelector('.lightbox__img');
        var captionEl = lightbox.querySelector('.lightbox__caption');
        var closeBtn = lightbox.querySelector('.lightbox__close');
        var prevBtn = lightbox.querySelector('.lightbox__prev');
        var nextBtn = lightbox.querySelector('.lightbox__next');
        var items = Array.prototype.slice.call(document.querySelectorAll('.masonry-item'));
        var currentIndex = 0;

        function openLightbox(index) {
            var visibleItems = items.filter(function (i) { return !i.classList.contains('is-hidden'); });
            if (!visibleItems.length) return;
            currentIndex = items.indexOf(items.filter(function (i) { return !i.classList.contains('is-hidden'); })[index] || visibleItems[0]);
            showImage(items[index]);
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        function showImage(item) {
            if (!item) return;
            var img = item.querySelector('img');
            imgEl.src = img.getAttribute('src');
            imgEl.alt = img.getAttribute('alt') || '';
            captionEl.textContent = img.getAttribute('alt') || '';
        }

        items.forEach(function (item, index) {
            item.addEventListener('click', function () {
                currentIndex = index;
                showImage(item);
                lightbox.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        function nextImage(step) {
            var visible = items.filter(function (i) { return !i.classList.contains('is-hidden'); });
            if (!visible.length) return;
            var visIndex = visible.indexOf(items[currentIndex]);
            visIndex = (visIndex + step + visible.length) % visible.length;
            currentIndex = items.indexOf(visible[visIndex]);
            showImage(items[currentIndex]);
        }

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', function () { nextImage(-1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { nextImage(1); });
        lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') nextImage(-1);
            if (e.key === 'ArrowRight') nextImage(1);
        });
    }

    /* ------------------------------------------------------------------------
       FAQ ACCORDION
       ------------------------------------------------------------------------ */
    function initFaqAccordion() {
        var items = document.querySelectorAll('.faq-accordion__item');
        if (!items.length) return;

        items.forEach(function (item) {
            var btn = item.querySelector('.faq-accordion__btn');
            var panel = item.querySelector('.faq-accordion__panel');
            if (!btn || !panel) return;

            btn.addEventListener('click', function () {
                var isOpen = btn.getAttribute('aria-expanded') === 'true';

                // Close all others (single-open accordion behaviour)
                items.forEach(function (other) {
                    var otherBtn = other.querySelector('.faq-accordion__btn');
                    var otherPanel = other.querySelector('.faq-accordion__panel');
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherPanel.style.maxHeight = null;
                });

                if (!isOpen) {
                    btn.setAttribute('aria-expanded', 'true');
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                }
            });
        });
    }

    /* ------------------------------------------------------------------------
       CONTACT FORM — client-side validation + simulated success (no backend)
       ------------------------------------------------------------------------ */
    function initContactForm() {
        var form = document.querySelector('.contact-form form');
        if (!form) return;
        var successBox = document.querySelector('.form-success-message');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Mengirim...';

            // Simulate network delay for realistic UX (no backend / static site)
            setTimeout(function () {
                form.reset();
                form.classList.remove('was-validated');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                if (successBox) {
                    successBox.classList.remove('d-none');
                    successBox.setAttribute('role', 'alert');
                    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(function () { successBox.classList.add('d-none'); }, 6000);
                }
            }, 1200);
        });
    }

    /* ------------------------------------------------------------------------
       RIPPLE EFFECT on brand buttons
       ------------------------------------------------------------------------ */
    function initRippleButtons() {
        var buttons = document.querySelectorAll('.btn-brand, .btn-outline-brand, .btn-white');
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var rect = btn.getBoundingClientRect();
                var ripple = document.createElement('span');
                var size = Math.max(rect.width, rect.height);
                ripple.className = 'ripple';
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                btn.appendChild(ripple);
                setTimeout(function () { ripple.remove(); }, 650);
            });
        });
    }

    /* ------------------------------------------------------------------------
       CURRENT YEAR IN FOOTER
       ------------------------------------------------------------------------ */
    function initCurrentYear() {
        var el = document.querySelector('.js-current-year');
        if (el) el.textContent = new Date().getFullYear();
    }

    /* ------------------------------------------------------------------------
       ARTICLE — DAFTAR ISI (TOC) TOGGLE (article-detail.html)
       ------------------------------------------------------------------------ */
    function initArticleToc() {
        var toggle = document.querySelector('.toc-toggle');
        var content = document.getElementById('tocContent');
        if (!toggle || !content) return;

        toggle.addEventListener('click', function () {
            var isOpen = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
            content.classList.toggle('is-open', !isOpen);
        });

        // Buka otomatis di layar besar agar tautan langsung terlihat
        if (window.innerWidth >= 992) {
            toggle.setAttribute('aria-expanded', 'true');
            content.classList.add('is-open');
        }
    }

})();