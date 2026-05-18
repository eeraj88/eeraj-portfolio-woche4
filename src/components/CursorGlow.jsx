import { useEffect, useRef, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function CursorGlow() {
  const { istDunkel } = useContext(ThemeContext)
  const ref = useRef(null)

  useEffect(() => {
    console.log('CursorGlow mounted, istDunkel:', istDunkel)
    if (!matchMedia('(pointer:fine)').matches) {
      console.log('Touch device detected, cursor disabled')
      return
    }
    const el = ref.current
    if (!el) {
      console.error('CursorGlow ref is null!')
      return
    }

    let rafId = null, mx = 0, my = 0, cx = 0, cy = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (!rafId) rafId = requestAnimationFrame(loop)
    }

    const loop = () => {
      cx += (mx - cx) * 0.18
      cy += (my - cy) * 0.18
      el.style.left = cx + 'px'
      el.style.top = cy + 'px'
      if (Math.abs(mx - cx) > 0.5 || Math.abs(my - cy) > 0.5) {
        rafId = requestAnimationFrame(loop)
      } else {
        rafId = null
      }
    }

    document.addEventListener('mousemove', onMove)
    return () => {
      document.removeEventListener('mousemove', onMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const glowStyle = istDunkel ? {
    background: 'radial-gradient(circle, rgba(34,211,238,0.11) 0%, rgba(34,211,238,0.04) 40%, transparent 65%)',
    mixBlendMode: 'screen',
  } : {
    background: 'radial-gradient(circle, rgba(8,145,178,0.10) 0%, transparent 60%)',
    mixBlendMode: 'multiply',
  }

  return (
    <div
      ref={ref}
      className="fx-cursor"
      style={{
        position: 'fixed',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.3s',
        ...glowStyle,
      }}
    />
  )
}

export default CursorGlow
