import { useState } from 'react'

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

  const handleNavigation = (ref) => {
    scrollToSection(ref)
    setMenuOffen(false)
  }

  const navLinkClass = `text-sm font-medium transition-all duration-300 hover:scale-105 ${
    istDunkel
      ? 'text-[#8892b0] hover:text-[#64ffda]'
      : 'text-[#475569] hover:text-[#0d9488]'
  }`

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      istDunkel
        ? 'bg-[#0a192f]/95 border-b border-[#233554]'
        : 'bg-white/95 border-b border-gray-200'
    } backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`text-xl font-bold transition-colors ${
            istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
          }`}
        >
          <span className={istDunkel ? 'gradient-text' : 'gradient-text-light'}>Eeraj</span>
          <span className={istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'}>.dev</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => handleNavigation(aboutRef)} className={navLinkClass}>
            About
          </button>
          <button onClick={() => handleNavigation(skillsRef)} className={navLinkClass}>
            Skills
          </button>
          <button onClick={() => handleNavigation(projectsRef)} className={navLinkClass}>
            Projekte
          </button>
          <button onClick={() => handleNavigation(testimonialsRef)} className={navLinkClass}>
            Referenzen
          </button>
          <button onClick={() => handleNavigation(contactsRef)} className={navLinkClass}>
            Kontakt
          </button>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Spotify Button */}
          <div className="relative">
            <button
              onClick={() => setSpotifyOpen(!spotifyOpen)}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 flex items-center gap-1 ${
                istDunkel
                  ? 'bg-[#112240] hover:bg-[#1d3557] border border-[#233554]'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Meine Musik"
            >
              <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </button>

            {/* Spotify Dropdown */}
            {spotifyOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setSpotifyOpen(false)}
                />
                <div className={`absolute right-0 top-12 w-80 rounded-xl shadow-2xl overflow-hidden z-50 ${
                  istDunkel ? 'bg-[#112240] border border-[#233554]' : 'bg-white border border-gray-200'
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

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
              istDunkel
                ? 'bg-[#112240] text-[#64ffda] hover:bg-[#1d3557] border border-[#233554]'
                : 'bg-gray-100 text-[#0d9488] hover:bg-gray-200'
            }`}
            aria-label={istDunkel ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
          >
            {istDunkel ? '☀️' : '🌙'}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOffen(!menuOffen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              istDunkel
                ? 'bg-[#112240] text-[#ccd6f6] hover:bg-[#1d3557] border border-[#233554]'
                : 'bg-gray-100 text-[#0a192f] hover:bg-gray-200'
            }`}
            aria-label="Menu oeffnen"
          >
            {menuOffen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOffen && (
        <div className={`md:hidden px-4 pb-4 ${
          istDunkel ? 'bg-[#0a192f]/98' : 'bg-white/98'
        } backdrop-blur-md`}>
          <nav className="flex flex-col gap-2">
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
                    ? 'text-[#8892b0] hover:bg-[#112240] hover:text-[#64ffda]'
                    : 'text-[#475569] hover:bg-gray-100 hover:text-[#0d9488]'
                }`}
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
