// ============================================
// POKEDEX COMPONENT
// ============================================

import { useState, useEffect, useContext, useMemo } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'
import { fetchPokemonData } from '../api'
import { TYPE_COLORS } from '../constants'
import { calculateEffectiveStats } from '../utils'

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
          <PokedexDetail 
            pokemon={pokedex[selectedPokemon]}
            details={pokemonDetails[selectedPokemon]}
            pokemonId={selectedPokemon}
            istDunkel={istDunkel}
          />
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

// ============================================
// POKEDEX DETAIL COMPONENT WITH STATS
// ============================================
function PokedexDetail({ pokemon, details, pokemonId, istDunkel }) {
  // Calculate effective stats if pokemon is caught (has level, moves, etc.)
  const stats = useMemo(() => {
    if (!pokemon?.caught || !details?.stats) return null
    
    return calculateEffectiveStats(details.stats, pokemon.level || 1, {
      moves: pokemon.moves || [],
      isShiny: pokemon.shiny || false,
      ivs: pokemon.ivs || null,
      nature: pokemon.nature || null,
      personality: pokemon.personality || null
    })
  }, [pokemon, details?.stats])
  
  return (
    <div className={`p-3 border-t ${istDunkel ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex gap-3">
        {/* Pokemon Image */}
        <div className="flex flex-col items-center">
          <img
            src={pokemon?.shiny ? details.shinySprite : details.spriteStatic}
            alt={details.name}
            className={`w-16 h-16 ${pokemon?.shiny ? 'drop-shadow-[0_0_8px_gold]' : ''}`}
          />
          {pokemon?.caught && (
            <span className={`text-[10px] mt-1 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
              Lv. {pokemon.level || 1}
            </span>
          )}
        </div>
        
        {/* Info & Stats */}
        <div className="flex-1 min-w-0">
          {/* Name & Types */}
          <p className={`font-bold text-sm ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
            #{pokemonId} {details.name}
            {pokemon?.shiny && <span className="ml-1 text-yellow-400">*</span>}
          </p>
          <div className="flex gap-1 mt-1">
            {details.types?.map(type => (
              <span 
                key={type}
                className={`px-2 py-0.5 rounded text-[9px] text-white uppercase font-bold ${TYPE_COLORS[type]}`}
              >
                {type}
              </span>
            ))}
          </div>
          
          {/* Stats Grid - only for caught Pokemon */}
          {stats && (
            <div className="mt-2">
              <p className={`text-[10px] mb-1 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                Power: {stats.powerScore} | Total: {stats.total}
              </p>
              <div className="grid grid-cols-6 gap-1">
                <StatBar label="HP" value={stats.hp} max={200} color="bg-red-500" isDark={istDunkel} />
                <StatBar label="ATK" value={stats.attack} max={200} color="bg-orange-500" isDark={istDunkel} />
                <StatBar label="DEF" value={stats.defense} max={200} color="bg-yellow-500" isDark={istDunkel} />
                <StatBar label="SPA" value={stats.spAttack} max={200} color="bg-blue-500" isDark={istDunkel} />
                <StatBar label="SPD" value={stats.spDefense} max={200} color="bg-green-500" isDark={istDunkel} />
                <StatBar label="SPE" value={stats.speed} max={200} color="bg-pink-500" isDark={istDunkel} />
              </div>
            </div>
          )}
          
          {/* Seen only indicator */}
          {!pokemon?.caught && (
            <p className={`text-xs mt-2 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
              Nur gesehen
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Stat Bar Component for Pokedex
function StatBar({ label, value, max, color, isDark }) {
  const percent = Math.min((value / max) * 100, 100)
  
  return (
    <div className="text-center">
      <div className={`h-12 w-full rounded-sm overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'} relative`}>
        <div 
          className={`absolute bottom-0 w-full ${color} transition-all`}
          style={{ height: `${percent}%` }}
        />
        <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {value}
        </span>
      </div>
      <span className={`text-[8px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}
