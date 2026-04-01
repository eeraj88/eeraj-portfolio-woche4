import { useState, useContext } from 'react'
import projects from '../data/projects'
import { ThemeContext } from '../Context/ThemeContext'
import { giveXP } from './PokemonBuddy'

function Projects() {
  const { istDunkel } = useContext(ThemeContext)
  const [aktiverFilter, setAktiverFilter] = useState('Alle')
  const [aktivesProjekt, setAktivesProjekt] = useState(null)
  const [viewedProjects, setViewedProjects] = useState(new Set())

  const kategorien = ['Alle', ...new Set(projects.map(p => p.kategorie))]

  const gefilterteProjekte = aktiverFilter === 'Alle'
    ? projects
    : projects.filter(p => p.kategorie === aktiverFilter)

  // Projekt öffnen und XP geben (nur beim ersten Mal)
  const openProject = (projekt) => {
    setAktivesProjekt(projekt)
    
    if (!viewedProjects.has(projekt.id)) {
      setViewedProjects(prev => new Set([...prev, projekt.id]))
      giveXP(10, 'Projekt angeschaut')
    }
  }

  return (
    <section id="projects" className={`py-20 px-4 ${
      istDunkel ? 'bg-gray-900/50' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Meine <span className="gradient-text">Projekte</span>
        </h2>

        <p className={`text-center mb-8 ${
          istDunkel ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Eine Auswahl meiner bisherigen Arbeiten
        </p>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {kategorien.map(kategorie => (
            <button
              key={kategorie}
              onClick={() => setAktiverFilter(kategorie)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                aktiverFilter === kategorie
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : istDunkel
                    ? 'bg-gray-800 text-gray-300 hover:text-orange-400'
                    : 'bg-white text-gray-700 border border-gray-200 hover:text-orange-600'
              }`}
            >
              {kategorie}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gefilterteProjekte.map(projekt => (
            <div
              key={projekt.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group ${
                istDunkel
                  ? 'bg-gray-800/70 border border-gray-700/50 hover:border-orange-500/50'
                  : 'bg-white border border-gray-200 hover:border-orange-300'
              }`}
            >
              {/* Project Header */}
              <div className="h-44 relative overflow-hidden">
                {projekt.bild ? (
                  <img 
                    src={projekt.bild} 
                    alt={projekt.titel}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-600">
                    <span className="text-white text-5xl font-bold opacity-20">
                      {projekt.id.toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className={`text-lg font-bold mb-2 ${
                  istDunkel ? 'text-white' : 'text-gray-900'
                }`}>
                  {projekt.titel}
                </h3>

                <p className={`text-sm mb-4 line-clamp-2 ${
                  istDunkel ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {projekt.beschreibung}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {projekt.technologien.slice(0, 3).map(tech => (
                    <span
                      key={tech}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        istDunkel
                          ? 'bg-gray-700 text-orange-400'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                  <button
                    onClick={() => openProject(projekt)}
                    className={`text-sm font-medium transition-colors ${
                      istDunkel
                        ? 'text-orange-400 hover:text-orange-300'
                        : 'text-orange-600 hover:text-orange-700'
                    }`}
                  >
                    Details
                  </button>

                  <div className="flex items-center gap-3">
                    {projekt.github && (
                      <a
                        href={projekt.github}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-sm font-medium transition-colors ${
                          istDunkel
                            ? 'text-gray-400 hover:text-orange-400'
                            : 'text-gray-600 hover:text-orange-600'
                        }`}
                      >
                        GitHub
                      </a>
                    )}
                    {projekt.link && projekt.link !== '#' && (
                      <a
                        href={projekt.link}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                          istDunkel
                            ? 'text-orange-400 hover:text-orange-300'
                            : 'text-orange-600 hover:text-orange-700'
                        }`}
                      >
                        Live Demo →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {aktivesProjekt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          onClick={() => setAktivesProjekt(null)}
        >
          <div
            className={`w-full max-w-2xl rounded-2xl p-8 relative ${
              istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setAktivesProjekt(null)}
              className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-10 ${
                istDunkel ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="Modal schliessen"
            >
              ✕
            </button>

            {/* Modal Bild */}
            {aktivesProjekt.bild && (
              <div className="h-48 -mx-8 -mt-8 mb-6 overflow-hidden rounded-t-2xl">
                <img 
                  src={aktivesProjekt.bild} 
                  alt={aktivesProjekt.titel}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h3 className={`text-2xl font-bold mb-4 ${
              istDunkel ? 'text-white' : 'text-gray-900'
            }`}>
              {aktivesProjekt.titel}
            </h3>

            <p className={`mb-6 ${istDunkel ? 'text-gray-300' : 'text-gray-600'}`}>
              {aktivesProjekt.beschreibung}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {aktivesProjekt.technologien.map(tech => (
                <span
                  key={tech}
                  className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                    istDunkel
                      ? 'bg-gray-800 text-orange-400'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className={`text-sm mb-6 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
              Kategorie: {aktivesProjekt.kategorie}
            </p>

            <div className="flex flex-wrap gap-4">
              {aktivesProjekt.link && aktivesProjekt.link !== '#' && (
                <a
                  href={aktivesProjekt.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Live Demo
                </a>
              )}
              {aktivesProjekt.github && (
                <a
                  href={aktivesProjekt.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-block px-6 py-3 rounded-lg font-semibold transition-all ${
                    istDunkel
                      ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  GitHub Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Projects
