/* ══════════════════════════════════════════════
   IMANSOFT TECHNOLOGIES — MAIN JAVASCRIPT
══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── NAVBAR ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const navMobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });

  // Close mobile nav on link click
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMobile.classList.remove('open');
    });
  });

  // ─── HERO PARTICLES ──────────────────────────
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    const count = window.innerWidth > 768 ? 30 : 12;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 15;
      const drift = (Math.random() - 0.5) * 150;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
        --drift: ${drift}px;
        opacity: 0;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  // ─── SCROLL REVEAL ───────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  // Also observe service cards
  const serviceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          serviceObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll('.service-card, .proj-card').forEach(el => {
    serviceObserver.observe(el);
  });

  // ─── COUNTER ANIMATION ───────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-num[data-count]').forEach(animateCounter);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  const statsSection = document.querySelector('.stats-sec');
  if (statsSection) counterObserver.observe(statsSection);

  // ─── TESTIMONIALS CAROUSEL ───────────────────
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (track) {
    const cards = track.querySelectorAll('.testi-card');
    let current = 0;
    let itemsPerView = getItemsPerView();
    let maxIndex = Math.max(0, cards.length - itemsPerView);

    function getItemsPerView() {
      return window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const totalDots = Math.ceil(cards.length / itemsPerView);
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('tn-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIndex));
      const cardWidth = cards[0].offsetWidth + 24; // gap
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      dotsContainer.querySelectorAll('.tn-dot').forEach((d, i) => {
        d.classList.toggle('active', i === Math.floor(current / itemsPerView));
      });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    window.addEventListener('resize', () => {
      itemsPerView = getItemsPerView();
      maxIndex = Math.max(0, cards.length - itemsPerView);
      current = 0;
      track.style.transform = 'translateX(0)';
      buildDots();
    });

    buildDots();

    // Auto-play
    let autoPlay = setInterval(() => {
      if (current >= maxIndex) goTo(0);
      else goTo(current + 1);
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        if (current >= maxIndex) goTo(0);
        else goTo(current + 1);
      }, 5000);
    });
  }

  // ─── FAQ ACCORDION ───────────────────────────
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  // ─── VIDEO TESTIMONY ─────────────────────────
  const vtPlayBtn = document.getElementById('vtPlayBtn');
  const testimonyVideo = document.getElementById('testimonyVideo');

  if (vtPlayBtn && testimonyVideo) {
    vtPlayBtn.addEventListener('click', () => {
      const wrap = testimonyVideo.closest('.vt-video-wrap');
      wrap.classList.add('playing');
      testimonyVideo.play();
    });

    testimonyVideo.addEventListener('pause', () => {
      const wrap = testimonyVideo.closest('.vt-video-wrap');
      wrap.classList.remove('playing');
    });
    testimonyVideo.addEventListener('ended', () => {
      const wrap = testimonyVideo.closest('.vt-video-wrap');
      wrap.classList.remove('playing');
    });
  }

  // ─── SMOOTH SCROLL for anchor links ──────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10);
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── ACTIVE NAV LINK HIGHLIGHT ───────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const isScrolled = navbar.classList.contains('scrolled');
          navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              // Only highlight white on dark hero; use brand red on light navbar
              link.style.color = isScrolled ? '#BE1414' : 'white';
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

  // ─── PARALLAX on hero orbs (subtle) ──────────
  window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.hero-orb');
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 12;
      orb.style.transform = `translate(${cx * strength}px, ${cy * strength}px)`;
    });
  });

})();