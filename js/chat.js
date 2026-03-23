/* ═══════════════════════════════════════════
   D'LOGIA — AI Chat Widget
   chat.js

   Requires: CONFIG.OPENAI_KEY set in config.js
═══════════════════════════════════════════ */

import { CONFIG } from './config.js';

// ── D'LOGIA system prompt ──────────────────
const SYSTEM_PROMPT = `Eres el asistente virtual de D'LOGIA, la marca de Juan Camilo Canchala — Data & AI Engineer en Medellín, Colombia.

Tu objetivo es:
1. Entender la necesidad del visitante
2. Capturar su nombre, email y necesidad principal (con naturalidad, no como formulario)
3. Mostrar el caso del portafolio más relevante para su sector
4. Redirigir a WhatsApp cuando hay intención de contratar

Sobre D'LOGIA:
- Servicios: Data Engineering, Power BI, Automatización con IA, Consultoría de datos
- Precios: Dashboard desde 1M COP, Automatización desde 2M COP, Proyecto completo desde 4M COP
- Proceso: Diagnóstico → Diseño → Construcción → Entrega
- Logros: 93% reducción en tiempo de facturación, pipelines con 147K+ registros, CRM IA en producción
- Contacto: +57 312 494 2672 | contacto.dlogia@gmail.com

Proyectos según sector:
- Finanzas/contabilidad → Sistema de Facturación IA (93% más rápido)
- Retail/inventario → Gold Analytics System
- Inmobiliaria → CRM Inmobiliario con IA
- RRHH/datos masivos → Pipeline Salary Analytics (147K+ registros)
- Educación/coaching → Dilo English Coach
- Tech/infraestructura → CDC Real-time con Kafka

Reglas:
- Responde siempre en español, tono amigable y profesional
- Máximo 3-4 oraciones por respuesta
- Cuando el usuario mencione un problema de negocio, conecta con el proyecto relevante
- Cuando detectes intención de contratar o pedir precio, responde con el precio y ofrece agendar por WhatsApp
- Si no tienes el nombre del usuario, pídelo de forma natural después del primer mensaje
- Nunca inventes precios o servicios que no están en el contexto`;

// ── State ──────────────────────────────────
let conversationHistory = [];
let leadData = { name: null, email: null, need: null };
let isOpen = false;
let isTyping = false;

// ── DOM refs (resolved after DOMContentLoaded) ──
let chatBtn, chatWindow, chatMessages, chatInput, chatSend;

// ── Init ───────────────────────────────────
export function initChat() {
  chatBtn      = document.getElementById('chat-btn');
  chatWindow   = document.getElementById('chat-window');
  chatMessages = document.getElementById('chat-messages');
  chatInput    = document.getElementById('chat-input');
  chatSend     = document.getElementById('chat-send');

  if (!chatBtn) return;

  // Load history from localStorage
  const saved = localStorage.getItem('dlogia_chat');
  if (saved) {
    try {
      const { history, lead } = JSON.parse(saved);
      conversationHistory = history || [];
      leadData = lead || leadData;
    } catch(e) { /* ignore */ }
  }

  // Toggle window
  chatBtn.addEventListener('click', toggleChat);

  // Send on button click
  chatSend.addEventListener('click', handleSend);

  // Send on Enter (not Shift+Enter)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Auto-resize textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  });

  // Render existing messages or show welcome
  if (conversationHistory.length > 0) {
    conversationHistory.forEach(m => renderMessage(m.role, m.content, false));
  } else {
    showWelcome();
  }
}

// ── Toggle ─────────────────────────────────
function toggleChat() {
  isOpen = !isOpen;
  chatBtn.classList.toggle('open', isOpen);
  chatWindow.classList.toggle('open', isOpen);
  // Remove notification dot
  const notif = chatBtn.querySelector('.notif');
  if (notif) notif.remove();
  if (isOpen) setTimeout(() => chatInput.focus(), 300);
}

// ── Welcome message ────────────────────────
function showWelcome() {
  const welcome = `¡Hola! Soy el asistente de **D'LOGIA** 👋\n\n¿En qué te puedo ayudar hoy?`;
  renderMessage('bot', welcome, true);

  // Quick reply chips
  const chips = [
    '¿Qué servicios ofrecen?',
    '¿Cuánto cuesta un dashboard?',
    'Quiero automatizar un proceso',
    'Ver proyectos realizados',
  ];
  renderQuickReplies(chips);
}

// ── Handle send ────────────────────────────
async function handleSend() {
  const text = chatInput.value.trim();
  if (!text || isTyping) return;

  chatInput.value = '';
  chatInput.style.height = 'auto';
  chatSend.disabled = true;

  renderMessage('user', text, true);
  conversationHistory.push({ role: 'user', content: text });

  // Extract lead data from message
  extractLeadData(text);

  showTyping();
  isTyping = true;

  try {
    const reply = await callOpenAI();
    hideTyping();
    renderMessage('bot', reply, true);
    conversationHistory.push({ role: 'assistant', content: reply });
    saveHistory();

    // Show WA button if intent detected
    if (detectBuyIntent(text + ' ' + reply)) {
      renderWAButton();
    }
  } catch (err) {
    hideTyping();
    renderMessage('bot', 'Lo siento, hubo un problema al conectarme. Puedes escribirme directamente a WhatsApp: +57 312 494 2672', true);
  }

  isTyping = false;
  chatSend.disabled = false;
  chatInput.focus();
}

// ── OpenAI call ────────────────────────────
async function callOpenAI() {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.slice(-12), // last 12 messages for context
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

// ── Render helpers ─────────────────────────
function renderMessage(role, text, animate = true) {
  const msgEl = document.createElement('div');
  msgEl.className = `msg msg--${role === 'user' ? 'user' : 'bot'}`;
  if (!animate) msgEl.style.animation = 'none';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  // Simple markdown: **bold**
  bubble.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  msgEl.appendChild(bubble);
  chatMessages.appendChild(msgEl);
  scrollBottom();
}

function renderQuickReplies(chips) {
  const el = document.createElement('div');
  el.className = 'quick-replies';
  chips.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'qr-chip';
    btn.textContent = c;
    btn.addEventListener('click', () => {
      chatInput.value = c;
      el.remove();
      handleSend();
    });
    el.appendChild(btn);
  });
  chatMessages.appendChild(el);
  scrollBottom();
}

function renderWAButton() {
  const existing = chatMessages.querySelector('.chat-wa-btn');
  if (existing) return;

  const btn = document.createElement('a');
  btn.className = 'chat-wa-btn';
  btn.href = `https://wa.me/573124942672?text=Hola%20Juan%20Camilo%2C%20vengo%20del%20sitio%20web%20y%20quiero%20agendar%20una%20consulta${leadData.name ? '%20Soy%20' + encodeURIComponent(leadData.name) : ''}`;
  btn.target = '_blank';
  btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    Continuar en WhatsApp`;
  chatMessages.appendChild(btn);
  scrollBottom();
}

let typingEl = null;
function showTyping() {
  typingEl = document.createElement('div');
  typingEl.className = 'msg msg--bot';
  typingEl.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
  chatMessages.appendChild(typingEl);
  scrollBottom();
}
function hideTyping() {
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

function scrollBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ── Lead extraction ────────────────────────
function extractLeadData(text) {
  // Email detection
  const emailMatch = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && !leadData.email) leadData.email = emailMatch[0];
}

// ── Intent detection ───────────────────────
const BUY_KEYWORDS = ['precio', 'costo', 'cuánto', 'contratar', 'cotizar', 'quiero', 'necesito', 'agendar', 'llamada', 'presupuesto'];
function detectBuyIntent(text) {
  return BUY_KEYWORDS.some(k => text.toLowerCase().includes(k));
}

// ── Persist ────────────────────────────────
function saveHistory() {
  try {
    localStorage.setItem('dlogia_chat', JSON.stringify({
      history: conversationHistory.slice(-20),
      lead: leadData,
    }));
  } catch(e) { /* quota exceeded — ignore */ }
}
