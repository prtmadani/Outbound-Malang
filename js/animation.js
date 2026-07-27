// ==================== animation.js ====================
// Scroll Reveal Observer
document.addEventListener('DOMContentLoaded', function () {
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Counter animation if present
                const counter = entry.target.querySelector('[data-count]');
                if (counter && !counter.classList.contains('counted')) {
                    animateCounter(counter);
                }
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
});

function animateCounter(element) {
    element.classList.add('counted');
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    updateCounter();
}