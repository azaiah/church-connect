import { Routes, Route } from 'react-router-dom'
import { DemoProvider } from '@/data/store'
import { ChurchLayout } from './ChurchLayout'
import { Home } from './pages/Home'
import { Visit } from './pages/Visit'
import { About } from './pages/About'
import { Sermons } from './pages/Sermons'
import { Events, EventDetail } from './pages/Events'
import { Give } from './pages/Give'
import { Prayer } from './pages/Prayer'
import { Serve } from './pages/Serve'
import { Resources } from './pages/Resources'
import { Contact } from './pages/Contact'
import { NotFound } from '@/pages/NotFound'

export default function ChurchApp() {
  return (
    <DemoProvider>
      <Routes>
        <Route element={<ChurchLayout />}>
          <Route index element={<Home />} />
          <Route path="visit" element={<Visit />} />
          <Route path="about" element={<About />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="give" element={<Give />} />
          <Route path="prayer" element={<Prayer />} />
          <Route path="serve" element={<Serve />} />
          <Route path="resources" element={<Resources />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </DemoProvider>
  )
}
