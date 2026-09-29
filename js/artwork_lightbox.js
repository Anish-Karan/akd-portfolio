/* ==========================================================================
   ANISH KARAN DESIGNS - ORIGINAL KPR GLASS LIGHTBOX MODAL (ARTWORK PAGE ONLY)
   Dynamically active across all entry points, SPA transitions, and direct loads.
   Restricted strictly to the Artwork page Gallery Sections (excluding Hero Section).
   ========================================================================== */

(function() {
  const artworkInventory = [
    { "file": "YwR80Wv1a4PDTO1980l3a4rOTGQ.png", "title": "Dao Le Art Study", "category": "Digital Art", "gallery": "Gallery 001 — Digital Art" },
    { "file": "R1xdkFNzSuBlnFYWsryIJgjVQS8.png", "title": "The Fist of Change", "category": "Digital Art", "gallery": "Gallery 001 — Digital Art" },
    { "file": "K7GS9LS8Bg576uWizz8Ce90vNo.png", "title": "Your Lie In April", "category": "Digital Art", "gallery": "Gallery 001 — Digital Art" },
    { "file": "OgtFPQolk2rz8DgKLQevYU2CFI.jpg", "title": "Blue Blossom", "category": "Digital Art", "gallery": "Gallery 001 — Digital Art" },
    { "file": "R1a9VejQ9h6gEXQp3w4O01WRDM.jpg", "title": "Man & Elephant Conflict", "category": "Digital Art", "gallery": "Gallery 001 — Digital Art" },
    { "file": "iJzn1dRnBMqz3A61QZTDrXC4pBI.png", "title": "Elemental Gladiators", "category": "Digital Art", "gallery": "Gallery 001 — Digital Art" },
    { "file": "gnPYf0TYjyEzWhXuHeW23ZQRU.png", "title": "Arcane Jinx", "category": "3D Modeling", "gallery": "Gallery 002 — 3D Works" },
    { "file": "jPA5JWrzk40UzWldc2E9cxF8c.png", "title": "My Desk Setup", "category": "3D Environment", "gallery": "Gallery 002 — 3D Works" },
    { "file": "Pe7WcBTdiNOKeRlpRoP7z1ck.jpg", "title": "Bug & Dino", "category": "3D Sculpting", "gallery": "Gallery 002 — 3D Works" },
    { "file": "rYI9frIWJofshL9n2lQtqCN1U.jpg", "title": "Devil's Flame", "category": "3D Sculpting", "gallery": "Gallery 002 — 3D Works" },
    { "file": "yfVAVuYd2mQeY9XrXDAsSZAIxC8.png", "title": "The Sword of Warrior", "category": "3D Environment", "gallery": "Gallery 002 — 3D Works" },
    { "file": "AEQTbHGRSZNDTzQCGFsZiO2y2dg.jpg", "title": "Space Jam", "category": "3D Modeling", "gallery": "Gallery 002 — 3D Works" },
    { "file": "XjIyZaxeth4qAimlGmYYjWZHKhQ.png", "title": "Princess Noa", "category": "Character Design", "gallery": "Gallery 003 — Character Design" },
    { "file": "1BQT4GG5U3XlZOjsAIrcBp8aqA.png", "title": "Runner (The Postman)", "category": "Character Design", "gallery": "Gallery 003 — Character Design" },
    { "file": "deUMLeNIcOsF3t627Kn2HcXayU.jpg", "title": "Miss Fortune", "category": "Character Design", "gallery": "Gallery 003 — Character Design" },
    { "file": "G6gCPRJn7Wu6qtEHdxAvbF2dxr0.png", "title": "Valorent Sage", "category": "Character Design", "gallery": "Gallery 003 — Character Design" },
    { "file": "1Ouc7zAAJt1HAGqgcetWIi0zaY.png", "title": "Agent Mira", "category": "Character Design", "gallery": "Gallery 003 — Character Design" },
    { "file": "qL11xA31VZb8M871FAJvTwmtS7Q.png", "title": "My Avatar", "category": "Character Design", "gallery": "Gallery 003 — Character Design" },
    { "file": "uiYAfouHoHksIKvimfgn2VxtFq0.jpg", "title": "Deamon Slayer", "category": "Traditional Art", "gallery": "Gallery 004 — Traditional Art" },
    { "file": "OezBduhjRe8ddG3yqAg4tiMQQ0.png", "title": "Mindless", "category": "Traditional Art", "gallery": "Gallery 004 — Traditional Art" },
    { "file": "sJgbAxlZ6hijKP4HjnRC6nxzU4.jpg", "title": "The Boy & Cat", "category": "Traditional Art", "gallery": "Gallery 004 — Traditional Art" },
    { "file": "PkeTznuwh08DtrNxaQptWNyrTE.png", "title": "The Snipe Hock", "category": "Traditional Art", "gallery": "Gallery 004 — Traditional Art" },
    { "file": "LccO6I5QQ40kFIqF5apRSF1usg.jpg", "title": "Moon Lit Night", "category": "Traditional Art", "gallery": "Gallery 004 — Traditional Art" },
    { "file": "uPIp7GynRc6dQvP3JxdFZ23sA.jpg", "title": "Samurai", "category": "Traditional Art", "gallery": "Gallery 004 — Traditional Art" }
  ];

  const items = artworkInventory.map(item => ({
    ...item,
    src: `assets/images/${item.file}`
  }));

  let currentIndex = 0;
  let isOpen = false;

  function isArtworkPage() {
    const path = window.location.pathname.toLowerCase();
    const href = window.location.href.toLowerCase();
    
    if (path.endsWith('/artwork.html') || path.endsWith('/artwork') || path.includes('/artwork.html') || path.includes('/artwork')) {
      return true;
    }
    if (href.endsWith('/artwork.html') || href.endsWith('/artwork') || href.includes('/artwork.html')) {
      return true;
    }

    // Fallback check ONLY for artwork page gallery containers (excluding Nav Bar variants)
    const galleryNode = document.querySelector('[data-framer-name="Digital Illustrations"], [data-framer-name="3D Works"], [data-framer-name="Character Design"], [data-framer-name="Treditional Art"]');
    return !!galleryNode;
  }

  function ensureLightboxLockStyle() {
    if (document.getElementById('lightboxLockStyle')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'lightboxLockStyle';
    styleEl.innerHTML = `
      body.lightbox-open {
        overflow: hidden !important;
      }
      body.lightbox-open > *:not(#cleanSingleArtworkLightbox) {
        pointer-events: none !important;
        user-select: none !important;
      }
      #cleanSingleArtworkLightbox:not(.is-open),
      #cleanSingleArtworkLightbox:not(.is-open) * {
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  function ensureModalCreated() {
    ensureLightboxLockStyle();
    let modal = document.getElementById('cleanSingleArtworkLightbox');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'cleanSingleArtworkLightbox';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999999;
      background: rgba(10, 10, 14, 0.72);
      backdrop-filter: blur(32px) saturate(180%);
      -webkit-backdrop-filter: blur(32px) saturate(180%);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 24px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    modal.innerHTML = `
      <!-- Fixed Close Button at top-right corner of viewport -->
      <button id="lbCloseBtnCorner" type="button" aria-label="Close modal" style="
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 10000000;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.32);
        color: #ffffff;
        font-size: 1.8rem;
        font-weight: 300;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        transition: all 0.25s ease;
        line-height: 1;
        pointer-events: auto;
      ">&times;</button>

      <!-- Lightbox Header: Gallery Section Badge -->
      <div style="width:100%; max-width:1400px; display:flex; align-items:center; justify-content:flex-start; pointer-events:none;">
        <span id="lbGalleryBadge" style="
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.95);
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.28);
          padding: 6px 18px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        ">Gallery Section</span>
      </div>

      <!-- Main Image Viewport with Nav Arrows -->
      <div style="position:relative; width:100%; flex-grow:1; display:flex; align-items:center; justify-content:center; padding:16px 0; pointer-events:none;">
        <button id="lbPrevBtn" type="button" aria-label="Previous artwork" style="
          position: fixed;
          left: 24px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10000000;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.28);
          color: #ffffff;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          transition: all 0.25s ease;
          pointer-events: auto;
        ">&#10094;</button>

        <img id="lbMainImage" src="" alt="Full Artwork" style="
          max-width: 90vw;
          max-height: 75vh;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 16px;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.75);
          opacity: 0;
          transform: scale(0.95);
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease;
          pointer-events: auto;
        " />

        <button id="lbNextBtn" type="button" aria-label="Next artwork" style="
          position: fixed;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10000000;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.28);
          color: #ffffff;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          transition: all 0.25s ease;
          pointer-events: auto;
        ">&#10095;</button>
      </div>

      <!-- Lightbox Footer: Dynamic Title & Metadata -->
      <div style="width:100%; max-width:900px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:6px; pointer-events:none;">
        <h2 id="lbDynamicTitle" style="
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.01em;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.85);
        ">Artwork Title</h2>

        <div id="lbDynamicCaption" style="
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.88);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85);
        ">
          From Gallery 001 — Digital Art Section
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const lbCloseBtnCorner = document.getElementById('lbCloseBtnCorner');
    const lbPrevBtn = document.getElementById('lbPrevBtn');
    const lbNextBtn = document.getElementById('lbNextBtn');

    // Control button hover animations
    [lbCloseBtnCorner, lbPrevBtn, lbNextBtn].forEach(btn => {
      if (!btn) return;
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#ffffff';
        btn.style.color = '#000000';
        btn.style.transform = btn.id.includes('BtnCorner') ? 'scale(1.15)' : 'translateY(-50%) scale(1.12)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255, 255, 255, 0.18)';
        btn.style.color = '#ffffff';
        btn.style.transform = btn.id.includes('BtnCorner') ? 'scale(1)' : 'translateY(-50%) scale(1)';
      });
    });

    return modal;
  }

  function updateContent() {
    const item = items[currentIndex];
    if (!item) return;

    const lbMainImage = document.getElementById('lbMainImage');
    const lbGalleryBadge = document.getElementById('lbGalleryBadge');
    const lbDynamicTitle = document.getElementById('lbDynamicTitle');
    const lbDynamicCaption = document.getElementById('lbDynamicCaption');

    if (lbMainImage) lbMainImage.src = item.src || `assets/images/${item.file}`;
    if (lbGalleryBadge) lbGalleryBadge.textContent = item.gallery || 'Gallery Showcase';
    if (lbDynamicTitle) lbDynamicTitle.textContent = item.title || 'Artwork Title';
    if (lbDynamicCaption) lbDynamicCaption.textContent = `From ${item.gallery || 'Gallery'} • ${item.category || 'Portfolio'} (Item ${currentIndex + 1} of ${items.length})`;
  }

  function openModal(index) {
    const modal = ensureModalCreated();
    currentIndex = index;
    updateContent();
    modal.style.display = 'flex';
    modal.classList.add('is-open');
    modal.style.pointerEvents = 'auto';
    document.body.classList.add('lightbox-open');

    const lbMainImage = document.getElementById('lbMainImage');
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      if (lbMainImage) {
        lbMainImage.style.opacity = '1';
        lbMainImage.style.transform = 'scale(1)';
      }
    });

    isOpen = true;
  }

  function closeModal() {
    const modal = document.getElementById('cleanSingleArtworkLightbox');
    const lbMainImage = document.getElementById('lbMainImage');

    isOpen = false;
    document.body.classList.remove('lightbox-open');

    if (lbMainImage) {
      lbMainImage.style.opacity = '0';
      lbMainImage.style.transform = 'scale(0.95)';
    }

    if (modal) {
      modal.classList.remove('is-open');
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      if (modal && !isOpen) {
        modal.style.display = 'none';
      }
    }, 320);
  }

  // Image & Background-Image URL Extraction
  function findImageUrlFromTarget(target) {
    const modal = document.getElementById('cleanSingleArtworkLightbox');
    if (!target || target === document.body || target === modal) return null;

    let el = target;
    let depth = 0;

    while (el && el !== document.body && depth < 10) {
      if (el.tagName === 'IMG' && el.src && !el.src.includes('.svg')) {
        return el.src;
      }
      const imgInside = el.querySelector('img');
      if (imgInside && imgInside.src && !imgInside.src.includes('.svg')) {
        return imgInside.src;
      }

      try {
        const compStyle = getComputedStyle(el);
        const bg = compStyle ? compStyle.backgroundImage : '';
        if (bg && bg !== 'none' && bg.includes('url(')) {
          const match = bg.match(/url\((['"]?)(.*?)\1\)/);
          if (match && match[2] && !match[2].includes('.svg')) {
            return match[2];
          }
        }
      } catch(e) {}

      if (el.style && el.style.backgroundImage && el.style.backgroundImage.includes('url(')) {
        const match = el.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
        if (match && match[2] && !match[2].includes('.svg')) {
          return match[2];
        }
      }

      el = el.parentElement;
      depth++;
    }

    return null;
  }

  // Intercept click event globally in capture phase
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('cleanSingleArtworkLightbox');

    if (isOpen) {
      if (e.target.closest('#lbCloseBtnCorner')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeModal();
        return;
      }
      if (e.target === modal || e.target.id === 'cleanSingleArtworkLightbox') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeModal();
        return;
      }
      if (e.target.closest('#lbPrevBtn')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateContent();
        return;
      }
      if (e.target.closest('#lbNextBtn')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        currentIndex = (currentIndex + 1) % items.length;
        updateContent();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    // Lightbox is strictly active ONLY when on the artwork page
    if (!isArtworkPage()) return;

    // Ignore clicks on Nav Bar, Hero Section, Image Wraper, Header, Footer, and external action links
    if (e.target.closest('[data-framer-name="Nav Bar"], [data-framer-name="Hero Section"], [data-framer-name="Image Wraper"], .framer-maqz6x, .framer-mltbrl, header, footer, a[href*="mailto"], a[href*="drive"], a[href*="behance"]')) {
      return;
    }

    // Must be inside a valid Gallery Section below the Hero Section
    const inGallerySection = e.target.closest('[data-framer-name="Digital Illustrations"], [data-framer-name="3D Works"], [data-framer-name="Character Design"], [data-framer-name="Treditional Art"], [data-framer-name*="Gallery"], .framer-hq78vh, .framer-1jqzk8f, .framer-dr3CD');
    if (!inGallerySection) {
      return;
    }

    const imageUrl = findImageUrlFromTarget(e.target);
    if (imageUrl) {
      const filename = imageUrl.split('/').pop().split('?')[0];

      let matchedIndex = items.findIndex(it => it.file === filename || it.src.includes(filename));

      if (matchedIndex === -1) {
        const cardParent = e.target.closest('[data-framer-name], .project-card, .artwork-card, a') || e.target.parentElement;
        const heading = cardParent ? cardParent.querySelector('h1, h2, h3, p, [data-framer-name]') : null;
        const titleText = (heading ? heading.textContent.trim() : 'Portfolio Showcase');

        const dynamicItem = {
          file: filename,
          src: imageUrl,
          title: titleText.length > 50 ? titleText.substring(0, 50) + '...' : titleText,
          category: 'Portfolio Showcase',
          gallery: 'Gallery Showcase'
        };

        items.push(dynamicItem);
        matchedIndex = items.length - 1;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openModal(matchedIndex);
    }
  }, true);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateContent();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      updateContent();
    }
  });

  function checkAndInit() {
    if (isArtworkPage()) {
      ensureModalCreated();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndInit);
  } else {
    checkAndInit();
  }

  // Observe DOM mutations & Framer SPA route changes
  const observer = new MutationObserver(() => {
    checkAndInit();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
