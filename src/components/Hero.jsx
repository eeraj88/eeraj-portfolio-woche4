import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function Hero() {
  const { istDunkel } = useContext(ThemeContext)

  return (
    <section className="pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Animierter Hintergrund */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-blob ${
          istDunkel ? 'bg-cyan-500/10' : 'bg-teal-500/10'
        }`}></div>
        <div className={`absolute top-40 right-10 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-2000 ${
          istDunkel ? 'bg-orange-500/10' : 'bg-orange-400/10'
        }`}></div>
        <div className={`absolute bottom-10 left-1/3 w-80 h-80 rounded-full blur-3xl animate-blob animation-delay-4000 ${
          istDunkel ? 'bg-cyan-400/5' : 'bg-teal-400/5'
        }`}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* Foto */}
          <div className="flex-shrink-0">
            <div className={`relative ${istDunkel ? 'glow-cyan' : ''}`}>
              <img
                src="/foto.jpg"
                alt="Eeraj - Digital Creative & Developer"
                className={`w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 shadow-2xl ${
                  istDunkel ? 'border-[#64ffda]' : 'border-[#0d9488]'
                }`}
              />
              {/* Dekorativer Ring */}
              <div className={`absolute inset-0 rounded-full border-2 opacity-50 scale-110 ${
                istDunkel ? 'border-[#64ffda]' : 'border-[#0d9488]'
              }`}></div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${
              istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'
            }`}>
              Willkommen auf meinem Portfolio
            </p>

            <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
              istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
            }`}>
              Hi, ich bin{' '}
              <span className={istDunkel ? 'gradient-text' : 'gradient-text-light'}>Eeraj</span>
            </h1>

            <p className={`text-lg md:text-xl mb-8 max-w-xl ${
              istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
            }`}>
              Digital Creative & Frontend-Entwickler. Ich verbinde kreatives Marketing 
              mit moderner Webentwicklung — von KI-Automatisierungen bis hin zu High-Performance React Apps.
            </p>

            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <a
                href="#projects"
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 ${
                  istDunkel 
                    ? 'bg-[#64ffda] text-[#0a192f] hover:shadow-[0_0_20px_rgba(100,255,218,0.4)]' 
                    : 'bg-[#0d9488] text-white hover:bg-[#0f766e] hover:shadow-lg'
                }`}
              >
                Meine Projekte
              </a>

              <a
                href="#contact"
                className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105 ${
                  istDunkel
                    ? 'border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10'
                    : 'border-[#0d9488] text-[#0d9488] hover:bg-[#0d9488]/10'
                }`}
              >
                Kontakt aufnehmen
              </a>

              <a
                href="/lebenslauf.pdf"
                download="Eeraj_Lebenslauf.pdf"
                className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  istDunkel
                    ? 'border-[#233554] text-[#8892b0] hover:border-[#64ffda] hover:text-[#64ffda]'
                    : 'border-gray-300 text-[#475569] hover:border-[#0d9488] hover:text-[#0d9488]'
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

        {/* Dezenter Game Hinweis */}
        <div className="mt-12 text-center">
          <p className={`text-sm ${
            istDunkel ? 'text-[#8892b0]' : 'text-gray-500'
          }`}>
            Beweise dich gegen andere Recruiter und sichere dir deinen Platz im Ranking
            <span className={`ml-2 ${istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'}`}>
              — oben in der Leiste 🏆
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero
