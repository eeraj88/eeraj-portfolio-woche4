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
  
  // Wenn ein Pokemon ausgewählt ist, zeige Detail-Ansicht
  if (selectedPokemon && pokemonDetails[selectedPokemon]) {
    return (
      <PokedexDetail 
        pokemon={pokedex[selectedPokemon]}
        details={pokemonDetails[selectedPokemon]}
        pokemonId={selectedPokemon}
        istDunkel={istDunkel}
        onBack={() => setSelectedPokemon(null)}
        onClose={onClose}
      />
    )
  }
  
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md h-[80vh] rounded-2xl overflow-hidden flex flex-col ${
        istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 p-3 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Pokedex</h3>
            <div className="text-xs">
              <span className="mr-3">{seenCount} gesehen</span>
              <span>{caughtCount} gefangen</span>
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
              {f === 'caught' && 'Gefangen'}
              {f === 'seen' && 'Gesehen'}
            </button>
          ))}
        </div>
        
        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {filteredEntries.length === 0 ? (
            <div className={`text-center py-8 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
              <p className="text-sm">Noch keine Pokemon {filter === 'caught' ? 'gefangen' : 'gesehen'}</p>
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
                      data.caught
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
                    
                    {/* Shiny indicator */}
                    {data.shiny && data.caught && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        
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
            Schliessen
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// POKEDEX DETAIL - Full screen Pokemon stats
// ============================================
function PokedexDetail({ pokemon, details, pokemonId, istDunkel, onBack, onClose }) {
  // Calculate effective stats
  const stats = useMemo(() => {
    if (!details?.stats) return null
    
    // Für gefangene Pokemon: volle Berechnung mit IVs, Nature etc.
    if (pokemon?.caught) {
      return calculateEffectiveStats(details.stats, pokemon.level || 1, {
        moves: pokemon.moves || [],
        isShiny: pokemon.shiny || false,
        ivs: pokemon.ivs || null,
        nature: pokemon.nature || null,
        personality: pokemon.personality || null
      })
    }
    
    // Für gesehene Pokemon: nur Basis-Stats
    return {
      hp: details.stats.hp,
      attack: details.stats.attack,
      defense: details.stats.defense,
      spAttack: details.stats.spAttack,
      spDefense: details.stats.spDefense,
      speed: details.stats.speed,
      total: details.stats.total
    }
  }, [pokemon, details?.stats])
  
  // Berechne Kampfwerte
  const battleStats = useMemo(() => {
    if (!stats || !pokemon?.caught) return null
    
    const level = pokemon.level || 1
    
    // Physischer Angriff (ATK vs DEF)
    const physicalDamage = Math.floor((stats.attack / 50) * level * 0.5)
    const physicalDefense = Math.floor((stats.defense / 50) * level * 0.4)
    
    // Spezieller Angriff (SPA vs SPD)
    const specialDamage = Math.floor((stats.spAttack / 50) * level * 0.5)
    const specialDefense = Math.floor((stats.spDefense / 50) * level * 0.4)
    
    // Effektive HP (HP + Defense Bonus)
    const effectiveHP = Math.floor(stats.hp + (stats.defense * 0.3) + (stats.spDefense * 0.2))
    
    // Initiative (wer zuerst angreift)
    const initiative = stats.speed + (level * 2)
    
    // Durchschnittlicher Schaden pro Runde
    const avgDamageOut = Math.floor((physicalDamage + specialDamage) / 2)
    const avgDamageIn = Math.floor(effectiveHP / 10) // Wie viele Treffer man aushält
    
    return {
      physicalDamage,
      physicalDefense,
      specialDamage,
      specialDefense,
      effectiveHP,
      initiative,
      avgDamageOut,
      survivalRounds: avgDamageIn
    }
  }, [stats, pokemon])
  
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-2xl overflow-hidden flex flex-col ${
        istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        
        {/* Header mit Pokemon-Info */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 p-4 text-white">
          <div className="flex items-center gap-4">
            <img
              src={pokemon?.shiny ? details.shinySprite : details.spriteStatic}
              alt={details.name}
              className={`w-20 h-20 ${pokemon?.shiny ? 'drop-shadow-[0_0_10px_gold]' : ''}`}
            />
            <div className="flex-1">
              <p className="text-xs text-white/70">#{pokemonId}</p>
              <h3 className="font-bold text-xl">{details.name}</h3>
              <div className="flex gap-1.5 mt-1">
                {details.types?.map(type => (
                  <span 
                    key={type}
                    className={`px-2 py-0.5 rounded text-[10px] text-white uppercase font-bold ${TYPE_COLORS[type]}`}
                  >
                    {type}
                  </span>
                ))}
              </div>
              {pokemon?.caught && (
                <p className="text-sm mt-1 text-white/80">
                  Level {pokemon.level || 1}
                  {pokemon.shiny && <span className="ml-2 text-yellow-300">Shiny</span>}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className={`p-4 ${istDunkel ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h4 className={`text-xs font-bold mb-3 uppercase tracking-wide ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
            {pokemon?.caught ? 'Effektive Stats' : 'Basis Stats'}
          </h4>
          
          {/* Pokemon-style horizontal stat bars */}
          <div className="space-y-2">
            <StatRow label="KP" value={stats?.hp || 0} max={255} color="bg-green-500" isDark={istDunkel} />
            <StatRow label="Angriff" value={stats?.attack || 0} max={255} color="bg-red-500" isDark={istDunkel} />
            <StatRow label="Vert." value={stats?.defense || 0} max={255} color="bg-orange-500" isDark={istDunkel} />
            <StatRow label="Sp. Ang." value={stats?.spAttack || 0} max={255} color="bg-blue-500" isDark={istDunkel} />
            <StatRow label="Sp. Ver." value={stats?.spDefense || 0} max={255} color="bg-purple-500" isDark={istDunkel} />
            <StatRow label="Init." value={stats?.speed || 0} max={255} color="bg-pink-500" isDark={istDunkel} />
          </div>
          
          <div className={`mt-3 pt-2 border-t ${istDunkel ? 'border-gray-700' : 'border-gray-200'} flex justify-between`}>
            <span className={`text-xs ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>Gesamt</span>
            <span className={`text-sm font-bold ${istDunkel ? 'text-white' : 'text-gray-900'}`}>{stats?.total || 0}</span>
          </div>
        </div>
        
        {/* Battle Stats - nur für gefangene Pokemon */}
        {battleStats && (
          <div className={`p-4 border-t ${istDunkel ? 'border-gray-700 bg-gray-850' : 'border-gray-200 bg-white'}`}>
            <h4 className={`text-xs font-bold mb-3 uppercase tracking-wide ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
              Kampfwerte
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <BattleStat 
                label="Phys. Schaden" 
                value={battleStats.physicalDamage}
                icon="+"
                color="text-red-400"
                isDark={istDunkel}
              />
              <BattleStat 
                label="Phys. Schutz" 
                value={battleStats.physicalDefense}
                icon="-"
                color="text-orange-400"
                isDark={istDunkel}
              />
              <BattleStat 
                label="Spez. Schaden" 
                value={battleStats.specialDamage}
                icon="+"
                color="text-blue-400"
                isDark={istDunkel}
              />
              <BattleStat 
                label="Spez. Schutz" 
                value={battleStats.specialDefense}
                icon="-"
                color="text-purple-400"
                isDark={istDunkel}
              />
              <BattleStat 
                label="Eff. HP" 
                value={battleStats.effectiveHP}
                icon=""
                color="text-green-400"
                isDark={istDunkel}
              />
              <BattleStat 
                label="Initiative" 
                value={battleStats.initiative}
                icon=""
                color="text-pink-400"
                isDark={istDunkel}
              />
            </div>
            
            <div className={`mt-3 pt-2 border-t ${istDunkel ? 'border-gray-700' : 'border-gray-200'} grid grid-cols-2 gap-3`}>
              <div className={`text-center p-2 rounded ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-lg font-bold text-red-400`}>~{battleStats.avgDamageOut}</p>
                <p className={`text-[10px] ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>Schaden/Runde</p>
              </div>
              <div className={`text-center p-2 rounded ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className={`text-lg font-bold text-green-400`}>~{battleStats.survivalRounds}</p>
                <p className={`text-[10px] ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>Runden Ausdauer</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Not caught info */}
        {!pokemon?.caught && (
          <div className={`p-4 border-t ${istDunkel ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-center text-sm ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
              Fange dieses Pokemon um die Kampfwerte zu sehen
            </p>
          </div>
        )}
        
        {/* Buttons */}
        <div className={`p-3 border-t ${istDunkel ? 'border-gray-700' : 'border-gray-200'} flex gap-2`}>
          <button
            onClick={onBack}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              istDunkel 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Zurueck
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600"
          >
            Schliessen
          </button>
        </div>
      </div>
    </div>
  )
}

// Horizontal Stat Bar (wie im echten Pokemon)
function StatRow({ label, value, max, color, isDark }) {
  const percent = Math.min((value / max) * 100, 100)
  
  // Farbe basierend auf Wert
  const getBarColor = () => {
    if (percent >= 66) return 'bg-green-500'
    if (percent >= 33) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  return (
    <div className="flex items-center gap-2">
      <span className={`w-16 text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </span>
      <span className={`w-8 text-right text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </span>
      <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div 
          className={`h-full ${getBarColor()} transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

// Battle Stat Display
function BattleStat({ label, value, icon, color, isDark }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      <span className={`text-sm font-bold ${color}`}>
        {icon}{value}
      </span>
    </div>
  )
}
