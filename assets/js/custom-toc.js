// Generate floating Table of Contents (TOC) automatically
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
    
    // Create TOC container
    const tocContainer = document.createElement('nav');
    tocContainer.className = 'page-toc';
    tocContainer.setAttribute('aria-label', 'Table of Contents');
    
    // Create TOC heading
    const tocHeading = document.createElement('div');
    tocHeading.className = 'page-toc-heading';
    tocHeading.textContent = '目录';
    tocContainer.appendChild(tocHeading);
    
    // Create TOC list
    const tocList = document.createElement('ul');
    tocList.className = 'page-toc-list';
    
    headings.forEach(heading => {
      const level = heading.tagName.toLowerCase();
      const listItem = document.createElement('li');
      listItem.className = `toc-${level}`;
      
      const link = document.createElement('a');
      link.textContent = heading.textContent.replace(/^#\s*/, '').trim();
      
      // Get the heading ID or create one
      let headingId = heading.id;
      if (!headingId) {
        headingId = heading.textContent.toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
          .replace(/^-|-$/g, '');
        heading.id = headingId;
      }
      
      link.href = `#${headingId}`;
      
      // Add click handler for smooth scroll
      link.addEventListener('click', function(e) {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, `#${headingId}`);
        
        // Update active link
        updateActiveLink(link);
      });
      
      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });
    
    tocContainer.appendChild(tocList);
    
    // Insert TOC into the page
    const mainContentWrap = document.querySelector('.main-content-wrap');
    if (mainContentWrap) {
      mainContentWrap.appendChild(tocContainer);
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
        if (heading.offsetTop <= scrollPosition) {
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
