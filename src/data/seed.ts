import type { DemoState, Member, Household, Gift, ChurchEvent, Registration, Reservation, Staff, Shift, Expense, BudgetLine, CareRequest, ServiceRequest, Attendance, AgentDraft, Approval, Task, Maintenance, Announcement } from './types'
import { daysFromNow } from './dates'

/** Deterministic PRNG so the demo looks the same every time. */
function rng(seed: number) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 } }
const rand = rng(20261018)
const pick = <T,>(a: readonly T[]) => a[Math.floor(rand() * a.length)]
const between = (a: number, b: number) => Math.floor(a + rand() * (b - a + 1))

const firsts = ['Marcus', 'Danielle', 'Jerome', 'Keisha', 'Darnell', 'Alicia', 'Terrence', 'Monique', 'Andre', 'Tamika', 'Reginald', 'Vanessa', 'Calvin', 'Felicia', 'Maurice', 'Angela', 'Dwayne', 'Patrice', 'Lamar', 'Simone', 'Kevin', 'Brenda', 'Rodney', 'Yolanda', 'Carlos', 'Maria', 'Samuel', 'Grace', 'Isaiah', 'Ruth', 'Daniel', 'Esther', 'Joshua', 'Naomi', 'Elijah', 'Hannah', 'Caleb', 'Deborah', 'Micah', 'Lydia', 'Nathan', 'Priscilla', 'Jonathan', 'Abigail', 'Thomas', 'Miriam', 'Peter', 'Rebekah', 'Luis', 'Carmen', 'Victor', 'Gloria']
const lasts = ['Ellison', 'Carter', 'Robinson', 'Mitchell', 'Harris', 'Jenkins', 'Washington', 'Coleman', 'Brooks', 'Price', 'Bryant', 'Griffin', 'Hayes', 'Freeman', 'Ford', 'Simmons', 'Butler', 'Henderson', 'Patterson', 'Powell', 'Reyes', 'Ortiz', 'Nguyen', 'Kim', 'Okafor', 'Adeyemi', 'Mensah', 'Bailey', 'Chambers', 'Dixon']
const streets = ['Hull St', 'Broad Rock Blvd', 'Midlothian Tpke', 'Jahnke Rd', 'Forest Hill Ave', 'Semmes Ave', 'Cowardin Ave', 'Belt Blvd', 'German School Rd', 'Chippenham Pkwy', 'Walmsley Blvd', 'Warwick Rd']

export const ministryIds = { worship: 'min_worship', youth: 'min_youth', outreach: 'min_outreach', hospitality: 'min_hospitality', seniors: 'min_seniors', education: 'min_education', men: 'min_men', women: 'min_women', transport: 'min_transport', media: 'min_media' } as const

function nextSunday(offsetWeeks: number) { const d = new Date(); d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7) + offsetWeeks * 7); return d.toISOString().slice(0, 10) }
function nextWeekday(wd: number) { const d = new Date(); d.setDate(d.getDate() + ((wd - d.getDay() + 7) % 7 || 7)); return d.toISOString().slice(0, 10) }

function makePeople() {
  const households: Household[] = []
  const members: Member[] = []
  const minList = Object.values(ministryIds)
  const statuses: Member['status'][] = ['member', 'member', 'member', 'member', 'member', 'attendee', 'attendee', 'visitor', 'inactive']
  let hh = 0
  const total = 64
  for (let i = 0; i < total; i++) {
    const newHousehold = i === 0 || rand() < 0.6
    if (newHousehold) {
      hh += 1
      const last = pick(lasts)
      households.push({ id: `hh_${hh}`, name: `${last} Household`, address: `${between(100, 9900)} ${pick(streets)}, Richmond, VA 2322${between(0, 9)}` })
    }
    const h = households[households.length - 1]
    const last = h.name.replace(' Household', '')
    const first = firsts[i % firsts.length]
    const status = i < 6 ? 'member' : pick(statuses)
    const joined = status === 'visitor' ? '' : `${between(2008, 2025)}-${String(between(1, 12)).padStart(2, '0')}-${String(between(1, 28)).padStart(2, '0')}`
    const mins = status === 'inactive' || status === 'visitor' || rand() < 0.22 ? [] : Array.from(new Set([pick(minList), ...(rand() < 0.4 ? [pick(minList)] : [])]))
    members.push({
      id: `m_${i + 1}`, first, last, email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`, phone: `(804) 555-0${String(between(100, 199))}`,
      householdId: h.id, status, joinedAt: joined, firstVisit: status === 'visitor' ? daysFromNow(-between(1, 21)) : joined || daysFromNow(-400),
      ministryIds: mins, tags: rand() < 0.2 ? ['Leader'] : rand() < 0.3 ? ['New this year'] : [],
      consent: { email: rand() < 0.9, sms: rand() < 0.6 }, lastContact: daysFromNow(-between(0, 140)),
      address: h.address, birthday: `19${between(50, 99)}-${String(between(1, 12)).padStart(2, '0')}-${String(between(1, 28)).padStart(2, '0')}`,
      notes: '', volunteerInterests: rand() < 0.5 ? [pick(['Greeting', 'Audio/Visual', 'Food pantry', 'Transportation', 'Children', 'Music', 'Setup'])] : [],
    })
  }
  const named: Partial<Member>[] = [
    { first: 'Marcus', last: 'Ellison', status: 'member', tags: ['Senior Pastor'], email: 'pastor@graceharborcc.org' },
    { first: 'Danielle', last: 'Carter', status: 'member', tags: ['Executive Administrator'], email: 'danielle@graceharborcc.org' },
    { first: 'Jerome', last: 'Robinson', status: 'member', tags: ['Finance Officer'], email: 'finance@graceharborcc.org' },
    { first: 'Keisha', last: 'Mitchell', status: 'member', tags: ['Church Secretary'], email: 'office@graceharborcc.org' },
    { first: 'Darnell', last: 'Harris', status: 'member', tags: ['Youth Pastor', 'Leader'], ministryIds: [ministryIds.youth] },
    { first: 'Alicia', last: 'Jenkins', status: 'member', tags: ['Music Director', 'Leader'], ministryIds: [ministryIds.worship] },
  ]
  named.forEach((n, i) => Object.assign(members[i], n, { joinedAt: `20${10 + i}-03-0${i + 1}`, lastContact: daysFromNow(-between(0, 7)) }))
  for (let i = 0; i < 8; i++) {
    const m = members[members.length - 1 - i]
    m.status = 'visitor'; m.joinedAt = ''; m.firstVisit = daysFromNow(-(i * 2 + 1)); m.ministryIds = []; m.tags = ['First-time visitor']; m.lastContact = i < 3 ? '' : daysFromNow(-i)
  }
  Object.assign(members[19], { first: 'Monique', last: 'Hayes', status: 'member', email: 'monique.hayes@example.com', ministryIds: [ministryIds.women, ministryIds.hospitality], tags: [], consent: { email: true, sms: true }, volunteerInterests: ['Greeting'], joinedAt: '2019-04-14', lastContact: daysFromNow(-3) })
  return { households, members }
}

export function createSeedState(): DemoState {
  const { households, members } = makePeople()
  const staffIds = { pastor: 'm_1', admin: 'm_2', finance: 'm_3', secretary: 'm_4', youth: 'm_5', music: 'm_6' }

  const funds = [
    { id: 'f_general', name: 'General Fund', type: 'general' as const, description: 'Tithes and offerings supporting operations and ministry.' },
    { id: 'f_building', name: 'Building & Facilities Fund', type: 'restricted' as const, goal: 250000, description: 'Sanctuary roof replacement and fellowship hall HVAC.' },
    { id: 'f_benevolence', name: 'Benevolence Fund', type: 'designated' as const, description: 'Emergency assistance for families in the congregation and community.' },
    { id: 'f_missions', name: 'Missions & Outreach', type: 'designated' as const, goal: 40000, description: 'Local outreach programs and mission partnerships.' },
    { id: 'f_youth', name: 'Youth Summer Camp', type: 'designated' as const, goal: 18000, description: 'Scholarships and travel for the 2027 summer camp.' },
  ]

  const gifts: Gift[] = []
  const givers = members.filter((m) => m.status === 'member' || m.status === 'attendee')
  for (let d = 0; d < 180; d += 1) {
    const date = daysFromNow(-d)
    const isSunday = new Date(date + 'T12:00:00').getDay() === 0
    const n = isSunday ? between(10, 18) : between(0, 3)
    for (let i = 0; i < n; i++) {
      const m = pick(givers)
      const fundRoll = rand()
      const fundId = fundRoll < 0.72 ? 'f_general' : fundRoll < 0.85 ? 'f_building' : fundRoll < 0.92 ? 'f_missions' : fundRoll < 0.97 ? 'f_benevolence' : 'f_youth'
      gifts.push({ id: `g_${gifts.length + 1}`, memberId: m.id, amount: pick([25, 40, 50, 75, 100, 100, 120, 150, 200, 250, 300, 500]), fundId, method: isSunday ? pick(['check', 'cash', 'card', 'online', 'text']) : pick(['online', 'ach', 'online', 'text']), date, status: d > 6 ? 'reconciled' : 'recorded', recurring: rand() < 0.3 })
    }
  }
  ;[7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84].forEach((d, i) => gifts.push({ id: `g_mon_${i}`, memberId: 'm_20', amount: i % 4 === 3 ? 50 : 150, fundId: i % 4 === 3 ? 'f_building' : 'f_general', method: 'online', date: daysFromNow(-d), status: 'reconciled', recurring: true }))

  const ministries = [
    { id: ministryIds.worship, name: 'Worship & Music', leaderId: staffIds.music, description: 'Choir, praise team, musicians and sound.', annualBudget: 42000, color: '#B8862B', meets: 'Thursdays 7:00 PM' },
    { id: ministryIds.youth, name: 'Youth Ministry', leaderId: staffIds.youth, description: 'Middle and high school students, Friday nights and summer camp.', annualBudget: 36000, color: '#1F4E79', meets: 'Fridays 6:30 PM' },
    { id: ministryIds.outreach, name: 'Community Outreach', leaderId: 'm_7', description: 'Food pantry, clothing closet, neighborhood service days.', annualBudget: 58000, color: '#1E7A4C', meets: '2nd Saturdays 9:00 AM' },
    { id: ministryIds.hospitality, name: 'Hospitality & Greeters', leaderId: 'm_8', description: 'First impressions, welcome desk and fellowship meals.', annualBudget: 9000, color: '#B7791F', meets: 'Sundays 8:00 AM' },
    { id: ministryIds.seniors, name: 'Senior Saints', leaderId: 'm_9', description: 'Fellowship, transportation and care for members 65 and up.', annualBudget: 12000, color: '#7C3AED', meets: '1st Tuesdays 11:00 AM' },
    { id: ministryIds.education, name: 'Christian Education', leaderId: 'm_10', description: 'Sunday school, Bible study and new member classes.', annualBudget: 15000, color: '#0E7490', meets: 'Sundays 9:45 AM' },
    { id: ministryIds.men, name: "Men's Fellowship", leaderId: 'm_11', description: 'Monthly breakfast, mentoring and service projects.', annualBudget: 6000, color: '#374151', meets: '3rd Saturdays 8:00 AM' },
    { id: ministryIds.women, name: "Women's Ministry", leaderId: 'm_12', description: 'Bible study, retreats and community support.', annualBudget: 8000, color: '#BE185D', meets: '2nd Tuesdays 7:00 PM' },
    { id: ministryIds.transport, name: 'Transportation', leaderId: 'm_13', description: 'Van ministry for seniors and families without a ride.', annualBudget: 14000, color: '#B45309', meets: 'As scheduled' },
    { id: ministryIds.media, name: 'Media & Livestream', leaderId: 'm_14', description: 'Livestream, recordings, website and social media.', annualBudget: 11000, color: '#4338CA', meets: 'Sundays 7:30 AM' },
  ]

  const rooms = [
    { id: 'r_sanctuary', name: 'Sanctuary', capacity: 450, kind: 'sanctuary' as const, rentalRate: 600 },
    { id: 'r_hall', name: 'Fellowship Hall', capacity: 180, kind: 'hall' as const, rentalRate: 350 },
    { id: 'r_kitchen', name: 'Commercial Kitchen', capacity: 12, kind: 'kitchen' as const, rentalRate: 150 },
    { id: 'r_youth', name: 'Youth Center', capacity: 60, kind: 'classroom' as const, rentalRate: 120 },
    { id: 'r_class1', name: 'Classroom A', capacity: 30, kind: 'classroom' as const, rentalRate: 60 },
    { id: 'r_class2', name: 'Classroom B', capacity: 30, kind: 'classroom' as const, rentalRate: 60 },
    { id: 'r_conf', name: 'Conference Room', capacity: 14, kind: 'office' as const, rentalRate: 50 },
    { id: 'r_lawn', name: 'Front Lawn & Pavilion', capacity: 300, kind: 'outdoor' as const, rentalRate: 200 },
    { id: 'r_van', name: '15-Passenger Van', capacity: 15, kind: 'vehicle' as const, rentalRate: 0 },
  ]

  const events: ChurchEvent[] = [
    { id: 'e_1', title: 'Sunday Worship Service', ministryId: ministryIds.worship, date: nextSunday(0), start: '11:00', end: '12:30', roomId: 'r_sanctuary', description: 'Weekly worship with Pastor Ellison. Livestreamed.', stage: 'promoted', budget: 0, spent: 0, capacity: 450, isPublic: true, category: 'worship', registrationOpen: false, ownerId: staffIds.music },
    { id: 'e_2', title: 'Community Health Fair', ministryId: ministryIds.outreach, date: daysFromNow(19), start: '09:00', end: '14:00', roomId: 'r_lawn', description: 'Free screenings, flu shots, insurance navigators and healthy cooking demos with Bon Secours and VCU Health volunteers.', stage: 'published', budget: 4500, spent: 1830, capacity: 300, isPublic: true, category: 'community', registrationOpen: true, ownerId: 'm_7' },
    { id: 'e_3', title: 'New Member Orientation', ministryId: ministryIds.education, date: daysFromNow(6), start: '09:45', end: '11:00', roomId: 'r_class1', description: 'Three-session class for those joining Grace Harbor. Breakfast provided.', stage: 'staffed', budget: 300, spent: 120, capacity: 30, isPublic: true, category: 'class', registrationOpen: true, ownerId: 'm_10' },
    { id: 'e_4', title: 'Youth Friday Night Live', ministryId: ministryIds.youth, date: daysFromNow(4), start: '18:30', end: '21:00', roomId: 'r_youth', description: 'Games, worship and a message for grades 6 through 12.', stage: 'promoted', budget: 400, spent: 210, capacity: 60, isPublic: true, category: 'youth', registrationOpen: false, ownerId: staffIds.youth },
    { id: 'e_5', title: 'Fall Financial Literacy Workshop', ministryId: ministryIds.education, date: daysFromNow(12), start: '18:00', end: '20:00', roomId: 'r_hall', description: 'Budgeting, credit repair and first-time homebuyer basics with Virginia Credit Union.', stage: 'approved', budget: 900, spent: 0, capacity: 120, isPublic: true, category: 'class', registrationOpen: true, ownerId: 'm_10' },
    { id: 'e_6', title: 'Thanksgiving Community Dinner', ministryId: ministryIds.hospitality, date: daysFromNow(37), start: '13:00', end: '16:00', roomId: 'r_hall', description: 'Free dinner for neighbors. Volunteers needed for cooking, serving and cleanup.', stage: 'proposed', budget: 3200, spent: 0, capacity: 180, isPublic: true, category: 'community', registrationOpen: false, ownerId: 'm_8' },
    { id: 'e_7', title: 'Senior Saints Luncheon', ministryId: ministryIds.seniors, date: daysFromNow(9), start: '11:00', end: '13:00', roomId: 'r_hall', description: 'Monthly fellowship lunch with a Medicare open-enrollment briefing.', stage: 'reserved', budget: 450, spent: 0, capacity: 80, isPublic: true, category: 'community', registrationOpen: true, ownerId: 'm_9' },
    { id: 'e_8', title: 'Deacon Board Meeting', ministryId: ministryIds.worship, date: daysFromNow(2), start: '19:00', end: '20:30', roomId: 'r_conf', description: 'Monthly board meeting. Agenda circulated by the Office Agent.', stage: 'staffed', budget: 0, spent: 0, capacity: 14, isPublic: false, category: 'meeting', registrationOpen: false, ownerId: staffIds.admin },
    { id: 'e_9', title: 'Back to School Supply Drive', ministryId: ministryIds.outreach, date: daysFromNow(-52), start: '09:00', end: '13:00', roomId: 'r_lawn', description: 'Backpacks and supplies for 240 students.', stage: 'reported', budget: 2800, spent: 2655, capacity: 300, isPublic: true, category: 'outreach', registrationOpen: false, attendance: 312, ownerId: 'm_7' },
    { id: 'e_10', title: 'Men’s Breakfast', ministryId: ministryIds.men, date: daysFromNow(14), start: '08:00', end: '09:30', roomId: 'r_hall', description: 'Monthly breakfast and devotion.', stage: 'promoted', budget: 250, spent: 0, capacity: 60, isPublic: true, category: 'community', registrationOpen: true, ownerId: 'm_11' },
    { id: 'e_11', title: 'Wednesday Bible Study', ministryId: ministryIds.education, date: nextWeekday(3), start: '19:00', end: '20:15', roomId: 'r_class2', description: 'Walking through the book of James.', stage: 'promoted', budget: 0, spent: 0, capacity: 30, isPublic: true, category: 'class', registrationOpen: false, ownerId: 'm_10' },
    { id: 'e_12', title: 'Choir Anniversary Concert', ministryId: ministryIds.worship, date: daysFromNow(44), start: '16:00', end: '18:30', roomId: 'r_sanctuary', description: '25 years of the Grace Harbor Mass Choir with guest artists.', stage: 'approved', budget: 5600, spent: 900, capacity: 450, isPublic: true, category: 'conference', registrationOpen: true, ownerId: staffIds.music },
  ]

  const registrations: Registration[] = []
  events.filter((e) => e.registrationOpen).forEach((e) => {
    const n = e.id === 'e_2' ? 86 : e.id === 'e_12' ? 140 : between(6, 24)
    for (let i = 0; i < n; i++) {
      const m = i % 3 === 0 ? undefined : pick(members)
      registrations.push({ id: `rg_${registrations.length + 1}`, eventId: e.id, memberId: m?.id, name: m ? `${m.first} ${m.last}` : `${pick(firsts)} ${pick(lasts)}`, email: m?.email ?? 'neighbor@example.com', qty: between(1, 3), date: daysFromNow(-between(0, 20)) })
    }
  })
  registrations.push({ id: 'rg_mon_1', eventId: 'e_2', memberId: 'm_20', name: 'Monique Hayes', email: 'monique.hayes@example.com', qty: 2, date: daysFromNow(-4) })
  registrations.push({ id: 'rg_mon_2', eventId: 'e_12', memberId: 'm_20', name: 'Monique Hayes', email: 'monique.hayes@example.com', qty: 3, date: daysFromNow(-2) })

  const reservations: Reservation[] = [
    { id: 'rs_1', roomId: 'r_hall', requester: 'Southside Neighborhood Assoc.', date: daysFromNow(11), start: '18:00', end: '20:00', status: 'requested', purpose: 'Monthly community meeting', external: true, fee: 350, deposit: 100, paid: false },
    { id: 'rs_2', roomId: 'r_sanctuary', requester: 'Thompson & Reyes families', date: daysFromNow(26), start: '14:00', end: '17:00', status: 'requested', purpose: 'Wedding ceremony (approved members)', external: false, fee: 0, deposit: 0, paid: true },
    { id: 'rs_3', roomId: 'r_class1', requester: 'Richmond Literacy Partners', date: daysFromNow(5), start: '10:00', end: '12:00', status: 'requested', purpose: 'Adult literacy tutoring', external: true, fee: 60, deposit: 0, paid: false },
    { id: 'rs_4', roomId: 'r_hall', eventId: 'e_7', requester: 'Senior Saints', date: daysFromNow(9), start: '10:00', end: '14:00', status: 'approved', purpose: 'Senior Saints Luncheon', external: false },
    { id: 'rs_5', roomId: 'r_van', requester: 'Transportation Ministry', date: nextSunday(0), start: '08:30', end: '13:30', status: 'approved', purpose: 'Sunday pickup route', external: false },
    { id: 'rs_6', roomId: 'r_kitchen', requester: 'Sweet Grace Catering (member-owned)', date: daysFromNow(16), start: '07:00', end: '15:00', status: 'approved', purpose: 'Commercial kitchen rental', external: true, fee: 150, deposit: 50, paid: true },
  ]

  const maintenance: Maintenance[] = [
    { id: 'mt_1', area: 'Sanctuary', title: 'Roof leak above choir loft', priority: 'urgent', status: 'assigned', vendor: 'Commonwealth Roofing', reportedBy: 'Alicia Jenkins', date: daysFromNow(-3), cost: 4800 },
    { id: 'mt_2', area: 'Fellowship Hall', title: 'HVAC unit 2 short-cycling', priority: 'high', status: 'scheduled', vendor: 'James River Mechanical', reportedBy: 'Danielle Carter', date: daysFromNow(-9), cost: 1250 },
    { id: 'mt_3', area: 'Parking lot', title: 'Restripe accessible spaces', priority: 'normal', status: 'open', reportedBy: 'Deacon Board', date: daysFromNow(-14) },
    { id: 'mt_4', area: '15-Passenger Van', title: '90,000-mile service and brake inspection', priority: 'high', status: 'open', reportedBy: 'Transportation Ministry', date: daysFromNow(-5) },
    { id: 'mt_5', area: 'Youth Center', title: 'Replace projector lamp', priority: 'low', status: 'done', reportedBy: 'Darnell Harris', date: daysFromNow(-20), cost: 180 },
    { id: 'mt_6', area: 'Commercial Kitchen', title: 'Annual fire suppression inspection', priority: 'normal', status: 'scheduled', vendor: 'Virginia Fire Protection', reportedBy: 'Facilities Agent', date: daysFromNow(-2), cost: 325 },
  ]

  const assets = [
    { id: 'a_1', name: 'Sanctuary sound system (Allen & Heath)', category: 'Audio/Visual', location: 'Sanctuary', serviceDue: daysFromNow(60), value: 28000 },
    { id: 'a_2', name: '15-Passenger Van (2019 Ford Transit)', category: 'Vehicle', location: 'Parking lot', serviceDue: daysFromNow(-5), insuranceRenewal: daysFromNow(41), value: 32000 },
    { id: 'a_3', name: 'Commercial kitchen equipment', category: 'Kitchen', location: 'Commercial Kitchen', serviceDue: daysFromNow(120), value: 46000 },
    { id: 'a_4', name: 'Livestream cameras (3) and switcher', category: 'Audio/Visual', location: 'Media booth', serviceDue: daysFromNow(200), value: 14500 },
    { id: 'a_5', name: 'Property insurance policy', category: 'Insurance', location: 'Office', serviceDue: daysFromNow(74), insuranceRenewal: daysFromNow(74), value: 0 },
    { id: 'a_6', name: 'Grand piano (Yamaha C3)', category: 'Instrument', location: 'Sanctuary', serviceDue: daysFromNow(30), value: 38000 },
  ]

  const staff: Staff[] = [
    { id: 's_1', name: 'Rev. Dr. Marcus Ellison', title: 'Senior Pastor', type: 'employee', ministryIds: [], bgCheck: 'clear', bgCheckDate: '2025-02-10', trainings: ['Safeguarding', 'Financial Oversight'], hoursThisMonth: 168, email: 'pastor@graceharborcc.org', startDate: '2010-03-01' },
    { id: 's_2', name: 'Danielle Carter', title: 'Executive Administrator', type: 'employee', ministryIds: [], bgCheck: 'clear', bgCheckDate: '2025-02-10', trainings: ['Safeguarding', 'HR Basics'], hoursThisMonth: 160, email: 'danielle@graceharborcc.org', startDate: '2016-08-15' },
    { id: 's_3', name: 'Jerome Robinson', title: 'Finance Officer', type: 'part-time', ministryIds: [], bgCheck: 'clear', bgCheckDate: '2024-11-02', trainings: ['Financial Oversight'], hoursThisMonth: 80, email: 'finance@graceharborcc.org', startDate: '2018-01-10' },
    { id: 's_4', name: 'Keisha Mitchell', title: 'Church Secretary', type: 'employee', ministryIds: [], bgCheck: 'clear', bgCheckDate: '2025-05-20', trainings: ['Safeguarding'], hoursThisMonth: 160, email: 'office@graceharborcc.org', startDate: '2019-06-03' },
    { id: 's_5', name: 'Darnell Harris', title: 'Youth Pastor', type: 'part-time', ministryIds: [ministryIds.youth], bgCheck: 'clear', bgCheckDate: '2025-01-15', trainings: ['Safeguarding', 'Youth Protection'], hoursThisMonth: 90, email: 'youth@graceharborcc.org', startDate: '2021-09-01' },
    { id: 's_6', name: 'Alicia Jenkins', title: 'Music Director', type: 'part-time', ministryIds: [ministryIds.worship], bgCheck: 'clear', bgCheckDate: '2024-09-30', trainings: ['Safeguarding'], hoursThisMonth: 70, email: 'music@graceharborcc.org', startDate: '2014-02-01' },
    { id: 's_7', name: 'Maurice Freeman', title: 'Facilities Contractor', type: 'contractor', ministryIds: [], bgCheck: 'clear', bgCheckDate: '2025-03-12', trainings: [], hoursThisMonth: 42, email: 'maurice@example.com', startDate: '2022-04-01' },
    { id: 's_8', name: 'Tamika Washington', title: 'Youth Volunteer', type: 'volunteer', ministryIds: [ministryIds.youth], bgCheck: 'pending', trainings: [], hoursThisMonth: 12, email: 'tamika@example.com', startDate: daysFromNow(-18) },
    { id: 's_9', name: 'Reginald Coleman', title: 'Van Driver', type: 'volunteer', ministryIds: [ministryIds.transport], bgCheck: 'expired', bgCheckDate: '2023-09-01', trainings: ['Defensive Driving'], hoursThisMonth: 20, email: 'reginald@example.com', startDate: '2020-01-12' },
    { id: 's_10', name: 'Vanessa Brooks', title: 'Food Pantry Coordinator', type: 'volunteer', ministryIds: [ministryIds.outreach], bgCheck: 'clear', bgCheckDate: '2025-04-04', trainings: ['Food Safety', 'Safeguarding'], hoursThisMonth: 34, email: 'vanessa@example.com', startDate: '2019-10-10' },
    { id: 's_11', name: 'Calvin Price', title: 'Livestream Lead', type: 'volunteer', ministryIds: [ministryIds.media], bgCheck: 'clear', bgCheckDate: '2025-06-01', trainings: [], hoursThisMonth: 24, email: 'calvin@example.com', startDate: '2021-03-14' },
    { id: 's_12', name: 'Felicia Bryant', title: 'Greeter Team Lead', type: 'volunteer', ministryIds: [ministryIds.hospitality], bgCheck: 'clear', bgCheckDate: '2025-02-18', trainings: ['Safeguarding'], hoursThisMonth: 16, email: 'felicia@example.com', startDate: '2017-07-07' },
  ]

  const shifts: Shift[] = []
  const shiftRoles: Record<string, string[]> = { [ministryIds.hospitality]: ['Greeter', 'Welcome desk'], [ministryIds.media]: ['Camera', 'Sound'], [ministryIds.transport]: ['Van driver'], [ministryIds.outreach]: ['Pantry intake', 'Pantry stocking'], [ministryIds.youth]: ['Small group leader'] }
  for (let w = 0; w < 4; w++) {
    const date = nextSunday(w)
    Object.entries(shiftRoles).forEach(([min, roles]) => roles.forEach((role) => {
      const filled = rand() < 0.65
      const s = staff.filter((x) => x.ministryIds.includes(min) && x.bgCheck === 'clear')
      shifts.push({ id: `sh_${shifts.length + 1}`, ministryId: min, date, role, staffId: filled && s.length ? pick(s).id : undefined, status: filled && s.length ? (rand() < 0.6 ? 'confirmed' : 'filled') : 'open' })
    }))
  }

  const expenses: Expense[] = [
    { id: 'x_1', ministryId: ministryIds.outreach, vendor: 'Costco Business', amount: 1830, category: 'Supplies', status: 'paid', requestedById: 'm_7', date: daysFromNow(-6), note: 'Health Fair supplies and water' },
    { id: 'x_2', ministryId: ministryIds.worship, vendor: 'Sweetwater', amount: 2140, category: 'Equipment', status: 'requested', requestedById: staffIds.music, date: daysFromNow(-1), note: 'Replacement wireless microphones (4)' },
    { id: 'x_3', ministryId: ministryIds.youth, vendor: 'Kings Dominion Group Sales', amount: 1560, category: 'Events', status: 'requested', requestedById: staffIds.youth, date: daysFromNow(-2), note: 'Fall youth trip deposit for 40 students' },
    { id: 'x_4', ministryId: ministryIds.hospitality, vendor: 'Sysco', amount: 3200, category: 'Food', status: 'requested', requestedById: 'm_8', date: daysFromNow(0), note: 'Thanksgiving Community Dinner food order' },
    { id: 'x_5', ministryId: ministryIds.transport, vendor: 'Richmond Auto Service', amount: 890, category: 'Vehicle', status: 'approved', requestedById: 'm_13', date: daysFromNow(-4), note: 'Van 90k service' },
    { id: 'x_6', ministryId: ministryIds.media, vendor: 'Vimeo', amount: 900, category: 'Software', status: 'paid', requestedById: 'm_14', date: daysFromNow(-30), note: 'Annual livestream plan' },
    { id: 'x_7', ministryId: ministryIds.education, vendor: 'LifeWay', amount: 420, category: 'Curriculum', status: 'paid', requestedById: 'm_10', date: daysFromNow(-22), note: 'Fall Bible study books' },
    { id: 'x_8', ministryId: ministryIds.seniors, vendor: 'Chicken & Co. Catering', amount: 450, category: 'Food', status: 'approved', requestedById: 'm_9', date: daysFromNow(-3), note: 'Senior Saints luncheon' },
  ]

  const budgets: BudgetLine[] = []
  ministries.forEach((m) => {
    ;['Programs', 'Supplies', 'Events', 'Equipment'].forEach((c, i) => {
      const planned = Math.round((m.annualBudget / 12) * [0.5, 0.2, 0.2, 0.1][i])
      budgets.push({ id: `b_${budgets.length + 1}`, ministryId: m.id, category: c, planned, actual: Math.round(planned * (0.55 + rand() * 0.75)) })
    })
  })

  const care: CareRequest[] = [
    { id: 'c_1', kind: 'prayer', memberId: 'm_20', name: 'Monique Hayes', contact: 'monique.hayes@example.com', text: 'Please pray for my mother, who is in VCU hospital after a fall.', confidential: false, assigneeId: staffIds.pastor, status: 'assigned', date: daysFromNow(-1), updates: [] },
    { id: 'c_2', kind: 'pastoral', memberId: 'm_22', name: 'Andre Powell', contact: '(804) 555-0144', text: 'Would like to speak with Pastor about a family matter. Evenings are best.', confidential: true, assigneeId: staffIds.pastor, status: 'new', date: daysFromNow(0), updates: [] },
    { id: 'c_3', kind: 'assistance', name: 'Walk-in neighbor', contact: '(804) 555-0177', text: 'Behind on electric bill after a job loss. Dominion shutoff notice dated next Friday.', confidential: true, assigneeId: 'm_7', status: 'in-progress', date: daysFromNow(-2), updates: [{ date: daysFromNow(-1), note: 'Benevolence request submitted for $340. Awaiting Finance approval.' }] },
    { id: 'c_4', kind: 'prayer', memberId: 'm_31', name: 'Patrice Ford', contact: 'patrice.ford@example.com', text: 'Praise report: surgery went well. Thank you for praying.', confidential: false, status: 'closed', date: daysFromNow(-5), updates: [{ date: daysFromNow(-4), note: 'Shared in Wednesday prayer meeting with permission.' }] },
    { id: 'c_5', kind: 'pastoral', memberId: 'm_40', name: 'Simone Butler', contact: 'simone.butler@example.com', text: 'Grief support after losing her father last month.', confidential: true, assigneeId: staffIds.pastor, status: 'in-progress', date: daysFromNow(-12), updates: [{ date: daysFromNow(-10), note: 'Pastoral visit completed. Follow-up call in two weeks.' }] },
  ]

  const services: ServiceRequest[] = [
    { id: 'sv_1', program: 'food', name: 'Gloria Nguyen', contact: '(804) 555-0161', text: 'Family of five, need groceries this week.', status: 'fulfilled', coordinatorId: 's_10', date: daysFromNow(-3), householdSize: 5, outcome: 'Pantry box provided Saturday' },
    { id: 'sv_2', program: 'housing', name: 'Victor Ortiz', contact: 'victor.o@example.com', text: 'Eviction notice; looking for emergency rental assistance referrals.', status: 'referred', coordinatorId: 'm_7', date: daysFromNow(-4), householdSize: 3, outcome: 'Referred to HOME of VA and Richmond DSS' },
    { id: 'sv_3', program: 'employment', name: 'Luis Reyes', contact: '(804) 555-0188', text: 'Looking for warehouse or driving work; has CDL Class B.', status: 'in-progress', coordinatorId: 'm_7', date: daysFromNow(-6) },
    { id: 'sv_4', program: 'transportation', name: 'Ruth Chambers', contact: '(804) 555-0122', text: 'Needs a ride to dialysis Tuesday and Thursday mornings.', status: 'assigned', coordinatorId: 'm_13', date: daysFromNow(-1) },
    { id: 'sv_5', program: 'senior', name: 'Samuel Okafor', contact: '(804) 555-0133', text: 'Wellness check requested by neighbor; lives alone.', status: 'new', date: daysFromNow(0) },
    { id: 'sv_6', program: 'emergency', name: 'Carmen Adeyemi', contact: 'carmen.a@example.com', text: 'House fire Tuesday; needs clothing for two children (sizes 8 and 12).', status: 'in-progress', coordinatorId: 's_10', date: daysFromNow(-2), householdSize: 3 },
    { id: 'sv_7', program: 'food', name: 'Daniel Mensah', contact: '(804) 555-0109', text: 'Monthly pantry pickup.', status: 'fulfilled', coordinatorId: 's_10', date: daysFromNow(-10), householdSize: 2, outcome: 'Pantry box provided' },
  ]

  const announcements: Announcement[] = [
    { id: 'an_1', title: 'Community Health Fair registration is open', body: 'Join us on the front lawn for free screenings, flu shots and healthy cooking demos. Register online or at the welcome desk.', channels: ['bulletin', 'website', 'email'], status: 'approved', date: daysFromNow(2), audience: 'All members and community list', authorId: staffIds.secretary },
    { id: 'an_2', title: 'Thanksgiving Dinner volunteers needed', body: 'We need 40 volunteers across cooking, serving and cleanup. Sign up through the Serve page.', channels: ['bulletin', 'sms'], status: 'draft', date: daysFromNow(5), audience: 'Members with volunteer interests', authorId: staffIds.secretary },
    { id: 'an_3', title: 'Choir Anniversary Concert tickets', body: 'Free tickets available now. Reserve your seat for the 25th anniversary concert.', channels: ['website', 'email', 'sms'], status: 'scheduled', date: daysFromNow(7), audience: 'All contacts with consent', authorId: staffIds.music },
    { id: 'an_4', title: 'Sunday parking change', body: 'The west lot is closed for restriping this Sunday. Please use the Hull Street entrance.', channels: ['bulletin', 'sms', 'website'], status: 'sent', date: daysFromNow(-7), audience: 'All members', authorId: staffIds.admin },
  ]
  const campaigns = [
    { id: 'cp_1', name: 'October newsletter', channel: 'email' as const, segment: 'All contacts with email consent', recipients: 612, status: 'sent' as const, sentAt: daysFromNow(-12), opens: 341, clicks: 97 },
    { id: 'cp_2', name: 'Health Fair reminder', channel: 'sms' as const, segment: 'Registered attendees + community list', recipients: 284, status: 'approved' as const },
    { id: 'cp_3', name: 'Thanksgiving outreach campaign', channel: 'email' as const, segment: 'Neighbors within 2 miles (community list)', recipients: 1140, status: 'draft' as const },
    { id: 'cp_4', name: 'Visitor welcome series (automated)', channel: 'email' as const, segment: 'First-time visitors, last 30 days', recipients: 8, status: 'sent' as const, sentAt: daysFromNow(-1), opens: 6, clicks: 3 },
  ]
  const documents = [
    { id: 'd_1', title: 'Facility Use Policy (2026)', category: 'policy' as const, updated: daysFromNow(-40), ownerId: staffIds.admin, size: '240 KB' },
    { id: 'd_2', title: 'Deacon Board Minutes, September', category: 'minutes' as const, updated: daysFromNow(-20), ownerId: staffIds.secretary, size: '88 KB' },
    { id: 'd_3', title: 'Volunteer Application and Background Check Consent', category: 'form' as const, updated: daysFromNow(-120), ownerId: staffIds.admin, size: '120 KB' },
    { id: 'd_4', title: 'Commercial Kitchen Rental Agreement', category: 'agreement' as const, updated: daysFromNow(-33), ownerId: staffIds.admin, size: '156 KB' },
    { id: 'd_5', title: 'Benevolence Fund Guidelines', category: 'policy' as const, updated: daysFromNow(-200), ownerId: staffIds.finance, size: '64 KB' },
    { id: 'd_6', title: 'Q3 Financial Summary for Leadership', category: 'report' as const, updated: daysFromNow(-15), ownerId: staffIds.finance, size: '410 KB' },
    { id: 'd_7', title: 'Welcome Letter Template', category: 'letter' as const, updated: daysFromNow(-60), ownerId: staffIds.secretary, size: '32 KB' },
    { id: 'd_8', title: 'Child and Youth Safeguarding Policy', category: 'policy' as const, updated: daysFromNow(-90), ownerId: staffIds.admin, size: '198 KB' },
  ]
  const meetings = [
    { id: 'mg_1', title: 'Deacon Board Meeting', date: daysFromNow(2), attendees: ['Pastor Ellison', 'Danielle Carter', 'Jerome Robinson', 'Deacon Hayes', 'Deacon Powell'], agenda: ['Roof repair bid approval ($4,800)', 'Q3 financial summary', 'Thanksgiving dinner budget', 'Volunteer background-check policy renewals'], notes: '', actions: [{ text: 'Circulate roofing bids', ownerId: staffIds.admin, done: true }, { text: 'Prepare Q3 summary slides', ownerId: staffIds.finance, done: false }] },
    { id: 'mg_2', title: 'Ministry Leaders Huddle', date: daysFromNow(-5), attendees: ['Danielle Carter', 'All ministry leaders'], agenda: ['Fall calendar conflicts', 'Health Fair volunteer needs', 'Bulletin deadline change'], notes: 'Bulletin content now due Wednesdays at noon. Health Fair needs 12 more volunteers.', actions: [{ text: 'Post Health Fair volunteer shifts', ownerId: 'm_7', done: true }, { text: 'Confirm Hall for Senior Luncheon', ownerId: 'm_9', done: true }] },
  ]

  const partners = [
    { id: 'p_1', name: 'Bon Secours Richmond Community Hospital', type: 'nonprofit' as const, contact: 'community.health@example.org', status: 'active' as const, notes: 'Health Fair screenings partner; interested in quarterly clinics.' },
    { id: 'p_2', name: 'Virginia Credit Union', type: 'sponsor' as const, contact: 'outreach@example.com', status: 'active' as const, notes: 'Financial literacy workshop sponsor ($900).' },
    { id: 'p_3', name: 'Amazon RIC2 Fulfillment', type: 'employer' as const, contact: 'hiring.ric2@example.com', status: 'prospect' as const, notes: 'Warehouse hiring event on campus proposed for November.' },
    { id: 'p_4', name: 'Richmond Office of Community Wealth Building', type: 'agency' as const, contact: 'ocwb@example.gov', status: 'active' as const, notes: 'Workforce referral partner; monthly reporting required.' },
    { id: 'p_5', name: 'Feed More', type: 'nonprofit' as const, contact: 'agency.relations@example.org', status: 'active' as const, notes: 'Food pantry supply partner.' },
    { id: 'p_6', name: 'Commonwealth Roofing', type: 'vendor' as const, contact: 'bids@example.com', status: 'active' as const, notes: 'Sanctuary roof repair bid: $4,800.' },
  ]
  const businesses = [
    { id: 'bz_1', name: 'Sweet Grace Catering', ownerMemberId: 'm_15', category: 'Catering', phone: '(804) 555-0150', website: 'sweetgracecatering.example.com', approved: true },
    { id: 'bz_2', name: 'Harris HVAC & Plumbing', ownerMemberId: 'm_16', category: 'Home services', phone: '(804) 555-0151', website: '', approved: true },
    { id: 'bz_3', name: 'Mitchell Tax & Bookkeeping', ownerMemberId: 'm_17', category: 'Professional services', phone: '(804) 555-0152', website: 'mitchelltax.example.com', approved: true },
    { id: 'bz_4', name: 'Crowned Beauty Studio', ownerMemberId: 'm_18', category: 'Beauty', phone: '(804) 555-0153', website: '', approved: true },
    { id: 'bz_5', name: 'Brooks Family Daycare', ownerMemberId: 'm_19', category: 'Childcare', phone: '(804) 555-0154', website: '', approved: false },
  ]
  const grants = [
    { id: 'gr_1', name: 'Community Food Access Grant', funder: 'Robins Foundation', amount: 25000, deadline: daysFromNow(21), status: 'applying' as const, ownerId: staffIds.admin },
    { id: 'gr_2', name: 'Youth Workforce Readiness', funder: 'Virginia Dept. of Labor', amount: 60000, deadline: daysFromNow(48), status: 'identified' as const, ownerId: staffIds.youth },
    { id: 'gr_3', name: 'Historic Sanctuary Roof Preservation', funder: 'Richmond Community Foundation', amount: 40000, deadline: daysFromNow(-30), status: 'submitted' as const, ownerId: staffIds.admin },
    { id: 'gr_4', name: 'Senior Transportation Pilot', funder: 'Senior Connections', amount: 12000, deadline: daysFromNow(-120), status: 'awarded' as const, ownerId: 'm_9' },
  ]
  const programs = [
    { id: 'pg_1', name: 'Pathways to Work (CDL prep)', partnerId: 'p_4', kind: 'workforce' as const, enrolled: 14, completed: 9, placed: 6, nextCohort: daysFromNow(35) },
    { id: 'pg_2', name: 'Financial Literacy Series', partnerId: 'p_2', kind: 'financial' as const, enrolled: 38, completed: 22, nextCohort: daysFromNow(12) },
    { id: 'pg_3', name: 'Teen Tech Saturdays', kind: 'youth' as const, enrolled: 26, completed: 18, nextCohort: daysFromNow(6) },
    { id: 'pg_4', name: 'Adult Literacy Tutoring', kind: 'education' as const, enrolled: 11, completed: 4, nextCohort: daysFromNow(5) },
  ]

  const drafts: AgentDraft[] = [
    { id: 'dr_1', agentId: 'office', title: 'Weekly bulletin, this Sunday', kind: 'Bulletin', module: 'office', reviewerRole: 'secretary', status: 'pending', createdAt: daysFromNow(0), body: 'GRACE HARBOR COMMUNITY CHURCH\nSunday Bulletin\n\nWELCOME\nWe are glad you are here. First-time guests, please stop by the welcome desk for a gift.\n\nTHIS WEEK\n- Wednesday Bible Study, 7:00 PM, Classroom B (James, chapter 3)\n- Youth Friday Night Live, Friday 6:30 PM, Youth Center\n- Deacon Board Meeting, Tuesday 7:00 PM\n\nCOMING UP\n- New Member Orientation begins next Sunday at 9:45 AM\n- Senior Saints Luncheon with Medicare briefing\n- Community Health Fair on the front lawn: register at the welcome desk\n\nGIVING\nGive online at graceharborcc.org/give or text GIVE to (804) 555-0100.' },
    { id: 'dr_2', agentId: 'finance', title: 'Weekly giving summary', kind: 'Report', module: 'finance', reviewerRole: 'finance', status: 'pending', createdAt: daysFromNow(0), body: 'Giving summary for the week ending Sunday.\n\nGeneral Fund share: approx. 72%\nBuilding Fund: approx. 13%\n\nFlags for review:\n- 3 online gifts of $500 or more from new donors (verify fund designation)\n- Benevolence Fund request of $340 pending (care request c_3)\n- Worship equipment request of $2,140 exceeds the Equipment line for the month' },
    { id: 'dr_3', agentId: 'member', title: 'Welcome letters for 8 first-time visitors', kind: 'Letters', module: 'members', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(0), body: 'Dear {first name},\n\nThank you for worshiping with us at Grace Harbor this Sunday. We hope you felt at home. If there is anything we can pray about with you, or if you would like to learn more about our ministries, simply reply to this message or stop by the welcome desk next Sunday.\n\nOur New Member Orientation begins next Sunday at 9:45 AM in Classroom A. You are warmly invited.\n\nGrace and peace,\nRev. Dr. Marcus Ellison, Senior Pastor' },
    { id: 'dr_4', agentId: 'event', title: 'Health Fair logistics checklist', kind: 'Checklist', module: 'events', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(-1), body: 'Community Health Fair (19 days out)\n\nReserved: Front Lawn & Pavilion, 7:00 AM to 3:00 PM\nRegistrations: 86 (capacity 300)\n\nOpen items:\n- 12 volunteer shifts still open (intake, parking, cleanup)\n- Tent and table rental quote pending from vendor\n- Confirm Bon Secours arrival time and power needs\n- Reminder SMS to registrants scheduled for 2 days prior (needs approval)' },
    { id: 'dr_5', agentId: 'outreach', title: 'Thanksgiving outreach email campaign', kind: 'Campaign', module: 'comms', reviewerRole: 'secretary', status: 'pending', createdAt: daysFromNow(-1), body: 'Subject: You have a seat at our table\n\nNeighbor,\n\nOn the Saturday before Thanksgiving, Grace Harbor is opening the Fellowship Hall for a free community dinner from 1:00 to 4:00 PM. No registration needed. Bring your family, bring a friend.\n\nIf you would rather help, we need 40 volunteers for cooking, serving and cleanup. Sign up at graceharborcc.org/serve.\n\nSee you at the table.' },
    { id: 'dr_6', agentId: 'facilities', title: 'Work order: sanctuary roof leak', kind: 'Work order', module: 'facilities', reviewerRole: 'admin', status: 'approved', createdAt: daysFromNow(-3), body: 'Vendor: Commonwealth Roofing\nScope: Locate and repair leak above choir loft; inspect flashing on east gable.\nBid: $4,800 (board approval required above $2,500)\nSchedule: Tarp installed; permanent repair pending approval.' },
    { id: 'dr_7', agentId: 'member', title: 'Members with no contact in 90+ days', kind: 'List', module: 'members', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(0), body: 'Active members have had no recorded contact in more than 90 days. Suggested: assign to deacons for a check-in call this week. The list is available in the Members module under the "Needs follow-up" filter.' },
    { id: 'dr_8', agentId: 'facilities', title: 'Van insurance renewal in 41 days', kind: 'Reminder', module: 'facilities', reviewerRole: 'admin', status: 'pending', createdAt: daysFromNow(0), body: 'The 15-passenger van policy renews in 41 days. Request updated quotes from two carriers and confirm the driver list (one driver has an expired background check).' },
  ]

  const approvals: Approval[] = [
    { id: 'ap_1', kind: 'expense', title: 'Replacement wireless microphones (4)', requester: 'Alicia Jenkins', amount: 2140, status: 'pending', createdAt: daysFromNow(-1), relatedId: 'x_2', relatedModule: 'finance' },
    { id: 'ap_2', kind: 'expense', title: 'Fall youth trip deposit', requester: 'Darnell Harris', amount: 1560, status: 'pending', createdAt: daysFromNow(-2), relatedId: 'x_3', relatedModule: 'finance' },
    { id: 'ap_3', kind: 'expense', title: 'Thanksgiving dinner food order', requester: 'Hospitality', amount: 3200, status: 'pending', createdAt: daysFromNow(0), relatedId: 'x_4', relatedModule: 'finance' },
    { id: 'ap_4', kind: 'event', title: 'Thanksgiving Community Dinner (proposal)', requester: 'Hospitality & Greeters', amount: 3200, status: 'pending', createdAt: daysFromNow(-1), relatedId: 'e_6', relatedModule: 'events' },
    { id: 'ap_5', kind: 'reservation', title: 'Fellowship Hall: Southside Neighborhood Assoc.', requester: 'External', amount: 350, status: 'pending', createdAt: daysFromNow(-2), relatedId: 'rs_1', relatedModule: 'facilities' },
    { id: 'ap_6', kind: 'reservation', title: 'Sanctuary: Thompson & Reyes wedding', requester: 'Members', status: 'pending', createdAt: daysFromNow(-3), relatedId: 'rs_2', relatedModule: 'facilities' },
    { id: 'ap_7', kind: 'reservation', title: 'Classroom A: Richmond Literacy Partners', requester: 'External', amount: 60, status: 'pending', createdAt: daysFromNow(0), relatedId: 'rs_3', relatedModule: 'facilities' },
    { id: 'ap_8', kind: 'communication', title: 'Thanksgiving volunteers SMS', requester: 'Church Secretary', status: 'pending', createdAt: daysFromNow(0), relatedId: 'an_2', relatedModule: 'comms' },
    { id: 'ap_9', kind: 'hire', title: 'Youth volunteer: Tamika Washington (background check pending)', requester: 'Youth Ministry', status: 'pending', createdAt: daysFromNow(-4), relatedId: 's_8', relatedModule: 'people' },
  ]

  const tasks: Task[] = [
    { id: 't_1', title: 'Call 8 first-time visitors from Sunday', assigneeId: 'm_8', due: daysFromNow(2), status: 'todo', module: 'members', priority: 'high' },
    { id: 't_2', title: 'Reconcile last Sunday deposit with bank', assigneeId: 'm_3', due: daysFromNow(1), status: 'doing', module: 'finance', priority: 'high' },
    { id: 't_3', title: 'Send Health Fair reminder to registrants', assigneeId: 'm_4', due: daysFromNow(17), status: 'todo', module: 'comms', priority: 'normal' },
    { id: 't_4', title: 'Get two roofing quotes for comparison', assigneeId: 'm_2', due: daysFromNow(3), status: 'doing', module: 'facilities', priority: 'high' },
    { id: 't_5', title: 'Renew Reginald Coleman background check', assigneeId: 'm_2', due: daysFromNow(5), status: 'todo', module: 'people', priority: 'high' },
    { id: 't_6', title: 'Draft Q3 summary slides for Deacon Board', assigneeId: 'm_3', due: daysFromNow(2), status: 'todo', module: 'reports', priority: 'normal' },
    { id: 't_7', title: 'Submit Robins Foundation food access grant', assigneeId: 'm_2', due: daysFromNow(21), status: 'todo', module: 'partners', priority: 'normal' },
    { id: 't_8', title: 'Confirm caterer for Senior Saints luncheon', assigneeId: 'm_9', due: daysFromNow(4), status: 'done', module: 'events', priority: 'low' },
    { id: 't_9', title: 'Post 12 open Health Fair volunteer shifts', assigneeId: 'm_7', due: daysFromNow(-1), status: 'done', module: 'people', priority: 'normal' },
    { id: 't_10', title: 'Welcome-desk supplies restock', assigneeId: 'm_8', due: daysFromNow(6), status: 'todo', module: 'office', priority: 'low' },
  ]

  const sermons = [
    { id: 'sm_1', title: 'Faith That Works', speaker: 'Rev. Dr. Marcus Ellison', date: daysFromNow(-7), series: 'The Book of James', scripture: 'James 2:14-26', duration: '42:18', description: 'Faith is proven in the ordinary work of love for our neighbors.', views: 1240 },
    { id: 'sm_2', title: 'Taming the Tongue', speaker: 'Rev. Dr. Marcus Ellison', date: daysFromNow(-14), series: 'The Book of James', scripture: 'James 3:1-12', duration: '38:55', description: 'Our words build or burn. A message on speech, leadership and restraint.', views: 980 },
    { id: 'sm_3', title: 'Trials and Joy', speaker: 'Rev. Dr. Marcus Ellison', date: daysFromNow(-21), series: 'The Book of James', scripture: 'James 1:2-12', duration: '41:02', description: 'How endurance is formed, and why James calls it joy.', views: 1105 },
    { id: 'sm_4', title: 'The Harvest Is Plentiful', speaker: 'Pastor Darnell Harris', date: daysFromNow(-28), series: 'Youth Sunday', scripture: 'Matthew 9:35-38', duration: '29:40', description: 'Youth Sunday message on serving the neighborhood we are planted in.', views: 1620 },
    { id: 'sm_5', title: 'A Table for the Stranger', speaker: 'Rev. Dr. Marcus Ellison', date: daysFromNow(-35), series: 'Hospitality', scripture: 'Luke 14:12-14', duration: '40:11', description: 'Why Grace Harbor opens its doors to the neighborhood first.', views: 870 },
    { id: 'sm_6', title: 'Rebuilding the Walls', speaker: 'Rev. Dr. Marcus Ellison', date: daysFromNow(-42), series: 'Nehemiah', scripture: 'Nehemiah 2:17-20', duration: '44:30', description: 'Vision, opposition and the work of restoration in a community.', views: 1010 },
  ]

  const attendance: Attendance[] = []
  for (let w = 1; w <= 26; w++) {
    const d = new Date(); d.setDate(d.getDate() - (d.getDay() + 7 * w))
    const date = d.toISOString().slice(0, 10)
    attendance.push({ id: `at_${w}_a`, date, service: '8:30 AM', count: between(110, 160), firstTime: between(0, 4) })
    attendance.push({ id: `at_${w}_b`, date, service: '11:00 AM', count: between(240, 330), firstTime: between(2, 9) })
  }

  const audit = [
    { id: 'au_1', at: `${daysFromNow(0)} 07:12`, who: 'Facilities Agent', action: 'Created reminder', target: 'Van insurance renewal' },
    { id: 'au_2', at: `${daysFromNow(0)} 07:10`, who: 'Finance Agent', action: 'Drafted report', target: 'Weekly giving summary' },
    { id: 'au_3', at: `${daysFromNow(0)} 07:09`, who: 'Member Agent', action: 'Drafted letters', target: '8 first-time visitors' },
    { id: 'au_4', at: `${daysFromNow(-1)} 16:40`, who: 'Danielle Carter', action: 'Approved work order', target: 'Sanctuary roof leak' },
    { id: 'au_5', at: `${daysFromNow(-1)} 14:02`, who: 'Jerome Robinson', action: 'Reconciled deposit', target: 'Sunday batch 3' },
    { id: 'au_6', at: `${daysFromNow(-2)} 09:15`, who: 'Keisha Mitchell', action: 'Scheduled announcement', target: 'Choir Anniversary tickets' },
  ]

  return {
    version: 1,
    entered: false,
    role: 'pastor',
    currentMemberId: 'm_20',
    church: {
      name: 'Grace Harbor Community Church', shortName: 'Grace Harbor', tagline: 'A church for the neighborhood. A home for everyone.',
      pastor: 'Rev. Dr. Marcus Ellison', pastorTitle: 'Senior Pastor', address: '4120 Hull Street Road', city: 'Richmond, VA 23224', phone: '(804) 555-0100', email: 'hello@graceharborcc.org',
      services: [{ day: 'Sunday', time: '8:30 AM', label: 'Early Worship' }, { day: 'Sunday', time: '11:00 AM', label: 'Worship Celebration (livestreamed)' }, { day: 'Wednesday', time: '7:00 PM', label: 'Bible Study' }],
      founded: '1962', denomination: 'Baptist (independent)', website: 'graceharborcc.org',
    },
    settings: {
      tourDone: false, agentsEnabled: true, mfa: true, guideOn: true,
      integrations: [
        { id: 'stripe', name: 'Stripe (online giving)', status: 'connected' }, { id: 'qbo', name: 'QuickBooks Online', status: 'connected' }, { id: 'twilio', name: 'Twilio SMS', status: 'connected' },
        { id: 'gcal', name: 'Google Calendar', status: 'available' }, { id: 'mailchimp', name: 'Mailchimp', status: 'available' }, { id: 'gusto', name: 'Gusto payroll', status: 'available' },
        { id: 'checkr', name: 'Checkr background checks', status: 'connected' }, { id: 'vimeo', name: 'Vimeo livestream', status: 'connected' }, { id: 'planning', name: 'Planning Center import', status: 'planned' },
      ],
      tenants: [
        { id: 'tn_1', name: 'Grace Harbor Community Church', plan: 'Church Operations Pro', members: members.length, status: 'Pilot' },
        { id: 'tn_2', name: 'Church B (reserved)', plan: 'Essential Church', members: 0, status: 'Onboarding' },
        { id: 'tn_3', name: 'Church C (reserved)', plan: 'Church Enterprise', members: 0, status: 'Prospect' },
      ],
    },
    members, households, funds, gifts, budgets, expenses, ministries, events, registrations, rooms, reservations, maintenance, assets, staff, shifts, care, services,
    announcements, campaigns, documents, meetings, partners, businesses, grants, programs, drafts, approvals, tasks, sermons, attendance, audit,
  }
}
