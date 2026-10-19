import { useState } from 'react'
import { Rise, Underline, CountUp } from '../motion'

const rows = [['Member records and follow-up', 20], ['Giving reports and reconciliation', 12], ['Event coordination', 16], ['Communications and newsletters', 14], ['Scheduling and reporting', 18]] as const
function money(n: number) { return '$' + Math.round(n).toLocaleString() }

export function Savings() {
  const [hours, setHours] = useState(160)
  const [rate, setRate] = useState(25)
  const [pct, setPct] = useState(40)
  const saved = hours * (pct / 100)
  const value = saved * rate
  return (
    <section id="savings" className="scroll-mt-20 bg-paper border-y border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28 grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
        <Rise>
          <p className="eyebrow">Operational savings</p>
          <h2 className="display text-3xl sm:text-4xl mt-3">Where the <Underline>administrative hours</Underline> go today.</h2>
          <p className="lede mt-5">Illustrative monthly efficiency for a church where staff and volunteers spend significant time on routine administration.</p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {rows.map(([k, v]) => <li key={k} className="flex items-center justify-between py-3 text-sm"><span>{k}</span><span className="font-mono text-slate">{v} hrs</span></li>)}
            <li className="flex items-center justify-between py-3 font-semibold"><span>Potential hours saved per month</span><span className="font-display text-2xl"><CountUp to={80} /></span></li>
            <li className="flex items-center justify-between py-3 font-semibold"><span>Value at $25 per hour</span><span className="font-display text-2xl"><CountUp to={2000} prefix="$" /></span></li>
          </ul>
          <p className="stamp mt-3">Illustrative assumptions only. About 960 administrative hours recovered annually.</p>
        </Rise>
        <Rise delay={0.1} className="card p-6 sm:p-8">
          <p className="stamp">Church Administrative Savings Calculator</p>
          <h3 className="font-display text-2xl font-semibold mt-1">Run your own numbers</h3>
          <div className="mt-6 space-y-6">
            <Slider label="Monthly administrative hours" value={hours} min={40} max={600} step={10} unit=" hrs" onChange={setHours} />
            <Slider label="Estimated hourly labor value" value={rate} min={15} max={60} step={1} unit="" prefix="$" onChange={setRate} />
            <Slider label="Administrative time reduced" value={pct} min={10} max={70} step={5} unit="%" onChange={setPct} />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Stat l="Monthly hours recovered" v={Math.round(saved).toLocaleString()} />
            <Stat l="Monthly labor capacity value" v={money(value)} hi />
            <Stat l="Annual hours recovered" v={Math.round(saved * 12).toLocaleString()} />
            <Stat l="Annual labor capacity value" v={money(value * 12)} hi />
          </div>
          <p className="mt-5 text-xs text-slate leading-relaxed">Labor capacity value is not the same as cash savings. Actual financial ROI must account for subscriptions, implementation, staff time, operating costs and any real reductions in paid labor or overtime.</p>
        </Rise>
      </div>
    </section>
  )
}

function Slider({ label, value, min, max, step, unit, prefix = '', onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; prefix?: string; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-medium"><span>{label}</span><span className="font-mono text-gold">{prefix}{value}{unit}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full h-2 rounded-full appearance-none cursor-pointer accent-[#B8862B]" style={{ background: `linear-gradient(to right, #B8862B ${pct}%, #E1DBD0 ${pct}%)` }} />
    </label>
  )
}
function Stat({ l, v, hi = false }: { l: string; v: string; hi?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${hi ? 'bg-midnight text-white' : 'bg-linen'}`}>
      <p className={`text-xs ${hi ? 'text-white/60' : 'text-slate'}`}>{l}</p>
      <p className={`font-display text-2xl font-semibold mt-1 ${hi ? 'text-gold-light' : ''}`}>{v}</p>
    </div>
  )
}
