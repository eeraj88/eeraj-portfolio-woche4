import { useState, useEffect } from 'react'
import Leaderboard from './Leaderboard'
import { AnimatedThemeToggler } from './ui/AnimatedThemeToggler'

const SPOTIFY_PLAYLIST_ID = '55f8XIuabL2aM5SANjYT9B'

function Header({
  istDunkel,
  toggleDarkMode,
  scrollToSection,
  aboutRef,
  skillsRef,
  projectsRef,
  testimonialsRef,
  contactsRef
}) {
  const [menuOffen, setMenuOffen] = useState(false)
  const [spotifyOpen, setSpotifyOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleNavigation = (ref) => {
    scrollToSection(ref)
    setMenuOffen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinkClass = `text-sm font-medium transition-all duration-300 hover:scale-105 relative group`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
          >
            <div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
            >
              E
            </div>
            <div className="flex flex-col">
              <span
                className={`text-lg font-bold transition-colors ${istDunkel ? 'text-white' : 'text-black'}`}
                style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
              >
                Eeraj Jan
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.2em] ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Portfolio
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { label: 'About', ref: aboutRef },
            { label: 'Skills', ref: skillsRef },
            { label: 'Projekte', ref: projectsRef },
            { label: 'Referenzen', ref: testimonialsRef },
            { label: 'Kontakt', ref: contactsRef }
          ].map(({ label, ref }) => (
            <button
              key={label}
              onClick={() => handleNavigation(ref)}
              className={navLinkClass}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span className={istDunkel ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}>
                {label}
              </span>
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full`}></span>
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Leaderboard isNav={true} iconOnly={true} />

          <div className="relative">
            <button
              onClick={() => setSpotifyOpen(!spotifyOpen)}
              className={`w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                istDunkel
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Meine Musik"
            >
              <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </button>

            {spotifyOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSpotifyOpen(false)} />
                <div className={`absolute right-0 top-12 w-80 rounded-xl shadow-2xl overflow-hidden z-50 ${
                  istDunkel ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'
                }`}>
                  <iframe
                    src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=${istDunkel ? '0' : '1'}`}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </>
            )}
          </div>

          <AnimatedThemeToggler variant="circle" />

          <button
            onClick={() => setMenuOffen(!menuOffen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              istDunkel
                ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
            aria-label="Menu oeffnen"
          >
            {menuOffen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOffen && (
        <div className={`lg:hidden px-4 pb-4 ${
          istDunkel ? 'bg-black/98 backdrop-blur-xl' : 'bg-white/98 backdrop-blur-xl'
        }`}>
          <nav className="flex flex-col gap-2 pt-4">
            {[
              { label: 'About', ref: aboutRef },
              { label: 'Skills', ref: skillsRef },
              { label: 'Projekte', ref: projectsRef },
              { label: 'Referenzen', ref: testimonialsRef },
              { label: 'Kontakt', ref: contactsRef }
            ].map(({ label, ref }) => (
              <button
                key={label}
                onClick={() => handleNavigation(ref)}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${
                  istDunkel
                    ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
