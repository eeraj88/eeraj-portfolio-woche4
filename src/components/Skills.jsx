import { useState, useContext } from 'react'
import skills from '../data/skills'
import { ThemeContext } from '../Context/ThemeContext'

function Skills() {
  const { istDunkel } = useContext(ThemeContext)
  const [aktiverFilter, setAktiverFilter] = useState('Alle')

  const kategorien = ['Alle', ...new Set(skills.map(skill => skill.kategorie))]

  const gefilterteSkills = aktiverFilter === 'Alle'
    ? skills
    : skills.filter(skill => skill.kategorie === aktiverFilter)

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Meine <span className="gradient-text">Skills</span>
        </h2>

        <p className={`text-center mb-8 ${
          istDunkel ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Technologien und Tools, die ich lerne und benutze
        </p>

        {/* Filter Buttons */}
        <div className="flex gap-2 justify-center flex-wrap mb-10">
          {kategorien.map(kategorie => (
            <button
              key={kategorie}
              onClick={() => setAktiverFilter(kategorie)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                aktiverFilter === kategorie
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-105'
                  : istDunkel
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-orange-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-orange-600'
              }`}
            >
              {kategorie}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gefilterteSkills.map(skill => (
            <div
              key={skill.id}
              className={`p-5 rounded-xl transition-all duration-300 hover:scale-105 ${
                istDunkel 
                  ? 'bg-gray-800/50 border border-gray-700/50 hover:border-orange-500/50' 
                  : 'bg-white shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className={`font-semibold ${
                  istDunkel ? 'text-white' : 'text-gray-900'
                }`}>
                  {skill.name}
                </span>
                <span className={`text-sm font-medium ${
                  istDunkel ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  {skill.level}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className={`w-full h-2 rounded-full ${
                istDunkel ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <span className={`text-xs mt-2 inline-block ${
                istDunkel ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {skill.kategorie}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
