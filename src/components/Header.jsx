import { useState } from 'react'

function Header({
  istDunkel,
  toggleDarkMode,
  scrollToSection,
  aboutRef,
  skillsRef,
  projectsRef,
  contactsRef
}) {
  const [menuOffen, setMenuOffen] = useState(false)

  const handleNavigation = (ref) => {
    scrollToSection(ref)
    setMenuOffen(false)
  }

  const navLinkClass = `text-sm font-medium transition-all duration-300 hover:scale-105 ${
    istDunkel
      ? 'text-gray-300 hover:text-orange-400'
      : 'text-gray-600 hover:text-orange-600'
  }`

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      istDunkel
        ? 'bg-gray-900/90 border-b border-gray-800'
        : 'bg-white/90 border-b border-gray-200'
    } backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`text-xl font-bold transition-colors ${
            istDunkel ? 'text-white' : 'text-gray-900'
          }`}
        >
          <span className="gradient-text">Eeraj</span>
          <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>.dev</span>
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
          <button onClick={() => handleNavigation(contactsRef)} className={navLinkClass}>
            Kontakt
          </button>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
              istDunkel
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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
          istDunkel ? 'bg-gray-900/95' : 'bg-white/95'
        } backdrop-blur-md`}>
          <nav className="flex flex-col gap-2">
            {[
              { label: 'About', ref: aboutRef },
              { label: 'Skills', ref: skillsRef },
              { label: 'Projekte', ref: projectsRef },
              { label: 'Kontakt', ref: contactsRef }
            ].map(({ label, ref }) => (
              <button
                key={label}
                onClick={() => handleNavigation(ref)}
                className={`text-left px-4 py-3 rounded-lg transition-colors ${
                  istDunkel
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-orange-400'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
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
