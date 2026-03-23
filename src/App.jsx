import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollIndikator from './components/ScrollIndikator'
import BookmarkForm from './components/BookmarkForm'
import { ThemeContext } from './Context/ThemeContext'

function App() {
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const projectsRef = useRef(null)
  const contactsRef = useRef(null)

  const [istDunkel, setIstDunkel] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('darkMode', istDunkel)
  }, [istDunkel])

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  const toggleDarkMode = () => {
    setIstDunkel(prev => !prev)
  }

  const addBookmark = (projektTitel) => {
    if (!bookmarks.includes(projektTitel)) {
      setBookmarks(prev => [...prev, projektTitel])
    }
  }

  const deleteBookmark = (projektTitel) => {
    setBookmarks(prev => prev.filter(b => b !== projektTitel))
  }

  function scrollToSection(ref) {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <ThemeContext.Provider value={{ istDunkel, toggleDarkMode }}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          istDunkel ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'
        }`}
      >
        <ScrollIndikator />

        <Header
          istDunkel={istDunkel}
          toggleDarkMode={toggleDarkMode}
          aboutRef={aboutRef}
          skillsRef={skillsRef}
          projectsRef={projectsRef}
          contactsRef={contactsRef}
          scrollToSection={scrollToSection}
        />

        <Hero />

        <div ref={aboutRef}>
          <About />
        </div>

        <div ref={skillsRef}>
          <Skills />
        </div>

        <div ref={projectsRef}>
          <Projects
            bookmarks={bookmarks}
            addBookmark={addBookmark}
            deleteBookmark={deleteBookmark}
          />
        </div>

        <div ref={contactsRef}>
          <Contact />
        </div>

        <section className="max-w-2xl mx-auto px-4 py-8">
          <h2 className={`text-2xl font-bold mb-4 ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
            Meine Bookmarks
          </h2>

          <BookmarkForm addBookmark={addBookmark} />

          <ul className="space-y-2">
            {bookmarks.map((b, i) => (
              <li
                key={i}
                className={`flex justify-between items-center px-4 py-2 rounded-lg ${
                  istDunkel ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <span>{b}</span>
                <button
                  onClick={() => deleteBookmark(b)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </section>

        <Footer />
      </div>
    </ThemeContext.Provider>
  )
}

export default App