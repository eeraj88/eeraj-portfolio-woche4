import { useState, useEffect } from 'react'
import { updateVisitorCount, subscribeToVisitors } from '../firebase'

function VisitorCounter() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Besucher registrieren (einmalig pro Session)
    const registerVisit = async () => {
      const hasVisited = sessionStorage.getItem('portfolio_visited')
      if (!hasVisited) {
        await updateVisitorCount()
        sessionStorage.setItem('portfolio_visited', 'true')
      }
    }

    registerVisit()

    // Real-time Update abonnieren
    const unsubscribe = subscribeToVisitors((newCount) => {
      setCount(newCount)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <span className="animate-pulse">...</span>
  }

  return (
    <span className="font-semibold">
      {count.toLocaleString('de-DE')}
    </span>
  )
}

export default VisitorCounter
