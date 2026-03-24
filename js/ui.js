/* ═══════════════════════════════════════════
   D'LOGIA — UI Interactions
   ui.js
═══════════════════════════════════════════ */

// ── Nav scroll behavior ───────────────────
export function initNav() {
  const nav = document.getElementById('nav');
  const links = nav?.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  // Scrolled state
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);

    // Active link highlight
    if (!links) return;
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // Logo compile animation
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    const text = logo.textContent;
    logo.innerHTML = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch === "'" ? '' : ch;
      if (ch === "'") {
        span.textContent = "'";
        span.classList.add('apostrophe');
      }
      span.style.animationDelay = `${i * 0.04}s`;
      logo.appendChild(span);
    });
  }

  // Mobile hamburger
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
  });
  // Close on link click
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── Scroll reveal ─────────────────────────
export function initReveal() {
  const targets = document.querySelectorAll(
    '.pcard, .srv-card, .proc-step, .achv, .price-card, .testi-card, .about-grid > *'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        // Stagger based on position in parent
        const siblings = [...e.target.parentElement.children];
        const i = siblings.indexOf(e.target);
        e.target.style.transitionDelay = `${i * 0.07}s`;
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

// ── Counter animation ─────────────────────
export function initCounters() {
  const stats = document.querySelectorAll('.stat__num');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);

      const el = e.target;
      const text = el.textContent;
      // Extract number and suffix
      const match = text.match(/^(\d+)(.*)$/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = match[2]; // e.g. "%" or "+"
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.innerHTML = `${current}<span class="accent">${suffix}</span>`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => io.observe(s));
}

// ── Portfolio filter ──────────────────────
export function initFilters() {
  const btns  = document.querySelectorAll('.fbtn');
  const cards = document.querySelectorAll('.pcard');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter || 'all';
      cards.forEach(card => {
        const type = card.dataset.type || '';
        const show = filter === 'all' || type === filter;
        card.style.opacity = show ? '1' : '0.25';
        card.style.pointerEvents = show ? 'all' : 'none';
        card.style.transform = show ? 'scale(1)' : 'scale(0.97)';
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      });
    });
  });
}

// ── Testimonials ──────────────────────────
const DUMMY_TESTIMONIALS = [
  {
    name: 'Carlos Restrepo',
    role: 'Gerente de Operaciones — LogiCar SAS',
    text: 'Nuestro proceso de reportes nos tomaba hasta <strong>2 días cada semana</strong> y siempre había errores en la información. D\'LOGIA automatizó todo el flujo y hoy lo tenemos en minutos, con datos confiables. La inversión se pagó en el primer mes.',
    stars: 5,
    color: 'rgba(108,99,255,0.15)',
    textColor: '#6c63ff',
  },
  {
    name: 'Valentina Torres',
    role: 'Directora Comercial — Habitat Group',
    text: 'Gestionábamos los leads de forma manual y no teníamos visibilidad del pipeline. D\'LOGIA implementó un CRM con IA que nos permitió priorizar clientes y tomar decisiones más rápido. Hoy tenemos control total del pipeline y <strong>aumentamos el cierre en un 30%</strong>.',
    stars: 5,
    color: 'rgba(0,212,170,0.12)',
    textColor: '#00d4aa',
  },
  {
    name: 'Andrés Muñoz',
    role: 'CFO — Distribuidora Andina',
    text: 'Teníamos información en varios Excel y nadie sabía cuál era el dato correcto. D\'LOGIA centralizó todo en un dashboard que hoy usa la junta directiva semanalmente. Pasamos de <strong>incertidumbre total a tomar decisiones con datos claros</strong>.',
    stars: 5,
    color: 'rgba(255,107,107,0.1)',
    textColor: '#ff6b6b',
  },
  {
    name: 'Sara Londoño',
    role: 'CEO — Contamos+',
    text: 'El proceso de facturación nos consumía hasta <strong>8 horas diarias</strong> y era completamente manual. D\'LOGIA automatizó el sistema y hoy todo se ejecuta en menos de 30 minutos. Pudimos liberar tiempo operativo y enfocarnos en crecer.',
    stars: 5,
    color: 'rgba(255,209,102,0.1)',
    textColor: '#ffd166',
  },
  {
    name: 'Armando Pérez',
    role: 'CEO — Asesorías Legales',
    text: 'Revisar contratos nos tomaba horas y era difícil identificar requerimientos clave. Con el sistema de IA que implementó D\'LOGIA ahora analizamos documentos en minutos. <strong>Reducimos el tiempo en un 85%</strong>.',
    stars: 5,
    color: 'rgba(0,212,170,0.10)',
    textColor: '#00d4aa',
  },
];

function getInitials(name) {
  return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
}

function renderTestimonials() {
  const grid = document.getElementById('testi-grid');
  if (!grid) return;

  // Load from localStorage
  const saved = JSON.parse(localStorage.getItem('dlogia_testimonials') || '[]');
  const all = [...DUMMY_TESTIMONIALS, ...saved];

  grid.innerHTML = '';
  all.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testi-card';
    card.innerHTML = `
      <div class="testi-stars">${'<span class="testi-star">★</span>'.repeat(t.stars)}</div>
      <p class="testi-text">"${t.text}"</p>
      <div class="testi-author">
        <div class="testi-avatar" style="background:${t.color};color:${t.textColor}">${getInitials(t.name)}</div>
        <div class="testi-info">
          <div class="testi-name">${t.name}</div>
          <div class="testi-role">${t.role}</div>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

export function initTestimonials() {
  renderTestimonials();

  // Modal
  const overlay = document.getElementById('modal-overlay');
  const addBtn  = document.getElementById('testi-add-btn');
  const cancel  = document.getElementById('modal-cancel');
  const form    = document.getElementById('testi-form');
  const stars   = document.querySelectorAll('.star-pick');

  let selectedStars = 5;

  stars.forEach((s, i) => {
    s.addEventListener('mouseover', () => stars.forEach((x, j) => x.classList.toggle('active', j <= i)));
    s.addEventListener('mouseout',  () => stars.forEach((x, j) => x.classList.toggle('active', j < selectedStars)));
    s.addEventListener('click',     () => { selectedStars = i + 1; });
  });
  // Init stars
  stars.forEach((x, j) => x.classList.toggle('active', j < selectedStars));

  addBtn?.addEventListener('click', () => overlay?.classList.add('open'));
  cancel?.addEventListener('click', () => overlay?.classList.remove('open'));
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const newT = {
      name:      fd.get('name') || 'Anónimo',
      role:      fd.get('role') || 'Cliente',
      text:      fd.get('message') || '',
      stars:     selectedStars,
      color:     'rgba(108,99,255,0.12)',
      textColor: '#6c63ff',
    };
    const saved = JSON.parse(localStorage.getItem('dlogia_testimonials') || '[]');
    saved.push(newT);
    localStorage.setItem('dlogia_testimonials', JSON.stringify(saved));
    overlay?.classList.remove('open');
    form.reset();
    renderTestimonials();
    // Re-observe new cards
    initReveal();
  });
}
