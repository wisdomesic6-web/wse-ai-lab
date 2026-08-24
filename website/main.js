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
      url: 'https://memora-os.vercel.app', logo: 'assets/memora-mark.svg',
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
      slug: 'smartsales', name: 'SmartSales', status: 'live', tag: 'Retail · Business Management',
      url: 'https://smartsales.wseailab.com', logo: 'assets/products/smartsales.svg',
      desc: 'Mobile-first business management for African retailers — customers, payments, cashflow, AI insights.',
      long: [
        'SmartSales is a mobile-first business management app for African retailers. It covers the essentials a small retail business runs on: customer management, business profiles, payments, and cashflow tracking.',
        'On top of the records sits an AI layer that turns the numbers into plain-English business insights — what is selling, what is stalling, and where the cash is going.',
        'Built for retailers who need it simple: log a sale, see the cash position, know what to reorder — no accountant required.'
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

  /* One bespoke line-icon per product, matching what each one actually
     does — used on the illustrated placeholder below so every product
     card has a distinct identity instead of an identical mockup. */
  var PRODUCT_ICON_PATHS = {
    'memora-os': '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><path d="M12 7v3.2M6.6 10.8l3-1M17.4 10.8l-3-1M12 13.2V17"/>',
    'wse-datapilot': '<polyline points="3 17 9 11 13 15 21 6"/><polyline points="15 6 21 6 21 12"/>',
    'wse-audit-system': '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    'wse-soundhub': '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    'solwise-realty-ai': '<path d="M4 11.5L12 4l8 7.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
    'smartsales': '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
    'wse-academy': '<path d="M12 4L2 9l10 5 10-5-10-5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>',
    'wizzy-ai': '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M12 8v3M10.5 9.5h3"/>',
    'wse-trading-bot': '<line x1="5" y1="4" x2="5" y2="20"/><rect x="3" y="8" width="4" height="6"/><line x1="12" y1="2" x2="12" y2="22"/><rect x="10" y="6" width="4" height="9"/><line x1="19" y1="6" x2="19" y2="18"/><rect x="17" y="10" width="4" height="5"/>',
    'ai-lead-generator': '<path d="M3 4h18l-7 8v6l-4 2v-8z"/>',
    'wse-postpilot': '<path d="M3 11v2a2 2 0 002 2h1l3 5V4l-3 5H5a2 2 0 00-2 2z"/><path d="M14 8a4 4 0 010 8"/><path d="M17 5a8 8 0 010 14"/>',
    'wse-autoreply': '<path d="M20 13a2 2 0 01-2 2H8l-3 3V6a2 2 0 012-2h11a2 2 0 012 2z"/><circle cx="9" cy="9" r=".9"/><circle cx="13" cy="9" r=".9"/><circle cx="17" cy="9" r=".9"/>',
    'whatsapp-autoreply': '<path d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z"/><path d="M9 7h6M9 10.5h4M9 14h6"/>'
  };

  var G = '#1B3A6B', GB = '#2D5FA0', S = '#F0ECE3', W = '#fff', T = '#1C1A14', TS = '#5C564A', B = '#FAF7F0';
  function sv(inner) { return '<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><defs><style>@keyframes kPulse{0%,100%{opacity:.5}50%{opacity:1}}@keyframes kBlink{0%,100%{opacity:0}50%{opacity:1}}@keyframes kGrow{0%,100%{transform:scaleY(.7)}50%{transform:scaleY(1)}}@keyframes kSlide{0%,100%{opacity:.3;transform:translateX(-4px)}50%{opacity:.7;transform:translateX(4px)}}@keyframes kType{0%{width:0}50%{width:80px}100%{width:0}}.ap{animation:kPulse 2.4s ease-in-out infinite}.ab{animation:kBlink 1.2s ease-in-out infinite}.ag{animation:kGrow 2.8s ease-in-out infinite;transform-origin:center bottom}.as{animation:kSlide 3s ease-in-out infinite}</style></defs>' + inner + '</svg>'; }
  function bar(x, h, w, c) { return '<rect x="' + x + '" y="' + (185 - h) + '" width="' + (w || 28) + '" height="' + h + '" rx="4" fill="' + (c || G) + '" opacity=".6"/>'; }
  function ln(x, y, w, c, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="6" rx="3" fill="' + (c || TS) + '" opacity="' + (o || .3) + '"/>'; }
  function dot(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 4) + '" fill="' + (c || G) + '"/>'; }

  var PRODUCT_PREVIEW_SVGS = {
    'memora-os': sv(
      '<defs><linearGradient id="mobg" x1="0" y1="0" x2="400" y2="225" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0E2748"/><stop offset="100%" stop-color="#162F54"/></linearGradient>' +
      '<radialGradient id="mogl" cx="200" cy="105" r="80" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#2D5FA0" stop-opacity=".2"/><stop offset="100%" stop-color="#2D5FA0" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="400" height="225" fill="url(#mobg)"/>' +
      '<g stroke="#2D5FA0" stroke-opacity=".06" stroke-width=".5"><line x1="0" y1="56" x2="400" y2="56"/><line x1="0" y1="112" x2="400" y2="112"/><line x1="0" y1="168" x2="400" y2="168"/><line x1="100" y1="0" x2="100" y2="225"/><line x1="200" y1="0" x2="200" y2="225"/><line x1="300" y1="0" x2="300" y2="225"/></g>' +
      '<g fill="none" stroke="#3A72B5" stroke-width="1" stroke-opacity=".2"><path d="M65 50Q130 25,200 45"/><path d="M200 45Q270 30,335 65"/><path d="M335 65Q345 110,315 150"/><path d="M315 150Q255 175,165 168"/><path d="M165 168Q95 155,65 50"/><path d="M200 45L200 105"/><path d="M65 50L200 105"/><path d="M335 65L200 105"/><path d="M315 150L200 105"/><path d="M165 168L200 105"/></g>' +
      '<circle cx="200" cy="105" r="35" fill="url(#mogl)"/>' +
      '<circle cx="65" cy="50" r="4" fill="#4A8BDB" class="ap"/>' +
      '<circle cx="200" cy="45" r="4.5" fill="#5E9DE5" class="ap" style="animation-delay:.4s"/>' +
      '<circle cx="335" cy="65" r="4" fill="#4A8BDB" class="ap" style="animation-delay:.8s"/>' +
      '<circle cx="315" cy="150" r="4" fill="#5E9DE5" class="ap" style="animation-delay:1.2s"/>' +
      '<circle cx="165" cy="168" r="4.5" fill="#4A8BDB" class="ap" style="animation-delay:1.6s"/>' +
      '<circle cx="200" cy="105" r="11" fill="#1B3A6B" stroke="#4A8BDB" stroke-width="1.5"/>' +
      '<circle cx="200" cy="105" r="5" fill="#2D5FA0" class="ap" style="animation-delay:2s"/>' +
      '<rect x="30" y="200" width="340" height="3" rx="1.5" fill="#2D5FA0" opacity=".15"/>' +
      '<rect x="30" y="200" width="80" height="3" rx="1.5" fill="#4A8BDB" opacity=".4" class="as"/>' +
      '<rect x="180" y="200" width="50" height="3" rx="1.5" fill="#5E9DE5" opacity=".3" class="as" style="animation-delay:1.5s"/>' +
      '<text x="48" y="195" font-size="7" font-weight="600" fill="#5E9DE5" opacity=".6" class="ap" style="animation-delay:.6s">128MB</text>' +
      '<text x="320" y="195" font-size="7" font-weight="600" fill="#5E9DE5" opacity=".6" class="ap" style="animation-delay:1.2s">ACTIVE</text>'
    ),

    'wse-datapilot': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<rect x="16" y="12" width="110" height="50" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".12"/>' +
      ln(28, 24, 50, TS, .2) +
      '<text x="28" y="48" font-size="18" font-weight="800" fill="' + T + '">₦2.4M</text>' +
      '<rect x="142" y="12" width="110" height="50" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".12"/>' +
      ln(154, 24, 40, TS, .2) +
      '<text x="154" y="48" font-size="18" font-weight="800" fill="' + G + '">+34%</text>' +
      '<rect x="268" y="12" width="116" height="50" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".12"/>' +
      ln(280, 24, 60, TS, .2) +
      '<text x="280" y="48" font-size="18" font-weight="800" fill="' + T + '">1,247</text>' +
      '<rect x="16" y="76" width="240" height="138" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      ln(28, 86, 60, TS, .25) +
      '<rect class="ag" x="32" y="125" width="22" height="60" rx="4" fill="' + G + '" opacity=".6"/>' +
      '<rect class="ag" x="62" y="95" width="22" height="90" rx="4" fill="' + G + '" opacity=".6" style="animation-delay:.15s"/>' +
      '<rect class="ag" x="92" y="140" width="22" height="45" rx="4" fill="' + S + '" opacity=".6" style="animation-delay:.3s"/>' +
      '<rect class="ag" x="122" y="110" width="22" height="75" rx="4" fill="' + G + '" opacity=".6" style="animation-delay:.45s"/>' +
      '<rect class="ag" x="152" y="75" width="22" height="110" rx="4" fill="' + G + '" opacity=".6" style="animation-delay:.6s"/>' +
      '<rect class="ag" x="182" y="130" width="22" height="55" rx="4" fill="' + S + '" opacity=".6" style="animation-delay:.75s"/>' +
      '<rect class="ag" x="212" y="100" width="22" height="85" rx="4" fill="' + G + '" opacity=".6" style="animation-delay:.9s"/>' +
      '<rect x="272" y="76" width="112" height="138" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      dot(328, 115, 28, G) + '<text x="328" y="120" text-anchor="middle" font-size="14" font-weight="800" fill="' + W + '">67%</text>' +
      ln(284, 160, 88, TS, .15) + ln(284, 176, 70, TS, .10) + ln(284, 192, 80, G, .2)
    ),

    'wse-audit-system': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<circle cx="100" cy="100" r="58" fill="none" stroke="' + S + '" stroke-width="8"/>' +
      '<circle cx="100" cy="100" r="58" fill="none" stroke="' + G + '" stroke-width="8" stroke-dasharray="328 365" stroke-linecap="round" transform="rotate(-90 100 100)" opacity=".6" class="ap"/>' +
      '<text x="100" y="95" text-anchor="middle" font-size="22" font-weight="800" fill="' + T + '">94%</text>' +
      '<text x="100" y="113" text-anchor="middle" font-size="9" font-weight="600" fill="' + TS + '">COMPLIANT</text>' +
      '<text x="210" y="38" font-size="9" font-weight="600" fill="' + TS + '">ISA Standards</text>' +
      '<rect x="210" y="44" width="160" height="8" rx="4" fill="' + S + '"/><rect x="210" y="44" width="150" height="8" rx="4" fill="' + G + '" opacity=".45"/>' +
      '<text x="210" y="74" font-size="9" font-weight="600" fill="' + TS + '">ICAN Compliance</text>' +
      '<rect x="210" y="80" width="160" height="8" rx="4" fill="' + S + '"/><rect x="210" y="80" width="140" height="8" rx="4" fill="' + GB + '" opacity=".45"/>' +
      '<text x="210" y="110" font-size="9" font-weight="600" fill="' + TS + '">Risk Assessment</text>' +
      '<rect x="210" y="116" width="160" height="8" rx="4" fill="' + S + '"/><rect x="210" y="116" width="130" height="8" rx="4" fill="#15803D" opacity=".35"/>' +
      '<g font-size="8" font-weight="700"><circle cx="218" cy="142" r="4" fill="#15803D" opacity=".2"/><text x="226" y="145" fill="#15803D">Pass</text>' +
      '<circle cx="268" cy="142" r="4" fill="#15803D" opacity=".2"/><text x="276" y="145" fill="#15803D">Pass</text>' +
      '<circle cx="318" cy="142" r="4" fill="#D97706" opacity=".2"/><text x="326" y="145" fill="#D97706">Review</text></g>' +
      '<text x="30" y="180" font-size="9" font-weight="600" fill="' + TS + '">Audit Score Trend</text>' +
      '<polyline points="30,210 80,206 130,208 180,200 230,202 280,195 330,190 375,186" fill="none" stroke="' + G + '" stroke-width="1.5" opacity=".3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="375" cy="186" r="3" fill="' + G + '" class="ap"/>' +
      '<circle cx="330" cy="190" r="2" fill="' + G + '" opacity=".4" class="ap" style="animation-delay:.4s"/>' +
      '<circle cx="280" cy="195" r="2" fill="' + G + '" opacity=".3" class="ap" style="animation-delay:.8s"/>'
    ),

    'wse-soundhub': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<rect x="16" y="12" width="368" height="60" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<rect x="28" y="22" width="40" height="40" rx="8" fill="' + G + '" opacity=".12"/>' +
      '<path d="M40 36l10 6-10 6z" fill="' + G + '"/>' +
      ln(80, 28, 100, T, .4) + ln(80, 40, 60, TS, .2) +
      '<rect x="80" y="52" width="120" height="6" rx="3" fill="' + S + '"/><rect x="80" y="52" width="45" height="6" rx="3" fill="' + G + '"/>' +
      '<text x="360" y="46" text-anchor="end" font-size="12" font-weight="700" fill="' + G + '">₦45,000</text>' +
      '<rect x="16" y="84" width="116" height="130" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".08"/>' +
      '<rect x="24" y="92" width="100" height="64" rx="6" fill="' + S + '"/>' +
      '<circle cx="74" cy="124" r="16" fill="' + G + '" opacity=".15"/><path d="M68 118l14 6-14 6z" fill="' + G + '"/>' +
      ln(24, 168, 80, T, .35) + ln(24, 182, 50, TS, .2) +
      '<text x="24" y="204" font-size="12" font-weight="700" fill="' + G + '">₦85,000</text>' +
      '<rect x="144" y="84" width="116" height="130" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".08"/>' +
      '<rect x="152" y="92" width="100" height="64" rx="6" fill="' + S + '"/>' +
      ln(152, 168, 70, T, .35) + ln(152, 182, 50, TS, .2) +
      '<text x="152" y="204" font-size="12" font-weight="700" fill="' + G + '">₦120,000</text>' +
      '<rect x="272" y="84" width="112" height="130" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".08"/>' +
      '<rect x="280" y="92" width="96" height="64" rx="6" fill="' + S + '"/>' +
      ln(280, 168, 60, T, .35) + ln(280, 182, 40, TS, .2) +
      '<text x="280" y="204" font-size="12" font-weight="700" fill="' + G + '">₦65,000</text>'
    ),

    'solwise-realty-ai': sv(
      '<defs><linearGradient id="srfl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + G + '" stop-opacity=".12"/><stop offset="100%" stop-color="' + G + '" stop-opacity="0"/></linearGradient></defs>' +
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<g stroke="' + G + '" stroke-opacity=".06" stroke-width=".5"><line x1="45" y1="35" x2="380" y2="35"/><line x1="45" y1="85" x2="380" y2="85"/><line x1="45" y1="135" x2="380" y2="135"/></g>' +
      '<text x="18" y="40" font-size="7" fill="' + TS + '" opacity=".5">₦50M</text>' +
      '<text x="18" y="90" font-size="7" fill="' + TS + '" opacity=".5">₦35M</text>' +
      '<text x="18" y="140" font-size="7" fill="' + TS + '" opacity=".5">₦20M</text>' +
      '<path d="M45 130L100 120L155 110L210 95L265 80L320 60L375 45L375 158L45 158Z" fill="url(#srfl)"/>' +
      '<polyline points="45,130 100,120 155,110 210,95 265,80 320,60 375,45" fill="none" stroke="' + G + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>' +
      '<circle cx="45" cy="130" r="2.5" fill="' + G + '" opacity=".35"/>' +
      '<circle cx="100" cy="120" r="2.5" fill="' + G + '" opacity=".35"/>' +
      '<circle cx="155" cy="110" r="3" fill="' + G + '" class="ap" style="animation-delay:.3s"/>' +
      '<circle cx="210" cy="95" r="3" fill="' + G + '" class="ap" style="animation-delay:.6s"/>' +
      '<circle cx="265" cy="80" r="3" fill="' + GB + '" class="ap" style="animation-delay:.9s"/>' +
      '<circle cx="320" cy="60" r="3.5" fill="' + GB + '" class="ap" style="animation-delay:1.2s"/>' +
      '<circle cx="375" cy="45" r="4" fill="' + GB + '" class="ap" style="animation-delay:1.5s"/>' +
      '<g font-size="7" fill="' + TS + '" opacity=".4"><text x="45" y="172">Jan</text><text x="100" y="172">Feb</text><text x="155" y="172">Mar</text><text x="210" y="172">Apr</text><text x="265" y="172">May</text><text x="320" y="172">Jun</text></g>' +
      '<rect x="45" y="182" width="90" height="36" rx="8" fill="' + W + '" stroke="' + G + '" stroke-opacity=".1"/>' +
      '<text x="55" y="196" font-size="8" fill="' + TS + '">Avg Price</text>' +
      '<text x="55" y="211" font-size="13" font-weight="800" fill="' + T + '">₦35M</text>' +
      '<rect x="280" y="182" width="100" height="36" rx="8" fill="' + W + '" stroke="#25D366" stroke-opacity=".2"/>' +
      '<circle cx="298" cy="195" r="7" fill="#25D366" opacity=".15"/><text x="298" y="199" text-anchor="middle" font-size="8" font-weight="800" fill="#25D366">W</text>' +
      '<text x="310" y="196" font-size="8" font-weight="700" fill="' + T + '">12 Leads</text>' +
      '<text x="298" y="211" font-size="7" fill="#15803D">+23% this week</text>'
    ),

    'smartsales': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<rect x="110" y="4" width="180" height="217" rx="20" fill="' + W + '" stroke="' + G + '" stroke-opacity=".12"/>' +
      '<rect x="118" y="18" width="164" height="24" rx="0" fill="' + G + '" opacity=".06"/>' +
      '<text x="200" y="35" text-anchor="middle" font-size="11" font-weight="700" fill="' + G + '">SmartSales</text>' +
      ln(128, 56, 100, T, .25) +
      '<text x="128" y="80" font-size="24" font-weight="800" fill="' + T + '">₦847K</text>' +
      '<text x="230" y="80" font-size="11" font-weight="600" fill="#15803D">+12% today</text>' +
      '<rect x="128" y="96" width="144" height="1" fill="' + G + '" opacity=".1"/>' +
      '<rect x="128" y="108" width="144" height="28" rx="6" fill="' + S + '"/>' +
      ln(136, 114, 60, T, .3) + '<text x="256" y="126" text-anchor="end" font-size="11" font-weight="700" fill="' + G + '">₦15,000</text>' +
      '<rect x="128" y="142" width="144" height="28" rx="6" fill="' + S + '"/>' +
      ln(136, 148, 70, T, .3) + '<text x="256" y="160" text-anchor="end" font-size="11" font-weight="700" fill="' + G + '">₦8,500</text>' +
      '<rect x="128" y="176" width="144" height="28" rx="6" fill="' + S + '"/>' +
      ln(136, 182, 50, T, .3) + '<text x="256" y="194" text-anchor="end" font-size="11" font-weight="700" fill="' + G + '">₦22,000</text>'
    ),

    'wse-academy': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<rect x="16" y="12" width="368" height="36" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="32" y="35" font-size="13" font-weight="700" fill="' + T + '">Classes</text>' +
      '<text x="110" y="35" font-size="13" font-weight="600" fill="' + G + '">Students</text>' +
      '<text x="200" y="35" font-size="13" font-weight="600" fill="' + TS + '" opacity=".5">Fees</text>' +
      '<rect x="16" y="58" width="180" height="76" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="28" y="78" font-size="12" font-weight="700" fill="' + T + '">JSS 1A</text>' +
      '<text x="28" y="96" font-size="11" fill="' + TS + '">42 students</text>' +
      ln(28, 108, 80, G, .15) + '<rect x="28" y="118" width="40" height="8" rx="4" fill="#15803D" opacity=".15"/><text x="34" y="125" font-size="8" font-weight="700" fill="#15803D">Active</text>' +
      '<rect x="204" y="58" width="180" height="76" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="216" y="78" font-size="12" font-weight="700" fill="' + T + '">JSS 2B</text>' +
      '<text x="216" y="96" font-size="11" fill="' + TS + '">38 students</text>' +
      ln(216, 108, 70, G, .15) + '<rect x="216" y="118" width="40" height="8" rx="4" fill="#15803D" opacity=".15"/><text x="222" y="125" font-size="8" font-weight="700" fill="#15803D">Active</text>' +
      '<rect x="16" y="144" width="180" height="68" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="28" y="164" font-size="12" font-weight="700" fill="' + T + '">SS 1</text>' +
      '<text x="28" y="182" font-size="11" fill="' + TS + '">35 students</text>' +
      '<rect x="204" y="144" width="180" height="68" rx="10" fill="' + G + '" opacity=".06" stroke="' + G + '" stroke-opacity=".12"/>' +
      '<text x="294" y="182" text-anchor="middle" font-size="13" font-weight="700" fill="' + G + '">+ Add Class</text>'
    ),

    'wizzy-ai': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<rect x="60" y="10" width="280" height="205" rx="14" fill="' + W + '" stroke="' + G + '" stroke-opacity=".12"/>' +
      '<rect x="60" y="10" width="280" height="40" rx="14" fill="' + G + '" opacity=".06"/>' +
      '<rect x="60" y="46" width="280" height="4" rx="0" fill="' + G + '" opacity=".06"/>' +
      '<circle cx="86" cy="30" r="12" fill="' + G + '" opacity=".15"/><text x="86" y="35" text-anchor="middle" font-size="13" font-weight="800" fill="' + G + '">W</text>' +
      '<text x="106" y="28" font-size="12" font-weight="700" fill="' + T + '">Wizzy</text>' +
      '<circle class="ap" cx="106" cy="38" r="3" fill="#15803D"/>' + '<text x="114" y="42" font-size="9" fill="#15803D">Online</text>' +
      '<rect x="80" y="62" width="160" height="30" rx="10" fill="' + S + '"/>' +
      ln(90, 72, 110, TS, .35) + ln(90, 82, 70, TS, .2) +
      '<rect x="200" y="104" width="120" height="24" rx="10" fill="' + G + '"/>' +
      ln(212, 113, 70, W, .8) +
      '<rect x="80" y="140" width="180" height="36" rx="10" fill="' + S + '"/>' +
      ln(90, 150, 130, TS, .35) + ln(90, 162, 80, TS, .2) +
      '<rect x="74" y="190" width="210" height="2" fill="' + G + '" opacity=".08"/>'
    ),

    'wse-trading-bot': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<rect x="12" y="8" width="376" height="30" rx="8" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="24" y="28" font-size="12" font-weight="700" fill="' + T + '">EUR/USD</text>' +
      '<text x="110" y="28" font-size="12" font-weight="800" fill="#15803D">1.0847</text>' +
      '<text x="180" y="28" font-size="10" font-weight="600" fill="#15803D">+0.23%</text>' +
      '<rect x="300" y="14" width="36" height="18" rx="4" fill="#15803D" opacity=".12"/><text x="318" y="27" text-anchor="middle" font-size="9" font-weight="700" fill="#15803D">BUY</text>' +
      '<rect x="340" y="14" width="36" height="18" rx="4" fill="#dc2626" opacity=".12"/><text x="358" y="27" text-anchor="middle" font-size="9" font-weight="700" fill="#dc2626">SELL</text>' +
      '<line x1="40" y1="60" x2="40" y2="140" stroke="' + G + '" stroke-width="1.5"/><rect x="32" y="80" width="16" height="40" rx="2" fill="#15803D" opacity=".5"/>' +
      '<line x1="80" y1="50" x2="80" y2="150" stroke="' + G + '" stroke-width="1.5"/><rect x="72" y="60" width="16" height="60" rx="2" fill="#15803D" opacity=".5"/>' +
      '<line x1="120" y1="70" x2="120" y2="160" stroke="' + G + '" stroke-width="1.5"/><rect x="112" y="90" width="16" height="50" rx="2" fill="#dc2626" opacity=".4"/>' +
      '<line x1="160" y1="55" x2="160" y2="145" stroke="' + G + '" stroke-width="1.5"/><rect x="152" y="65" width="16" height="50" rx="2" fill="#15803D" opacity=".5"/>' +
      '<line x1="200" y1="45" x2="200" y2="130" stroke="' + G + '" stroke-width="1.5"/><rect x="192" y="55" width="16" height="50" rx="2" fill="#15803D" opacity=".5"/>' +
      '<line x1="240" y1="60" x2="240" y2="140" stroke="' + G + '" stroke-width="1.5"/><rect x="232" y="75" width="16" height="40" rx="2" fill="#dc2626" opacity=".4"/>' +
      '<line x1="280" y1="40" x2="280" y2="120" stroke="' + G + '" stroke-width="1.5"/><rect x="272" y="48" width="16" height="50" rx="2" fill="#15803D" opacity=".5"/>' +
      '<line x1="320" y1="35" x2="320" y2="110" stroke="' + G + '" stroke-width="1.5"/><rect x="312" y="40" width="16" height="45" rx="2" fill="#15803D" opacity=".5"/>' +
      '<line x1="360" y1="50" x2="360" y2="125" stroke="' + G + '" stroke-width="1.5"/><rect x="352" y="55" width="16" height="40" rx="2" fill="#15803D" opacity=".5"/>' +
      '<polygon class="ap" points="195,50 200,42 205,50" fill="#15803D"/><text class="ap" x="200" y="38" text-anchor="middle" font-size="8" font-weight="700" fill="#15803D">BUY</text>' +
      '<rect x="12" y="170" width="120" height="46" rx="8" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="24" y="188" font-size="10" font-weight="600" fill="' + TS + '">Daily P/L</text>' +
      '<text x="24" y="206" font-size="14" font-weight="800" fill="#15803D">+$342.80</text>' +
      '<rect x="144" y="170" width="120" height="46" rx="8" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="156" y="188" font-size="10" font-weight="600" fill="' + TS + '">Win Rate</text>' +
      '<text x="156" y="206" font-size="14" font-weight="800" fill="' + G + '">73.2%</text>' +
      '<rect x="276" y="170" width="112" height="46" rx="8" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="288" y="188" font-size="10" font-weight="600" fill="' + TS + '">Risk Used</text>' +
      '<text x="288" y="206" font-size="14" font-weight="800" fill="' + T + '">1.8%</text>'
    ),

    'ai-lead-generator': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<path d="M120 20 L280 20 L250 80 L150 80 Z" fill="' + G + '" opacity=".08" stroke="' + G + '" stroke-opacity=".2"/>' +
      '<text x="200" y="45" text-anchor="middle" font-size="10" font-weight="700" fill="' + G + '">SCRAPED</text>' +
      '<text x="200" y="62" text-anchor="middle" font-size="16" font-weight="800" fill="' + T + '">2,480</text>' +
      '<path d="M150 84 L250 84 L232 132 L168 132 Z" fill="' + G + '" opacity=".12" stroke="' + G + '" stroke-opacity=".25"/>' +
      '<text x="200" y="104" text-anchor="middle" font-size="10" font-weight="700" fill="' + G + '">SCORED</text>' +
      '<text x="200" y="122" text-anchor="middle" font-size="14" font-weight="800" fill="' + T + '">847</text>' +
      '<path d="M168 136 L232 136 L220 176 L180 176 Z" fill="' + G + '" opacity=".18" stroke="' + G + '" stroke-opacity=".3"/>' +
      '<text x="200" y="154" text-anchor="middle" font-size="10" font-weight="700" fill="' + G + '">HOT</text>' +
      '<text x="200" y="170" text-anchor="middle" font-size="13" font-weight="800" fill="' + T + '">124</text>' +
      '<rect x="16" y="190" width="112" height="26" rx="8" fill="#15803D" opacity=".08" stroke="#15803D" stroke-opacity=".15"/>' +
      '<circle class="ap" cx="32" cy="203" r="4" fill="#15803D"/>' + '<text x="42" y="207" font-size="10" font-weight="600" fill="#15803D">Hot · 124</text>' +
      '<rect x="144" y="190" width="112" height="26" rx="8" fill="' + G + '" opacity=".08" stroke="' + G + '" stroke-opacity=".15"/>' +
      dot(160, 203, 4, G) + '<text x="170" y="207" font-size="10" font-weight="600" fill="' + G + '">Warm · 723</text>' +
      '<rect x="272" y="190" width="112" height="26" rx="8" fill="' + TS + '" opacity=".08" stroke="' + TS + '" stroke-opacity=".15"/>' +
      dot(288, 203, 4, TS) + '<text x="298" y="207" font-size="10" font-weight="600" fill="' + TS + '">Ignore · 1,633</text>'
    ),

    'wse-postpilot': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<rect x="16" y="12" width="180" height="200" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<rect x="24" y="20" width="164" height="80" rx="6" fill="' + S + '"/>' +
      '<text x="106" y="60" text-anchor="middle" font-size="11" font-weight="600" fill="' + TS + '">Image Preview</text>' +
      ln(24, 112, 140, T, .35) + ln(24, 126, 100, TS, .2) + ln(24, 140, 120, TS, .15) +
      '<rect x="24" y="160" width="50" height="16" rx="4" fill="#0077B5" opacity=".12"/><text x="49" y="172" text-anchor="middle" font-size="8" font-weight="700" fill="#0077B5">LinkedIn</text>' +
      '<rect x="80" y="160" width="36" height="16" rx="4" fill="#E1306C" opacity=".12"/><text x="98" y="172" text-anchor="middle" font-size="8" font-weight="700" fill="#E1306C">IG</text>' +
      '<rect x="122" y="160" width="24" height="16" rx="4" fill="' + T + '" opacity=".12"/><text x="134" y="172" text-anchor="middle" font-size="8" font-weight="700" fill="' + T + '">X</text>' +
      '<rect x="24" y="186" width="80" height="20" rx="6" fill="' + G + '"/><text x="64" y="200" text-anchor="middle" font-size="10" font-weight="700" fill="' + W + '">Schedule</text>' +
      '<rect x="210" y="12" width="174" height="48" rx="8" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="222" y="32" font-size="10" font-weight="600" fill="' + TS + '">Today\'s Queue</text>' +
      '<text x="222" y="48" font-size="16" font-weight="800" fill="' + T + '">4 posts ready</text>' +
      '<rect x="210" y="70" width="174" height="36" rx="8" fill="' + S + '"/>' +
      '<circle class="ap" cx="226" cy="88" r="4" fill="#15803D"/>' + ln(236, 82, 100, T, .3) + ln(236, 92, 60, TS, .15) +
      '<rect x="210" y="114" width="174" height="36" rx="8" fill="' + S + '"/>' +
      '<circle class="ap" cx="226" cy="132" r="4" fill="#0077B5" style="animation-delay:.4s"/>' + ln(236, 126, 80, T, .3) + ln(236, 136, 70, TS, .15) +
      '<rect x="210" y="158" width="174" height="36" rx="8" fill="' + S + '"/>' +
      '<circle class="ap" cx="226" cy="176" r="4" fill="#E1306C" style="animation-delay:.8s"/>' + ln(236, 170, 90, T, .3) + ln(236, 180, 50, TS, .15)
    ),

    'wse-autoreply': sv(
      '<rect width="400" height="225" fill="' + B + '"/>' +
      '<rect x="16" y="12" width="220" height="200" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<rect x="16" y="12" width="220" height="36" rx="10" fill="' + G + '" opacity=".05"/>' +
      '<text x="32" y="35" font-size="12" font-weight="700" fill="' + T + '">Live Chat</text>' +
      '<circle class="ap" cx="200" cy="30" r="4" fill="#15803D"/>' + '<text class="ap" x="210" y="34" font-size="9" font-weight="600" fill="#15803D">AI</text>' +
      '<rect x="32" y="60" width="140" height="24" rx="8" fill="' + S + '"/>' +
      ln(42, 68, 100, TS, .35) +
      '<rect x="100" y="96" width="120" height="24" rx="8" fill="' + G + '" opacity=".12"/>' +
      ln(112, 104, 80, G, .5) +
      '<rect x="32" y="132" width="160" height="30" rx="8" fill="' + S + '"/>' +
      ln(42, 140, 110, TS, .35) + ln(42, 152, 60, TS, .2) +
      '<rect x="32" y="174" width="80" height="20" rx="6" fill="' + G + '" opacity=".08"/><text x="72" y="188" text-anchor="middle" font-size="9" font-weight="600" fill="' + G + '">Auto-reply</text>' +
      '<rect x="252" y="12" width="132" height="200" rx="10" fill="' + W + '" stroke="' + G + '" stroke-opacity=".10"/>' +
      '<text x="264" y="32" font-size="10" font-weight="700" fill="' + T + '">Queue</text>' +
      '<rect x="260" y="44" width="116" height="36" rx="6" fill="' + S + '"/>' +
      dot(272, 58, 3, '#15803D') + ln(280, 54, 70, T, .25) + ln(280, 66, 40, TS, .15) +
      '<rect x="260" y="88" width="116" height="36" rx="6" fill="' + S + '"/>' +
      dot(272, 102, 3, G) + ln(280, 98, 60, T, .25) + ln(280, 110, 50, TS, .15) +
      '<rect x="260" y="132" width="116" height="36" rx="6" fill="' + S + '"/>' +
      dot(272, 146, 3, '#D97706') + ln(280, 142, 80, T, .25) + ln(280, 154, 30, TS, .15) +
      '<text x="318" y="192" text-anchor="middle" font-size="18" font-weight="800" fill="' + T + '">24</text>' +
      '<text x="318" y="206" text-anchor="middle" font-size="9" font-weight="600" fill="' + TS + '">resolved today</text>'
    ),

    'whatsapp-autoreply': sv(
      '<rect width="400" height="225" fill="#E5DDD5"/>' +
      '<rect x="0" y="0" width="400" height="36" fill="#075E54"/>' +
      '<circle cx="28" cy="18" r="12" fill="#128C7E"/><text x="28" y="23" text-anchor="middle" font-size="12" font-weight="800" fill="' + W + '">B</text>' +
      '<text x="48" y="16" font-size="11" font-weight="700" fill="' + W + '">Business Bot</text>' +
      '<text x="48" y="28" font-size="9" fill="' + W + '" opacity=".7">online</text>' +
      '<rect x="20" y="48" width="180" height="30" rx="8" fill="' + W + '"/>' +
      '<text x="30" y="60" font-size="10" fill="#303030">Hi, what are your prices?</text>' +
      '<text x="186" y="72" text-anchor="end" font-size="8" fill="#999">10:32 AM</text>' +
      '<rect x="200" y="90" width="180" height="50" rx="8" fill="#DCF8C6"/>' +
      '<text x="210" y="104" font-size="10" fill="#303030">Thanks for reaching out!</text>' +
      '<text x="210" y="118" font-size="10" fill="#303030">Here are our packages:</text>' +
      '<text x="210" y="132" font-size="10" font-weight="600" fill="#075E54">View Catalog</text>' +
      '<text x="366" y="136" text-anchor="end" font-size="8" fill="#999">10:32 AM</text>' +
      '<rect x="20" y="152" width="140" height="24" rx="8" fill="' + W + '"/>' +
      '<text x="30" y="168" font-size="10" fill="#303030">I want to book</text>' +
      '<rect x="220" y="182" width="160" height="30" rx="8" fill="#DCF8C6"/>' +
      '<text x="230" y="196" font-size="10" fill="#303030">Great! Pick a date:</text>' +
      '<text x="230" y="208" font-size="10" font-weight="600" fill="#075E54">Mon · Tue · Wed</text>'
    )
  };

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
      var iconSlug = img.getAttribute('data-ph-icon');
      var previewSvg = PRODUCT_PREVIEW_SVGS[iconSlug];
      if (previewSvg) {
        ph.className = 'ph ph-preview';
        ph.innerHTML = previewSvg;
        img.replaceWith(ph);
        return;
      }
      var iconPath = PRODUCT_ICON_PATHS[iconSlug] || '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>';
      ph.className = 'ph ph-illustration';
      ph.innerHTML =
        '<div class="pi-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + iconPath + '</svg></div>' +
        '<span class="pi-label">' + (cap || label) + '</span>';
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
      var mediaContent = PRODUCT_PREVIEW_SVGS[p.slug]
        ? '<div class="ph ph-preview">' + PRODUCT_PREVIEW_SVGS[p.slug] + '</div>'
        : '<img src="assets/example.png" alt="' + p.name + ' preview" loading="lazy" data-ph="product" data-ph-icon="' + p.slug + '" data-ph-label="' + productInitials(p.name) + '" data-ph-cap="' + p.name + '">';
      return '<article class="card prod-card reveal" data-status="' + p.status + '" data-href="product.html?p=' + p.slug + '" role="link" tabindex="0" aria-label="' + p.name + ' details">' +
        '<div class="prod-chrome"><span class="pc-dots"><i></i><i></i><i></i></span><span class="pc-tab">' + favicon + p.name + '</span>' + badge + '</div>' +
        '<div class="prod-media">' + mediaContent + '</div>' +
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
          '<div class="dh-media">' + (PRODUCT_PREVIEW_SVGS[product.slug] ? '<div class="ph ph-preview">' + PRODUCT_PREVIEW_SVGS[product.slug] + '</div>' : '<img src="assets/example.png" alt="' + product.name + ' preview" data-ph="product" data-ph-icon="' + product.slug + '" data-ph-label="' + productInitials(product.name) + '" data-ph-cap="' + product.name + '">') + '</div>' +
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

  var isSending = false;
  function sendChat() {
    if (isSending) return; // guards against double-send (double-click, Enter key-repeat)
    var input = document.getElementById('wz-input');
    var text = input.value.trim();
    if (!text) return;
    isSending = true;
    input.value = '';
    addMessage(text, 'user');
    var pending = { role: 'user', content: text };
    history.push(pending);
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
      // Roll back the pending user turn so history never ends on two
      // consecutive user messages — the Anthropic API rejects that shape
      // on the next send, which would otherwise break chat permanently.
      var idx = history.indexOf(pending);
      if (idx !== -1) history.splice(idx, 1);
      addMessage('Could not connect right now. Email info@wseailab.com or tap the WhatsApp button below.', 'bot');
    }).then(function () { isSending = false; }, function () { isSending = false; });
  }

  document.getElementById('wz-send').addEventListener('click', sendChat);
  document.getElementById('wz-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') sendChat();
  });

  /* ═══ Affiliate portal — signup, login, dashboard ═══
     Endpoints are called at /.netlify/functions/... (not /api/...) so the
     same call works unchanged on both Netlify (native path) and Vercel
     (via the generic rewrite already in vercel.json) — same convention
     already used by the Wizzy chat widget above. */
  function escHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtNaira(n) {
    return Number(n || 0).toLocaleString('en-NG');
  }
  function postJson(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { ok: res.ok, status: res.status, data: data };
      });
    });
  }

  var affSignupForm = document.getElementById('affSignupForm');
  if (affSignupForm) {
    affSignupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var btn = document.getElementById('affSignupBtn');
      var msg = document.getElementById('affSignupMsg');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Submitting…';
      msg.textContent = '';
      postJson('/.netlify/functions/affiliate-signup', {
        fullName: document.getElementById('as-name').value,
        whatsapp: document.getElementById('as-whatsapp').value,
        email: document.getElementById('as-email').value,
        password: document.getElementById('as-password').value,
        bankName: document.getElementById('as-bank').value,
        accountNumber: document.getElementById('as-acctno').value,
        accountName: document.getElementById('as-acctname').value,
      }).then(function (result) {
        if (!result.ok) {
          msg.textContent = result.data.error || 'Something went wrong.';
          btn.disabled = false;
          btn.innerHTML = original;
          return;
        }
        affSignupForm.style.display = 'none';
        document.getElementById('affSignupSent').classList.add('show');
      }).catch(function () {
        msg.textContent = 'Network error — please try again.';
        btn.disabled = false;
        btn.innerHTML = original;
      });
    });
  }

  var affLoginForm = document.getElementById('affLoginForm');
  if (affLoginForm) {
    affLoginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var btn = document.getElementById('affLoginBtn');
      var msg = document.getElementById('affLoginMsg');
      btn.disabled = true;
      btn.textContent = 'Logging in…';
      msg.textContent = '';
      postJson('/.netlify/functions/affiliate-login', {
        email: document.getElementById('al-email').value,
        password: document.getElementById('al-password').value,
      }).then(function (result) {
        if (!result.ok) {
          msg.textContent = result.data.error || 'Login failed.';
          btn.disabled = false;
          btn.textContent = 'Log In';
          return;
        }
        window.location.href = 'affiliate-dashboard.html';
      }).catch(function () {
        msg.textContent = 'Network error — please try again.';
        btn.disabled = false;
        btn.textContent = 'Log In';
      });
    });
  }

  var affDashRoot = document.getElementById('affDashboard');
  if (affDashRoot) {
    fetch('/.netlify/functions/affiliate-me')
      .then(function (res) {
        if (res.status === 401) {
          window.location.href = 'affiliate-login.html';
          return null;
        }
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (me) {
        if (!me) return;
        document.getElementById('affName').textContent = me.fullName || '';
        if (me.status !== 'approved') {
          showAffGate(me.status);
          return;
        }
        loadAffDashboard();
      })
      .catch(function () {
        showAffGate('error');
      });
  }

  function showAffGate(status) {
    var gate = document.getElementById('affGate');
    if (!gate) return;
    var title = status === 'pending' ? 'Application under review'
      : status === 'error' ? 'Could not load your account'
      : 'Application not approved';
    var text = status === 'pending'
      ? 'Your application is under review. We will email you once it is approved.'
      : status === 'error' ? 'Something went wrong loading your account. Please refresh, or try again shortly.'
      : 'Your application was not approved. Contact info@wseailab.com if you think this is a mistake.';
    gate.innerHTML =
      '<div class="card" style="max-width:520px;margin:0 auto;text-align:center">' +
      '<h2 class="h-md">' + escHtml(title) + '</h2>' +
      '<p style="color:var(--muted);margin-top:10px">' + escHtml(text) + '</p></div>';
    gate.style.display = 'block';
  }

  function loadAffDashboard() {
    document.getElementById('affDashboard').style.display = 'block';
    fetch('/.netlify/functions/affiliate-dashboard').then(function (res) { return res.json(); }).then(renderAffDashboard);
    var addBtn = document.getElementById('affAddProductBtn');
    if (addBtn) addBtn.addEventListener('click', openAffPicker);
    var closeBtn = document.getElementById('affPickerClose');
    if (closeBtn) closeBtn.addEventListener('click', closeAffPicker);
  }

  function renderAffDashboard(data) {
    var tier = data.tier || {};
    var tierEl = document.getElementById('affTierCard');
    if (tierEl) {
      var progressHtml = '';
      if (tier.nextThreshold) {
        var remaining = Math.max(0, tier.nextThreshold - (tier.activeCustomers || 0));
        progressHtml = '<p style="color:var(--muted);font-size:var(--fs-support);margin-top:6px">' +
          remaining + ' more active paying referral' + (remaining === 1 ? '' : 's') +
          ' to reach ' + tier.nextCommissionPct + '% commission.</p>';
      } else {
        progressHtml = '<p style="color:var(--muted);font-size:var(--fs-support);margin-top:6px">You are at the top tier.</p>';
      }
      tierEl.innerHTML =
        '<div class="card" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
        '<div><span class="eyebrow">Your Tier</span>' +
        '<h3 class="h-sm" style="margin-top:4px">' + (tier.commissionPct || 0) + '% commission &middot; ' +
        (tier.activeCustomers || 0) + ' active paying referral' + ((tier.activeCustomers || 0) === 1 ? '' : 's') + '</h3>' +
        progressHtml +
        '</div></div>';
    }
    var totals = data.totals || {};
    var totalsEl = document.getElementById('affTotals');
    if (totalsEl) {
      totalsEl.innerHTML =
        '<div class="cell"><b>₦' + fmtNaira(totals.pendingCommission) + '</b><span>Pending Commission</span></div>' +
        '<div class="cell"><b>₦' + fmtNaira(totals.totalPaidOut) + '</b><span>Paid Out</span></div>' +
        '<div class="cell"><b>₦' + fmtNaira(totals.totalEarned) + '</b><span>Total Earned</span></div>' +
        '<div class="cell"><b>' + (data.products || []).length + '</b><span>Products Promoted</span></div>';
    }
    var list = document.getElementById('affProductsList');
    if (list) {
      var products = data.products || [];
      list.innerHTML = products.length ? products.map(function (p) {
        return '<article class="card">' +
          '<h3 class="h-sm">' + escHtml(p.name) + '</h3>' +
          '<p style="color:var(--muted);font-size:var(--fs-support);margin-top:6px">Code: <b>' + escHtml(p.referralCode) + '</b></p>' +
          '<div class="field" style="margin-top:12px"><input readonly value="' + escHtml(p.referralLink) + '" data-copy-link onclick="this.select()"></div>' +
          '<button class="btn btn-ghost" style="margin-top:10px" data-copy-btn="' + escHtml(p.referralLink) + '">Copy Link</button>' +
          '<div class="stats-2x2" style="margin-top:16px">' +
          '<div class="cell"><b>' + p.clicks + '</b><span>Clicks</span></div>' +
          '<div class="cell"><b>' + p.conversions + '</b><span>Conversions</span></div>' +
          '</div>' +
          (p.guide ? '<details style="margin-top:14px"><summary style="cursor:pointer;font-size:var(--fs-support);color:var(--accent2);font-weight:600">Product guide</summary>' +
            '<div style="margin-top:8px;color:var(--muted);font-size:var(--fs-support);white-space:pre-line">' + escHtml(p.guide) + '</div></details>' : '') +
          '</article>';
      }).join('') : '<p style="color:var(--muted)">You have not picked a product yet — click "Add a product" above to get your first link.</p>';
      list.querySelectorAll('[data-copy-btn]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          navigator.clipboard.writeText(btn.getAttribute('data-copy-btn')).then(function () {
            var original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = original; }, 1600);
          });
        });
      });
    }
    var payoutsList = document.getElementById('affPayoutsList');
    if (payoutsList) {
      var payouts = data.payouts || [];
      payoutsList.innerHTML = payouts.length ? payouts.map(function (p) {
        return '<div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;margin-bottom:10px">' +
          '<span>' + escHtml(p.periodCovered) + '</span>' +
          '<span>₦' + fmtNaira(p.amount) + '</span>' +
          '<span class="badge ' + (p.status === 'paid' ? 'live' : 'building') + '">' + escHtml(p.status) + '</span></div>';
      }).join('') : '<p style="color:var(--muted)">No payouts yet.</p>';
    }
  }

  function openAffPicker() {
    var modal = document.getElementById('affPickerModal');
    if (!modal) return;
    modal.style.display = 'flex';
    fetch('/.netlify/functions/affiliate-products').then(function (res) { return res.json(); }).then(function (data) {
      var grid = document.getElementById('affPickerGrid');
      var products = (data && data.products) || [];
      grid.innerHTML = products.map(function (p) {
        return '<article class="card">' +
          '<img src="' + (p.logo_url || 'assets/example.png') + '" alt="" loading="lazy" style="width:44px;height:44px;object-fit:contain;border-radius:8px;margin-bottom:10px" ' +
          'data-ph="product" data-ph-icon="' + escHtml(p.slug) + '" data-ph-label="' + escHtml(productInitials(p.name)) + '" data-ph-cap="' + escHtml(p.name) + '">' +
          '<h3 class="h-sm">' + escHtml(p.name) + '</h3>' +
          '<p style="color:var(--muted);font-size:var(--fs-support);margin-top:6px">' + escHtml(p.description) + '</p>' +
          (p.guide ? '<details style="margin-top:10px"><summary style="cursor:pointer;font-size:var(--fs-support);color:var(--accent2);font-weight:600">Read the product guide</summary>' +
            '<div style="margin-top:8px;color:var(--muted);font-size:var(--fs-support);white-space:pre-line">' + escHtml(p.guide) + '</div></details>' : '') +
          '<button class="btn btn-primary" style="margin-top:14px" data-pick-slug="' + escHtml(p.slug) + '">Get My Link</button>' +
          '</article>';
      }).join('');
      wirePlaceholders(grid);
      grid.querySelectorAll('[data-pick-slug]').forEach(function (btn) {
        btn.addEventListener('click', function () { pickAffProduct(btn.getAttribute('data-pick-slug'), btn); });
      });
    });
  }

  function closeAffPicker() {
    var modal = document.getElementById('affPickerModal');
    if (modal) modal.style.display = 'none';
  }

  function pickAffProduct(slug, btn) {
    if (btn) { btn.disabled = true; btn.textContent = 'Getting your link…'; }
    postJson('/.netlify/functions/affiliate-pick-product', { slug: slug }).then(function (result) {
      if (!result.ok) {
        if (btn) { btn.disabled = false; btn.textContent = 'Get My Link'; }
        alert(result.data.error || 'Could not get your link — please try again.');
        return;
      }
      closeAffPicker();
      loadAffDashboard();
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     3D MOTION GRAPHICS — Dark Luxury enhancements
     Hero particle canvas · Card 3D tilt · Cursor glow
     ═══════════════════════════════════════════════════════════════ */

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ── Hero particle constellation ── */
  function initHeroCanvas() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var PARTICLE_COUNT = 60;
    var CONNECTION_DIST = 140;
    var GOLD = { r: 168, g: 136, b: 46 };
    var particles = [];
    var mouseX = -1000;
    var mouseY = -1000;
    var raf;
    var w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.4 + 0.15
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        var dx = mouseX - p.x;
        var dy = mouseY - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          var force = (200 - dist) / 200 * 0.008;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + GOLD.r + ',' + GOLD.g + ',' + GOLD.b + ',' + p.alpha + ')';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var ddx = p.x - p2.x;
          var ddy = p.y - p2.y;
          var d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < CONNECTION_DIST) {
            var lineAlpha = (1 - d / CONNECTION_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(' + GOLD.r + ',' + GOLD.g + ',' + GOLD.b + ',' + lineAlpha + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    if (!prefersReducedMotion) {
      init();
      draw();

      var heroSection = canvas.closest('.hero');
      if (heroSection && !isTouchDevice) {
        heroSection.addEventListener('mousemove', function (e) {
          var rect = heroSection.getBoundingClientRect();
          mouseX = e.clientX - rect.left;
          mouseY = e.clientY - rect.top;
        });
        heroSection.addEventListener('mouseleave', function () {
          mouseX = -1000;
          mouseY = -1000;
        });
      }

      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          resize();
        }, 150);
      });
    }
  }

  /* ── 3D perspective card tilt ── */
  function initCardTilt() {
    if (prefersReducedMotion || isTouchDevice) return;

    var tiltCards = document.querySelectorAll('.card, .show-card, .price-card');
    tiltCards.forEach(function (card) {
      card.setAttribute('data-tilt', '');

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -5;
        var rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ── Cursor glow follower ── */
  function initCursorGlow() {
    if (prefersReducedMotion || isTouchDevice) return;
    if (window.innerWidth < 768) return;

    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    var glowX = -400;
    var glowY = -400;
    var currentX = -400;
    var currentY = -400;

    document.addEventListener('mousemove', function (e) {
      glowX = e.clientX;
      glowY = e.clientY;
    });

    function moveGlow() {
      currentX += (glowX - currentX) * 0.08;
      currentY += (glowY - currentY) * 0.08;
      glow.style.left = currentX + 'px';
      glow.style.top = currentY + 'px';
      requestAnimationFrame(moveGlow);
    }
    moveGlow();
  }

  /* ── Boot 3D enhancements ── */
  initHeroCanvas();
  initCardTilt();
  initCursorGlow();

})();
