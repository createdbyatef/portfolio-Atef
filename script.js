/* ============================================
   WAN ATEF — PORTFOLIO MOTION SYSTEM v3
   Custom cursor · Loader · Reveal · Tilt
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(max-width: 1024px), (hover: none), (pointer: coarse)').matches;

  /* ───── Custom Cursor ───── */
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  if (dot && ring) {
    if (isTouch) {
      dot.remove();
      ring.remove();
    } else if (!noMotion) {
      let mx = -100, my = -100, rx = -100, ry = -100;
      document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
      }, { passive: true });
      (function ringLoop() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(ringLoop);
      })();
      $$('a, button, [role="button"], .project-card, .cert-card, .skill-cat, .filter-btn, .fyp-tab, .fyp-mobile, .browser-screen, .lightbox-close').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('expand'));
        el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
      });
    }
  }

  /* ───── Loader ───── */
  const loader = $('#loadingScreen');
  const loaderBar = $('#loaderBar');
  const loaderNum = $('#loaderNum');
  const loaderWordmark = $('#loaderWordmark');
  let pct = 0;

  if (loaderWordmark) {
    setTimeout(() => { loaderWordmark.style.transition = 'transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.9s'; loaderWordmark.style.transform = 'translateY(0)'; loaderWordmark.style.opacity = '1'; }, 200);
  }

  const loaderTick = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 22 + 6);
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderNum) loaderNum.textContent = Math.floor(pct);
    if (pct >= 100) {
      clearInterval(loaderTick);
      if (loaderNum) loaderNum.textContent = '100';
      setTimeout(() => {
        if (loader) {
          loader.style.transition = 'clip-path 0.9s cubic-bezier(0.87,0,0.13,1)';
          loader.style.clipPath = 'inset(0 0 100% 0)';
          setTimeout(() => { loader.classList.add('hidden'); loader.style.display = 'none'; }, 900);
        }
        // Trigger hero text
        $$('.line-inner').forEach((el, i) => { setTimeout(() => el.classList.add('in'), i * 120); });
      }, 320);
    }
  }, 100);

  setTimeout(() => {
    clearInterval(loaderTick);
    if (loader) { loader.style.display = 'none'; loader.classList.add('hidden'); }
    $$('.line-inner').forEach((el, i) => { setTimeout(() => el.classList.add('in'), i * 120); });
  }, 3500);

  /* ───── Nav ───── */
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');
  const navLinkItems = $$('.nav-link');
  const scrollProgress = $('#scrollProgress');
  const backToTop = $('#backToTop');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks && navLinks.classList.toggle('active');
    });
  }
  navLinkItems.forEach(l => l.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('active');
    navLinks && navLinks.classList.remove('active');
  }));

  /* ───── Reveal on scroll ───── */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !noMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ───── Counters ───── */
  const counters = $$('.stat-num');
  const runCounter = el => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const dur = 1600; const start = performance.now();
    const step = now => {
      const t = clamp((now - start) / dur, 0, 1);
      el.textContent = Math.round(target * easeOut(t)) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || ''));
  }

  /* ───── Skill fills ───── */
  const fills = $$('.skill-fill');
  if ('IntersectionObserver' in window) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.getAttribute('data-level') + '%';
          sio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach(f => sio.observe(f));
  } else {
    fills.forEach(f => f.style.width = f.getAttribute('data-level') + '%');
  }

  /* ───── Project filters ───── */
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !match);
        if (match) { card.classList.remove('filter-in'); void card.offsetWidth; card.classList.add('filter-in'); }
      });
    });
  });

  /* ───── Sliders ───── */
  $$('.project-slider').forEach(slider => {
    const images = $$('.slider-img', slider);
    const dots = $$('.slider-dots .dot', slider);
    const nextBtn = $('.next-btn', slider);
    const prevBtn = $('.prev-btn', slider);
    if (!images.length) return;
    let idx = 0;
    const show = i => {
      idx = (i + images.length) % images.length;
      images.forEach((img, n) => img.classList.toggle('active', n === idx));
      dots.forEach((d, n) => d.classList.toggle('active', n === idx));
    };
    nextBtn && nextBtn.addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
    prevBtn && prevBtn.addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
    dots.forEach((d, n) => d.addEventListener('click', e => { e.stopPropagation(); show(n); }));
  });

  /* ───── Featured Project Interactive Showcase ───── */
  const fypStage = $('#fypStage');
  const fypBrowser = $('#fypBrowser');
  const fypMobile = $('#fypMobile');
  const desktopImg = $('#desktopImg');
  const mobileImg = $('#mobileImg');
  const browserUrl = $('#browserUrl');
  const mobilePill = $('#mobilePill');
  const fypTabs = $$('.fyp-tab');
  const browserZoomBtn = $('#browserZoomBtn');
  const browserScreen = $('#browserScreen');

  // Desktop Screen Tabs
  fypTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      fypTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const newSrc = tab.getAttribute('data-img');
      const newUrl = tab.getAttribute('data-url');
      if (desktopImg && newSrc) {
        desktopImg.style.opacity = '0';
        desktopImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
          desktopImg.src = newSrc;
          desktopImg.style.opacity = '1';
          desktopImg.style.transform = 'scale(1)';
        }, 180);
      }
      if (browserUrl && newUrl) {
        browserUrl.textContent = newUrl;
      }
    });
  });

  // Mobile Screen Switching (Cycle on tap)
  const mobileScreens = [
    { src: 'assets/fyp5.png', label: 'QR Order (1/3)' },
    { src: 'assets/fyp4.png', label: 'Menu Catalog (2/3)' },
    { src: 'assets/fyp6.png', label: 'Checkout Cart (3/3)' }
  ];
  let mobileIdx = 0;
  if (fypMobile && mobileImg) {
    fypMobile.addEventListener('click', e => {
      e.stopPropagation();
      mobileIdx = (mobileIdx + 1) % mobileScreens.length;
      mobileImg.style.opacity = '0';
      mobileImg.style.transform = 'translateY(6px) scale(0.95)';
      setTimeout(() => {
        mobileImg.src = mobileScreens[mobileIdx].src;
        if (mobilePill) {
          const span = mobilePill.querySelector('span');
          if (span) span.textContent = mobileScreens[mobileIdx].label;
        }
        mobileImg.style.opacity = '1';
        mobileImg.style.transform = 'translateY(0) scale(1)';
      }, 160);
    });
  }

  // 3D Mouse Spatial Parallax on Stage
  if (fypStage && !noMotion && !isTouch) {
    let targetTiltX = 0, targetTiltY = 0;
    let currentTiltX = 0, currentTiltY = 0;

    fypStage.addEventListener('mousemove', e => {
      const rect = fypStage.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
      const yNorm = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = xNorm * 12;
      targetTiltX = -yNorm * 10;
    });

    fypStage.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
    });

    function tiltLoop() {
      currentTiltX += (targetTiltX - currentTiltX) * 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * 0.1;

      if (fypBrowser) {
        fypBrowser.style.transform = `perspective(1200px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg) translateZ(0)`;
      }
      if (fypMobile) {
        const mobX = (currentTiltY / 12) * 14;
        const mobY = (-currentTiltX / 10) * 14;
        fypMobile.style.transform = `perspective(1200px) rotateX(${currentTiltX * 1.3}deg) rotateY(${currentTiltY * 1.3}deg) translate3d(${mobX}px, ${mobY}px, 35px)`;
      }
      requestAnimationFrame(tiltLoop);
    }
    requestAnimationFrame(tiltLoop);
  }

  // Lightbox Modal Handling
  const lightboxModal = $('#lightboxModal');
  const lightboxBackdrop = $('#lightboxBackdrop');
  const lightboxClose = $('#lightboxClose');
  const lightboxImg = $('#lightboxImg');
  const lightboxTitle = $('#lightboxTitle');

  function openLightbox(src, title) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = title || 'Preview';
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (browserScreen) {
    browserScreen.addEventListener('click', () => {
      const activeTab = $('.fyp-tab.active');
      const title = activeTab ? activeTab.getAttribute('data-title') : 'Gula Ombre POS';
      if (desktopImg) openLightbox(desktopImg.src, title);
    });
  }

  if (browserZoomBtn) {
    browserZoomBtn.addEventListener('click', e => {
      e.stopPropagation();
      const activeTab = $('.fyp-tab.active');
      const title = activeTab ? activeTab.getAttribute('data-title') : 'Gula Ombre POS';
      if (desktopImg) openLightbox(desktopImg.src, title);
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ───── 3D Card Tilt ───── */
  if (!noMotion && !isTouch) {
    $$('.project-card:not(.featured-premium), .cert-card, .skill-cat').forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.perspective = '800px';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-5px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ───── Contact form ───── */
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const subject = $('#subject').value.trim();
      const message = $('#message').value.trim();
      const body = `${message}\n\n— ${name} (${email})`;
      window.location.href = `mailto:wanatef02@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* ───── Smooth scroll ───── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.offsetTop - (href === '#home' ? 0 : 68);
      window.scrollTo({ top, behavior: noMotion ? 'auto' : 'smooth' });
    });
  });

  /* ───── Scroll master ───── */
  const timeline = $('.timeline');
  let lastY = 0, ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || window.pageYOffset;
      const docH = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollProgress) scrollProgress.style.width = clamp(y / docH * 100, 0, 100) + '%';

      if (navbar) {
        navbar.classList.toggle('scrolled', y > 40);
        const goingDown = y > lastY && y > 300;
        navbar.classList.toggle('nav-hidden', goingDown && navLinks && !navLinks.classList.contains('active'));
      }

      if (backToTop) backToTop.classList.toggle('visible', y > 600);

      if (timeline) {
        const r = timeline.getBoundingClientRect();
        const seen = clamp((window.innerHeight * 0.5 - r.top) / r.height, 0, 1);
        timeline.style.setProperty('--tl-progress', (seen * 100) + '%');
      }

      const scrollPos = y + window.innerHeight * 0.35;
      let current = 'home';
      $$('section[id], header[id]').forEach(sec => { if (sec.offsetTop <= scrollPos) current = sec.id; });
      navLinkItems.forEach(l => l.classList.toggle('active', l.dataset.section === current));

      lastY = y; ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ───── Back to top ───── */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: noMotion ? 'auto' : 'smooth' });
    });
  }
});
