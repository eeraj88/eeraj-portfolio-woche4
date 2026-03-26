import { useEffect, useState } from 'react'

function ScrollIndikator() {
  const [scrollFortschritt, setScrollFortschritt] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollFortschritt(progress)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-800/50">
      <div
        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-150"
        style={{ width: `${scrollFortschritt}%` }}
      />
    </div>
  )
}

export default ScrollIndikator
