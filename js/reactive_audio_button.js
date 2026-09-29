/* ==========================================================================
   ANISH KARAN DESIGNS - KPR REACTIVE AUDIO EQUALIZER BUTTON & MUSIC CONTROLLER
   Exact replica of reference images:
   - Active state: Dynamic equalizer wave with thick center bar (4px)
   - Paused state: Uniform short vertical dash pattern with thick center bar
   - Placement: Fixed bottom-left (bottom: 48px, left: 32px)
   - Hover: Hand pointer cursor (cursor: pointer)
   ========================================================================== */

(function() {
  window.isKprAudioMuted = true; // Default muted until user interacts (browser autoplay policy)
  let animationInterval = null;

  // Paused height scale pattern matching reference image 2 (media_1789939166519.png)
  const PAUSED_BAR_HEIGHTS = [0.30, 0.30, 0.30, 0.30, 0.30];

  // Global persistent background music audio instance
  if (!window.kprAudioTrack) {
    window.kprAudioTrack = new Audio('audio/FX_ALT_intro_animation.mp3');
    window.kprAudioTrack.loop = true;
    window.kprAudioTrack.volume = 0.45;
  }

  const STYLES = `
    /* Hide old Framer static SVG placeholders */
    .framer-19l1k2 svg,
    .framer-19l1k2 use,
    .framer-1fms2t0 svg,
    .framer-1fms2t0 use,
    use[href*="svg625784724_628"],
    #svg625784724_628 {
      display: none !important;
    }

    /* Bottom-left viewport alignment (center-aligned with left side column frame) */
    #kpr-audio-fixed-widget {
      position: fixed !important;
      bottom: 48px !important;
      left: 19px !important;
      z-index: 2147483647 !important;
      width: 24px !important;
      height: 26px !important;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      pointer-events: auto !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    #kpr-audio-fixed-widget:hover {
      transform: scale(1.22) !important;
    }

    #kpr-audio-fixed-widget * {
      cursor: pointer !important;
    }

    .btn-audio {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 3px !important;
      width: 24px !important;
      height: 18px !important;
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
      border: none !important;
      outline: none !important;
      cursor: pointer !important;
      pointer-events: auto !important;
      transition: opacity 0.2s ease !important;
    }

    .btn-audio .line {
      background-color: #000000 !important;
      border-radius: 1px !important;
      transform-origin: center center !important;
      transition: transform 0.14s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease !important;
      display: inline-block !important;
      cursor: pointer !important;
    }

    /* Refined, slender line thicknesses for a non-distracting, elegant look */
    .btn-audio .line-0 { width: 1.4px !important; height: 16px !important; }
    .btn-audio .line-1 { width: 1.6px !important; height: 16px !important; }
    .btn-audio .line-2 { width: 2.5px !important; height: 16px !important; } /* Sleek center bar */
    .btn-audio .line-3 { width: 1.6px !important; height: 16px !important; }
    .btn-audio .line-4 { width: 1.4px !important; height: 16px !important; }

    .btn-audio.muted {
      opacity: 0.8 !important;
    }
  `;

  function injectStyles() {
    if (document.getElementById('kpr-audio-button-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'kpr-audio-button-styles';
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
  }

  function animateBars() {
    const btn = document.querySelector('#kpr-audio-fixed-widget .btn-audio');
    if (!btn || window.isKprAudioMuted) return;
    const lines = btn.querySelectorAll('.line');
    lines.forEach(line => {
      const scale = 0.2 + Math.random() * 0.8;
      line.style.transform = `scaleY(${scale.toFixed(2)})`;
    });
  }

  function startAnimation() {
    const btn = document.querySelector('#kpr-audio-fixed-widget .btn-audio');
    if (btn) btn.classList.remove('muted');
    if (animationInterval) clearInterval(animationInterval);
    animationInterval = setInterval(animateBars, 75);
  }

  function stopAnimation() {
    if (animationInterval) clearInterval(animationInterval);
    animationInterval = null;
    const btn = document.querySelector('#kpr-audio-fixed-widget .btn-audio');
    if (btn) {
      btn.classList.add('muted');
      const lines = btn.querySelectorAll('.line');
      lines.forEach((line, index) => {
        const heightScale = PAUSED_BAR_HEIGHTS[index] || 0.30;
        line.style.transform = `scaleY(${heightScale})`;
      });
    }
  }

  let scrollStopTimer = null;

  function triggerScrollTransitionSound() {
    if (window.isKprAudioMuted) return;
    if (document.body.classList.contains('lightbox-open')) return;

    startAnimation();

    if (window.kprAudioTrack) {
      if (window.kprAudioTrack.paused) {
        window.kprAudioTrack.play().catch(err => console.log('Scroll audio blocked:', err));
      }
    }

    if (scrollStopTimer) clearTimeout(scrollStopTimer);

    scrollStopTimer = setTimeout(() => {
      if (window.kprAudioTrack) {
        window.kprAudioTrack.pause();
      }
      stopAnimation();
    }, 420);
  }

  function toggleAudioPlayback(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }

    window.isKprAudioMuted = !window.isKprAudioMuted;

    if (window.isKprAudioMuted) {
      // MUTE Sound Effects
      if (window.kprAudioTrack) {
        window.kprAudioTrack.pause();
      }
      stopAnimation();
    } else {
      // ENABLE Sound Effects & Play Brief Section Transition Chime
      triggerScrollTransitionSound();
    }
  }

  function updateWidgetPosition() {
    const widget = document.getElementById('kpr-audio-fixed-widget');
    if (!widget) return;

    // Keep attached directly to document.body so React/Framer hydration cannot delete or intercept clicks
    if (widget.parentElement !== document.body) {
      document.body.appendChild(widget);
    }

    // 1. Measure the exact center axis of the crosshair graphic (.framer-4dmoed) / AKD logo container between the blue guide lines
    const centerGraphic = document.querySelector('.framer-4dmoed, .framer-19l1k2, .framer-1fms2t0');
    let centerAxis = null;

    if (centerGraphic) {
      const gRect = centerGraphic.getBoundingClientRect();
      if (gRect.width > 0) {
        centerAxis = gRect.left + (gRect.width / 2);
      }
    }

    if (centerAxis === null) {
      const leftColumn = document.querySelector('.framer-ga55q0, [class*="ga55q0"]');
      if (leftColumn) {
        const cRect = leftColumn.getBoundingClientRect();
        centerAxis = cRect.left + (cRect.width / 2);
      }
    }

    if (centerAxis === null) {
      const mainContainer = document.querySelector('.framer-72rtr7, #main, [data-framer-component-type="Frame"], [data-framer-generated]');
      if (mainContainer) {
        const mRect = mainContainer.getBoundingClientRect();
        centerAxis = mRect.left + 31;
      }
    }

    if (centerAxis !== null && !isNaN(centerAxis)) {
      const widgetLeft = centerAxis - 12; // 12px is half of 24px widget width
      widget.style.position = 'fixed';
      widget.style.bottom = '32px';
      widget.style.left = `${Math.round(widgetLeft)}px`;
      widget.style.transform = 'none';
    } else {
      widget.style.position = 'fixed';
      widget.style.bottom = '32px';
      widget.style.left = '19px';
      widget.style.transform = 'none';
    }
  }

  function ensureWidgetCreated() {
    injectStyles();

    let widget = document.getElementById('kpr-audio-fixed-widget');
    if (widget) {
      updateWidgetPosition();
      return;
    }

    widget = document.createElement('div');
    widget.id = 'kpr-audio-fixed-widget';
    widget.setAttribute('role', 'button');
    widget.setAttribute('aria-label', 'Toggle Audio Music');
    widget.setAttribute('tabindex', '0');

    const btn = document.createElement('button');
    btn.className = 'btn-audio' + (window.isKprAudioMuted ? ' muted' : '');
    btn.setAttribute('type', 'button');

    for (let i = 0; i < 5; i++) {
      const line = document.createElement('div');
      line.className = `line line-${i}`;
      const initialScale = window.isKprAudioMuted ? PAUSED_BAR_HEIGHTS[i] : 0.5;
      line.style.transform = `scaleY(${initialScale})`;
      btn.appendChild(line);
    }

    widget.appendChild(btn);

    // Single-click toggle event listeners (no pointerdown to avoid hold-to-play bugs)
    let lastActionTime = 0;
    const handleAction = (e) => {
      const now = Date.now();
      if (now - lastActionTime < 300) return; // Prevent duplicate rapid trigger
      lastActionTime = now;
      toggleAudioPlayback(e);
    };

    widget.addEventListener('click', handleAction, true);
    btn.addEventListener('click', handleAction, true);

    widget.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleAction(e);
      }
    });

    // Window capture fallback for click detection over Framer layers
    window.addEventListener('click', (e) => {
      const widgetEl = document.getElementById('kpr-audio-fixed-widget');
      if (!widgetEl) return;
      const rect = widgetEl.getBoundingClientRect();
      if (e.clientX >= rect.left - 6 && e.clientX <= rect.right + 6 &&
          e.clientY >= rect.top - 6 && e.clientY <= rect.bottom + 6) {
        handleAction(e);
      }
    }, true);

    document.body.appendChild(widget);
    updateWidgetPosition();

    if (!window.isKprAudioMuted) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureWidgetCreated();
      updateWidgetPosition();
    });
  } else {
    ensureWidgetCreated();
    updateWidgetPosition();
  }

  window.addEventListener('resize', updateWidgetPosition);
  window.addEventListener('scroll', () => {
    updateWidgetPosition();
    if (!window.isKprAudioMuted) {
      triggerScrollTransitionSound();
    }
  }, { passive: true });
  setInterval(updateWidgetPosition, 400);

  // Observe DOM mutations to keep widget attached & aligned
  const observer = new MutationObserver(() => {
    ensureWidgetCreated();
    updateWidgetPosition();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
