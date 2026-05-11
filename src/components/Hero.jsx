import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import ParticleTextEffect from './ParticleTextEffect'

function Hero() {
  const { istDunkel } = useContext(ThemeContext)
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Canvas Particle Text Effect */}
      <ParticleTextEffect />

      {/* Subtitle */}
      <p
        className="text-base md:text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed relative z-20"
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          opacity: showButtons ? 1 : 0,
          transform: showButtons ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out'
        }}
      >
        Digital Creative & Frontend Developer
      </p>

      {/* CTA Buttons */}
      <div
        className="flex gap-4 justify-center flex-wrap relative z-20"
        style={{
          opacity: showButtons ? 1 : 0,
          transform: showButtons ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out 0.2s'
        }}
      >
        <a
          href="#projects"
          className="group relative px-10 py-4 bg-red-600 text-white font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 hover:bg-red-700"
          style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
        >
          <span className="relative z-10">PROJEKTE</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>

        <a
          href="#contact"
          className="px-10 py-4 border-2 border-red-600 text-red-500 font-semibold rounded-lg hover:bg-red-600/10 transition-all hover:scale-105"
          style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
        >
          KONTAKT
        </a>
      </div>

      {/* Floating Particles Overlay */}
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
