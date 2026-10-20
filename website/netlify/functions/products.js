/* ═══════════════════════════════════════════════════════════
   WSE Lab Consult — Products Catalog API
   Returns the canonical product list as JSON.
   Used by the Product Sync Agent to keep the OS in sync.

   GET → { products: [...] }
   ═══════════════════════════════════════════════════════════ */

const PRODUCTS = [
  {
    slug: "memora-os", name: "Memora OS", status: "live",
    tag: "AI Assistant · Multi-tenant SaaS",
    url: "https://memora-os.vercel.app",
    logo: "assets/memora-mark.svg",
    desc: "Private AI assistant for African businesses with persistent memory, team access, and live search.",
  },
  {
    slug: "wse-datapilot", name: "WSE Datapilot", status: "live",
    tag: "Analytics · Business Intelligence",
    url: "https://wse-datapilot.vercel.app",
    logo: "assets/products/wse-datapilot.svg",
    desc: "Plug in your data, get plain-English reports, trends, and anomaly flags — no data team required.",
  },
  {
    slug: "wse-audit-system", name: "WSE Audit System", status: "live",
    tag: "Accounting · ICAN / ISA 2024",
    url: "https://wseauditsystem.netlify.app",
    logo: "assets/products/wse-audit-system.svg",
    desc: "Audit intelligence for Nigerian accounting firms — ICAN and ISA 2024 compliant, with an AI copilot.",
  },
  {
    slug: "wse-soundhub", name: "WSE SoundHub", status: "live",
    tag: "E-commerce · Musical Instruments",
    url: "https://wsesound-hub.netlify.app",
    logo: "assets/products/wse-soundhub.svg",
    desc: "Nigerian musical-instrument e-commerce with a full Supabase backend and complete admin console.",
  },
  {
    slug: "solwise-realty-ai", name: "Solwise Realty AI", status: "live",
    tag: "Real Estate · Nigeria",
    url: "https://solwise-realty-ai.netlify.app",
    logo: null,
    desc: "AI platform for Nigerian real-estate agencies — WhatsApp lead capture, listings, and follow-ups.",
  },
  {
    slug: "smartsales", name: "SmartSales", status: "live",
    tag: "Retail · Business Management",
    url: "https://smartsales.wseailab.com",
    logo: "assets/products/smartsales.svg",
    desc: "Mobile-first business management for African retailers — customers, payments, cashflow, AI insights.",
  },
  {
    slug: "wse-academy", name: "WSE Academy", status: "building",
    tag: "Education · School Management",
    url: null,
    desc: "School management for Nigerian schools — classes, students, admin, with SMS/WhatsApp integrations.",
  },
  {
    slug: "wizzy-ai", name: "Wizzy AI Assistant", status: "building",
    tag: "AI · Conversational Assistant",
    url: null,
    desc: "Standalone AI assistant for everyday business tasks — questions, drafting, documents, workflows.",
  },
  {
    slug: "wse-trading-bot", name: "WSE Trading Bot", status: "building",
    tag: "Forex · MetaTrader 5",
    url: null,
    desc: "Autonomous MT5 forex bot — confluence analysis, smart-money entries, hard risk controls.",
  },
  {
    slug: "ai-lead-generator", name: "AI Lead Generator", status: "building",
    tag: "Automation · Lead Prospecting",
    url: null,
    desc: "n8n pipeline that finds businesses with weak websites and strong reviews, then drafts the outreach.",
  },
  {
    slug: "wse-postpilot", name: "WSE PostPilot AI", status: "building",
    tag: "Content · Social Media",
    url: null,
    desc: "AI content engine — daily platform-optimised posts across LinkedIn, Instagram, Facebook, and X.",
  },
  {
    slug: "wse-autoreply", name: "WSE AutoReply Chatbot", status: "building",
    tag: "Automation · Customer Support",
    url: null,
    desc: "Support chatbot that answers enquiries, qualifies leads, and escalates to a human when needed.",
  },
  {
    slug: "whatsapp-autoreply", name: "WhatsApp AutoReply", status: "building",
    tag: "WhatsApp · Business Messaging",
    url: null,
    desc: "Automated WhatsApp responses for Nigerian businesses — FAQs, orders, bookings, lead capture, 24/7.",
  },
  {
    slug: "ai-construction-design", name: "AI Design Engine for Construction", status: "building",
    tag: "Construction · Design Automation",
    url: null,
    desc: "Automated construction design pipeline — from project brief to drawings and specs, built on an n8n automation core.",
  },
  {
    slug: "ai-data-os", name: "AI Operating System for Data Analysis", status: "building",
    tag: "Data · Multi-tenant SaaS",
    url: null,
    desc: "Multi-tenant AI operating system for data analysis — organisation accounts, API keys, and usage plans on a dedicated orchestration backend.",
  },
  {
    slug: "budgetrix", name: "Budgetrix", status: "building",
    tag: "Travel · Budget Planning",
    url: null,
    desc: "Budget-first travel planner — tell it what you have to spend, it builds the trip around it.",
  },
  {
    slug: "choirserve", name: "ChoirServe", status: "building",
    tag: "Faith Tech · Choir Management",
    url: null,
    desc: "Multi-tenant SaaS for church choir rosters, rehearsal scheduling, and attendance.",
  },
  {
    slug: "wiz-9ja", name: "Wiz-9ja", status: "building",
    tag: "AI · Nigerian Pidgin Voice & Content",
    url: null,
    desc: "AI voice and content platform built natively for Nigerian Pidgin.",
  },
  {
    slug: "wse-scripturebeam", name: "WSE ScriptureBeam", status: "building",
    tag: "Faith Tech · Live Presentation",
    url: null,
    desc: "Real-time scripture detection and display for live sermons.",
  },
  {
    slug: "amazo-books", name: "Amazo Books", status: "building",
    tag: "Publishing · Digital Products",
    url: null,
    desc: "WSE Lab Consult's self-publishing line — AI business playbooks for African entrepreneurs.",
  },
];

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed." });
  }

  const q = (event.queryStringParameters || {}).status;
  const filtered = q ? PRODUCTS.filter((p) => p.status === q) : PRODUCTS;

  return json(200, {
    total: filtered.length,
    live: PRODUCTS.filter((p) => p.status === "live").length,
    building: PRODUCTS.filter((p) => p.status === "building").length,
    products: filtered,
  });
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify(body),
  };
}
