function About({ istDunkel }) {
  return (
    <section id="about" className="py-16 px-4">
      <div className={`max-w-4xl mx-auto rounded-2xl p-8 md:p-12 ${
        istDunkel ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Ueber mich
        </h2>

        <div className={`space-y-4 text-lg leading-relaxed ${
          istDunkel ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <p>
            Ich bin Teilnehmer bei Morphos GmbH und lerne dort Frontend-Entwicklung
            mit HTML, CSS, JavaScript und React. Vorher habe ich mit Bootstrap
            gearbeitet, jetzt steige ich auf Tailwind CSS um.
          </p>
          <p>
            Mein Ziel ist es, als Junior Frontend Developer in einem Unternehmen
            einzusteigen. Ich bin motiviert, lernbereit und arbeite jeden Tag
            an meinen Skills.
          </p>
          <p>
            In meiner Freizeit baue ich kleine Projekte, um das Gelernte
            anzuwenden. Dieses Portfolio ist eines davon.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
