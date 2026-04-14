import { useState, useEffect } from 'react'
import { visitorAPI } from '../services/api'

function VisitorCounter() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Besucher registrieren und Count laden
    const loadVisitorCount = async () => {
      try {
        // Zuerst registrieren
        await visitorAPI.register()
        // Dann Count abrufen
        const data = await visitorAPI.getCount()
        setCount(data.count)
      } catch (error) {
        console.error('Fehler beim Laden der Besucherzahl:', error)
        // Fallback auf 0 bei Fehler
        setCount(0)
      } finally {
        setLoading(false)
      }
    }

    loadVisitorCount()
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
