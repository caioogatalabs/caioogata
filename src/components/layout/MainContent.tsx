'use client'

import { useNavigation } from '@/components/providers/NavigationProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'
import Hero from '@/components/hero/Hero'
import Intro from '@/components/sections/Intro'
import IntroCompact from '@/components/sections/IntroCompact'
import CLIMenu from '@/components/navigation/CLIMenu'
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
  const { content } = useLanguage()

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
          <div className="transition-opacity duration-200">
            {activeSection === 'projects' && <Projects />}
            {activeSection === 'about' && <About />}
            {activeSection === 'experience' && <Experience />}
            {activeSection === 'skills' && <Skills />}
            {activeSection === 'education' && <Education />}
            {activeSection === 'clients' && <Clients />}
            {activeSection === 'philosophy' && <Philosophy />}
            {activeSection === 'contact' && <Contact />}
          </div>

          {/* Keyboard hint */}
          <div className="mt-8 pt-4 border-t border-primary/10">
            <p className="text-xs font-mono text-neutral-500">
              {content.menu.legend}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Default view: Intro + Menu + Hero
  return (
    <div className="animate-fade-in">
      {/* Intro */}
      <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-8 w-full">
        <Intro />
      </div>

      {/* CLI Menu */}
      <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 pb-8 md:pb-12 w-full">
        <CLIMenu />
      </div>

      {/* Hero */}
      <Hero />
    </div>
  )
}
