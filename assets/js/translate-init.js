// translate.js integration for CSM-Wiki
// Provides multilingual translation via translate.js (https://translate.zvo.cn)
// Supports automatic page-language detection and persists the user's choice.
//
// This script is loaded with `defer`, so it executes after the DOM is fully
// parsed and after translate.min.js (which precedes it in head_custom.html) has run.

(function () {
  'use strict';

  // ── Guard: translate.js unavailable ──────────────────────────────────
  if (typeof translate === 'undefined') {
    console.warn(
      '[CSM-Wiki] translate.js (translate.min.js) did not load or was blocked. ' +
      'The language switcher will not function. ' +
      'Check the Network tab for a 404 on translate.min.js, ' +
      'or the Console for CSP errors.'
    );
    return;
  }

  console.debug('[CSM-Wiki] translate.js version:', translate.version);

  // ── Source language ───────────────────────────────────────────────────
  // The wiki is authored in Simplified Chinese.
  translate.language.setLocal('chinese_simplified');

  // ── Translation service ───────────────────────────────────────────────
  // 'client.edge' uses Microsoft Edge's free translation API (no key required).
  // If it fails, translate.js falls back to the default zvo.cn service.
  translate.service.use('client.edge');

  // ── DOM listener (dynamic content) ────────────────────────────────────
  translate.listener.start();

  // ── Disable built-in language-selector UI ─────────────────────────────
  translate.selectLanguageTag.show = false;

  // ── Execute initial translation ───────────────────────────────────────
  // On first visit with no stored preference, this is a no-op (returns
  // early because translate.to is null and autoDiscriminateLocalLanguage is
  // false).  If the user already chose a language, it restores it.
  translate.execute();

  // ── Connect custom language <select> ──────────────────────────────────
  var langSelect = document.getElementById('language-select');
  if (!langSelect) {
    console.warn(
      '[CSM-Wiki] #language-select element not found in the DOM. ' +
      'Ensure _includes/components/site_nav.html is overriding the theme ' +
      'correctly and that the site has been rebuilt after changes.'
    );
    return;
  }

  // Derive the set of valid language codes from the <select> options
  // defined in _includes/components/site_nav.html — single source of truth.
  var validLangs = [];
  var options = langSelect.querySelectorAll('option');
  for (var i = 0; i < options.length; i++) {
    validLangs.push(options[i].value);
  }
  console.debug('[CSM-Wiki] Valid language codes:', validLangs);

  // Sync the selector to whatever language translate.js restored.
  var currentLang = translate.language.getCurrent();
  if (currentLang && validLangs.indexOf(currentLang) !== -1) {
    langSelect.value = currentLang;
  }

  // ── Language-change handler ───────────────────────────────────────────
  langSelect.addEventListener('change', function () {
    var lang = this.value;

    // Guard against unexpected values.
    if (validLangs.indexOf(lang) === -1) {
      console.warn('[CSM-Wiki] Unknown language code:', lang);
      return;
    }

    console.debug('[CSM-Wiki] Switching language to:', lang);

    if (typeof translate.changeLanguage === 'function') {
      try {
        translate.changeLanguage(lang);
      } catch (err) {
        console.error(
          '[CSM-Wiki] translate.changeLanguage("' + lang + '") threw:',
          err
        );
      }
      return;
    }

    // Fallback: older translate.js API
    if (typeof translate.change === 'function') {
      try {
        translate.change(lang);
      } catch (err) {
        console.error(
          '[CSM-Wiki] translate.change("' + lang + '") threw:',
          err
        );
      }
    }
  });

  console.debug('[CSM-Wiki] Language switcher is active.');

})();
