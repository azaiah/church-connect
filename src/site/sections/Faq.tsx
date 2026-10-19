import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Rise, Underline } from '../motion'

const faqs = [
  ['Do we have to replace QuickBooks or our giving processor?', 'No. ChurchConnect integrates existing accounting and payment systems first, which reduces migration risk while giving leadership a unified dashboard. Replacement is a later, optional decision.'],
  ['Who approves what the AI agents produce?', 'An authorized person in the role your church assigns: the Church Secretary for communications, the Finance Officer for financial summaries, the Executive Administrator for operations. Agents draft and route; they never send, pay or publish on their own.'],
  ['How is confidential pastoral information protected?', 'Pastoral care, counseling and confidential service requests are restricted by role with audit logging. AI agents receive only the information needed for a given task and are excluded from those records by default.'],
  ['Is this one system for all churches?', 'One shared, multi-tenant platform configured for each church. Every church’s data is logically isolated from every other church’s data. Shared capabilities such as AI agents, communications, reporting and security improve for everyone.'],
  ['What size church is the pilot for?', 'We are scoping the first pilot now. The architecture supports churches from 100 members to multi-campus organizations; the pilot partner helps us set pricing and priorities for its size band.'],
  ['What do these demos show?', 'Three fictional surfaces built on the platform design: a church website with member portal, and the administrative CRM with all twelve modules and the AI agent workforce. Everything inside is sample data stored in your browser.'],
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-20 lg:py-28">
      <Rise className="text-center">
        <p className="eyebrow">Questions</p>
        <h2 className="display text-3xl sm:text-4xl mt-3">What church leaders <Underline>ask first</Underline>.</h2>
      </Rise>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {faqs.map(([q, a], i) => {
          const on = open === i
          return (
            <div key={q}>
              <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="w-full flex items-center justify-between gap-4 py-4 text-left font-semibold min-h-[56px]">
                {q}<ChevronDown size={18} className={`shrink-0 text-gold transition-transform ${on ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="pb-5 text-slate leading-relaxed">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
