import { Clock, MapPin, Car, Baby, Shirt, Coffee, Accessibility, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDemo } from '@/data/store'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { LinkButton } from '@/components/Button'
import { Stagger, item, Rise } from '@/site/motion'
import { Container, PageHero, SectionHead } from '../Section'

const expect = [
  { icon: Clock, t: 'About 90 minutes', d: 'Worship, a message from Pastor Ellison and prayer. The 11:00 service is livestreamed.' },
  { icon: Shirt, t: 'Wear what you have', d: 'Suits and sneakers sit side by side. Come as you are.' },
  { icon: Baby, t: 'Kids are welcome', d: 'Nursery for infants and toddlers; Sunday school for ages 4 to 12 during the 11:00 service. All volunteers are background-checked.' },
  { icon: Car, t: 'Free parking', d: 'Main lot off Hull Street. Accessible spaces by the front entrance.' },
  { icon: Coffee, t: 'Stay for coffee', d: 'The Fellowship Hall opens after each service. First-time guests get a welcome gift at the desk.' },
  { icon: Accessibility, t: 'Accessible for everyone', d: 'Step-free entry, hearing-assist devices and large-print bulletins on request.' },
]

export function Visit() {
  const { state } = useDemo()
  const c = state.church
  useDocumentMeta(`Plan your visit | ${c.name}`)
  return (
    <>
      <PageHero eyebrow="I'm new" title={<>We saved you a seat.</>} text="Here is everything you need to know before your first Sunday at Grace Harbor, from where to park to what happens with the kids.">
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton to="/church/contact" icon={<ArrowRight size={16} />}>Let us know you are coming</LinkButton>
          <LinkButton to={`https://maps.google.com/?q=${encodeURIComponent(c.address + ' ' + c.city)}`} variant="outline" icon={<MapPin size={16} />}>Directions</LinkButton>
        </div>
      </PageHero>
      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Rise>
            <p className="eyebrow">Service times</p>
            <ul className="mt-4 space-y-4">
              {c.services.map((s) => (
                <li key={s.label} className="card p-5 flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-gold-50 text-gold flex items-center justify-center shrink-0"><Clock size={20} /></div>
                  <div><p className="font-semibold text-lg">{s.day} &middot; {s.time}</p><p className="text-slate text-sm">{s.label}</p></div>
                </li>
              ))}
            </ul>
            <div className="card p-5 mt-4">
              <p className="stamp">Address</p>
              <p className="font-semibold mt-1">{c.address}</p>
              <p className="text-slate">{c.city}</p>
              <p className="text-slate text-sm mt-2">{c.phone}</p>
            </div>
          </Rise>
          <div>
            <SectionHead eyebrow="What to expect" title="Your first" underline="Sunday." />
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
              {expect.map((x) => (
                <motion.div key={x.t} variants={item} className="card p-5">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-royal-50 text-royal flex items-center justify-center"><x.icon size={20} /></div>
                  <h3 className="font-semibold mt-3">{x.t}</h3>
                  <p className="text-sm text-slate mt-1">{x.d}</p>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </Container>
      </section>
      <section className="bg-paper border-y border-line py-20">
        <Container className="grid gap-10 lg:grid-cols-2 items-center">
          <Rise>
            <p className="eyebrow">Ready to join?</p>
            <h2 className="display text-3xl sm:text-4xl mt-3">New Member Orientation</h2>
            <p className="lede mt-4">Three Sunday-morning sessions on what Grace Harbor believes, how we serve and where you fit. Breakfast is on us. The next class begins soon.</p>
            <div className="mt-6"><LinkButton to="/church/events/e_3" icon={<ArrowRight size={16} />}>Register for orientation</LinkButton></div>
          </Rise>
          <Rise delay={0.1} className="card p-6">
            <p className="stamp">A note from the pastor</p>
            <p className="font-display text-xl mt-3 leading-relaxed italic">"Church is not a building you visit. It is a family you belong to. If Sunday is your first time with us, you are already welcome."</p>
            <p className="mt-4 font-semibold">{c.pastor}</p>
            <p className="text-sm text-slate">{c.pastorTitle}</p>
          </Rise>
        </Container>
      </section>
    </>
  )
}
