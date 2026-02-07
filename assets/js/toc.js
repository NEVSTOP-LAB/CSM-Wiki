/**
 * Automatic Table of Contents Generator
 * Generates TOC from h2 and h3 headings in the main content
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTOC);
  } else {
    initTOC();
  }

  function initTOC() {
    const tocList = document.getElementById('toc-list');
    const mainContent = document.querySelector('.main-content');
    
    if (!tocList || !mainContent) {
      return;
    }

    // Get all h2 and h3 headings from main content
    const headings = mainContent.querySelectorAll('h2, h3, h4');
    
    if (headings.length === 0) {
      // No headings, hide TOC
      const tocWrapper = document.querySelector('.page-toc');
      if (tocWrapper) {
        tocWrapper.style.display = 'none';
      }
      return;
    }

    // Generate TOC HTML
    let currentLevel = 2;
    let tocHTML = '';
    let listStack = [tocList];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent.trim();
      
      // Create anchor ID if not exists
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }
      
      // Adjust list depth based on heading level
      while (currentLevel < level && listStack.length < 4) {
        const newList = document.createElement('ul');
        const lastLi = listStack[listStack.length - 1].lastElementChild;
        if (lastLi) {
          lastLi.appendChild(newList);
        } else {
          listStack[listStack.length - 1].appendChild(newList);
        }
        listStack.push(newList);
        currentLevel++;
      }
      
      while (currentLevel > level && listStack.length > 1) {
        listStack.pop();
        currentLevel--;
      }
      
      // Create TOC item
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = text;
      a.className = 'toc-link';
      a.dataset.target = heading.id;
      
      li.appendChild(a);
      listStack[listStack.length - 1].appendChild(li);
    });

    // Setup scroll spy
    setupScrollSpy(headings);
    
    // Setup smooth scroll
    setupSmoothScroll();
  }

  function setupScrollSpy(headings) {
    if (headings.length === 0) return;

    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const tocLink = document.querySelector(`.toc-link[data-target="${id}"]`);
        
        if (entry.isIntersecting) {
          // Remove active class from all links
          document.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
          });
          
          // Add active class to current link
          if (tocLink) {
            tocLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    headings.forEach(heading => {
      observer.observe(heading);
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Update URL hash without jumping
          history.pushState(null, null, '#' + targetId);
        }
      });
    });
  }

})();
