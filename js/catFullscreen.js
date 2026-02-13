// Cat Image Fullscreen Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create fullscreen overlay element
    const overlay = document.createElement('div');
    overlay.className = 'cat-fullscreen-overlay';
    overlay.innerHTML = '<span class="cat-fullscreen-close">&times;</span><img src="" alt="Fullscreen cat image">';
    document.body.appendChild(overlay);

    const overlayImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.cat-fullscreen-close');

    // Add click event to all cat bubbles
    const catBubbles = document.querySelectorAll('.aegis-cat-bubble img');
    catBubbles.forEach(catImg => {
        catImg.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            overlayImg.src = catImg.src;
            overlayImg.alt = catImg.alt;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close fullscreen on overlay click
    overlay.addEventListener('click', function() {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close fullscreen on close button click
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close fullscreen on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
});
