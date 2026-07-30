document.addEventListener('DOMContentLoaded', () => {
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
                    copyText.textContent = 'Copied!';
                    copyText.style.opacity = '1';
                    copyBtn.classList.add('copied');
                }, 150);

                copyTimeout = setTimeout(() => {
                    copyText.style.opacity = '0';
                    setTimeout(() => {
                        copyText.textContent = 'Copy';
                        copyText.style.opacity = '1';
                        copyBtn.classList.remove('copied');
                    }, 150);
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

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
