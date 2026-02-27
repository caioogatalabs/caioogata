'use client'

import { useState, useEffect, useContext } from 'react'
import { useNavigation } from '@/components/providers/NavigationProvider'
import { FirstVisitContext } from '@/components/providers/FirstVisitProvider'
import Intro from '@/components/sections/Intro'
import IntroCompact from '@/components/sections/IntroCompact'
import FirstVisitIntro from '@/components/sections/FirstVisitIntro'
import CLIMenu from '@/components/navigation/CLIMenu'
import NavigationBar from '@/components/navigation/NavigationBar'
import InlineToast from '@/components/ui/InlineToast'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Education from '@/components/sections/Education'
import Clients from '@/components/sections/Clients'
import Philosophy from '@/components/sections/Philosophy'
import Contact from '@/components/sections/Contact'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

const FIRST_VISIT_KEY = 'portfolio-intro-seen'

export default function MainContent() {
  const { activeSection } = useNavigation()
  const firstVisit = useContext(FirstVisitContext)
  const [showFirstVisitIntro, setShowFirstVisitIntro] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(FIRST_VISIT_KEY) === '1') {
      setShowFirstVisitIntro(false)
    }
  }, [])

  useEffect(() => {
    firstVisit?.setIsFirstVisitActive(showFirstVisitIntro)
  }, [showFirstVisitIntro, firstVisit])

  const handleFirstVisitContinue = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(FIRST_VISIT_KEY, '1')
    }
    setShowFirstVisitIntro(false)
  }

  // Initialize keyboard navigation (works even when section is open; intro captures its own keys)
  useKeyboardNavigation()

  // First visit intro: show once per session until user continues
  if (showFirstVisitIntro) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-8 w-full">
          <FirstVisitIntro onContinue={handleFirstVisitContinue} />
        </div>
      </div>
    )
  }

  // When a section is active, show IntroCompact + section content
  if (activeSection) {
    return (
      <div className="animate-fade-in">
        {/* Compact Intro */}
        <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-6 w-full">
          <div className="relative">
            <InlineToast />
            <IntroCompact />
          </div>
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

  // Default view: Intro + Menu + Contact
  return (
    <div className="animate-fade-in">
      {/* Intro */}
      <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-4 w-full">
        <Intro />
      </div>

      {/* CLI Menu — fixed min-height safe area */}
      <div className="max-w-content mx-0 px-6 md:px-12 lg:px-16 min-h-[320px] pb-4 md:pb-5 w-full">
        <CLIMenu />
      </div>
    </div>
  )
}
