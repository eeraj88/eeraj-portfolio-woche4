// ============================================
// TEAM DISPLAY COMPONENT
// ============================================

import { useContext } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'
import { calculateHPPercent, getHPBarColor } from '../utils'

export default function TeamDisplay({ team, activeIndex, onSelect, pokemonInfoMap = {} }) {
  const { istDunkel } = useContext(ThemeContext)
  
  if (!team || team.length === 0) return null
  
  return (
    <div className={`p-2 rounded-lg ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <p className={`text-xs font-medium text-center mb-2 ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
        Team ({team.length}/6)
      </p>
      
      <div className="flex gap-1 justify-center flex-wrap">
        {team.map((pokemon, index) => {
          const info = pokemonInfoMap[pokemon.pokemonId]
          const hpPercent = calculateHPPercent(pokemon.currentHP, pokemon.maxHP)
          const isActive = index === activeIndex
          
          return (
            <button
              key={pokemon.uniqueId}
              onClick={() => onSelect(index)}
              className={`relative p-1 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 scale-105 shadow-lg'
                  : istDunkel
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <img
                src={pokemon.isShiny ? info?.shinySprite : info?.spriteStatic}
                alt={info?.name || 'Pokemon'}
                className={`w-10 h-10 ${pokemon.currentHP <= 0 ? 'grayscale opacity-50' : ''} ${
                  pokemon.isShiny ? 'drop-shadow-[0_0_4px_gold]' : ''
                }`}
              />
              
              {/* Level Badge */}
              <span className={`absolute -bottom-1 -right-1 text-[8px] font-bold px-1 rounded ${
                isActive ? 'bg-white text-blue-600' : istDunkel ? 'bg-gray-600 text-white' : 'bg-gray-400 text-white'
              }`}>
                {pokemon.level}
              </span>
              
              {/* HP Mini-Bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b ${
                istDunkel ? 'bg-gray-600' : 'bg-gray-300'
              }`}>
                <div 
                  className={`h-full transition-all ${getHPBarColor(hpPercent)}`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              
              {/* Shiny Indicator */}
              {pokemon.isShiny && (
                <span className="absolute -top-1 -left-1 text-[8px]">✨</span>
              )}
            </button>
          )
        })}
        
        {/* Empty Slots */}
        {Array.from({ length: 6 - team.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className={`w-12 h-12 rounded-lg border-2 border-dashed ${
              istDunkel ? 'border-gray-700' : 'border-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
