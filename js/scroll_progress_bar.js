/* ==========================================================================
   ANISH KARAN DESIGNS - MULTI-PAGE & DEDICATED SINGLE-INSTANCE SCROLL PROGRESS
   ========================================================================== */

(function() {
  let isInitialized = false;

  function initKprScrollProgress() {
    // 1. Select ONLY visible .framer-10qpsb0 inner header rows (prevents parent/child duplication)
    let targets = Array.from(document.querySelectorAll('.framer-10qpsb0'));
    targets = targets.filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);

    // Fallback if class names differ on non-Framer builds
    if (!targets.length) {
      const fallback = document.querySelector('[data-framer-name="Nav Bar"], .site-header, header, nav');
      if (fallback && fallback.offsetWidth > 0) targets = [fallback];
    }

    if (!targets.length) return;

    // 2. Remove any duplicate progress wrappers on parent/ancestor elements
    document.querySelectorAll('.kpr-progress-wrapper').forEach(wrapper => {
      if (!targets.includes(wrapper.parentElement)) {
        wrapper.remove();
      }
    });

    targets.forEach((row) => {
      const logoCell = row.querySelector('.framer-nbwvts');
      const menuCell = row.querySelector('.framer-hn4xz5');
      const connectCell = row.querySelector('.framer-7tdqhd');

      if (!menuCell && !connectCell) return;

      const leftOffset = menuCell ? (menuCell.offsetLeft || (logoCell ? logoCell.offsetWidth : 0)) : (logoCell ? logoCell.offsetWidth : 0);
      const menuWidth = menuCell ? (menuCell.offsetWidth || 0) : 0;
      const connectWidth = connectCell ? (connectCell.offsetWidth || 0) : 0;
      const totalWidth = menuWidth + connectWidth;
      const cellHeight = (menuCell ? menuCell.offsetHeight : 0) || (connectCell ? connectCell.offsetHeight : 0) || row.offsetHeight || 48;

      if (totalWidth <= 0) return;

      // Ensure row is relative container
      if (getComputedStyle(row).position === 'static') {
        row.style.position = 'relative';
      }

      // Elevate text, links, and buttons above progress fill (z-index: 5)
      const interactiveElements = row.querySelectorAll('.framer-hn4xz5, .framer-7tdqhd, .framer-9rwmp, .framer-s6y458, a, button, p, span, .framer-text, .framer-cglkgp');
      interactiveElements.forEach(el => {
        const elPos = getComputedStyle(el).position;
        if (elPos === 'static') {
          el.style.position = 'relative';
        }
        el.style.zIndex = '5';
      });

      // Remove multiple wrappers if more than 1 exist inside the container
      const existingWrappers = Array.from(row.querySelectorAll('.kpr-progress-wrapper'));
      if (existingWrappers.length > 1) {
        existingWrappers.slice(1).forEach(w => w.remove());
      }

      let progressBar = existingWrappers[0];

      if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'kpr-progress-wrapper';
        progressBar.style.cssText = `
          position: absolute;
          top: 0;
          left: ${leftOffset}px;
          width: ${totalWidth}px;
          height: ${cellHeight}px;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
          border-top-right-radius: 8px;
          box-shadow: none;
          filter: none;
        `;

        const progressFill = document.createElement('div');
        progressFill.className = 'kpr-progress-fill';
        progressFill.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.12);
          transform: scaleX(0);
          transform-origin: left center;
          will-change: transform;
          box-shadow: none;
          filter: none;
          z-index: 1;
          transition: transform 0.08s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        const progressLine = document.createElement('div');
        progressLine.className = 'kpr-progress-line';
        progressLine.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-right: 1.5px solid rgba(0, 0, 0, 0.5);
          transform: scaleX(0);
          transform-origin: left center;
          will-change: transform;
          box-shadow: none;
          filter: none;
          z-index: 2;
          transition: transform 0.08s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        progressBar.appendChild(progressFill);
        progressBar.appendChild(progressLine);
        row.insertBefore(progressBar, row.firstChild);
      } else {
        progressBar.style.left = leftOffset + 'px';
        progressBar.style.width = totalWidth + 'px';
        progressBar.style.height = cellHeight + 'px';
        progressBar.style.zIndex = '1';
      }
    });

    updateProgress();
  }

  function getFooterTop() {
    const footer = document.querySelector('footer, [data-framer-name="Footer"], [data-framer-name="Footer 01"]');
    if (footer) {
      const rect = footer.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      return rect.top + scrollTop;
    }
    return null;
  }

  let ticking = false;

  function updateProgress() {
    let targets = Array.from(document.querySelectorAll('.framer-10qpsb0'));
    targets = targets.filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);

    targets.forEach(row => {
      const menuCell = row.querySelector('.framer-hn4xz5');
      const connectCell = row.querySelector('.framer-7tdqhd');
      const logoCell = row.querySelector('.framer-nbwvts');
      const progressBar = row.querySelector('.kpr-progress-wrapper');

      if (menuCell && progressBar) {
        const leftOffset = menuCell.offsetLeft || (logoCell ? logoCell.offsetWidth : 0);
        const totalWidth = (menuCell.offsetWidth || 0) + (connectCell ? connectCell.offsetWidth : 0);
        const cellHeight = menuCell.offsetHeight || 48;

        progressBar.style.left = leftOffset + 'px';
        progressBar.style.width = totalWidth + 'px';
        progressBar.style.height = cellHeight + 'px';
      }

      // Maintain z-index elevation for links & buttons
      const interactiveElements = row.querySelectorAll('.framer-hn4xz5, .framer-7tdqhd, .framer-9rwmp, .framer-s6y458, a, button, p, span, .framer-text, .framer-cglkgp');
      interactiveElements.forEach(el => {
        if (getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
        }
        el.style.zIndex = '5';
      });
    });

    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;

    let maxScroll;
    const footerTop = getFooterTop();

    if (footerTop && (footerTop - clientHeight > 0)) {
      maxScroll = footerTop - clientHeight;
    } else {
      maxScroll = scrollHeight - clientHeight;
    }

    const progress = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;

    const fills = document.querySelectorAll('.kpr-progress-fill');
    const lines = document.querySelectorAll('.kpr-progress-line');

    fills.forEach(fill => {
      fill.style.transform = `scaleX(${progress})`;
    });
    lines.forEach(line => {
      line.style.transform = `scaleX(${progress})`;
    });

    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }

  function setupObservers() {
    if (isInitialized) return;
    isInitialized = true;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      initKprScrollProgress();
      updateProgress();
    }, { passive: true });
    window.addEventListener('popstate', () => {
      setTimeout(initKprScrollProgress, 100);
    });
    window.addEventListener('hashchange', () => {
      setTimeout(initKprScrollProgress, 100);
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) {
        setTimeout(initKprScrollProgress, 100);
        setTimeout(initKprScrollProgress, 300);
        setTimeout(initKprScrollProgress, 600);
      }
    }, { capture: true, passive: true });

    const observer = new MutationObserver((mutations) => {
      let shouldReinit = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          shouldReinit = true;
          break;
        }
      }
      if (shouldReinit) {
        initKprScrollProgress();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(initKprScrollProgress, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initKprScrollProgress();
      setupObservers();
    });
  } else {
    initKprScrollProgress();
    setupObservers();
  }

  setTimeout(initKprScrollProgress, 300);
  setTimeout(initKprScrollProgress, 800);
  setTimeout(initKprScrollProgress, 1500);
})();
