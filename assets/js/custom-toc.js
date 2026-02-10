// Generate collapsible Table of Contents (TOC) below navbar
(function() {
  'use strict';
  
  // Only generate TOC on pages with sufficient content
  function generateTOC() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Get all headings (h2, h3, h4) from main content
    const headings = mainContent.querySelectorAll('h2, h3, h4');
    
    // Need at least 2 headings to show TOC
    if (headings.length < 2) return;
    
    // Detect language once for consistent text
    const lang = document.documentElement.lang || 'zh';
    const tocText = lang.startsWith('zh') ? '目录' : 'Table of Contents';
    
    // Create TOC toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'toc-toggle-button';
    toggleButton.textContent = tocText;
    toggleButton.setAttribute('aria-label', 'Toggle Table of Contents');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.setAttribute('aria-controls', 'page-toc-nav');
    
    // Create TOC container
    const tocContainer = document.createElement('nav');
    tocContainer.className = 'page-toc';
    tocContainer.setAttribute('aria-label', 'Table of Contents');
    tocContainer.setAttribute('id', 'page-toc-nav');
    tocContainer.setAttribute('aria-hidden', 'true');
    
    // Create TOC heading
    const tocHeading = document.createElement('div');
    tocHeading.className = 'page-toc-heading';
    tocHeading.textContent = tocText;
    tocContainer.appendChild(tocHeading);
    
    // Create TOC list
    const tocList = document.createElement('ul');
    tocList.className = 'page-toc-list';
    
    // Track used IDs to ensure uniqueness
    const usedIds = new Set();
    
    headings.forEach(heading => {
      const level = heading.tagName.toLowerCase();
      const listItem = document.createElement('li');
      listItem.className = `toc-${level}`;
      
      const link = document.createElement('a');
      link.textContent = heading.textContent.replace(/^#\s*/, '').trim();
      
      // Get the heading ID or create a unique one
      let headingId = heading.id;
      if (!headingId) {
        headingId = heading.textContent.toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
          .replace(/^-|-$/g, '');
        
        // Ensure uniqueness by appending a counter if needed
        let uniqueId = headingId;
        let counter = 1;
        while (usedIds.has(uniqueId)) {
          uniqueId = `${headingId}-${counter}`;
          counter++;
        }
        headingId = uniqueId;
        heading.id = headingId;
      }
      usedIds.add(headingId);
      
      link.href = `#${headingId}`;
      
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Add click handler for smooth scroll
      link.addEventListener('click', function(e) {
        e.preventDefault();
        heading.scrollIntoView({ 
          behavior: prefersReducedMotion ? 'auto' : 'smooth', 
          block: 'start' 
        });
        history.pushState(null, null, `#${headingId}`);
        
        // Update active link
        updateActiveLink(link);
      });
      
      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });
    
    tocContainer.appendChild(tocList);
    
    // Add toggle functionality
    toggleButton.addEventListener('click', function() {
      const isVisible = tocContainer.classList.contains('show');
      tocContainer.classList.toggle('show');
      toggleButton.setAttribute('aria-expanded', !isVisible);
      tocContainer.setAttribute('aria-hidden', isVisible);
    });
    
    // Add collapse/expand functionality to TOC heading
    tocHeading.addEventListener('click', function() {
      tocContainer.classList.toggle('collapsed');
    });
    
    // Insert toggle button and TOC at the beginning of main content
    const mainContentWrap = document.querySelector('.main-content-wrap');
    if (mainContentWrap) {
      // Insert button before the main content
      mainContent.insertBefore(toggleButton, mainContent.firstChild);
      // Insert TOC after the button
      mainContent.insertBefore(tocContainer, toggleButton.nextSibling);
    }
    
    // Set up scroll spy to highlight current section
    setupScrollSpy(headings, tocList);
  }
  
  function updateActiveLink(activeLink) {
    const allLinks = document.querySelectorAll('.page-toc-list a');
    allLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }
  
  function setupScrollSpy(headings, tocList) {
    const links = tocList.querySelectorAll('a');
    
    function highlightTOC() {
      let currentHeading = null;
      const scrollPosition = window.scrollY + 100;
      
      // Find the current heading based on scroll position
      headings.forEach((heading, index) => {
        const rect = heading.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY;
        if (offsetTop <= scrollPosition) {
          currentHeading = index;
        }
      });
      
      // Update active link
      links.forEach((link, index) => {
        if (index === currentHeading) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
    
    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(highlightTOC, 100);
    });
    
    // Initial highlight
    highlightTOC();
  }
  
  // Generate TOC when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateTOC);
  } else {
    generateTOC();
  }
})();
