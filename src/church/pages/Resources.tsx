import { useState, type FormEvent } from 'react'
import { ShoppingBasket, Home, Briefcase, Bus, HeartPulse, Siren, CheckCircle2, Lock, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDemo } from '@/data/store'
import type { ServiceProgram } from '@/data/types'
import { uid } from '@/data/ids'
import { todayIso } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Input, Select, Textarea } from '@/components/Field'
import { Button } from '@/components/Button'
import { Rise, Stagger, item } from '@/site/motion'
import { Container, PageHero, SectionHead } from '../Section'

export const programs: { id: ServiceProgram; icon: typeof ShoppingBasket; t: string; d: string; when: string }[] = [
  { id: 'food', icon: ShoppingBasket, t: 'Food pantry', d: 'Groceries for any household in need. No ID or proof of income required.', when: '2nd and 4th Saturdays, 9:00 AM to noon' },
  { id: 'housing', icon: Home, t: 'Housing referrals', d: 'Help navigating eviction notices, rental assistance and emergency shelter.', when: 'By appointment' },
  { id: 'employment', icon: Briefcase, t: 'Employment assistance', d: 'Resume help, interview practice, CDL prep and employer hiring events on campus.', when: 'Tuesdays 10:00 AM to 2:00 PM' },
  { id: 'transportation', icon: Bus, t: 'Transportation', d: 'Van rides to medical appointments, the grocery store and Sunday worship for seniors and families.', when: 'Schedule 48 hours ahead' },
  { id: 'senior', icon: HeartPulse, t: 'Senior support', d: 'Wellness checks, meal delivery, Medicare navigation and monthly fellowship.', when: 'Ongoing' },
  { id: 'emergency', icon: Siren, t: 'Emergency help', d: 'Clothing, utility assistance and a Benevolence Fund for sudden crises.', when: 'Same-day response' },
]

const partners = ['Feed More', 'Bon Secours Richmond', 'Richmond Office of Community Wealth Building', 'Virginia Credit Union', 'Senior Connections', 'HOME of VA']

export function Resources() {
  const { state, upsert, log } = useDemo()
  useDocumentMeta(`Community resources | ${state.church.name}`)
  const [done, setDone] = useState(false)
  const [program, setProgram] = useState<ServiceProgram>('food')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim(); const contact = String(fd.get('contact') ?? '').trim(); const text = String(fd.get('text') ?? '').trim(); const householdSize = Number(fd.get('size') ?? 0) || undefined
    const errs: Record<string, string> = {}
    if (!name) errs.name = 'Please add your name.'
    if (!contact) errs.contact = 'Please add a phone or email so a coordinator can reach you.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    upsert('services', { id: uid('sv'), program, name, contact, text, status: 'new', date: todayIso(), householdSize })
    log('Website', 'Community service request', `${program} request from ${name}`)
    setDone(true)
  }

  return (
    <>
      <PageHero eyebrow="Community resource center" title="The church as a front door to help." text="Grace Harbor connects neighbors with food, housing, employment, transportation and emergency assistance, through our own ministries and trusted partners across Richmond. Requests are confidential." />
      <section className="py-16">
        <Container>
          <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <motion.button key={p.id} variants={item} type="button" onClick={() => { setProgram(p.id); document.getElementById('request')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} className={`card p-5 text-left hover:border-slate ${program === p.id ? 'ring-2 ring-gold' : ''}`}>
                <div className="h-11 w-11 shrink-0 rounded-xl bg-royal-50 text-royal flex items-center justify-center"><p.icon size={22} /></div>
                <h3 className="font-display text-xl font-semibold mt-3">{p.t}</h3>
                <p className="text-sm text-slate mt-1">{p.d}</p>
                <p className="stamp mt-3">{p.when}</p>
              </motion.button>
            ))}
          </Stagger>
        </Container>
      </section>
      <section id="request" className="scroll-mt-24 bg-paper border-y border-line py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Rise>
            <SectionHead eyebrow="Request help" title="Tell us what" underline="you need." text="A coordinator reviews every request and follows up within one business day. If we cannot help directly, we will connect you with a partner who can." />
            <div className="mt-6 rounded-xl bg-gold-50 border border-gold/20 p-4 text-sm flex gap-3"><Lock size={18} className="text-gold shrink-0 mt-0.5" /><p>Your request is confidential. Only the assigned coordinator sees your details. Leadership sees aggregated impact numbers, never names.</p></div>
            <p className="stamp mt-8 mb-3">Partners</p>
            <ul className="flex flex-wrap gap-2">{partners.map((p) => <li key={p} className="rounded-full border border-line bg-linen px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1">{p} <ExternalLink size={10} className="text-slate" /></li>)}</ul>
          </Rise>
          <Rise delay={0.1} className="card p-6 sm:p-8">
            {done ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="mx-auto text-success" />
                <h2 className="font-display text-2xl font-semibold mt-4">Request received</h2>
                <p className="text-slate mt-2">A coordinator will contact you within one business day.</p>
                <p className="text-xs text-slate mt-4">In the connected platform this request is now a confidential service record in the Community module of the admin portal.</p>
                <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>Submit another</Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
                <Select className="sm:col-span-2" label="Type of help" value={program} onChange={(e) => setProgram(e.target.value as ServiceProgram)}>{programs.map((p) => <option key={p.id} value={p.id}>{p.t}</option>)}</Select>
                <Input name="name" label="Your name" error={errors.name} />
                <Input name="contact" label="Phone or email" error={errors.contact} />
                <Input name="size" type="number" min={1} label="People in your household" hint="(optional)" />
                <div className="hidden sm:block" />
                <Textarea className="sm:col-span-2" name="text" label="Tell us a little about the situation" hint="(optional)" />
                <div className="sm:col-span-2"><Button type="submit" size="lg">Send request</Button></div>
              </form>
            )}
          </Rise>
        </Container>
      </section>
    </>
  )
}
