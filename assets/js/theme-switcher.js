// Theme switcher for CSM-Wiki
// Supports user preference and system detection for light/dark mode

(function() {
  'use strict';

  const STORAGE_KEY = 'csm-wiki-theme';
  const DATA_THEME_ATTR = 'data-theme';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';

  // Get the saved theme or detect from system
  function getInitialTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === LIGHT_THEME || savedTheme === DARK_THEME) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK_THEME;
    }

    return LIGHT_THEME;
  }

  // Apply theme to document
  function applyTheme(theme) {
    document.documentElement.setAttribute(DATA_THEME_ATTR, theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update toggle button if it exists
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === DARK_THEME ? '☀️' : '🌙';
      }
      toggleBtn.setAttribute('aria-label',
        theme === DARK_THEME ? 'Switch to light theme' : 'Switch to dark theme');
    }

    // Update Mermaid theme if mermaid is loaded
    if (window.mermaid && window.mermaid.initialize) {
      window.mermaid.initialize({
        startOnLoad: true,
        theme: theme === DARK_THEME ? 'dark' : 'default',
        themeVariables: theme === DARK_THEME ? {
          darkMode: true
        } : {}
      });

      // Re-render existing mermaid diagrams
      const mermaidDiagrams = document.querySelectorAll('.language-mermaid');
      mermaidDiagrams.forEach((diagram, index) => {
        const code = diagram.textContent;
        const id = 'mermaid-' + index;
        const container = document.createElement('div');
        container.className = 'mermaid';
        container.id = id;
        container.textContent = code;
        diagram.parentNode.replaceChild(container, diagram);
      });

      if (typeof window.mermaid.init === 'function') {
        window.mermaid.init(undefined, '.mermaid');
      }
    }
  }

  // Toggle between light and dark themes
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute(DATA_THEME_ATTR);
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
  }

  // Initialize theme on page load (before DOM ready to avoid flash)
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  // Set up toggle button after DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only auto-switch if user hasn't explicitly set a preference
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (!savedTheme) {
          applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
      });
    }
  });

  // Expose toggleTheme globally for programmatic use
  window.toggleTheme = toggleTheme;
})();
