import { Globe, ShieldCheck, ArrowRight } from 'lucide-react'
import { Rise, Underline } from '../motion'
import { LinkButton } from '@/components/Button'
import { websiteFeatures } from '@/config/platform'

const backOffice = [['Membership records', 'Centralized searchable member CRM'], ['Tithes and offerings', 'Digital giving records, statements, reconciliation'], ['Church accounting', 'Budget dashboards, expenses, integrations'], ['Church secretary duties', 'Scheduling, correspondence, reminders, documents'], ['Visitor follow-up', 'Automated welcome and follow-up assignments'], ['Ministry coordination', 'Dashboards, calendars, volunteer management'], ['Facility management', 'Reservations, maintenance, assets'], ['Pastoral care', 'Confidential requests, assignments, follow-up'], ['Meetings and committees', 'Agendas, notes, tasks, approvals'], ['Reporting', 'Real-time operational, financial, engagement dashboards']]

export function Platform() {
  return (
    <section id="platform" className="scroll-mt-20 bg-paper border-y border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28">
        <Rise className="max-w-2xl">
          <p className="eyebrow">The two-part platform</p>
          <h2 className="display text-3xl sm:text-4xl mt-3">A digital front door and an <Underline>operational engine</Underline>, sharing one database.</h2>
        </Rise>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Rise className="card p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-gold-50 text-gold flex items-center justify-center"><Globe size={22} /></div>
              <div><p className="stamp">Front end</p><h3 className="font-display text-2xl font-semibold">Digital Church Experience</h3></div>
            </div>
            <p className="mt-4 text-slate leading-relaxed">The public-facing website where members, visitors, families, community organizations and prospective partners interact with the church. Open 24 hours a day.</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {websiteFeatures.map((w) => (
                <li key={w.f} className="rounded-lg border border-line bg-linen/60 px-3 py-2.5"><p className="text-sm font-semibold">{w.f}</p><p className="text-xs text-slate mt-0.5">{w.v}</p></li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <LinkButton to="/church" variant="primary" icon={<ArrowRight size={16} />}>Tour the church website</LinkButton>
              <LinkButton to="/portal" variant="outline">Member portal</LinkButton>
            </div>
          </Rise>
          <Rise delay={0.1} className="card p-6 sm:p-8 flex flex-col bg-midnight text-white border-midnight">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-white/10 text-gold-light flex items-center justify-center"><ShieldCheck size={22} /></div>
              <div><p className="stamp text-white/50">Back end</p><h3 className="font-display text-2xl font-semibold">Church Operations CRM</h3></div>
            </div>
            <p className="mt-4 text-white/70 leading-relaxed">A secure, centralized management portal for pastors, administrators, finance teams, ministry leaders and volunteers. Think Salesforce, a financial system, an administrative portal and an AI-powered virtual office, designed around how churches operate.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 text-sm">
              {backOffice.map(([a, b]) => (
                <div key={a} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5"><p className="font-semibold">{a}</p><p className="text-xs text-white/60 mt-0.5">{b}</p></div>
              ))}
            </div>
            <div className="mt-6"><LinkButton to="/admin" variant="primary" icon={<ArrowRight size={16} />}>Open the admin demo</LinkButton></div>
          </Rise>
        </div>
      </div>
    </section>
  )
}
