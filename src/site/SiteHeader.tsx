import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { LinkButton } from '@/components/Button'
import { useFocusTrap } from '@/components/useFocusTrap'

const links = [
  { to: '/#platform', label: 'Platform' },
  { to: '/#modules', label: 'Modules' },
  { to: '/#agents', label: 'AI Agents' },
  { to: '/#savings', label: 'Savings' },
  { to: '/#pricing', label: 'Pricing' },
  { to: '/#roadmap', label: 'Roadmap' },
]

export function SiteHeader({ overDark = false }: { overDark?: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const loc = useLocation()
  useFocusTrap(ref, open, () => setOpen(false))
  useEffect(() => setOpen(false), [loc])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const light = overDark && !scrolled
  return (
    <header className={`sticky top-0 z-50 transition-colors ${scrolled ? 'bg-linen/90 backdrop-blur border-b border-line' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo light={light} />
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`px-3 py-2 text-sm font-medium rounded-lg min-h-[44px] inline-flex items-center ${light ? 'text-white/75 hover:text-white' : 'text-slate hover:text-midnight'}`}>{l.label}</Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <LinkButton to="/church" variant="outline" size="sm" className={`hidden xl:inline-flex ${light ? '!bg-white/5 !text-white !border-white/25 hover:!border-white/60' : ''}`}>See a church site</LinkButton>
          <LinkButton to="/admin" variant={light ? 'primary' : 'dark'} size="sm" icon={<ArrowRight size={16} />}>Open the admin demo</LinkButton>
        </div>
        <button type="button" onClick={() => setOpen(true)} className={`lg:hidden tap inline-flex items-center justify-center rounded-lg ${light ? 'text-white hover:bg-white/10' : 'hover:bg-midnight/5'}`} aria-label="Open menu"><Menu size={22} /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="presentation">
          <div className="absolute inset-0 bg-midnight/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1} className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-paper shadow-lift flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-line">
              <Logo size="sm" />
              <button type="button" onClick={() => setOpen(false)} className="tap inline-flex items-center justify-center rounded-lg hover:bg-midnight/5" aria-label="Close menu"><X size={22} /></button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-3">
              {links.map((l) => <Link key={l.to} to={l.to} className="block rounded-lg px-3 py-3 text-base font-medium text-midnight hover:bg-linen">{l.label}</Link>)}
            </nav>
            <div className="p-4 border-t border-line grid gap-2">
              <LinkButton to="/church" variant="outline">See a church site</LinkButton>
              <LinkButton to="/portal" variant="secondary">Member portal</LinkButton>
              <LinkButton to="/admin" variant="dark" icon={<ArrowRight size={16} />}>Open the admin demo</LinkButton>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
