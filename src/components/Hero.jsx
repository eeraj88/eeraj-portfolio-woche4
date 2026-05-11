import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import ParticleTextEffect from './ParticleTextEffect'

function Hero() {
  const { istDunkel } = useContext(ThemeContext)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
  }, [])

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">

      {/* Portfolio Badge */}
      <div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30"
        style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.6s ease-out 0.5s' }}
      >
        <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-red-500 font-medium px-4 py-2 border border-red-500/30 rounded-full" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Portfolio
        </span>
      </div>

      {/* Main Headline - Static */}
      <div
        className="relative z-30 text-center px-4 mb-8"
        style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(-30px)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s' }}
      >
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-tight"
          style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
        >
          HI ICH BIN
        </h1>
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-tight mt-2"
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

      {/* Canvas Particle Text Effect - Skills */}
      <div className="relative z-20 w-full max-w-4xl h-32 md:h-40">
        <ParticleTextEffect />
      </div>

      {/* CTA Buttons - Seitlich rechts/unten */}
      <div
        className="absolute bottom-12 right-8 md:right-16 flex flex-col gap-3 z-30"
        style={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateX(0)' : 'translateX(30px)', transition: 'all 0.8s ease-out 1s' }}
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

      {/* Floating Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(15)].map((_, i) => (
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
