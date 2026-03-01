/**
 * Floating right-side Table of Contents (TOC)
 * - Reads h2/h3/h4 headings from .main-content
 * - Renders a fixed TOC panel on the right side
 * - Scrollspy: highlights the active section
 * - Mobile: renders a collapsible TOC at the top of content
 * - Back-to-top button: fixed at bottom-right
 * - Respects has_toc front matter (page body has data-has-toc="false" to disable)
 */
(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // Constants
  // -----------------------------------------------------------------------

  // Scroll offset (px) to account for the fixed header height (~4rem = 64px)
  var SCROLL_OFFSET = 80;
  var ARROW_DOWN = '\u25bc';
  var ARROW_RIGHT = '\u25b6';

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function uniqueId(base, usedIds) {
    if (!usedIds[base]) {
      usedIds[base] = 1;
      return base;
    }
    var count = usedIds[base]++;
    return base + '-' + count;
  }

  // -----------------------------------------------------------------------
  // Build TOC data from headings
  // -----------------------------------------------------------------------

  function buildTocItems() {
    var content = document.querySelector('.main-content');
    if (!content) return [];

    var headings = content.querySelectorAll('h2, h3, h4');
    var items = [];
    var usedIds = {};
    headings.forEach(function (h) {
      var id = h.id;
      if (!id) {
        id = uniqueId(slugify(h.textContent), usedIds);
        h.id = id;
      } else {
        // Track existing ID to avoid collisions with generated ones
        usedIds[id] = (usedIds[id] || 0) + 1;
      }
      items.push({
        id: id,
        text: h.textContent.replace(/\s*#\s*$/, '').trim(),
        level: parseInt(h.tagName.charAt(1), 10),
        el: h
      });
    });
    return items;
  }

  // -----------------------------------------------------------------------
  // Render floating TOC (desktop)
  // -----------------------------------------------------------------------

  function renderFloatingToc(items) {
    var panel = document.createElement('nav');
    panel.id = 'page-toc-float';
    panel.setAttribute('aria-label', 'Table of contents');

    var title = document.createElement('div');
    title.className = 'toc-float-title';
    title.textContent = 'ON THIS PAGE';
    panel.appendChild(title);

    var ul = document.createElement('ul');
    ul.className = 'toc-float-list';

    items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'toc-level-' + item.level;

      var a = document.createElement('a');
      a.href = '#' + item.id;
      a.textContent = item.text;
      a.dataset.tocId = item.id;

      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(item.id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    panel.appendChild(ul);
    document.body.appendChild(panel);
    return panel;
  }

  // -----------------------------------------------------------------------
  // Render inline TOC (mobile - top of content)
  // -----------------------------------------------------------------------

  function renderInlineToc(items) {
    var content = document.querySelector('.main-content');
    if (!content) return null;

    var wrapper = document.createElement('div');
    wrapper.id = 'page-toc-inline';

    var header = document.createElement('div');
    header.className = 'toc-inline-header';

    var titleSpan = document.createElement('span');
    titleSpan.textContent = 'ON THIS PAGE';

    var arrow = document.createElement('span');
    arrow.className = 'toc-inline-arrow';
    arrow.textContent = ARROW_DOWN;

    header.appendChild(titleSpan);
    header.appendChild(arrow);

    var ul = document.createElement('ul');
    ul.className = 'toc-inline-list';

    items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'toc-level-' + item.level;

      var a = document.createElement('a');
      a.href = '#' + item.id;
      a.textContent = item.text;

      li.appendChild(a);
      ul.appendChild(li);
    });

    wrapper.appendChild(header);
    wrapper.appendChild(ul);

    // Toggle collapse on header click
    header.addEventListener('click', function () {
      var collapsed = wrapper.classList.toggle('collapsed');
      arrow.textContent = collapsed ? ARROW_RIGHT : ARROW_DOWN;
    });

    // Insert at the very beginning of main-content
    content.insertBefore(wrapper, content.firstChild);
    return wrapper;
  }

  // -----------------------------------------------------------------------
  // Scrollspy - highlight active TOC link
  // -----------------------------------------------------------------------

  function initScrollspy(items) {
    if (!items.length) return;

    var links = document.querySelectorAll('#page-toc-float a[data-toc-id]');
    if (!links.length) return;

    var headingEls = items.map(function (i) { return i.el; });

    function onScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      var activeIndex = 0;
      for (var i = 0; i < headingEls.length; i++) {
        var rect = headingEls[i].getBoundingClientRect();
        if (rect.top + window.pageYOffset - SCROLL_OFFSET <= scrollTop + 1) {
          activeIndex = i;
        }
      }

      links.forEach(function (link, idx) {
        if (idx === activeIndex) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // -----------------------------------------------------------------------
  // Back-to-top button
  // -----------------------------------------------------------------------

  function initBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.title = 'Back to top';
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">' +
      '<path d="M12 4l-8 8h5v8h6v-8h5z"/>' +
      '</svg>';

    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -----------------------------------------------------------------------
  // Init
  // -----------------------------------------------------------------------

  function init() {
    // Check if TOC is disabled for this page via meta tag set by Jekyll layout
    var metaToc = document.querySelector('meta[name="has-toc"]');
    if (metaToc && metaToc.content === 'false') {
      initBackToTop();
      return;
    }

    var items = buildTocItems();

    if (items.length > 1) {
      renderFloatingToc(items);
      renderInlineToc(items);
      initScrollspy(items);
    }

    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
