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
    // Check localStorage first (with error handling)
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme === LIGHT_THEME || savedTheme === DARK_THEME) {
        return savedTheme;
      }
    } catch (e) {
      // localStorage blocked or unavailable, fall through to system preference
      console.warn('localStorage unavailable, using system preference');
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK_THEME;
    }

    return LIGHT_THEME;
  }

  // Save theme to localStorage (only when explicitly set by user)
  function saveThemePreference(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage blocked or unavailable, silently fail
      console.warn('localStorage unavailable, theme preference not persisted');
    }
  }

  // Apply theme to document (without saving to localStorage)
  function applyTheme(theme, shouldPersist) {
    document.documentElement.setAttribute(DATA_THEME_ATTR, theme);

    if (shouldPersist) {
      saveThemePreference(theme);
    }

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
    if (window.mermaid && typeof window.mermaid.initialize === 'function') {
      // Update Mermaid configuration to match current theme
      // Do not use startOnLoad here to avoid unexpected reprocessing on each toggle
      window.mermaid.initialize({
        theme: theme === DARK_THEME ? 'dark' : 'default',
        themeVariables: theme === DARK_THEME ? {
          darkMode: true
        } : {}
      });

      // Re-render existing Mermaid diagrams using the modern API
      // Prefer the modern `run` API if available, fall back to `init` otherwise
      if (typeof window.mermaid.run === 'function') {
        // Modern API: re-render all .mermaid elements
        window.mermaid.run({ querySelector: '.mermaid' });
      } else if (typeof window.mermaid.init === 'function') {
        // Legacy API: re-initialize Mermaid diagrams
        window.mermaid.init(undefined, '.mermaid');
      }
    }
  }

  // Toggle between light and dark themes (manual user action)
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute(DATA_THEME_ATTR);
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    // Persist when user manually toggles
    applyTheme(newTheme, true);
  }

  // Initialize theme on page load (before DOM ready to avoid flash)
  const initialTheme = getInitialTheme();
  // Don't persist on initial load - only on explicit user action
  applyTheme(initialTheme, false);

  // Set up toggle button after DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes (with Safari compatibility)
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = function(e) {
        // Only auto-switch if user hasn't explicitly set a preference
        try {
          const savedTheme = localStorage.getItem(STORAGE_KEY);
          if (!savedTheme) {
            applyTheme(e.matches ? DARK_THEME : LIGHT_THEME, false);
          }
        } catch (err) {
          // localStorage unavailable, apply theme without checking preference
          applyTheme(e.matches ? DARK_THEME : LIGHT_THEME, false);
        }
      };

      // Use addEventListener if available, otherwise fall back to addListener for Safari 13/14
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleSystemThemeChange);
      }
    }
  });

  // Expose toggleTheme globally for programmatic use
  window.toggleTheme = toggleTheme;
})();
