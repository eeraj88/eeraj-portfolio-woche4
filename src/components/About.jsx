import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function About() {
  const { istDunkel } = useContext(ThemeContext)

  // YouTube Video ID
  const youtubeVideoId = "taMDOC3hTYA"

  const stats = [
    { value: '5+', label: 'Projekte' },
    { value: '20+', label: 'Skills' },
    { value: '3+', label: 'Jahre Sales' }
  ]

  const highlights = [
    'AI & Automation',
    'Frontend Development',
    'Digital Marketing',
    'B2B Strategie'
  ]

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl font-bold mb-12 text-center ${
          istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
        }`}>
          Ueber <span className={istDunkel ? 'gradient-text' : 'gradient-text-light'}>mich</span>
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Video */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl w-72 aspect-[9/16] ${
              istDunkel ? 'ring-2 ring-[#64ffda]/30' : 'ring-1 ring-[#0d9488]/30'
            }`}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="Eeraj - Ein kreativer Nerd"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-3/5">
            <h3 className={`text-2xl font-bold mb-4 ${
              istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
            }`}>
              Code. Marketing. AI. Automation.
            </h3>

            <p className={`leading-relaxed mb-4 ${
              istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
            }`}>
              Ich verbinde moderne Softwareentwicklung mit der Power von <strong className={istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'}>Künstlicher Intelligenz</strong> und 
              <strong className={istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'}> Automatisierung</strong>. Mein Fokus liegt darauf, nicht nur Code zu schreiben, sondern intelligente Systeme zu schaffen, die echte Probleme lösen.
            </p>

            <p className={`leading-relaxed mb-6 ${
              istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
            }`}>
              Mit Tools wie <strong className={istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'}>n8n</strong>, <strong className={istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'}>Make</strong> und <strong className={istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'}>Tally</strong> automatisiere ich komplexe Workflows. Gepaart mit fundiertem Wissen in Digital Marketing und Strategie baue ich Lösungen, die skalieren.
            </p>

            {/* Highlight Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {highlights.map(tag => (
                <span
                  key={tag}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    istDunkel
                      ? 'bg-[#112240] text-[#64ffda] border border-[#233554] hover:border-[#64ffda]'
                      : 'bg-[#f1f5f9] text-[#0d9488] border border-[#e2e8f0] hover:border-[#0d9488]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-4 p-6 rounded-xl transition-all duration-300 ${
              istDunkel 
                ? 'bg-[#112240] border border-[#233554]' 
                : 'bg-[#f8fafc] border border-[#e2e8f0]'
            }`}>
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className={`text-2xl md:text-3xl font-bold ${istDunkel ? 'gradient-text' : 'gradient-text-light'}`}>{value}</p>
                  <p className={`text-sm ${istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'}`}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
