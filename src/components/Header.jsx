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

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        istDunkel
          ? 'bg-gray-900/95 border-b border-gray-700'
          : 'bg-white/95 border-b border-gray-200'
      } backdrop-blur-sm`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => handleNavigation(aboutRef)}
          className={`text-xl font-bold ${
            istDunkel ? 'text-white' : 'text-gray-900'
          }`}
        >
          Mein Portfolio
        </button>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleNavigation(aboutRef)}
            className={`text-sm font-medium transition-colors ${
              istDunkel
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            About
          </button>

          <button
            onClick={() => handleNavigation(skillsRef)}
            className={`text-sm font-medium transition-colors ${
              istDunkel
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Skills
          </button>

          <button
            onClick={() => handleNavigation(projectsRef)}
            className={`text-sm font-medium transition-colors ${
              istDunkel
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Projekte
          </button>

          <button
            onClick={() => handleNavigation(contactsRef)}
            className={`text-sm font-medium transition-colors ${
              istDunkel
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Kontakt
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              istDunkel
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {istDunkel ? 'Light' : 'Dark'}
          </button>

          <button
            onClick={() => setMenuOffen(!menuOffen)}
            className={`md:hidden px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              istDunkel
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            aria-label="Menü öffnen"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOffen && (
        <div
          className={`md:hidden px-4 pb-4 ${
            istDunkel ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => handleNavigation(aboutRef)}
              className={`text-left px-3 py-2 rounded-lg ${
                istDunkel
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNavigation(skillsRef)}
              className={`text-left px-3 py-2 rounded-lg ${
                istDunkel
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Skills
            </button>

            <button
              onClick={() => handleNavigation(projectsRef)}
              className={`text-left px-3 py-2 rounded-lg ${
                istDunkel
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Projekte
            </button>

            <button
              onClick={() => handleNavigation(contactsRef)}
              className={`text-left px-3 py-2 rounded-lg ${
                istDunkel
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Kontakt
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header