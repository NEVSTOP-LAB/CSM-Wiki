// translate.js integration for CSM-Wiki
// Provides multilingual translation via translate.js (https://translate.zvo.cn)
// Supports automatic page-language detection and persists the user's choice.
//
// This script is loaded with `defer`, so it executes after the DOM is fully
// parsed and after the translate.js CDN script (which precedes it) has run.

(function () {
  'use strict';

  // Guard: translate.js CDN might be unavailable (e.g. network error).
  if (typeof translate === 'undefined') return;

  // Valid target-language codes — must stay in sync with the <select> options
  // in _includes/components/site_nav.html.
  var VALID_LANGS = [
    'chinese_simplified', 'english', 'japanese', 'korean',
    'french', 'german', 'russian', 'spanish'
  ];

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

  // Sync the <select> to whatever language translate.js already restored.
  // Validate against the static whitelist before setting the value.
  var currentLang = translate.language.getCurrent();
  if (currentLang && VALID_LANGS.indexOf(currentLang) !== -1) {
    langSelect.value = currentLang;
  }

  langSelect.addEventListener('change', function () {
    translate.change(this.value);
  });
})();

