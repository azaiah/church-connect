import { Store, Briefcase, GraduationCap, HandHeart, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import { Rise, Stagger, item, Underline } from '../motion'

const ways = [
  { icon: Store, t: 'Church Community Marketplace', d: 'An optional directory of member-owned businesses, professional services and local vendors that strengthens the local economy.' },
  { icon: Briefcase, t: 'Workforce Development & Career Services', d: 'Job boards, resume assistance, digital training, interview workshops and employer partnerships.' },
  { icon: GraduationCap, t: 'Digital Education & Training Center', d: 'Financial literacy, technology education, entrepreneurship courses, youth programs and continuing education.' },
  { icon: HandHeart, t: 'Community Assistance & Resource Management', d: 'Digitally coordinated food pantries, transportation assistance, senior support, housing referrals and emergency help.' },
  { icon: Building, t: 'Facilities as Managed Community Assets', d: 'Online reservations for approved weddings, conferences, community meetings, classrooms and events.' },
]

export function NewWays() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28">
      <Rise className="max-w-2xl">
        <p className="eyebrow">Beyond operations</p>
        <h2 className="display text-3xl sm:text-4xl mt-3">Five new ways churches could <Underline>operate and grow</Underline>.</h2>
        <p className="lede mt-5">The church becomes a centralized point of access for community services, and leadership gets a digital record of its impact.</p>
      </Rise>
      <Stagger className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {ways.map((w, i) => (
          <motion.article key={w.t} variants={item} className="card p-5 relative overflow-hidden">
            <span className="absolute -top-3 -right-1 font-display text-7xl font-semibold text-linen select-none">{i + 1}</span>
            <div className="relative h-10 w-10 shrink-0 rounded-lg bg-royal-50 text-royal flex items-center justify-center"><w.icon size={20} /></div>
            <h3 className="relative font-semibold mt-3 leading-snug">{w.t}</h3>
            <p className="relative text-sm text-slate mt-2">{w.d}</p>
          </motion.article>
        ))}
      </Stagger>
    </section>
  )
}
