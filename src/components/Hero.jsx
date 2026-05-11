import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function Hero() {
  const { istDunkel } = useContext(ThemeContext)

  return (
    <section className="pt-28 pb-20 px-4 relative overflow-hidden flex items-center justify-center min-h-[70vh]">
      {/* Animierter Hintergrund */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-blob ${
          istDunkel ? 'bg-red-700/10' : 'bg-red-600/10'
        }`}></div>
        <div className={`absolute top-40 right-10 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-2000 ${
          istDunkel ? 'bg-red-800/10' : 'bg-red-700/10'
        }`}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* Foto */}
          <div className="flex-shrink-0">
            <div className={`relative ${istDunkel ? 'glow-cyan' : ''}`}>
              <img
                src="/foto.jpg"
                alt="Eeraj - Digital Creative & Developer"
                className={`w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 shadow-2xl ${
                  istDunkel ? 'border-[#b91c1c]' : 'border-[#dc2626]'
                }`}
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left flex-1">
            <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
              istDunkel ? 'text-[#b91c1c]' : 'text-[#dc2626]'
            }`}>
              Willkommen auf meinem Portfolio
            </p>

            <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
              istDunkel ? 'text-[#f5f5f5]' : 'text-[#171717]'
            }`}>
              Hi, ich bin{' '}
              <span className={istDunkel ? 'gradient-text' : 'gradient-text-light'}>Eeraj</span>
            </h1>

            <p className={`text-lg md:text-xl mb-8 max-w-xl ${
              istDunkel ? 'text-[#a3a3a3]' : 'text-[#525252]'
            }`}>
              Digital Creative & Frontend-Entwickler. Ich verbinde kreatives Marketing 
              mit moderner Webentwicklung — von KI-Automatisierungen bis hin zu High-Performance React Apps.
            </p>

            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <a
                href="#projects"
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                  istDunkel
                    ? 'bg-[#b91c1c] text-[#f5f5f5] hover:shadow-[0_0_20px_rgba(185,28,28,0.4)]'
                    : 'bg-[#dc2626] text-white hover:bg-[#b91c1c] hover:shadow-lg'
                }`}
              >
                Meine Projekte
              </a>

              <a
                href="#contact"
                className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105 ${
                  istDunkel
                    ? 'border-[#b91c1c] text-[#b91c1c] hover:bg-[#b91c1c]/10'
                    : 'border-[#dc2626] text-[#dc2626] hover:bg-[#dc2626]/10'
                }`}
              >
                Kontakt aufnehmen
              </a>

              <a
                href="/lebenslauf.pdf"
                download="Eeraj_Lebenslauf.pdf"
                className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  istDunkel
                    ? 'border-[#404040] text-[#a3a3a3] hover:border-[#b91c1c] hover:text-[#b91c1c]'
                    : 'border-[#e5e5e5] text-[#525252] hover:border-[#dc2626] hover:text-[#dc2626]'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CV Download
              </a>
            </div>
          </div>
        </div>

        {/* Ranking Hinweis - WIEDER DA */}
        <div className="mt-12 text-center">
          <p className={`text-sm ${
            istDunkel ? 'text-[#a3a3a3]' : 'text-neutral-500'
          }`}>
            Beweise dich gegen andere Recruiter und sichere dir deinen Platz im Ranking
            <span className={`ml-2 ${istDunkel ? 'text-[#b91c1c]' : 'text-[#dc2626]'}`}>
              — oben in der Leiste 🏆
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero
