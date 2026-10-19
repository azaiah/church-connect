import { LinkButton } from '@/components/Button'
import { Logo } from '@/components/Logo'
import { useDocumentMeta } from '@/components/useDocumentMeta'

export function NotFound() {
  useDocumentMeta('Page not found | ChurchConnect')
  return (
    <main className="min-h-screen mesh text-white flex flex-col items-center justify-center text-center px-6">
      <Logo light />
      <p className="eyebrow mt-10 text-gold-light">404</p>
      <h1 className="display text-4xl sm:text-5xl mt-3">That page is not on the calendar.</h1>
      <p className="mt-4 text-white/70 max-w-md">The link may be old or mistyped. Head back to the platform overview or open one of the live demos.</p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <LinkButton to="/" variant="primary">Platform overview</LinkButton>
        <LinkButton to="/admin" variant="outline" className="!bg-transparent !text-white !border-white/30 hover:!border-white">Admin demo</LinkButton>
      </div>
    </main>
  )
}
