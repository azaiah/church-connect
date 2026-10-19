import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, Heart, LayoutDashboard, User } from 'lucide-react'
import { useDemo } from '@/data/store'
import { LinkButton } from '@/components/Button'
import { useFocusTrap } from '@/components/useFocusTrap'
import { ScrollProgress } from '@/components/ScrollProgress'
import { PoweredBy } from '@/components/Logo'
import { Assistant } from './Assistant'

const nav = [
  { to: '/church/visit', label: "I'm New" },
  { to: '/church/about', label: 'About' },
  { to: '/church/sermons', label: 'Sermons' },
  { to: '/church/events', label: 'Events' },
  { to: '/church/serve', label: 'Serve' },
  { to: '/church/resources', label: 'Community Resources' },
  { to: '/church/prayer', label: 'Prayer & Care' },
  { to: '/church/contact', label: 'Contact' },
]

export function ChurchMark({ size = 32, light = false }: { size?: number; light?: boolean }) {
  const stroke = light ? '#FFFFFF' : '#101C2E'
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4 29 16 5l12 24" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M16 5v24M9 29h14" stroke="#B8862B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M2 24c4 0 4 3 8 3s4-3 8-3 4 3 8 3 4-3 4-3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity=".6" />
    </svg>
  )
}

export function ChurchLogo({ light = false, size = 'md' }: { light?: boolean; size?: 'sm' | 'md' }) {
  const { state } = useDemo()
  return (
    <Link to="/church" className="inline-flex items-center gap-2.5 min-h-[44px]" aria-label={`${state.church.name} home`}>
      <ChurchMark size={size === 'sm' ? 28 : 34} light={light} />
      <span className="leading-none">
        <span className={`block font-display font-semibold ${size === 'sm' ? 'text-base' : 'text-lg'} ${light ? 'text-white' : 'text-midnight'}`}>{state.church.shortName}</span>
        <span className={`block font-mono text-[9px] uppercase tracking-[0.2em] mt-1 ${light ? 'text-white/60' : 'text-slate'}`}>Community Church</span>
      </span>
    </Link>
  )
}

export function ChurchLayout() {
  const { state } = useDemo()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const loc = useLocation()
  useFocusTrap(ref, open, () => setOpen(false))
  useEffect(() => setOpen(false), [loc])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const isHome = loc.pathname === '/church' || loc.pathname === '/church/'
  const light = isHome && !scrolled

  return (
    <div className="min-h-screen flex flex-col bg-linen">
      <ScrollProgress />
      {/* Demo context bar */}
      <div className="bg-midnight text-white/80 text-xs no-print">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-9 flex items-center justify-between gap-3">
          <span className="truncate"><span className="font-mono uppercase tracking-wider text-gold-light">Demo</span> &middot; A fictional church website built on ChurchConnect</span>
          <span className="flex items-center gap-3 shrink-0">
            <Link to="/portal" className="hover:text-white hit-sm gap-1"><User size={12} /> Member portal</Link>
            <Link to="/admin" className="hover:text-white hit-sm gap-1"><LayoutDashboard size={12} /> Admin</Link>
            <Link to="/" className="hover:text-white hidden sm:inline-flex items-center min-h-[36px]">Platform</Link>
          </span>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-colors ${scrolled || !isHome ? 'bg-linen/92 backdrop-blur border-b border-line' : 'bg-transparent'} ${light ? '-mb-20' : ''}`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <ChurchLogo light={light} />
          <nav aria-label="Primary" className="hidden xl:flex items-center gap-0.5">
            {nav.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-lg min-h-[44px] inline-flex items-center ${light ? (isActive ? 'text-white' : 'text-white/75 hover:text-white') : isActive ? 'text-midnight bg-paper' : 'text-slate hover:text-midnight'}`}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="hidden xl:flex items-center gap-2">
            <LinkButton to="/church/give" variant="primary" size="sm" icon={<Heart size={16} />}>Give</LinkButton>
            <LinkButton to="/portal" variant="outline" size="sm" className={light ? '!bg-white/5 !text-white !border-white/25 hover:!border-white/60' : ''}>Member login</LinkButton>
          </div>
          <button type="button" onClick={() => setOpen(true)} className={`xl:hidden tap inline-flex items-center justify-center rounded-lg ${light ? 'text-white hover:bg-white/10' : 'hover:bg-midnight/5'}`} aria-label="Open menu"><Menu size={24} /></button>
        </div>
        {open && (
          <div className="fixed inset-0 z-[90] xl:hidden" role="presentation">
            <div className="absolute inset-0 bg-midnight/50" onClick={() => setOpen(false)} aria-hidden="true" />
            <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1} className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-paper shadow-lift flex flex-col">
              <div className="flex items-center justify-between px-5 h-20 border-b border-line">
                <ChurchLogo size="sm" />
                <button type="button" onClick={() => setOpen(false)} className="tap inline-flex items-center justify-center rounded-lg hover:bg-midnight/5" aria-label="Close menu"><X size={22} /></button>
              </div>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-3">
                {nav.map((l) => <NavLink key={l.to} to={l.to} className={({ isActive }) => `block rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-linen text-midnight' : 'text-midnight hover:bg-linen'}`}>{l.label}</NavLink>)}
              </nav>
              <div className="p-4 border-t border-line grid gap-2">
                <LinkButton to="/church/give" variant="primary" icon={<Heart size={16} />}>Give</LinkButton>
                <LinkButton to="/portal" variant="outline">Member login</LinkButton>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="main" className="flex-1"><Outlet /></main>

      <footer className="bg-midnight text-white ruled-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <ChurchLogo light />
            <p className="mt-4 text-sm text-white/65 max-w-sm leading-relaxed">{state.church.tagline}</p>
            <p className="mt-4 text-sm text-white/80">{state.church.address}<br />{state.church.city}</p>
            <p className="mt-2 text-sm text-white/80">{state.church.phone} &middot; {state.church.email}</p>
          </div>
          <div>
            <p className="stamp text-white/50">Worship with us</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {state.church.services.map((s) => <li key={s.label}><span className="font-semibold text-white">{s.day} {s.time}</span><br />{s.label}</li>)}
            </ul>
          </div>
          <div>
            <p className="stamp text-white/50">Connect</p>
            <ul className="mt-3 space-y-2 text-sm">
              {nav.slice(0, 5).map((l) => <li key={l.to}><Link to={l.to} className="text-white/80 hover:text-white">{l.label}</Link></li>)}
              <li><Link to="/church/give" className="text-white/80 hover:text-white">Give</Link></li>
            </ul>
          </div>
          <div>
            <p className="stamp text-white/50">Care</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/church/prayer" className="text-white/80 hover:text-white">Prayer and care requests</Link></li>
              <li><Link to="/church/resources" className="text-white/80 hover:text-white">Community resources</Link></li>
              <li><Link to="/church/contact" className="text-white/80 hover:text-white">Contact the office</Link></li>
              <li><Link to="/portal" className="text-white/80 hover:text-white hit gap-1">Member portal <ArrowRight size={12} /></Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/50">
            <p>&copy; {new Date().getFullYear()} {state.church.name}. A fictional church used for demonstration.</p>
            <Link to="/" className="hit"><PoweredBy light /></Link>
          </div>
        </div>
      </footer>
      <Assistant />
    </div>
  )
}
