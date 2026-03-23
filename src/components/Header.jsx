function Header({ istDunkel, toggleDarkMode }) {
  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
      istDunkel
        ? 'bg-gray-900/95 border-b border-gray-700'
        : 'bg-white/95 border-b border-gray-200'
    } backdrop-blur-sm`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className={`text-xl font-bold ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Mein Portfolio
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#about"
            className={`text-sm font-medium transition-colors ${
              istDunkel
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            About
          </a>
          <a
            href="#skills"
            className={`text-sm font-medium transition-colors ${
              istDunkel
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Skills
          </a>
          <a
            href="#projects"
            className={`text-sm font-medium transition-colors ${
              istDunkel
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Projekte
          </a>
          <a
            href="#contact"
            className={`text-sm font-medium transition-colors ${
              istDunkel
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Kontakt
          </a>
        </nav>

        <button
          onClick={toggleDarkMode}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            istDunkel
              ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {istDunkel ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  )
}

export default Header
