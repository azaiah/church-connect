import { Rise, Underline } from '../motion'
import { Mark } from '@/components/Logo'

const scenarios = [[10, 7990, 95880], [25, 19975, 239700], [50, 39950, 479400], [100, 79900, 958800]]
const why = ['Website and digital platform development', 'CRM implementation and business process automation', 'AI agents and workflow modernization', 'Financial and operational reporting', 'Community outreach and economic development opportunities', 'Ongoing technology strategy, maintenance and innovation services']

export function Ecosystem() {
  return (
    <section className="bg-midnight text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28 grid gap-12 lg:grid-cols-2 items-start">
        <Rise>
          <p className="eyebrow text-gold-light">Why DataIsData</p>
          <h2 className="display text-3xl sm:text-4xl mt-3">A long-term innovation and technology partner, <Underline>not a vendor</Underline>.</h2>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">The church does not need to hire developers, AI specialists and business analysts. Through our Innovation as a Service model, DataIsData provides the technology, operational support and continuous improvement.</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 text-sm">{why.map((w) => <li key={w} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">{w}</li>)}</ul>
        </Rise>
        <Rise delay={0.1}>
          <p className="eyebrow text-gold-light">The bigger opportunity</p>
          <h3 className="font-display text-2xl font-semibold mt-3">A church technology ecosystem</h3>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-2 justify-center rounded-lg bg-midnight/70 border border-white/10 py-3 px-4"><Mark size={22} light /><span className="font-semibold">ChurchConnect Platform</span></div>
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-white/50 mt-2">Shared technology foundation &middot; Secure tenant separation</p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {['Church A', 'Church B', 'Church C'].map((c) => <div key={c} className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-3 text-center"><p className="text-sm font-semibold">{c}</p><p className="text-[11px] text-white/60">Website + CRM</p></div>)}
            </div>
            <div className="mt-3 rounded-lg border border-white/10 px-3 py-2 text-center text-xs text-white/70">AI Agents &middot; Communications &middot; Reporting &middot; Integrations &middot; Security</div>
          </div>
          <table className="mt-5 w-full text-sm">
            <caption className="text-left stamp text-white/50 mb-2">At a hypothetical average subscription of $799 per month</caption>
            <thead><tr className="text-left text-white/50 text-xs uppercase font-mono"><th className="py-2">Churches</th><th className="py-2">Monthly recurring</th><th className="py-2">Annual recurring</th></tr></thead>
            <tbody>{scenarios.map(([c, m, a]) => <tr key={c} className="border-t border-white/10"><td className="py-2 font-semibold">{c}</td><td className="py-2 font-mono">${m.toLocaleString()}</td><td className="py-2 font-mono text-gold-light">${a.toLocaleString()}</td></tr>)}</tbody>
          </table>
          <p className="mt-2 text-xs text-white/50">Gross subscription revenue scenarios before platform operating expenses, acquisition costs and support.</p>
        </Rise>
      </div>
    </section>
  )
}
