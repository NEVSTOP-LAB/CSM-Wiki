/**
 * qa-shortcut.js
 *
 * Enhances the Q&A shortcut bar in the sidebar:
 *  - Reads a GitHub username from localStorage ('csm-wiki-gh-user').
 *  - If set, replaces the robot emoji with the user's GitHub avatar.
 *  - The "···" button lets users set / clear their GitHub username.
 *
 * No OAuth, no backend, no API tokens required.
 * Avatar URL is public: https://avatars.githubusercontent.com/<username>?size=56
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'csm-wiki-gh-user';

  function renderAvatar(username) {
    var el = document.getElementById('qa-avatar');
    if (!el) return;
    if (username) {
      var img = document.createElement('img');
      img.src = 'https://avatars.githubusercontent.com/' + encodeURIComponent(username) + '?size=56';
      img.alt = username;
      img.addEventListener('error', function () {
        el.textContent = '🤖';
      });
      el.textContent = '';
      el.appendChild(img);
    } else {
      el.textContent = '🤖';
    }
  }

  // GitHub usernames: 1-39 chars, alphanumeric + single hyphens, no leading/trailing hyphens.
  var GH_USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

  document.addEventListener('DOMContentLoaded', function () {
    try {
      // Restore saved username on page load
      var saved = localStorage.getItem(STORAGE_KEY) || '';
      renderAvatar(saved);

      // "···" button — prompt for username
      var btn = document.getElementById('qa-set-user');
      if (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var current = localStorage.getItem(STORAGE_KEY) || '';
          /* eslint-disable no-alert */
          var input = window.prompt(
            '输入你的 GitHub 用户名以显示头像（留空则恢复机器人图标）:\n' +
            'Enter your GitHub username to show your avatar (leave blank to reset):',
            current
          );
          /* eslint-enable no-alert */
          if (input === null) return; // user cancelled
          input = input.trim();
          if (input && !GH_USERNAME_RE.test(input)) {
            /* eslint-disable no-alert */
            window.alert('用户名格式无效 · Invalid GitHub username: ' + input);
            /* eslint-enable no-alert */
            return;
          }
          if (input) {
            localStorage.setItem(STORAGE_KEY, input);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
          renderAvatar(input);
        });
      }
    } catch (e) {
      // localStorage blocked (private browsing, etc.) — gracefully do nothing
    }
  });
})();
