import { useState, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function Contact() {
  const { istDunkel } = useContext(ThemeContext)

  const [formData, setFormData] = useState({ name: '', email: '', nachricht: '' })
  const [fehler, setFehler] = useState({})
  const [istGesendet, setIstGesendet] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Fehler entfernen wenn User tippt
    if (fehler[name]) {
      setFehler(prev => ({ ...prev, [name]: null }))
    }
  }

  const validiere = () => {
    const neueFehler = {}

    if (formData.name.trim().length < 3) {
      neueFehler.name = 'Name muss mindestens 3 Zeichen haben'
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      neueFehler.email = 'Bitte gueltige E-Mail eingeben'
    }
    if (formData.nachricht.trim().length < 10) {
      neueFehler.nachricht = 'Nachricht muss mindestens 10 Zeichen haben'
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
    setFormData({ name: '', email: '', nachricht: '' })
  }

  const inputClass = (field) => `w-full px-4 py-3 rounded-lg border transition-all duration-300 outline-none focus:ring-2 focus:ring-orange-500 ${
    istDunkel
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500'
  } ${fehler[field] ? 'border-red-500 focus:ring-red-500' : ''}`

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          <span className="gradient-text">Kontakt</span>
        </h2>

        <p className={`text-center mb-10 ${
          istDunkel ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Schreib mir eine Nachricht - ich freue mich von dir zu hoeren!
        </p>

        {/* Success Message */}
        {istGesendet && (
          <div className="mb-8 p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-400 text-center font-medium">
            Nachricht erfolgreich gesendet! Ich melde mich bald.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
              istDunkel ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dein Name"
              className={inputClass('name')}
            />
            {fehler.name && (
              <p className="text-red-500 text-sm mt-1">{fehler.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
              istDunkel ? 'text-gray-300' : 'text-gray-700'
            }`}>
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="deine@email.de"
              className={inputClass('email')}
            />
            {fehler.email && (
              <p className="text-red-500 text-sm mt-1">{fehler.email}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="nachricht" className={`block text-sm font-medium mb-2 ${
              istDunkel ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Nachricht
            </label>
            <textarea
              id="nachricht"
              name="nachricht"
              rows="5"
              value={formData.nachricht}
              onChange={handleChange}
              placeholder="Deine Nachricht..."
              className={`${inputClass('nachricht')} resize-none`}
            />
            {fehler.nachricht && (
              <p className="text-red-500 text-sm mt-1">{fehler.nachricht}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Nachricht senden
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
