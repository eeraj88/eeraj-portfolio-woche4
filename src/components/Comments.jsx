import { useState, useEffect } from 'react'
import { commentAPI } from '../services/api'

function Comments({ projectId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Kommentare laden
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await commentAPI.getComments(projectId)
        setComments(data)
      } catch (error) {
        console.error('Fehler beim Laden der Kommentare:', error)
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [projectId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !message.trim()) {
      setError('Bitte fülle alle Felder aus')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const newComment = await commentAPI.addComment(projectId, name, message)
      setComments([newComment, ...comments])
      setName('')
      setMessage('')
    } catch (error) {
      setError('Fehler beim Senden des Kommentars')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'gerade eben'
    if (diffMins < 60) return `vor ${diffMins} Min${diffMins > 1 ? '.' : '.'}`
    if (diffHours < 24) return `vor ${diffHours} Std${diffHours > 1 ? '.' : '.'}`
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`

    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      {/* Kommentar Formular */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <h4 className="font-semibold text-sm">Kommentar schreiben</h4>

        <input
          type="text"
          placeholder="Dein Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-[#0a192f] border border-gray-300 dark:border-[#233554] focus:outline-none focus:ring-2 focus:ring-[#64ffda] dark:focus:ring-[#64ffda]"
          maxLength={50}
        />

        <textarea
          placeholder="Deine Nachricht..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-[#0a192f] border border-gray-300 dark:border-[#233554] focus:outline-none focus:ring-2 focus:ring-[#64ffda] dark:focus:ring-[#64ffda] resize-none"
          maxLength={500}
        />

        {error && (
          <p className="text-red-500 text-xs">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-[#64ffda] text-[#0a192f] hover:shadow-[0_0_20px_rgba(100,255,218,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Senden...' : 'Kommentar senden'}
        </button>
      </form>

      {/* Kommentare Liste */}
      <div className="space-y-3 mt-6">
        <h4 className="font-semibold text-sm">
          {loading ? 'Lade Kommentare...' : `${comments.length} Kommentar${comments.length !== 1 ? 'e' : ''}`}
        </h4>

        {!loading && comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-[#8892b0] text-center py-4">
            Noch keine Kommentare. Sei der Erste!
          </p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-[#0a192f] border border-gray-200 dark:border-[#233554]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">
                    {comment.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-[#8892b0]">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-[#ccd6f6] break-words">
                  {comment.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Comments
