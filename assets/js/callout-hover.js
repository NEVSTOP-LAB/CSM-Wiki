/**
 * Callout Hover - 将标记了 .callout-hover 的 callout 转换为悬浮提示
 *
 * 用法：在 markdown 中给 callout 添加 .callout-hover 类：
 *
 * {: .note .callout-hover }
 * > <b>标题文本</b>
 * >
 * > 详细内容...
 *
 * 渲染效果：显示为一个带 emoji 的紧凑链接，鼠标悬浮时展开完整内容。
 */
(function () {
  'use strict';

  // Timing constants (milliseconds)
  var SHOW_DELAY = 100;
  var HIDE_DELAY = 200;

  var CALLOUT_TYPES = {
    note:      { emoji: '📝', label: '注意' },
    tip:       { emoji: '💡', label: '提示' },
    warning:   { emoji: '⚠️', label: '警告' },
    important: { emoji: '❗', label: '重要' },
    caution:   { emoji: '🔴', label: '小心' }
  };

  var TYPE_NAMES = Object.keys(CALLOUT_TYPES);

  function getCalloutType(element) {
    for (var i = 0; i < TYPE_NAMES.length; i++) {
      if (element.classList.contains(TYPE_NAMES[i])) {
        return TYPE_NAMES[i];
      }
    }
    return 'note';
  }

  function extractTitle(element) {
    var firstP = element.querySelector('p:first-child');
    if (!firstP) return '';

    var bold = firstP.querySelector('b, strong');
    if (bold) return bold.textContent;

    return firstP.textContent.trim();
  }

  function positionPopup(wrapper, popup) {
    // Reset
    popup.style.left = '';
    popup.style.maxWidth = '';

    var wrapperRect = wrapper.getBoundingClientRect();
    var mainContent = wrapper.closest('.main-content');
    if (mainContent) {
      var contentRect = mainContent.getBoundingClientRect();
      // Align popup to main content width
      var leftOffset = contentRect.left - wrapperRect.left;
      popup.style.left = leftOffset + 'px';
      popup.style.maxWidth = contentRect.width + 'px';
    }
  }

  function transformCallout(callout) {
    var type = getCalloutType(callout);
    var typeInfo = CALLOUT_TYPES[type];
    var title = extractTitle(callout);

    // Create wrapper
    var wrapper = document.createElement('div');
    wrapper.className = 'callout-hover-wrapper';

    // Create trigger
    var trigger = document.createElement('span');
    trigger.className = 'callout-hover-trigger callout-hover-type-' + type;
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = typeInfo.emoji +
      ' <span class="callout-hover-label">' + typeInfo.label + '：</span>' +
      '<span class="callout-hover-title">' + title + '</span>';

    // Transform original callout into popup
    callout.classList.remove('callout-hover');
    callout.classList.add('callout-hover-popup');

    // Insert wrapper into DOM
    callout.parentNode.insertBefore(wrapper, callout);
    wrapper.appendChild(trigger);
    wrapper.appendChild(callout);

    // Event handling with delays to prevent flicker
    var showTimeout = null;
    var hideTimeout = null;

    function showPopup() {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      showTimeout = setTimeout(function () {
        callout.classList.add('is-visible');
        trigger.setAttribute('aria-expanded', 'true');
        positionPopup(wrapper, callout);
      }, SHOW_DELAY);
    }

    function hidePopup() {
      if (showTimeout) {
        clearTimeout(showTimeout);
        showTimeout = null;
      }
      hideTimeout = setTimeout(function () {
        callout.classList.remove('is-visible');
        trigger.setAttribute('aria-expanded', 'false');
      }, HIDE_DELAY);
    }

    // Mouse hover
    wrapper.addEventListener('mouseenter', showPopup);
    wrapper.addEventListener('mouseleave', hidePopup);

    // Keyboard support
    trigger.addEventListener('focus', showPopup);
    trigger.addEventListener('blur', function (e) {
      // Don't hide if focus moved to something inside the popup
      if (wrapper.contains(e.relatedTarget)) return;
      hidePopup();
    });

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        hidePopup();
        trigger.blur();
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (callout.classList.contains('is-visible')) {
          hidePopup();
        } else {
          showPopup();
        }
      }
    });

    // Click toggle for mobile
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (callout.classList.contains('is-visible')) {
        callout.classList.remove('is-visible');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        callout.classList.add('is-visible');
        trigger.setAttribute('aria-expanded', 'true');
        positionPopup(wrapper, callout);
      }
    });
  }

  // Close all popups when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.callout-hover-wrapper')) {
      var visiblePopups = document.querySelectorAll('.callout-hover-popup.is-visible');
      for (var i = 0; i < visiblePopups.length; i++) {
        visiblePopups[i].classList.remove('is-visible');
        var wrapper = visiblePopups[i].closest('.callout-hover-wrapper');
        if (wrapper) {
          var trig = wrapper.querySelector('.callout-hover-trigger');
          if (trig) trig.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });

  function init() {
    var callouts = document.querySelectorAll('.callout-hover');
    for (var i = 0; i < callouts.length; i++) {
      transformCallout(callouts[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
