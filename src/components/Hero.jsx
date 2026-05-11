import { useContext, useEffect, useState, useRef } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function Hero() {
  const { istDunkel } = useContext(ThemeContext)
  const [isVisible, setIsVisible] = useState(false)
  const [currentSkill, setCurrentSkill] = useState(0)

  const skills = [
    "SALES & CONSULTAT",
    "DIGITAL MARKETING",
    "E-COMMERCE",
    "WEB ENTWICKLUNG",
    "UI UX DESIGN",
    "AI & AUTOMATION"
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setCurrentSkill(prev => (prev + 1) % skills.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isVisible, skills.length])

  const text = "ICH BIN EERAJ JAN"

  // Partikel für jeden Buchstaben
  const renderParticleText = () => {
    return text.split('').map((char, index) => {
      if (char === ' ') {
        return <span key={index} className="inline-block w-12 md:w-16" />
      }

      return (
        <span
          key={index}
          className="inline-block relative"
          style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif'
          }}
        >
          {/* Haupt-Buchstabe */}
          <span
            className="text-5xl md:text-7xl lg:text-9xl font-bold text-white relative z-10 inline-block"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.5)',
              transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`,
              textShadow: '0 0 60px rgba(220, 38, 38, 0.8), 0 0 100px rgba(220, 38, 38, 0.4)',
              filter: isVisible ? 'blur(0px)' : 'blur(10px)'
            }}
          >
            {char}
          </span>

          {/* Partikel-Ring um jeden Buchstaben */}
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 bg-red-500 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: '2px',
                height: '2px',
                opacity: isVisible ? 0.6 : 0,
                transform: isVisible ? 'rotate(0deg) translateX(40px)' : 'rotate(0deg) translateX(20px)',
                transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15 + i * 0.05}s`,
                animation: `orbit 3s linear infinite ${index * 0.15 + i * 0.1}s`,
                boxShadow: '0 0 10px rgba(220, 38, 38, 0.8)'
              }}
            />
          ))}
        </span>
      )
    })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Tech Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/30 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-red-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '0.75s', transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-6xl">
        {/* HI Text */}
        <p
          className="text-sm md:text-base text-red-500 mb-6 tracking-[0.3em] uppercase font-medium"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.6s ease-out 0.3s'
          }}
        >
          HI
        </p>

        {/* Partikel Text */}
        <div className="mb-12 flex flex-wrap justify-center gap-2 md:gap-4">
          {renderParticleText()}
        </div>

        {/* Subtitle */}
        <p
          className="text-base md:text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 1.5s'
          }}
        >
          Digital Creative & Frontend Developer
        </p>

        {/* CTA Buttons */}
        <div
          className="flex gap-4 justify-center flex-wrap"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 1.8s'
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
      </div>

      {/* Skills Carousel - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 py-8 border-t border-white/10 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="relative overflow-hidden max-w-4xl mx-auto px-8">
          {/* Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />

          {/* Carousel */}
          <div className="text-center">
            <div
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-white transition-all duration-700"
              style={{
                fontFamily: 'Space Grotesk, system-ui, sans-serif',
                opacity: isVisible ? 1 : 0,
                transform: 'translateY(0)',
                textShadow: '0 0 40px rgba(220, 38, 38, 0.6)'
              }}
            >
              {skills[currentSkill]}
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {skills.map((_, index) => (
                <div
                  key={index}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: currentSkill === index ? '24px' : '8px',
                    backgroundColor: currentSkill === index ? '#dc2626' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
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

      {/* Orbit Animation für Partikel */}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
      `}</style>
    </section>
  )
}

export default Hero
