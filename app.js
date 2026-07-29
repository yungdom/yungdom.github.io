document.addEventListener('DOMContentLoaded', () => {
    const isMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return mobileRegex.test(userAgent) || (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
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
                copyBtn.classList.add('copied');
                copyBtn.style.background = 'rgb(16, 124, 65)';
                copyBtn.style.boxShadow = '0 0 16px rgba(16, 124, 65, 0.6)';
                
                setTimeout(() => {
                    if (copyText) {
                        copyText.textContent = 'Copy';
                    }
                    copyBtn.classList.remove('copied');
                    copyBtn.style.background = '';
                    copyBtn.style.boxShadow = '';
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
