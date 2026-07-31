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

    // 6. Context Security Handlers
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('selectstart', (e) => e.preventDefault());
    
    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('a, button, input, select, textarea, #copyBtn, code')) {
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
