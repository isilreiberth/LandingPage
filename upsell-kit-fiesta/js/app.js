/**
 * UPSELL FUNNEL - KITS DE FIESTA
 * Scripts interactivos: Contador regresivo, Hotmart Sales Funnel, Tema Claro/Oscuro, Sticky Bar
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initThemeToggle();
  initHotmartSalesFunnel();
  initStickyBar();
  initDeclineHandler();
});

/* ==========================================================================
   1. CONTADOR REGRESIVO (9:59) SINCRONIZADO
   ========================================================================== */
function initCountdownTimer() {
  const topbarMinutes = document.getElementById('topbar-minutes');
  const topbarSeconds = document.getElementById('topbar-seconds');
  const bottomMinutes = document.getElementById('bottom-minutes');
  const bottomSeconds = document.getElementById('bottom-seconds');

  let totalSeconds = 9 * 60 + 59; // 9 minutos 59 segundos

  // Verificar si hay tiempo guardado en sessionStorage para consistencia
  const savedTime = sessionStorage.getItem('upsell_timer_remaining');
  if (savedTime && !isNaN(parseInt(savedTime, 10))) {
    totalSeconds = Math.max(10, parseInt(savedTime, 10));
  }

  function updateDisplay() {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    if (topbarMinutes) topbarMinutes.textContent = mStr;
    if (topbarSeconds) topbarSeconds.textContent = sStr;
    if (bottomMinutes) bottomMinutes.textContent = mStr;
    if (bottomSeconds) bottomSeconds.textContent = sStr;

    sessionStorage.setItem('upsell_timer_remaining', totalSeconds);

    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      // Al expirar, mantener en 00:00
      totalSeconds = 0;
    }
  }

  updateDisplay();
  setInterval(updateDisplay, 1000);
}

/* ==========================================================================
   2. TEMA CLARO / OSCURO (CON PERSISTENCIA)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const iconSun = document.getElementById('theme-icon-sun');
  const iconMoon = document.getElementById('theme-icon-moon');
  const htmlEl = document.documentElement;

  // Cargar preferencia existente o usar 'light' por defecto
  const savedTheme = localStorage.getItem('topperpro_theme') || 'light';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('topperpro_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      if (iconSun) iconSun.style.display = 'block';
      if (iconMoon) iconMoon.style.display = 'none';
    } else {
      if (iconSun) iconSun.style.display = 'none';
      if (iconMoon) iconMoon.style.display = 'block';
    }
  }
}

/* ==========================================================================
   3. INICIALIZACIÓN OFICIAL HOTMART SALES FUNNEL
   ========================================================================== */
function initHotmartSalesFunnel() {
  // El widget de Hotmart Sales Funnel se inicializa directamente desde index.html
}

/* ==========================================================================
   4. STICKY BAR VISIBLE AL HACER SCROLL
   ========================================================================== */
function initStickyBar() {
  const stickyBar = document.getElementById('sticky-upsell-bar');
  const offerSection = document.getElementById('oferta-upsell');

  if (!stickyBar || !offerSection) return;

  window.addEventListener('scroll', () => {
    const offerRect = offerSection.getBoundingClientRect();
    const scrollY = window.scrollY;

    // Mostrar barra flotante tras pasar 450px de scroll, y ocultar cuando la sección de oferta esté a la vista
    if (scrollY > 450 && offerRect.top > window.innerHeight) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  }, { passive: true });
}

/* ==========================================================================
   5. DECLINE LINK (CONFIRMACIÓN DE RECHAZO OPCIONAL)
   ========================================================================== */
function initDeclineHandler() {
  const declineBtn = document.getElementById('btn-decline-upsell');
  if (!declineBtn) return;

  declineBtn.addEventListener('click', (e) => {
    // Si el usuario hace clic en declinar oferta
    const confirmDecline = confirm(
      '⚠️ ¿Estás segura de rechazar esta oferta única?\n\n' +
      'Este Mega Pack de Kits de Fiesta tiene más del 80% de descuento y nunca volverá a costar $5.90 USD.\n\n' +
      'Haz clic en "Cancelar" para quedártelo, o "Aceptar" para continuar a tu compra sin el pack.'
    );

    if (!confirmDecline) {
      e.preventDefault();
      // Scroll suave a la oferta para que aproveche
      const offer = document.getElementById('oferta-upsell');
      if (offer) {
        offer.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si el widget de Hotmart tiene botón de declinar
      const hotmartDecline = document.querySelector('#hotmart-sales-funnel [data-hotmart-decline]');
      if (hotmartDecline) {
        e.preventDefault();
        hotmartDecline.click();
      }
    }
  });
}
