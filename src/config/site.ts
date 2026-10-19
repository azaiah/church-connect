/**
 * Single source of truth for every business detail not yet confirmed.
 * Search this file for "TODO: confirm with Tony" before launch.
 */
export const site = {
  product: 'ChurchConnect',
  company: 'DataIsData, LLC',
  companyShort: 'DataIsData',
  tagline: 'Modernizing the business of running a church.',
  domain: __SITE_URL__, // Set in site.config.json only (drives link previews, canonical tags, sitemap, robots.txt)
  email: 'hello@dataisdata.com', // TODO: confirm with Tony
  phone: '(804) 555-0140', // TODO: confirm with Tony
  phoneHref: 'tel:+18045550140', // TODO: confirm with Tony
  address: 'Richmond, Virginia', // TODO: confirm with Tony
  pilotFormName: 'pilot-request',
  churchFormName: 'church-contact',
} as const

export type Tier = { id: 'essential' | 'pro' | 'enterprise'; name: string; monthlyFrom: number; monthlyTo: number; setupFrom: number; setupTo: number; audience: string; highlight?: string; features: string[] }

/** Preliminary market-entry pricing from the platform writeup. Not validated quotes. */
export const tiers: Tier[] = [
  { id: 'enterprise', name: 'Church Enterprise', monthlyFrom: 2000, monthlyTo: 5000, setupFrom: 8000, setupTo: 15000, audience: 'Large churches and multi-campus organizations',
    features: ['Everything in Operations Pro', 'Multi-campus and multi-entity tenants', 'Full AI agent workforce (6 agents) with approval routing', 'Facilities, rentals and asset management', 'Community services, workforce and partnership modules', 'Grant tracking and reporting', 'Accounting, payroll and payment integrations', 'Dedicated DataIsData innovation partner'] },
  { id: 'pro', name: 'Church Operations Pro', monthlyFrom: 799, monthlyTo: 1499, setupFrom: 3500, setupTo: 8000, audience: 'Growing churches that need CRM, financial workflows and ministry management', highlight: 'Most churches start here',
    features: ['Everything in Essential Church', 'Membership and household CRM with follow-up workflows', 'Finance: funds, budgets, expense approvals, reconciliation', 'Administrative Office: bulletins, letters, documents, routing', 'Ministry workspaces with calendars, budgets and volunteers', 'Events and program lifecycle management', 'AI Office Agent and AI Member Agent', 'Pastor’s Executive Dashboard'] },
  { id: 'essential', name: 'Essential Church', monthlyFrom: 299, monthlyTo: 499, setupFrom: 1500, setupTo: 3500, audience: 'Small churches that need a website, membership, giving and communications',
    features: ['Branded church website and member portal', 'Online giving with statements and fund tracking', 'Member registration and profiles', 'Events calendar with registration', 'Sermon and media library', 'Prayer and care requests', 'Email and text announcements', 'AI Virtual Church Assistant on the website'] },
]

export const pricingNotes = [
  'Proposed market-entry prices, not validated quotes.',
  'One-time implementation depends on data migration, integrations and training scope.',
  'Payment processing, messaging usage and third-party software are billed at cost.',
]

export const phases = [
  { when: 'Weeks 1 to 3', title: 'Church Operations Assessment', text: 'We review the existing website, membership records, financial processes, staffing, communications and ministry workflows, and agree on the pilot scope.' },
  { when: 'Weeks 4 to 8', title: 'Digital Foundation', text: 'Branded website, member portal, membership CRM, giving integration, calendars, communications and the administrative office go live.' },
  { when: 'Weeks 9 to 12', title: 'AI and Workflow Automation', text: 'AI administrative agents, automated follow-ups, reporting, approval workflows and the Monday Morning Package are turned on with human review.' },
  { when: 'Months 4 to 6', title: 'Community Services and Growth', text: 'Workforce services, community resource coordination, member business directory, facility rentals and advanced reporting.' },
]
