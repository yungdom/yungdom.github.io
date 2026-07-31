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

    // 3. Interactive Loadstring Copy Logic
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
                copyText.style.opacity = '0';
                setTimeout(() => {
                    copyText.textContent = 'Copied';
                    copyText.style.opacity = '1';
                    copyBtn.classList.add('copied');
                }, 120);

                copyTimeout = setTimeout(() => {
                    copyText.style.opacity = '0';
                    setTimeout(() => {
                        copyText.textContent = 'Copy';
                        copyText.style.opacity = '1';
                        copyBtn.classList.remove('copied');
                    }, 120);
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // 4. Dynamic Accordion Logic
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

    // 5. Subtle Mouse Parallax
    const featureCards = document.querySelectorAll('.feature-card');
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

        featureCards.forEach((card, i) => {
            const factor = (i + 1) * 0.003;
            const tiltX = targetY * factor;
            const tiltY = -targetX * factor;
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        requestAnimationFrame(renderDynamicMotion);
    }

    renderDynamicMotion();

    // 6. Dynamic Music Player Engine (Loads directly from music/ folder)
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
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');

    const playIcon = playPauseBtn ? playPauseBtn.querySelector('.play-icon') : null;
    const pauseIcon = playPauseBtn ? playPauseBtn.querySelector('.pause-icon') : null;

    async function fetchMusicPlaylist() {
        try {
            // Option A: Fetch tracks manifest dynamically from music/playlist.json
            const jsonRes = await fetch('music/playlist.json');
            if (jsonRes.ok) {
                const data = await jsonRes.json();
                return data.map(item => ({
                    title: item.title || item.file.replace(/\.[^/.]+$/, ""),
                    artist: item.artist || "Unknown Artist",
                    src: `music/${item.file}`,
                    cover: item.cover ? `artwork/${item.cover}` : 'artwork/opium.png'
                }));
            }

            // Option B: Fallback - Attempt directory index parsing from web server
            const dirRes = await fetch('music/');
            if (dirRes.ok) {
                const text = await dirRes.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const links = Array.from(doc.querySelectorAll('a'));
                
                const audioFiles = links
                    .map(a => a.getAttribute('href'))
                    .filter(href => href && (href.toLowerCase().endsWith('.mp3') || href.toLowerCase().endsWith('.flac')));

                return audioFiles.map(file => {
                    const fileName = decodeURIComponent(file.split('/').pop());
                    const cleanName = fileName.replace(/\.[^/.]+$/, "");
                    return {
                        title: cleanName,
                        artist: "Opium",
                        src: file.startsWith('music/') ? file : `music/${fileName}`,
                        cover: "artwork/opium.png"
                    };
                });
            }
        } catch (err) {
            console.warn('Dynamic audio directory fetch failed:', err);
        }
        return [];
    }

    async function initMusicPlayer() {
        validPlaylist = await fetchMusicPlaylist();

        if (validPlaylist.length > 0 && audioElement) {
            loadTrack(currentTrackIndex);
            setupPlayerEventListeners();
        } else {
            if (playerTitle) playerTitle.textContent = "No Track Loaded";
            if (playerArtist) playerArtist.textContent = "Add files to music/";
        }
    }

    function loadTrack(index) {
        if (!validPlaylist.length || !audioElement) return;

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
        if (!validPlaylist.length) return;

        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play().catch(err => console.log('Audio playback error:', err));
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
        if (!validPlaylist.length) return;
        currentTrackIndex = (currentTrackIndex - 1 + validPlaylist.length) % validPlaylist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) audioElement.play();
    }

    function nextTrack() {
        if (!validPlaylist.length) return;
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

    // 7. Context Security Handlers
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('selectstart', (e) => e.preventDefault());
    
    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('a, button, input, select, textarea, #copyBtn, code, .sticky-music-player')) {
            return;
        }
        if (e.detail > 0) {
            e.preventDefault();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') { 
            e.preventDefault(); 
            return; 
        }
        if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
            e.preventDefault(); 
            return;
        }
        if (e.ctrlKey && e.key.toUpperCase() === 'U') {
            e.preventDefault(); 
            return;
        }
        if (e.ctrlKey && e.key.toUpperCase() === 'S') {
            e.preventDefault(); 
            return;
        }
    });

    document.addEventListener('dragstart', (e) => e.preventDefault());
});
