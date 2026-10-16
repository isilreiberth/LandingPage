/**
 * Pack Cake Toppers Profesionales - JavaScript de Alta Conversión
 * Soporta Modo Oscuro/Claro, Scroll Reveal, Contador Realista,
 * Toast de Compras en Vivo, Filtros de Galería, FAQ Accordion y VSL Loader
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. MODO CLARO / OSCURO CON PERSISTENCIA
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');

  const savedTheme = localStorage.getItem('topper_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIconSun && themeIconMoon) {
        themeIconSun.style.display = 'block';
        themeIconMoon.style.display = 'none';
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIconSun && themeIconMoon) {
        themeIconSun.style.display = 'none';
        themeIconMoon.style.display = 'block';
      }
    }
    localStorage.setItem('topper_theme', theme);
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // 2. CONTADOR DE URGENCIA SINCRONIZADO
  function initCountdown() {
    const timerEls = document.querySelectorAll('.urgency-timer-display');
    const TOTAL_SECONDS = 14 * 60 + 59; // 14 min 59 seg
    let storedTime = sessionStorage.getItem('topper_timer_remaining');
    let remaining = storedTime ? parseInt(storedTime, 10) : TOTAL_SECONDS;

    function updateDisplay() {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      timerEls.forEach(el => el.textContent = formatted);
    }

    updateDisplay();

    setInterval(() => {
      if (remaining > 0) {
        remaining--;
        sessionStorage.setItem('topper_timer_remaining', remaining);
      } else {
        remaining = TOTAL_SECONDS; // reinicia sutilmente para evitar timer en cero
      }
      updateDisplay();
    }, 1000);
  }
  initCountdown();

  // 3. NOTIFICACIONES DE COMPRA EN VIVO (TOAST SOCIAL PROOF)
  const toastEl = document.getElementById('live-sales-toast');
  const toastText = document.getElementById('toast-text');
  const toastTime = document.getElementById('toast-time');

  const buyers = [
    { name: 'María Gómez', city: 'Bogotá, Colombia', time: 'hace 2 minutos' },
    { name: 'Camila Rojas', city: 'Santiago, Chile', time: 'hace 1 minuto' },
    { name: 'Valeria Mendoza', city: 'Lima, Perú', time: 'hace 4 minutos' },
    { name: 'Sofía Fernández', city: 'CDMX, México', time: 'hace 30 segundos' },
    { name: 'Daniela Salazar', city: 'Buenos Aires, Argentina', time: 'hace 3 minutos' },
    { name: 'Andrea Morales', city: 'Guayaquil, Ecuador', time: 'hace 5 minutos' },
    { name: 'Fernanda Ortiz', city: 'Madrid, España', time: 'hace 1 minuto' },
    { name: 'Paola Castro', city: 'Guatemala', time: 'hace 2 minutos' }
  ];

  function showRandomPurchase() {
    if (!toastEl) return;
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];
    if (toastText) {
      toastText.innerHTML = `<strong>${buyer.name}</strong> (${buyer.city}) adquirió el <em>Pack +1.000 Toppers</em>`;
    }
    if (toastTime) {
      toastTime.textContent = buyer.time;
    }
    toastEl.classList.add('show');

    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 5000);
  }

  // Primera notificación a los 60 seg (1 min), luego cada 40-50 seg
  setTimeout(() => {
    showRandomPurchase();
    setInterval(showRandomPurchase, Math.random() * 10000 + 40000);
  }, 60000);

  // 4. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 5. CONTADORES NUMÉRICOS ANIMADOS (ESTADÍSTICAS)
  const counterElements = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  function startCounters() {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = target % 1 !== 0;
      let current = 0;
      const duration = 2000;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
      }, stepTime);
    });
  }

  const statsSection = document.getElementById('autoridad');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        startCounters();
      }
    }, { threshold: 0.25 });
    statsObserver.observe(statsSection);
  } else {
    startCounters();
  }

  // 6. FAQ ACCORDION INTERACTIVO
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-header-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 7. GALERÍA FILTRABLE DE DEMOSTRACIÓN
  const tabButtons = document.querySelectorAll('.demo-tab-btn');
  const galleryItems = document.querySelectorAll('.demo-gallery-item');

  // Inicializar estado según pestaña activa
  const activeTab = document.querySelector('.demo-tab-btn.active');
  const initialFilter = activeTab ? activeTab.getAttribute('data-filter') : 'todas';
  galleryItems.forEach(item => {
    if (initialFilter === 'all' || item.getAttribute('data-category') === initialFilter) {
      item.style.display = 'block';
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
    } else {
      item.style.display = 'none';
      item.style.opacity = '0';
      item.style.transform = 'scale(0.95)';
    }
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 40);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            const currentActive = document.querySelector('.demo-tab-btn.active');
            if (currentActive && currentActive.getAttribute('data-filter') !== itemCat) {
              item.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });

  // LIGHTBOX PARA AMPLIAR IMÁGENES
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxOverlay = document.querySelector('.lightbox-overlay');

  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxCaption.textContent = img.alt || '';
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 8. VSL VIDEO SALES LETTER CONVERTEAI / VTURB
  const vslFallback = document.getElementById('vsl-fallback-poster');
  const vslContainer = document.getElementById('vsl-player-container');

  function loadVturbScript() {
    if (document.querySelector('script[src*="converteai.net"]')) return;
    const s = document.createElement('script');
    s.src = 'https://scripts.converteai.net/bbe4fe32-a92d-4b3d-8ab5-e54e98100dff/players/69c984376983e3eba6dac87b/v4/player.js';
    s.async = true;
    document.head.appendChild(s);
  }

  if (vslFallback && vslContainer) {
    vslFallback.addEventListener('click', () => {
      vslFallback.style.opacity = '0';
      setTimeout(() => { vslFallback.style.display = 'none'; }, 300);
      loadVturbScript();
    });
    // Precarga el script tras un delay de inactividad para máxima velocidad de renderizado inicial
    setTimeout(loadVturbScript, 3500);
  }

  // 9. BARRA FLOTANTE MÓVIL
  const mobileBar = document.getElementById('mobile-sticky-bar');
  const heroSection = document.getElementById('hero');
  if (mobileBar && heroSection) {
    window.addEventListener('scroll', () => {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      mobileBar.classList.toggle('show', heroBottom < 0);
    }, { passive: true });
  }

  // 10. CARRUSEL INFINITO DE TESTIMONIOS (loop sin salto: 1→2→3→4→5→1→2→...)
  function initTestimonialsCarousel() {
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('testimonials-dots');
    if (!track || !dotsContainer) return;

    // Cards originales (antes de clonar)
    const originalCards = Array.from(track.querySelectorAll('.testimonial-chat-card'));
    if (!originalCards.length) return;

    const TOTAL = originalCards.length; // 5 cards reales
    let logicalIndex = 0;    // índice lógico (0 a TOTAL-1) para los dots
    let absoluteIndex = 0;   // posición absoluta en el track extendido
    let autoTimer = null;
    let isHovered = false;
    let isTransitioning = false;

    /* ── helpers ─────────────────────────────────────────── */
    function getGap() {
      return parseFloat(getComputedStyle(track).gap) || 24;
    }

    function getCardWidth() {
      const allCards = track.querySelectorAll('.testimonial-chat-card');
      return allCards[TOTAL] ? allCards[TOTAL].getBoundingClientRect().width : 0;
    }

    /* ── clonación ────────────────────────────────────────
       Track final: [TOTAL clones prefix][TOTAL cards reales][TOTAL clones suffix]
       absoluteIndex=TOTAL → primer card real visible
    ───────────────────────────────────────────────────── */
    function buildTrack() {
      track.querySelectorAll('.is-clone').forEach(c => c.remove());

      const prefixFrag = document.createDocumentFragment();
      const suffixFrag = document.createDocumentFragment();

      originalCards.forEach(card => {
        const pre = card.cloneNode(true);
        const suf = card.cloneNode(true);
        pre.classList.add('is-clone');
        suf.classList.add('is-clone');
        prefixFrag.appendChild(pre);
        suffixFrag.appendChild(suf);
      });

      track.insertBefore(prefixFrag, originalCards[0]);
      track.appendChild(suffixFrag);
    }

    /* ── movimiento ─────────────────────────────────────── */
    function moveTo(absIdx, animated) {
      absoluteIndex = absIdx;
      const step = getCardWidth() + getGap();
      track.style.transition = animated
        ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        : 'none';
      track.style.transform = `translateX(-${absIdx * step}px)`;
    }

    function resetPosition() {
      absoluteIndex = TOTAL + logicalIndex;
      moveTo(absoluteIndex, false);
    }

    /* ── loop infinito: reset silencioso tras transición ── */
    track.addEventListener('transitionend', () => {
      isTransitioning = false;

      // Pasamos al bloque de clones-suffix → salto al inicio del bloque real
      if (absoluteIndex >= TOTAL * 2) {
        absoluteIndex -= TOTAL;
        moveTo(absoluteIndex, false);
      }
      // Retrocedimos al bloque de clones-prefix → salto al final del bloque real
      if (absoluteIndex < TOTAL) {
        absoluteIndex += TOTAL;
        moveTo(absoluteIndex, false);
      }
    });

    /* ── avanzar / retroceder ────────────────────────────── */
    function advance(direction) {
      if (isTransitioning) return;
      isTransitioning = true;

      absoluteIndex += direction;
      logicalIndex = ((absoluteIndex - TOTAL) % TOTAL + TOTAL) % TOTAL;

      moveTo(absoluteIndex, true);
      updateDots();
    }

    /* ── dots ───────────────────────────────────────────── */
    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < TOTAL; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonials-dot' + (i === logicalIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
        dot.addEventListener('click', () => {
          const delta = i - logicalIndex;
          if (delta !== 0) advance(delta);
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.testimonials-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === logicalIndex));
    }

    /* ── autoplay ───────────────────────────────────────── */
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => {
        if (!isHovered) advance(1);
      }, 3500);
    }

    function stopAuto() {
      clearInterval(autoTimer);
    }

    /* ── hover pause ────────────────────────────────────── */
    const container = document.getElementById('testimonials-carousel');
    if (container) {
      container.addEventListener('mouseenter', () => { isHovered = true; });
      container.addEventListener('mouseleave', () => { isHovered = false; });
    }

    /* ── swipe táctil ───────────────────────────────────── */
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) {
        advance(dx > 0 ? 1 : -1);
        startAuto();
      }
    }, { passive: true });

    /* ── resize ─────────────────────────────────────────── */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        logicalIndex = 0;
        buildTrack();
        buildDots();
        resetPosition();
      }, 200);
    });

    /* ── inicialización ─────────────────────────────────── */
    buildTrack();
    buildDots();
    resetPosition();
    startAuto();
  }

  initTestimonialsCarousel();
});