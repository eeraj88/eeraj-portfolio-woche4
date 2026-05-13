import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import ScrollIndikator from './components/ScrollIndikator'
import HeroNew from './components/HeroNew'
import AboutNew from './components/AboutNew'
import SkillsNew from './components/SkillsNew'
import ProjectsNew from './components/ProjectsNew'
import TestimonialsNew from './components/TestimonialsNew'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PokemonBuddy from './components/PokemonBuddy'
import AINewsFeed from './components/AINewsFeed'
import { ThemeContext } from './Context/ThemeContext'
import './styles/cyberpunk.css'

function App() {
  const [istDunkel] = useState(true) // Cyberpunk ist immer dark
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const contactsRef = useRef(null)

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Scroll Progress
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? window.scrollY / max : 0
      const bar = document.getElementById('scroll-progress')
      if (bar) bar.style.transform = `scaleX(${pct})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reveal Observer
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in')
          io.unobserve(en.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Cursor Glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      const cursor = document.getElementById('cursor-glow')
      if (cursor) {
        cursor.style.left = e.clientX + 'px'
        cursor.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <ThemeContext.Provider value={{ istDunkel, toggleDarkMode: () => {} }}>
      <div className="min-h-screen">
        {/* FX Layers */}
        <div className="fx-grid"></div>
        <div className="fx-vignette"></div>
        <div className="fx-cursor" id="cursor-glow"></div>

        {/* Scroll Progress */}
        <div id="scroll-progress"></div>

        {/* Content */}
        <div className="relative z-10">
          <ScrollIndikator />
          <Header
            istDunkel={istDunkel}
            toggleDarkMode={() => {}}
            aboutRef={aboutRef}
            skillsRef={skillsRef}
            projectsRef={projectsRef}
            testimonialsRef={testimonialsRef}
            contactsRef={contactsRef}
            scrollToSection={scrollToSection}
          />
          <main>
            <HeroNew />

            <div ref={aboutRef}>
              <AboutNew />
            </div>

            <div ref={skillsRef}>
              <SkillsNew />
            </div>

            <div ref={projectsRef}>
              <ProjectsNew />
            </div>

            <div ref={testimonialsRef}>
              <TestimonialsNew />
            </div>

            <div ref={contactsRef}>
              <Contact />
            </div>

            <Footer />
          </main>
        </div>

        {/* Overlays */}
        <AINewsFeed />
        <PokemonBuddy />
      </div>
    </ThemeContext.Provider>
  )
}

export default App
