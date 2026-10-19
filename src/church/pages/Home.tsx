import { Link } from 'react-router-dom'
import { ArrowRight, Clock, MapPin, Play, Heart, HandHeart, CalendarDays, Users, Church } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useDemo } from '@/data/store'
import { upcomingEvents } from '@/data/selectors'
import { fmtLong, fmtTime, fmtShort } from '@/data/dates'
import { LinkButton } from '@/components/Button'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Rise, Stagger, item, Underline } from '@/site/motion'
import { Container, SectionHead } from '../Section'

export function Home() {
  const { state } = useDemo()
  const c = state.church
  useDocumentMeta(`${c.name} | ${c.tagline}`, `${c.name} in Richmond, VA. Service times, sermons, events, giving and community resources.`)
  const reduce = useReducedMotion()
  const events = upcomingEvents(state, true).filter((e) => e.category !== 'worship').slice(0, 3)
  const sermon = state.sermons[0]
  const announcements = state.announcements.filter((a) => a.status === 'sent' || a.status === 'approved').filter((a) => a.channels.includes('website')).slice(0, 2)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden mesh text-white pt-28 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 rays" aria-hidden="true" />
        <Container className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr] items-end">
          <div>
            <motion.p initial={reduce ? undefined : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow text-gold-light">Welcome home</motion.p>
            <motion.h1 initial={reduce ? undefined : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="display text-[2.5rem] min-[375px]:text-5xl sm:text-6xl lg:text-7xl mt-4">A church for the neighborhood.<br /><span className="text-gold-light">A home for everyone.</span></motion.h1>
            <motion.p initial={reduce ? undefined : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-6 text-lg text-white/75 max-w-xl leading-relaxed">Since {c.founded}, {c.shortName} has gathered on Hull Street to worship, serve and open its doors to the Southside. Come as you are. We will save you a seat.</motion.p>
            <motion.div initial={reduce ? undefined : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/church/visit" size="lg" icon={<ArrowRight size={18} />}>Plan your visit</LinkButton>
              <LinkButton to="/church/sermons" size="lg" variant="outline" className="!bg-white/5 !text-white !border-white/25 hover:!border-white/60" icon={<Play size={18} />}>Watch a message</LinkButton>
            </motion.div>
          </div>
          <motion.div initial={reduce ? undefined : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }} className="rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm p-6">
            <p className="stamp text-white/50">Service times</p>
            <ul className="mt-3 divide-y divide-white/10">
              {c.services.map((s) => (
                <li key={s.label} className="py-3 flex items-start gap-3">
                  <Clock size={18} className="text-gold-light mt-0.5 shrink-0" />
                  <div><p className="font-semibold">{s.day} &middot; {s.time}</p><p className="text-sm text-white/65">{s.label}</p></div>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-sm text-white/75"><MapPin size={16} className="text-gold-light mt-0.5 shrink-0" /> {c.address}, {c.city}</p>
          </motion.div>
        </Container>
      </section>

      {/* Announcements strip */}
      {announcements.length > 0 && (
        <section className="bg-gold text-white">
          <Container className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
            <span className="font-mono text-[11px] uppercase tracking-wider shrink-0">This week</span>
            {announcements.map((a) => <span key={a.id} className="truncate">{a.title}</span>)}
          </Container>
        </section>
      )}

      {/* Pathways */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHead eyebrow="Find your place" title="Three ways to" underline="start." />
          <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Church, t: 'Worship', d: 'Two Sunday services, a livestream for those at home and Bible study on Wednesday nights.', to: '/church/visit', cta: "I'm new" },
              { icon: Users, t: 'Belong', d: 'Ten ministries from youth to seniors, new member orientation and small groups that meet across the city.', to: '/church/about', cta: 'Our ministries' },
              { icon: HandHeart, t: 'Serve', d: 'A food pantry, a transportation van, a community health fair and a Thanksgiving table for the neighborhood.', to: '/church/serve', cta: 'Ways to serve' },
            ].map((p) => (
              <motion.article key={p.t} variants={item} className="card p-6 flex flex-col">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gold-50 text-gold flex items-center justify-center"><p.icon size={22} /></div>
                <h3 className="font-display text-2xl font-semibold mt-4">{p.t}</h3>
                <p className="text-slate mt-2 flex-1">{p.d}</p>
                <Link to={p.to} className="mt-5 inline-flex items-center gap-1.5 font-semibold text-royal hover:text-midnight min-h-[44px]">{p.cta} <ArrowRight size={16} /></Link>
              </motion.article>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Latest message */}
      <section className="bg-paper border-y border-line py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-center">
          <Rise>
            <Link to="/church/sermons" className="group block relative aspect-video rounded-2xl overflow-hidden mesh">
              <div className="absolute inset-0 rays" aria-hidden="true" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="h-20 w-20 shrink-0 rounded-full bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center group-hover:scale-105 transition-transform"><Play size={30} className="text-white ml-1" /></span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 text-white bg-gradient-to-t from-midnight/80 to-transparent">
                <p className="font-mono text-[10px] uppercase tracking-wider text-gold-light">{sermon.series}</p>
                <p className="font-display text-2xl font-semibold mt-1">{sermon.title}</p>
              </div>
            </Link>
          </Rise>
          <Rise delay={0.1}>
            <p className="eyebrow">Latest message</p>
            <h2 className="display text-3xl sm:text-4xl mt-3">{sermon.title}</h2>
            <p className="stamp mt-2">{sermon.speaker} &middot; {sermon.scripture} &middot; {fmtShort(sermon.date)}</p>
            <p className="lede mt-5">{sermon.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton to="/church/sermons" icon={<Play size={16} />}>Watch</LinkButton>
              <LinkButton to="/church/sermons" variant="outline">Sermon library</LinkButton>
            </div>
          </Rise>
        </Container>
      </section>

      {/* Upcoming events */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Coming up" title="Mark your" underline="calendar." />
            <LinkButton to="/church/events" variant="outline" icon={<CalendarDays size={16} />}>All events</LinkButton>
          </div>
          <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
            {events.map((e) => (
              <motion.article key={e.id} variants={item} className="card overflow-hidden flex flex-col">
                <div className="h-2" style={{ background: state.ministries.find((m) => m.id === e.ministryId)?.color ?? '#B8862B' }} />
                <div className="p-5 flex flex-col flex-1">
                  <p className="stamp">{fmtLong(e.date)} &middot; {fmtTime(e.start)}</p>
                  <h3 className="font-display text-xl font-semibold mt-2">{e.title}</h3>
                  <p className="text-sm text-slate mt-2 flex-1 line-clamp-3">{e.description}</p>
                  <Link to={`/church/events/${e.id}`} className="mt-4 inline-flex items-center gap-1.5 font-semibold text-royal hover:text-midnight min-h-[44px]">{e.registrationOpen ? 'Register' : 'Details'} <ArrowRight size={16} /></Link>
                </div>
              </motion.article>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Give */}
      <section className="bg-midnight text-white ruled-dark py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-2 items-center">
          <Rise>
            <p className="eyebrow text-gold-light">Generosity</p>
            <h2 className="display text-3xl sm:text-4xl mt-3">Your giving keeps the <Underline>doors open</Underline> for the neighborhood.</h2>
            <p className="mt-5 text-lg text-white/70 leading-relaxed">Tithes and offerings fund worship, youth, the food pantry, the van ministry and the people who show up for this community every week. Give once or set up a recurring gift in under a minute.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton to="/church/give" size="lg" icon={<Heart size={18} />}>Give online</LinkButton>
              <span className="inline-flex items-center text-sm text-white/60">or text GIVE to {c.phone}</span>
            </div>
          </Rise>
          <Rise delay={0.1} className="grid grid-cols-2 gap-3">
            {[['Building & Facilities', 'Sanctuary roof and hall HVAC', 'f_building'], ['Benevolence', 'Emergency help for families', 'f_benevolence'], ['Missions & Outreach', 'Pantry, health fair, service days', 'f_missions'], ['Youth Summer Camp', 'Scholarships for 2027 camp', 'f_youth']].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                <p className="font-semibold">{t}</p>
                <p className="text-xs text-white/60 mt-1">{d}</p>
              </div>
            ))}
          </Rise>
        </Container>
      </section>
    </>
  )
}
