// ROS-Blocky Landing Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Tutorial cards horizontal scroll with mouse drag
    const scrollContainer = document.querySelector('.tutorials-scroll-container');
    if (scrollContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollContainer.style.cursor = 'grabbing';
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });

        scrollContainer.addEventListener('mouseleave', () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        });

        scrollContainer.addEventListener('mouseup', () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        });

        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });

        // Set initial cursor
        scrollContainer.style.cursor = 'grab';
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe steps
    document.querySelectorAll('.step').forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`;
        observer.observe(step);
    });

    // Observe tutorial cards
    document.querySelectorAll('.tutorial-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Play thumbnail video on hover
    document.querySelectorAll('.tutorial-card').forEach(card => {
        const thumbnailVideo = card.querySelector('.thumbnail-preview');
        if (thumbnailVideo) {
            card.addEventListener('mouseenter', () => {
                thumbnailVideo.play();
            });
            card.addEventListener('mouseleave', () => {
                thumbnailVideo.pause();
                thumbnailVideo.currentTime = 0;
            });

            // Get video duration and update the duration badge
            thumbnailVideo.addEventListener('loadedmetadata', () => {
                const duration = thumbnailVideo.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                const durationBadge = card.querySelector('.duration');
                if (durationBadge) {
                    durationBadge.textContent = durationText;
                }
            });
        }
    });

    // Video Modal Functionality
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const videoModalClose = document.querySelector('.video-modal-close');
    const videoModalOverlay = document.querySelector('.video-modal-overlay');

    // Open video modal when clicking tutorial cards with data-video attribute
    document.querySelectorAll('.tutorial-card[data-video]').forEach(card => {
        card.addEventListener('click', (e) => {
            const videoSrc = card.getAttribute('data-video');
            if (videoSrc && videoModal && modalVideo) {
                modalVideo.querySelector('source').src = videoSrc;
                modalVideo.load();
                videoModal.classList.add('active');
                modalVideo.play();
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close video modal
    function closeVideoModal() {
        if (videoModal && modalVideo) {
            videoModal.classList.remove('active');
            modalVideo.pause();
            modalVideo.currentTime = 0;
            document.body.style.overflow = '';
        }
    }

    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeVideoModal);
    }

    if (videoModalOverlay) {
        videoModalOverlay.addEventListener('click', closeVideoModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
});
