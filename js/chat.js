/* ═══════════════════════════════════════════
   D'LOGIA — DILO Chat Widget
   chat.js
═══════════════════════════════════════════ */

let isOpen = false;
let iframeLoaded = false;

export function initChat() {
  const chatBtn    = document.getElementById('chat-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatIframe = document.getElementById('chat-iframe');

  if (!chatBtn) return;

  chatBtn.addEventListener('click', () => toggle(chatBtn, chatWindow, chatIframe));
}

function toggle(chatBtn, chatWindow, chatIframe) {
  isOpen = !isOpen;
  chatBtn.classList.toggle('open', isOpen);
  chatWindow.classList.toggle('open', isOpen);

  const notif = chatBtn.querySelector('.notif');
  if (notif) notif.remove();

  // Lazy-load iframe on first open
  if (isOpen && !iframeLoaded && chatIframe) {
    chatIframe.src = chatIframe.dataset.src;
    iframeLoaded = true;
  }
}
