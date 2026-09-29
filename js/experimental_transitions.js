/* ==========================================================================
   DYNAMIC LIGHT COLOR THEME TRANSITIONS FOR ESTABLISHED DESIGN
   ========================================================================== */

(function() {
  function initTransitions() {
    const projectRules = [
      { keywords: ['199941041', 'My Hive'], theme: 'theme-purple', name: 'My Hive' },
      { keywords: ['245842323', 'Vision Coach'], theme: 'theme-teal', name: 'Vision Coach' },
      { keywords: ['213103773', 'Assistive'], theme: 'theme-amber', name: 'Assistive Device' },
      { keywords: ['245842757', 'Surveillance'], theme: 'theme-red', name: 'AI Security' },
      { keywords: ['181892515', 'Catalogue'], theme: 'theme-blue', name: 'IITG Catalogue' },
      { keywords: ['246241373', 'Quyl'], theme: 'theme-green', name: 'Quyl LMS' }
    ];

    const observedElements = [];

    projectRules.forEach(rule => {
      const candidateNodes = [];

      // Check all <a> links
      document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (rule.keywords.some(kw => href.includes(kw))) {
          candidateNodes.push(a);
        }
      });

      // Check text headings & divs
      document.querySelectorAll('h1, h2, h3, p, div[data-framer-name]').forEach(el => {
        const text = el.textContent || '';
        const framerName = el.getAttribute('data-framer-name') || '';
        if (rule.keywords.some(kw => text.includes(kw) || framerName.includes(kw))) {
          candidateNodes.push(el);
        }
      });

      candidateNodes.forEach(node => {
        // Find major card container element
        const cardContainer = node.closest('.framer-1dxhny9, .framer-hribd1, .framer-1sft2cp, .framer-1bx7bwl, .framer-1sywflq-container, .framer-1xcg9jj-container, .framer-3ygiqr-container, .framer-5ru3bu-container, .framer-1bojdf8-container, .framer-yyfdzd-container, .framer-1m6xtzk-container, div[data-framer-name]') || node;

        if (!cardContainer.hasAttribute('data-project-theme')) {
          cardContainer.setAttribute('data-project-theme', rule.theme);
          cardContainer.classList.add('project-card-interactive');
          observedElements.push(cardContainer);
        }
      });
    });

    console.log(`[Light Theme Transitions] Initialized ${observedElements.length} project card containers.`);

    // IntersectionObserver to trigger smooth background color transitions on scroll
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -25% 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const theme = entry.target.getAttribute('data-project-theme');
          if (theme) {
            document.body.classList.remove('theme-purple', 'theme-teal', 'theme-amber', 'theme-red', 'theme-blue', 'theme-green');
            document.body.classList.add(theme);
          }
        }
      });
    }, observerOptions);

    observedElements.forEach(el => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTransitions);
  } else {
    initTransitions();
  }
})();
