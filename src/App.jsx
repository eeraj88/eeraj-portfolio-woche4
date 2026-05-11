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
    return saved === null ? true : saved === 'true'
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
      <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${istDunkel ? 'bg-black text-white' : 'bg-[#fafafa] text-[#171717]'}`}>

        {istDunkel && (
          <>
            <div className="orb-cyan" style={{ top: '10%', left: '5%' }}></div>
            <div className="orb-orange" style={{ top: '60%', right: '10%' }}></div>
            <div className="orb-purple" style={{ bottom: '20%', left: '15%' }}></div>
            <div className="orb-cyan" style={{ top: '40%', right: '20%', width: '200px', height: '200px' }}></div>
            <div className="grid-pattern"></div>
            <div className="noise-overlay"></div>
          </>
        )}

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

          <div className={istDunkel ? 'bg-black' : 'bg-[#fafafa]'}>
            <Hero />
          </div>

          <div ref={aboutRef} className={istDunkel ? 'bg-black' : 'bg-white'}>
            <div className={istDunkel ? 'section-divider-dark' : 'section-divider-light'}></div>
            <About />
          </div>

          <div ref={skillsRef} className={istDunkel ? 'bg-black' : 'bg-[#fafafa]'}>
            <div className={istDunkel ? 'section-divider-dark' : 'section-divider-light'}></div>
            <Skills />
          </div>

          <div ref={projectsRef} className={istDunkel ? 'bg-black' : 'bg-white'}>
            <div className={istDunkel ? 'section-divider-dark' : 'section-divider-light'}></div>
            <Projects />
          </div>

          <div ref={testimonialsRef} className={istDunkel ? 'bg-zinc-900' : 'bg-[#f5f5f5]'}>
            <div className={istDunkel ? 'section-divider-dark' : 'section-divider-light'}></div>
            <Testimonials />
          </div>

          <div ref={contactsRef} className={istDunkel ? 'bg-black' : 'bg-[#fafafa]'}>
            <div className={istDunkel ? 'section-divider-dark' : 'section-divider-light'}></div>
            <Contact />
          </div>

          <div className={istDunkel ? 'bg-zinc-900' : 'bg-white'}>
            <Footer />
          </div>
        </div>

        <AINewsFeed />
        <PokemonBuddy />
      </div>
    </ThemeContext.Provider>
  )
}

export default App
