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
import PokemonBuddy from './components/PokemonBuddy'
import AINewsFeed from './components/AINewsFeed'
import { ThemeContext } from './Context/ThemeContext'

function App() {
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const contactsRef = useRef(null)

  const [istDunkel, setIstDunkel] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === null ? true : saved === 'true' // Default: Dark Mode
  })

  useEffect(() => {
    localStorage.setItem('darkMode', istDunkel)
    if (istDunkel) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [istDunkel])

  const toggleDarkMode = () => {
    setIstDunkel(prev => !prev)
  }

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <ThemeContext.Provider value={{ istDunkel, toggleDarkMode }}>
      {/* Main Container */}
      <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${
        istDunkel 
          ? 'bg-[#0a192f] text-[#ccd6f6]' 
          : 'bg-white text-[#0a192f]'
      }`}>
        
        {/* Modern Background Effects */}
        {istDunkel && (
          <>
            {/* Floating Orbs */}
            <div className="orb-cyan" style={{ top: '10%', left: '5%' }}></div>
            <div className="orb-orange" style={{ top: '60%', right: '10%' }}></div>
            <div className="orb-purple" style={{ bottom: '20%', left: '15%' }}></div>
            <div className="orb-cyan" style={{ top: '40%', right: '20%', width: '200px', height: '200px' }}></div>
            
            {/* Grid Pattern Overlay */}
            <div className="grid-pattern"></div>
            
            {/* Noise Texture */}
            <div className="noise-overlay"></div>
            
            {/* Particle Animation */}
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
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </>
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
            testimonialsRef={testimonialsRef}
            contactsRef={contactsRef}
            scrollToSection={scrollToSection}
          />

          {/* Hero - Primary Background */}
          <div className={istDunkel ? 'bg-[#0a192f]' : 'bg-white'}>
            <Hero />
          </div>

          {/* About - Secondary Background */}
          <div ref={aboutRef} className={`${istDunkel ? 'bg-[#112240]' : 'bg-[#f8fafc]'}`}>
            <div className={`${istDunkel ? 'section-divider-dark' : 'section-divider-light'}`} />
            <About />
          </div>

          {/* Skills - Primary Background */}
          <div ref={skillsRef} className={istDunkel ? 'bg-[#0a192f]' : 'bg-white'}>
            <div className={`${istDunkel ? 'section-divider-dark' : 'section-divider-light'}`} />
            <Skills />
          </div>

          {/* Projects - Secondary Background */}
          <div ref={projectsRef} className={`${istDunkel ? 'bg-[#112240]' : 'bg-[#f8fafc]'}`}>
            <div className={`${istDunkel ? 'section-divider-dark' : 'section-divider-light'}`} />
            <Projects />
          </div>

          {/* Testimonials - Tertiary Background */}
          <div ref={testimonialsRef} className={`${istDunkel ? 'bg-[#1d3557]' : 'bg-[#f1f5f9]'}`}>
            <div className={`${istDunkel ? 'section-divider-dark' : 'section-divider-light'}`} />
            <Testimonials />
          </div>

          {/* Contact - Primary Background */}
          <div ref={contactsRef} className={istDunkel ? 'bg-[#0a192f]' : 'bg-white'}>
            <div className={`${istDunkel ? 'section-divider-dark' : 'section-divider-light'}`} />
            <Contact />
          </div>

          {/* Footer - Secondary Background */}
          <div className={`${istDunkel ? 'bg-[#112240]' : 'bg-[#f8fafc]'}`}>
            <Footer />
          </div>
        </div>

        {/* Floating Widgets */}
        <AINewsFeed />
        <PokemonBuddy />
      </div>
    </ThemeContext.Provider>
  )
}

export default App
