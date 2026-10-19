import { useDemo } from '@/data/store'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Rise, Stagger, item } from '@/site/motion'
import { motion } from 'framer-motion'
import { Container, PageHero, SectionHead } from '../Section'
import { fullName, memberById } from '@/data/selectors'

const beliefs = [
  ['Scripture', 'The Bible is the inspired Word of God and our guide for faith and life.'],
  ['Grace', 'Salvation is a gift received through faith in Jesus Christ.'],
  ['Community', 'The church is a family that gathers to worship and scatters to serve.'],
  ['Neighbor', 'Love of God is proven in practical love for the people around us.'],
]

export function About() {
  const { state } = useDemo()
  const c = state.church
  useDocumentMeta(`About | ${c.name}`)
  return (
    <>
      <PageHero eyebrow="About us" title={<>Rooted on Hull Street since {c.founded}.</>} text={`${c.name} is an independent Baptist congregation of about ${state.members.length * 20} people in Richmond's Southside. We worship together on Sundays and serve our neighbors every day of the week.`} />
      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Rise>
            <p className="eyebrow">Leadership</p>
            <div className="card p-6 mt-4">
              <div className="h-20 w-20 shrink-0 rounded-full bg-midnight text-gold-light flex items-center justify-center font-display text-2xl">ME</div>
              <h3 className="font-display text-2xl font-semibold mt-4">{c.pastor}</h3>
              <p className="text-slate">{c.pastorTitle} since 2010</p>
              <p className="text-sm text-slate mt-3 leading-relaxed">Pastor Ellison grew up six blocks from the church and returned after seminary to lead it. His preaching is grounded, practical and almost always ends with a question for the week.</p>
            </div>
            <div className="card p-6 mt-4">
              <p className="stamp mb-3">Staff and leaders</p>
              <ul className="space-y-2 text-sm">
                {state.staff.filter((s) => s.type !== 'volunteer' && s.type !== 'contractor').map((s) => <li key={s.id} className="flex justify-between gap-3"><span className="font-medium">{s.name}</span><span className="text-slate">{s.title}</span></li>)}
              </ul>
            </div>
          </Rise>
          <div>
            <SectionHead eyebrow="What we believe" title="Simple convictions," underline="held together." />
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
              {beliefs.map(([t, d]) => (
                <motion.div key={t} variants={item} className="card p-5"><h3 className="font-display text-xl font-semibold">{t}</h3><p className="text-sm text-slate mt-2">{d}</p></motion.div>
              ))}
            </Stagger>
            <SectionHead className="mt-16" eyebrow="Ministries" title="Ten ministries," underline="one church." />
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {state.ministries.map((m) => (
                <motion.div key={m.id} variants={item} className="card p-4 flex gap-3">
                  <span className="w-1.5 rounded-full shrink-0" style={{ background: m.color }} />
                  <div>
                    <h3 className="font-semibold">{m.name}</h3>
                    <p className="text-sm text-slate mt-0.5">{m.description}</p>
                    <p className="stamp mt-2">{m.meets} &middot; Led by {fullName(memberById(state, m.leaderId))}</p>
                  </div>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </Container>
      </section>
    </>
  )
}
