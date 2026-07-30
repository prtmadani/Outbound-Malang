document.addEventListener('DOMContentLoaded', function () {
    var track = document.querySelector('.gallery-coverflow');
    if (!track) return;

    // Kumpulan foto — tambah/kurangi objek di sini untuk mengubah variasi foto
    var galleryItems = [
        { src: 'https://images.unsplash.com/photo-1530866495561-507c9faab737?auto=format&fit=crop&w=600&q=80', alt: 'Arung jeram rafting Malang', caption: 'Arung Jeram' },
        { src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80', alt: 'Malam berkemah camping', caption: 'Malam Berkemah' },
        { src: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=700&q=80', alt: 'High rope outbound', caption: 'High Rope Challenge' },
        { src: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=600&q=80', alt: 'Trekking hutan pinus', caption: 'Jalur Hutan Pinus' },
        { src: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80', alt: 'Corporate team building', caption: 'Team Building' },
        { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80', alt: 'Outbound edukasi siswa', caption: 'Edukasi Siswa' },
        { src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80', alt: 'Kekompakan tim outbound', caption: 'Kekompakan Tim' }
    ];

    var cards = Array.prototype.slice.call(track.querySelectorAll('.gallery-card'));
    // urutan slot dari kiri ke kanan: side, medium, active, medium, side
    var slotOffsets = [-2, -1, 0, 1, 2];
    var pointer = 0;
    var isAnimating = false;

    var FADE_MS = 380;      // harus sama dengan durasi transition di css (.gallery-card img)
    var AUTOPLAY_MS = 3200; // jeda antar pergantian otomatis

    function renderSlots() {
        if (isAnimating) return;
        isAnimating = true;

        // tahap 1: semua foto mengecil + memudar bersamaan
        cards.forEach(function (card) {
            card.classList.add('is-fading');
        });

        setTimeout(function () {
            // tahap 2: ganti sumber foto & caption saat foto sedang "tak terlihat" (scale kecil)
            cards.forEach(function (card, i) {
                var idx = (pointer + slotOffsets[i]) % galleryItems.length;
                if (idx < 0) idx += galleryItems.length;
                var item = galleryItems[idx];
                var img = card.querySelector('img');
                var caption = card.querySelector('.gallery-overlay h3');

                img.src = item.src;
                img.alt = item.alt;
                if (caption) caption.textContent = item.caption;
            });

            // paksa reflow supaya browser mendaftarkan src baru sebelum transisi "membesar" jalan
            void track.offsetWidth;

            // tahap 3: foto membesar + memunculkan diri kembali
            cards.forEach(function (card) {
                card.classList.remove('is-fading');
            });

            setTimeout(function () { isAnimating = false; }, FADE_MS);
        }, FADE_MS);
    }

    function goNext() {
        pointer = (pointer + 1) % galleryItems.length;
        renderSlots();
    }

    function goPrev() {
        pointer = (pointer - 1 + galleryItems.length) % galleryItems.length;
        renderSlots();
    }

    renderSlots();

    var timer = setInterval(goNext, AUTOPLAY_MS);
    function restartAutoplay() {
        clearInterval(timer);
        timer = setInterval(goNext, AUTOPLAY_MS);
    }

    track.addEventListener('mouseenter', function () { clearInterval(timer); });
    track.addEventListener('mouseleave', function () { restartAutoplay(); });

    var prevBtn = document.querySelector('.gallery-nav__btn--prev');
    var nextBtn = document.querySelector('.gallery-nav__btn--next');

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
});