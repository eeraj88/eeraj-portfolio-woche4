import { useContext, useEffect, useState, useRef } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function Hero() {
  const { istDunkel } = useContext(ThemeContext)
  const [heroStage, setHeroStage] = useState(0) // 0=before, 1=typing, 2=done
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [line3, setLine3] = useState('')
  const [currentRole, setCurrentRole] = useState(0)
  const [roleText, setRoleText] = useState('')
  const [roleTyping, setRoleTyping] = useState(false)
  const heroTimers = useRef([])
  const photoBgRef = useRef(null)

  const roles = ['Digital Creative.', 'Frontend Developer.', 'Sales & Consultant.', 'AI Automation.', 'Marketing Strategist.', 'Problem Solver.']

  // Typewriter sequence — runs once on mount ([] deps avoids cleanup killing timers)
  useEffect(() => {
    const timers = heroTimers.current
    const add = (fn, ms) => {
      const t = setTimeout(fn, ms)
      timers.push(t)
    }
    const clearAll = () => {
      timers.forEach(clearTimeout)
      heroTimers.current = []
    }

    setHeroStage(1)

    const typeText = (setter, text, delay, onDone) => {
      let i = 0
      const step = () => {
        if (i <= text.length) {
          setter(text.slice(0, i) + (i < text.length ? '_' : ''))
          i++
          add(step, delay)
        } else {
          setter(text)
          if (onDone) add(onDone, 350)
        }
      }
      step()
    }

    add(() => {
      typeText(setLine1, 'HI', 140, () => {
        add(() => {
          typeText(setLine2, 'ICH BIN', 95, () => {
            if (photoBgRef.current) photoBgRef.current.classList.add('photo-in')
            typeText(setLine3, 'EERAJ JAN', 95, () => {
              setHeroStage(2)
            })
          })
        }, 100)
      })
    }, 900)

    return clearAll
  }, [])

  // Role typewriter after hero done
  useEffect(() => {
    if (heroStage !== 2) return
    let cancelled = false

    const typeRole = (roleIdx) => {
      const text = roles[roleIdx]
      let i = 0
      setRoleText('')
      setRoleTyping(true)

      const type = () => {
        if (cancelled) return
        if (i <= text.length) {
          setRoleText(text.slice(0, i) + (i < text.length ? '▌' : ''))
          i++
          setTimeout(type, 60)
        } else {
          setRoleText(text)
          setRoleTyping(false)
          // Wait 2.5s then erase
          setTimeout(() => {
            if (cancelled) return
            let j = text.length
            const erase = () => {
              if (cancelled) return
              if (j >= 0) {
                setRoleText(text.slice(0, j) + (j > 0 ? '▌' : ''))
                j--
                setTimeout(erase, 35)
              } else {
                const next = (roleIdx + 1) % roles.length
                setCurrentRole(next)
                setTimeout(() => typeRole(next), 400)
              }
            }
            erase()
          }, 2500)
        }
      }
      type()
    }

    typeRole(currentRole)
    return () => { cancelled = true }
  }, [heroStage])

  const c = {
    cyan: 'var(--cyan)',
    cyanGlow: 'var(--cyan-glow)',
    cyanBorder: 'var(--cyan-border)',
    cyanBorderStrong: 'var(--cyan-border-strong)',
    cyanBg: 'var(--cyan-bg-soft)',
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

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--bg-1)',
    }}>
      {/* Grid Background */}
      {istDunkel && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 80%)',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 80%)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Orbs */}
      {istDunkel && (
        <>
          <div style={{
            position: 'absolute', top: '-200px', right: '-150px',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 60%)',
            filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
          }} />
          <div style={{
            position: 'absolute', bottom: '-250px', left: '-200px',
            width: '700px', height: '700px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 60%)',
            filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
          }} />
        </>
      )}

      {/* Faded hero photo bg — uses same foto.jpg, large + masked */}
      {istDunkel && (
        <div
          ref={photoBgRef}
          style={{
            position: 'absolute', top: '-120px', right: '0%', bottom: 0,
            width: '58%', maxWidth: '900px', zIndex: 1,
            pointerEvents: 'none',
            opacity: 0,
            transform: 'translateX(40px) scale(1.04)',
            transition: 'opacity 1.4s ease, transform 2s ease',
          }}
          className="photo-bg"
        >
          <img
            src="/foto.jpg"
            alt=""
            aria-hidden="true"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top center',
              filter: 'grayscale(15%) contrast(1.05) brightness(0.88)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.65) 65%, black 82%)',
              maskImage: 'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.65) 65%, black 82%)',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 3 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 680px)',
          alignItems: 'center',
        }}>
          {/* Left */}
          <div>
            {/* Headline */}
            <h1 style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(2.5rem, 6.4vw, 5.5rem)',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              margin: '0 0 24px',
              color: 'var(--text-0)',
              minHeight: '180px',
            }}>
              <div>{line1 || (heroStage === 0 ? '_' : '')}</div>
              <div>{line2}</div>
              <div style={{
                color: c.cyan,
                textShadow: `0 0 32px var(--cyan-glow)`,
              }}>
                {line3}
              </div>
            </h1>

            {/* Role */}
            <div style={{
              fontFamily: fontMono,
              fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
              color: 'var(--text-1)',
              marginBottom: '28px',
              minHeight: '1.5em',
            }}>
              <span style={{ color: c.text3 }}>&gt; role: </span>
              <span style={{ color: c.cyan }}>{heroStage === 2 ? roleText : ''}</span>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginTop: '48px' }}>
                <a href="#projects" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '14px 26px', fontFamily: fontMono, fontSize: '13px',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  borderRadius: '10px', border: '1px solid transparent',
                  background: c.cyan, color: c.bg0, fontWeight: 600,
                  boxShadow: `0 4px 20px rgba(34,211,238,0.25)`,
                  textDecoration: 'none', transition: `all 0.3s ${ease}`,
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#00fff5'
                    e.currentTarget.style.boxShadow = '0 0 32px rgba(34,211,238,0.55), 0 0 60px rgba(34,211,238,0.25)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = c.cyan
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,211,238,0.25)'
                    e.currentTarget.style.transform = 'none'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                  Meine Projekte
                </a>

                <a href="#contact" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '14px 26px', fontFamily: fontMono, fontSize: '13px',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  borderRadius: '10px', border: `1px solid ${c.cyanBorderStrong}`,
                  background: 'transparent', color: c.cyan,
                  textDecoration: 'none', transition: `all 0.3s ${ease}`,
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = c.cyanBg
                    e.currentTarget.style.borderColor = c.cyan
                    e.currentTarget.style.boxShadow = `0 0 12px ${c.cyanGlow}`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = c.cyanBorderStrong
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'none'
                  }}
                >
                  Kontakt aufnehmen
                </a>

                <a href="/lebenslauf.pdf" download style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '14px 26px', fontFamily: fontMono, fontSize: '13px',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  borderRadius: '10px', border: `1px solid var(--cyan-border)`,
                  background: 'var(--bg-2)', color: 'var(--text-2)',
                  textDecoration: 'none', transition: `all 0.3s ${ease}`,
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = c.cyan
                    e.currentTarget.style.borderColor = c.cyanBorderStrong
                    e.currentTarget.style.background = c.bg2
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-2)'
                    e.currentTarget.style.borderColor = 'var(--cyan-border)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  CV
                </a>
              </div>

            {/* Availability Badge — appears after typewriter */}
            {heroStage === 2 && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                fontFamily: fontMono, fontSize: '13px', letterSpacing: '0.16em',
                textTransform: 'uppercase', color: c.cyan, marginTop: '32px',
                animation: 'badgePulse 2s ease-in-out infinite',
              }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: c.cyan,
                  boxShadow: `0 0 12px ${c.cyanGlow}, 0 0 20px ${c.cyanGlow}`,
                  display: 'inline-block',
                  animation: 'badgeDotPulse 2s ease-in-out infinite',
                }} />
                Verfügbar für neue Projekte
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        fontFamily: fontMono, fontSize: '11px', letterSpacing: '0.2em',
        color: c.text3, textTransform: 'uppercase', zIndex: 3,
      }}>
        scroll
        <div style={{
          width: '1px', height: '40px',
          background: `linear-gradient(180deg, ${c.cyan}, transparent)`,
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>

      {/* Keyframes via style tag — safe in Vite */}
      <style>{`
        @keyframes heroPing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.6; }
        }
        @keyframes heroSpin { to { transform: rotate(360deg); } }
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 0.6; }
          50% { transform: scaleY(1.3); opacity: 1; }
        }
        @keyframes badgePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes badgeDotPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 12px rgba(34,211,238,0.45), 0 0 20px rgba(34,211,238,0.45);
          }
          50% {
            transform: scale(1.3);
            box-shadow: 0 0 16px rgba(34,211,238,0.65), 0 0 32px rgba(34,211,238,0.55);
          }
        }
        .photo-bg.photo-in {
          opacity: 0.35 !important;
          transform: translateX(0) scale(1) !important;
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

export default Hero
