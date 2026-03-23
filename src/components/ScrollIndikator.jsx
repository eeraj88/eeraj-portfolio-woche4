import { useEffect, useState, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function ScrollIndikator() {
  const { istDunkel } = useContext(ThemeContext)
  const [scrollFortschritt, setScrollFortschritt] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const fortschritt = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0
      setScrollFortschritt(fortschritt)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 w-full h-1 z-[60] ${
        istDunkel ? 'bg-gray-800' : 'bg-gray-200'
      }`}
    >
      <div
        className="h-full bg-blue-600 transition-all duration-150"
        style={{ width: `${scrollFortschritt}%` }}
      ></div>
    </div>
  )
}

export default ScrollIndikator