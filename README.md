# WSE AI Lab — Project Repository

Two deployments from one repo. Both are single-file HTML apps — no build step needed.

```
wse-ai-lab/
├── website/                        ← Public-facing company website
│   ├── index.html                  ← wse-ai-lab-website.html
│   └── netlify/
│       └── functions/
│           └── chat.js             ← Chatbot API proxy (server-side key)
│
├── os/                             ← Internal operating system (password-protected)
│   └── index.html                  ← wse-labs-os.html
│
└── README.md
```

---

## Deploy: Public Website

**Netlify → New Site → Import from GitHub**

| Setting           | Value                        |
|-------------------|------------------------------|
| Base directory    | `website`                    |
| Publish directory | `website`                    |
| Build command     | *(leave blank)*              |

**Environment Variables (Site Settings → Env Vars):**

| Key                   | Value                        |
|-----------------------|------------------------------|
| `ANTHROPIC_API_KEY`   | `sk-ant-...your key...`      |

Get your key at: https://console.anthropic.com

**Before deploying — two placeholders to fill in `website/index.html`:**

1. **Formspree** — go to https://formspree.io, create a free form, copy the ID
   - Find: `action="https://formspree.io/f/YOUR_FORM_ID"`
   - Replace: `YOUR_FORM_ID` with your actual form ID (e.g. `xpwzgkla`)

2. **WhatsApp QR** — already set to `+2348160829058`, no change needed

---

## Deploy: WSE Labs OS

**Netlify → New Site → Import from GitHub (same repo)**

| Setting           | Value                        |
|-------------------|------------------------------|
| Base directory    | `os`                         |
| Publish directory | `os`                         |
| Build command     | *(leave blank)*              |

**Password protect it (Site Settings → Access Control → Password):**
- Set a strong password — only you should access this

No environment variables needed for the OS yet.
When Supabase connects: add `SUPABASE_URL` and `SUPABASE_ANON_KEY` here.

---

## What's Built

### Public Website (`website/index.html`)
- Hero — "Africa's AI Execution Lab" + 4 metrics
- Services — 4 service cards
- Products — 13 products in 4-col grid with Live/Building badges
- How We Work — OODA loop with animated SVG diagram
- Track Record — 4 big numbers
- Pricing — 3 tiers (₦350k / ₦1.2M+ / Custom)
- Contact — Email button + WhatsApp QR code
- Inquiry form — Formspree, 5 fields, success state
- Chatbot (Wizzy) — floating widget, powered by Claude via Netlify function

### WSE Labs OS (`os/index.html`)
| Module        | Status   | Notes                                        |
|---------------|----------|----------------------------------------------|
| Dashboard     | ✅ Built  | Revenue chart, metrics, activity, leads      |
| Tasks         | ✅ Built  | Kanban board, task detail panel, subtasks    |
| CRM           | ✅ Built  | Customer table, pipeline board               |
| Finance       | ✅ Built  | P&L chart, invoices, expenses, tax           |
| Reconciliation| ✅ Built  | Full recon module                            |
| Bookings      | ✅ Built  | Calendar tabs, booking cards, new booking modal |
| Inventory     | ✅ Built  | Stock table, low-stock alerts, add item      |
| AI Engine     | ✅ Built  | Model config, prompt templates, usage chart  |
| Settings      | ✅ Built  | Profile, workspace, billing, notifications, integrations, appearance |
| Businesses    | 🔲 Stub   | View exists, content TBD                     |
| Workflows     | 🔲 Stub   | View exists, content TBD                     |

**Three-theme switcher included:** Fintech Dark / Arctic Light / Obsidian Gold

---

## Next Steps (with Claude Code)

### Immediate
- [ ] Replace `YOUR_FORM_ID` in `website/index.html` with your Formspree form ID
- [ ] Add `ANTHROPIC_API_KEY` env var in Netlify dashboard
- [ ] Push to GitHub and deploy both sites

### Short term
- [ ] Connect OS to Supabase — swap hardcoded data for live DB queries
- [ ] Add Paystack billing to Memora OS
- [ ] Build Businesses and Workflows modules in OS
- [ ] Add Solwise Realty AI sales page to website

### When ready to go live
- [ ] Point custom domain at website Netlify site
- [ ] Point `os.yourdomain.com` at OS Netlify site
- [ ] Switch Paystack from test mode to live mode (needs CAC registration)
- [ ] Move to Render paid tier ($7/mo) for always-on backend

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | HTML/CSS/JS, React + Vite (Memora OS)  |
| Backend    | FastAPI on Render (free tier)           |
| Database   | Supabase (DB + Auth + Storage + pgvector)|
| AI         | Claude API (Anthropic), Gemini (embeds) |
| Automation | n8n Community Edition on Railway        |
| Payments   | Paystack (Nigeria), Stripe (global)     |
| Deploy     | Netlify (website + OS), Vercel (Memora) |

---

## Contact
- Email: support.wselabs@gmail.com
- WhatsApp: +2348160829058
- Founder: Wisdom Solomon Esic, Lagos, Nigeria
