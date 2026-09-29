/* ==========================================================================
   ANISH KARAN DESIGNS - MAIN NAVIGATION & PAGE RELOAD CONTROLLER
   Forces clean full browser navigation for internal page links to prevent
   Framer SPA router hijacking from breaking page scripts & lightboxes.
   ========================================================================== */

(function() {
  function getTargetLink(target) {
    if (!target || target === document.body || target === document.documentElement) return null;
    
    // Check if target itself or ancestor is an <a> with href
    let link = target.closest('a[href]');
    if (link) return link;

    // Check if target itself contains an <a> with href
    if (target.querySelector) {
      link = target.querySelector('a[href]');
      if (link) return link;
    }

    // Check parent containers up to 5 levels high for a child <a> with href
    let parent = target.parentElement;
    let depth = 0;
    while (parent && parent !== document.body && depth < 5) {
      if (parent.querySelector) {
        link = parent.querySelector('a[href]');
        if (link) return link;
      }
      parent = parent.parentElement;
      depth++;
    }
    return null;
  }

  function handleLinkClick(e) {
    const link = getTargetLink(e.target);
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    
    const lowerHref = href.toLowerCase();
    const isInternalPage = lowerHref.includes('.html') || 
                           lowerHref.includes('artwork') || 
                           lowerHref.includes('about') || 
                           lowerHref.includes('project') || 
                           href === '/' || href === './';

    const isExternal = lowerHref.startsWith('http://') || lowerHref.startsWith('https://');
    
    if (isInternalPage && !isExternal) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || link.target === '_blank') return;
      
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const targetUrl = new URL(href, window.location.href).href;
      if (window.location.href !== targetUrl) {
        window.location.href = targetUrl;
      }
    }
  }

  // Intercept click in capture phase
  window.addEventListener('click', handleLinkClick, true);

  document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const isOpen = mobileMenu.classList.contains('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    // Active Link Highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, a[href]');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      }
    });

    // Smooth Scroll for Internal Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Email Copy Feature
    const emailLinks = document.querySelectorAll('.copy-email');
    emailLinks.forEach(emailLink => {
      emailLink.addEventListener('click', (e) => {
        const emailText = 'karananish98@gmail.com';
        navigator.clipboard.writeText(emailText).then(() => {
          showToast('Email copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      });
    });
  });

  function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #ffffff;
        color: #000000;
        font-family: var(--font-mono, sans-serif);
        font-size: 0.85rem;
        padding: 12px 24px;
        border-radius: 100px;
        z-index: 3000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
    }, 3000);
  }
})();
