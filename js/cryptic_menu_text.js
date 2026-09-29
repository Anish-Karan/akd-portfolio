/* ==========================================================================
   ANISH KARAN DESIGNS - ROBUST CRYPTIC TEXT DECRYPTION & KPR HOVER AUDIO SFX
   (With Lightbox Overlay Protection - Background Completely Unresponsive)
   ========================================================================== */
(function() {
  const CRYPTIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$@%&*!?▲▼░▒▓█';

  const hoverAudio = new Audio('/audio/UI_menu_rollover.mp3');
  hoverAudio.volume = 0.35;
  let webAudioCtx = null;

  function isLightboxActive() {
    if (document.body.classList.contains('lightbox-open')) return true;
    const lb = document.getElementById('cleanSingleArtworkLightbox');
    if (lb && getComputedStyle(lb).opacity !== '0' && getComputedStyle(lb).pointerEvents !== 'none') {
      return true;
    }
    return false;
  }

  function playHoverSound() {
    if (window.isKprAudioMuted) return;
    if (isLightboxActive()) return;
    try {
      if (hoverAudio) {
        const soundClone = hoverAudio.cloneNode();
        soundClone.volume = 0.3;
        const p = soundClone.play();
        if (p !== undefined) {
          p.catch(() => playWebAudioFallback());
        }
      } else {
        playWebAudioFallback();
      }
    } catch(e) {
      playWebAudioFallback();
    }
  }

  function playWebAudioFallback() {
    if (window.isKprAudioMuted) return;
    if (isLightboxActive()) return;
    try {
      if (!webAudioCtx) {
        webAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (webAudioCtx.state === 'suspended') {
        webAudioCtx.resume();
      }
      const osc = webAudioCtx.createOscillator();
      const gain = webAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, webAudioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, webAudioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.02, webAudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, webAudioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(webAudioCtx.destination);
      osc.start();
      osc.stop(webAudioCtx.currentTime + 0.04);
    } catch(err) {}
  }

  const activeScrambles = new WeakMap();

  function findCrypticTarget(target) {
    if (!target || target === document.body) return null;
    if (isLightboxActive()) return null;

    const container = target.closest('a, button, [data-framer-name*="Variant"], .framer-1a1brve-container, .framer-7tdqhd, .framer-hn4xz5');
    if (!container) return null;

    // Do not match controls inside the lightbox overlay itself
    if (container.closest('#cleanSingleArtworkLightbox')) return null;

    const textNode = container.querySelector('p, span, .framer-text') || (container.children.length === 0 ? container : null);
    if (!textNode) return null;

    const rawText = (textNode.innerText || textNode.textContent || '').trim();
    if (!rawText || rawText.length > 50) return null;

    const upper = rawText.toUpperCase();
    const isTarget = (
      rawText === 'Projects' ||
      rawText === 'Artworks' ||
      rawText === 'About' ||
      rawText === 'CONNECT' ||
      upper.includes('VIEW PROJECT') ||
      upper.includes('DOWNLOAD RESUME') ||
      container.tagName === 'BUTTON' ||
      container.getAttribute('href') !== null
    );

    if (!isTarget) return null;

    return { container, textNode, rawText };
  }

  document.addEventListener('mouseover', (e) => {
    if (isLightboxActive()) return;

    const res = findCrypticTarget(e.target);
    if (!res) return;

    const { container, textNode, rawText } = res;

    if (activeScrambles.has(textNode)) return;

    playHoverSound();

    if (!textNode.dataset.originalText || textNode.dataset.originalText === '') {
      textNode.dataset.originalText = rawText;
    }
    const originalText = textNode.dataset.originalText || rawText;

    let iteration = 0;
    const interval = setInterval(() => {
      textNode.innerText = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '\n' || char === '\r') return char;
          if (index < iteration) {
            return originalText[index];
          }
          return CRYPTIC_CHARS[Math.floor(Math.random() * CRYPTIC_CHARS.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(interval);
        textNode.innerText = originalText;
        activeScrambles.delete(textNode);
      }

      iteration += 1 / 2;
    }, 25);

    activeScrambles.set(textNode, { interval, originalText, container });
  }, { capture: true, passive: true });

  document.addEventListener('mouseout', (e) => {
    const res = findCrypticTarget(e.target);
    if (!res) return;

    const { container, textNode } = res;
    if (activeScrambles.has(textNode)) {
      const state = activeScrambles.get(textNode);
      clearInterval(state.interval);
      if (state.originalText) {
        textNode.innerText = state.originalText;
      }
      activeScrambles.delete(textNode);
    }
  }, { capture: true, passive: true });
})();
