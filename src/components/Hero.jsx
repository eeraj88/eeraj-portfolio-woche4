import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import CodeTyping from './CodeTyping'

function Hero() {
  const { istDunkel } = useContext(ThemeContext)

  return (
    <section className="pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Animierter Hintergrund */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* Foto */}
          <div className="flex-shrink-0">
            <div className={`relative ${istDunkel ? 'glow-orange' : ''}`}>
              <img
                src="/foto.jpg"
                alt="Eeraj - Digital Creative & Developer"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-orange-500 shadow-2xl"
              />
              {/* Dekorativer Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-orange-400 opacity-50 scale-110"></div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
              istDunkel ? 'text-orange-400' : 'text-orange-600'
            }`}>
              Willkommen auf meinem Portfolio
            </p>

            <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
              istDunkel ? 'text-white' : 'text-gray-900'
            }`}>
              Hi, ich bin{' '}
              <span className="gradient-text">Eeraj</span>
            </h1>

            <p className={`text-lg md:text-xl mb-8 max-w-xl ${
              istDunkel ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Digital Creative & Frontend-Entwickler. Ich verbinde kreatives Marketing 
              mit moderner Webentwicklung — von Social Media Strategien bis React Apps.
            </p>

            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <a
                href="#projects"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Meine Projekte
              </a>

              <a
                href="#contact"
                className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105 ${
                  istDunkel
                    ? 'border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white'
                    : 'border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white'
                }`}
              >
                Kontakt aufnehmen
              </a>
            </div>
          </div>
        </div>

        {/* Code Typing Animation */}
        <div className="mt-16 max-w-lg mx-auto md:mx-0">
          <CodeTyping istDunkel={istDunkel} />
        </div>
      </div>
    </section>
  )
}

export default Hero
