// Custom cursor — dims when galaxy background is on
(function () {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  const STORAGE_KEY = 'galaxy-bg-on';
  let galaxyOn = true;
  try {
    galaxyOn = localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch (_) {}

  function cursorOpacity() {
    return galaxyOn ? '0.25' : '1';
  }

  window.addEventListener('galaxy-state-change', (e) => {
    galaxyOn = e.detail.on;
    cursor.style.opacity = cursorOpacity();
  });

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let mouseInDocument = true;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseInDocument = false;
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    mouseInDocument = true;
    cursor.style.opacity = cursorOpacity();
  });

  cursor.style.opacity = cursorOpacity();

  function animate() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();
