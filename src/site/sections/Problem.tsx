import { FileSpreadsheet, Mail, Phone, FolderOpen, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Rise, Stagger, item, Underline } from '../motion'

const before = [
  { icon: FileSpreadsheet, t: 'Membership in spreadsheets', d: 'Three versions, none current. Visitors slip through.' },
  { icon: Mail, t: 'Requests in inboxes', d: 'Event, facility and prayer requests scattered across staff email.' },
  { icon: Phone, t: 'Coordination by phone', d: 'Calendar conflicts found the week of the event.' },
  { icon: FolderOpen, t: 'Paper in filing cabinets', d: 'Minutes, policies and giving records nobody can search.' },
]

export function Problem() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-start">
        <Rise>
          <p className="eyebrow">The problem</p>
          <h2 className="display text-3xl sm:text-4xl mt-3">Most church offices run on <Underline>disconnected systems</Underline>.</h2>
          <p className="lede mt-5">Spreadsheets, paper forms, manual communication and staff memory. The result is lost visitor follow-up, slow approvals, scattered financial records and leadership that has to ask every department for the same information.</p>
          <p className="mt-4 text-slate leading-relaxed">Our vision is to transform the traditional church office into a modern, technology-enabled operation, without changing how the church worships, teaches or serves.</p>
        </Rise>
        <Stagger className="grid gap-3 sm:grid-cols-2">
          {before.map((b) => (
            <motion.div key={b.t} variants={item} className="card p-5">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-linen text-slate flex items-center justify-center"><b.icon size={20} /></div>
              <h3 className="font-semibold mt-3">{b.t}</h3>
              <p className="text-sm text-slate mt-1">{b.d}</p>
            </motion.div>
          ))}
          <motion.div variants={item} className="sm:col-span-2 flex items-center justify-center gap-3 py-2 text-slate">
            <ArrowDown size={18} className="text-gold" />
            <span className="stamp">One connected environment, below</span>
          </motion.div>
        </Stagger>
      </div>
    </section>
  )
}
