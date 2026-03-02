/**
 * Floating right-side Table of Contents (TOC)
 * - Reads h2/h3/h4 headings from .main-content
 * - Renders a fixed TOC panel on the right side
 * - Scrollspy: highlights the active section
 * - Mobile: renders a collapsible TOC at the top of content
 * - Back-to-top button: fixed at bottom-right
 * - Respects has_toc front matter (via <meta name="has-toc" content="false"> to disable)
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

  // Smooth-scroll to an element's position, accounting for the fixed header
  function scrollToHeading(id) {
    var target = document.getElementById(id);
    if (!target) return;

    // getBoundingClientRect() is fine here: this runs on a single click event,
    // not in a scroll loop, so one layout read per interaction is acceptable.
    var targetY = target.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;

    // Update URL hash without triggering an extra jump
    var hash = '#' + id;
    if (window.history && typeof window.history.pushState === 'function') {
      window.history.pushState(null, '', hash);
    } else {
      // Fallback: temporarily remove the id to prevent the browser from
      // jumping to the anchor before we scroll
      target.id = '';
      window.location.hash = hash;
      target.id = id;
    }

    window.scrollTo({ top: targetY, behavior: 'smooth' });
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
        var baseId = slugify(h.textContent) || 'untitled-section';
        id = uniqueId(baseId, usedIds);
        h.id = id;
      } else {
        // Ensure pre-existing IDs are unique as well
        if (usedIds[id]) {
          var oldId = id;
          var newId = uniqueId(id, usedIds);
          h.id = newId;
          id = newId;
          // Also update any in-heading anchors (e.g., Just-the-Docs permalink
          // anchors) that still reference the old id so they don't break.
          var childAnchors = h.querySelectorAll('a[href^="#"]');
          childAnchors.forEach(function (a) {
            if (a.getAttribute('href') === '#' + oldId) {
              a.setAttribute('href', '#' + newId);
            }
          });
        } else {
          usedIds[id] = 1;
        }
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
      a.title = item.text;       // expose full text on hover & to screen readers
      a.dataset.tocId = item.id;

      a.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToHeading(item.id);
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    panel.appendChild(ul);
    document.body.appendChild(panel);
    return panel;
  }

  // -----------------------------------------------------------------------
  // Track TOC panel width → CSS custom property --page-toc-width on :root
  // This allows .main to reserve the exact right-padding needed without
  // hard-coding a fixed value.  Falls back gracefully when ResizeObserver
  // is unavailable or when no TOC is rendered (var defaults to 0px in CSS).
  // -----------------------------------------------------------------------

  function trackTocWidth(panel) {
    function applyWidth() {
      // offsetWidth reads the layout box including border/padding — exactly
      // what we want so that .main's padding-right matches the rendered size.
      var w = panel.offsetWidth + 50; // add some extra spacing for visual comfort
      document.documentElement.style.setProperty('--page-toc-width', (w || 0) + 'px');
    }

    applyWidth(); // set immediately after first render

    // Keep the variable in sync when the TOC resizes (e.g. on window resize).
    // Store the observer/listener on the panel element itself so it could be
    // disconnected in the future should the panel ever be removed.
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(applyWidth);
      ro.observe(panel);
      panel._tocResizeObserver = ro; // store reference for potential cleanup
    } else if (typeof window !== 'undefined' && window.addEventListener) {
      // Fallback for browsers without ResizeObserver: update on window resize.
      // This also handles the case where the panel is display:none on load
      // (narrow viewport) and the user later widens into the desktop breakpoint.
      var resizeHandler = function () {
        applyWidth();
      };

      try {
        window.addEventListener('resize', resizeHandler, { passive: true });
      } catch (e) {
        // Older browsers may not support the options object; fall back silently.
        window.addEventListener('resize', resizeHandler);
      }

      panel._tocResizeHandler = resizeHandler; // store reference for potential cleanup
    }
  }

  // -----------------------------------------------------------------------
  // Render inline TOC (mobile - top of content)
  // -----------------------------------------------------------------------

  function renderInlineToc(items) {
    var content = document.querySelector('.main-content');
    if (!content) return null;

    var wrapper = document.createElement('div');
    wrapper.id = 'page-toc-inline';

    // Use a <button> for keyboard accessibility and proper semantics
    var header = document.createElement('button');
    header.className = 'toc-inline-header';
    header.setAttribute('aria-expanded', 'true');
    header.setAttribute('aria-controls', 'page-toc-inline-list');

    var titleSpan = document.createElement('span');
    titleSpan.textContent = 'ON THIS PAGE';

    var arrow = document.createElement('span');
    arrow.className = 'toc-inline-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = ARROW_DOWN;

    header.appendChild(arrow);
    header.appendChild(titleSpan);

    var ul = document.createElement('ul');
    ul.className = 'toc-inline-list';
    ul.id = 'page-toc-inline-list';

    items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'toc-level-' + item.level;

      var a = document.createElement('a');
      a.href = '#' + item.id;
      a.textContent = item.text;

      // Use offset-aware smooth scroll for inline links too
      a.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToHeading(item.id);
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    wrapper.appendChild(header);
    wrapper.appendChild(ul);

    // Toggle collapse on header click
    header.addEventListener('click', function () {
      var collapsed = wrapper.classList.toggle('collapsed');
      arrow.textContent = collapsed ? ARROW_RIGHT : ARROW_DOWN;
      header.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
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
    var rafPending = false;

    function updateHighlight() {
      rafPending = false;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      var activeIndex = 0;
      for (var i = 0; i < headingEls.length; i++) {
        // Read offsetTop (layout property) to avoid forced reflow per scroll
        if (headingEls[i].offsetTop - SCROLL_OFFSET <= scrollTop + 1) {
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

    window.addEventListener('scroll', function () {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateHighlight);
      }
    }, { passive: true });

    // Run once on init to reflect initial scroll position
    updateHighlight();
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

    function updateVisibility() {
      if (window.pageYOffset > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    // Ensure correct initial visibility if the page loads already scrolled
    updateVisibility();

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
      var panel = renderFloatingToc(items);
      trackTocWidth(panel);
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
