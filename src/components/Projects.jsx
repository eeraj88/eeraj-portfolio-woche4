import { useState, useContext } from 'react'
import projects from '../data/projects'
import { ThemeContext } from '../Context/ThemeContext'
import { giveXP } from './PokemonBuddy'
import LikeButton from './LikeButton'
import Comments from './Comments'

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
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
        }`}>
          Meine <span className={istDunkel ? 'gradient-text' : 'gradient-text-light'}>Projekte</span>
        </h2>

        <p className={`text-center mb-8 ${
          istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
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
                  ? istDunkel 
                    ? 'bg-[#64ffda] text-[#0a192f]'
                    : 'bg-[#0d9488] text-white'
                  : istDunkel
                    ? 'bg-[#112240] text-[#8892b0] border border-[#233554] hover:text-[#64ffda] hover:border-[#64ffda]'
                    : 'bg-white text-[#475569] border border-[#e2e8f0] hover:text-[#0d9488] hover:border-[#0d9488]'
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
              onClick={() => openProject(projekt)}
              className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 group cursor-pointer ${
                istDunkel
                  ? 'bg-[#112240] border border-[#233554] hover:border-[#64ffda] hover:shadow-[0_10px_40px_-10px_rgba(100,255,218,0.15)]'
                  : 'bg-white border border-[#e2e8f0] hover:border-[#0d9488] hover:shadow-xl'
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
                  <div className={`w-full h-full flex items-center justify-center ${
                    istDunkel
                      ? 'bg-gradient-to-br from-[#64ffda]/20 via-[#0d9488]/20 to-[#f97316]/20'
                      : 'bg-gradient-to-br from-[#0d9488]/20 via-[#0f766e]/20 to-[#ea580c]/20'
                  }`}>
                    <span className={`text-5xl font-bold opacity-30 ${
                      istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'
                    }`}>
                      {projekt.id.toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className={`text-lg font-bold mb-2 ${
                  istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
                }`}>
                  {projekt.titel}
                </h3>

                <p className={`text-sm mb-4 line-clamp-2 ${
                  istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
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
                          ? 'bg-[#0a192f] text-[#64ffda] border border-[#233554]'
                          : 'bg-[#f1f5f9] text-[#0d9488] border border-[#e2e8f0]'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className={`flex items-center justify-between pt-4 border-t ${
                  istDunkel ? 'border-[#233554]' : 'border-[#e2e8f0]'
                }`}>
                  <span className={`text-sm ${
                    istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
                  }`}>
                    Klicken für Details
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Like Button auf Card */}
                    <div onClick={e => e.stopPropagation()}>
                      <LikeButton projectId={projekt.id} compact />
                    </div>

                    {projekt.github && (
                      <a
                        href={projekt.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className={`text-sm font-medium transition-colors ${
                          istDunkel
                            ? 'text-[#8892b0] hover:text-[#64ffda]'
                            : 'text-[#475569] hover:text-[#0d9488]'
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
                        onClick={e => e.stopPropagation()}
                        className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                          istDunkel
                            ? 'text-[#64ffda] hover:text-[#64ffda]/80'
                            : 'text-[#0d9488] hover:text-[#0f766e]'
                        }`}
                      >
                        Live →
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
              istDunkel ? 'bg-[#112240] border border-[#233554]' : 'bg-white'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setAktivesProjekt(null)}
              className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-10 ${
                istDunkel ? 'bg-[#0a192f] hover:bg-[#1d3557] text-[#ccd6f6] border border-[#233554]' : 'bg-gray-100 hover:bg-gray-200'
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
              istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
            }`}>
              {aktivesProjekt.titel}
            </h3>

            <p className={`mb-6 ${istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'}`}>
              {aktivesProjekt.beschreibung}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {aktivesProjekt.technologien.map(tech => (
                <span
                  key={tech}
                  className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                    istDunkel
                      ? 'bg-[#0a192f] text-[#64ffda] border border-[#233554]'
                      : 'bg-[#f1f5f9] text-[#0d9488] border border-[#e2e8f0]'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className={`text-sm mb-6 ${istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'}`}>
              Kategorie: {aktivesProjekt.kategorie}
            </p>

            <div className="flex flex-wrap gap-4">
              {aktivesProjekt.link && aktivesProjekt.link !== '#' && (
                <a
                  href={aktivesProjekt.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-block px-6 py-3 rounded-lg font-semibold transition-all ${
                    istDunkel
                      ? 'bg-[#64ffda] text-[#0a192f] hover:shadow-[0_0_20px_rgba(100,255,218,0.4)]'
                      : 'bg-[#0d9488] text-white hover:bg-[#0f766e]'
                  }`}
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
                      ? 'bg-[#0a192f] text-[#ccd6f6] hover:bg-[#1d3557] border border-[#233554]'
                      : 'bg-gray-100 text-[#0a192f] hover:bg-gray-200 border border-[#e2e8f0]'
                  }`}
                >
                  GitHub Code
                </a>
              )}
            </div>

            {/* Like Button */}
            <div className="mt-4">
              <LikeButton projectId={aktivesProjekt.id} />
            </div>

            {/* Comments */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#233554]">
              <Comments projectId={aktivesProjekt.id} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Projects
