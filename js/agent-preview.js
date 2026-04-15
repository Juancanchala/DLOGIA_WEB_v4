/* ═══════════════════════════════════════════
   D'LOGIA — Agent Preview Pill
   agent-preview.js
═══════════════════════════════════════════ */

export function initAgentPreview() {
  const pill = document.getElementById('agent-preview-mobile');
  if (pill) setTimeout(() => pill.classList.add('ap-visible'), 1000);
}
