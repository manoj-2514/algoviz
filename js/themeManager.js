const themeKey = 'av_theme';

function initToggleIcon() {
    const theme = document.documentElement.getAttribute('data-theme');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(themeKey, newTheme);
    
    initToggleIcon();
};

document.addEventListener('DOMContentLoaded', initToggleIcon);
