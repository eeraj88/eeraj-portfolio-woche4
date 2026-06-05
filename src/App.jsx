import { useRef, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import GameTeaser from './components/GameTeaser'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollIndikator from './components/ScrollIndikator'
import PokemonBuddy from './components/PokemonBuddy'
import AINewsFeed from './components/AINewsFeed'
import CursorGlow from './components/CursorGlow'
import { ThemeProvider, useTheme } from './Context/ThemeContext'
import { LanguageProvider } from './Context/LanguageContext'

function AppContent() {
  const { istDunkel, toggleDarkMode } = useTheme()
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const contactsRef = useRef(null)

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

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

  return (
    <div className="min-h-screen transition-colors duration-500 relative overflow-hidden" style={{ background: 'var(--bg-1)', color: 'var(--text-1)' }} data-theme={istDunkel ? 'dark' : 'light'}>

      {/* Cyberpunk FX — grid, cursor, progress in both modes; vignette dark-only */}
      <div className="fx-grid"></div>
      {istDunkel && <div className="fx-vignette"></div>}
      <CursorGlow />
      <div id="scroll-progress"></div>

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

        <GameTeaser />

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
  )
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
