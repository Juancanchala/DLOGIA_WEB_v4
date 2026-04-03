/* ═══════════════════════════════════════════
   D'LOGIA — Main Entry Point
   main.js
═══════════════════════════════════════════ */

import { initParticles }    from './particles.js';
import { initChat }          from './chat.js';
import { initAgentPreview }  from './agent-preview.js';
import { initNav, initReveal, initCounters, initFilters, initTestimonials } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initParticles('particle-canvas');
  initReveal();
  initCounters();
  initFilters();
  initTestimonials();
  initChat();
  initAgentPreview();
});
