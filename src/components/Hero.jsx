function Hero({ istDunkel }) {
  return (
    <section className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center pt-12">
        <p className={`text-sm font-medium uppercase tracking-widest mb-4 ${
          istDunkel ? 'text-blue-400' : 'text-blue-600'
        }`}>
          Willkommen auf meinem Portfolio
        </p>

        <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Hi, ich bin{' '}
          <span className={istDunkel ? 'text-blue-400' : 'text-blue-600'}>
            Max Mustermann
          </span>
        </h1>

        <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
          istDunkel ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Junior Frontend-Entwickler in Ausbildung. Ich lerne React, baue Projekte
          und suche ein Praktikum im Webentwicklungs-Bereich.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#projects"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Meine Projekte
          </a>
          <a
            href="#contact"
            className={`px-6 py-3 rounded-lg font-medium border-2 transition-colors ${
              istDunkel
                ? 'border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400'
                : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
            }`}
          >
            Kontakt aufnehmen
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
