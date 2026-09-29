/* ==========================================================================
   ANISH KARAN DESIGNS - LIGHTBOX MODAL JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const artworkCards = document.querySelectorAll('.artwork-card');
  if (artworkCards.length === 0) return;

  // Create Lightbox DOM structure if missing
  let lightbox = document.getElementById('lightboxModal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightboxModal';
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <div class="lightbox-header">
        <div class="lightbox-title" id="lightboxTitle">Artwork View</div>
        <button class="lightbox-close" id="lightboxClose" aria-label="Close modal">&times;</button>
      </div>
      <div class="lightbox-body">
        <img src="" alt="" class="lightbox-image" id="lightboxImg">
        <div class="lightbox-controls">
          <button class="lightbox-arrow" id="lightboxPrev" aria-label="Previous image">&#10094;</button>
          <button class="lightbox-arrow" id="lightboxNext" aria-label="Next image">&#10095;</button>
        </div>
      </div>
      <div class="lightbox-footer" id="lightboxFooter">Gallery Category</div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxFooter = document.getElementById('lightboxFooter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;
  const items = Array.from(artworkCards).map(card => ({
    src: card.getAttribute('data-img-src') || card.querySelector('img')?.src,
    title: card.getAttribute('data-title') || card.querySelector('.artwork-name')?.textContent || 'Artwork',
    category: card.getAttribute('data-category') || card.querySelector('.artwork-cat')?.textContent || 'Gallery'
  }));

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = items[currentIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxTitle.textContent = item.title;
    lightboxFooter.textContent = `${item.category} • ${currentIndex + 1} of ${items.length}`;
  }

  artworkCards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  
  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightbox();
  });

  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % items.length;
      updateLightbox();
    }
  });
});
