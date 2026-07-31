document.addEventListener('DOMContentLoaded', () => {
    // 1. Security & Protection (Prevent Selection, Dragging, Context Menu & DevTools)
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('selectstart', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
        // Block F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        const isControl = e.ctrlKey || e.metaKey;

        if (isControl) {
            const keyLower = e.key.toLowerCase();
            // Block Ctrl+Shift+I / J / C (DevTools & Inspect Element)
            if (e.shiftKey && (keyLower === 'i' || keyLower === 'j' || keyLower === 'c')) {
                e.preventDefault();
                return false;
            }
            // Block Ctrl+U (View Source)
            if (keyLower === 'u') {
                e.preventDefault();
                return false;
            }
            // Block Ctrl+S (Save Page)
            if (keyLower === 's') {
                e.preventDefault();
                return false;
            }
        }
    });

    // 2. Theme Toggle Logic
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

    // 3. Mobile Warning Check
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

    // 4. Copy Button Animation & Clipboard Logic
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

    // 5. Smooth FAQ Accordion Animation
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

    // 6. Hero Background Dynamic Parallax Motion
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

    // 7. Dynamic Embedded Metadata Extraction & Embedded Track ID Sorting
    const MUSIC_BASE_URL = 'https://getopium.cc/music/';
    
    const FILE_NAMES = [
        "Loyalty Means Everything.mp3",
        "Busy.flac",
        "Shisha.mp3",
        "Cayenne.flac",
        "Sosa.mp3",
        "Chill & Adrenalina.mp3",
        "Dior.mp3",
        "Kartell.flac",
        "C'est la Rue.mp3",
        "Patron.mp3",
        "Plata.mp3",
        "Pharmacia Provino.mp3",
        "LV.mp3",
        "Outro.flac",
        "Dolce Vita.flac",
        "Mon bébé.mp3",
        "Monnalisa.flac",
        "Mon chéri.flac",
        "Bandolero.mp3",
        "Africa Twin.mp3"
    ];

    let validPlaylist = [];
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

    // Helper: Parse embedded ID3/FLAC metadata via jsmediatags
    function fetchEmbeddedMetadata(fileName, index) {
        const fileUrl = `${MUSIC_BASE_URL}${encodeURIComponent(fileName)}`;
        return new Promise((resolve) => {
            if (!window.jsmediatags) {
                resolve(getFallbackTrackData(fileName, fileUrl, index));
                return;
            }

            window.jsmediatags.read(fileUrl, {
                onSuccess: (tag) => {
                    const tags = tag.tags;
                    
                    let rawTrack = tags.track ? String(tags.track.data || tags.track) : null;
                    let embeddedTrackId = rawTrack ? parseInt(rawTrack.split('/')[0], 10) : (index + 1);

                    let coverUrl = 'artwork/opium.png';
                    if (tags.picture) {
                        const { data, format } = tags.picture;
                        let base64String = "";
                        for (let i = 0; i < data.length; i++) {
                            base64String += String.fromCharCode(data[i]);
                        }
                        coverUrl = `data:${format};base64,${window.btoa(base64String)}`;
                    }

                    const cleanTitle = tags.title || fileName.replace(/\.[^/.]+$/, "");
                    const artist = tags.artist || "Opium";

                    resolve({
                        id: embeddedTrackId,
                        title: cleanTitle,
                        artist: artist,
                        src: fileUrl,
                        cover: coverUrl
                    });
                },
                onError: () => {
                    resolve(getFallbackTrackData(fileName, fileUrl, index));
                }
            });
        });
    }

    function getFallbackTrackData(fileName, fileUrl, index) {
        return {
            id: index + 1,
            title: decodeURIComponent(fileName.replace(/\.[^/.]+$/, "")),
            artist: "Opium",
            src: fileUrl,
            cover: "artwork/opium.png"
        };
    }

    async function initMusicPlayer() {
        if (!audioElement) return;

        const metadataPromises = FILE_NAMES.map((file, idx) => fetchEmbeddedMetadata(file, idx));
        const tracks = await Promise.all(metadataPromises);

        validPlaylist = tracks.sort((a, b) => a.id - b.id);

        if (!validPlaylist.length) return;

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
        
        if (playerCover) {
            playerCover.src = track.cover;
            playerCover.onerror = () => {
                playerCover.src = 'artwork/opium.png';
            };
        }

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
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
        if (prevBtn) prevBtn.addEventListener('click', prevTrack);
        if (nextBtn) nextBtn.addEventListener('click', nextTrack);

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

        if (progressSlider) {
            progressSlider.addEventListener('input', () => {
                if (!isNaN(audioElement.duration)) {
                    const targetTime = (progressSlider.value / 100) * audioElement.duration;
                    audioElement.currentTime = targetTime;
                }
            });
        }
    }

    initMusicPlayer();
});
