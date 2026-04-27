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

  const kategorieConfig = {
    Frontend: { icon: '💻', gradient: 'from-blue-500 to-cyan-500', gridClass: 'md:col-span-2' },
    Marketing: { icon: '📈', gradient: 'from-green-500 to-emerald-500', gridClass: 'md:col-span-1' },
    Design: { icon: '🎨', gradient: 'from-purple-500 to-pink-500', gridClass: 'md:col-span-1' },
    Business: { icon: '💼', gradient: 'from-orange-500 to-red-500', gridClass: 'md:col-span-1' },
    Automation: { icon: '🤖', gradient: 'from-indigo-500 to-violet-600', gridClass: 'md:col-span-2' },
    Tools: { icon: '⚡', gradient: 'from-yellow-500 to-amber-500', gridClass: 'md:col-span-1' }
  }

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
    <section id="skills" className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
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
                    : 'bg-white border border-[#e2e8f0] shadow-sm hover:shadow-lg'
                  }
                `}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${config.gradient}`} />
                <div className="relative z-10 mb-3 text-lg font-bold flex items-center gap-2">
                  <span>{config.icon}</span>
                  <h3 className={istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'}>{kategorie}</h3>
                </div>
                <div className="relative z-10 flex flex-wrap gap-1.5">
                  {katSkills.map(skill => (
                    <div key={skill.id} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${istDunkel ? getLevelColor(skill.level) : getLevelColorLight(skill.level)}`}>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Skills
