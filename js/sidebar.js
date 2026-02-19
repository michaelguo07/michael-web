// Sidebar: sync nav from sessionStorage + progress bar
(function () {
  const STORAGE_KEY = 'portfolio-revealed';
  const TOTAL_SECTIONS = 5;

  function getRevealedIds() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  }

  function syncNav() {
    const ids = getRevealedIds();
    document.querySelectorAll('.nav-revealable').forEach((link) => {
      const section = link.getAttribute('data-section');
      if (ids.includes(section)) {
        link.classList.add('nav-revealed');
      } else {
        link.classList.remove('nav-revealed');
      }
    });
  }

  function updateProgress() {
    const ids = getRevealedIds();
    const count = ids.length;
    const pct = Math.round((count / TOTAL_SECTIONS) * 100);
    const fill = document.querySelector('.sidebar-progress-fill');
    if (fill) {
      fill.style.width = pct + '%';
    }
  }

  function init() {
    syncNav();
    updateProgress();
  }

  init();
  window.updateSidebarProgress = updateProgress;
})();
