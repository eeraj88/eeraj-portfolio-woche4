import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function VideoIntro() {
  const { istDunkel } = useContext(ThemeContext)

  // YouTube Video ID
  const youtubeVideoId = "fRWuzTOYDXY"

  return (
    <section id="about-me" className={`py-20 px-4 ${
      istDunkel ? 'bg-gray-900/50' : 'bg-gray-50'
    }`}>
      <div className="max-w-5xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Lern mich <span className="gradient-text">kennen</span>
        </h2>

        <p className={`text-center mb-10 ${
          istDunkel ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Ein kurzes Video ueber mich und meine Leidenschaft
        </p>

        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* YouTube Short Embed (vertikal) */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl w-72 aspect-[9/16] ${
              istDunkel ? 'ring-2 ring-orange-500/30' : 'ring-1 ring-gray-200'
            }`}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="Ein kreativer Nerd - Eeraj"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full lg:w-3/5 space-y-4">
            <h3 className={`text-2xl font-bold ${
              istDunkel ? 'text-white' : 'text-gray-900'
            }`}>
              Multi-Talent mit Leidenschaft
            </h3>

            <p className={`leading-relaxed ${
              istDunkel ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Ich bin ein vielseitiger Kreativer, der Technologie, Design und Business vereint. 
              Mit mehrjaehriger Erfahrung im <strong className={istDunkel ? 'text-orange-400' : 'text-orange-600'}>B2B-Vertrieb und Account Management</strong> weiss 
              ich, wie man Kundenbeziehungen aufbaut und nachhaltig pflegt.
            </p>

            <p className={`leading-relaxed ${
              istDunkel ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Mein Hintergrund in <strong className={istDunkel ? 'text-orange-400' : 'text-orange-600'}>Sales und Kundenkommunikation</strong> kombiniert 
              mit meinen kreativen Faehigkeiten in Marketing und Webentwicklung macht mich zu einem 
              Allrounder, der sowohl strategisch denkt als auch hands-on umsetzt.
            </p>

            <p className={`leading-relaxed ${
              istDunkel ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Von Social Media Strategien ueber Performance Marketing bis hin zu React-Anwendungen — 
              ich bringe alles zusammen, um Projekte zu schaffen, die nicht nur funktionieren, 
              sondern auch begeistern.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              {['Kreativ', 'Sales-Erfahrung', 'Kundenorientiert', 'Technisch', 'Strategisch'].map(tag => (
                <span
                  key={tag}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    istDunkel
                      ? 'bg-gray-800 text-orange-400 border border-gray-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoIntro
