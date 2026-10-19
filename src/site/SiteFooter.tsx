import { Link } from 'react-router-dom'
import { Logo, PoweredBy } from '@/components/Logo'
import { site } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="bg-midnight text-white ruled-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-white/65 max-w-sm leading-relaxed">A Church Business Operations and Innovation Platform. Website, member portal, CRM, finance, ministries, facilities, communications and an AI administrative workforce in one connected environment.</p>
          <PoweredBy light className="mt-6" />
        </div>
        <div>
          <p className="stamp text-white/50">Platform</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[['/#platform', 'Two-part platform'], ['/#modules', '12 modules'], ['/#agents', 'AI agent workforce'], ['/#security', 'Roles and security'], ['/#pricing', 'Pricing']].map(([to, l]) => (
              <li key={to}><Link to={to} className="text-white/80 hover:text-white">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="stamp text-white/50">Live demos</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/church" className="text-white/80 hover:text-white">Church website</Link></li>
            <li><Link to="/portal" className="text-white/80 hover:text-white">Member portal</Link></li>
            <li><Link to="/admin" className="text-white/80 hover:text-white">Admin and CRM</Link></li>
            <li><Link to="/#pilot" className="text-white/80 hover:text-white">Request a pilot</Link></li>
          </ul>
        </div>
        <div>
          <p className="stamp text-white/50">DataIsData</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
            <li><a href={site.phoneHref} className="hover:text-white">{site.phone}</a></li>
            <li>{site.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} {site.company}. All rights reserved. Innovation as a Service.</p>
          <p className="flex gap-4"><Link to="/privacy" className="hover:text-white hit">Privacy</Link><Link to="/terms" className="hover:text-white hit">Terms</Link></p>
        </div>
      </div>
    </footer>
  )
}
