import { useState } from 'react'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Rise, Underline } from '../motion'
import { Badge } from '@/components/Badge'
import { modules } from '@/config/platform'

export function Modules() {
  const [active, setActive] = useState(modules[0].id)
  const m = modules.find((x) => x.id === active) ?? modules[0]
  return (
    <section id="modules" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28">
      <Rise className="max-w-2xl">
        <p className="eyebrow">The 12 core back-end modules</p>
        <h2 className="display text-3xl sm:text-4xl mt-3">Each module stands alone. <Underline>All of them share one database</Underline>, according to permissions.</h2>
        <p className="lede mt-5">The first release is built around five essentials: Membership CRM, Finance and Giving, the Administrative Office, Events and Ministries, and the AI Administrative Assistant.</p>
      </Rise>
      <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
        <Rise>
          <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1" role="tablist" aria-label="Modules">
            {modules.map((x) => {
              const on = x.id === active
              return (
                <li key={x.id}>
                  <button type="button" role="tab" aria-selected={on} onClick={() => setActive(x.id)} className={`w-full text-left flex items-center gap-3 rounded-xl border px-3 py-2.5 min-h-[52px] transition-colors ${on ? 'bg-midnight text-white border-midnight' : 'bg-paper border-line hover:border-slate'}`}>
                    <span className={`font-mono text-[11px] w-6 ${on ? 'text-gold-light' : 'text-slate'}`}>{String(x.n).padStart(2, '0')}</span>
                    <x.icon size={18} className={on ? 'text-gold-light' : 'text-royal'} />
                    <span className="text-sm font-medium flex-1">{x.name}</span>
                    {x.firstRelease && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${on ? 'bg-gold-light' : 'bg-gold'}`} title="First release" />}
                    <ChevronRight size={14} className={on ? 'opacity-100' : 'opacity-30'} />
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="stamp mt-3 flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> First release (pilot)</p>
        </Rise>
        <AnimatePresence mode="wait">
          <motion.article key={m.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-royal-50 text-royal flex items-center justify-center"><m.icon size={24} /></div>
              <div className="flex-1 min-w-[200px]"><p className="stamp">Module {m.n}</p><h3 className="font-display text-2xl font-semibold">{m.name}</h3></div>
              {m.firstRelease ? <Badge tone="gold">First release</Badge> : <Badge>Phase 4 expansion</Badge>}
            </div>
            <p className="mt-4 text-slate leading-relaxed">{m.summary}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="stamp mb-2">Capabilities</p>
                <ul className="space-y-1.5">{m.capabilities.map((c) => <li key={c} className="flex items-start gap-2 text-sm"><CheckCircle2 size={15} className="text-gold mt-0.5 shrink-0" /> {c}</li>)}</ul>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl bg-linen border border-line p-4"><p className="stamp mb-1">Example workflow</p><p className="text-sm text-midnight leading-relaxed">{m.example}</p></div>
                <div className="rounded-xl bg-gold-50 border border-gold/20 p-4"><p className="stamp text-gold mb-1">Business value</p><p className="text-sm text-midnight">{m.value}</p></div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  )
}
