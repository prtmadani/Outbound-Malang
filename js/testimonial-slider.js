document.addEventListener('DOMContentLoaded', function () {
    var slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    var slides = Array.prototype.slice.call(slider.querySelectorAll('.testimonial-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.testimonial-dot'));
    var prevBtn = document.querySelector('.testimonial-nav__btn--prev');
    var nextBtn = document.querySelector('.testimonial-nav__btn--next');

    if (slides.length < 2) return; // tidak perlu slider kalau ulasan cuma 1

    var current = 0;
    var AUTOPLAY_MS = 2000; // jeda antar pergantian ulasan otomatis
    var timer = null;

    function goTo(index) {
        var next = ((index % slides.length) + slides.length) % slides.length;
        if (next === current) return;

        slides[current].classList.remove('is-active');
        if (dots[current]) {
            dots[current].classList.remove('is-active');
            dots[current].setAttribute('aria-selected', 'false');
        }

        current = next;

        slides[current].classList.add('is-active');
        if (dots[current]) {
            dots[current].classList.add('is-active');
            dots[current].setAttribute('aria-selected', 'true');
        }
    }

    function goNext() { goTo(current + 1); }
    function goPrev() { goTo(current - 1); }

    function startAutoplay() {
        timer = setInterval(goNext, AUTOPLAY_MS);
    }

    function restartAutoplay() {
        clearInterval(timer);
        startAutoplay();
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            goTo(i);
            restartAutoplay();
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            goPrev();
            restartAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            goNext();
            restartAutoplay();
        });
    }

    // jeda otomatis saat kursor di atas kartu, lanjut lagi saat kursor keluar
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', restartAutoplay);

    startAutoplay();
});
