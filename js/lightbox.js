document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll(".gallery-lightbox");

    const lightbox = document.querySelector(".lightbox");
    const lightboxImg = document.querySelector(".lightbox__img");
    const caption = document.querySelector(".lightbox__caption");

    const closeBtn = document.querySelector(".lightbox__close");
    const prevBtn = document.querySelector(".lightbox__prev");
    const nextBtn = document.querySelector(".lightbox__next");

    let current = 0;

    function show(index) {

        current = index;

        lightboxImg.src = images[index].src;
        lightboxImg.alt = images[index].alt;

        caption.textContent = images[index].alt;

        lightbox.classList.add("is-open");

        document.body.style.overflow = "hidden";

    }

    function close() {

        lightbox.classList.remove("is-open");

        document.body.style.overflow = "";

    }

    function next() {

        current = (current + 1) % images.length;

        show(current);

    }

    function prev() {

        current = (current - 1 + images.length) % images.length;

        show(current);

    }

    images.forEach((img, index) => {

        img.style.cursor = "zoom-in";

        img.addEventListener("click", () => {

            show(index);

        });

    });

    closeBtn.addEventListener("click", close);

    nextBtn.addEventListener("click", next);

    prevBtn.addEventListener("click", prev);

    lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox) {

            close();

        }

    });

    document.addEventListener("keydown", (e) => {

        if (!lightbox.classList.contains("is-open")) return;

        if (e.key === "Escape") close();

        if (e.key === "ArrowRight") next();

        if (e.key === "ArrowLeft") prev();

    });

});