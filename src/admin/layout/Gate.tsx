import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { useDemo } from '@/data/store'
import { roleMeta, demoRoles } from '../nav'
import type { Role } from '@/data/types'

export function Gate() {
  useDocumentMeta('Admin demo | ChurchConnect by DataIsData', 'Enter the interactive ChurchConnect administrative portal as any church role.')
  const { set, setRole, state } = useDemo()
  const nav = useNavigate()
  function enter(r: Role) { setRole(r); set('entered', true); nav(roleMeta[r].home) }
  return (
    <main className="min-h-screen mesh text-white flex flex-col">
      <div className="p-5 flex items-center justify-between">
        <Logo light />
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white min-h-[44px]"><ArrowLeft size={16} /> Back to platform</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          <p className="eyebrow text-gold-light">You are entering a live demo</p>
          <h1 className="display text-4xl sm:text-6xl mt-3">{state.church.name}</h1>
          <p className="mt-3 text-white/70 max-w-xl">A fictional Richmond congregation of about {state.members.length * 20}. Everything inside is sample data you can change, break and reset. Pick a role to see exactly what that person sees. Not everyone sees the same information. Guide mode is on by default: every page opens with a plain-language explanation of what the tool is for and who usually owns it. Turn it off any time from the top bar.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {demoRoles.map((r) => (
              <button key={r} type="button" onClick={() => enter(r)} className="group text-left rounded-xl border border-white/15 bg-white/[0.04] p-4 hover:border-gold-light hover:bg-white/[0.07] transition-colors min-h-[44px]">
                <div className="flex items-center justify-between gap-3"><span className="font-semibold">{roleMeta[r].label}</span><ArrowRight size={16} className="text-gold-light touch-reveal opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                <p className="text-sm text-white/60 mt-1">{roleMeta[r].description}</p>
              </button>
            ))}
            <Link to="/portal" className="group text-left rounded-xl border border-dashed border-white/15 p-4 hover:border-gold-light transition-colors min-h-[44px]">
              <div className="flex items-center justify-between gap-3"><span className="font-semibold">{roleMeta.member.label}</span><ArrowRight size={16} className="text-gold-light touch-reveal opacity-0 group-hover:opacity-100 transition-opacity" /></div>
              <p className="text-sm text-white/60 mt-1">{roleMeta.member.description}</p>
            </Link>
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-white/40">Sample data &middot; stored in this browser only &middot; {state.members.length} member records &middot; {state.gifts.length} gifts</p>
        </div>
      </div>
    </main>
  )
}
