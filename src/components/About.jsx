import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function About() {
  const { istDunkel } = useContext(ThemeContext)

  return (
    <section id="about" className="py-20 px-4">
      <div className={`max-w-4xl mx-auto rounded-2xl p-8 md:p-12 transition-all duration-300 ${
        istDunkel 
          ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm' 
          : 'bg-white/80 shadow-xl backdrop-blur-sm'
      }`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Ueber <span className="gradient-text">mich</span>
        </h2>

        <div className={`space-y-4 text-lg leading-relaxed ${
          istDunkel ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <p>
            Ich lerne aktuell Frontend-Entwicklung mit <span className={istDunkel ? 'text-orange-400' : 'text-orange-600'}>HTML, CSS, JavaScript, React</span> und 
            Tailwind CSS. Dabei baue ich praktische Projekte, um das Gelernte direkt anzuwenden.
          </p>

          <p>
            Mein Ziel ist es, mich als <span className={istDunkel ? 'text-orange-400' : 'text-orange-600'}>Junior Web Developer</span> weiterzuentwickeln
            und saubere, moderne und responsive Webseiten zu bauen.
          </p>

          <p>
            Dieses Portfolio zeigt meinen aktuellen Lernstand, meine Projekte
            und die Technologien, mit denen ich arbeite.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-700/30">
          {[
            { value: '3+', label: 'Projekte' },
            { value: '10+', label: 'Skills' },
            { value: '2026', label: 'Lernstart' }
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{value}</p>
              <p className={`text-sm ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
