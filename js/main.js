// ==================== main.js ====================
document.addEventListener('DOMContentLoaded', function () {
    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('preloader--hidden');
        }, 600);
    });

    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }

        // Back to Top visibility
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 500) {
            backToTop.classList.add('back-to-top--visible');
        } else {
            backToTop.classList.remove('back-to-top--visible');
        }
    });

    // Back to Top
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Contact Form Simulation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (contactForm.checkValidity()) {
                document.getElementById('contactSuccess').style.display = 'block';
                contactForm.reset();
                setTimeout(() => {
                    document.getElementById('contactSuccess').style.display = 'none';
                }, 5000);
            }
            contactForm.classList.add('was-validated');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Navbar active state on scroll (simplified)
    // Dynamic active class based on scroll position can be added here
});