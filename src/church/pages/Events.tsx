import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, CheckCircle2, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDemo } from '@/data/store'
import { upcomingEvents, registrationsFor, roomById, ministryById } from '@/data/selectors'
import { fmtLong, fmtTime, fmtShort } from '@/data/dates'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Input, Select } from '@/components/Field'
import { Button, LinkButton } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Rise, Stagger, item } from '@/site/motion'
import { Container, PageHero } from '../Section'

const cats = ['All', 'worship', 'class', 'community', 'youth', 'conference', 'outreach'] as const

export function Events() {
  const { state } = useDemo()
  useDocumentMeta(`Events | ${state.church.name}`)
  const [cat, setCat] = useState<(typeof cats)[number]>('All')
  const list = upcomingEvents(state, true).filter((e) => cat === 'All' || e.category === cat)
  const byMonth = list.reduce<Record<string, typeof list>>((acc, e) => { const k = fmtLong(e.date).split(',')[1]?.trim().split(' ')[0] ?? ''; (acc[k] ??= []).push(e); return acc }, {})
  return (
    <>
      <PageHero eyebrow="Events" title="What is happening at Grace Harbor." text="Worship, classes, community events and ways to serve. Most events are free and open to the neighborhood; some ask you to register so we can plan seats and food." />
      <section className="py-16">
        <Container>
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => <button key={c} type="button" onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-xs font-medium border capitalize ${cat === c ? 'bg-midnight text-white border-midnight' : 'border-line bg-paper hover:border-slate'}`}>{c}</button>)}
          </div>
          {Object.entries(byMonth).map(([month, evs]) => (
            <div key={month} className="mt-10">
              <h2 className="font-display text-2xl font-semibold">{month}</h2>
              <Stagger className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {evs.map((e) => {
                  const regs = registrationsFor(state, e.id).reduce((s, r) => s + r.qty, 0)
                  return (
                    <motion.article key={e.id} variants={item} className="card overflow-hidden flex flex-col">
                      <div className="h-2" style={{ background: ministryById(state, e.ministryId)?.color }} />
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="stamp">{fmtLong(e.date)}</p>
                          <Badge tone={e.registrationOpen ? 'gold' : 'neutral'} className="capitalize">{e.category}</Badge>
                        </div>
                        <h3 className="font-display text-xl font-semibold mt-2">{e.title}</h3>
                        <p className="text-sm text-slate mt-1 flex items-center gap-1.5"><Clock size={14} /> {fmtTime(e.start)} to {fmtTime(e.end)} &middot; <MapPin size={14} /> {roomById(state, e.roomId)?.name}</p>
                        <p className="text-sm text-slate mt-3 flex-1 line-clamp-2">{e.description}</p>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          {e.registrationOpen ? <span className="text-xs text-slate inline-flex items-center gap-1"><Users size={14} /> {regs} of {e.capacity} registered</span> : <span />}
                          <Link to={`/church/events/${e.id}`} className="font-semibold text-royal hover:text-midnight text-sm min-h-[44px] inline-flex items-center">{e.registrationOpen ? 'Register' : 'Details'}</Link>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </Stagger>
            </div>
          ))}
          {list.length === 0 && <p className="text-slate mt-10">No upcoming events in this category.</p>}
        </Container>
      </section>
    </>
  )
}

export function EventDetail() {
  const { id } = useParams()
  const { state, upsert, log } = useDemo()
  const e = state.events.find((x) => x.id === id)
  useDocumentMeta(`${e?.title ?? 'Event'} | ${state.church.name}`)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  if (!e) return <Container className="py-20"><p>Event not found.</p><LinkButton to="/church/events" variant="outline" className="mt-4">Back to events</LinkButton></Container>
  const regs = registrationsFor(state, e.id)
  const seats = regs.reduce((s, r) => s + r.qty, 0)
  const room = roomById(state, e.roomId)
  const ministry = ministryById(state, e.ministryId)

  function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const fd = new FormData(ev.currentTarget)
    const name = String(fd.get('name') ?? '').trim(); const email = String(fd.get('email') ?? '').trim(); const qty = Number(fd.get('qty') ?? 1)
    const errs: Record<string, string> = {}
    if (!name) errs.name = 'Please add your name.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = 'Please add a valid email.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const existing = state.members.find((m) => m.email.toLowerCase() === email.toLowerCase())
    upsert('registrations', { id: uid('rg'), eventId: e!.id, memberId: existing?.id, name, email, qty, date: new Date().toISOString().slice(0, 10) })
    log('Website', 'Event registration', `${name} (${qty}) for ${e!.title}`)
    setDone(true)
  }

  const ics = () => {
    const dt = (t: string) => e.date.replace(/-/g, '') + 'T' + t.replace(':', '') + '00'
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ChurchConnect//EN', 'BEGIN:VEVENT', `UID:${e.id}@churchconnect`, `DTSTART:${dt(e.start)}`, `DTEND:${dt(e.end)}`, `SUMMARY:${e.title}`, `LOCATION:${room?.name}, ${state.church.address}`, `DESCRIPTION:${e.description}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = `${e.title.replace(/\W+/g, '-')}.ics`; a.click()
  }

  return (
    <>
      <section className="mesh-light border-b border-line">
        <Container className="py-12 lg:py-16">
          <Link to="/church/events" className="inline-flex items-center gap-1 text-sm text-slate hover:text-midnight min-h-[44px]"><ArrowLeft size={16} /> All events</Link>
          <Rise>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge tone="gold" className="capitalize">{e.category}</Badge>
              {ministry && <Badge>{ministry.name}</Badge>}
            </div>
            <h1 className="display text-4xl sm:text-5xl mt-3">{e.title}</h1>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-slate">
              <span className="inline-flex items-center gap-1.5"><CalendarDays size={16} className="text-gold" /> {fmtLong(e.date)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock size={16} className="text-gold" /> {fmtTime(e.start)} to {fmtTime(e.end)}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={16} className="text-gold" /> {room?.name}, {state.church.address}</span>
            </p>
          </Rise>
        </Container>
      </section>
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Rise>
            <p className="lede">{e.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" onClick={ics} icon={<Download size={16} />}>Add to calendar</Button>
            </div>
            {e.registrationOpen && (
              <div className="mt-8 rounded-xl bg-linen border border-line p-4 text-sm">
                <p className="font-semibold">{seats} of {e.capacity} seats reserved</p>
                <div className="mt-2 h-2 rounded-full bg-line overflow-hidden"><div className="h-full bg-gold" style={{ width: `${Math.min(100, (seats / e.capacity) * 100)}%` }} /></div>
                <p className="text-slate mt-2">Last registration {regs.length ? fmtShort([...regs].sort((a, b) => b.date.localeCompare(a.date))[0].date) : 'none yet'}.</p>
              </div>
            )}
          </Rise>
          <Rise delay={0.1} className="card p-6">
            {!e.registrationOpen ? (
              <><p className="stamp">Open to everyone</p><h2 className="font-display text-2xl font-semibold mt-1">No registration needed</h2><p className="text-slate mt-2">Just show up. Questions? <Link to="/church/contact" className="text-royal underline">Contact the office</Link>.</p></>
            ) : done ? (
              <div className="text-center py-6">
                <CheckCircle2 size={44} className="mx-auto text-success" />
                <h2 className="font-display text-2xl font-semibold mt-4">You are registered</h2>
                <p className="text-slate mt-2">A confirmation is on its way. Your registration also appears in the church office and, if you are a member, in your portal.</p>
                <div className="mt-5 flex flex-wrap gap-2 justify-center"><Button variant="outline" onClick={ics} icon={<Download size={16} />}>Add to calendar</Button><LinkButton to="/portal" variant="secondary">Open member portal</LinkButton></div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-4">
                <div><p className="stamp">Registration</p><h2 className="font-display text-2xl font-semibold mt-1">Save your seat</h2></div>
                <Input name="name" label="Your name" required error={errors.name} />
                <Input name="email" type="email" label="Email" required error={errors.email} hint="(members: use your church email to link this to your portal)" />
                <Select name="qty" label="How many are coming?" defaultValue="1">{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}</Select>
                <Button type="submit" size="lg">Register</Button>
                <p className="text-xs text-slate">Free. We only use your email for this event and church announcements you choose.</p>
              </form>
            )}
          </Rise>
        </Container>
      </section>
    </>
  )
}
