// ============================================
// TRAINER NAME INPUT COMPONENT
// Shows before starter selection
// ============================================

import { useState, useContext } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'

export default function TrainerNameInput({ onSubmit }) {
  const { istDunkel } = useContext(ThemeContext)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const trimmedName = name.trim()
    
    if (trimmedName.length < 2) {
      setError('Name muss mindestens 2 Zeichen haben')
      return
    }
    
    if (trimmedName.length > 15) {
      setError('Name darf maximal 15 Zeichen haben')
      return
    }
    
    // Filter inappropriate content (basic)
    const inappropriate = ['admin', 'moderator', 'nazi', 'hitler']
    if (inappropriate.some(word => trimmedName.toLowerCase().includes(word))) {
      setError('Dieser Name ist nicht erlaubt')
      return
    }
    
    onSubmit(trimmedName)
  }
  
  return (
    <div className="text-center py-4">
      <div className="text-5xl mb-4">🎮</div>
      
      <h3 className={`text-lg font-bold mb-2 ${
        istDunkel ? 'text-white' : 'text-gray-900'
      }`}>
        Willkommen, Trainer!
      </h3>
      
      <p className={`text-sm mb-6 ${
        istDunkel ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Wie soll dein Trainer heissen?
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="Dein Name..."
            maxLength={15}
            className={`w-full px-4 py-3 rounded-xl text-center text-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              istDunkel 
                ? 'bg-gray-800 text-white placeholder-gray-500 border border-gray-700' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-400 border border-gray-200'
            }`}
            autoFocus
          />
          
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
          
          <p className={`text-[10px] mt-2 ${
            istDunkel ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {name.length}/15 Zeichen
          </p>
        </div>
        
        <button
          type="submit"
          disabled={name.trim().length < 2}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
            name.trim().length >= 2
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:scale-[1.02] hover:shadow-lg'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          Weiter zur Pokemon-Auswahl
        </button>
      </form>
      
      <p className={`text-[10px] mt-4 ${
        istDunkel ? 'text-gray-600' : 'text-gray-400'
      }`}>
        Dein Name erscheint im globalen Ranking
      </p>
    </div>
  )
}
