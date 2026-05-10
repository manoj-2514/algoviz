const themeKey = 'av_theme';

function initToggleIcon() {
    const theme = document.documentElement.getAttribute('data-theme');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(themeKey, newTheme);
    
    initToggleIcon();
};

document.addEventListener('DOMContentLoaded', initToggleIcon);
