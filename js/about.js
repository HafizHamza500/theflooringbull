// Scroll-triggered counters: start all counters together when section enters viewport
    document.addEventListener('DOMContentLoaded', function(){
      const section = document.querySelector('.stats-section');
      if(!section) return;
      const counters = Array.from(section.querySelectorAll('.stat-number'));
      if(!counters.length) return;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            obs.disconnect();
            startCounters(counters, 1600);
          }
        });
      }, {threshold: 0.3});

      observer.observe(section);

      function startCounters(nodes, duration){
        const targets = nodes.map(n => ({el: n, target: parseFloat(n.dataset.target) || 0, suffix: n.dataset.suffix || ''}));
        const start = performance.now();
        const easeOutCubic = x => 1 - Math.pow(1 - x, 3);

        function frame(now){
          const t = Math.min(1, (now - start) / duration);
          const progress = easeOutCubic(t);
          targets.forEach(item => {
            const current = Math.floor(item.target * progress);
            item.el.textContent = current.toLocaleString() + item.suffix;
          });
          if(t < 1) requestAnimationFrame(frame);
          else {
            // ensure final values exactly match targets
            targets.forEach(item => {
              const final = (Number.isInteger(item.target) ? Math.floor(item.target) : item.target);
              item.el.textContent = final.toLocaleString() + item.suffix;
            });
          }
        }

        requestAnimationFrame(frame);
      }
    });

    /* Testimonial */

      document.addEventListener('DOMContentLoaded', function(){
      const section = document.querySelector('.testimonial-section');
      if(!section) return;

      const track = document.getElementById('testimonialTrack');
      const dots = Array.from(section.querySelectorAll('.dot'));
      const prevBtn = document.getElementById('prevTest');
      const nextBtn = document.getElementById('nextTest');

      let index = 0;
      let autoplayId = null;
      const slideCount = track.children.length;

      // Ensure each slide fills the visible container
      const slides = Array.from(track.children);
      function sizeSlides(){
        const containerWidth = track.parentElement.clientWidth;
        slides.forEach(s => { s.style.flex = '0 0 ' + containerWidth + 'px'; s.style.maxWidth = containerWidth + 'px'; });
        track.style.width = (containerWidth * slideCount) + 'px';
        // reposition after resize
        track.style.transform = `translateX(-${index * containerWidth}px)`;
      }

      function update(){
        const containerWidth = track.parentElement.clientWidth;
        track.style.transform = `translateX(-${index * containerWidth}px)`;
        dots.forEach(d => {
          if(Number(d.dataset.index) === index){
            d.classList.remove('bg-gray-300/60');
            d.classList.add('bg-yellow-400/60');
          } else {
            d.classList.remove('bg-yellow-400/60');
            d.classList.add('bg-gray-300/60');
          }
        });
      }

      // keep slides sized on load/resize
      window.addEventListener('resize', sizeSlides);
      sizeSlides();

      function next(){ index = (index + 1) % slideCount; update(); }
      function prev(){ index = (index - 1 + slideCount) % slideCount; update(); }

      nextBtn.addEventListener('click', ()=>{ stopAutoplay(); next(); });
      prevBtn.addEventListener('click', ()=>{ stopAutoplay(); prev(); });
      dots.forEach(d => d.addEventListener('click', e => { stopAutoplay(); index = Number(e.currentTarget.dataset.index); update(); }));

      // Touch swipe support - single touch only
      let touchStartX = 0;
      track.addEventListener('touchstart', (e) => {
        if(e.touches.length === 1) touchStartX = e.touches[0].clientX;
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        if(e.changedTouches.length === 1){
          const touchEndX = e.changedTouches[0].clientX;
          const diff = touchStartX - touchEndX;
          if(Math.abs(diff) > 50){
            stopAutoplay();
            if(diff > 0) next();
            else prev();
          }
        }
      }, { passive: true });

      // Mouse swipe support
      let mouseStartX = 0;
      let isMouseDown = false;
      track.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        mouseStartX = e.clientX;
      });

      track.addEventListener('mouseup', (e) => {
        if(isMouseDown){
          isMouseDown = false;
          const mouseEndX = e.clientX;
          const diff = mouseStartX - mouseEndX;
          if(Math.abs(diff) > 50){
            stopAutoplay();
            if(diff > 0) next();
            else prev();
          }
        }
      });

      track.addEventListener('mouseleave', () => { isMouseDown = false; });

      function startAutoplay(){ if(autoplayId) return; autoplayId = setInterval(next, 4500); }
      function stopAutoplay(){ if(!autoplayId) return; clearInterval(autoplayId); autoplayId = null; }

      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if(en.isIntersecting) startAutoplay(); else stopAutoplay();
        });
      }, {threshold: 0.4});
      io.observe(section);

      update();
    });


    // Hero Text Visibility Script

       document.addEventListener('DOMContentLoaded', function(){
        const hero = document.querySelector('.hero');
        const heroOverlay = document.querySelector('.hero-overlay');
        const heroVideo = document.getElementById('heroVideo');
        const centerRadius = 150; // pixels from center to detect cursor

        // Track mouse movement to show/hide text based on proximity to center
        hero.addEventListener('mousemove', function(e) {
          const rect = hero.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const distanceFromCenter = Math.sqrt(
            Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
          );

          const isVideoPlaying = !heroVideo.paused;

          // Show text if cursor is near center (regardless of video state)
          if (distanceFromCenter < centerRadius) {
            heroOverlay.style.opacity = '1';
            heroOverlay.style.pointerEvents = 'auto';
          } else if (!isVideoPlaying) {
            // Hide text only if video is playing AND cursor is away from center
            heroOverlay.style.opacity = '0';
            heroOverlay.style.pointerEvents = 'none';
          }
        });

        // Show text when moving away from hero section
        hero.addEventListener('mouseleave', function() {
          const isVideoPlaying = !heroVideo.paused;

          // Keep text visible if paused, hide if playing
          if (isVideoPlaying) {
            heroOverlay.style.opacity = '0';
            heroOverlay.style.pointerEvents = 'none';
          } else {
            heroOverlay.style.opacity = '1';
            heroOverlay.style.pointerEvents = 'auto';
          }
        });

        // Hide text when video plays, show when paused
        heroVideo.addEventListener('play', function() {
          heroOverlay.style.opacity = '0';
          heroOverlay.style.pointerEvents = 'none';
        });

        heroVideo.addEventListener('pause', function() {
          heroOverlay.style.opacity = '1';
          heroOverlay.style.pointerEvents = 'auto';
        });

        // Initialize with visible text
        heroOverlay.style.opacity = '1';
      });
