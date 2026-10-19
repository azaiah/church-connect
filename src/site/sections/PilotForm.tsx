import { useState, type FormEvent } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { Rise, Underline } from '../motion'
import { Input, Select, Textarea } from '@/components/Field'
import { Button } from '@/components/Button'
import { site } from '@/config/site'

function encode(data: Record<string, string>) { return Object.keys(data).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k])).join('&') }

export function PilotForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const data: Record<string, string> = {}
    fd.forEach((v, k) => (data[k] = String(v)))
    const errs: Record<string, string> = {}
    if (!data.name?.trim()) errs.name = 'Please add your name.'
    if (!data.church?.trim()) errs.church = 'Please add your church.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email ?? '')) errs.email = 'Please add a valid email.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setState('sending')
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encode({ 'form-name': site.pilotFormName, ...data }) })
      if (!res.ok) throw new Error(String(res.status))
      setState('ok'); form.reset()
    } catch { setState('err') }
  }

  return (
    <section id="pilot" className="scroll-mt-20 mesh-light border-y border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28 grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
        <Rise>
          <p className="eyebrow">Request a pilot</p>
          <h2 className="display text-3xl sm:text-4xl mt-3">Be the <Underline>first church</Underline> on the platform.</h2>
          <p className="lede mt-5">The pilot church helps validate the workflows and features before ChurchConnect is offered to additional congregations. In return: priority on the roadmap, direct access to the DataIsData team and founding-partner pricing.</p>
          <ol className="mt-6 space-y-3 text-sm">
            {['A 45-minute operations conversation with your pastor and administrator', 'A written assessment of your current website, records and processes', 'A pilot proposal scoped to your church size and goals'].map((s, i) => (
              <li key={s} className="flex gap-3"><span className="h-6 w-6 rounded-full bg-midnight text-gold-light font-mono text-xs flex items-center justify-center shrink-0">{i + 1}</span> {s}</li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-slate">Prefer email? <a href={`mailto:${site.email}`} className="text-royal underline">{site.email}</a></p>
        </Rise>
        <Rise delay={0.1} className="card p-6 sm:p-8">
          {state === 'ok' ? (
            <div className="text-center py-10">
              <CheckCircle2 size={44} className="mx-auto text-success" />
              <h3 className="font-display text-2xl font-semibold mt-4">Request received</h3>
              <p className="text-slate mt-2">DataIsData will reach out within two business days to schedule the operations conversation.</p>
              <Button variant="outline" className="mt-6" onClick={() => setState('idle')}>Send another</Button>
            </div>
          ) : (
            <form name={site.pilotFormName} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="form-name" value={site.pilotFormName} />
              <p className="hidden"><label>Leave empty <input name="bot-field" /></label></p>
              <Input name="name" label="Your name" autoComplete="name" required error={errors.name} />
              <Input name="church" label="Church" required error={errors.church} />
              <Select name="role" label="Your role" defaultValue="">
                <option value="">Select</option>
                {['Senior Pastor', 'Executive Pastor / Administrator', 'Finance Officer / Treasurer', 'Church Secretary', 'Ministry Leader', 'Trustee / Board', 'Other'].map((r) => <option key={r}>{r}</option>)}
              </Select>
              <Select name="size" label="Congregation size" defaultValue="">
                <option value="">Select</option>
                {['Under 100', '100 to 500', '500 to 1,000', '1,000 to 2,500', '2,500+', 'Multi-campus'].map((r) => <option key={r}>{r}</option>)}
              </Select>
              <Input name="email" type="email" label="Email" autoComplete="email" required error={errors.email} />
              <Input name="phone" type="tel" label="Phone" autoComplete="tel" hint="(optional)" />
              <Input name="currentTools" label="Current tools" hint="(e.g. spreadsheets, QuickBooks, Planning Center)" className="sm:col-span-2" />
              <Textarea name="message" label="What takes the most time in your church office today?" className="sm:col-span-2" />
              <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state === 'sending'} icon={<Send size={16} />}>{state === 'sending' ? 'Sending' : 'Request a pilot conversation'}</Button>
                {state === 'err' && <p className="text-sm text-danger">Could not send. Email us at {site.email}.</p>}
              </div>
            </form>
          )}
        </Rise>
      </div>
    </section>
  )
}
