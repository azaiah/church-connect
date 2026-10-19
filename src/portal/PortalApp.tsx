import { useState, type FormEvent } from 'react'
import { Routes, Route, NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Heart, CalendarDays, Users, Bell, UserCircle, LogOut, ArrowLeft, Lock, HandHeart } from 'lucide-react'
import { DemoProvider, useDemo } from '@/data/store'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { Input } from '@/components/Field'
import { Button } from '@/components/Button'
import { PoweredBy, Mark } from '@/components/Logo'
import { ChurchMark } from '@/church/ChurchLayout'
import { PortalHome } from './PortalHome'
import { PortalGiving } from './PortalGiving'
import { PortalEvents } from './PortalEvents'
import { PortalGroups } from './PortalGroups'
import { PortalProfile } from './PortalProfile'
import { PortalCare } from './PortalCare'
import { BookOpen } from 'lucide-react'

const portalTips: Record<string, { title: string; text: string }> = {
  '/portal': { title: 'Your overview', text: 'One screen with your giving this year, upcoming events you registered for, your ministries and any prayer requests you have shared. Everything here is yours alone; nobody else sees it.' },
  '/portal/giving': { title: 'Giving history', text: 'Every gift by month and by fund. Download your annual statement for tax time with one click. Only you and the finance team can see these numbers.' },
  '/portal/events': { title: 'My events', text: 'Everything you registered for on the church website. Cancel a seat here if plans change; the church office sees the update immediately.' },
  '/portal/groups': { title: 'My ministries', text: 'The groups you serve with, when they meet, and open shifts. Join or leave a ministry here; the leader is notified.' },
  '/portal/care': { title: 'Prayer and care', text: 'Requests you have shared and where they stand. Confidential requests are seen only by the pastor and care coordinator.' },
  '/portal/profile': { title: 'Profile and permissions', text: 'Keep your contact details current and choose whether the church may email or text you. Changes apply right away.' },
}
const TIP_KEY = 'churchconnect-portal-guide'

const PORTAL_KEY = 'churchconnect-portal-entered'
const items = [
  { to: '/portal', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/portal/giving', label: 'Giving', icon: Heart },
  { to: '/portal/events', label: 'My events', icon: CalendarDays },
  { to: '/portal/groups', label: 'My ministries', icon: Users },
  { to: '/portal/care', label: 'Prayer & care', icon: HandHeart },
  { to: '/portal/profile', label: 'Profile', icon: UserCircle },
]

function Login({ onEnter }: { onEnter: () => void }) {
  const { state } = useDemo()
  useDocumentMeta(`Member portal | ${state.church.name}`)
  const me = state.members.find((m) => m.id === state.currentMemberId)!
  const [email, setEmail] = useState(me.email)
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<'email' | 'code'>('email')
  function submit(e: FormEvent) { e.preventDefault(); if (stage === 'email') setStage('code'); else onEnter() }
  return (
    <main className="min-h-screen mesh text-white flex flex-col">
      <div className="p-5 flex items-center justify-between">
        <Link to="/church" className="inline-flex items-center gap-2"><ChurchMark light /><span className="font-display font-semibold">{state.church.shortName}</span></Link>
        <Link to="/church" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white min-h-[44px]"><ArrowLeft size={16} /> Back to church site</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <p className="eyebrow text-gold-light">Member portal</p>
          <h1 className="display text-4xl mt-3">Welcome back.</h1>
          <p className="mt-3 text-white/70">Sign in with the email on file. We will send a one-time code (demo: any six digits work).</p>
          <form onSubmit={submit} className="mt-6 rounded-2xl bg-paper text-midnight p-6 grid gap-4">
            {stage === 'email' ? (
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            ) : (
              <Input label={`Code sent to ${email}`} inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" autoFocus />
            )}
            <Button type="submit" size="lg">{stage === 'email' ? 'Send code' : 'Sign in'}</Button>
            <p className="text-xs text-slate flex items-center gap-1.5"><Lock size={12} /> Multi-factor sign-in. Members only see their own records.</p>
          </form>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-white/40">Demo member: {me.first} {me.last}</p>
        </div>
      </div>
    </main>
  )
}

function PortalShell() {
  const { state } = useDemo()
  const nav = useNavigate()
  const loc = useLocation()
  const me = state.members.find((m) => m.id === state.currentMemberId)!
  const [guide, setGuide] = useState(() => { try { return localStorage.getItem(TIP_KEY) !== '0' } catch { return true } })
  const toggleGuide = () => { const v = !guide; setGuide(v); try { localStorage.setItem(TIP_KEY, v ? '1' : '0') } catch { /* noop */ } }
  const tip = portalTips[loc.pathname] ?? portalTips['/portal']
  return (
    <div className="min-h-screen bg-linen flex flex-col">
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/church" className="inline-flex items-center gap-2 min-h-[44px]"><ChurchMark size={30} /><span className="leading-none"><span className="block font-display font-semibold">{state.church.shortName}</span><span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-slate mt-1">Member portal</span></span></Link>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleGuide} aria-pressed={guide} className={`tap inline-flex items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium ${guide ? 'bg-gold text-white border-gold' : 'border-line bg-paper text-slate'}`} title="Simple explanations on every page"><BookOpen size={16} /> <span className="hidden sm:inline">Guide {guide ? 'on' : 'off'}</span></button>
            <Link to="/portal/profile" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium min-h-[44px]"><span className="h-8 w-8 shrink-0 rounded-full bg-midnight text-gold-light flex items-center justify-center text-xs font-semibold">{me.first[0]}{me.last[0]}</span>{me.first}</Link>
            <button type="button" onClick={() => { try { localStorage.removeItem(PORTAL_KEY) } catch { /* noop */ } nav('/church') }} className="tap inline-flex items-center gap-1.5 rounded-lg px-2 text-sm text-slate hover:bg-midnight/5"><LogOut size={16} /> <span className="hidden sm:inline">Sign out</span></button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-6 lg:py-10 flex-1 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Portal" className="lg:sticky lg:top-24 self-start">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 -mx-1 px-1">
            {items.map((it) => (
              <li key={it.to} className="shrink-0"><NavLink to={it.to} end={it.end} className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium min-h-[44px] whitespace-nowrap ${isActive ? 'bg-midnight text-white' : 'text-slate hover:bg-paper hover:text-midnight'}`}><it.icon size={17} /> {it.label}</NavLink></li>
            ))}
          </ul>
          <div className="hidden lg:block mt-6 rounded-xl border border-line bg-paper p-3 text-xs text-slate">
            <p className="flex items-center gap-1.5 font-medium text-midnight"><Bell size={13} className="text-gold" /> {state.announcements.filter((a) => a.status === 'sent' || a.status === 'approved').length} announcements</p>
            <p className="mt-1">Sample data stored in this browser.</p>
          </div>
        </nav>
        <main id="main" className="min-w-0">{guide && <div className="mb-5 rounded-xl border-2 border-gold/40 bg-gold-50/60 p-4 flex gap-3"><BookOpen size={18} className="text-gold shrink-0 mt-0.5" /><div><p className="font-semibold text-sm">{tip.title}</p><p className="text-sm text-slate mt-0.5 leading-relaxed">{tip.text}</p></div></div>}<Outlet /></main>
      </div>
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate">
          <span>{state.church.name} member portal</span>
          <Link to="/" className="hit gap-2"><Mark size={14} /> <PoweredBy /></Link>
        </div>
      </footer>
    </div>
  )
}

function Gate() {
  const [entered, setEntered] = useState(() => { try { return localStorage.getItem(PORTAL_KEY) === '1' } catch { return false } })
  if (!entered) return <Login onEnter={() => { try { localStorage.setItem(PORTAL_KEY, '1') } catch { /* noop */ } setEntered(true) }} />
  return <PortalShell />
}

export default function PortalApp() {
  return (
    <DemoProvider>
      <Routes>
        <Route element={<Gate />}>
          <Route index element={<PortalHome />} />
          <Route path="giving" element={<PortalGiving />} />
          <Route path="events" element={<PortalEvents />} />
          <Route path="groups" element={<PortalGroups />} />
          <Route path="care" element={<PortalCare />} />
          <Route path="profile" element={<PortalProfile />} />
          <Route path="*" element={<PortalHome />} />
        </Route>
      </Routes>
    </DemoProvider>
  )
}
