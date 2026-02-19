// Click trail — traces your movement when you click and drag (aurora / constellation style)
(function () {
  const container = document.createElement('div');
  container.className = 'click-trail-container';
  container.setAttribute('aria-hidden', 'true');
  document.body.appendChild(container);

  let isDrawing = false;
  let currentTrail = null;
  let points = [];
  let chargeInterval = null;

  function getCoords(e) {
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function smoothPath(pts) {
    if (pts.length < 2) return pts;
    const smoothed = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const next = pts[i + 1];
      smoothed.push({
        x: (prev.x + curr.x * 2 + next.x) / 4,
        y: (prev.y + curr.y * 2 + next.y) / 4,
      });
    }
    smoothed.push(pts[pts.length - 1]);
    return smoothed;
  }

  function pathToD(pts) {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x} ${p.y}`).join(' ');
    return d;
  }

  function startDrawing(e) {
    if (e.target.closest('.blob3d-container')) return;
    if (e.target.closest('.terminal-inline') || e.target.closest('.terminal-panel')) return;
    if (e.target.closest('.easter-egg')) return;
    if (e.target.closest('.hero-photo')) return;
    e.preventDefault();
    if (e.type === 'mousedown') document.getSelection()?.removeAllRanges();
    isDrawing = true;
    document.body.classList.add('click-trail-drawing');
    const { x, y } = getCoords(e);
    points = [{ x, y }];

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('click-trail-svg');
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradId = 'click-trail-grad-' + Date.now();
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('gradientUnits', 'userSpaceOnUse');
    grad.setAttribute('x1', String(x));
    grad.setAttribute('y1', String(y));
    grad.setAttribute('x2', String(x));
    grad.setAttribute('y2', String(y));
    grad.innerHTML =
      '<stop offset="0%" stop-color="#d4854a" stop-opacity="0.95"/>' +
      '<stop offset="40%" stop-color="#e8a878" stop-opacity="0.7"/>' +
      '<stop offset="100%" stop-color="#d4854a" stop-opacity="0"/>';
    defs.appendChild(grad);

    const sparkGradId = 'click-trail-spark-' + Date.now();
    const sparkGrad = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    sparkGrad.setAttribute('id', sparkGradId);
    sparkGrad.innerHTML =
      '<stop offset="0%" stop-color="#fff" stop-opacity="0.9"/>' +
      '<stop offset="50%" stop-color="#e8a878" stop-opacity="0.5"/>' +
      '<stop offset="100%" stop-color="#d4854a" stop-opacity="0"/>';
    defs.appendChild(sparkGrad);
    svg.appendChild(defs);

    const d = `M ${x} ${y}`;

    const outerGlow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outerGlow.setAttribute('d', d);
    outerGlow.setAttribute('fill', 'none');
    outerGlow.setAttribute('stroke', 'rgba(212, 133, 74, 0.4)');
    outerGlow.setAttribute('stroke-width', '32');
    outerGlow.setAttribute('stroke-linecap', 'round');
    outerGlow.setAttribute('stroke-linejoin', 'round');
    outerGlow.classList.add('click-trail-outer');

    const ribbon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    ribbon.setAttribute('d', d);
    ribbon.setAttribute('fill', 'none');
    ribbon.setAttribute('stroke', `url(#${gradId})`);
    ribbon.setAttribute('stroke-width', '10');
    ribbon.setAttribute('stroke-linecap', 'round');
    ribbon.setAttribute('stroke-linejoin', 'round');
    ribbon.classList.add('click-trail-ribbon');

    const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    core.setAttribute('d', d);
    core.setAttribute('fill', 'none');
    core.setAttribute('stroke', 'rgba(255,255,255,0.9)');
    core.setAttribute('stroke-width', '2');
    core.setAttribute('stroke-linecap', 'round');
    core.setAttribute('stroke-linejoin', 'round');
    core.classList.add('click-trail-core');

    const sparks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    sparks.classList.add('click-trail-sparks');

    const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    spark.setAttribute('cx', x);
    spark.setAttribute('cy', y);
    spark.setAttribute('r', 5);
    spark.setAttribute('fill', `url(#${sparkGradId})`);
    spark.classList.add('click-trail-spark');
    sparks.appendChild(spark);

    svg.appendChild(outerGlow);
    svg.appendChild(ribbon);
    svg.appendChild(core);
    svg.appendChild(sparks);

    container.appendChild(svg);
    currentTrail = { svg, outerGlow, ribbon, core, sparks, gradId, sparkGradId, chargeLevel: 0 };

    chargeInterval = setInterval(() => {
      if (!currentTrail || points.length > 1) return;
      const pt = points[0];
      currentTrail.chargeLevel++;
      const level = currentTrail.chargeLevel;

      const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      spark.setAttribute('cx', pt.x);
      spark.setAttribute('cy', pt.y);
      spark.setAttribute('r', 4 + Math.min(level * 0.5, 6));
      spark.setAttribute('fill', `url(#${currentTrail.sparkGradId})`);
      spark.classList.add('click-trail-spark');
      currentTrail.sparks.appendChild(spark);

      const glowBase = 32 + Math.min(level * 4, 40);
      const ribbonBase = 10 + Math.min(level * 1.5, 18);
      const opacity = Math.min(0.4 + level * 0.03, 0.8);
      currentTrail.outerGlow.setAttribute('stroke-width', String(glowBase));
      currentTrail.outerGlow.setAttribute('stroke', `rgba(212, 133, 74, ${opacity})`);
      currentTrail.ribbon.setAttribute('stroke-width', String(ribbonBase));

      if (level >= 3) document.body.classList.add('cursor-charging');
      if (level >= 8) document.body.classList.add('cursor-charging-shake');
    }, 120);
  }

  function clearChargeState() {
    if (chargeInterval) {
      clearInterval(chargeInterval);
      chargeInterval = null;
    }
    document.body.classList.remove('cursor-charging', 'cursor-charging-shake');
  }

  function draw(e) {
    if (!isDrawing || !currentTrail) return;
    const { x, y } = getCoords(e);

    const last = points[points.length - 1];
    if (Math.abs(x - last.x) < 1.5 && Math.abs(y - last.y) < 1.5) return;

    clearChargeState();
    points.push({ x, y });

    const smoothed = smoothPath(points);
    const d = pathToD(smoothed);

    currentTrail.outerGlow.setAttribute('d', d);
    currentTrail.ribbon.setAttribute('d', d);
    currentTrail.core.setAttribute('d', d);

    const grad = currentTrail.svg.querySelector(`#${currentTrail.gradId}`);
    if (grad) {
      grad.setAttribute('x2', String(x));
      grad.setAttribute('y2', String(y));
    }

    if (smoothed.length >= 2) {
      const dist = Math.hypot(x - last.x, y - last.y);
      if (dist > 18 || points.length % 8 === 0) {
        const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const r = 3 + Math.random() * 4;
        spark.setAttribute('cx', x);
        spark.setAttribute('cy', y);
        spark.setAttribute('r', r);
        spark.setAttribute('fill', `url(#${currentTrail.sparkGradId})`);
        spark.classList.add('click-trail-spark');
        currentTrail.sparks.appendChild(spark);
      }
    }
  }

  function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    clearChargeState();
    document.body.classList.remove('click-trail-drawing');
    document.getSelection()?.removeAllRanges();
    if (!currentTrail) return;

    const svg = currentTrail.svg;
    svg.classList.add('click-trail-fade');
    svg.querySelectorAll('.click-trail-spark').forEach((el) => el.classList.add('click-trail-spark-out'));
    setTimeout(() => svg.remove(), 1400);
    currentTrail = null;
  }

  document.addEventListener('mousedown', startDrawing);
  document.addEventListener('mousemove', draw);
  document.addEventListener('mouseup', stopDrawing);
  document.addEventListener('mouseleave', stopDrawing);

  document.addEventListener('touchstart', startDrawing, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (isDrawing) e.preventDefault();
    draw(e);
  }, { passive: false });
  document.addEventListener('touchend', stopDrawing, { passive: true });
  document.addEventListener('touchcancel', stopDrawing, { passive: true });
})();
