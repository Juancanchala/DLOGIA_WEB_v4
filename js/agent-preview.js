/* ═══════════════════════════════════════════
   D'LOGIA — Hero Agent Preview Widget
   agent-preview.js
═══════════════════════════════════════════ */

const PREVIEW_CONTENT = {
  barberia: {
    user: 'Tengo una barbería',
    bot:  '¡Genial ✂️ Gestiono citas y disponibilidad en tiempo real!',
  },
  dental: {
    user: 'Tengo una clínica dental',
    bot:  'Perfecto 🦷 Agendo citas, FAQ y recordatorios automáticos',
  },
  retail: {
    user: 'Tengo una tienda online',
    bot:  '¡Excelente 🛍️ Tu agente atiende pedidos y consultas 24/7!',
  },
  empresas: {
    user: 'Tenemos 200 empleados',
    bot:  'Ideal 🏢 Automatizo onboarding, soporte TI e intranets',
  },
};

export function initAgentPreview() {
  const widget  = document.getElementById('agent-preview');
  const mBanner = document.getElementById('agent-preview-mobile');

  // ── Entrance animations ──────────────────
  if (widget)  setTimeout(() => widget.classList.add('ap-visible'),  900);
  if (mBanner) setTimeout(() => mBanner.classList.add('ap-visible'), 1200);

  if (!widget) return;

  // ── Message sequence (staggered fade-in) ─
  const msgDelays = { 'apm-1': 700, 'apm-2': 1700, 'apm-3': 2800 };
  Object.entries(msgDelays).forEach(([id, delay]) => {
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.classList.add('visible'), delay);
  });

  // ── Industry chip interaction ─────────────
  const chips     = widget.querySelectorAll('.ap-ind');
  const userBubble = document.querySelector('#apm-2 .ap-bubble');
  const botBubble  = document.querySelector('#apm-3 .ap-bubble');
  const cta        = document.getElementById('ap-cta');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const content = PREVIEW_CONTENT[chip.dataset.i];
      if (!content) return;

      // Fade-swap user bubble
      if (userBubble) {
        userBubble.style.opacity = '0';
        setTimeout(() => {
          userBubble.textContent = content.user;
          userBubble.style.opacity = '1';
        }, 160);
      }

      // Fade-swap bot bubble (keep cursor via CSS ::after)
      if (botBubble) {
        botBubble.style.opacity = '0';
        setTimeout(() => {
          botBubble.textContent = content.bot;
          botBubble.style.opacity = '1';
        }, 240);
      }

      // Update CTA href so the studio can pre-select the industry
      if (cta) cta.href = `agentes/dlogia-agent-studio.html?industry=${chip.dataset.i}`;
    });
  });
}
