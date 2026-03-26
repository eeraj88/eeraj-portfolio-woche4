import { useContext, useRef, useState } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function VideoIntro() {
  const { istDunkel } = useContext(ThemeContext)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  function handlePlayPause() {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

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
          {/* Video */}
          <div className="w-full lg:w-1/2">
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${
              istDunkel ? 'ring-2 ring-orange-500/30' : 'ring-1 ring-gray-200'
            }`}>
              <video
                ref={videoRef}
                src="/intro-video.mp4"
                className="w-full aspect-video object-cover"
                onClick={handlePlayPause}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                controls
                poster="/foto.jpg"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 space-y-4">
            <h3 className={`text-2xl font-bold ${
              istDunkel ? 'text-white' : 'text-gray-900'
            }`}>
              Ein kreativer Nerd
            </h3>

            <p className={`leading-relaxed ${
              istDunkel ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Ich bin ein vielseitiger Kreativer mit einer Leidenschaft fuer Technologie und Design. 
              Mein Hintergrund in Marketing und digitaler Content-Erstellung gibt mir einen 
              einzigartigen Blickwinkel auf Webentwicklung.
            </p>

            <p className={`leading-relaxed ${
              istDunkel ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Von Social Media Strategien bis hin zu React-Anwendungen — ich bringe 
              Kreativitaet und technisches Know-how zusammen, um Projekte zu schaffen, 
              die nicht nur funktionieren, sondern auch begeistern.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              {['Kreativ', 'Technisch', 'Strategisch', 'Lernbereit'].map(tag => (
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
