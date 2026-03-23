import { useState } from 'react'

function BookmarkForm({ addBookmark, istDunkel }) {
  const [titel, setTitel] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (titel.trim() === '') return
    addBookmark(titel.trim())
    setTitel('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={titel}
        onChange={(e) => setTitel(e.target.value)}
        placeholder="Neuer Bookmark..."
        className={`flex-1 px-3 py-2 rounded-lg border ${
          istDunkel
            ? 'bg-gray-800 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Speichern
      </button>
    </form>
  )
}

export default BookmarkForm