'use client'

import { useNavigation } from '@/components/providers/NavigationProvider'
import Hero from '@/components/hero/Hero'
import Intro from '@/components/sections/Intro'
import IntroCompact from '@/components/sections/IntroCompact'
import CLIMenu from '@/components/navigation/CLIMenu'
import NavigationBar from '@/components/navigation/NavigationBar'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Education from '@/components/sections/Education'
import Clients from '@/components/sections/Clients'
import Philosophy from '@/components/sections/Philosophy'
import Contact from '@/components/sections/Contact'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

export default function MainContent() {
  const { activeSection } = useNavigation()

  // Initialize keyboard navigation (works even when section is open)
  useKeyboardNavigation()

  // When a section is active, show IntroCompact + section content
  if (activeSection) {
    return (
      <div className="animate-fade-in">
        {/* Compact Intro */}
        <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-6 w-full">
          <IntroCompact />
        </div>

        {/* Section Content */}
        <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 pb-8 md:pb-12 w-full">
          {/* Navigation bar at top */}
          <NavigationBar variant="primary" />

          <div className="transition-opacity duration-200 mt-8">
            {activeSection === 'projects' && <Projects />}
            {activeSection === 'about' && <About />}
            {activeSection === 'experience' && <Experience />}
            {activeSection === 'skills' && <Skills />}
            {activeSection === 'education' && <Education />}
            {activeSection === 'clients' && <Clients />}
            {activeSection === 'philosophy' && <Philosophy />}
            {activeSection === 'contact' && <Contact />}
          </div>

          {/* Interactive navigation bar */}
          <NavigationBar variant="primary" />
        </div>
      </div>
    )
  }

  // Default view: Intro + Menu + Hero
  return (
    <div className="animate-fade-in">
      {/* Intro */}
      <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-4 w-full">
        <Intro />
      </div>

      {/* CLI Menu — fixed min-height safe area so open menu never pushes Hero */}
      <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 min-h-[320px] pb-4 md:pb-5 w-full">
        <CLIMenu />
      </div>

      {/* Hero — hugs content vertically; close to menu block, no overlap */}
      <Hero />

      {/* Contact — below Hero, same flow and grid as rest of page */}
      <div className="max-w-content mx-0 px-6 pt-6 pb-8 md:px-12 md:pt-8 md:pb-10 lg:px-16 w-full">
        <Contact />
      </div>
    </div>
  )
}
