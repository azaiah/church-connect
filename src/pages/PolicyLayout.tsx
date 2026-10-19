import type { ReactNode } from 'react'
import { useDocumentMeta } from '@/components/useDocumentMeta'

export function PolicyLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  useDocumentMeta(`${title} | ChurchConnect by DataIsData`)
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <p className="eyebrow">Legal</p>
      <h1 className="display text-4xl mt-2">{title}</h1>
      <p className="stamp mt-2">Last updated {updated}</p>
      <div className="mt-8 space-y-5 text-slate leading-relaxed [&_h2]:font-semibold [&_h2]:text-midnight [&_h2]:mt-8 [&_h2]:text-xl">{children}</div>
    </article>
  )
}
