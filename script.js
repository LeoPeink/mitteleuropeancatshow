// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('open');
        });
    }

    // Enhanced submenu functionality with delay for better UX
    const submenuItems = document.querySelectorAll('.nav-item-with-submenu');
    let submenuTimeout;
    
    submenuItems.forEach(item => {
        const submenuLink = item.querySelector('.nav-link-with-submenu');
        const submenu = item.querySelector('.submenu');
        
        // Function to position submenu
        function positionSubmenu() {
            const rect = item.getBoundingClientRect();
            submenu.style.top = (rect.bottom + 4) + 'px';
            submenu.style.left = (rect.left + rect.width / 2) + 'px';
        }
        
        // Show submenu on hover (desktop)
        item.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                clearTimeout(submenuTimeout);
                positionSubmenu();
                submenu.style.display = 'block';
                submenu.style.animation = 'slideDown 0.2s ease-out';
            }
        });
        
        // Hide submenu with delay (desktop)
        item.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                submenuTimeout = setTimeout(() => {
                    submenu.style.display = 'none';
                }, 300); // 300ms delay before hiding
            }
        });
        
        // Mobile tap functionality
        if (submenuLink) {
            submenuLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    
                    // Close all other open submenus first
                    submenuItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('mobile-submenu-open');
                        }
                    });
                    
                    // Toggle current submenu
                    item.classList.toggle('mobile-submenu-open');
                }
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.header')) {
            nav.classList.remove('open');
            submenuItems.forEach(item => {
                item.classList.remove('mobile-submenu-open');
            });
        }
    });
});

// Carousel functionality (supports multiple carousels)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.gallery-carousel').forEach(function(carousel) {
        const carouselTrack = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn-prev');
        const nextBtn = carousel.querySelector('.carousel-btn-next');
        const dots = carousel.querySelectorAll('.dot');
        let currentSlide = 0;
        const totalSlides = slides.length;

        function updateCarousel() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto-advance carousel
        let autoAdvance = setInterval(nextSlide, 5000);
        carousel.addEventListener('mouseenter', () => clearInterval(autoAdvance));
        carousel.addEventListener('mouseleave', () => autoAdvance = setInterval(nextSlide, 5000));

        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;
        carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        carousel.addEventListener('touchmove', (e) => { endX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', () => {
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });

        updateCarousel(); // Initialize
    });
});

// Visitors Page Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const visitorsGallery = document.querySelector('.visitors-gallery-column');
    if (!visitorsGallery) return;

    const carouselTrack = document.getElementById('visitorsCarouselTrack');
    const slides = visitorsGallery.querySelectorAll('.visitors-carousel-slide');
    const prevBtn = document.getElementById('visitorsPrevBtn');
    const nextBtn = document.getElementById('visitorsNextBtn');
    const dots = visitorsGallery.querySelectorAll('.visitors-dot');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        // Move the track to show the current slide
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto-advance carousel
    let autoAdvance = setInterval(nextSlide, 4000);

    // Pause auto-advance on hover
    visitorsGallery.addEventListener('mouseenter', () => {
        clearInterval(autoAdvance);
    });

    visitorsGallery.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(nextSlide, 4000);
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    visitorsGallery.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    visitorsGallery.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    visitorsGallery.addEventListener('touchend', () => {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    // Dot click functionality
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Initialize carousel
    updateCarousel();
});