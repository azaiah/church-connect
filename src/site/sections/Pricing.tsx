import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Rise, Stagger, item, Underline } from '../motion'
import { tiers, pricingNotes } from '@/config/site'
import { LinkButton } from '@/components/Button'
import { Badge } from '@/components/Badge'

const fmt = (n: number) => '$' + n.toLocaleString()

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28">
      <Rise className="max-w-2xl">
        <p className="eyebrow">Business model</p>
        <h2 className="display text-3xl sm:text-4xl mt-3">A repeatable, subscription-based service. <Underline>Not a one-time website</Underline>.</h2>
        <p className="lede mt-5">One shared platform configured for each church, so DataIsData scales across individual churches, larger congregations and multi-campus organizations.</p>
      </Rise>
      <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
        {tiers.map((t) => (
          <motion.article key={t.id} variants={item} className={`card p-6 flex flex-col ${t.highlight ? 'ring-2 ring-gold' : ''}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-display text-2xl font-semibold">{t.name}</h3>
              {t.highlight && <Badge tone="gold">{t.highlight}</Badge>}
            </div>
            <p className="text-sm text-slate mt-1">{t.audience}</p>
            <p className="mt-5 font-display text-3xl font-semibold">{fmt(t.monthlyFrom)}<span className="text-base text-slate font-sans font-normal"> to {fmt(t.monthlyTo)} / mo</span></p>
            <p className="stamp mt-1">Implementation {fmt(t.setupFrom)} to {fmt(t.setupTo)} one-time</p>
            <ul className="mt-5 space-y-2 text-sm flex-1">{t.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="text-gold mt-0.5 shrink-0" /> {f}</li>)}</ul>
            <div className="mt-6"><LinkButton to="/#pilot" variant={t.highlight ? 'primary' : 'outline'} className="w-full">Request a pilot</LinkButton></div>
          </motion.article>
        ))}
      </Stagger>
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate">{pricingNotes.map((n) => <li key={n}>{n}</li>)}</ul>
    </section>
  )
}
