import { motion } from 'framer-motion'
import { Rise, Stagger, item, Underline } from '../motion'
import { phases } from '@/config/site'

export function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-20 bg-paper border-y border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28">
        <Rise className="max-w-2xl">
          <p className="eyebrow">Implementation</p>
          <h2 className="display text-3xl sm:text-4xl mt-3">A <Underline>phased pilot</Underline> with the first church as design partner.</h2>
          <p className="lede mt-5">Preliminary roadmap, subject to the church&rsquo;s requirements and existing systems.</p>
        </Rise>
        <Stagger className="mt-12 relative grid gap-6 md:grid-cols-4">
          <div className="hidden md:block absolute left-0 right-0 top-6 h-px bg-line" aria-hidden="true" />
          {phases.map((p, i) => (
            <motion.article key={p.title} variants={item} className="relative">
              <div className="h-12 w-12 shrink-0 rounded-full bg-midnight text-gold-light flex items-center justify-center font-mono text-sm relative z-10 border-4 border-paper">{i + 1}</div>
              <p className="stamp mt-4">{p.when}</p>
              <h3 className="font-semibold text-lg mt-1">{p.title}</h3>
              <p className="text-sm text-slate mt-2 leading-relaxed">{p.text}</p>
            </motion.article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
