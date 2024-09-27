// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Check if the screen width is 600px or less
    if (window.matchMedia('(max-width: 600px)').matches) {
        // Get the button
        var scrollToTopBtn = document.getElementById('scrollToTopBtn');

        // Add a scroll event listener
        window.addEventListener('scroll', function() {
            // Check if the user scrolled down (more than 100 pixels)
            if (window.scrollY > 100) {
                // Add the 'show' class to display the button
                scrollToTopBtn.classList.add('show');
            } else {
                // Remove the 'show' class to hide the button
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Add a click event listener to the button
        scrollToTopBtn.addEventListener('click', function() {
            // Smooth scroll to the top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
