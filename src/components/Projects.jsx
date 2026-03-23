import projects from '../data/projects'

function Projects({ istDunkel, bookmarks, addBookmark, deleteBookmark }) {
  const istBookmarked = (titel) => bookmarks.includes(titel)

  return (
    <section id="projects" className={`py-16 px-4 ${
      istDunkel ? 'bg-gray-800/50' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Meine Projekte
        </h2>
        <p className={`text-center mb-8 ${
          istDunkel ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Eine Auswahl meiner bisherigen Arbeiten
        </p>

        {/* Bookmarks Info */}
        {bookmarks.length > 0 && (
          <div className={`mb-6 p-4 rounded-xl text-center ${
            istDunkel ? 'bg-gray-700' : 'bg-blue-50'
          }`}>
            <p className={`text-sm ${
              istDunkel ? 'text-gray-300' : 'text-blue-700'
            }`}>
              Gespeicherte Bookmarks: {bookmarks.join(', ')}
            </p>
          </div>
        )}

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(projekt => (
            <div
              key={projekt.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                istDunkel
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {/* Card Header */}
              <div className={`h-32 flex items-center justify-center ${
                istDunkel ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'
              }`}>
                <span className="text-white text-4xl font-bold opacity-30">
                  {projekt.id.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-lg font-bold ${
                    istDunkel ? 'text-white' : 'text-gray-900'
                  }`}>
                    {projekt.titel}
                  </h3>
                  <button
                    onClick={() =>
                      istBookmarked(projekt.titel)
                        ? deleteBookmark(projekt.titel)
                        : addBookmark(projekt.titel)
                    }
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 ${
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

                <p className={`text-sm mb-4 leading-relaxed ${
                  istDunkel ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {projekt.beschreibung}
                </p>

                {/* Technology Badges */}
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

                <a
                  href={projekt.link}
                  className={`text-sm font-medium transition-colors ${
                    istDunkel
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Projekt ansehen →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
