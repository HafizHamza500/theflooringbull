  // Video auto-play/pause based on visibility
      const videoSection = document.getElementById('video-section');
      const floatingVideo = document.getElementById('flooring-video');
      const videoContainer = document.getElementById('video-container');

      // Intersection Observer for auto-play/pause
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Video is visible - play it
            floatingVideo.play().catch(() => {
              // Autoplay was prevented, silent fail
            });
          } else {
            // Video is not visible - pause it
            floatingVideo.pause();
          }
        });
      }, { threshold: 0.25 });

      videoObserver.observe(videoSection);

      // Scroll-based zoom effect - only on desktop
      window.addEventListener('scroll', () => {
        // Check if screen width is desktop (768px and above)
        const isDesktop = window.innerWidth >= 768;

        if (!isDesktop) {
          // On mobile, reset to normal scale
          videoContainer.style.transform = 'scale(1)';
          videoContainer.style.opacity = '1';
          return;
        }

        const scrollTop = window.scrollY;
        const sectionTop = videoSection.offsetTop;
        const windowHeight = window.innerHeight;

        // Calculate zoom factor based on scroll position
        let zoomFactor = 1;

        if (scrollTop < sectionTop) {
          // Before reaching the section - zoom in as we approach
          const distanceFromSection = sectionTop - scrollTop;
          const maxDistance = windowHeight * 1.5;

          if (distanceFromSection > maxDistance) {
            zoomFactor = 0.6; // Smallest zoom when far away
          } else {
            // Gradually zoom in as we approach
            zoomFactor = 0.6 + (1 - (distanceFromSection / maxDistance)) * 0.4;
          }
        } else {
          // At or past the section - stay at full zoom
          zoomFactor = 1;
        }

        // Apply the scale transform (zoom effect)
        videoContainer.style.transform = `scale(${zoomFactor})`;
        videoContainer.style.opacity = Math.min(1, zoomFactor + 0.2);
      });

      // Handle window resize to reset animation on mobile view
      window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
          videoContainer.style.transform = 'scale(1)';
          videoContainer.style.opacity = '1';
        }
      });

function drawArrows() {
  const canvas = document.getElementById('arrow-canvas');
  const cr = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = cr.width * dpr; canvas.height = cr.height * dpr;
  canvas.style.width = cr.width + 'px'; canvas.style.height = cr.height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cr.width, cr.height);
  if (window.innerWidth < 768) return;
  const circles = ['circle1','circle2','circle3'].map(id => document.getElementById(id));
  const centers = circles.map(el => {
    const r = el.getBoundingClientRect();
    return { x: r.left - cr.left + r.width / 2, y: r.top - cr.top + r.height / 2 };
  });
  const circleR = circles[0].offsetWidth / 2;
  const Y = '#f5c518', LW = Math.max(2.5, cr.width * 0.0015), BR = Math.max(16, cr.width * 0.012);
  for (let i = 0; i < 2; i++) {
    const x1 = centers[i].x + circleR + 4, x2 = centers[i+1].x - circleR - 4;
    const y = centers[i].y, mx = (x1 + x2) / 2;
    ctx.strokeStyle = Y; ctx.lineWidth = LW; ctx.lineCap = 'butt'; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(mx - BR - 1, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mx + BR + 1, y); ctx.lineTo(x2, y); ctx.stroke();
    ctx.beginPath(); ctx.arc(mx, y, BR, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = Y; ctx.lineWidth = LW * 0.85; ctx.stroke();
    const arm = BR * 0.48, ext = BR * 0.3;
    ctx.beginPath(); ctx.moveTo(mx - ext + 1, y - arm); ctx.lineTo(mx + ext, y); ctx.lineTo(mx - ext + 1, y + arm);
    ctx.strokeStyle = Y; ctx.lineWidth = LW * 1.1; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
  }
}
window.addEventListener('load', drawArrows);
window.addEventListener('resize', drawArrows);
setTimeout(drawArrows, 100);
setTimeout(drawArrows, 500);