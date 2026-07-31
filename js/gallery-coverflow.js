document.addEventListener('DOMContentLoaded', function () {
    var track = document.querySelector('.gallery-coverflow');
    if (!track) return;

    // Kumpulan foto — foto asli dari folder /images situs ini
    // (tambah/kurangi objek di sini untuk mengubah variasi foto)
    var galleryItems = [
        { src: 'images/Rafting-Finish_202607302358.webp', alt: 'Peserta rafting arung jeram melewati jeram sungai Malang', caption: 'Arung Jeram' },
        { src: 'images/Paket-Camping-Ground&Api-Unggun-Batu_202607310046.webp', alt: 'Tenda camping ground pada malam hari dengan api unggun', caption: 'Malam Berkemah' },
        { src: 'images/Outdoor-Challenge_202607302355.webp', alt: 'Peserta melakukan aktivitas high rope outbound', caption: 'High Rope Challenge' },
        { src: 'images/Hutan-Pinus_202607302359.webp', alt: 'Rombongan trekking menyusuri jalur hutan pinus Malang', caption: 'Jalur Hutan Pinus' },
        { src: 'images/Corporate-Team-Building_202607310001.webp', alt: 'Peserta corporate team building outbound di Batu Malang', caption: 'Team Building' },
        { src: 'images/Paket-Outbound-Edukasi&Karakter-Siswa-Sekolah_202607310048.webp', alt: 'Siswa mengikuti outbound edukasi dan pembentukan karakter', caption: 'Edukasi Siswa' },
        { src: 'images/Outbound-games-kelompok_202607310017.webp', alt: 'Tim peserta bermain permainan kelompok outbound', caption: 'Kekompakan Tim' },
        { src: 'images/Victory-Celebration_202607310000.webp', alt: 'Peserta merayakan keberhasilan menyelesaikan tantangan outbound', caption: 'Perayaan Kemenangan' }
    ];

    var cards = Array.prototype.slice.call(track.querySelectorAll('.gallery-card'));
    // urutan slot dari kiri ke kanan: side, medium, active, medium, side
    var slotOffsets = [-2, -1, 0, 1, 2];
    // jeda cascade per kartu (ms) — dari luar ke dalam, biar tidak berganti serentak/kaku
    var CARD_STAGGER = [0, 45, 90, 45, 0];
    var pointer = 0;
    var isAnimating = false;

    var FADE_MS = 380;      // harus sama dengan durasi transition di css (.gallery-card img)
    var STAGGER_MAX = 90;   // = nilai terbesar di CARD_STAGGER
    var AUTOPLAY_MS = 3200; // jeda antar pergantian otomatis

    function renderSlots() {
        if (isAnimating) return;
        isAnimating = true;

        // tahap 1: setiap kartu mulai memudar dengan jeda kecil masing-masing (efek cascade)
        cards.forEach(function (card, i) {
            setTimeout(function () {
                card.classList.add('is-fading');
            }, CARD_STAGGER[i]);
        });

        cards.forEach(function (card, i) {
            setTimeout(function () {
                // tahap 2: ganti sumber foto & caption saat kartu ini sedang "tak terlihat"
                var idx = (pointer + slotOffsets[i]) % galleryItems.length;
                if (idx < 0) idx += galleryItems.length;
                var item = galleryItems[idx];
                var img = card.querySelector('img');
                var caption = card.querySelector('.gallery-overlay h3');

                img.src = item.src;
                img.alt = item.alt;
                if (caption) caption.textContent = item.caption;

                // paksa reflow supaya browser mendaftarkan src baru sebelum transisi "membesar" jalan
                void card.offsetWidth;

                // tahap 3: kartu ini membesar + memunculkan diri kembali
                card.classList.remove('is-fading');
            }, CARD_STAGGER[i] + FADE_MS);
        });

        setTimeout(function () { isAnimating = false; }, STAGGER_MAX + FADE_MS * 2);
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