document.addEventListener('DOMContentLoaded', () => {
    // FIX 1: Stricter mobile check so resizing desktop browser window never triggers overlay
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

    if (copyBtn && loadstringText) {
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const textToCopy = loadstringText.textContent.trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (copyText) {
                    copyText.textContent = 'Copied!';
                }
                
                // FIX 3: Toggle CSS class to allow CSS transition back to normal smoothly
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (copyText) {
                        copyText.textContent = 'Copy';
                    }
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

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
