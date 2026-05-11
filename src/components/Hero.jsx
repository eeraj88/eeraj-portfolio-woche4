import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function Hero() {
  const { istDunkel } = useContext(ThemeContext)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const text = "HI ICH BIN EERAJ JAN"
  const skills = [
    "SALES & CONSULTAT",
    "DIGITAL MARKETING",
    "E-COMMERCE",
    "WEB ENTWICKLUNG",
    "UI / UX DESIGN",
    "AI & AUTOMATION"
  ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Staggered Text Reveal */}
        <div className="mb-8">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="inline-block text-5xl md:text-7xl lg:text-8xl font-bold text-white"
              style={{
                fontFamily: 'Space Grotesk, system-ui, sans-serif',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`,
                display: char === ' ' ? 'inline' : 'inline-block',
                textShadow: char !== ' ' ? '0 0 40px rgba(220, 38, 38, 0.3)' : 'none'
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Subtitle with Typing Effect */}
        <p
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s'
          }}
        >
          Digital Creative & Frontend Developer
        </p>

        {/* CTA Buttons */}
        <div
          className="flex gap-4 justify-center flex-wrap"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.4s'
          }}
        >
          <a
            href="#projects"
            className="group relative px-8 py-4 bg-red-600 text-white font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 hover:bg-red-700"
          >
            <span className="relative z-10">PROJEKTE</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="#contact"
            className="px-8 py-4 border-2 border-red-600 text-red-500 font-semibold rounded-lg hover:bg-red-600/10 transition-all hover:scale-105"
          >
            KONTAKT
          </a>
        </div>
      </div>

      {/* Infinite Marquee - Skills */}
      <div className="absolute bottom-0 left-0 right-0 py-6 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="relative overflow-hidden">
          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

          {/* Marquee Content */}
          <div className="flex animate-marquee whitespace-nowrap">
            {[...skills, ...skills, ...skills].map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-6"
                style={{
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              >
                <span className="text-sm text-gray-400">{skill}</span>
                <span className="text-red-500">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
