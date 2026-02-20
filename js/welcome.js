/**
 * Welcome screen — first-visit choice: explore with or without galaxy stars.
 * Aurora shader background (vanilla Three.js), animated buttons.
 */
(function () {
  const WELCOME_DONE_KEY = 'welcome-done';
  const GALAXY_KEY = 'galaxy-bg-on';

  const screen = document.getElementById('welcome-screen');
  const auroraEl = document.getElementById('welcome-aurora');
  if (!screen || !auroraEl) return;

  function isWelcomeDone() {
    try {
      var doneThisSession = sessionStorage.getItem(WELCOME_DONE_KEY) === 'true';
      var hasGalaxyPreference = localStorage.getItem(GALAXY_KEY) !== null && localStorage.getItem(GALAXY_KEY) !== undefined;
      return doneThisSession && hasGalaxyPreference;
    } catch (_) {
      return false;
    }
  }

  if (isWelcomeDone()) {
    screen.classList.add('welcome-done');
    return;
  }

  document.body.classList.add('welcome-active');

  var cursorEl = null;
  var cursorRafId = null;
  var mouseX = 0, mouseY = 0;
  var cursorX = 0, cursorY = 0;
  var cursorInitialized = false;
  var spinAngle = 0;
  var spinDuration = 2;

  var cursorMoveHandler = function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!cursorInitialized) {
      cursorInitialized = true;
      cursorX = mouseX;
      cursorY = mouseY;
    }
  };
  var cursorHoverInHandler = function () {
    if (cursorEl) cursorEl.classList.add('welcome-cursor-hover');
  };
  var cursorHoverOutHandler = function () {
    if (cursorEl) cursorEl.classList.remove('welcome-cursor-hover');
  };

  function initTargetCursor() {
    cursorEl = document.createElement('div');
    cursorEl.className = 'welcome-target-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    screen.appendChild(cursorEl);

    document.addEventListener('mousemove', cursorMoveHandler);
    screen.querySelectorAll('.welcome-btn').forEach(function (btn) {
      btn.addEventListener('mouseenter', cursorHoverInHandler);
      btn.addEventListener('mouseleave', cursorHoverOutHandler);
    });

    function tick() {
      cursorRafId = requestAnimationFrame(tick);
      var lerp = 0.12;
      cursorX += (mouseX - cursorX) * lerp;
      cursorY += (mouseY - cursorY) * lerp;
      spinAngle += (Math.PI * 2 / (spinDuration * 60)) * 60 / 60;
      if (cursorEl) {
        cursorEl.style.left = cursorX + 'px';
        cursorEl.style.top = cursorY + 'px';
        cursorEl.style.transform = 'translate(-50%, -50%) rotate(' + spinAngle + 'rad)';
      }
    }
    tick();
  }

  function disposeTargetCursor() {
    document.removeEventListener('mousemove', cursorMoveHandler);
    screen.querySelectorAll('.welcome-btn').forEach(function (btn) {
      btn.removeEventListener('mouseenter', cursorHoverInHandler);
      btn.removeEventListener('mouseleave', cursorHoverOutHandler);
    });
    if (cursorRafId) {
      cancelAnimationFrame(cursorRafId);
      cursorRafId = null;
    }
    if (cursorEl && cursorEl.parentNode) cursorEl.parentNode.removeChild(cursorEl);
    cursorEl = null;
  }

  initTargetCursor();

  let auroraRenderer = null;
  let auroraScene = null;
  let auroraCamera = null;
  let auroraMesh = null;
  let auroraMaterial = null;
  let rafId = null;

  const vertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float iTime;
    uniform vec2 iResolution;

    #define NUM_OCTAVES 3

    float rand(vec2 n) {
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);

      float res = mix(
        mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
        mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
      return res * res;
    }

    float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.3;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.4;
      }
      return v;
    }

    void main() {
      vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
      vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
      vec2 v;
      vec4 o = vec4(0.0);

      float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

      for (float i = 0.0; i < 35.0; i++) {
        v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
        float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
        vec4 auroraColors = vec4(
          0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
          0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
          0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
          1.0
        );
        vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
        float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
        o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
      }

      o = tanh(pow(o / 100.0, vec4(1.6)));
      gl_FragColor = o * 1.5;
    }
  `;

  function initAurora() {
    if (typeof THREE === 'undefined') return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    auroraEl.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthWrite: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function animate() {
      rafId = requestAnimationFrame(animate);
      material.uniforms.iTime.value += 0.016;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    auroraRenderer = renderer;
    auroraScene = scene;
    auroraCamera = camera;
    auroraMesh = mesh;
    auroraMaterial = material;
    auroraRenderer._resizeHandler = onResize;
  }

  function disposeAurora() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (auroraRenderer) {
      window.removeEventListener('resize', auroraRenderer._resizeHandler);
      if (auroraEl.contains(auroraRenderer.domElement)) {
        auroraEl.removeChild(auroraRenderer.domElement);
      }
      auroraRenderer.dispose();
      auroraRenderer = null;
    }
    if (auroraMesh && auroraMesh.geometry) auroraMesh.geometry.dispose();
    if (auroraMaterial) auroraMaterial.dispose();
    auroraScene = null;
    auroraCamera = null;
    auroraMesh = null;
    auroraMaterial = null;
  }

  function choose(starsOn) {
    disposeTargetCursor();
    document.body.classList.remove('welcome-active');
    try {
      sessionStorage.setItem(WELCOME_DONE_KEY, 'true');
      localStorage.setItem(GALAXY_KEY, starsOn ? 'true' : 'false');
    } catch (_) {}

    window.dispatchEvent(new CustomEvent('galaxy-state-change', { detail: { on: starsOn } }));
    if (starsOn) {
      window.dispatchEvent(new CustomEvent('galaxy-show'));
    } else {
      window.dispatchEvent(new CustomEvent('galaxy-hide'));
    }

    screen.classList.add('welcome-done');
    screen.setAttribute('aria-hidden', 'true');

    setTimeout(disposeAurora, 650);
  }

  screen.querySelectorAll('.welcome-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var stars = this.getAttribute('data-stars') === 'true';
      choose(stars);
    });
  });

  initAurora();
})();
