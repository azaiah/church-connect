import { PolicyLayout } from './PolicyLayout'
import { site } from '@/config/site'

export function Terms() {
  return (
    <PolicyLayout title="Terms of Service" updated="October 2026">
      <p>This page is a placeholder for the ChurchConnect terms of service. {/* TODO: confirm with Tony: final legal text */}</p>
      <h2>Demonstration content</h2>
      <p>The church website, member portal and administrative portal demos on this site use fictional churches, people and figures. No real congregation, donor or financial record is shown. Anything you change in a demo is stored in your browser only.</p>
      <h2>Pricing</h2>
      <p>Prices shown are proposed market-entry prices and not validated quotes. A written proposal from {site.company} governs any engagement.</p>
      <h2>Savings estimates</h2>
      <p>Hours and dollar figures in the savings calculator are planning assumptions. Labor capacity value is not the same as cash savings.</p>
    </PolicyLayout>
  )
}
