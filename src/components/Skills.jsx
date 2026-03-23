import { useState, useContext } from 'react'
import skills from '../data/skills'
import { ThemeContext } from '../Context/ThemeContext'

function Skills() {
  const { istDunkel } = useContext(ThemeContext)
  const [aktiverFilter, setAktiverFilter] = useState('Alle')

  const kategorien = ['Alle', ...new Set(skills.map(skill => skill.kategorie))]

  const gefilterteSkills =
    aktiverFilter === 'Alle'
      ? skills
      : skills.filter(skill => skill.kategorie === aktiverFilter)

  return (
    <section id="skills" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-3xl font-bold mb-2 text-center ${
            istDunkel ? 'text-white' : 'text-gray-900'
          }`}
        >
          Meine Skills
        </h2>

        <p
          className={`text-center mb-8 ${
            istDunkel ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Technologien und Tools, die ich lerne und benutze
        </p>

        <div className="flex gap-2 justify-center flex-wrap mb-8">
          {kategorien.map(kategorie => (
            <button
              key={kategorie}
              onClick={() => setAktiverFilter(kategorie)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                aktiverFilter === kategorie
                  ? 'bg-blue-600 text-white'
                  : istDunkel
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {kategorie}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gefilterteSkills.map(skill => (
            <div
              key={skill.id}
              className={`p-4 rounded-xl transition-colors ${
                istDunkel ? 'bg-gray-800' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`font-medium ${
                    istDunkel ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {skill.name}
                </span>

                <span
                  className={`text-sm ${
                    istDunkel ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {skill.level}%
                </span>
              </div>

              <div
                className={`w-full h-2.5 rounded-full ${
                  istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              >
                <div
                  className="h-2.5 rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>

              <span
                className={`text-xs mt-1 inline-block ${
                  istDunkel ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
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