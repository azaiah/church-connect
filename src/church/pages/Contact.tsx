import { useState, type FormEvent } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send } from 'lucide-react'
import { useDemo } from '@/data/store'
import { site } from '@/config/site'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Input, Select, Textarea } from '@/components/Field'
import { Button } from '@/components/Button'
import { Rise } from '@/site/motion'
import { Container, PageHero } from '../Section'

function encode(data: Record<string, string>) { return Object.keys(data).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&') }

export function Contact() {
  const { state, log } = useDemo()
  const c = state.church
  useDocumentMeta(`Contact | ${c.name}`)
  const [st, setSt] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget); const data: Record<string, string> = {}; fd.forEach((v, k) => (data[k] = String(v)))
    if (!data.name || !data.email) return
    setSt('sending')
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encode({ 'form-name': site.churchFormName, ...data }) })
      if (!res.ok) throw new Error()
      log('Website', 'Contact form', `${data.name}: ${data.topic}`); setSt('ok')
    } catch { log('Website', 'Contact form (offline)', `${data.name}: ${data.topic}`); setSt('ok') }
  }
  return (
    <>
      <PageHero eyebrow="Contact" title="The office is open. So are we." text="Questions about visiting, membership, facility use or anything else. Website forms route to the right department automatically." />
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Rise className="space-y-4">
            <div className="card p-5 flex gap-3"><MapPin className="text-gold shrink-0" /><div><p className="font-semibold">{c.address}</p><p className="text-slate text-sm">{c.city}</p></div></div>
            <div className="card p-5 flex gap-3"><Phone className="text-gold shrink-0" /><div><p className="font-semibold">{c.phone}</p><p className="text-slate text-sm">Church office</p></div></div>
            <div className="card p-5 flex gap-3"><Mail className="text-gold shrink-0" /><div><p className="font-semibold">{c.email}</p><p className="text-slate text-sm">General inquiries</p></div></div>
            <div className="card p-5 flex gap-3"><Clock className="text-gold shrink-0" /><div><p className="font-semibold">Office hours</p><p className="text-slate text-sm">Tuesday to Friday, 9:00 AM to 4:00 PM</p></div></div>
          </Rise>
          <Rise delay={0.1} className="card p-6 sm:p-8">
            {st === 'ok' ? (
              <div className="text-center py-8"><CheckCircle2 size={48} className="mx-auto text-success" /><h2 className="font-display text-2xl font-semibold mt-4">Message sent</h2><p className="text-slate mt-2">The office will reply within one business day.</p><Button variant="outline" className="mt-6" onClick={() => setSt('idle')}>Send another</Button></div>
            ) : (
              <form name={site.churchFormName} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="form-name" value={site.churchFormName} />
                <p className="hidden"><label>Leave empty <input name="bot-field" /></label></p>
                <Input name="name" label="Your name" required />
                <Input name="email" type="email" label="Email" required />
                <Input name="phone" type="tel" label="Phone" hint="(optional)" />
                <Select name="topic" label="Topic" defaultValue="Visiting">{['Visiting', 'Membership', 'Facility use or rental', 'Giving question', 'Ministry', 'Media or press', 'Other'].map((t) => <option key={t}>{t}</option>)}</Select>
                <Textarea className="sm:col-span-2" name="message" label="Message" />
                <div className="sm:col-span-2"><Button type="submit" size="lg" icon={<Send size={16} />} disabled={st === 'sending'}>{st === 'sending' ? 'Sending' : 'Send message'}</Button></div>
              </form>
            )}
          </Rise>
        </Container>
      </section>
    </>
  )
}
