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
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Dynamic content loading example (if needed in the future)
    // const loadContent = async (url) => {
    //     const response = await fetch(url);
    //     const data = await response.text();
    //     document.querySelector('#content').innerHTML = data;
    // };
});