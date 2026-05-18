import { useState, useContext, useRef } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import { useLanguage } from '../Context/LanguageContext'
import translations from '../translations/de'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'service_tvlk6dj'
const EMAILJS_TEMPLATE_ID = 'template_ygcl039'
const EMAILJS_PUBLIC_KEY = 'Mk2_ZRMHb-UvIL-5M'

const C = {
  cyan: 'var(--cyan)',
  cyanGlow: 'var(--cyan-glow)',
  cyanBorder: 'var(--cyan-border)',
  cyanFocus: 'var(--cyan-bg-soft)',
  bg0: 'var(--bg-0)',
  bg1: 'var(--bg-1)',
  bg2: 'var(--bg-2)',
  text0: 'var(--text-0)',
  text1: 'var(--text-1)',
  text2: 'var(--text-2)',
  text3: 'var(--text-3)',
}
const fontDisplay = "'Space Grotesk', system-ui, sans-serif"
const fontMono = "'JetBrains Mono', ui-monospace, monospace"
const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

function Contact() {
  const { istDunkel } = useContext(ThemeContext)
  const { language } = useLanguage()
  const t = language === 'de' ? translations : require('../translations/en').default
  const formRef = useRef()

  const [formData, setFormData] = useState({ name: '', email: '', nachricht: '' })
  const [fehler, setFehler] = useState({})
  const [istGesendet, setIstGesendet] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sendError, setSendError] = useState(null)
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fehler[name]) setFehler(prev => ({ ...prev, [name]: null }))
    setSendError(null)
    setIstGesendet(false)
  }

  const validiere = () => {
    const f = {}
    if (formData.name.trim().length < 3) f.name = 'Mindestens 3 Zeichen'
    if (!formData.email.includes('@') || !formData.email.includes('.')) f.email = 'Gültige E-Mail eingeben'
    if (formData.nachricht.trim().length < 10) f.nachricht = 'Mindestens 10 Zeichen'
    return f
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const vf = validiere()
    if (Object.keys(vf).length > 0) { setFehler(vf); return }
    setFehler({})
    setIsLoading(true)
    setSendError(null)
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.nachricht,
        to_name: 'Eeraj',
      }, EMAILJS_PUBLIC_KEY)
      setIstGesendet(true)
      setFormData({ name: '', email: '', nachricht: '' })
    } catch (err) {
      console.error('EmailJS Error:', err)
      setSendError('Konnte nicht gesendet werden. Bitte später erneut versuchen.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '13px 16px',
    background: C.bg1,
    border: `1px solid ${fehler[field] ? '#ef4444' : focusedField === field ? 'var(--cyan)' : 'var(--cyan-border)'}`,
    borderRadius: '10px',
    color: C.text0,
    fontFamily: fontMono,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: focusedField === field
      ? (fehler[field] ? '0 0 0 3px rgba(239,68,68,0.15)' : `0 0 0 3px ${C.cyanFocus}`)
      : 'none',
    transition: `border-color 0.2s ${ease}, box-shadow 0.2s ${ease}`,
    resize: field === 'nachricht' ? 'vertical' : undefined,
  })

  return (
    <section
      id="contact"
      style={{ padding: '96px 0', background: 'var(--bg-2)', position: 'relative' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section head */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: fontMono, fontSize: '12px', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: C.cyan,
          }}>
            <span style={{ width: '24px', height: '1px', background: C.cyan, boxShadow: `0 0 6px ${C.cyanGlow}`, display: 'inline-block' }} />
            06 — Kontakt
          </span>
          <h2 style={{
            fontFamily: fontDisplay,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05,
            margin: '16px 0 12px',
            color: 'var(--text-0)',
          }}>
            <em style={{ fontStyle: 'normal', color: 'var(--cyan)', textShadow: '0 0 24px var(--cyan-glow)' }}>Kontakt</em>
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
            Schreib mir eine Nachricht — ich freue mich von dir zu hören!
          </p>
        </div>

        {/* Contact shell */}
        <div
          className="reveal"
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            background: C.bg2,
            border: `1px solid var(--cyan-border)`,
            borderRadius: '24px',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Cyan top-line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
            opacity: 0.6,
          }} />

          {/* Success */}
          {istGesendet && (
            <div style={{
              marginBottom: '28px',
              padding: '14px 20px',
              background: 'rgba(34,211,238,0.07)',
              border: `1px solid ${C.cyanBorder}`,
              borderRadius: '10px',
              color: C.cyan,
              fontFamily: fontMono,
              fontSize: '13px',
              letterSpacing: '0.04em',
            }}>
              ✓ Nachricht gesendet — ich melde mich bald.
            </div>
          )}

          {/* Error */}
          {sendError && (
            <div style={{
              marginBottom: '28px',
              padding: '14px 20px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: '10px',
              color: '#f87171',
              fontFamily: fontMono,
              fontSize: '13px',
            }}>
              {sendError}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="cf-name"
                style={{
                  display: 'block', marginBottom: '8px',
                  fontFamily: fontMono, fontSize: '12px',
                  color: C.text2, letterSpacing: '0.06em',
                }}
              >
                <span style={{ color: C.cyan }}>{'> '}</span>Name
              </label>
              <input
                type="text"
                id="cf-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Dein Name"
                disabled={isLoading}
                style={inputStyle('name')}
              />
              {fehler.name && (
                <p style={{ fontFamily: fontMono, fontSize: '11px', color: '#f87171', marginTop: '6px' }}>{fehler.name}</p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label
                htmlFor="cf-email"
                style={{
                  display: 'block', marginBottom: '8px',
                  fontFamily: fontMono, fontSize: '12px',
                  color: C.text2, letterSpacing: '0.06em',
                }}
              >
                <span style={{ color: C.cyan }}>{'> '}</span>E-Mail
              </label>
              <input
                type="email"
                id="cf-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="deine@email.de"
                disabled={isLoading}
                style={inputStyle('email')}
              />
              {fehler.email && (
                <p style={{ fontFamily: fontMono, fontSize: '11px', color: '#f87171', marginTop: '6px' }}>{fehler.email}</p>
              )}
            </div>

            {/* Message */}
            <div style={{ marginBottom: '32px' }}>
              <label
                htmlFor="cf-msg"
                style={{
                  display: 'block', marginBottom: '8px',
                  fontFamily: fontMono, fontSize: '12px',
                  color: C.text2, letterSpacing: '0.06em',
                }}
              >
                <span style={{ color: C.cyan }}>{'> '}</span>Nachricht
              </label>
              <textarea
                id="cf-msg"
                name="nachricht"
                rows={5}
                value={formData.nachricht}
                onChange={handleChange}
                onFocus={() => setFocusedField('nachricht')}
                onBlur={() => setFocusedField(null)}
                placeholder="Deine Nachricht..."
                disabled={isLoading}
                style={inputStyle('nachricht')}
              />
              {fehler.nachricht && (
                <p style={{ fontFamily: fontMono, fontSize: '11px', color: '#f87171', marginTop: '6px' }}>{fehler.nachricht}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '10px',
                background: isLoading ? 'rgba(34,211,238,0.5)' : C.cyan,
                border: 'none',
                color: C.bg0,
                fontFamily: fontMono,
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: isLoading ? 'none' : `0 4px 20px rgba(34,211,238,0.25)`,
                transition: `all 0.3s ${ease}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
              onMouseEnter={e => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#00fff5'
                  e.currentTarget.style.boxShadow = '0 0 32px rgba(34,211,238,0.55), 0 0 60px rgba(34,211,238,0.25)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={e => {
                if (!isLoading) {
                  e.currentTarget.style.background = C.cyan
                  e.currentTarget.style.boxShadow = `0 4px 20px rgba(34,211,238,0.25)`
                  e.currentTarget.style.transform = 'none'
                }
              }}
            >
              {isLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'contactSpin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25"/>
                    <path d="M21 12a9 9 0 00-9-9"/>
                  </svg>
                  Wird gesendet...
                </>
              ) : (
                <>
                  Nachricht senden
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes contactSpin { to { transform: rotate(360deg); } }
        #contact input::placeholder,
        #contact textarea::placeholder { color: #52525b; }
      `}</style>
    </section>
  )
}

export default Contact
