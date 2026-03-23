import { useState } from 'react'

function Contact({ istDunkel }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nachricht, setNachricht] = useState('')
  const [fehler, setFehler] = useState({})
  const [istGesendet, setIstGesendet] = useState(false)

  const validiere = () => {
    const neueFehler = {}

    if (name.length < 3) {
      neueFehler.name = 'Name muss mindestens 3 Zeichen lang sein.'
    }

    if (!email.includes('@') || !email.includes('.')) {
      neueFehler.email = 'Bitte eine gueltige E-Mail-Adresse eingeben.'
    }

    if (nachricht.length < 10) {
      neueFehler.nachricht = 'Nachricht muss mindestens 10 Zeichen lang sein.'
    }

    return neueFehler
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validierungsFehler = validiere()

    if (Object.keys(validierungsFehler).length > 0) {
      setFehler(validierungsFehler)
      setIstGesendet(false)
      return
    }

    setFehler({})
    setIstGesendet(true)
    setName('')
    setEmail('')
    setNachricht('')
  }

  return (
    <section id="contact" className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Kontakt
        </h2>
        <p className={`text-center mb-8 ${
          istDunkel ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Schreib mir eine Nachricht
        </p>

        {istGesendet && (
          <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-700 text-center font-medium">
            Nachricht erfolgreich gesendet! Ich melde mich bald.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium mb-1.5 ${
                istDunkel ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
                istDunkel
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } ${fehler.name ? 'border-red-500' : ''}`}
            />
            {fehler.name && (
              <p className="text-red-500 text-sm mt-1">{fehler.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-1.5 ${
                istDunkel ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
                istDunkel
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } ${fehler.email ? 'border-red-500' : ''}`}
            />
            {fehler.email && (
              <p className="text-red-500 text-sm mt-1">{fehler.email}</p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="nachricht"
              className={`block text-sm font-medium mb-1.5 ${
                istDunkel ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Nachricht
            </label>
            <textarea
              id="nachricht"
              rows="5"
              value={nachricht}
              onChange={(e) => setNachricht(e.target.value)}
              placeholder="Deine Nachricht..."
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                istDunkel
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } ${fehler.nachricht ? 'border-red-500' : ''}`}
            />
            {fehler.nachricht && (
              <p className="text-red-500 text-sm mt-1">{fehler.nachricht}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Nachricht senden
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
