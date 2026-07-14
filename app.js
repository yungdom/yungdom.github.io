// Disable right-click context menu
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Block click-drag text/image selection
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('mousedown', (e) => { if (e.detail > 0) e.preventDefault(); });

// Block common devtools keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') { e.preventDefault(); return; }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools panels)
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault(); return;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key.toUpperCase() === 'U') {
        e.preventDefault(); return;
    }

    // Ctrl+S (Save page)
    if (e.ctrlKey && e.key.toUpperCase() === 'S') {
        e.preventDefault(); return;
    }
});

// Disable dragging on all elements
document.addEventListener('dragstart', (e) => e.preventDefault());
