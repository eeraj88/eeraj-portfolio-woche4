import { useContext } from 'react'
import skills from '../data/skills'
import { ThemeContext } from '../Context/ThemeContext'

function Skills() {
  const { istDunkel } = useContext(ThemeContext)

  // Kategorien mit ihren Skills gruppieren
  const kategorien = [...new Set(skills.map(skill => skill.kategorie))]
  
  const skillsNachKategorie = kategorien.reduce((acc, kategorie) => {
    acc[kategorie] = skills.filter(skill => skill.kategorie === kategorie)
    return acc
  }, {})

  // Kategorie-Konfiguration für Bento Grid
  const kategorieConfig = {
    Frontend: {
      icon: '💻',
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      gridClass: 'md:col-span-2', // Breite Box
      description: 'Web Development'
    },
    Marketing: {
      icon: '📈',
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      gridClass: 'md:col-span-1', // Kleine Box
      description: 'Digital Marketing'
    },
    Design: {
      icon: '🎨',
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      gridClass: 'md:col-span-1', // Kleine Box
      description: 'Creative Suite'
    },
    Business: {
      icon: '💼',
      gradient: 'from-orange-500 to-red-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      gridClass: 'md:col-span-1', // Kleine Box
      description: 'Sales & Management'
    },
    Tools: {
      icon: '⚡',
      gradient: 'from-yellow-500 to-amber-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      gridClass: 'md:col-span-1', // Kleine Box
      description: 'Productivity'
    }
  }

  // Skill Level zu Farbe
  const getLevelColor = (level) => {
    if (level >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (level >= 70) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    if (level >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  const getLevelColorLight = (level) => {
    if (level >= 80) return 'bg-green-100 text-green-700 border-green-200'
    if (level >= 70) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (level >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-gray-100 text-gray-600 border-gray-200'
  }

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
        }`}>
          Meine <span className={istDunkel ? 'gradient-text' : 'gradient-text-light'}>Skills</span>
        </h2>

        <p className={`text-center mb-12 ${
          istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
        }`}>
          Technologien und Tools, die ich benutze
        </p>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {kategorien.map(kategorie => {
            const config = kategorieConfig[kategorie]
            const katSkills = skillsNachKategorie[kategorie]
            
            return (
              <div 
                key={kategorie}
                className={`
                  group relative overflow-hidden rounded-2xl p-5
                  transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
                  ${config.gridClass}
                  ${istDunkel 
                    ? 'bg-[#112240] border border-[#233554] hover:border-[#64ffda]/50' 
                    : 'bg-white border border-[#e2e8f0] hover:border-[#0d9488]/50 shadow-sm hover:shadow-lg'
                  }
                `}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500
                  bg-gradient-to-br ${config.gradient}
                `} />

                {/* Header */}
                <div className="relative z-10 mb-3">
                  <h3 className={`text-lg font-bold ${
                    istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
                  }`}>
                    {kategorie}
                  </h3>
                  <p className={`text-[10px] ${
                    istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
                  }`}>
                    {config.description}
                  </p>
                </div>

                {/* Skills as Pills */}
                <div className="relative z-10 flex flex-wrap gap-1.5">
                  {katSkills.map(skill => (
                    <div
                      key={skill.id}
                      className={`
                        group/skill relative px-2.5 py-1 rounded-full text-xs font-medium
                        border transition-all duration-200 cursor-default
                        hover:scale-105
                        ${istDunkel ? getLevelColor(skill.level) : getLevelColorLight(skill.level)}
                      `}
                    >
                      <span>{skill.name}</span>
                      
                      {/* Level Tooltip */}
                      <span className={`
                        absolute -top-8 left-1/2 -translate-x-1/2 
                        px-2 py-1 rounded text-xs font-bold whitespace-nowrap
                        opacity-0 group-hover/skill:opacity-100 transition-opacity
                        pointer-events-none z-20
                        ${istDunkel ? 'bg-[#ccd6f6] text-[#0a192f]' : 'bg-[#0a192f] text-white'}
                      `}>
                        {skill.level}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Decorative Corner Gradient */}
                <div className={`
                  absolute -bottom-8 -right-8 w-24 h-24 rounded-full
                  bg-gradient-to-br ${config.gradient} opacity-5
                  group-hover:opacity-15 transition-opacity duration-300
                `} />
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className={`
          mt-8 flex flex-wrap justify-center gap-4 text-xs
          ${istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'}
        `}>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${istDunkel ? 'bg-green-500/50' : 'bg-green-200'}`} />
            <span>Expert (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${istDunkel ? 'bg-blue-500/50' : 'bg-blue-200'}`} />
            <span>Advanced (70%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${istDunkel ? 'bg-yellow-500/50' : 'bg-yellow-200'}`} />
            <span>Intermediate (60%+)</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
