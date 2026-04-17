// Consolidated JavaScript - Combined from script.js and assets/main.js
// Mobile menu, mega-menu hover and click behavior, contact form handler, and all site functionality

// Set flag so header.html knows consolidated is loaded
window.consolidatedLoaded = true;

document.addEventListener('DOMContentLoaded', function () {
  // ==================== HERO VIDEO PLAY/PAUSE CONTROLS ====================
  const hero = document.querySelector('.hero');
  if (hero) {
    const video = hero.querySelector('video');
    const playBtn = hero.querySelector('#heroPlayBtn');
    const playIcon = hero.querySelector('#playIcon');
    const pauseIcon = hero.querySelector('#pauseIcon');

    function updateButtonState(isPlaying) {
      if (!playBtn) return;

      if (isPlaying) {
        // Playing state - hide play icon, show pause icon
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        playBtn.setAttribute('aria-pressed', 'true');
      } else {
        // Paused state - show play icon, hide pause icon
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        playBtn.setAttribute('aria-pressed', 'false');
      }
    }

    if (playBtn && video) {
      // Initial state - video starts paused
      hero.classList.add('paused');
      updateButtonState(false);

      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });

      video.addEventListener('play', () => {
        hero.classList.remove('paused');
        hero.classList.add('playing');
        updateButtonState(true);
      });

      video.addEventListener('pause', () => {
        hero.classList.remove('playing');
        hero.classList.add('paused');
        updateButtonState(false);
      });

      // Set initial button state based on video state
      updateButtonState(video.paused);
    }
  }

  // ==================== HEADER SHRINK AND LOGO FADE-IN ====================
  const header = document.getElementById('site-header');
  const headerInner = document.getElementById('header-inner');
  const logoWrap = document.getElementById('logo-wrap');
  const logoImg = document.getElementById('logo-img');

  // initial fade-in for logo
  setTimeout(()=>{if(logoWrap) logoWrap.style.opacity='1';},300);

  // scroll handler
  const onScroll = ()=>{
    if(!header || !headerInner || !logoImg) return;
    if(window.scrollY > 60){
      header.classList.add('scrolled');
      headerInner.classList.add('scrolled');
      logoImg.classList.add('scrolled');
      header.style.backgroundColor='rgba(17,24,39,0.95)';
    } else {
      header.classList.remove('scrolled');
      headerInner.classList.remove('scrolled');
      logoImg.classList.remove('scrolled');
      header.style.backgroundColor='rgba(17,24,39,0.95)';
    }
  };
  window.addEventListener('scroll', onScroll, {passive:true});

  // ==================== ANIMATE PARALLAX IMAGE INTO VIEW ====================
  const parallax = document.querySelector('.parallax-img');
  if(parallax){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) parallax.classList.add('in-view'); });
    },{threshold:0.2});
    io.observe(parallax);
  }

  
  // ==================== TESTIMONIALS SIMPLE ROTATOR ====================
  const testimonials = [
    {quote:'They transformed our kitchen in two days. Exceptional craft and communication.',name:'Sarah R., Anytown'},
    {quote:'Quick, professional, and the finish looks incredible. Highly recommend.',name:'Marcus T., Lakeside'},
    {quote:'Fair pricing and the team was respectful of our home. Fantastic result.',name:'Olivia P., Riverton'}
  ];

  const testWrap = document.getElementById('testimonials');
  if(testWrap){
    let idx = 0;
    const render = ()=>{
      const t = testimonials[idx];
      testWrap.innerHTML = `
        <div class="test-slide text-center p-6 shadow rounded-lg bg-gray-50">
          <div class="text-yellow-500">★★★★★</div>
          <p class="mt-2 text-gray-700">"${t.quote}"</p>
          <div class="mt-3 font-semibold">${t.name}</div>
        </div>`;
    }
    render();
    setInterval(()=>{ idx = (idx+1) % testimonials.length; render(); }, 5000);
  }

  // ==================== Before-After Slider ====================
  function initializeSlider(sliderNum) {
    const container = document.getElementById(`comparisonContainer${sliderNum}`);
    const handle = document.getElementById(`sliderHandle${sliderNum}`);
    const beforeImg = document.getElementById(`beforeImg${sliderNum}`);
    const afterImg = document.getElementById(`afterImg${sliderNum}`);
    const beforeLabel = document.getElementById(`beforeLabel${sliderNum}`);
    const afterLabel = document.getElementById(`afterLabel${sliderNum}`);

    if (!container || !handle || !beforeImg || !afterImg) return;

    let isDragging = false;
    let percentage = 50; // start in middle

    function updateSlider(posPercent) {
      percentage = posPercent;
      const clip = `${percentage}%`;

      // Update clip-path via CSS custom property
      beforeImg.style.setProperty('--clip', clip);
      afterImg.style.setProperty('--clip', clip);

      // Move handle
      handle.style.left = clip;

      // Toggle label visibility based on side
      if (beforeLabel && afterLabel) {
        if (percentage <= 10) {
          beforeLabel.style.opacity = '1';
          afterLabel.style.opacity = '0';
        } else if (percentage >= 90) {
          beforeLabel.style.opacity = '0';
          afterLabel.style.opacity = '1';
        } else {
          beforeLabel.style.opacity = '1';
          afterLabel.style.opacity = '1';
        }
      }
    }

    // Initialize
    updateSlider(50);

    // Mouse events
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = container.getBoundingClientRect();
      let x = e.clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const pct = (x / rect.width) * 100;
      updateSlider(pct);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    handle.addEventListener('touchstart', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const rect = container.getBoundingClientRect();
      let x = e.touches[0].clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const pct = (x / rect.width) * 100;
      updateSlider(pct);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Initialize both sliders
  initializeSlider(1);
  initializeSlider(2);
  // ==================== TWO-STEP HERO FORM BEHAVIOR ====================
  const heroForm = document.getElementById('hero-form');
  if(heroForm){
    const step1 = heroForm.querySelector('.form-step-1');
    const step2 = heroForm.querySelector('.form-step-2');
    const btnNext = document.getElementById('form-next');
    const btnPrev = document.getElementById('form-prev');

    const validateStep1 = ()=>{
      const name = heroForm.querySelector('input[name=name]');
      const email = heroForm.querySelector('input[name=email]');
      const phone = heroForm.querySelector('input[name=phone]');
      if(!name || !email || !phone) return false;
      if(!name.value.trim()) { name.focus(); return false }
      if(!email.value.trim()) { email.focus(); return false }
      if(!phone.value.trim()) { phone.focus(); return false }
      return true;
    }

    if(btnNext){
      btnNext.addEventListener('click', ()=>{
        if(!validateStep1()) return;
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
      });
    }

    if(btnPrev){
      btnPrev.addEventListener('click', ()=>{
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
      });
    }
  }
});
