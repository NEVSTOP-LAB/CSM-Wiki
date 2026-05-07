// translate.js integration for CSM-Wiki
// Provides multilingual translation via translate.js (https://translate.zvo.cn)
// Supports automatic page-language detection and persists the user's choice.
//
// This script is loaded with `defer`, so it executes after the DOM is fully
// parsed and after translate.min.js (which precedes it in head_custom.html) has run.

(function () {
  'use strict';

  // Guard: translate.js might be unavailable (e.g. file missing from build
  // or vendored version incompatible with this init script).
  if (typeof translate === 'undefined') return;

  // Set page source language (the wiki is written in Chinese Simplified).
  translate.language.setLocal('chinese_simplified');

  // Use the free edge translation service (no API key required).
  translate.service.use('client.edge');

  // Listen for dynamic DOM changes (e.g. client-side nav updates).
  translate.listener.start();

  // Disable the built-in language-selector UI; we provide our own.
  translate.selectLanguageTag.show = false;

  // Execute translation (applies any previously saved language preference).
  translate.execute();

  // --- Connect custom language <select> -------------------------------------
  var langSelect = document.getElementById('language-select');
  if (!langSelect) return;

  // Derive the set of valid language codes from the <select> options defined
  // in _includes/components/site_nav.html — single source of truth, no duplication.
  var validLangs = [];
  var options = langSelect.querySelectorAll('option');
  for (var i = 0; i < options.length; i++) {
    validLangs.push(options[i].value);
  }

  // Sync the selector to whatever language translate.js already restored.
  var currentLang = translate.language.getCurrent();
  if (currentLang && validLangs.indexOf(currentLang) !== -1) {
    langSelect.value = currentLang;
  }

  langSelect.addEventListener('change', function () {
    var lang = this.value;
    // Guard against unexpected values (e.g. if options drift or DOM is modified).
    if (validLangs.indexOf(lang) === -1) return;
    if (typeof translate.changeLanguage === 'function') {
      translate.changeLanguage(lang);
      return;
    }
    if (typeof translate.change === 'function') {
      translate.change(lang);
    }
  });
})();
