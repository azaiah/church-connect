import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { useDemo } from '@/data/store'
import { upcomingEvents } from '@/data/selectors'
import { fmtLong, fmtTime } from '@/data/dates'

type Msg = { from: 'you' | 'bot'; text: string; links?: { label: string; to: string }[] }

/** AI Virtual Church Assistant: rule-based in the demo; the production platform wires this to a scoped LLM with the church's approved knowledge base. */
export function Assistant() {
  const { state } = useDemo()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: `Hi, I am the ${state.church.shortName} virtual assistant. Ask me about service times, events, giving, prayer or community resources.` }])
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, open])

  function answer(q: string): Msg {
    const t = q.toLowerCase()
    const c = state.church
    if (/(time|when|service|worship|sunday)/.test(t)) return { from: 'bot', text: `We worship ${c.services.map((s) => `${s.day} at ${s.time} (${s.label})`).join(', ')}. First time? We have a page just for you.`, links: [{ label: 'Plan your visit', to: '/church/visit' }] }
    if (/(where|address|park|direction|location)/.test(t)) return { from: 'bot', text: `We are at ${c.address}, ${c.city}. Free parking in the main lot off Hull Street with accessible spaces by the front entrance.`, links: [{ label: 'Visit page', to: '/church/visit' }] }
    if (/(give|tithe|donat|offering)/.test(t)) return { from: 'bot', text: `You can give online in under a minute, text GIVE to ${c.phone}, or mail a check. Gifts can go to the General Fund or a designated fund like Building or Benevolence.`, links: [{ label: 'Give online', to: '/church/give' }] }
    if (/(pray|prayer|pastor|counsel|grief|talk)/.test(t)) return { from: 'bot', text: 'You can share a prayer request or ask to speak with a pastor. Confidential requests are only seen by the pastor and care coordinator.', links: [{ label: 'Prayer and care', to: '/church/prayer' }] }
    if (/(food|pantry|housing|rent|job|work|ride|van|transport|help|assist|bill)/.test(t)) return { from: 'bot', text: 'Our Community Resource Center connects neighbors with food, housing referrals, employment help, transportation, senior support and emergency assistance. Requests are confidential.', links: [{ label: 'Community resources', to: '/church/resources' }] }
    if (/(event|happen|calendar|class|concert|fair)/.test(t)) {
      const ev = upcomingEvents(state, true).filter((e) => e.category !== 'worship').slice(0, 3)
      return { from: 'bot', text: `Coming up: ${ev.map((e) => `${e.title} on ${fmtLong(e.date)} at ${fmtTime(e.start)}`).join('; ')}.`, links: [{ label: 'All events', to: '/church/events' }] }
    }
    if (/(youth|teen|kid|child|nursery)/.test(t)) return { from: 'bot', text: 'Nursery and Sunday school run during the 11:00 service, and Youth Friday Night Live meets weekly for grades 6 to 12. Every volunteer is background-checked.', links: [{ label: 'Youth events', to: '/church/events' }] }
    if (/(volunteer|serve|help out)/.test(t)) return { from: 'bot', text: 'We post open volunteer shifts for greeters, cameras, van drivers and the pantry. Pick one and sign up in a minute.', links: [{ label: 'Serve', to: '/church/serve' }] }
    if (/(sermon|message|watch|listen|stream)/.test(t)) return { from: 'bot', text: `The latest message is "${state.sermons[0].title}" from the ${state.sermons[0].series} series. The 11:00 service is livestreamed every Sunday.`, links: [{ label: 'Sermons', to: '/church/sermons' }] }
    if (/(member|join|orientation|baptis)/.test(t)) return { from: 'bot', text: 'New Member Orientation is a three-session Sunday class with breakfast. The next class starts soon and you can register online.', links: [{ label: 'Register', to: '/church/events/e_3' }] }
    if (/(contact|office|phone|email|hours)/.test(t)) return { from: 'bot', text: `The office is open Tuesday to Friday, 9:00 AM to 4:00 PM. Call ${c.phone} or email ${c.email}.`, links: [{ label: 'Contact', to: '/church/contact' }] }
    return { from: 'bot', text: 'I can help with service times, directions, events, giving, prayer, volunteering and community resources. For anything else the office is happy to help.', links: [{ label: 'Contact the office', to: '/church/contact' }] }
  }

  function send(text = input) {
    const q = text.trim(); if (!q) return
    setMsgs((m) => [...m, { from: 'you', text: q }])
    setInput('')
    setTimeout(() => setMsgs((m) => [...m, answer(q)]), 350)
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] no-print">
      {open && (
        <div className="assistant-panel mb-3 w-[calc(100vw-2.5rem)] sm:w-96 rounded-2xl border border-line bg-paper shadow-lift flex flex-col overflow-hidden" role="dialog" aria-label="Virtual assistant">
          <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-midnight text-white">
            <div className="flex items-center gap-2"><Sparkles size={16} className="text-gold-light" /><div><p className="font-semibold text-sm">Virtual assistant</p><p className="text-[10px] text-white/60 font-mono uppercase tracking-wider">AI powered by ChurchConnect</p></div></div>
            <button type="button" onClick={() => setOpen(false)} className="tap inline-flex items-center justify-center rounded-lg hover:bg-white/10" aria-label="Close assistant"><X size={18} /></button>
          </div>
          <div className="h-80 min-h-[5rem] flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-linen">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${m.from === 'you' ? 'bg-gold text-white rounded-br-sm' : 'bg-paper border border-line rounded-bl-sm'}`}>
                  <p className="leading-relaxed">{m.text}</p>
                  {m.links && <div className="mt-2 flex flex-wrap gap-1.5">{m.links.map((l) => <button key={l.to} type="button" onClick={() => { nav(l.to); setOpen(false) }} className="rounded-full bg-royal-50 text-royal px-2.5 py-1 text-xs font-medium hover:bg-royal hover:text-white">{l.label}</button>)}</div>}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="shrink-0 p-2 border-t border-line">
            <div className="flex flex-wrap gap-1 px-1 pb-2 [@media(max-height:520px)]:hidden">{['Service times', 'How do I give?', 'Upcoming events', 'I need food assistance'].map((s) => <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-line px-2.5 py-1 text-[11px] hover:border-slate">{s}</button>)}</div>
            <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question" aria-label="Ask the assistant" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20 min-h-[44px]" />
              <button type="submit" className="tap rounded-lg bg-midnight text-white inline-flex items-center justify-center hover:bg-[#182840]" aria-label="Send"><Send size={16} /></button>
            </form>
          </div>
        </div>
      )}
      <button type="button" onClick={() => setOpen((o) => !o)} className="h-14 w-14 shrink-0 rounded-full bg-midnight text-white shadow-lift inline-flex items-center justify-center hover:bg-[#182840] border-2 border-gold" aria-label={open ? 'Close assistant' : 'Open virtual assistant'}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
