import { useState, useContext, useRef } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import emailjs from '@emailjs/browser'

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_tvlk6dj'
const EMAILJS_TEMPLATE_ID = 'template_ygcl039'
const EMAILJS_PUBLIC_KEY = 'Mk2_ZRMHb-UvIL-5M'

function Contact() {
  const { istDunkel } = useContext(ThemeContext)
  const formRef = useRef()

  const [formData, setFormData] = useState({ name: '', email: '', nachricht: '' })
  const [fehler, setFehler] = useState({})
  const [istGesendet, setIstGesendet] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sendError, setSendError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Fehler entfernen wenn User tippt
    if (fehler[name]) {
      setFehler(prev => ({ ...prev, [name]: null }))
    }
    // Reset states
    setSendError(null)
    setIstGesendet(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validierungsFehler = validiere()

    if (Object.keys(validierungsFehler).length > 0) {
      setFehler(validierungsFehler)
      setIstGesendet(false)
      return
    }

    setFehler({})
    setIsLoading(true)
    setSendError(null)

    try {
      // EmailJS template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.nachricht,
        to_name: 'Eeraj',
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      setIstGesendet(true)
      setFormData({ name: '', email: '', nachricht: '' })
    } catch (error) {
      console.error('EmailJS Error:', error)
      setSendError('Nachricht konnte nicht gesendet werden. Bitte versuche es später erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field) => `w-full px-4 py-3 rounded-lg border transition-all duration-300 outline-none focus:ring-2 ${
    istDunkel
      ? `bg-[#112240] border-[#233554] text-[#ccd6f6] placeholder-[#8892b0] focus:border-[#64ffda] focus:ring-[#64ffda]/30`
      : `bg-white border-[#e2e8f0] text-[#0a192f] placeholder-[#94a3b8] focus:border-[#0d9488] focus:ring-[#0d9488]/30`
  } ${fehler[field] ? 'border-red-500 focus:ring-red-500/30' : ''}`

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
        }`}>
          <span className={istDunkel ? 'gradient-text' : 'gradient-text-light'}>Kontakt</span>
        </h2>

        <p className={`text-center mb-10 ${
          istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
        }`}>
          Schreib mir eine Nachricht - ich freue mich von dir zu hoeren!
        </p>

        {/* Success Message */}
        {istGesendet && (
          <div className={`mb-8 p-4 rounded-xl text-center font-medium ${
            istDunkel 
              ? 'bg-[#64ffda]/10 border border-[#64ffda]/30 text-[#64ffda]'
              : 'bg-[#0d9488]/10 border border-[#0d9488]/30 text-[#0d9488]'
          }`}>
            Nachricht erfolgreich gesendet! Ich melde mich bald.
          </div>
        )}

        {/* Error Message */}
        {sendError && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 text-center font-medium">
            {sendError}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
              istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
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
              disabled={isLoading}
            />
            {fehler.name && (
              <p className="text-red-500 text-sm mt-1">{fehler.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
              istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
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
              disabled={isLoading}
            />
            {fehler.email && (
              <p className="text-red-500 text-sm mt-1">{fehler.email}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="nachricht" className={`block text-sm font-medium mb-2 ${
              istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
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
              disabled={isLoading}
            />
            {fehler.nachricht && (
              <p className="text-red-500 text-sm mt-1">{fehler.nachricht}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:scale-[1.02]'
            } ${
              istDunkel 
                ? 'bg-[#64ffda] text-[#0a192f] hover:shadow-[0_0_20px_rgba(100,255,218,0.4)]'
                : 'bg-[#0d9488] text-white hover:bg-[#0f766e] hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Wird gesendet...
              </span>
            ) : (
              'Nachricht senden'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
