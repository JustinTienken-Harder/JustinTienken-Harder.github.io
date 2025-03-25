// This file contains JavaScript functionality for interactive elements of the blog, such as navigation and dynamic content loading.

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    for (const link of internalLinks) {
        link.addEventListener('click', function(e) {
            // Don't prevent default for all links - only handle non-footnote links here
            if (!this.classList.contains('footnote')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // Get all footnote reference links
    const footnoteRefs = document.querySelectorAll('.footnote');
    
    if (footnoteRefs.length > 0) {
      footnoteRefs.forEach(function(ref) {
        ref.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Extract the ID from the href attribute
          const href = this.getAttribute('href');
          if (href) {
            // Instead of using querySelector with the ID, get the element directly by ID
            const targetId = href.substring(1); // Remove the # character
            const target = document.getElementById(targetId);
            
            if (target) {
              // Scroll to the footnote
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });
    }
    
    // Get all footnote back links
    const footnoteBackLinks = document.querySelectorAll('.reversefootnote');
    
    if (footnoteBackLinks.length > 0) {
      footnoteBackLinks.forEach(function(backLink) {
        backLink.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Extract the ID from the href attribute
          const href = this.getAttribute('href');
          if (href) {
            // Instead of using querySelector with the ID, get the element directly by ID
            const targetId = href.substring(1); // Remove the # character
            const target = document.getElementById(targetId);
            
            if (target) {
              // Scroll back to the reference
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });
    }

    // Dynamic content loading example (if needed in the future)
    // const loadContent = async (url) => {
    //     const response = await fetch(url);
    //     const data = await response.text();
    //     document.querySelector('#content').innerHTML = data;
    // };
});