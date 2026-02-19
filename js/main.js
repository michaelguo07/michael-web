// Nav links: reveal section first (if revealable), then scroll
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (href === '#') return;
  const id = href.slice(1);
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    if (typeof window.revealAndScroll === 'function') window.revealAndScroll(id);
    const navLink = document.querySelector(`.nav-revealable[data-section="${id}"]`);
    if (navLink) navLink.classList.add('nav-revealed');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Keyboard: j/k to go next/prev section (reveals if needed)
const panels = Array.from(document.querySelectorAll('.panel'));
let idx = 0;
function focusPanel(i) {
  idx = Math.max(0, Math.min(i, panels.length - 1));
  const panel = panels[idx];
  if (panel.classList.contains('revealable')) {
    panel.classList.add('revealed');
    const navLink = document.querySelector(`.nav-revealable[data-section="${panel.id}"]`);
    if (navLink) navLink.classList.add('nav-revealed');
    window.saveRevealedState?.();
  }
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.addEventListener('keydown', (e) => {
  if (e.target.closest('.terminal-input') || e.target.closest('.terminal-output')) return;
  if (e.key === 'j') focusPanel(idx + 1);
  if (e.key === 'k') focusPanel(idx - 1);
});
