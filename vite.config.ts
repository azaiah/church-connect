/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * Public address. Lives in ONE place: site.config.json.
 * Every canonical tag, link-preview tag, sitemap entry and robots.txt line is built from it,
 * so a link texted or posted anywhere always shows and opens this exact address.
 */
const SITE_URL: string = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8')).url.replace(/\/+$/, '')
const SITE_HOST = new URL(SITE_URL).host

type PageMeta = {
  /** Route path, no trailing slash except root */
  path: string
  /** Output HTML file in dist ('index.html' for root) */
  file: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  image: string
  imageAlt: string
  index: boolean
  sitemapPriority?: number
}

const platformImage = '/og-image.png'
const churchImage = '/og-church.png'

/** Link previews per shareable entry point. Deep links fall back to their section's page. */
const pages: PageMeta[] = [
  {
    path: '/', file: 'index.html',
    title: 'ChurchConnect by DataIsData | Church Website, CRM and AI-Powered Operations Platform',
    description: 'ChurchConnect brings a modern church website, member portal, membership CRM, giving, ministry operations, facilities and an AI administrative workforce into one connected platform. Built by DataIsData.',
    ogTitle: 'ChurchConnect | Modernizing the business of running a church',
    ogDescription: 'Church website, member portal, CRM, finance, ministries, facilities and AI agents in one connected platform. Built by DataIsData.',
    image: platformImage, imageAlt: 'ChurchConnect by DataIsData: Modernizing the business of running a church.', index: true, sitemapPriority: 1.0,
  },
  {
    path: '/church', file: 'church.html',
    title: 'Grace Harbor Community Church | ChurchConnect live demo',
    description: 'A live demo church website built on ChurchConnect: plan a visit, sermons, events, online giving, prayer requests, serving and an AI assistant.',
    ogTitle: 'Grace Harbor Community Church | Live ChurchConnect demo',
    ogDescription: 'See a church website built on ChurchConnect: plan a visit, watch sermons, register for events, give online and send a prayer request.',
    image: churchImage, imageAlt: 'Grace Harbor Community Church, a live demo church website built on ChurchConnect.', index: true, sitemapPriority: 0.8,
  },
  {
    path: '/portal', file: 'portal.html',
    title: 'Member Portal demo | ChurchConnect by DataIsData',
    description: 'Live demo of the ChurchConnect member portal: giving history and statements, event registrations, ministries, prayer and care requests.',
    ogTitle: 'ChurchConnect Member Portal | Live demo',
    ogDescription: 'Giving history and year-end statements, event registrations, ministries and care requests in one secure member portal.',
    image: platformImage, imageAlt: 'ChurchConnect member portal live demo by DataIsData.', index: false,
  },
  {
    path: '/admin', file: 'admin.html',
    title: 'Church Admin and CRM demo | ChurchConnect by DataIsData',
    description: 'Live back-office demo: members, giving, finance, ministries, events, facilities and AI agents, with plain-language Guide mode for church staff.',
    ogTitle: 'ChurchConnect Admin and CRM | Live demo',
    ogDescription: 'Run the church office in one place: members, giving, finance, ministries, events, facilities and AI agents, with plain-language guides for staff.',
    image: platformImage, imageAlt: 'ChurchConnect church admin and CRM live demo by DataIsData.', index: false,
  },
  {
    path: '/privacy', file: 'privacy.html',
    title: 'Privacy Policy | ChurchConnect by DataIsData',
    description: 'How ChurchConnect by DataIsData collects, uses and protects information.',
    ogTitle: 'Privacy Policy | ChurchConnect by DataIsData',
    ogDescription: 'How ChurchConnect by DataIsData collects, uses and protects information.',
    image: platformImage, imageAlt: 'ChurchConnect by DataIsData.', index: true, sitemapPriority: 0.2,
  },
  {
    path: '/terms', file: 'terms.html',
    title: 'Terms of Service | ChurchConnect by DataIsData',
    description: 'The terms that govern use of ChurchConnect by DataIsData.',
    ogTitle: 'Terms of Service | ChurchConnect by DataIsData',
    ogDescription: 'The terms that govern use of ChurchConnect by DataIsData.',
    image: platformImage, imageAlt: 'ChurchConnect by DataIsData.', index: true, sitemapPriority: 0.2,
  },
]

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function render(template: string, p: PageMeta): string {
  const url = p.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${p.path}`
  const map: Record<string, string> = {
    '__PAGE_TITLE__': esc(p.title),
    '__PAGE_DESC__': esc(p.description),
    '__PAGE_ROBOTS__': p.index ? 'index, follow' : 'noindex, follow',
    '__PAGE_URL__': url,
    '__PAGE_OG_TITLE__': esc(p.ogTitle),
    '__PAGE_OG_DESC__': esc(p.ogDescription),
    '__PAGE_IMAGE__': `${SITE_URL}${p.image}`,
    '__PAGE_IMAGE_ALT__': esc(p.imageAlt),
    '__SITE_HOST__': SITE_HOST,
  }
  let out = template
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(v)
  const left = out.match(/__(?:PAGE_[A-Z_]+|SITE_HOST)__/)
  if (left) throw new Error(`site-meta: unreplaced token ${left[0]}`)
  return out
}

function siteMeta(): Plugin {
  let template = ''
  let outDir = 'dist'
  return {
    name: 'site-meta',
    configResolved(c) { outDir = resolve(c.root, c.build.outDir) },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        template = html
        return render(html, pages[0])
      },
    },
    closeBundle() {
      if (!template) return
      for (const p of pages.slice(1)) {
        const f = resolve(outDir, p.file)
        mkdirSync(dirname(f), { recursive: true })
        writeFileSync(f, render(template, p))
      }
      const today = new Date().toISOString().slice(0, 10)
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
        .filter((p) => p.index)
        .map((p) => `  <url><loc>${p.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${p.path}`}</loc><lastmod>${today}</lastmod><priority>${(p.sitemapPriority ?? 0.5).toFixed(1)}</priority></url>`)
        .join('\n')}\n</urlset>\n`
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap)
      writeFileSync(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
    },
  }
}

export default defineConfig({
  plugins: [react(), siteMeta()],
  define: {
    __SITE_URL__: JSON.stringify(SITE_URL),
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
