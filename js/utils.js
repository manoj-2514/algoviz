/**
 * AlgoViz Shared Utilities
 * Single source of truth for all shared state, helpers, and UI utilities.
 */

// ─── Singleton AlgoViz State ──────────────────────────────────────────────────
// Defined here ONCE. All pages load this file before any other JS.
window.AlgoViz = {
    isAnimating: false,
    isPaused: false,
    animationSpeed: 5,

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    getAnimationDelay() {
        return (11 - this.animationSpeed) * 100;
    },
    setAnimating(val) {
        this.isAnimating = val;
    },
    setPaused(val) {
        this.isPaused = val;
    }
};

// ─── Toast Notification System ────────────────────────────────────────────────
(function initToastSystem() {
    // Inject toast container into DOM
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
})();

/**
 * Show a toast notification.
 * @param {string} message  Text to display
 * @param {'success'|'error'|'info'|'warning'} type
 * @param {number} duration  ms before auto-dismiss (default 3000)
 */
window.showToast = function(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: '✅',
        error:   '❌',
        info:    'ℹ️',
        warning: '⚠️'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;

    container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => toast.classList.add('toast-show'));

    // Auto dismiss
    const timer = setTimeout(() => dismissToast(toast), duration);
    toast.addEventListener('click', () => { clearTimeout(timer); dismissToast(toast); });
};

function dismissToast(toast) {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

// ─── Dark Mode ────────────────────────────────────────────────────────────────
(function initDarkMode() {
    const saved = localStorage.getItem('algoviz-theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Wait for DOM then wire up toggle button
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('darkModeToggle');
        if (!btn) return;

        const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

        // Set initial icon
        btn.innerHTML = isDark()
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        btn.title = isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode';

        btn.addEventListener('click', () => {
            const nowDark = !isDark();
            document.documentElement.setAttribute('data-theme', nowDark ? 'dark' : 'light');
            localStorage.setItem('algoviz-theme', nowDark ? 'dark' : 'light');
            btn.innerHTML = nowDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            btn.title = nowDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        });
    });
})();

// ─── Modal: ESC Key Close + ARIA ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // ESC to close any visible modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                    // Fire custom event so page-specific JS can clean up
                    modal.dispatchEvent(new CustomEvent('modal:close'));
                }
            });
        }
    });

    // Click-outside-to-close for every modal
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
                modal.dispatchEvent(new CustomEvent('modal:close'));
            }
        });
    });
});

// ─── Dynamic Copyright Year ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.copyright-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
});

// ─── Copy-to-Clipboard for Code Blocks ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Observe #codeContent mutations and attach copy button whenever code changes
    const codeContent = document.getElementById('codeContent');
    if (!codeContent) return;

    function attachCopyBtn() {
        const old = codeContent.querySelector('.copy-btn');
        if (old) old.remove();

        const pre = codeContent.querySelector('pre');
        if (!pre) return;

        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        btn.title = 'Copy code to clipboard';

        btn.addEventListener('click', () => {
            const code = pre.textContent;
            navigator.clipboard.writeText(code).then(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });

        codeContent.style.position = 'relative';
        codeContent.insertBefore(btn, codeContent.firstChild);
    }

    // Export function so other scripts can manually call it when code changes
    window.attachCopyBtn = attachCopyBtn;
    setTimeout(attachCopyBtn, 500); // Initial attach
});

// ─── Keyboard Shortcut Hints (press ?) ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        // Only fire when no modal is open and no input is focused
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

        if (e.key === '?') {
            toggleShortcutPanel();
        }
        if (e.key === 'Escape') {
            const panel = document.getElementById('shortcutPanel');
            if (panel) panel.remove();
        }
    });
});

function toggleShortcutPanel() {
    const existing = document.getElementById('shortcutPanel');
    if (existing) { existing.remove(); return; }

    const panel = document.createElement('div');
    panel.id = 'shortcutPanel';
    panel.innerHTML = `
        <div class="shortcut-header">
            <span>⌨️ Keyboard Shortcuts</span>
            <button onclick="document.getElementById('shortcutPanel').remove()" class="shortcut-close">✕</button>
        </div>
        <div class="shortcut-list">
            <div class="shortcut-item"><kbd>Space</kbd><span>Start / Pause visualization</span></div>
            <div class="shortcut-item"><kbd>R</kbd><span>Reset</span></div>
            <div class="shortcut-item"><kbd>Esc</kbd><span>Close modal / Dismiss</span></div>
            <div class="shortcut-item"><kbd>?</kbd><span>Toggle shortcuts panel</span></div>
        </div>
    `;
    document.body.appendChild(panel);
}

// Global space/R shortcut wiring (pages attach their own handlers)
document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const anyModalOpen = [...document.querySelectorAll('.modal')]
        .some(m => m.style.display === 'block');
    if (!anyModalOpen) return;

    if (e.key === ' ') {
        e.preventDefault();
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) pauseBtn.click();
    }
    if (e.key === 'r' || e.key === 'R') {
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) resetBtn.click();
    }
});
