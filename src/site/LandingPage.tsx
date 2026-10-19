import { useDocumentMeta } from '@/components/useDocumentMeta'
import { ScrollProgress } from '@/components/ScrollProgress'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { Hero } from './sections/Hero'
import { Problem } from './sections/Problem'
import { Platform } from './sections/Platform'
import { Modules } from './sections/Modules'
import { Agents } from './sections/Agents'
import { NewWays } from './sections/NewWays'
import { Savings } from './sections/Savings'
import { Pricing } from './sections/Pricing'
import { Roadmap } from './sections/Roadmap'
import { Security } from './sections/Security'
import { Ecosystem } from './sections/Ecosystem'
import { PilotForm } from './sections/PilotForm'
import { Faq } from './sections/Faq'

export function LandingPage() {
  useDocumentMeta(
    'ChurchConnect by DataIsData | Church Website, CRM and AI-Powered Operations Platform',
    'A modern church website, member portal, membership CRM, giving, ministry operations, facilities and an AI administrative workforce in one connected platform.',
  )
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <SiteHeader overDark />
      <main id="main" className="flex-1">
        <Hero />
        <Problem />
        <Platform />
        <Modules />
        <Agents />
        <NewWays />
        <Savings />
        <Pricing />
        <Roadmap />
        <Security />
        <Ecosystem />
        <PilotForm />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  )
}
