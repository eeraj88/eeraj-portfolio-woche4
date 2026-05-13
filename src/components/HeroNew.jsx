import { useState, useEffect } from 'react'

function HeroNew() {
  const [typedText, setTypedText] = useState('')
  const [showCaret, setShowCaret] = useState(true)
  const [typingComplete, setTypingComplete] = useState(false)

  const roles = ['Frontend Developer', 'Digital Creative', 'UI/UX Enthusiast', 'React Developer']
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [roleText, setRoleText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)

  // Typewriter für Role
  useEffect(() => {
    if (typingComplete) return

    const currentRole = roles[currentRoleIndex]

    if (roleIndex < currentRole.length) {
      const timeout = setTimeout(() => {
        setRoleText(prev => prev + currentRole[roleIndex])
        setRoleIndex(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setRoleText('')
        setRoleIndex(0)
        setCurrentRoleIndex(prev => (prev + 1) % roles.length)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [roleIndex, currentRoleIndex, typingComplete, roles])

  // Haupt-Typewriter
  useEffect(() => {
    const mainText = 'HI, ICH BIN EERAJ JAN'
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < mainText.length) {
        setTypedText(prev => prev + mainText[index])
        index++
      } else {
        clearInterval(typeInterval)
        setTypingComplete(true)
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [])

  // Caret blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCaret(prev => !prev)
    }, 650)
    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="fx-grid"></div>
      <div className="fx-vignette"></div>
      <div className="fx-cursor" id="cursor-glow"></div>

      {/* Hero Orbs */}
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>

      <div className="container relative z-10">
        <div className="hero-inner">
          {/* Left Content */}
          <div className="hero-content">
            {/* Eyebrow */}
            <div className="hero-eyebrow">
              <span className="dot"></span>
              <span>Available for work</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              {typedText}
              <span className={`caret ${showCaret ? '' : 'gone'}`}>|</span>
            </h1>

            {/* Role Typewriter */}
            <div className="hero-role">
              <span className="tw-prefix">&gt;</span>
              <span className="tw-text">{roleText}</span>
            </div>

            {/* Availability Badge */}
            <div className="hero-availability">
              <span className="avail-dot"></span>
              <span>Open to opportunities</span>
            </div>

            {/* Lead Text */}
            {typingComplete && (
              <p className="hero-lead">
                Ich bin ein leidenschaftlicher Frontend Developer aus Deutschland,
                spezialisiert auf React, TypeScript und moderne UI/UX.
                Ich kreibe digitale Erlebnisse die begeistern.
              </p>
            )}

            {/* CTA Buttons */}
            {typingComplete && (
              <div className="cta-row">
                <a href="#projects" className="btn btn-primary">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  Projekte
                </a>
                <a href="#contact" className="btn btn-ghost">
                  Kontakt
                </a>
                <a href="/lebenslauf.pdf" download className="btn btn-ghost">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  CV
                </a>
              </div>
            )}
          </div>

          {/* Photo */}
          <div className="hero-photo-wrap">
            <div className="hero-photo-ring"></div>
            <img
              src="/src/assets/hero.png"
              alt="Eeraj Jan"
              className="hero-photo"
            />
          </div>
        </div>
      </div>

      {/* Scroll Cue */}
      <div className="scroll-cue">
        <span>Scroll</span>
      </div>

      <style>{`
        .hero-orb {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34, 211, 238, 0.18) 0%, transparent 60%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .hero-orb-1 { top: -200px; right: -150px; }
        .hero-orb-2 {
          bottom: -250px; left: -200px;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(34, 211, 238, 0.10) 0%, transparent 60%);
          animation: orbFloat 18s ease-in-out infinite alternate;
        }

        .hero-inner {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; gap: 48px; }
          .hero-photo-wrap { order: -1; justify-self: center; }
        }

        .hero-eyebrow {
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.16em;
          color: var(--cyan);
          text-transform: uppercase;
          margin-bottom: 24px;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .hero-eyebrow .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 10px var(--cyan-glow);
          animation: ping 2s ease-in-out infinite;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6.4vw, 5.5rem);
          font-weight: 600;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0 0 24px;
          color: var(--text-0);
        }
        .hero-title .caret {
          color: var(--cyan);
          text-shadow: 0 0 24px var(--cyan-glow);
        }
        .hero-title .caret.gone { display: none; }

        .hero-role {
          font-family: var(--font-mono);
          font-size: clamp(1rem, 1.6vw, 1.25rem);
          color: var(--text-1);
          margin-bottom: 28px;
          min-height: 1.5em;
        }
        .hero-role .tw-prefix { color: var(--text-3); }
        .hero-role .tw-text { color: var(--cyan); }

        .hero-availability {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-2);
          padding: 8px 14px;
          border-radius: var(--r-full);
          border: 1px solid var(--cyan-border);
          background: rgba(34,211,238,0.04);
          margin-bottom: 28px;
        }
        .hero-availability .avail-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 10px var(--cyan-glow);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .hero-lead {
          display: block;
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-2);
          max-width: 560px;
          margin: 0 0 40px;
        }

        .cta-row { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }

        .hero-photo-wrap {
          position: relative;
          width: 280px; height: 280px;
        }
        .hero-photo {
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--cyan);
          box-shadow: var(--glow-md), 0 0 0 8px rgba(34,211,238,0.08);
          position: relative; z-index: 2;
        }
        .hero-photo-ring {
          position: absolute; inset: -16px;
          border-radius: 50%;
          border: 1px solid var(--cyan-border);
          animation: spin 20s linear infinite;
        }
        .hero-photo-ring::before, .hero-photo-ring::after {
          content: ""; position: absolute;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 10px var(--cyan-glow);
        }
        .hero-photo-ring::before { top: -4px; left: 50%; transform: translateX(-50%); }
        .hero-photo-ring::after { bottom: -4px; left: 50%; transform: translateX(-50%); }
        @keyframes spin { to { transform: rotate(360deg); } }

        .scroll-cue {
          position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--text-3);
          text-transform: uppercase;
          z-index: 3;
        }
        .scroll-cue::after {
          content: ""; width: 1px; height: 40px;
          background: linear-gradient(180deg, var(--cyan), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 0.6; }
          50% { transform: scaleY(1.3); opacity: 1; }
        }
      `}</style>
    </section>
  )
}

export default HeroNew
