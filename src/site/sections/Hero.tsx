import { ArrowRight, CheckCircle2, Users, Landmark, CalendarDays, ClipboardList } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { LinkButton } from '@/components/Button'
import { PoweredBy } from '@/components/Logo'

const kpis = [
  { icon: Users, label: 'Active members', value: '1,248', delta: '+18 this month' },
  { icon: Landmark, label: 'Monthly contributions', value: '$48,250', delta: '94% reconciled' },
  { icon: ClipboardList, label: 'Open requests', value: '24', delta: '8 need approval' },
  { icon: CalendarDays, label: 'Upcoming events', value: '12', delta: '3 this week' },
]

export function Hero() {
  const reduce = useReducedMotion()
  return (
    <section className="relative overflow-hidden mesh text-white -mt-16 pt-16">
      <div className="absolute inset-0 rays" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center">
        <div>
          <PoweredBy light />
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl mt-5">Modernizing the business of running a church.</h1>
          <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-xl">
            ChurchConnect brings membership, giving and finance, ministry operations, communications, facilities and an AI administrative workforce into one connected environment. Less time on paperwork and disconnected systems. More time and resources for the congregation and the community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/admin" variant="primary" size="lg" icon={<ArrowRight size={18} />}>Open the admin demo</LinkButton>
            <LinkButton to="/church" variant="outline" size="lg" className="!bg-white/5 !text-white !border-white/25 hover:!border-white/60">See the church website</LinkButton>
          </div>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2 text-sm text-white/75">
            {['Website, member portal and CRM share one database', 'Six AI agents prepare the work; people approve it', 'Role-scoped access down to confidential pastoral care', 'Multi-church tenancy with isolated data'].map((t) => (
              <li key={t} className="flex items-start gap-2"><CheckCircle2 size={16} className="text-gold-light mt-0.5 shrink-0" /> {t}</li>
            ))}
          </ul>
        </div>

        <motion.div initial={reduce ? undefined : { opacity: 0, y: 30, rotateX: 8 }} animate={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }} className="relative" style={{ perspective: 1200 }}>
          <div className="rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm shadow-lift overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">Pastor&rsquo;s Executive Dashboard</p>
                <p className="text-sm font-semibold mt-0.5">Grace Harbor Community Church</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/20 text-emerald-300 text-[11px] font-mono px-2 py-1"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300 animate-pulseDot" /> Secure</span>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {kpis.map((k, i) => (
                <motion.div key={k.label} initial={reduce ? undefined : { opacity: 0, y: 12 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="rounded-xl bg-midnight/60 border border-white/10 p-3">
                  <div className="flex items-center gap-2 text-white/55 text-xs"><k.icon size={14} /> {k.label}</div>
                  <p className="font-display text-2xl font-semibold mt-1">{k.value}</p>
                  <p className="text-[11px] text-gold-light mt-0.5">{k.delta}</p>
                </motion.div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 mb-2">Action Center</p>
              <ul className="space-y-1.5 text-sm">
                {[['New member follow-ups', '8 pending', 'text-gold-light'], ['Finance reconciliation', 'Review needed', 'text-amber-300'], ['Facility reservations', '3 requests', 'text-sky-300'], ['Monday Morning Package', 'Ready for review', 'text-emerald-300']].map(([a, b, t]) => (
                  <li key={a} className="flex items-center justify-between rounded-lg bg-white/[0.05] px-3 py-2">
                    <span className="text-white/85">{a}</span>
                    <span className={`font-mono text-[11px] ${t}`}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Illustrative portal with fictional church data</p>
        </motion.div>
      </div>
    </section>
  )
}
