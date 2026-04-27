import { useState, useEffect } from 'react'
import { getLikes, addLike } from '../firebase'

function LikeButton({ projectId, compact = false }) {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  // User ID generieren oder aus localStorage laden
  const [userId] = useState(() => {
    let id = localStorage.getItem('portfolio_user_id')
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('portfolio_user_id', id)
    }
    return id
  })

  // Prüfen, ob bereits geliked (localStorage)
  useEffect(() => {
    const likedKey = `liked_project_${projectId}`
    const hasLiked = localStorage.getItem(likedKey) === 'true'
    setLiked(hasLiked)
  }, [projectId])

  // Like-Count laden (Real-time)
  useEffect(() => {
    setLoading(true)
    const unsubscribe = getLikes(projectId, (newCount) => {
      setCount(newCount)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [projectId])

  const handleLike = async () => {
    if (liked || loading) return

    try {
      const success = await addLike(projectId, userId)
      if (success) {
        setLiked(true)
        localStorage.setItem(`liked_project_${projectId}`, 'true')
      }
    } catch (error) {
      console.error('Fehler beim Liken:', error)
    }
  }

  // Compact Variante für Cards
  if (compact) {
    return (
      <button
        onClick={handleLike}
        disabled={liked || loading}
        className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all duration-200 ${
          liked
            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            : 'hover:bg-pink-50 text-pink-600 dark:text-pink-400 dark:hover:bg-pink-900/20 hover:scale-110 active:scale-95'
        }`}
      >
        <span className="text-base">
          {liked ? '❤️' : '🤍'}
        </span>
        <span className="text-xs">
          {loading ? '...' : count}
        </span>
      </button>
    )
  }

  // Normale Variante (Modal)
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
