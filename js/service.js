// Carousel and animations functionality
document.addEventListener('DOMContentLoaded', function() {
  // Carousel smooth scroll handling
  const carouselTrack = document.querySelector('.carousel-track');

  if (carouselTrack) {
    // Reset animation on hover for smooth pause/play
    carouselTrack.addEventListener('mouseenter', function() {
      this.style.animationPlayState = 'paused';
    });

    carouselTrack.addEventListener('mouseleave', function() {
      this.style.animationPlayState = 'running';
    });
  }

  // Service cards stagger animation
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Content sections fade-in on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all content sections
  document.querySelectorAll('.content-with-image').forEach(element => {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
});
