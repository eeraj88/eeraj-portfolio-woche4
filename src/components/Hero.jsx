import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function Hero() {
  const { istDunkel } = useContext(ThemeContext)
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const skills = [
    "SALES & CONSULTAT",
    "DIGITAL MARKETING",
    "E-COMMERCE",
    "WEB ENTWICKLUNG",
    "UI UX DESIGN",
    "AI & AUTOMATION"
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentSkillIndex(prev => (prev + 1) % skills.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Portfolio Badge */}
      <div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease-out 0.5s' }}
      >
        <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-red-500 font-medium px-4 py-2 border border-red-500/30 rounded-full" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Portfolio
        </span>
      </div>

      {/* Main Headline */}
      <div
        className="relative z-30 text-center px-4 mb-12"
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(-30px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s' }}
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-tight" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
          HI ICH BIN
        </h1>
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight mt-2"
          style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            background: 'linear-gradient(135deg, #ffffff 0%, #dc2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          EERAJ JAN
        </h1>
      </div>

      {/* Skills Carousel */}
      <div
        className="relative z-30 text-center mb-16 px-4"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.8s ease-out 0.8s' }}
      >
        <div
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-500"
          style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            textShadow: '0 0 40px rgba(220, 38, 38, 0.5)'
          }}
        >
          {skills[currentSkillIndex]}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {skills.map((_, index) => (
            <div
              key={index}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: currentSkillIndex === index ? '24px' : '8px',
                backgroundColor: currentSkillIndex === index ? '#dc2626' : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
        </div>
      </div>

      {/* CTA Buttons - Seitlich */}
      <div
        className="absolute bottom-12 right-8 md:right-16 flex flex-col gap-3 z-30"
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(30px)', transition: 'all 0.8s ease-out 1s' }}
      >
        <a
          href="#projects"
          className="group relative px-8 py-3 bg-red-600 text-white font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 hover:bg-red-700 whitespace-nowrap"
          style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 012-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            PROJEKTE
          </span>
        </a>

        <a
          href="#contact"
          className="px-8 py-3 border-2 border-red-600 text-red-500 font-semibold rounded-lg hover:bg-red-600/10 transition-all hover:scale-105 whitespace-nowrap"
          style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
        >
          KONTAKT
        </a>

        <a
          href="/lebenslauf.pdf"
          download="Eeraj_Lebenslauf.pdf"
          className="px-8 py-3 border-2 border-white/20 text-white/60 font-semibold rounded-lg hover:border-white/40 hover:text-white/80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
          style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CV
        </a>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: `rgba(220, 38, 38, ${0.3 + Math.random() * 0.4})`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
