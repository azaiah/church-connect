import { useState } from 'react'
import { Heart, CheckCircle2, Lock, Repeat, Smartphone, Mail, ShieldCheck } from 'lucide-react'
import { useDemo } from '@/data/store'
import { uid } from '@/data/ids'
import { money, todayIso } from '@/data/dates'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Input, Select } from '@/components/Field'
import { Button, LinkButton } from '@/components/Button'
import { Rise } from '@/site/motion'
import { Container, PageHero } from '../Section'

const presets = [25, 50, 100, 250, 500]

export function Give() {
  const { state, upsert, log } = useDemo()
  useDocumentMeta(`Give | ${state.church.name}`)
  const [amount, setAmount] = useState<number>(100)
  const [custom, setCustom] = useState('')
  const [fund, setFund] = useState('f_general')
  const [recurring, setRecurring] = useState(false)
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'amount' | 'details' | 'done'>('amount')
  const [error, setError] = useState('')
  const total = custom ? Number(custom) || 0 : amount

  function complete() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setError('Please add a valid email so we can send your receipt.'); return }
    const member = state.members.find((m) => m.email.toLowerCase() === email.toLowerCase())
    upsert('gifts', { id: uid('g'), memberId: member?.id, donorName: member ? undefined : email, amount: total, fundId: fund, method: 'online', date: todayIso(), status: 'recorded', recurring })
    log('Website', recurring ? 'Recurring gift set up' : 'Online gift', `${money(total)} to ${state.funds.find((f) => f.id === fund)?.name}`)
    setStep('done')
  }

  return (
    <>
      <PageHero eyebrow="Give" title="Generosity that stays in the neighborhood." text="Every gift is recorded to your giving history, categorized by fund and reconciled by the finance team. Year-end statements are ready in the member portal each January." />
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
          <Rise>
            <h2 className="font-display text-2xl font-semibold">Where your gift goes</h2>
            <ul className="mt-4 space-y-3">
              {state.funds.map((f) => (
                <li key={f.id} className={`card p-4 ${fund === f.id ? 'ring-2 ring-gold' : ''}`}>
                  <button type="button" onClick={() => setFund(f.id)} className="w-full text-left">
                    <div className="flex items-center justify-between gap-3"><p className="font-semibold">{f.name}</p><span className="stamp capitalize">{f.type}</span></div>
                    <p className="text-sm text-slate mt-1">{f.description}</p>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3 sm:grid-cols-3 text-sm">
              <div className="rounded-xl border border-line bg-paper p-4"><Smartphone size={18} className="text-gold" /><p className="font-semibold mt-2">Text to give</p><p className="text-slate text-xs mt-1">Text GIVE to {state.church.phone}</p></div>
              <div className="rounded-xl border border-line bg-paper p-4"><Mail size={18} className="text-gold" /><p className="font-semibold mt-2">By mail</p><p className="text-slate text-xs mt-1">{state.church.address}, {state.church.city}</p></div>
              <div className="rounded-xl border border-line bg-paper p-4"><ShieldCheck size={18} className="text-gold" /><p className="font-semibold mt-2">Secure</p><p className="text-slate text-xs mt-1">PCI-compliant processor. We never store card numbers.</p></div>
            </div>
          </Rise>
          <Rise delay={0.1} className="card p-6 sm:p-8 lg:sticky lg:top-28">
            {step === 'done' ? (
              <div className="text-center py-6">
                <CheckCircle2 size={48} className="mx-auto text-success" />
                <h2 className="font-display text-2xl font-semibold mt-4">Thank you</h2>
                <p className="text-slate mt-2">{recurring ? 'Your recurring gift' : 'Your gift'} of <strong>{money(total)}</strong> to the {state.funds.find((f) => f.id === fund)?.name} has been recorded. A receipt is on its way to {email}.</p>
                <p className="text-xs text-slate mt-4">In the connected platform this gift now appears in your member portal giving history and in the Finance module for reconciliation.</p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center"><LinkButton to="/portal/giving" variant="secondary">See giving history</LinkButton><Button variant="outline" onClick={() => { setStep('amount'); setCustom(''); setEmail('') }}>Give again</Button></div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between"><p className="stamp">Give online</p><span className="inline-flex items-center gap-1 text-xs text-slate"><Lock size={12} /> Demo checkout, no card charged</span></div>
                <div className="mt-4 grid grid-cols-3 min-[360px]:grid-cols-5 gap-2">
                  {presets.map((p) => <button key={p} type="button" onClick={() => { setAmount(p); setCustom('') }} className={`rounded-lg border py-3 font-semibold ${!custom && amount === p ? 'bg-midnight text-white border-midnight' : 'border-line hover:border-slate'}`}>${p}</button>)}
                </div>
                <Input className="mt-3" label="Or enter an amount" type="number" min={1} inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Other amount" />
                <Select className="mt-3" label="Fund" value={fund} onChange={(e) => setFund(e.target.value)}>{state.funds.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</Select>
                <button type="button" onClick={() => setRecurring((r) => !r)} className={`mt-4 w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${recurring ? 'border-gold bg-gold-50' : 'border-line'}`} aria-pressed={recurring}>
                  <span className="inline-flex items-center gap-2 font-medium"><Repeat size={16} className="text-gold" /> Make this a monthly gift</span>
                  <span className={`h-6 w-11 shrink-0 rounded-full relative transition-colors ${recurring ? 'bg-gold' : 'bg-line'}`}><span className={`absolute top-0.5 h-5 w-5 shrink-0 rounded-full bg-white shadow transition-transform ${recurring ? 'translate-x-5' : 'translate-x-0.5'}`} /></span>
                </button>
                {step === 'details' && (
                  <div className="mt-4 grid gap-3">
                    <Input label="Email for your receipt" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} error={error} hint="(members: your church email links this to your portal)" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Card number" placeholder="4242 4242 4242 4242" disabled hint="(demo)" />
                      <Input label="Expiry / CVC" placeholder="12/28  123" disabled />
                    </div>
                  </div>
                )}
                <Button size="lg" className="mt-6 w-full" icon={<Heart size={18} />} disabled={total <= 0} onClick={() => (step === 'amount' ? setStep('details') : complete())}>
                  {step === 'amount' ? `Continue with ${money(total)}` : `Give ${money(total)}${recurring ? ' monthly' : ''}`}
                </Button>
                <p className="text-xs text-slate mt-3 text-center">Payment handled by a PCI-compliant processor (Stripe in the connected platform). Grace Harbor is a 501(c)(3); gifts are tax-deductible.</p>
              </>
            )}
          </Rise>
        </Container>
      </section>
    </>
  )
}
