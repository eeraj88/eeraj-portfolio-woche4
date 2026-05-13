import { useState, useEffect } from 'react'
import Leaderboard from './Leaderboard'
import { AnimatedThemeToggler } from './ui/AnimatedThemeToggler'

const SPOTIFY_PLAYLIST_ID = '55f8XIuabL2aM5SANjYT9B'

const C = {
  cyan: 'var(--cyan)',
  cyanGlow: 'var(--cyan-glow)',
  cyanBorder: 'var(--cyan-border)',
  cyanBorderStrong: 'var(--cyan-border-strong)',
  cyanBg: 'var(--cyan-bg-soft)',
  bg0: 'var(--bg-0)',
  bg1: 'var(--bg-1)',
  bg2: 'var(--bg-2)',
  text2: 'var(--text-2)',
  text3: 'var(--text-3)',
}
const fontMono = "'JetBrains Mono', ui-monospace, monospace"
const fontDisplay = "'Space Grotesk', system-ui, sans-serif"
const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

function NavLink({ label, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: fontMono,
        fontSize: '13px',
        color: hovered ? C.cyan : C.text2,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px 0',
        position: 'relative',
        transition: `color 0.2s ${ease}`,
      }}
    >
      <span style={{
        color: C.cyan,
        opacity: hovered ? 1 : 0,
        marginRight: '4px',
        transition: `opacity 0.2s ${ease}`,
      }}>//</span>
      {label}
      {/* Underline */}
      <span style={{
        position: 'absolute', left: 0, right: 0, bottom: '-2px',
        height: '1px',
        background: C.cyan,
        boxShadow: `0 0 8px ${C.cyanGlow}`,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: `transform 0.3s ${ease}`,
        display: 'block',
      }} />
    </button>
  )
}

function Header({ istDunkel, toggleDarkMode, scrollToSection, aboutRef, skillsRef, projectsRef, testimonialsRef, contactsRef }) {
  const [menuOffen, setMenuOffen] = useState(false)
  const [spotifyOpen, setSpotifyOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { label: 'About', ref: aboutRef },
    { label: 'Skills', ref: skillsRef },
    { label: 'Projekte', ref: projectsRef },
    { label: 'Referenzen', ref: testimonialsRef },
    { label: 'Kontakt', ref: contactsRef },
  ]

  const handleNav = (ref) => {
    scrollToSection(ref)
    setMenuOffen(false)
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
      padding: '14px 0',
      background: isScrolled
        ? 'color-mix(in srgb, var(--bg-0) 88%, transparent)'
        : 'color-mix(in srgb, var(--bg-1) 55%, transparent)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      borderBottom: `1px solid ${isScrolled ? 'var(--cyan-border-strong)' : 'var(--cyan-border)'}`,
      boxShadow: isScrolled ? 'var(--glow-sm)' : 'none',
      transition: `background 0.3s, border-color 0.3s`,
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        padding: '0 24px 0 24px',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '24px',
      }}>
        {/* Brand - LEFT */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1.1, justifySelf: 'start' }}
        >
          <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: '19px', letterSpacing: '-0.01em', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ color: 'var(--cyan)', textShadow: `0 0 18px var(--cyan-glow)` }}>Eeraj</span>
            <span style={{ color: 'var(--text-3)' }}>.</span>
            <span style={{ color: 'var(--text-0)' }}>dev</span>
          </div>
          <span style={{ display: 'block', fontFamily: fontMono, fontSize: '10px', color: C.text3, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
            Portfolio
          </span>
        </button>

        {/* Desktop nav - CENTERED */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', justifySelf: 'center' }} className="hidden-mobile">
          {navItems.map(({ label, ref }) => (
            <NavLink key={label} label={label} onClick={() => handleNav(ref)} />
          ))}
        </nav>

        {/* Actions - RIGHT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifySelf: 'end' }}>
          <Leaderboard isNav={true} iconOnly={true} />

          {/* Spotify */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSpotifyOpen(v => !v)}
              title="Meine Musik"
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: C.bg2,
                border: `1px solid ${C.cyanBorder}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#1DB954', cursor: 'pointer',
                transition: `all 0.25s ${ease}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.cyanBorderStrong
                e.currentTarget.style.boxShadow = `0 0 18px ${C.cyanGlow}`
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.cyanBorder
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.75 }}>
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </button>
            {spotifyOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setSpotifyOpen(false)} />
                <div style={{
                  position: 'absolute', right: 0, top: '48px',
                  width: '320px', borderRadius: '16px',
                  overflow: 'hidden', zIndex: 50,
                  background: C.bg2,
                  border: `1px solid ${C.cyanBorder}`,
                  boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${C.cyanBg}`,
                }}>
                  <iframe
                    src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
                    width="100%" height="352" frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </>
            )}
          </div>

          <AnimatedThemeToggler variant="circle" />

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOffen(v => !v)}
            className="show-mobile"
            style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: C.bg2,
              border: `1px solid ${C.cyanBorder}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: C.text2, cursor: 'pointer',
            }}
            aria-label="Menu"
          >
            {menuOffen ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOffen && (
        <div style={{
          padding: '16px 24px',
          background: 'color-mix(in srgb, var(--bg-0) 96%, transparent)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${C.cyanBorder}`,
          animation: 'slideDown 0.3s ease',
        }}>
          {navItems.map(({ label, ref }) => (
            <button
              key={label}
              onClick={() => handleNav(ref)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 0', fontFamily: fontMono, fontSize: '14px',
                color: C.text2, background: 'none', border: 'none',
                cursor: 'pointer', borderBottom: `1px solid ${C.cyanBorder}`,
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.cyan}
              onMouseLeave={e => e.currentTarget.style.color = C.text2}
            >
              <span style={{ color: C.cyan, marginRight: '8px' }}>//</span>{label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 820px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 821px) { .show-mobile { display: none !important; } }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  )
}

export default Header
