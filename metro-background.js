// Metro Transit Map Background — Canvas 2D, zero dependencies
(function () {
  'use strict';

  const canvas = document.getElementById('metro-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // --- Seeded PRNG (Mulberry32) ---
  const SEED = 42;
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let rng = mulberry32(SEED);

  // --- Config ---
  const LINE_DEFS = [
    { color: '#4285f4', width: 22, parallax: 0.025 },
    { color: '#ea4335', width: 22, parallax: 0.020 },
    { color: '#34a853', width: 22, parallax: 0.018 },
    { color: '#1a3a6b', width: 16, parallax: 0.015 },
    { color: '#f4b400', width: 16, parallax: 0.012 },
    { color: '#ff7043', width: 16, parallax: 0.010 },
    { color: '#4fc3f7', width: 16, parallax: 0.008 },
    { color: '#7e57c2', width: 14, parallax: 0.005 },
  ];

  const CORNER_RADIUS = 25;
  const BG_COLOR = '#0a0a0a';
  const STATION_RADIUS = 6;
  const STATION_BORDER = 3;
  const TRAIN_DOT_RADIUS = 5;

  // 8 compass directions (dx, dy)
  const DIRS = [
    [0, -1], [1, -1], [1, 0], [1, 1],
    [0, 1], [-1, 1], [-1, 0], [-1, -1],
  ];

  // --- State ---
  let W, H, dpr;
  let lines = [];
  let mouse = { x: 0.5, y: 0.5 }; // normalized 0–1
  let smoothMouse = { x: 0.5, y: 0.5 };
  let prefersReducedMotion = false;
  let isMobile = false;

  // --- Resize / Generate ---
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    isMobile = W < 768;
    generateLines();
  }

  function generateLines() {
    rng = mulberry32(SEED);
    lines = [];
    const count = isMobile ? 5 : LINE_DEFS.length;
    const widthScale = isMobile ? 0.6 : Math.min(W / 1400, 1);

    for (let i = 0; i < count; i++) {
      const def = LINE_DEFS[i];
      const pts = generatePath();
      const trains = [];
      const trainCount = isMobile ? 1 : (rng() > 0.5 ? 2 : 1);
      for (let t = 0; t < trainCount; t++) {
        trains.push({ progress: rng(), speed: 0.0002 + rng() * 0.0003 });
      }
      lines.push({
        color: def.color,
        width: def.width * widthScale,
        parallax: def.parallax,
        points: pts,
        trains: trains,
        breathPhase: rng() * Math.PI * 2,
        breathPeriod: 4 + rng() * 4,
      });
    }
  }

  function generatePath() {
    const pts = [];
    const segCount = 4 + Math.floor(rng() * 5);
    const segLen = Math.max(W, H) * (0.12 + rng() * 0.15);
    // Start from a random edge
    const edge = Math.floor(rng() * 4);
    let x, y, dirIdx;
    switch (edge) {
      case 0: // top
        x = W * (0.1 + rng() * 0.8); y = -20;
        dirIdx = 3 + Math.floor(rng() * 3); // S, SE, SW-ish
        break;
      case 1: // right
        x = W + 20; y = H * (0.1 + rng() * 0.8);
        dirIdx = 5 + Math.floor(rng() * 3); // W, NW, SW
        break;
      case 2: // bottom
        x = W * (0.1 + rng() * 0.8); y = H + 20;
        dirIdx = 7 + Math.floor(rng() * 3); // N, NE, NW-ish
        break;
      default: // left
        x = -20; y = H * (0.1 + rng() * 0.8);
        dirIdx = 1 + Math.floor(rng() * 3); // E, NE, SE
        break;
    }
    pts.push({ x: x, y: y });

    for (let s = 0; s < segCount; s++) {
      const di = ((dirIdx % 8) + 8) % 8;
      const dir = DIRS[di];
      const len = segLen * (0.7 + rng() * 0.6);
      x += dir[0] * len;
      y += dir[1] * len;
      pts.push({ x: x, y: y });
      // Turn: ±1 or ±2 steps (45° or 90°)
      const turn = (rng() > 0.5 ? 1 : -1) * (rng() > 0.4 ? 1 : 2);
      dirIdx = di + turn;
    }
    return pts;
  }

  // --- Path length & point-at-distance helpers ---
  function pathLength(pts) {
    let len = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
  }

  function pointAtProgress(pts, t) {
    const total = pathLength(pts);
    let target = t * total;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      const seg = Math.sqrt(dx * dx + dy * dy);
      if (target <= seg || i === pts.length - 1) {
        const ratio = seg > 0 ? target / seg : 0;
        return {
          x: pts[i - 1].x + dx * ratio,
          y: pts[i - 1].y + dy * ratio,
        };
      }
      target -= seg;
    }
    return pts[pts.length - 1];
  }

  // --- Draw ---
  function drawLine(line, time) {
    const offsetX = (smoothMouse.x - 0.5) * W * line.parallax;
    const offsetY = (smoothMouse.y - 0.5) * H * line.parallax;
    const pts = line.points;

    // Breathing opacity
    const breath = 0.6 + 0.25 * Math.sin(time / 1000 / line.breathPeriod * Math.PI * 2 + line.breathPhase);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.globalAlpha = prefersReducedMotion ? 0.7 : breath;
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw path with rounded corners using arcTo
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      ctx.arcTo(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, CORNER_RADIUS);
    }
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();

    // Station nodes at turn points
    ctx.globalAlpha = prefersReducedMotion ? 0.8 : breath + 0.1;
    for (let i = 1; i < pts.length - 1; i++) {
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, STATION_RADIUS + STATION_BORDER, 0, Math.PI * 2);
      ctx.fillStyle = '#2d2f33';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pts[i].x, pts[i].y, STATION_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // Train dots
    if (!prefersReducedMotion) {
      for (const train of line.trains) {
        const pos = pointAtProgress(pts, train.progress);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, TRAIN_DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = line.color;
        ctx.globalAlpha = 1;
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, TRAIN_DOT_RADIUS * 2.5, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(pos.x, pos.y, TRAIN_DOT_RADIUS * 0.5, pos.x, pos.y, TRAIN_DOT_RADIUS * 2.5);
        grad.addColorStop(0, line.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.4;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function frame(time) {
    // Smooth mouse lerp
    if (!prefersReducedMotion) {
      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;
    }

    // Update train positions
    if (!prefersReducedMotion) {
      for (const line of lines) {
        for (const train of line.trains) {
          train.progress += train.speed;
          if (train.progress > 1) train.progress -= 1;
        }
      }
    }

    // Clear
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);

    // Draw all lines
    for (const line of lines) {
      drawLine(line, time);
    }

    if (!prefersReducedMotion) {
      requestAnimationFrame(frame);
    }
  }

  // --- Events ---
  function onMouseMove(e) {
    mouse.x = e.clientX / W;
    mouse.y = e.clientY / H;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX / W;
      mouse.y = e.touches[0].clientY / H;
    }
  }

  function init() {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    if (prefersReducedMotion) {
      // Single static frame
      frame(0);
    } else {
      requestAnimationFrame(frame);
    }
  }

  init();
})();
