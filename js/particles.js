/* ═══════════════════════════════════════════
   D'LOGIA — Particle Canvas Engine
   particles.js
═══════════════════════════════════════════ */

export function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes, RAF;
  const ACCENT   = '108,99,255';
  const TEAL     = '0,212,170';
  const NODE_COUNT = window.innerWidth < 768 ? 40 : 72;
  const CONNECT_DIST = 140;
  const SPEED = 0.28;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomNode() {
    const isTeal = Math.random() > 0.72;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 1.8 + 0.8,
      color: isTeal ? TEAL : ACCENT,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    };
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, randomNode);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += n.pulseSpeed;

      // Wrap edges
      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;

      const pulsedR = n.r + Math.sin(n.pulse) * 0.4;
      ctx.beginPath();
      ctx.arc(n.x, n.y, pulsedR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.color},${n.opacity})`;
      ctx.fill();
    }

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.18;
          // Use accent color for edge
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${ACCENT},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    RAF = requestAnimationFrame(draw);
  }

  // Mouse repel effect
  let mouse = { x: -999, y: -999 };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    nodes.forEach(n => {
      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 80) {
        const force = (80 - d) / 80 * 0.6;
        n.vx += (dx / d) * force;
        n.vy += (dy / d) * force;
        // Clamp speed
        const spd = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
        if (spd > 1.5) { n.vx = (n.vx/spd)*1.5; n.vy = (n.vy/spd)*1.5; }
      }
    });
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(RAF);
    init();
    draw();
  });

  init();
  draw();
}
