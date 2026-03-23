import { useState, useContext } from 'react'
import projects from '../data/projects'
import { ThemeContext } from '../Context/ThemeContext'

function Projects({ bookmarks, addBookmark, deleteBookmark }) {
  const { istDunkel } = useContext(ThemeContext)
  const [aktiverFilter, setAktiverFilter] = useState('Alle')
  const [aktivesProjekt, setAktivesProjekt] = useState(null)

  const kategorien = ['Alle', ...new Set(projects.map(projekt => projekt.kategorie))]

  const gefilterteProjekte =
    aktiverFilter === 'Alle'
      ? projects
      : projects.filter(projekt => projekt.kategorie === aktiverFilter)

  const istBookmarked = (titel) => bookmarks.includes(titel)

  return (
    <section
      id="projects"
      className={`py-16 px-4 ${
        istDunkel ? 'bg-gray-800/50' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-3xl font-bold mb-2 text-center ${
            istDunkel ? 'text-white' : 'text-gray-900'
          }`}
        >
          Meine Projekte
        </h2>

        <p
          className={`text-center mb-8 ${
            istDunkel ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Eine Auswahl meiner bisherigen Arbeiten
        </p>

        {bookmarks.length > 0 && (
          <div
            className={`mb-6 p-4 rounded-xl text-center ${
              istDunkel ? 'bg-gray-700' : 'bg-blue-50'
            }`}
          >
            <p
              className={`text-sm ${
                istDunkel ? 'text-gray-300' : 'text-blue-700'
              }`}
            >
              Gespeicherte Bookmarks: {bookmarks.join(', ')}
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {kategorien.map(kategorie => (
            <button
              key={kategorie}
              onClick={() => setAktiverFilter(kategorie)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                aktiverFilter === kategorie
                  ? 'bg-blue-600 text-white'
                  : istDunkel
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {kategorie}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gefilterteProjekte.map(projekt => (
            <div
              key={projekt.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                istDunkel
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div
                className={`h-32 flex items-center justify-center ${
                  istDunkel ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                }`}
              >
                <span className="text-white text-4xl font-bold opacity-30">
                  {projekt.id.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3
                    className={`text-lg font-bold ${
                      istDunkel ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {projekt.titel}
                  </h3>

                  <button
                    onClick={() =>
                      istBookmarked(projekt.titel)
                        ? deleteBookmark(projekt.titel)
                        : addBookmark(projekt.titel)
                    }
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 ${
                      istBookmarked(projekt.titel)
                        ? 'bg-blue-600 text-white'
                        : istDunkel
                          ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    title={istBookmarked(projekt.titel) ? 'Bookmark entfernen' : 'Bookmark setzen'}
                  >
                    {istBookmarked(projekt.titel) ? 'Gespeichert' : 'Merken'}
                  </button>
                </div>

                <p
                  className={`text-sm mb-4 leading-relaxed ${
                    istDunkel ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {projekt.beschreibung}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {projekt.technologien.map(tech => (
                    <span
                      key={tech}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        istDunkel
                          ? 'bg-gray-700 text-blue-400'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setAktivesProjekt(projekt)}
                    className={`text-sm font-medium ${
                      istDunkel
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Details ansehen
                  </button>

                  <a
                    href={projekt.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-sm font-medium ${
                      istDunkel
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Live Link →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {aktivesProjekt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div
            className={`w-full max-w-2xl rounded-2xl p-6 relative ${
              istDunkel ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <button
              onClick={() => setAktivesProjekt(null)}
              className="absolute top-4 right-4 text-xl font-bold"
              aria-label="Modal schließen"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-3">{aktivesProjekt.titel}</h3>

            <p
              className={`mb-4 ${
                istDunkel ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {aktivesProjekt.beschreibung}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {aktivesProjekt.technologien.map(tech => (
                <span
                  key={tech}
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    istDunkel
                      ? 'bg-gray-800 text-blue-400'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>

            <p
              className={`text-sm mb-6 ${
                istDunkel ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Kategorie: {aktivesProjekt.kategorie}
            </p>

            <a
              href={aktivesProjekt.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Projekt öffnen
            </a>
          </div>
        </div>
      )}
    </section>
  )
}

export default Projects