/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — shared site behaviour
   Nav toggle · active link · scroll reveals · footer year · Wizzy
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Mobile nav ── */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  /* ── Active nav link by filename ── */
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ── Footer year ── */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* Reveal entrance is pure CSS (.reveal animation) — no observer, so content
     is never left hidden if scripting or intersection callbacks misbehave. */

  /* ── Wizzy chatbot (injected on every page) ── */
  const bubble = document.createElement('div');
  bubble.id = 'wz-bubble';
  bubble.setAttribute('role', 'button');
  bubble.setAttribute('aria-label', 'Chat with Wizzy');
  bubble.setAttribute('tabindex', '0');
  bubble.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';

  const panel = document.createElement('div');
  panel.id = 'wz-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat with Wizzy');
  panel.innerHTML =
    '<div class="wz-head">' +
      '<div class="wz-av">W</div>' +
      '<div><div class="wz-hname">Wizzy — WSE Lab Consult</div><div class="wz-hstatus">● Online — usually replies instantly</div></div>' +
      '<button class="wz-close" aria-label="Close chat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
    '</div>' +
    '<div class="wz-msgs" id="wz-msgs"><div class="wz-msg bot">Hi, I’m Wizzy — the assistant for WSE Lab Consult. Ask about our services, products, or a project you want built, and I’ll point you the right way.</div></div>' +
    '<div class="wz-foot"><input id="wz-input" type="text" placeholder="Ask about a project…" aria-label="Message"><button id="wz-send" aria-label="Send"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div>';

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  let history = [];
  let open = false;
  const setOpen = (v) => {
    open = v;
    panel.classList.toggle('open', open);
    if (open) document.getElementById('wz-input').focus();
  };
  bubble.addEventListener('click', () => setOpen(!open));
  bubble.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open); } });
  panel.querySelector('.wz-close').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) setOpen(false); });

  const add = (text, cls) => {
    const d = document.createElement('div');
    d.className = 'wz-msg ' + cls;
    d.textContent = text;
    const box = document.getElementById('wz-msgs');
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
  };

  async function send() {
    const input = document.getElementById('wz-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    add(text, 'user');
    history.push({ role: 'user', content: text });
    const typing = add('Typing…', 'bot typing');
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Server error');
      typing.remove();
      const reply = data.reply || 'No response received.';
      add(reply, 'bot');
      history.push({ role: 'assistant', content: reply });
      if (history.length > 20) history = history.slice(-20);
    } catch (err) {
      typing.remove();
      add('Could not connect right now. Email support@wseailab.com or WhatsApp +234 816 082 9058.', 'bot');
    }
  }
  document.getElementById('wz-send').addEventListener('click', send);
  document.getElementById('wz-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
})();
