/* ==========================================================================
   ANISH KARAN DESIGNS - EXPERIMENTAL KPR PROJECTS JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelectorAll('.project-card-wrapper');
  const hudItems = document.querySelectorAll('.hud-item');
  const hudProgress = document.getElementById('hudProgress');
  const currentThemeTag = document.getElementById('currentThemeTag');

  const themes = ['purple', 'teal', 'amber', 'red', 'blue', 'green'];

  // IntersectionObserver for Dynamic Theme Switching & HUD Highlighting
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const theme = entry.target.getAttribute('data-theme');
        const index = parseInt(entry.target.getAttribute('data-index'), 10);
        
        // Update document theme
        document.documentElement.setAttribute('data-theme', theme);
        
        if (currentThemeTag) {
          currentThemeTag.textContent = `// ACTIVE THEME: ${theme.toUpperCase()} MODE`;
        }

        // Update Side HUD
        hudItems.forEach(item => item.classList.remove('active'));
        if (hudItems[index]) {
          hudItems[index].classList.add('active');
        }

        if (hudProgress) {
          const percent = ((index + 1) / projectCards.length) * 100;
          hudProgress.style.height = `${percent}%`;
        }
      }
    });
  }, observerOptions);

  projectCards.forEach(card => observer.observe(card));

  // 3D Card Parallax Tilt Physics on Mousemove
  projectCards.forEach(wrapper => {
    const card = wrapper.querySelector('.kpr-folder-card');
    if (!card) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // Lightbox Modal Handling
  const modal = document.createElement('div');
  modal.className = 'kpr-lightbox-modal';
  modal.innerHTML = `
    <button class="kpr-lightbox-close" aria-label="Close">&times;</button>
    <img class="kpr-lightbox-img" src="" alt="Project Full Preview">
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('.kpr-lightbox-img');
  const closeBtn = modal.querySelector('.kpr-lightbox-close');

  document.querySelectorAll('.card-image-viewport').forEach(viewport => {
    viewport.addEventListener('click', () => {
      const img = viewport.querySelector('img');
      if (img) {
        modalImg.src = img.src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
});
