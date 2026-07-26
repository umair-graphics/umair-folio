/* ==========================================================================
   UMAIR FOLIO - PREMIUM GSAP ANIMATIONS (Jayden-Style)
   script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================================
     GSAP SETUP
     ======================================================================== */
  gsap.registerPlugin(ScrollTrigger);

  /* ========================================================================
     1. PAGE LOADER
     ======================================================================== */
  const loader     = document.getElementById('page-loader');
  const loaderLogo = document.getElementById('loader-logo');
  const loaderBar  = document.getElementById('loader-bar');

  const loaderTL = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          // Kick off hero animations once loader hides
          heroEntranceTL.play();
        }
      });
    }
  });

  loaderTL
    .to(loaderLogo, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    .to(loaderBar,  { width: '100%', duration: 1.2, ease: 'power2.inOut' }, '+=0.1')
    .to(loaderLogo, { opacity: 0,  y: -20, duration: 0.4, ease: 'power2.in' }, '+=0.2');

  /* ========================================================================
     2. HERO ENTRANCE - Word Split Animation (TreeWalker safe — preserves inner HTML spans)
     ======================================================================== */
  function splitWords(el) {
    if (!el) return [];
    const allWords = [];

    // Walk only TEXT nodes so we never break <span class="..."> tags
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(textNode => {
      const parts = textNode.textContent.split(/(\s+)/);
      const frag  = document.createDocumentFragment();
      parts.forEach(part => {
        if (part.trim()) {
          const wrap  = document.createElement('span');
          wrap.className = 'split-line-wrap';
          const inner = document.createElement('span');
          inner.className = 'split-word';
          inner.textContent = part;
          wrap.appendChild(inner);
          frag.appendChild(wrap);
          allWords.push(inner);
        } else if (part) {
          frag.appendChild(document.createTextNode(part));
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });

    return allWords;
  }

  const greetingEl = document.getElementById('hero-greeting');
  const titleEl    = document.getElementById('hero-title');
  const taglineEl  = document.getElementById('hero-tagline');
  const photoWrap  = document.querySelector('.hero-photo-wrapper');
  const signatureEl = document.querySelector('.signature-animated');
  const footerBar  = document.querySelector('.hero-footer-bar');

  const greetWords = splitWords(greetingEl);
  const titleWords  = splitWords(titleEl);

  // Initial state (hidden)
  gsap.set([greetWords, titleWords], { y: '110%', opacity: 0 });
  gsap.set(taglineEl,  { opacity: 0, y: 30 });
  gsap.set(photoWrap,  { opacity: 0, scale: 0.92, y: 40 });
  gsap.set(signatureEl,{ opacity: 0, y: 30 });
  gsap.set(footerBar,  { opacity: 0, y: 20 });

  const heroEntranceTL = gsap.timeline({ paused: true });

  heroEntranceTL
    .to(photoWrap, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' })
    .to(greetWords, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.07,
      ease: 'power3.out'
    }, '-=0.6')
    .to(titleWords, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.07,
      ease: 'power3.out'
    }, '-=0.5')
    .to(taglineEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
    .to(signatureEl, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.5')
    .to(footerBar, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3');

  /* ========================================================================
     3. CURSOR GLOW FOLLOWER
     ======================================================================== */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.55,
        ease: 'power2.out'
      });
    });
  }

  /* ========================================================================
     4. SCROLL REVEAL - Staggered GSAP ScrollTrigger
     ======================================================================== */
  const revealSections = document.querySelectorAll('.reveal-on-scroll');

  revealSections.forEach((section) => {
    // Animate the section itself
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start:   'top 82%',
        toggleActions: 'play none none none'
      }
    });

    // Section header split
    const sectionTitle = section.querySelector('.section-title');
    if (sectionTitle) {
      const words = splitWords(sectionTitle);
      gsap.set(words, { y: '100%', opacity: 0 });
      gsap.to(words, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionTitle,
          start:   'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }

    const sectionNum = section.querySelector('.section-number');
    if (sectionNum) {
      gsap.from(sectionNum, {
        opacity: 0,
        x: -20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionNum,
          start:   'top 90%',
          toggleActions: 'play none none none'
        }
      });
    }
  });

  /* ========================================================================
     5. STAGGER GRID CARDS (Services, Work)
     ======================================================================== */
  const staggerGroups = [
    '.services-grid',
    '.work-grid',
    '.stats-grid'
  ];

  staggerGroups.forEach(selector => {
    const container = document.querySelector(selector);
    if (!container) return;
    const children = container.children;

    gsap.set(children, { opacity: 0, y: 50 });

    gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start:   'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* ========================================================================
     5b. CUSTOMER VOICES - AVATAR DRIVEN TESTIMONIAL SLIDER
     ======================================================================== */
  const voiceReviewsData = [
    {
      name: 'Alnoor Group',
      role: 'PRINTING & BRAND MANAGEMENT',
      text: '"Muhammad Umair has been handling our design and printing work professionally for years. His designs are always creative, visually striking, and tailored to our exact brand guidelines. We highly recommend his top-notch printing and design solutions."'
    },
    {
      name: 'The Smart School',
      role: 'VEHARI CAMPUS ADMINISTRATION',
      text: '"Umair is exceptionally reliable and creative in managing our campus IT infrastructure, academic documentation, and social media content. His dedication and technical expertise have greatly streamlined our school\'s digital operations."'
    },
    {
      name: 'Nine Photo Studio',
      role: 'CREATIVE MEDIA DIRECTOR',
      text: '"His social media graphics, promotional flyers, and visual branding have really helped us present our creative work in a much better way. Great eye for detail, fast turnaround times, and outstanding artistic output."'
    },
    {
      name: 'Synergy Creativity',
      role: 'DUBAI, UAE — OPERATIONS TEAM',
      text: '"Umair is a remarkably talented designer and a great team player. His leadership skills, strategic design vision, and ability to manage cross-border projects efficiently made working with him a fantastic experience."'
    },
    {
      name: 'Business Client',
      role: 'BUSINESS OWNER',
      text: '"We have collaborated with Umair on multiple corporate branding and marketing projects, and the quality has consistently been excellent. He is cooperative, creative, and extremely easy to work with."'
    },
    {
      name: 'Restaurant Client',
      role: 'RESTAURANT MANAGEMENT',
      text: '"Umair understood our visual identity requirements quickly and created stunning promotional menu and banner designs that matched our business perfectly. We are extremely happy with his work."'
    },
    {
      name: 'School Administration',
      role: 'SCHOOL ADMINISTRATION',
      text: '"His designs are always clean, professional, and visually attractive for parents and students alike. He understands institutional requirements thoroughly and consistently delivers high-quality work right on schedule."'
    },
    {
      name: 'International Freelance Client',
      role: 'INTERNATIONAL CLIENT',
      text: '"It was an absolute pleasure working with Umair on Upwork and Fiverr. He understood my project concepts immediately and turned them into a sleek, professional final design. Truly exceptional service!"'
    }
  ];

  const avatarThumbs = document.querySelectorAll('.avatar-thumb');
  const clientNameEl = document.getElementById('voice-client-name');
  const clientRoleEl = document.getElementById('voice-client-role');
  const reviewTextEl = document.getElementById('voice-review-text');
  const contentBoxEl = document.getElementById('voice-content-box');
  const voicePrevBtn = document.getElementById('voice-prev');
  const voiceNextBtn = document.getElementById('voice-next');
  const voiceDotsEl  = document.getElementById('voice-dots');
  const voiceWrapper = document.getElementById('customer-voices');

  if (avatarThumbs.length > 0 && clientNameEl) {
    let currentVoiceIdx = 0;
    let isTransitioning = false;
    const totalVoices = voiceReviewsData.length;

    // Generate Dots
    voiceReviewsData.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'voice-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => switchVoice(i));
      if (voiceDotsEl) voiceDotsEl.appendChild(dot);
    });

    // Dissolve Transition Function (Only triggers on user interaction)
    function switchVoice(index) {
      if (index === currentVoiceIdx || isTransitioning) return;
      isTransitioning = true;
      currentVoiceIdx = index;

      // Update Avatars Active State (Double Ring + Staggered height)
      avatarThumbs.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentVoiceIdx);
      });

      // Update Dots Active State
      if (voiceDotsEl) {
        voiceDotsEl.querySelectorAll('.voice-dot').forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentVoiceIdx);
        });
      }

      // Smooth Dissolve (Crossfade) Animation for Review Content
      const data = voiceReviewsData[currentVoiceIdx];
      gsap.to(contentBoxEl, {
        opacity: 0,
        scale: 0.98,
        duration: 0.22,
        ease: 'power2.inOut',
        onComplete: () => {
          if (clientNameEl) clientNameEl.textContent = data.name;
          if (clientRoleEl) clientRoleEl.textContent = data.role;
          if (reviewTextEl) reviewTextEl.textContent = data.text;

          gsap.to(contentBoxEl, {
            opacity: 1,
            scale: 1,
            duration: 0.38,
            ease: 'power2.inOut',
            onComplete: () => {
              isTransitioning = false;
            }
          });
        }
      });
    }

    function nextVoice() {
      const nextIdx = (currentVoiceIdx + 1) % totalVoices;
      switchVoice(nextIdx);
    }

    function prevVoice() {
      const prevIdx = (currentVoiceIdx - 1 + totalVoices) % totalVoices;
      switchVoice(prevIdx);
    }

    // Avatar Thumbnail Click
    avatarThumbs.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => switchVoice(idx));
    });

    // Arrow Buttons Click
    if (voiceNextBtn) voiceNextBtn.addEventListener('click', nextVoice);
    if (voicePrevBtn) voicePrevBtn.addEventListener('click', prevVoice);

    // Mouse Drag / Touch Swipe on Voice Box (Manual sliding only, NO auto-timer)
    let startX = 0;
    let isDragging = false;
    const cardBox = document.querySelector('.voice-card-container');

    if (voiceWrapper) {
      voiceWrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        if (cardBox) cardBox.classList.add('is-dragging');
      });

      document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        if (cardBox) cardBox.classList.remove('is-dragging');
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 35) {
          if (dx < 0) nextVoice();
          else prevVoice();
        }
      });

      voiceWrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
          isDragging = false;
          if (cardBox) cardBox.classList.remove('is-dragging');
        }
      });

      voiceWrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      voiceWrapper.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 35) {
          if (dx < 0) nextVoice();
          else prevVoice();
        }
      }, { passive: true });
    }
  }





  /* ========================================================================
     6. EXPERIENCE TIMELINE - Slide In Left/Right Alternating
     ======================================================================== */
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, i) => {
    const dir = i % 2 === 0 ? -60 : 60;
    gsap.from(item, {
      opacity: 0,
      x: dir,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start:   'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* ========================================================================
     7. PARALLAX HERO PHOTO ON SCROLL
     ======================================================================== */
  if (photoWrap) {
    gsap.to(photoWrap, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end:   'bottom top',
        scrub: 1.5
      }
    });
  }

  /* ========================================================================
     8. MOUSE PARALLAX ON HERO ELEMENTS
     ======================================================================== */
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    if (photoWrap) {
      gsap.to(photoWrap, {
        x: dx * 12,
        y: dy * 8,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  });

  /* ========================================================================
     9. MAGNETIC BUTTONS (Social Icons & CTAs)
     ======================================================================== */
  document.querySelectorAll('.social-icon, .cta-btn, .filter-btn').forEach(btn => {
    btn.classList.add('magnetic-btn');

    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.35;
      const dy     = (e.clientY - cy) * 0.35;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' });
    });
  });

  /* ========================================================================
     10. LIGHT / DARK MODE TOGGLE
     ======================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon      = document.getElementById('theme-icon');

  // Load saved theme — dark mode shows sun (to switch to light), light mode shows moon
  const savedTheme = localStorage.getItem('umair_folio_theme') || 'dark-mode';
  if (savedTheme === 'light-mode') {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  } else {
    // dark mode: show sun
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      document.body.classList.toggle('dark-mode', !isDark);
      document.body.classList.toggle('light-mode',  isDark);

      if (themeIcon) {
        // Switching to light → show moon | Switching to dark → show sun
        if (isDark) {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
        } else {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        }
      }
      localStorage.setItem('umair_folio_theme', isDark ? 'light-mode' : 'dark-mode');

      gsap.fromTo(themeToggleBtn,
        { scale: 0.8, rotate: -30 },
        { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1.5, 0.4)' }
      );
    });
  }


  /* ========================================================================
     11. LIVE VEHARI PAKISTAN CLOCK (PKT / UTC+5)
     ======================================================================== */
  const liveClockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!liveClockEl) return;
    try {
      liveClockEl.textContent = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).format(new Date());
    } catch(e) {
      liveClockEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ========================================================================
     12. FLOATING DOCK SCROLLSPY
     ======================================================================== */
  const sections  = document.querySelectorAll('section.section');
  const dockItems = document.querySelectorAll('.dock-item');

  function updateActiveDock() {
    let current = 'home';
    const pos   = window.scrollY + 220;
    sections.forEach(sec => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        current = sec.id;
      }
    });
    dockItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-section') === current);
    });
  }
  window.addEventListener('scroll', updateActiveDock);
  updateActiveDock();

  /* ========================================================================
     13. PORTFOLIO CATEGORY FILTER
     ======================================================================== */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cats = card.getAttribute('data-category') || '';
        const show = val === 'all' || cats.includes(val);
        if (show) {
          card.style.display = 'block';
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' });
        } else {
          gsap.to(card, {
            opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.in',
            onComplete: () => { card.style.display = 'none'; }
          });
        }
      });
    });
  });

  /* ========================================================================
     14. LIGHTBOX MODAL
     ======================================================================== */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn= document.getElementById('modal-close');
  const modalImg     = document.getElementById('modal-img');
  const modalTitle   = document.getElementById('modal-title');
  const modalDesc    = document.getElementById('modal-desc');

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (modalImg)   modalImg.src             = btn.getAttribute('data-img');
      if (modalTitle) modalTitle.textContent   = btn.getAttribute('data-title');
      if (modalDesc)  modalDesc.textContent    = btn.getAttribute('data-desc');
      if (projectModal) {
        projectModal.classList.add('active');
        gsap.from('.modal-content', { opacity: 0, scale: 0.92, duration: 0.45, ease: 'back.out(1.4)' });
      }
    });
  });

  function closeModal() {
    if (projectModal) {
      gsap.to('.modal-content', {
        opacity: 0, scale: 0.92, duration: 0.3, ease: 'power2.in',
        onComplete: () => projectModal.classList.remove('active')
      });
    }
  }
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (projectModal)  projectModal.addEventListener('click', e => { if (e.target === projectModal) closeModal(); });
  window.closeModal = closeModal;

  /* ========================================================================
     15. STATS COUNTER ANIMATION
     ======================================================================== */
  const counters = document.querySelectorAll('.counter');
  let counted = false;

  function runCounters() {
    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection || counted) return;
    const pos = statsSection.getBoundingClientRect().top;
    if (pos < window.innerHeight) {
      counted = true;
      counters.forEach(counter => {
        const target    = +counter.getAttribute('data-target');
        const duration  = 1500;
        const increment = target / (duration / 16);
        let current     = 0;
        const tick = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(tick);
          } else {
            counter.textContent = target;
          }
        };
        tick();
      });
    }
  }
  window.addEventListener('scroll', runCounters);
  runCounters();

  /* ========================================================================
     16. DOWNLOAD CV BUTTON
     ======================================================================== */
  const downloadCvBtn = document.getElementById('download-cv-btn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast("Downloading Muhammad Umair's CV...");
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Muhammad Umair - Graphic Designer & IT Expert CV');
        a.download = 'Muhammad_Umair_CV.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 800);
    });
  }

  /* ========================================================================
     17. CONTACT FORM + TOAST
     ======================================================================== */
  const contactForm = document.getElementById('contact-form');
  const toast       = document.getElementById('toast');
  const toastMsg    = document.getElementById('toast-message');

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sendBtn = document.getElementById('send-btn');
      if (sendBtn) sendBtn.textContent = 'Sending...';
      setTimeout(() => {
        if (sendBtn) sendBtn.textContent = 'Send Message';
        showToast('Thank you! Your message has been sent to Muhammad Umair.');
        contactForm.reset();
      }, 1000);
    });
  }

  /* ========================================================================
     18. PARALLAX AMBIENT GLOW ON SCROLL
     ======================================================================== */
  const glowTop    = document.getElementById('glow-top');
  const glowBottom = document.getElementById('glow-bottom');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (glowTop)    glowTop.style.transform    = `translateX(-50%) translateY(${sy * 0.25}px)`;
    if (glowBottom) glowBottom.style.transform = `translateY(${-sy * 0.15}px)`;
  });

  /* ========================================================================
     19. SECTION TITLE UNDERLINE DRAW ANIMATION
     ======================================================================== */
  document.querySelectorAll('.section-title').forEach(title => {
    title.style.position = 'relative';
    title.style.display  = 'inline-block';
  });

}); // end DOMContentLoaded

/* ==========================================================================
   3D POLYHEDRON / HEXAGON CANVAS (Photo 2 Wireframe Style) — Auto-Rotate + Mouse Tracking
   ========================================================================== */
(function initHexCanvases() {

  function createPolyhedronRenderer(canvasId, sizePx, strokeColorStr) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const heroSection = document.getElementById('home');

    const DPR = window.devicePixelRatio || 1;
    canvas.width  = sizePx * DPR;
    canvas.height = sizePx * DPR;

    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);

    const cx = sizePx / 2;
    const cy = sizePx / 2;
    const R  = sizePx * 0.38; // Radius

    // Build 3D Dodecahedron Geometry (Golden Ratio)
    const phi = (1 + Math.sqrt(5)) / 2;
    const invPhi = 1 / phi;

    const rawVerts = [
      // 8 cube vertices (±1, ±1, ±1)
      [-1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [-1,  1, -1],
      [-1, -1,  1], [ 1, -1,  1], [ 1,  1,  1], [-1,  1,  1],
      // 4 rect X vertices (0, ±1/phi, ±phi)
      [0, -invPhi, -phi], [0,  invPhi, -phi], [0,  invPhi,  phi], [0, -invPhi,  phi],
      // 4 rect Y vertices (±1/phi, ±phi, 0)
      [-invPhi, -phi, 0], [ invPhi, -phi, 0], [ invPhi,  phi, 0], [-invPhi,  phi, 0],
      // 4 rect Z vertices (±phi, 0, ±1/phi)
      [-phi, 0, -invPhi], [ phi, 0, -invPhi], [ phi, 0,  invPhi], [-phi, 0,  invPhi]
    ].map(v => {
      const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
      return { x: (v[0]/len)*R, y: (v[1]/len)*R, z: (v[2]/len)*R };
    });

    // Build Edges based on vertex distance
    const edges = [];
    const distThreshold = R * 0.76;
    for (let i = 0; i < rawVerts.length; i++) {
      for (let j = i + 1; j < rawVerts.length; j++) {
        const dx = rawVerts[i].x - rawVerts[j].x;
        const dy = rawVerts[i].y - rawVerts[j].y;
        const dz = rawVerts[i].z - rawVerts[j].z;
        const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d < distThreshold) {
          edges.push([i, j]);
        }
      }
    }

    // Rotation state
    let rotX = 0.35;
    let rotY = 0.25;
    let targetRotX = 0.35;
    let targetRotY = 0.25;
    let isMouseInside = false;

    function rotatePoint(p, rx, ry) {
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.x * sinY + p.z * cosY;
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      let y1 = p.y * cosX - z1 * sinX;
      let z2 = p.y * sinX + z1 * cosX;
      return { x: x1, y: y1, z: z2 };
    }

    const FOCAL = sizePx * 2.5;
    function project(p) {
      const scale = FOCAL / (FOCAL + p.z);
      return { x: cx + p.x * scale, y: cy + p.y * scale, z: p.z };
    }

    function draw(rx, ry) {
      ctx.clearRect(0, 0, sizePx, sizePx);

      // Rotate & Project all vertices
      const rotated = rawVerts.map(p => rotatePoint(p, rx, ry));
      const projected = rotated.map(project);

      // Draw Edges with depth fading (wireframe)
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.z + p2.z) / 2;

        // Depth alpha calculation: front edges brighter white/grey, back edges dimmer
        const alpha = Math.min(0.45, Math.max(0.06, (avgZ + R) / (R * 2) * 0.38 + 0.08));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = strokeColorStr.replace('ALPHA', alpha.toFixed(2));
        ctx.lineWidth = avgZ > 0 ? 1.3 : 0.8;
        ctx.stroke();
      });

      // Draw subtle vertex dots
      projected.forEach(p => {
        if (p.z > 0) {
          const dotAlpha = ((p.z + R) / (R * 2)) * 0.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = strokeColorStr.replace('ALPHA', dotAlpha.toFixed(2));
          ctx.fill();
        }
      });
    }

    let lastTime = 0;
    function animate(ts) {
      requestAnimationFrame(animate);

      if (isMouseInside) {
        rotX += (targetRotX - rotX) * 0.06;
        rotY += (targetRotY - rotY) * 0.06;
      } else {
        rotX += 0.0025;
        rotY += 0.004;
      }

      draw(rotX, rotY);
    }

    requestAnimationFrame(animate);

    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width;
        const my = (e.clientY - rect.top)  / rect.height;
        targetRotX = 0.35 + (my - 0.5) * 1.4;
        targetRotY = 0.25 + (mx - 0.5) * 1.8;
      });

      heroSection.addEventListener('mouseenter', () => { isMouseInside = true; });
      heroSection.addEventListener('mouseleave', () => { isMouseInside = false; });
    }

    window.addEventListener('resize', () => {
      canvas.width  = sizePx * DPR;
      canvas.height = sizePx * DPR;
      ctx.scale(DPR, DPR);
    });
  }

  // Grey/White Wireframe Color string matching Photo 2: rgba(220, 220, 220, ALPHA)
  const greyWireframe = 'rgba(220, 220, 220, ALPHA)';

  // Large polyhedron canvas: 500px, top-right corner
  createPolyhedronRenderer('hex-canvas-large', 500, greyWireframe);

  // Small polyhedron canvas: 300px (60% scale), bottom-left near Scroll Down
  createPolyhedronRenderer('hex-canvas-small', 300, 'rgba(180, 180, 180, ALPHA)');

})();
