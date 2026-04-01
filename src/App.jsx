import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollIndikator from './components/ScrollIndikator'
import PokemonBuddy from './components/Pokemon'
import { ThemeContext } from './Context/ThemeContext'

function App() {
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)
  const contactsRef = useRef(null)

  const [istDunkel, setIstDunkel] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === null ? true : saved === 'true' // Default: Dark Mode
  })

  useEffect(() => {
    localStorage.setItem('darkMode', istDunkel)
  }, [istDunkel])

  const toggleDarkMode = () => {
    setIstDunkel(prev => !prev)
  }

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <ThemeContext.Provider value={{ istDunkel, toggleDarkMode }}>
      {/* Animierter Hintergrund */}
      <div className={`min-h-screen transition-colors duration-500 relative ${
        istDunkel ? 'animated-bg text-gray-100' : 'animated-bg-light text-gray-900'
      }`}>
        
        {/* Partikel Animation (nur im Dark Mode) */}
        {istDunkel && (
          <div className="particles">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          <ScrollIndikator />

          <Header
            istDunkel={istDunkel}
            toggleDarkMode={toggleDarkMode}
            aboutRef={aboutRef}
            skillsRef={skillsRef}
            projectsRef={projectsRef}
            contactsRef={contactsRef}
            scrollToSection={scrollToSection}
          />

          <Hero />

          <div ref={aboutRef}>
            <About />
          </div>

          <div ref={skillsRef}>
            <Skills />
          </div>

          <div ref={projectsRef}>
            <Projects />
          </div>

          <Testimonials />

          <div ref={contactsRef}>
            <Contact />
          </div>

          <Footer />
        </div>

        {/* Floating Widgets */}
        <PokemonBuddy />
      </div>
    </ThemeContext.Provider>
  )
}

export default App
