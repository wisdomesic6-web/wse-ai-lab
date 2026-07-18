/* ═══════════════════════════════════════════════════════════════
   WSE Lab Consult — shared site behaviour
   Loader · nav · reveals · count-up · word-split · placeholders ·
   products data + grid + detail · form · Wizzy + WhatsApp floats
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WHATSAPP_URL = 'https://wa.me/2348160829058';

  /* ═══ Product catalogue — single source of truth ═══ */
  var PRODUCTS = [
    {
      slug: 'memora-os', name: 'Memora OS', status: 'live', tag: 'AI Assistant · Multi-tenant SaaS',
      url: 'https://memora-os.vercel.app',
      desc: 'Private AI assistant for African businesses with persistent memory, team access, and live search.',
      long: [
        'Memora OS is a private AI assistant built for African businesses. Unlike generic chatbots, it keeps a persistent memory of your business — your products, your customers, your way of working — so every answer gets sharper the longer you use it.',
        'Teams share one workspace with role-based access. It searches the live web, listens and speaks with voice in and out, and understands images — receipts, product photos, documents.',
        'Your data stays in your workspace. Memora runs multi-tenant SaaS infrastructure with strict isolation between businesses.'
      ],
      features: ['Persistent business memory that compounds', 'Team workspaces with role-based access', 'Live web search built in', 'Voice in/out and image understanding', 'Strict per-business data isolation']
    },
    {
      slug: 'wse-datapilot', name: 'WSE Datapilot', status: 'live', tag: 'Analytics · Business Intelligence',
      url: 'https://wse-datapilot.vercel.app', logo: 'assets/products/wse-datapilot.svg',
      desc: 'Plug in your data, get plain-English reports, trends, and anomaly flags — no data team required.',
      long: [
        'WSE Datapilot is an AI-powered analytics platform for businesses that don’t have — and don’t want to hire — a data team. Connect your data sources and it does the analyst’s job: finds the trends, flags the anomalies, and writes the report.',
        'Every insight is delivered in plain English, not dashboards you need training to read. Ask questions in normal language and get answers backed by your own numbers.',
        'Built for the operational reality of African SMEs: messy spreadsheets welcome.'
      ],
      features: ['Connects to your existing data sources', 'Plain-English automated reports', 'Trend detection and anomaly flags', 'Ask questions in natural language', 'No data team required']
    },
    {
      slug: 'wse-audit-system', name: 'WSE Audit System', status: 'live', tag: 'Accounting · ICAN / ISA 2024',
      url: 'https://wseauditsystem.netlify.app', logo: 'assets/products/wse-audit-system.svg',
      desc: 'Audit intelligence for Nigerian accounting firms — ICAN and ISA 2024 compliant, with an AI copilot.',
      long: [
        'WSE Audit System is a SaaS audit intelligence platform built for Nigerian accounting firms. It is compliant with ICAN requirements and the ISA 2024 standards, so firms can modernise without compliance risk.',
        'An AI copilot works alongside the audit team: fraud detection across transaction patterns, trial balance validation, and automated financial statement generation.',
        'What took a junior team days now takes an afternoon — with a full audit trail of every judgement.'
      ],
      features: ['ICAN & ISA 2024 compliant workflows', 'AI copilot for audit teams', 'Fraud detection on transaction patterns', 'Trial balance validation', 'Financial statement generation']
    },
    {
      slug: 'wse-soundhub', name: 'WSE SoundHub', status: 'live', tag: 'E-commerce · Musical Instruments',
      url: 'https://wsesound-hub.netlify.app', logo: 'assets/products/wse-soundhub.svg',
      desc: 'Nigerian musical-instrument e-commerce with a full Supabase backend and complete admin console.',
      long: [
        'WSE SoundHub is a Nigerian musical instrument e-commerce platform running on a full Supabase backend — products, orders, customers, and payments in one system.',
        'The admin console covers the whole operation: analytics, product management, order processing, CRM, email campaigns, and market intelligence.',
        'It is a working demonstration of the commerce stack we build for retail clients.'
      ],
      features: ['Full storefront with cart and checkout', 'Supabase backend — products, orders, auth', 'Admin console: analytics, CRM, campaigns', 'Email marketing built in', 'Market intelligence dashboard']
    },
    {
      slug: 'solwise-realty-ai', name: 'Solwise Realty AI', status: 'live', tag: 'Real Estate · Nigeria',
      url: 'https://solwise-realty-ai.netlify.app',
      desc: 'AI platform for Nigerian real-estate agencies — WhatsApp lead capture, listings, and follow-ups.',
      long: [
        'Solwise Realty AI is an AI-powered SaaS platform for Nigerian real estate agencies. Its WhatsApp chatbot captures and qualifies leads where Nigerian property conversations actually happen — on WhatsApp.',
        'Agencies manage property listings, run automated follow-up sequences, and track every lead through a full agency dashboard.',
        'No lead goes cold because an agent was busy: the system follows up automatically until a human needs to step in.'
      ],
      features: ['WhatsApp chatbot for lead capture', 'Property listing management', 'Automated follow-up sequences', 'Full agency dashboard', 'Lead qualification and routing']
    },
    {
      slug: 'smartsales', name: 'SmartSales', status: 'building', tag: 'Retail · Business Management',
      url: null, logo: 'assets/products/smartsales.svg',
      desc: 'Mobile-first business management for African retailers — customers, payments, cashflow, AI insights.',
      long: [
        'SmartSales is a mobile-first business management app for African retailers. It covers the essentials a small retail business runs on: customer management, business profiles, payments, and cashflow tracking.',
        'On top of the records sits an AI layer that turns the numbers into plain-English business insights — what is selling, what is stalling, and where the cash is going.',
        'Currently in development in the WSE workshop.'
      ],
      features: ['Customer and business profile management', 'Payments and cashflow tracking', 'Plain-English AI business insights', 'Mobile-first, low-data design']
    },
    {
      slug: 'wse-academy', name: 'WSE Academy', status: 'building', tag: 'Education · School Management',
      url: null,
      desc: 'School management for Nigerian schools — classes, students, admin, with SMS/WhatsApp integrations.',
      long: [
        'WSE Academy is a school management system built for Nigerian schools. It handles classes, students, and day-to-day admin operations in one place.',
        'Planned integrations wire the school into the channels parents actually use: SMS, email, WhatsApp, and payment collection.',
        'Currently in development in the WSE workshop.'
      ],
      features: ['Class and student management', 'Admin operations in one place', 'SMS, email & WhatsApp notifications', 'School fee payment integration']
    },
    {
      slug: 'wizzy-ai', name: 'Wizzy AI Assistant', status: 'building', tag: 'AI · Conversational Assistant',
      url: null,
      desc: 'Standalone AI assistant for everyday business tasks — questions, drafting, documents, workflows.',
      long: [
        'Wizzy is a standalone AI assistant for everyday business tasks — answering questions, drafting content, summarising documents, and executing workflows through voice or chat.',
        'A version of Wizzy already runs on this website as our front-of-house assistant. The product version brings the same capability to any business.',
        'Currently in development in the WSE workshop.'
      ],
      features: ['Question answering on your business', 'Content drafting and summarisation', 'Workflow execution via chat or voice', 'Deployable on web or messaging channels']
    },
    {
      slug: 'wse-trading-bot', name: 'WSE Trading Bot', status: 'building', tag: 'Forex · MetaTrader 5',
      url: null,
      desc: 'Autonomous MT5 forex bot — confluence analysis, smart-money entries, hard risk controls.',
      long: [
        'WSE Trading Bot is an autonomous forex trading system on MetaTrader 5. It trades on multi-timeframe confluence analysis with smart-money entry logic.',
        'Risk is controlled by hard rules, not hope: partial-close logic, a 3% daily circuit breaker, and full trade logging to Sheets with Telegram alerts on every action.',
        'Currently in development in the WSE workshop.'
      ],
      features: ['Multi-timeframe confluence analysis', 'Smart-money entry logic', 'Partial-close position management', '3% daily circuit breaker', 'Telegram alerts + Sheets logging']
    },
    {
      slug: 'ai-lead-generator', name: 'AI Lead Generator', status: 'building', tag: 'Automation · Lead Prospecting',
      url: null,
      desc: 'n8n pipeline that finds businesses with weak websites and strong reviews, then drafts the outreach.',
      long: [
        'AI Lead Generator is an n8n-powered prospecting pipeline. It finds local businesses with poor websites but strong Google reviews — businesses that are winning offline and losing online.',
        'Each prospect is scored Hot, Warm, or Ignore, and the system delivers a weekly report with AI-written outreach emails ready to send.',
        'Google Maps, website scraping, Claude AI, and Airtable — wired into one fully automated pipeline. Currently in development.'
      ],
      features: ['Finds businesses with weak web presence', 'Hot/Warm/Ignore lead scoring', 'AI-written outreach emails', 'Weekly automated reports', 'Google Maps + Airtable pipeline']
    },
    {
      slug: 'wse-postpilot', name: 'WSE PostPilot AI', status: 'building', tag: 'Content · Social Media',
      url: null,
      desc: 'AI content engine — daily platform-optimised posts across LinkedIn, Instagram, Facebook, and X.',
      long: [
        'WSE PostPilot AI is a content engine for African businesses. From a single business brief it generates daily posts, each optimised for the platform it lands on — LinkedIn, Instagram, Facebook, and X.',
        'Consistency is what grows accounts, and consistency is exactly what busy founders cannot maintain by hand. PostPilot removes the bottleneck.',
        'Currently in development in the WSE workshop.'
      ],
      features: ['Daily post generation from one brief', 'Per-platform optimisation', 'LinkedIn, Instagram, Facebook, X', 'Brand voice consistency']
    },
    {
      slug: 'wse-autoreply', name: 'WSE AutoReply Chatbot', status: 'building', tag: 'Automation · Customer Support',
      url: null,
      desc: 'Support chatbot that answers enquiries, qualifies leads, and escalates to a human when needed.',
      long: [
        'WSE AutoReply Chatbot is an intelligent support agent that handles customer enquiries, qualifies inbound leads, and escalates complex issues to a human agent with full context.',
        'It deploys on your website or any messaging channel, and it answers from your business knowledge — not generic scripts.',
        'Currently in development in the WSE workshop.'
      ],
      features: ['Answers from your business knowledge', 'Inbound lead qualification', 'Human escalation with context', 'Website or messaging channel deploy']
    },
    {
      slug: 'whatsapp-autoreply', name: 'WhatsApp AutoReply', status: 'building', tag: 'WhatsApp · Business Messaging',
      url: null,
      desc: 'Automated WhatsApp responses for Nigerian businesses — FAQs, orders, bookings, lead capture, 24/7.',
      long: [
        'WhatsApp AutoReply is an automated response system for Nigerian businesses on the channel their customers already use. It handles FAQs, sends order updates, books appointments, and captures leads around the clock.',
        'No human on standby, no missed messages at 11pm — the system holds the conversation until a person needs to take over.',
        'Currently in development in the WSE workshop.'
      ],
      features: ['24/7 automated FAQ responses', 'Order updates and appointment booking', 'Lead capture into your CRM', 'Human handover when needed']
    }
  ];

  function productInitials(name) {
    return name.replace(/^WSE\s+/i, '').split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  }

  /* ═══ Loading screen (index only; once per session) ═══ */
  var loader = document.getElementById('loader');
  if (loader) {
    if (sessionStorage.getItem('wseLoaderShown')) {
      loader.remove();
    } else {
      sessionStorage.setItem('wseLoaderShown', '1');
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(function () {
        loader.classList.add('done');
        setTimeout(function () { loader.remove(); }, 600);
      }, reduced ? 150 : 1900);
    }
  }

  /* ═══ Mobile nav (full white overlay) ═══ */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ═══ Active nav link by filename ═══ */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (page === 'product.html') page = 'products.html';
  document.querySelectorAll('.nav-links a[data-nav]').forEach(function (link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    if (href.indexOf('#') !== -1) return; // anchor links (Pricing) never mark active
    var isActive = href === page || (page === '' && href === 'index.html');
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
  });

  /* ═══ Image placeholders — swap missing assets for illustrated branded blocks ═══
     Portraits get an abstract bust silhouette; products get a mini app-mockup
     screenshot (one of three layouts, chosen deterministically per product so
     the same card always looks the same). Both swap for the real asset the
     instant it exists at the same path — no code changes needed. */
  var phSeq = 0;
  function textSeed(text) {
    var sum = 0;
    for (var i = 0; i < text.length; i++) sum += text.charCodeAt(i);
    return sum;
  }
  function buildPlaceholder(img) {
    var kind = img.getAttribute('data-ph');
    var label = img.getAttribute('data-ph-label') || 'WSE';
    var cap = img.getAttribute('data-ph-cap') || '';
    var ph = document.createElement('div');

    if (kind === 'logo') {
      ph.innerHTML = '<span class="brand-mark">WSE</span>';
      ph.style.display = 'inline-flex';
      img.replaceWith(ph.firstChild);
      return;
    }

    if (kind === 'photo') {
      var gid = 'bust-grad-' + (phSeq++);
      ph.className = 'ph ph-photo';
      ph.innerHTML =
        '<svg class="ph-bust" viewBox="0 0 200 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
          '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#ffffff" stop-opacity=".2"/>' +
            '<stop offset="1" stop-color="#ffffff" stop-opacity=".05"/>' +
          '</linearGradient></defs>' +
          '<circle cx="100" cy="90" r="50" fill="url(#' + gid + ')"/>' +
          '<path d="M14 250 C14 168 54 142 100 142 C146 142 186 168 186 250 Z" fill="url(#' + gid + ')"/>' +
        '</svg>' +
        '<span class="ph-badge">' + label + '</span>' +
        (cap ? '<span class="ph-cap">' + cap + '</span>' : '');
      img.replaceWith(ph);
      return;
    }

    if (kind === 'product') {
      var variant = textSeed(cap || label) % 3;
      var body =
        variant === 0
          ? '<div class="pa-row w70"></div><div class="pa-blocks"><b></b><b></b><b></b></div><div class="pa-row w40 accent"></div>'
          : variant === 1
          ? '<div class="pa-row w55"></div><div class="pa-row w85"></div><div class="pa-row w40 accent"></div><div class="pa-row w70"></div>'
          : '<div class="pa-blocks"><b></b><b></b></div><div class="pa-row w70"></div><div class="pa-row w55 accent"></div>';
      ph.className = 'ph ph-app';
      ph.innerHTML =
        '<div class="pa-bar"><i></i><i></i><i></i></div>' +
        '<div class="pa-body">' + body + '</div>' +
        '<div class="pa-foot"><span class="pa-mono">' + label + '</span><span class="pa-name">' + cap + '</span></div>';
      img.replaceWith(ph);
      return;
    }

    ph.className = 'ph';
    ph.innerHTML = '<span class="ph-ini">' + label + '</span>' + (cap ? '<span class="ph-cap">' + cap + '</span>' : '');
    img.replaceWith(ph);
  }
  function wirePlaceholders(root) {
    (root || document).querySelectorAll('img[data-ph]').forEach(function (img) {
      if (img.getAttribute('data-ph') === 'photo') return; // handled by wirePhoto(), which is async
      if (img.complete && img.naturalWidth === 0) { buildPlaceholder(img); return; }
      img.addEventListener('error', function () { buildPlaceholder(img); });
    });
  }
  wirePlaceholders();

  /* ═══ Founder photo — checks Vercel Blob for a self-service upload
     (see admin-photo.html) before falling back to the static asset ═══ */
  function wirePhoto(root) {
    var imgs = (root || document).querySelectorAll('img[data-ph="photo"]');
    if (!imgs.length) return;
    function fallback() {
      imgs.forEach(function (img) {
        if (img.complete && img.naturalWidth === 0) { buildPlaceholder(img); return; }
        img.addEventListener('error', function () { buildPlaceholder(img); });
      });
    }
    fetch('/api/photo-url').then(function (r) { return r.json(); }).then(function (data) {
      if (data && data.url) { imgs.forEach(function (img) { img.src = data.url; }); }
      fallback();
    }).catch(fallback);
  }
  wirePhoto();

  /* ═══ Scroll reveals ═══ */
  function wireReveals(root) {
    var els = (root || document).querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  }
  wireReveals();

  /* ═══ Hero headline — word-by-word fade up ═══ */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'w';
      span.style.setProperty('--i', i);
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ═══ Count-up numbers on scroll ═══ */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('requestAnimationFrame' in window)) {
      el.textContent = prefix + target + suffix;
      return;
    }
    var duration = 1400;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var countEls = document.querySelectorAll('[data-count]');
  if (countEls.length && 'IntersectionObserver' in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    countEls.forEach(function (el) { countObs.observe(el); });
  } else {
    countEls.forEach(countUp);
  }

  /* ═══ Footer year ═══ */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ═══ Products grid (products.html) ═══ */
  var grid = document.getElementById('prodGrid');
  if (grid) {
    function cardHtml(p) {
      var badge = p.status === 'live'
        ? '<span class="badge live">Live</span>'
        : '<span class="badge building">Building</span>';
      var visit = p.url
        ? '<a class="link-arrow accent" href="' + p.url + '" target="_blank" rel="noopener">Visit <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></a>'
        : '';
      var favicon = p.logo ? '<img src="' + p.logo + '" alt="">' : '';
      return '<article class="card prod-card reveal" data-status="' + p.status + '" data-href="product.html?p=' + p.slug + '" role="link" tabindex="0" aria-label="' + p.name + ' details">' +
        '<div class="prod-chrome"><span class="pc-dots"><i></i><i></i><i></i></span><span class="pc-tab">' + favicon + p.name + '</span>' + badge + '</div>' +
        '<div class="prod-media"><img src="assets/example.png" alt="' + p.name + ' preview" loading="lazy" data-ph="product" data-ph-label="' + productInitials(p.name) + '" data-ph-cap="' + p.name + '"></div>' +
        '<div class="prod-body">' +
          '<div class="prod-top"><h3>' + p.name + '</h3></div>' +
          '<div class="prod-tag">' + p.tag + '</div>' +
          '<p>' + p.desc + '</p>' +
          '<div class="prod-links"><span class="link-arrow">View details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>' + visit + '</div>' +
        '</div></article>';
    }
    function renderGrid(filter) {
      var list = PRODUCTS.filter(function (p) { return filter === 'all' || p.status === filter; });
      grid.innerHTML = list.map(cardHtml).join('');
      wirePlaceholders(grid);
      wireReveals(grid);
      grid.querySelectorAll('[data-href]').forEach(function (card) {
        function go() { location.href = card.getAttribute('data-href'); }
        card.addEventListener('click', function (e) {
          if (e.target.closest('a')) return;
          go();
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && !e.target.closest('a')) go();
        });
      });
    }
    renderGrid('all');
    document.querySelectorAll('.filter-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        renderGrid(tab.getAttribute('data-filter'));
      });
    });
  }

  /* ═══ Product detail (product.html?p=slug) ═══ */
  var detail = document.getElementById('prodDetail');
  if (detail) {
    var slug = new URLSearchParams(location.search).get('p');
    var product = PRODUCTS.find(function (p) { return p.slug === slug; });
    if (!product) {
      location.replace('products.html');
    } else {
      document.title = product.name + ' — WSE Lab Consult';
      var badge = product.status === 'live'
        ? '<span class="badge live">Live</span>'
        : '<span class="badge building">Building</span>';
      var visitBtn = product.url
        ? '<a class="btn btn-primary" style="width:100%;justify-content:center;margin-top:20px" href="' + product.url + '" target="_blank" rel="noopener">Visit Product <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></a>'
        : '<p style="margin-top:20px;font-size:13.5px;color:var(--muted)">This product is in the workshop — <a href="contact.html">ask about early access</a>.</p>';
      var detailFavicon = product.logo ? '<img src="' + product.logo + '" alt="">' : '';
      var related = PRODUCTS.filter(function (p) { return p.slug !== product.slug && p.status === product.status; }).slice(0, 3);
      if (related.length < 3) {
        related = related.concat(PRODUCTS.filter(function (p) {
          return p.slug !== product.slug && related.indexOf(p) === -1;
        }).slice(0, 3 - related.length));
      }
      detail.innerHTML =
        '<a class="link-arrow" href="products.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transform:rotate(180deg)"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> Back to Products</a>' +
        '<div class="detail-hero" style="margin-top:24px">' +
          '<div class="prod-chrome"><span class="pc-dots"><i></i><i></i><i></i></span><span class="pc-tab">' + detailFavicon + product.name + '</span>' + badge + '</div>' +
          '<div class="dh-media"><img src="assets/example.png" alt="' + product.name + ' preview" data-ph="product" data-ph-label="' + productInitials(product.name) + '" data-ph-cap="' + product.name + '"></div>' +
        '</div>' +
        '<div class="detail-grid">' +
          '<div class="detail-body">' +
            '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:8px">' + badge + '<span class="prod-tag" style="margin:0">' + product.tag + '</span></div>' +
            '<h1 class="h-lg" style="margin:10px 0 22px">' + product.name + '</h1>' +
            product.long.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
          '</div>' +
          '<aside class="detail-side"><div class="card">' +
            '<span class="card-kicker">Key features</span>' +
            '<ul class="feature-list" style="margin-top:16px">' + product.features.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
            visitBtn +
          '</div></aside>' +
        '</div>' +
        '<div style="margin-top:clamp(48px,5vw,80px)">' +
          '<span class="eyebrow">Related products</span>' +
          '<div class="grid g-3" style="margin-top:22px">' + related.map(function (p) {
            var rBadge = p.status === 'live' ? '<span class="badge live">Live</span>' : '<span class="badge building">Building</span>';
            return '<a class="card" style="display:block;text-decoration:none" href="product.html?p=' + p.slug + '">' +
              '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><h3 class="h-sm" style="margin:0">' + p.name + '</h3>' + rBadge + '</div>' +
              '<p style="margin-top:10px;font-size:14px">' + p.desc + '</p></a>';
          }).join('') + '</div>' +
        '</div>';
      wirePlaceholders(detail);
    }
  }

  /* ═══ Contact form → Formspree ═══ */
  var form = document.getElementById('inquiryForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var button = document.getElementById('formSubmitBtn');
      var originalHtml = button.innerHTML;
      button.textContent = 'Sending…';
      button.disabled = true;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('Formspree returned ' + res.status);
        form.style.display = 'none';
        document.getElementById('formSent').classList.add('show');
      }).catch(function () {
        button.innerHTML = originalHtml;
        button.disabled = false;
        alert('Something went wrong. Please email us at info@wseailab.com.');
      });
    });
  }

  /* ═══ Floating actions — WhatsApp + Wizzy ═══ */
  var wa = document.createElement('a');
  wa.className = 'fab-wa';
  wa.href = WHATSAPP_URL;
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Chat on WhatsApp');
  wa.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/><path d="M12.05 2a9.9 9.9 0 00-8.4 15.16L2.1 21.9l4.86-1.52A9.9 9.9 0 1012.05 2zm0 18.1a8.2 8.2 0 01-4.18-1.15l-.3-.18-2.88.9.92-2.8-.2-.3a8.2 8.2 0 118.14 3.53h.5z"/></svg>';
  document.body.appendChild(wa);

  var bubble = document.createElement('button');
  bubble.id = 'wz-bubble';
  bubble.setAttribute('aria-label', 'Chat with Wizzy');
  bubble.setAttribute('aria-expanded', 'false');
  bubble.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';

  var wzLabel = document.createElement('span');
  wzLabel.className = 'wz-label';
  wzLabel.textContent = 'Wizzy';

  var panel = document.createElement('div');
  panel.id = 'wz-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat with Wizzy');
  panel.innerHTML =
    '<div class="wz-head">' +
      '<div class="wz-av">W</div>' +
      '<div><div class="wz-hname">Wizzy — WSE Lab Consult</div><div class="wz-hstatus">● Online — usually replies instantly</div></div>' +
      '<button class="wz-close" aria-label="Close chat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
    '</div>' +
    '<div class="wz-msgs" id="wz-msgs"><div class="wz-msg bot">Hi, I’m Wizzy — the assistant for WSE Lab Consult. Ask about our products, services, or a project you want built, and I’ll point you the right way.</div></div>' +
    '<div class="wz-foot"><input id="wz-input" type="text" placeholder="Ask about a project…" aria-label="Message"><button id="wz-send" aria-label="Send"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div>';

  document.body.appendChild(bubble);
  document.body.appendChild(wzLabel);
  document.body.appendChild(panel);

  var history = [];
  var isOpen = false;

  function setChatOpen(open) {
    isOpen = open;
    panel.classList.toggle('open', open);
    bubble.setAttribute('aria-expanded', open ? 'true' : 'false');
    wzLabel.style.display = open ? 'none' : '';
    if (open) document.getElementById('wz-input').focus();
  }

  bubble.addEventListener('click', function () { setChatOpen(!isOpen); });
  panel.querySelector('.wz-close').addEventListener('click', function () { setChatOpen(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen) setChatOpen(false);
  });

  function addMessage(text, cls) {
    var el = document.createElement('div');
    el.className = 'wz-msg ' + cls;
    el.textContent = text;
    var box = document.getElementById('wz-msgs');
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
    return el;
  }

  function sendChat() {
    var input = document.getElementById('wz-input');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage(text, 'user');
    history.push({ role: 'user', content: text });
    var typing = addMessage('Typing…', 'bot typing');
    fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok || data.error) throw new Error(data.error || 'Server error');
        typing.remove();
        var reply = data.reply || 'No response received.';
        addMessage(reply, 'bot');
        history.push({ role: 'assistant', content: reply });
        if (history.length > 20) history = history.slice(-20);
      });
    }).catch(function () {
      typing.remove();
      addMessage('Could not connect right now. Email info@wseailab.com or tap the WhatsApp button below.', 'bot');
    });
  }

  document.getElementById('wz-send').addEventListener('click', sendChat);
  document.getElementById('wz-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') sendChat();
  });
})();
