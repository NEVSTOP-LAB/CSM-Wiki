// Theme switcher for CSM-Wiki
// Supports user preference and system detection for light/dark mode

(function() {
  'use strict';

  const STORAGE_KEY = 'csm-wiki-theme';
  const DATA_THEME_ATTR = 'data-theme';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';
  const SYSTEM_PREFERENCE = 'system';

  function getSavedPreference() {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme === LIGHT_THEME || savedTheme === DARK_THEME) {
        return savedTheme;
      }
    } catch (e) {
      // localStorage blocked or unavailable
    }
    return null;
  }

  function persistPreference(preference) {
    try {
      if (preference === LIGHT_THEME || preference === DARK_THEME) {
        localStorage.setItem(STORAGE_KEY, preference);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // localStorage blocked or unavailable, silently fail
    }
  }

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK_THEME;
    }
    return LIGHT_THEME;
  }

  function resolveTheme(preference) {
    if (preference === LIGHT_THEME || preference === DARK_THEME) {
      return preference;
    }
    return getSystemTheme();
  }

  function updateThemeSelector(preference) {
    const select = document.getElementById('theme-select');
    if (!select) return;

    const normalized = (preference === LIGHT_THEME || preference === DARK_THEME)
      ? preference
      : SYSTEM_PREFERENCE;

    if (select.value !== normalized) {
      select.value = normalized;
    }
  }

  // Apply theme to document (without saving to localStorage)
  function applyTheme(theme, shouldPersist, preferenceForUI) {
    document.documentElement.setAttribute(DATA_THEME_ATTR, theme);

    if (shouldPersist) {
      persistPreference(preferenceForUI);
    }

    updateThemeSelector(preferenceForUI);

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

      // Re-render existing Mermaid diagrams using the modern API.
      // Mermaid wraps `code.language-mermaid` blocks, so we re-target that
      // selector (the original render in components/mermaid.html also uses
      // `.language-mermaid`, not `.mermaid`).
      if (typeof window.mermaid.run === 'function') {
        // Modern API: re-render all .language-mermaid elements
        window.mermaid.run({ querySelector: '.language-mermaid' });
      } else if (typeof window.mermaid.init === 'function') {
        // Legacy API: re-initialize Mermaid diagrams
        window.mermaid.init(undefined, '.language-mermaid');
      }
    }
  }

  // Initialize theme on page load (before DOM ready to avoid flash)
  const savedPreference = getSavedPreference();
  const initialPreference = savedPreference || SYSTEM_PREFERENCE;
  const initialTheme = resolveTheme(initialPreference);
  // Don't persist on initial load - only on explicit user action
  applyTheme(initialTheme, false, initialPreference);

  // Set up toggle button after DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      updateThemeSelector(initialPreference);
      themeSelect.addEventListener('change', function(event) {
        const preference = event.target.value;
        const themeToApply = resolveTheme(preference);
        applyTheme(themeToApply, true, preference);
      });
    }

    // Listen for system theme changes (with Safari compatibility)
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = function(e) {
        // Only auto-switch if user hasn't explicitly set a preference
        const preference = getSavedPreference();
        if (!preference || preference === SYSTEM_PREFERENCE) {
          applyTheme(e.matches ? DARK_THEME : LIGHT_THEME, false, SYSTEM_PREFERENCE);
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
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute(DATA_THEME_ATTR);
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    // Persist when user manually toggles
    applyTheme(newTheme, true, newTheme);
  }

  window.toggleTheme = toggleTheme;
})();
