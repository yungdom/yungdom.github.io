document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersLight) {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 2. Mobile Detection Logic
    const isMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isTouchScreen = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && matchMedia('(pointer: coarse)').matches;
        return mobileRegex.test(userAgent) || isTouchScreen;
    };

    if (isMobile()) {
        const desktopContent = document.querySelector('.desktop-content');
        const mobileOverlay = document.querySelector('.mobile-warning-overlay');

        if (desktopContent) desktopContent.style.display = 'none';
        if (mobileOverlay) mobileOverlay.style.display = 'flex';
    }

    // 3. Copy Button Animation & Clipboard Logic
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const loadstringText = document.getElementById('loadstringText');

    if (copyBtn && loadstringText && copyText) {
        let copyTimeout;
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(copyTimeout);
            
            const textToCopy = loadstringText.textContent.trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyText.textContent = 'Copied!';
                copyBtn.classList.add('copied');

                copyTimeout = setTimeout(() => {
                    copyText.textContent = 'Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // 4. Smooth FAQ Accordion Animation
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // 5. Parallax Motion
    const heroBg = document.getElementById('heroBg');
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX - window.innerWidth / 2;
        mouseY = e.clientY - window.innerHeight / 2;
    });

    function renderDynamicMotion() {
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        if (heroBg) {
            heroBg.style.transform = `translate(calc(-50% + ${targetX * 0.03}px), calc(-50% + ${targetY * 0.03}px))`;
        }
        requestAnimationFrame(renderDynamicMotion);
    }
    renderDynamicMotion();

    // 6. Track ID Sorted Music Player
    const MUSIC_BASE_URL = 'https://getopium.cc/music/';
    
    // Assigned Track IDs for exact queue sorting
    const TRACK_LIST = [
        { id: 1,  file: "Busy.flac", title: "Busy" },
        { id: 2,  file: "Shisha (Bass Boosted).mp3", title: "Shisha (Bass Boosted)" },
        { id: 3,  file: "Cayenne.flac", title: "Cayenne" },
        { id: 4,  file: "Sosa.mp3", title: "Sosa" },
        { id: 5,  file: "Chill & Adrenalina.mp3", title: "Chill & Adrenalina" },
        { id: 6,  file: "Dior.mp3", title: "Dior" },
        { id: 7,  file: "Kartell.flac", title: "Kartell" },
        { id: 8,  file: "C'est la Rue.mp3", title: "C'est la Rue" },
        { id: 9,  file: "Patron.mp3", title: "Patron" },
        { id: 10, file: "Plata.mp3", title: "Plata" },
        { id: 11, file: "Pharmacia Provino.mp3", title: "Pharmacia Provino" },
        { id: 12, file: "LV.mp3", title: "LV" },
        { id: 13, file: "Outro.flac", title: "Outro" },
        { id: 14, file: "Dolce Vita.flac", title: "Dolce Vita" },
        { id: 15, file: "Loyalty Means Everything.mp3", title: "Loyalty Means Everything" },
        { id: 16, file: "Mon bébé.mp3", title: "Mon bébé" },
        { id: 17, file: "Monnalisa.flac", title: "Monnalisa" },
        { id: 18, file: "Mon chéri.flac", title: "Mon chéri" },
        { id: 19, file: "Bandolero.mp3", title: "Bandolero" },
        { id: 20, file: "Africa Twin.mp3", title: "Africa Twin" }
    ];

    // Sort Queue strictly by Track ID (Ascending: 1, 2, 3...)
    const validPlaylist = TRACK_LIST
        .sort((a, b) => a.id - b.id)
        .map(track => ({
            id: track.id,
            title: `#${track.id} - ${track.title}`,
            artist: "Opium",
            src: `${MUSIC_BASE_URL}${encodeURIComponent(track.file)}`,
            cover: "artwork/opium.png"
        }));

    let currentTrackIndex = 0;
    let isPlaying = false;

    const audioElement = document.getElementById('audioEngine');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playerCover = document.getElementById('playerCover');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const progressSlider = document.getElementById('progressSlider');
    const volumeSlider = document.getElementById('volumeSlider');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');

    const playIcon = playPauseBtn ? playPauseBtn.querySelector('.play-icon') : null;
    const pauseIcon = playPauseBtn ? playPauseBtn.querySelector('.pause-icon') : null;

    function initMusicPlayer() {
        if (!validPlaylist.length || !audioElement) return;

        if (volumeSlider) {
            audioElement.volume = parseFloat(volumeSlider.value);
        }
        loadTrack(currentTrackIndex);
        setupPlayerEventListeners();
    }

    function loadTrack(index) {
        if (!validPlaylist[index] || !audioElement) return;

        const track = validPlaylist[index];
        audioElement.src = track.src;
        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist;
        playerCover.src = track.cover;
        progressSlider.value = 0;
        currentTimeEl.textContent = "0:00";
        durationTimeEl.textContent = "0:00";
    }

    function togglePlayPause() {
        if (!audioElement.src) return;

        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play().catch(err => console.log('Playback starting:', err));
        }
    }

    function updatePlayPauseUI(playing) {
        isPlaying = playing;
        if (playing) {
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
            if (playerCover) playerCover.classList.add('playing');
        } else {
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
            if (playerCover) playerCover.classList.remove('playing');
        }
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + validPlaylist.length) % validPlaylist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audioElement.play();
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % validPlaylist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audioElement.play();
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function setupPlayerEventListeners() {
        playPauseBtn.addEventListener('click', togglePlayPause);
        prevBtn.addEventListener('click', prevTrack);
        nextBtn.addEventListener('click', nextTrack);

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                audioElement.volume = parseFloat(e.target.value);
            });
        }

        audioElement.addEventListener('play', () => updatePlayPauseUI(true));
        audioElement.addEventListener('pause', () => updatePlayPauseUI(false));
        audioElement.addEventListener('ended', nextTrack);

        audioElement.addEventListener('timeupdate', () => {
            if (!isNaN(audioElement.duration)) {
                const progress = (audioElement.currentTime / audioElement.duration) * 100;
                progressSlider.value = progress;
                currentTimeEl.textContent = formatTime(audioElement.currentTime);
                durationTimeEl.textContent = formatTime(audioElement.duration);
            }
        });

        progressSlider.addEventListener('input', () => {
            if (!isNaN(audioElement.duration)) {
                const targetTime = (progressSlider.value / 100) * audioElement.duration;
                audioElement.currentTime = targetTime;
            }
        });
    }

    initMusicPlayer();
});
