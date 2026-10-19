import type { ReactNode } from 'react'
import { Rise, Underline } from '@/site/motion'

export function PageHero({ eyebrow, title, text, children }: { eyebrow: string; title: ReactNode; text?: string; children?: ReactNode }) {
  return (
    <section className="mesh-light border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:py-20">
        <Rise className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display text-4xl sm:text-5xl mt-3">{title}</h1>
          {text && <p className="lede mt-5">{text}</p>}
          {children}
        </Rise>
      </div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, text, underline, className = '' }: { eyebrow: string; title: string; text?: string; underline?: string; className?: string }) {
  return (
    <Rise className={`max-w-2xl ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display text-3xl sm:text-4xl mt-3">{title} {underline && <Underline>{underline}</Underline>}</h2>
      {text && <p className="lede mt-4">{text}</p>}
    </Rise>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>
}
