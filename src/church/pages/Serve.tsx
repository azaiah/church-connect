import { useState } from 'react'
import { CheckCircle2, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDemo } from '@/data/store'
import { openShifts, ministryById } from '@/data/selectors'
import { fmtLong } from '@/data/dates'
import { uid } from '@/data/ids'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Input } from '@/components/Field'
import { Rise, Stagger, item } from '@/site/motion'
import { Container, PageHero, SectionHead } from '../Section'

export function Serve() {
  const { state, patch, upsert, log } = useDemo()
  useDocumentMeta(`Serve | ${state.church.name}`)
  const shifts = openShifts(state).sort((a, b) => a.date.localeCompare(b.date))
  const [claimed, setClaimed] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [picking, setPicking] = useState<string | null>(null)

  function claim(id: string) {
    if (!name.trim()) return
    const s = state.shifts.find((x) => x.id === id)
    const staffId = uid('s')
    upsert('staff', { id: staffId, name: name.trim(), title: `${s?.role ?? 'Volunteer'} (new)`, type: 'volunteer', ministryIds: s ? [s.ministryId] : [], bgCheck: 'pending', trainings: [], hoursThisMonth: 0, email: '', startDate: new Date().toISOString().slice(0, 10) })
    patch('shifts', id, { staffId, status: 'filled' })
    log('Website', 'Volunteer signup', `${name.trim()} for ${s?.role} on ${s?.date}`)
    setClaimed(id); setPicking(null)
  }

  return (
    <>
      <PageHero eyebrow="Serve" title="Every Sunday runs on volunteers." text="Greeters, cameras, van drivers, pantry stockers and small-group leaders. Pick a shift below. New volunteers in youth-facing roles complete a background check before their first assignment." />
      <section className="py-16">
        <Container>
          <SectionHead eyebrow="Open shifts" title="Where we need you" underline="this month." />
          <Stagger className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {shifts.map((s) => {
              const m = ministryById(state, s.ministryId)
              const isClaimed = claimed === s.id
              return (
                <motion.article key={s.id} variants={item} className={`card p-5 flex flex-col ${isClaimed ? 'ring-2 ring-success' : ''}`}>
                  <div className="flex items-center justify-between gap-2"><Badge tone="royal">{m?.name}</Badge><span className="stamp">{fmtLong(s.date)}</span></div>
                  <h3 className="font-display text-xl font-semibold mt-3">{s.role}</h3>
                  <p className="text-sm text-slate mt-1 flex-1">{m?.description}</p>
                  {isClaimed ? (
                    <p className="mt-4 inline-flex items-center gap-2 text-success font-semibold text-sm"><CheckCircle2 size={16} /> You are signed up</p>
                  ) : picking === s.id ? (
                    <div className="mt-4 grid gap-2">
                      <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Your name" />
                      <div className="flex gap-2"><Button size="sm" onClick={() => claim(s.id)} disabled={!name.trim()}>Confirm</Button><Button size="sm" variant="ghost" onClick={() => setPicking(null)}>Cancel</Button></div>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="mt-4 self-start" icon={<Users size={14} />} onClick={() => setPicking(s.id)}>Sign up</Button>
                  )}
                </motion.article>
              )
            })}
          </Stagger>
          {shifts.length === 0 && <p className="text-slate mt-8">Every shift is filled this month. Thank you!</p>}
          <Rise className="mt-12 rounded-2xl bg-midnight text-white p-6 sm:p-8 grid gap-6 md:grid-cols-3">
            {[['Background checks', 'Required for youth and children roles. Completed through Checkr in about 3 business days.'], ['Safeguarding training', '45-minute online course for anyone serving minors or seniors.'], ['Hours that count', 'Volunteer hours are tracked in the member portal and reported in the church impact summary.']].map(([t, d]) => (
              <div key={t}><p className="font-semibold text-gold-light">{t}</p><p className="text-sm text-white/70 mt-1">{d}</p></div>
            ))}
          </Rise>
        </Container>
      </section>
    </>
  )
}
