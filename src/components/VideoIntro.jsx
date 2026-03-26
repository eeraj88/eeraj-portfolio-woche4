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
              Code. Marketing. Strategie.
            </h3>

            <p className={`leading-relaxed ${
              istDunkel ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Mein Fokus liegt auf <strong className={istDunkel ? 'text-orange-400' : 'text-orange-600'}>moderner Webentwicklung mit React</strong> und 
              der Gestaltung von intuitiven User Interfaces. Clean Code, responsive Design und 
              durchdachte <strong className={istDunkel ? 'text-orange-400' : 'text-orange-600'}>UI/UX-Konzepte</strong> sind mein Antrieb.
            </p>

            <p className={`leading-relaxed ${
              istDunkel ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Dazu bringe ich fundiertes Know-how in <strong className={istDunkel ? 'text-orange-400' : 'text-orange-600'}>Digital Marketing</strong> mit — 
              von Social Media Strategien ueber Performance Marketing bis hin zu Content Creation. 
              Ich verstehe, wie man Produkte nicht nur baut, sondern auch vermarktet.
            </p>

            <p className={`leading-relaxed ${
              istDunkel ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Meine Erfahrung im B2B-Vertrieb und Account Management rundet mein Profil ab: 
              Ich kommuniziere klar, denke kundenorientiert und liefere Ergebnisse.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              {['Frontend Development', 'UI/UX', 'Digital Marketing', 'Sales', 'Strategisch'].map(tag => (
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
