// ============================================
// POKEDEX COMPONENT
// ============================================

import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'
import { fetchPokemonData } from '../api'
import { TYPE_COLORS } from '../constants'

export default function Pokedex({ pokedex, onClose }) {
  const { istDunkel } = useContext(ThemeContext)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [pokemonDetails, setPokemonDetails] = useState({})
  const [filter, setFilter] = useState('all') // all, caught, seen
  
  const entries = Object.entries(pokedex || {})
  const caughtCount = entries.filter(([_, data]) => data.caught).length
  const seenCount = entries.filter(([_, data]) => data.seen).length
  
  // Pokemon-Details laden wenn ausgewählt
  useEffect(() => {
    if (selectedPokemon && !pokemonDetails[selectedPokemon]) {
      fetchPokemonData(selectedPokemon).then(data => {
        if (data) {
          setPokemonDetails(prev => ({ ...prev, [selectedPokemon]: data }))
        }
      })
    }
  }, [selectedPokemon])
  
  const filteredEntries = entries.filter(([_, data]) => {
    if (filter === 'caught') return data.caught
    if (filter === 'seen') return data.seen && !data.caught
    return true
  })
  
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md h-[80vh] rounded-2xl overflow-hidden flex flex-col ${
        istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 p-3 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">📖 Pokédex</h3>
            <div className="text-xs">
              <span className="mr-3">👁️ {seenCount}</span>
              <span>🔴 {caughtCount}</span>
            </div>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex border-b border-gray-700">
          {['all', 'caught', 'seen'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-red-500 text-white'
                  : istDunkel
                    ? 'text-gray-400 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' && 'Alle'}
              {f === 'caught' && '🔴 Gefangen'}
              {f === 'seen' && '👁️ Gesehen'}
            </button>
          ))}
        </div>
        
        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {filteredEntries.length === 0 ? (
            <div className={`text-center py-8 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
              <p className="text-4xl mb-2">📖</p>
              <p className="text-sm">Noch keine Pokémon {filter === 'caught' ? 'gefangen' : 'gesehen'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {filteredEntries.map(([id, data]) => {
                const details = pokemonDetails[id]
                
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedPokemon(id)}
                    className={`p-1.5 rounded-lg transition-all relative ${
                      selectedPokemon === id
                        ? 'bg-red-500 scale-105'
                        : data.caught
                          ? istDunkel ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                          : istDunkel ? 'bg-gray-800/50' : 'bg-gray-100/50'
                    }`}
                  >
                    {details ? (
                      <img
                        src={data.shiny ? details.shinySprite : details.spriteStatic}
                        alt={details.name}
                        className={`w-10 h-10 mx-auto ${!data.caught ? 'opacity-50 grayscale' : ''} ${
                          data.shiny ? 'drop-shadow-[0_0_4px_gold]' : ''
                        }`}
                      />
                    ) : (
                      <div className={`w-10 h-10 mx-auto rounded-full ${
                        istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                      } flex items-center justify-center text-xs`}>
                        #{id}
                      </div>
                    )}
                    
                    {/* Caught/Seen Indicator */}
                    <span className={`absolute -top-1 -right-1 text-[8px] ${
                      data.caught ? '' : 'opacity-50'
                    }`}>
                      {data.caught ? (data.shiny ? '✨' : '🔴') : '👁️'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        
        {/* Selected Pokemon Details */}
        {selectedPokemon && pokemonDetails[selectedPokemon] && (
          <div className={`p-3 border-t ${istDunkel ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <img
                src={pokedex[selectedPokemon]?.shiny 
                  ? pokemonDetails[selectedPokemon].shinySprite 
                  : pokemonDetails[selectedPokemon].spriteStatic
                }
                alt={pokemonDetails[selectedPokemon].name}
                className={`w-16 h-16 ${pokedex[selectedPokemon]?.shiny ? 'drop-shadow-[0_0_8px_gold]' : ''}`}
              />
              <div className="flex-1">
                <p className={`font-bold ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
                  #{selectedPokemon} {pokemonDetails[selectedPokemon].name}
                  {pokedex[selectedPokemon]?.shiny && <span className="ml-1 text-yellow-400">✨</span>}
                </p>
                <div className="flex gap-1 mt-1">
                  {pokemonDetails[selectedPokemon].types?.map(type => (
                    <span 
                      key={type}
                      className={`px-2 py-0.5 rounded text-[9px] text-white uppercase font-bold ${TYPE_COLORS[type]}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <p className={`text-xs mt-1 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                  {pokedex[selectedPokemon]?.caught ? '✓ Gefangen' : '👁️ Nur gesehen'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Close Button */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={onClose}
            className={`w-full py-2 rounded-lg text-sm font-medium ${
              istDunkel 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  )
}
