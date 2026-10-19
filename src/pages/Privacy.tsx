import { PolicyLayout } from './PolicyLayout'
import { site } from '@/config/site'

export function Privacy() {
  return (
    <PolicyLayout title="Privacy Policy" updated="October 2026">
      <p>This page is a placeholder for the ChurchConnect privacy policy. {/* TODO: confirm with Tony: final legal text */} It describes how {site.company} collects, uses and protects information submitted through this website and the ChurchConnect platform.</p>
      <h2>Information we collect</h2>
      <p>Contact details you submit through forms (name, church, role, email, phone) and, for platform customers, the records your church chooses to manage in ChurchConnect. Each church's information is logically isolated from every other church's information.</p>
      <h2>Confidential pastoral and care information</h2>
      <p>Pastoral care notes, counseling records and confidential service requests are restricted to the roles your church authorizes. AI agents receive only the information needed for their assigned task and never act on consequential matters without human approval.</p>
      <h2>Security</h2>
      <p>Multi-factor authentication, encryption in transit and at rest, audit logs, backups and retention controls. Payment details are handled by PCI-compliant processors and never stored by ChurchConnect.</p>
      <h2>Contact</h2>
      <p>Questions: <a href={`mailto:${site.email}`} className="text-royal underline">{site.email}</a>.</p>
    </PolicyLayout>
  )
}
