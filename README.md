# ChurchConnect by DataIsData

A Church Business Operations and Innovation Platform: church website + member portal + CRM back office + AI agent workforce, built as a working demo from Tony Wood's ChurchConnect platform writeup.

Stack: Vite 5, React 18, TypeScript, Tailwind 3, framer-motion, lucide-react, react-router 6. Same stack as Gundy Consultations.

## Surfaces

| Route | What it is | Who it is for |
|---|---|---|
| `/` | ChurchConnect product site: platform, 12 modules, 6 AI agents, savings calculator, pricing, roadmap, roles and security, pilot request form | Tony selling to churches |
| `/church` | Demo church public website (fictional **Grace Harbor Community Church**, Richmond VA): visit, about, sermons, events + registration, give, prayer and care, serve, community resource center, contact, AI virtual assistant | What a church's members and neighbors see |
| `/portal` | Member portal: overview, giving history and statements, my events, my ministries, prayer and care, profile and consent | A member (demo: Monique Hayes) |
| `/admin` | Admin and CRM: role gate (7 roles), Pastor's Executive Dashboard, Action Center, all 12 modules, Monday Morning Package, settings, help | Pastor, administrator, finance, secretary, ministry leaders, volunteers, DataIsData support |

All four surfaces share **one data store** (`src/data/`), persisted in `localStorage` under `churchconnect-demo-v1`. A prayer request on the church website appears in the admin care queue; an online gift lands in Finance as "recorded" and shows in the member's portal; an approved event request reserves the room and publishes the registration page. That is the demo's core argument.

## Guide mode (for non-technical staff)

Every admin page opens with a plain-language guide panel: what the tool is for, who usually owns it, which tasks can be handed to someone, and a step-by-step walkthrough with "Take me there" buttons. Toggle it with the **Guide on/off** button in the top bar (or Settings → Security). It is on by default for first-time visitors and the setting persists. The member portal has the same toggle with a short tip per page. Content lives in `src/admin/guides.ts` and `src/portal/PortalApp.tsx` (`portalTips`).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build  -> dist/
npm run preview
```

Deploy on Netlify: build command `npm run build`, publish `dist` (netlify.toml included). Forms `pilot-request` and `church-contact` are Netlify Forms (hidden static copies live in `index.html`).

## Demo script for Tony (5 minutes)

1. **Landing** (`/`): hero, 12 modules tabs, 6 agents, savings calculator, pricing tiers, roadmap.
2. **Church website** (`/church`): submit a prayer request and register for the Health Fair.
3. **Admin** (`/admin`) as **Senior Pastor**: Executive Dashboard; Members → Pastoral care shows the request you just submitted; Events → Health Fair shows the registration.
4. **AI Agents**: Run Monday package now → review a draft → edit → Approve (bulletin lands in Office, report in Documents).
5. **Role switch**: Church Secretary cannot see Finance; Finance Officer sees gifts but not pastoral notes; Volunteer sees schedules only.
6. **Give** on the church site → Finance (as Finance Officer) → Reconcile → Member portal updates.

Reset anything with the Reset button in the admin top bar or Settings → Security.

## Public address and link previews

The live address is set in **one place**: `site.config.json` (`"url"`). Currently `https://church-connect-dataisdata.netlify.app`.

At build time (`vite.config.ts`, plugin `site-meta`) it is stamped into:

- every canonical tag and every `og:url` / `og:image` / `twitter:image` tag
- `robots.txt` and `sitemap.xml` (generated into `dist/`, not kept in `public/`)
- `site.domain` inside the app
- the redirect that forwards Netlify's hashed deploy addresses (`abc123--church-connect-dataisdata.netlify.app`) and branch addresses to the main address. Deploy previews (`deploy-preview-N--...`) are left alone so pull requests can still be reviewed.

Each shareable section gets its own page with its own preview card:

| Link | Preview title | Image |
|---|---|---|
| `/` | ChurchConnect: Modernizing the business of running a church | `public/og-image.png` |
| `/church` (and every `/church/...` page) | Grace Harbor Community Church: Live ChurchConnect demo | `public/og-church.png` |
| `/portal/...` | ChurchConnect Member Portal: Live demo | `og-image.png` |
| `/admin/...` | ChurchConnect Admin and CRM: Live demo | `og-image.png` |
| `/privacy`, `/terms` | Policy titles | `og-image.png` |

Preview text and titles live in the `pages` list in `vite.config.ts`. `/portal` and `/admin` are marked `noindex` so search engines skip the demo screens, but they are not blocked in `robots.txt`, so texting or posting those links still shows a preview card.

**Switching to a custom domain later:** add the domain in Netlify, set it as primary, change `url` in `site.config.json`, push. Nothing else needs editing.

**If a preview looks out of date after a change:** iMessage and most apps cache link previews per device or per link. Check new previews with Facebook's Sharing Debugger or LinkedIn's Post Inspector (both re-fetch on demand).

## Before launch (search for `TODO: confirm with Tony`)

- `src/config/site.ts`: DataIsData email, phone, address
- `site.config.json`: switch `url` if a custom domain is connected
- `src/pages/Privacy.tsx`, `src/pages/Terms.tsx`: final legal text
- Pricing in `src/config/site.ts` is the writeup's preliminary pricing, not validated quotes

## Structure

```
src/
  config/      site.ts (business details, tiers, phases)  platform.ts (modules, agents, roles)
  components/  Button, Card, Badge, Field, Modal, Drawer, Table, Tabs, charts, Logo
  data/        types.ts  seed.ts  store.tsx  selectors.ts  dates.ts  storage.ts
  site/        landing page sections
  church/      public church website + Assistant
  portal/      member portal
  admin/       nav.ts  actions.ts (cross-module workflow side effects)  layout/  modules/ (16)
```

What is simulated: AI agents (rule-based drafts from live data), payments (demo checkout, no card charged), SMS/email sends, integrations list. Everything else is a real client-side workflow with persistent state.

Powered by DataIsData.
