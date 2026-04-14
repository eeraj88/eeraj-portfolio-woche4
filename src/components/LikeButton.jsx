import { useState, useEffect } from 'react'
import { likeAPI } from '../services/api'

function LikeButton({ projectId }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  // Prüfen, ob bereits geliked (localStorage)
  useEffect(() => {
    const likedKey = `liked_project_${projectId}`
    const hasLiked = localStorage.getItem(likedKey) === 'true'
    setLiked(hasLiked)
  }, [projectId])

  // Like-Count laden
  useEffect(() => {
    const loadLikeCount = async () => {
      try {
        const data = await likeAPI.getCount(projectId)
        setCount(data.count)
      } catch (error) {
        console.error('Fehler beim Laden der Likes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLikeCount()
  }, [projectId])

  const handleLike = async () => {
    if (liked || loading) return

    try {
      const data = await likeAPI.addLike(projectId)

      if (data.success) {
        setCount(data.count)
        setLiked(true)
        // Im localStorage speichern
        localStorage.setItem(`liked_project_${projectId}`, 'true')
      } else {
        // Falls bereits geliked (z.B. von anderem Gerät), State aktualisieren
        setLiked(true)
        setCount(data.count)
      }
    } catch (error) {
      console.error('Fehler beim Liken:', error)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        liked
          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 cursor-default'
          : 'bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-900/30 hover:scale-105 active:scale-95 cursor-pointer'
      }`}
    >
      <span className="text-xl">
        {liked ? '❤️' : '♡'}
      </span>
      <span className="text-sm">
        {loading ? '...' : count}
      </span>
      <span className="text-xs hidden sm:inline">
        {liked ? 'Geliked' : 'Like'}
      </span>
    </button>
  )
}

export default LikeButton
