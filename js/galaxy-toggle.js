// Galaxy background toggle — persist preference, show/hide galaxy layer
(function () {
  const STORAGE_KEY = 'galaxy-bg-on';

  const btn = document.getElementById('galaxy-toggle');
  const galaxyEl = document.querySelector('.galaxy-bg');

  // Default: galaxy ON (only off when user has explicitly set to false)
  function isOn() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === undefined || v === null || v !== 'false';
    } catch (_) {
      return true;
    }
  }

  function setGalaxy(on) {
    try {
      localStorage.setItem(STORAGE_KEY, on ? 'true' : 'false');
    } catch (_) {}
    if (galaxyEl) galaxyEl.hidden = !on;
    window.dispatchEvent(new CustomEvent('galaxy-state-change', { detail: { on } }));
    if (!on) window.dispatchEvent(new CustomEvent('galaxy-hide'));
    if (btn) {
      btn.classList.toggle('galaxy-toggle-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      const text = btn.querySelectorAll('.galaxy-toggle-text, .galaxy-toggle-hover-text');
      text.forEach((el) => { el.textContent = on ? 'Galaxy On' : 'Galaxy Off'; });
    }
  }

  window.addEventListener('galaxy-state-change', (e) => {
    const on = e.detail.on;
    if (galaxyEl) galaxyEl.hidden = !on;
    if (btn) {
      btn.classList.toggle('galaxy-toggle-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      const text = btn.querySelectorAll('.galaxy-toggle-text, .galaxy-toggle-hover-text');
      text.forEach((el) => { el.textContent = on ? 'Galaxy On' : 'Galaxy Off'; });
    }
  });

  if (btn) {
    const on = isOn();
    setGalaxy(on);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nextOn = !isOn();
      setGalaxy(nextOn);
      if (nextOn) window.dispatchEvent(new CustomEvent('galaxy-show'));
    });
  } else if (galaxyEl) {
    galaxyEl.hidden = !isOn();
  }
})();
