document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
      menuToggle.classList.toggle('open');
      if (navLinksContainer.classList.contains('mobile-open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinksContainer.classList.remove('mobile-open');
      if (menuToggle) menuToggle.classList.remove('open');
      document.body.style.overflow = '';

      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = '#' + section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  });

  const ambientCanvas = document.getElementById('ambient-canvas');
  if (ambientCanvas) {
    const ctx = ambientCanvas.getContext('2d');
    let width = (ambientCanvas.width = window.innerWidth);
    let height = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(width < 768 ? 20 : 45, 50);
    const colors = ['rgba(232, 165, 184, ', 'rgba(245, 215, 127, ', 'rgba(255, 255, 255, '];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 1;
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.1;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.005;

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
          this.y = height + 10;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorPrefix + Math.max(0, Math.min(1, this.alpha)) + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.colorPrefix + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateAmbient() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateAmbient);
    }
    animateAmbient();
  }

  function initCountdown() {
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');

    if (!daysEl) return;

    function updateTimer() {
      const now = new Date();
      let year = now.getFullYear();
      
      let targetDate = new Date(year, 9, 1, 0, 0, 0);

      if (now > targetDate && (now.getMonth() !== 9 || now.getDate() !== 1)) {
        targetDate = new Date(year + 1, 9, 1, 0, 0, 0);
      }

      const diff = targetDate - now;

      if (now.getMonth() === 9 && now.getDate() === 1) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        const titleEl = document.querySelector('.countdown-title');
        if (titleEl) titleEl.textContent = "🎉 IT'S FRANKA'S BIRTHDAY TODAY! 🎉";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }
  initCountdown();

  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryData = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption') || img.alt;
    galleryData.push({ src: img.src, caption });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const data = galleryData[currentGalleryIndex];
    lightboxImg.src = data.src;
    lightboxCaption.textContent = data.caption;
    lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;
  }

  function nextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function prevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  let touchStartX = 0;
  let touchEndX = 0;
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 40) nextImage();
      if (touchEndX > touchStartX + 40) prevImage();
    }, { passive: true });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  const musicToggle = document.getElementById('music-toggle');
  const bgMusic = document.getElementById('bg-music');
  const musicLabel = document.getElementById('music-label');
  const musicIcon = document.getElementById('music-icon');

  if (musicToggle && bgMusic) {
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicLabel.textContent = 'Play';
        musicIcon.textContent = '♪';
        isPlaying = false;
      } else {
        bgMusic.play().then(() => {
          musicToggle.classList.add('playing');
          musicLabel.textContent = 'Pause';
          musicIcon.textContent = 'Ⅱ';
          isPlaying = true;
        }).catch(err => {
          console.log('Audio playback permission error:', err);
        });
      }
    });
  }

  const tiltCards = document.querySelectorAll('.tilt-effect');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  const btnCopyLetter = document.getElementById('btn-copy-letter');
  if (btnCopyLetter) {
    btnCopyLetter.addEventListener('click', () => {
      const letterText = `Happy Birthday, Franka ❤️\n\n` +
        `It’s funny how some people become part of your story in ways you never really planned.\n\n` +
        `I still remember the first time I saw you during our freshers’ orientation. A lot has happened since then. From being strangers to eventually becoming genuinely close friends, we have shared conversations, laughed together, created memories, and gotten to know each other in ways I never expected that first day.\n\n` +
        `Life changes, people grow, and sometimes the journey takes unexpected turns. But regardless of where life takes us, I’m grateful that I got the chance to know you and have you as a friend.\n\n` +
        `On your birthday, I just want you to know that I genuinely wish you well. I hope this new chapter brings you peace, happiness, growth, good health, and opportunities that make you proud of yourself.\n\n` +
        `Keep being yourself. Keep growing. Keep chasing the things that matter to you.\n\n` +
        `Happy Birthday once again, Franka. 🎂❤️\n\n` +
        `May October 1st mark the beginning of a beautiful year for you.`;

      navigator.clipboard.writeText(letterText).then(() => {
        const originalHTML = btnCopyLetter.innerHTML;
        btnCopyLetter.innerHTML = '<span>✨ Letter Copied!</span>';
        btnCopyLetter.style.borderColor = 'var(--accent-gold)';
        setTimeout(() => {
          btnCopyLetter.innerHTML = originalHTML;
        }, 2500);
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    });
  }

  const confettiCanvas = document.getElementById('confetti-canvas');
  if (confettiCanvas) {
    const cctx = confettiCanvas.getContext('2d');
    let cw = (confettiCanvas.width = confettiCanvas.parentElement.clientWidth);
    let ch = (confettiCanvas.height = confettiCanvas.parentElement.clientHeight);

    window.addEventListener('resize', () => {
      if (!confettiCanvas.parentElement) return;
      cw = confettiCanvas.width = confettiCanvas.parentElement.clientWidth;
      ch = confettiCanvas.height = confettiCanvas.parentElement.clientHeight;
    });

    const confettiPieces = [];
    const colors = ['#f5d77f', '#e8a5b8', '#ffffff', '#ffd166', '#ef476f', '#06d6a0'];

    function createConfettiBurst(count = 80) {
      for (let i = 0; i < count; i++) {
        confettiPieces.push({
          x: cw / 2 + (Math.random() - 0.5) * 100,
          y: ch / 2 + (Math.random() - 0.5) * 100,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 12,
          vy: Math.random() * -12 - 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          gravity: 0.25,
          opacity: 1
        });
      }
    }

    function animateConfetti() {
      cctx.clearRect(0, 0, cw, ch);

      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const p = confettiPieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;

        if (p.opacity <= 0 || p.y > ch + 20) {
          confettiPieces.splice(i, 1);
          continue;
        }

        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rotation * Math.PI) / 180);
        cctx.globalAlpha = p.opacity;
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        cctx.restore();
      }

      requestAnimationFrame(animateConfetti);
    }
    animateConfetti();

    const btnConfetti = document.getElementById('btn-trigger-confetti');
    if (btnConfetti) {
      btnConfetti.addEventListener('click', () => {
        createConfettiBurst(120);
      });
    }

    const celebrationSection = document.getElementById('celebration');
    if (celebrationSection && 'IntersectionObserver' in window) {
      let triggered = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !triggered) {
            createConfettiBurst(150);
            triggered = true;
          }
        });
      }, { threshold: 0.4 });
      observer.observe(celebrationSection);
    }
  }

  const fadeElements = document.querySelectorAll('.fade-in, .personality-card, .gallery-item, .letter-card');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => {
      el.classList.add('fade-in');
      revealObserver.observe(el);
    });
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

});
