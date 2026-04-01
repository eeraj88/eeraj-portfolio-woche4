// ============================================
// POKEMON STATS DISPLAY COMPONENT
// ============================================

import { useContext, useMemo } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'
import { calculateEffectiveStats } from '../utils'
import { TYPE_COLORS, xpForNextLevel } from '../constants'

export default function PokemonStats({ pokemon, pokemonInfo, showMoves = true, compact = false }) {
  const { istDunkel } = useContext(ThemeContext)
  
  // Memoized Stats Berechnung
  const stats = useMemo(() => {
    if (!pokemonInfo?.stats) return null
    return calculateEffectiveStats(
      pokemonInfo.stats,
      pokemon.level,
      pokemon.moves || [],
      pokemon.isShiny
    )
  }, [pokemonInfo?.stats, pokemon.level, pokemon.moves, pokemon.isShiny])
  
  const xpNeeded = xpForNextLevel(pokemon.level)
  const xpProgress = (pokemon.xp / xpNeeded) * 100
  
  if (!stats) return null
  
  if (compact) {
    return (
      <div className={`p-2 rounded-lg ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-medium ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
            Lv. {pokemon.level}
          </span>
          <span className={`text-[10px] ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
            {pokemon.xp}/{xpNeeded} XP
          </span>
        </div>
        <div className={`h-1.5 rounded-full overflow-hidden ${istDunkel ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      {/* XP Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>
            {pokemon.xp}/{xpNeeded} XP
          </span>
          <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>
            Lv. {pokemon.level}
          </span>
        </div>
        <div className={`h-2.5 rounded-full overflow-hidden ${istDunkel ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className={`p-2 rounded-lg ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <p className={`font-medium text-center mb-1.5 text-xs ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
          Stats (Total: {stats.total})
          {pokemon.isShiny && <span className="ml-1 text-yellow-400">✨</span>}
        </p>
        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
          <StatItem label="HP" value={stats.hp} icon="❤️" isDark={istDunkel} />
          <StatItem label="ATK" value={stats.attack} icon="⚔️" isDark={istDunkel} />
          <StatItem label="DEF" value={stats.defense} icon="🛡️" isDark={istDunkel} />
          <StatItem label="SP.A" value={stats.spAttack} icon="✨" isDark={istDunkel} />
          <StatItem label="SP.D" value={stats.spDefense} icon="🔮" isDark={istDunkel} />
          <StatItem label="SPD" value={stats.speed} icon="💨" isDark={istDunkel} />
        </div>
      </div>
      
      {/* Moves */}
      {showMoves && pokemon.moves && pokemon.moves.length > 0 && (
        <div className={`p-2 rounded-lg ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className={`font-medium text-center mb-1.5 text-xs ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
            Attacken ({pokemon.moves.length}/4)
          </p>
          <div className="space-y-1">
            {pokemon.moves.map((move, i) => (
              <MoveItem key={i} move={move} isDark={istDunkel} />
            ))}
          </div>
        </div>
      )}
      
      {/* Types */}
      {pokemonInfo?.types && (
        <div className="flex justify-center gap-1.5">
          {pokemonInfo.types.map(type => (
            <span 
              key={type} 
              className={`px-2 py-0.5 rounded text-[9px] text-white uppercase font-bold ${TYPE_COLORS[type]}`}
            >
              {type}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Stat Item Component
function StatItem({ label, value, icon, isDark }) {
  return (
    <div className={`flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
      <span>{icon}</span>
      <span className="font-mono">{value}</span>
    </div>
  )
}

// Move Item Component
function MoveItem({ move, isDark }) {
  return (
    <div className={`flex justify-between items-center text-[10px] px-1 py-0.5 rounded ${
      isDark ? 'bg-gray-700/50' : 'bg-gray-200/50'
    }`}>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${TYPE_COLORS[move.type] || 'bg-gray-400'}`} />
        <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>{move.name}</span>
      </div>
      <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {move.power > 0 ? `${move.power} PWR` : 'Status'}
      </span>
    </div>
  )
}
