import { useState, type FormEvent } from 'react'
import { HeartHandshake, CheckCircle2, Lock } from 'lucide-react'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Input, Select, Textarea, Toggle } from '@/components/Field'
import { Button } from '@/components/Button'
import { Rise } from '@/site/motion'
import { Container, PageHero } from '../Section'

export function Prayer() {
  const { state, upsert, log } = useDemo()
  useDocumentMeta(`Prayer and care | ${state.church.name}`)
  const [done, setDone] = useState(false)
  const [confidential, setConfidential] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const kind = useState<'prayer' | 'pastoral' | 'assistance'>('prayer')

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim(); const contact = String(fd.get('contact') ?? '').trim(); const text = String(fd.get('text') ?? '').trim(); const k = String(fd.get('kind')) as 'prayer' | 'pastoral' | 'assistance'
    const errs: Record<string, string> = {}
    if (!name) errs.name = 'Please add your name (or "Anonymous").'
    if (!text) errs.text = 'Please share your request.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const member = state.members.find((m) => m.email.toLowerCase() === contact.toLowerCase() || m.phone === contact)
    upsert('care', { id: uid('c'), kind: k, memberId: member?.id, name, contact, text, confidential: k === 'prayer' ? confidential : true, status: 'new', date: todayIso(), updates: [] })
    log('Website', 'Care request submitted', `${k} request from ${name}`)
    setDone(true)
  }

  return (
    <>
      <PageHero eyebrow="Prayer and care" title="You do not have to carry it alone." text="Share a prayer request, ask to speak with a pastor, or let us know about a practical need. Requests go directly to the pastoral care team and are never shared without your permission." />
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Rise className="space-y-4">
            {[
              ['Prayer request', 'Our prayer team prays through every request each week. Share as much or as little as you like.'],
              ['Speak with a pastor', 'Pastor Ellison and the care team return calls within one business day. Evening appointments are available.'],
              ['Practical assistance', 'Groceries, a utility bill, a ride to a medical appointment. Our Benevolence Fund and outreach volunteers can often help.'],
            ].map(([t, d]) => <div key={t} className="card p-5"><h3 className="font-semibold">{t}</h3><p className="text-sm text-slate mt-1">{d}</p></div>)}
            <div className="rounded-xl bg-gold-50 border border-gold/20 p-4 text-sm flex gap-3"><Lock size={18} className="text-gold shrink-0 mt-0.5" /><p>Confidential requests are visible only to the pastor and the care coordinator. They are never shown to volunteers, never used by automated tools, and never read aloud in services.</p></div>
          </Rise>
          <Rise delay={0.1} className="card p-6 sm:p-8">
            {done ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="mx-auto text-success" />
                <h2 className="font-display text-2xl font-semibold mt-4">We received your request</h2>
                <p className="text-slate mt-2">Someone from the care team will reach out. You are prayed for.</p>
                <p className="text-xs text-slate mt-4">In the connected platform this request is now in the Care queue of the admin portal, routed to the pastoral team.</p>
                <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>Submit another</Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-4">
                <div className="flex items-center gap-3"><div className="h-11 w-11 shrink-0 rounded-xl bg-gold-50 text-gold flex items-center justify-center"><HeartHandshake size={22} /></div><h2 className="font-display text-2xl font-semibold">Share a request</h2></div>
                <Select name="kind" label="What do you need?" value={kind[0]} onChange={(e) => kind[1](e.target.value as 'prayer')}>
                  <option value="prayer">Prayer</option><option value="pastoral">To speak with a pastor</option><option value="assistance">Practical assistance</option>
                </Select>
                <Input name="name" label="Your name" error={errors.name} />
                <Input name="contact" label="Email or phone" hint="(optional for prayer; needed if you want a call back)" />
                <Textarea name="text" label="Your request" error={errors.text} />
                {kind[0] === 'prayer' && <Toggle checked={confidential} onChange={setConfidential} label="Keep this confidential" description="Off: the prayer team may share it in Wednesday prayer meeting." />}
                <Button type="submit" size="lg">Send to the care team</Button>
              </form>
            )}
          </Rise>
        </Container>
      </section>
    </>
  )
}
