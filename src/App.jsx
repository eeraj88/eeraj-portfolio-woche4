import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [istDunkel, setIstDunkel] = useState(false)
  const [bookmarks, setBookmarks] = useState([])

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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      istDunkel ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'
    }`}>
      <Header istDunkel={istDunkel} toggleDarkMode={toggleDarkMode} />
      <Hero istDunkel={istDunkel} />
      <About istDunkel={istDunkel} />
      <Skills istDunkel={istDunkel} />
      <Projects
        istDunkel={istDunkel}
        bookmarks={bookmarks}
        addBookmark={addBookmark}
        deleteBookmark={deleteBookmark}
      />
      <Contact istDunkel={istDunkel} />
      <Footer istDunkel={istDunkel} />
    </div>
  )
}

export default App
