// ============================================
// STARTER SELECTION COMPONENT
// ============================================

import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'
import { STARTER_POKEMON } from '../constants'
import { fetchMultiplePokemon } from '../api'

export default function StarterSelection({ onSelect }) {
  const { istDunkel } = useContext(ThemeContext)
  const [starters, setStarters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  
  // Starter laden (parallel mit Caching)
  useEffect(() => {
    const loadStarters = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const ids = STARTER_POKEMON.map(s => s.id)
        const pokemonData = await fetchMultiplePokemon(ids)
        setStarters(pokemonData)
      } catch (err) {
        setError('Pokémon konnten nicht geladen werden. Bitte neu laden.')
        console.error('Starter loading error:', err)
      }
      
      setIsLoading(false)
    }
    
    loadStarters()
  }, [])
  
  const handleSelect = async (starter) => {
    setSelectedId(starter.id)
    
    // Kurze Animation
    await new Promise(r => setTimeout(r, 300))
    
    onSelect(starter)
  }
  
  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-400 mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Neu laden
        </button>
      </div>
    )
  }
  
  return (
    <div>
      <p className={`text-center mb-3 text-sm font-medium ${
        istDunkel ? 'text-gray-200' : 'text-gray-700'
      }`}>
        Wähle dein Starter-Pokémon!
      </p>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin text-4xl mb-2">🎮</div>
          <p className={`text-sm ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
            Lade Pokémon...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
            {starters.map(starter => (
              <button
                key={starter.id}
                onClick={() => handleSelect(starter)}
                disabled={selectedId !== null}
                className={`p-2 rounded-xl transition-all relative group ${
                  selectedId === starter.id
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 scale-110 shadow-lg'
                    : istDunkel 
                      ? 'bg-gray-800 hover:bg-gray-700 hover:scale-105' 
                      : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                } ${selectedId !== null && selectedId !== starter.id ? 'opacity-50' : ''}`}
              >
                <img 
                  src={starter.spriteStatic} 
                  alt={starter.name} 
                  className="w-12 h-12 mx-auto"
                />
                <p className={`text-[10px] text-center mt-1 truncate ${
                  selectedId === starter.id 
                    ? 'text-white font-bold'
                    : istDunkel ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {starter.name}
                </p>
                
                {/* Typ-Badges */}
                <div className="absolute -top-1 -right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {starter.types?.slice(0, 1).map(type => (
                    <span 
                      key={type}
                      className={`w-3 h-3 rounded-full ${getTypeColor(type)}`}
                      title={type}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
          
          <div className={`text-center mt-3 space-y-1 ${
            istDunkel ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <p className="text-xs">
              ✨ 10% Shiny-Chance!
            </p>
            <p className="text-[10px]">
              Tippe auf ein Pokémon um es zu wählen
            </p>
          </div>
        </>
      )}
    </div>
  )
}

// Typ-Farben Helper
const getTypeColor = (type) => {
  const colors = {
    fire: 'bg-orange-500', water: 'bg-blue-500', grass: 'bg-green-500',
    electric: 'bg-yellow-400', psychic: 'bg-pink-500', normal: 'bg-gray-400',
  }
  return colors[type] || 'bg-gray-400'
}
