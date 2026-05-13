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

  const toggleDarkMode = () => setIstDunkel(prev => !prev)

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Persist dark mode + data-theme for future light mode CSS vars
  useEffect(() => {
    localStorage.setItem('darkMode', istDunkel)
    document.documentElement.setAttribute('data-theme', istDunkel ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', istDunkel)
  }, [istDunkel])

  // Scroll progress bar
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

  // Reveal on scroll
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

  // Cursor glow
  useEffect(() => {
    const onMove = (e) => {
      const cursor = document.getElementById('cursor-glow')
      if (cursor) {
        cursor.style.left = e.clientX + 'px'
        cursor.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <ThemeContext.Provider value={{ istDunkel, toggleDarkMode }}>
      <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${
        istDunkel ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-[#171717]'
      }`}>

        {/* Cyberpunk FX — dark mode only */}
        {istDunkel && (
          <>
            <div className="fx-grid"></div>
            <div className="fx-vignette"></div>
            <div className="fx-cursor" id="cursor-glow"></div>
            <div id="scroll-progress"></div>
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

          <div ref={testimonialsRef}>
            <Testimonials />
          </div>

          <div ref={contactsRef}>
            <Contact />
          </div>

          <Footer />
        </div>

        <AINewsFeed />
        <PokemonBuddy />
      </div>
    </ThemeContext.Provider>
  )
}

export default App
