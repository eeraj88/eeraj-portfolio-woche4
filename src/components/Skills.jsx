import { useState, useContext } from 'react'
import skills from '../data/skills'
import { ThemeContext } from '../Context/ThemeContext'

function Skills() {
  const { istDunkel } = useContext(ThemeContext)
  const [offeneKategorie, setOffeneKategorie] = useState(null)

  // Kategorien ohne "Alle"
  const kategorien = [...new Set(skills.map(skill => skill.kategorie))]

  // Skills nach Kategorie gruppieren
  const skillsNachKategorie = kategorien.reduce((acc, kategorie) => {
    acc[kategorie] = skills.filter(skill => skill.kategorie === kategorie)
    return acc
  }, {})

  // Kategorie-Icons
  const kategorieIcons = {
    Frontend: '💻',
    Marketing: '📈',
    Design: '🎨',
    Business: '💼',
    Tools: '⚡'
  }

  const toggleKategorie = (kategorie) => {
    setOffeneKategorie(offeneKategorie === kategorie ? null : kategorie)
  }

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Meine <span className="gradient-text">Skills</span>
        </h2>

        <p className={`text-center mb-10 ${
          istDunkel ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Technologien und Tools, die ich benutze
        </p>

        {/* Akkordeon */}
        <div className="space-y-3">
          {kategorien.map(kategorie => (
            <div key={kategorie} className="overflow-hidden rounded-xl">
              {/* Kategorie Header - Klickbar */}
              <button
                onClick={() => toggleKategorie(kategorie)}
                className={`w-full px-6 py-4 flex items-center justify-between transition-all duration-300 ${
                  offeneKategorie === kategorie
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : istDunkel
                      ? 'bg-gray-800/70 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{kategorieIcons[kategorie]}</span>
                  <span className="text-lg font-bold">{kategorie}</span>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    offeneKategorie === kategorie
                      ? 'bg-white/20'
                      : istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {skillsNachKategorie[kategorie].length}
                  </span>
                </div>
                
                {/* Pfeil Icon */}
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    offeneKategorie === kategorie ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Skills Content - Aufklappbar */}
              <div className={`transition-all duration-300 ease-in-out ${
                offeneKategorie === kategorie 
                  ? 'max-h-[500px] opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className={`p-4 space-y-3 ${
                  istDunkel ? 'bg-gray-800/40' : 'bg-white'
                }`}>
                  {skillsNachKategorie[kategorie].map(skill => (
                    <div key={skill.id} className="flex items-center gap-4">
                      <span className={`w-32 sm:w-40 text-sm font-medium truncate ${
                        istDunkel ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {skill.name}
                      </span>
                      
                      {/* Progress Bar */}
                      <div className={`flex-1 h-2 rounded-full ${
                        istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700"
                          style={{ 
                            width: offeneKategorie === kategorie ? `${skill.level}%` : '0%'
                          }}
                        />
                      </div>
                      
                      <span className={`w-10 text-right text-sm font-medium ${
                        istDunkel ? 'text-orange-400' : 'text-orange-600'
                      }`}>
                        {skill.level}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
