import { Bot, UserCheck, FileText, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Rise, Stagger, item, Underline } from '../motion'
import { agents } from '@/config/platform'
import { LinkButton } from '@/components/Button'

const monday = ['Giving and attendance summary', 'New visitor follow-up assignments', 'Upcoming ministry events', 'Outstanding volunteer needs', 'Unresolved maintenance requests', 'Draft weekly church newsletter']

export function Agents() {
  return (
    <section id="agents" className="scroll-mt-20 bg-midnight text-white ruled-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28">
        <Rise className="max-w-2xl">
          <p className="eyebrow text-gold-light">AI agent workforce</p>
          <h2 className="display text-3xl sm:text-4xl mt-3">Six agents prepare the work. <Underline>Your people approve it</Underline>.</h2>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">Instead of staff moving information from one system to another, AI agents handle structured administrative work and hand drafts to an authorized person. Sensitive financial decisions, pastoral matters, counseling and member information stay under human control.</p>
        </Rise>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <motion.article key={a.id} variants={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 flex flex-col">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-gold/20 text-gold-light flex items-center justify-center"><Bot size={20} /></div>
                <div><h3 className="font-semibold">{a.name}</h3><p className="text-xs text-white/55">{a.scope}</p></div>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-white/80 flex-1">{a.does.map((d) => <li key={d} className="flex gap-2"><span className="text-gold-light">&#8226;</span> {d}</li>)}</ul>
              <p className="mt-4 pt-3 border-t border-white/10 text-xs text-white/55 flex items-center gap-1.5"><UserCheck size={14} className="text-emerald-300" /> Approved by: {a.approves}</p>
            </motion.article>
          ))}
        </Stagger>
        <Rise className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 sm:p-10">
          <div>
            <p className="eyebrow text-gold-light">Example: Monday morning</p>
            <h3 className="font-display text-3xl font-semibold mt-3">The Monday Morning Package</h3>
            <p className="mt-4 text-white/70 leading-relaxed">After Sunday&rsquo;s service, the agents assemble one package for review. An administrator approves communications, financial changes and other consequential actions before anything executes. This is an AI-assisted office, not an unsupervised replacement for leadership.</p>
            <div className="mt-6"><LinkButton to="/admin/agents" variant="primary" icon={<ArrowRight size={16} />}>Open the agents module</LinkButton></div>
          </div>
          <ol className="grid gap-2">
            {monday.map((m, i) => (
              <li key={m} className="flex items-center gap-3 rounded-xl bg-midnight/70 border border-white/10 px-4 py-3">
                <span className="font-mono text-xs text-gold-light w-6">{String(i + 1).padStart(2, '0')}</span>
                <FileText size={16} className="text-white/50" />
                <span className="text-sm flex-1">{m}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">Ready</span>
              </li>
            ))}
          </ol>
        </Rise>
      </div>
    </section>
  )
}
