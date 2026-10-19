import { useState } from 'react'
import { Play, Radio, Headphones, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDemo } from '@/data/store'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { fmtDate } from '@/data/dates'
import { Input } from '@/components/Field'
import { Badge } from '@/components/Badge'
import { Rise, Stagger, item } from '@/site/motion'
import { Container, PageHero } from '../Section'

export function Sermons() {
  const { state } = useDemo()
  useDocumentMeta(`Sermons | ${state.church.name}`)
  const [q, setQ] = useState('')
  const [series, setSeries] = useState('All')
  const seriesList = ['All', ...Array.from(new Set(state.sermons.map((s) => s.series)))]
  const list = state.sermons.filter((s) => (series === 'All' || s.series === series) && (s.title + s.scripture + s.speaker).toLowerCase().includes(q.toLowerCase()))
  const [playing, setPlaying] = useState(state.sermons[0])
  return (
    <>
      <PageHero eyebrow="Sermons and media" title="Messages for the week ahead." text="Watch the latest message, catch the livestream Sunday at 11:00 AM, or listen on your commute. New messages post every Monday." />
      <section className="py-16">
        <Container className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Rise>
            <div className="relative aspect-video rounded-2xl overflow-hidden mesh text-white">
              <div className="absolute inset-0 rays" aria-hidden="true" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button type="button" className="h-20 w-20 shrink-0 rounded-full bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center hover:scale-105 transition-transform" aria-label={`Play ${playing.title}`}><Play size={30} className="ml-1" /></button>
              </div>
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-midnight/60 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider"><Radio size={12} className="text-gold-light" /> Video player (demo)</div>
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-midnight/80 to-transparent">
                <p className="font-mono text-[10px] uppercase tracking-wider text-gold-light">{playing.series}</p>
                <p className="font-display text-2xl font-semibold">{playing.title}</p>
                <p className="text-sm text-white/70">{playing.speaker} &middot; {playing.scripture} &middot; {playing.duration}</p>
              </div>
            </div>
            <p className="text-slate mt-4 leading-relaxed">{playing.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Badge tone="gold">{playing.views.toLocaleString()} views</Badge>
              <Badge><Headphones size={12} /> Audio available</Badge>
              <Badge>{fmtDate(playing.date)}</Badge>
            </div>
          </Rise>
          <div>
            <div className="card p-4">
              <Input placeholder="Search by title, scripture or speaker" value={q} onChange={(e) => setQ(e.target.value)} trailing={<Search size={16} className="text-slate mr-2" />} aria-label="Search sermons" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {seriesList.map((s) => <button key={s} type="button" onClick={() => setSeries(s)} className={`rounded-full px-3 py-1.5 text-xs font-medium border ${series === s ? 'bg-midnight text-white border-midnight' : 'border-line hover:border-slate'}`}>{s}</button>)}
              </div>
            </div>
            <Stagger className="mt-4 space-y-2">
              {list.map((s) => (
                <motion.button key={s.id} variants={item} type="button" onClick={() => setPlaying(s)} className={`w-full text-left card p-4 flex gap-4 hover:border-slate ${playing.id === s.id ? 'ring-2 ring-gold' : ''}`}>
                  <div className="h-14 w-20 rounded-lg mesh shrink-0 flex items-center justify-center text-white"><Play size={16} /></div>
                  <div className="min-w-0">
                    <p className="stamp">{s.series}</p>
                    <p className="font-semibold truncate">{s.title}</p>
                    <p className="text-xs text-slate">{s.scripture} &middot; {fmtDate(s.date)} &middot; {s.duration}</p>
                  </div>
                </motion.button>
              ))}
              {list.length === 0 && <p className="text-sm text-slate p-4">No messages match that search.</p>}
            </Stagger>
          </div>
        </Container>
      </section>
    </>
  )
}
