import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function About() {
  const { istDunkel } = useContext(ThemeContext)

  return (
    <section id="about" className="py-16 px-4">
      <div
        className={`max-w-4xl mx-auto rounded-2xl p-8 md:p-12 ${
          istDunkel ? 'bg-gray-800' : 'bg-gray-50'
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 text-center ${
            istDunkel ? 'text-white' : 'text-gray-900'
          }`}
        >
          Ueber mich
        </h2>

        <div
          className={`space-y-4 text-lg leading-relaxed ${
            istDunkel ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          <p>
            Ich lerne aktuell Frontend-Entwicklung mit HTML, CSS, JavaScript,
            React und Tailwind CSS. Dabei baue ich praktische Projekte, um das
            Gelernte direkt anzuwenden.
          </p>

          <p>
            Mein Ziel ist es, mich als Junior Web Developer weiterzuentwickeln
            und saubere, moderne und responsive Webseiten zu bauen.
          </p>

          <p>
            Dieses Portfolio zeigt meinen aktuellen Lernstand, meine Projekte
            und die Technologien, mit denen ich arbeite.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About