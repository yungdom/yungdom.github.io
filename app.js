document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const faqQuestions = document.querySelectorAll('.faq-question');

    // Theme Switcher Logic
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Copy Loader String Logic
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const loadstringElement = document.getElementById('loadstringText');
            if (!loadstringElement) return;

            const textToCopy = loadstringElement.textContent || loadstringElement.innerText;

            try {
                await navigator.clipboard.writeText(textToCopy);
                if (copyText) copyText.textContent = 'Copied!';
                copyBtn.classList.add('copied');

                setTimeout(() => {
                    if (copyText) copyText.textContent = 'Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy loader string: ', err);
            }
        });
    }

    // FAQ Accordion Logic
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isOpen = faqItem.classList.contains('active');

            // Close other open FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) answer.style.maxHeight = null;
                }
            });

            // Toggle selected FAQ item
            if (isOpen) {
                faqItem.classList.remove('active');
                const answer = faqItem.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = null;
            } else {
                faqItem.classList.add('active');
                const answer = faqItem.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Re-highlight syntax cleanly with Prism if loaded
    if (window.Prism) {
        window.Prism.highlightAll();
    }
});
