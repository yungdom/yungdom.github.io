document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Loadstring Copy Feature ---
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const loadstringText = document.getElementById('loadstringText');

    if (copyBtn && loadstringText) {
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid event triggering page-level handlers
            
            const textToCopy = loadstringText.textContent.trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Change UI state temporarily to indicate success
                if (copyText) {
                    copyText.textContent = 'Copied!';
                }
                copyBtn.classList.add('copied');
                copyBtn.style.background = 'rgb(16, 124, 65)'; // Success green
                copyBtn.style.boxShadow = '0 0 12px rgba(16, 124, 65, 0.4)';
                
                setTimeout(() => {
                    if (copyText) {
                        copyText.textContent = 'Copy';
                    }
                    copyBtn.classList.remove('copied');
                    copyBtn.style.background = ''; // Resets to style.css values
                    copyBtn.style.boxShadow = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // --- 2. Site Protection (Anti-Inspect & Copy protection) ---
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Block click-drag text/image selection
    document.addEventListener('selectstart', (e) => e.preventDefault());
    
    document.addEventListener('mousedown', (e) => {
        // Allow clicks on links, buttons, copy elements, and code wrappers
        if (e.target.closest('a, button, input, select, textarea, #copyBtn, code')) {
            return;
        }
        if (e.detail > 0) {
            e.preventDefault();
        }
    });

    // Block common devtools keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12') { 
            e.preventDefault(); 
            return; 
        }

        // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools panels)
        if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
            e.preventDefault(); 
            return;
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key.toUpperCase() === 'U') {
            e.preventDefault(); 
            return;
        }

        // Ctrl+S (Save page)
        if (e.ctrlKey && e.key.toUpperCase() === 'S') {
            e.preventDefault(); 
            return;
        }
    });

    // Disable dragging on all elements
    document.addEventListener('dragstart', (e) => e.preventDefault());
});
