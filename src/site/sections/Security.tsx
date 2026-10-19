import { Lock, KeyRound, FileSearch, DatabaseBackup, CreditCard, EyeOff } from 'lucide-react'
import { Rise, Underline } from '../motion'
import { roleDefs } from '@/config/platform'

const safeguards = [
  { icon: KeyRound, t: 'Multi-factor authentication' },
  { icon: Lock, t: 'Encryption in transit and at rest' },
  { icon: FileSearch, t: 'Audit logs on every record' },
  { icon: DatabaseBackup, t: 'Backups and retention controls' },
  { icon: CreditCard, t: 'PCI-compliant payment integrations' },
  { icon: EyeOff, t: 'Confidential pastoral information safeguards' },
]

export function Security() {
  return (
    <section id="security" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
      <Rise>
        <p className="eyebrow">User roles and security</p>
        <h2 className="display text-3xl sm:text-4xl mt-3">Not everyone should <Underline>see the same information</Underline>.</h2>
        <p className="lede mt-5">Each ministry has its own restricted workspace. Leadership keeps appropriate oversight. AI agents receive only the data their task needs. For multi-church deployment, every church&rsquo;s information stays logically isolated.</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {safeguards.map((s) => <li key={s.t} className="flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2.5 text-sm"><s.icon size={16} className="text-royal shrink-0" /> {s.t}</li>)}
        </ul>
      </Rise>
      <Rise delay={0.1} className="card overflow-hidden">
        <table className="w-full text-sm">
          <caption className="sr-only">User roles and primary access</caption>
          <thead className="bg-linen text-left"><tr><th className="px-4 py-3 stamp">User role</th><th className="px-4 py-3 stamp">Primary access</th></tr></thead>
          <tbody>
            {roleDefs.map((r) => (
              <tr key={r.id} className="border-t border-line"><td className="px-4 py-3 font-semibold whitespace-nowrap">{r.label}</td><td className="px-4 py-3 text-slate">{r.access}</td></tr>
            ))}
          </tbody>
        </table>
      </Rise>
    </section>
  )
}
