// ============================================
// BATTLE OVERLAY COMPONENT
// ============================================

import { useContext, useMemo } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'
import { BATTLE_PHASES, BATTLE_TYPES } from '../hooks/useBattle'
import { TYPE_COLORS, ITEMS } from '../constants'
import { getHPBarColor, calculateHPPercent } from '../utils'

export default function BattleOverlay({ battle, inventory, onClose }) {
  const { istDunkel } = useContext(ThemeContext)
  
  const {
    battlePhase,
    battleType,
    battleLog,
    isPlayerTurn,
    playerPokemon,
    playerHP,
    playerMaxHP,
    enemyPokemon,
    enemyHP,
    enemyMaxHP,
    enemyLevel,
    trainerName,
    currentArena,
    arenaIndex,
    canCatch,
    executeMove,
    useItemInBattle,
    attemptFlee,
    closeBattle,
  } = battle
  
  const playerHPPercent = calculateHPPercent(playerHP, playerMaxHP)
  const enemyHPPercent = calculateHPPercent(enemyHP, enemyMaxHP)
  
  // Verfügbare Items im Kampf
  const battleItems = useMemo(() => {
    const items = []
    if (inventory?.potion > 0) items.push({ ...ITEMS.potion, count: inventory.potion })
    if (inventory?.superPotion > 0) items.push({ ...ITEMS.superPotion, count: inventory.superPotion })
    if (canCatch && inventory?.pokeball > 0) items.push({ ...ITEMS.pokeball, count: inventory.pokeball })
    if (canCatch && inventory?.greatball > 0) items.push({ ...ITEMS.greatball, count: inventory.greatball })
    return items
  }, [inventory, canCatch])
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
        istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={`p-3 text-white text-center bg-gradient-to-r ${
          currentArena ? currentArena.color : 
          battleType === BATTLE_TYPES.TRAINER ? 'from-purple-600 to-indigo-700' :
          'from-green-600 to-emerald-700'
        }`}>
          <h3 className="font-bold text-sm flex items-center justify-center gap-2">
            {currentArena ? (
              <><span>🏟️</span> {currentArena.company} Arena</>
            ) : battleType === BATTLE_TYPES.TRAINER ? (
              <><span>⚔️</span> Trainer-Kampf</>
            ) : (
              <><span>🌿</span> Wildes Pokémon</>
            )}
          </h3>
          {trainerName && (
            <p className="text-xs text-white/80">{trainerName}</p>
          )}
          {currentArena && (
            <p className="text-xs text-white/60">Pokémon {arenaIndex + 1}/3</p>
          )}
        </div>
        
        {/* Battle Arena */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            
            {/* Player Pokemon */}
            <div className="text-center flex-1">
              <p className={`text-[10px] mb-1 ${istDunkel ? 'text-cyan-400' : 'text-cyan-600'}`}>
                Du
              </p>
              {playerPokemon && (
                <>
                  <div className={`relative ${battlePhase === BATTLE_PHASES.ANIMATION ? 'animate-pulse' : ''}`}>
                    <img 
                      src={playerPokemon.isShiny ? 
                        (playerPokemon.pokemonInfo?.shinySprite || playerPokemon.pokemonInfo?.spriteStatic) :
                        playerPokemon.pokemonInfo?.spriteStatic
                      }
                      alt="Dein Pokemon"
                      className={`w-20 h-20 mx-auto transition-all ${
                        playerHP <= 0 ? 'grayscale opacity-50 rotate-90' : ''
                      } ${playerPokemon.isShiny ? 'drop-shadow-[0_0_8px_gold]' : ''}`}
                    />
                    {playerPokemon.isShiny && (
                      <span className="absolute -top-1 -right-1 text-yellow-400">✨</span>
                    )}
                  </div>
                  
                  <p className={`text-xs font-bold mt-1 ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
                    {playerPokemon.nickname || playerPokemon.pokemonInfo?.name || 'Pokemon'}
                    <span className={`ml-1 text-[10px] ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                      Lv.{playerPokemon.level}
                    </span>
                  </p>
                  
                  {/* HP Bar */}
                  <div className={`h-2 w-20 mx-auto rounded-full overflow-hidden mt-1 ${
                    istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-full transition-all duration-300 ${getHPBarColor(playerHPPercent)}`}
                      style={{ width: `${playerHPPercent}%` }}
                    />
                  </div>
                  <p className={`text-[10px] ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                    {playerHP}/{playerMaxHP} HP
                  </p>
                </>
              )}
            </div>
            
            {/* VS */}
            <div className={`text-2xl font-black px-2 ${
              battlePhase === BATTLE_PHASES.ANIMATION 
                ? 'text-yellow-400 animate-pulse' 
                : istDunkel ? 'text-gray-600' : 'text-gray-300'
            }`}>
              VS
            </div>
            
            {/* Enemy Pokemon */}
            <div className="text-center flex-1">
              <p className={`text-[10px] mb-1 truncate ${istDunkel ? 'text-orange-400' : 'text-orange-600'}`}>
                {battleType === BATTLE_TYPES.WILD ? 'Wild' : trainerName?.split(' ')[0]}
              </p>
              {enemyPokemon ? (
                <>
                  <div className={`relative ${battlePhase === BATTLE_PHASES.ENEMY_TURN ? 'animate-pulse' : ''}`}>
                    <img 
                      src={enemyPokemon.spriteStatic}
                      alt={enemyPokemon.name}
                      className={`w-20 h-20 mx-auto transition-all ${
                        enemyHP <= 0 ? 'grayscale opacity-50 rotate-90' : ''
                      }`}
                    />
                  </div>
                  
                  <p className={`text-xs font-bold mt-1 ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
                    {enemyPokemon.name}
                    <span className={`ml-1 text-[10px] ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                      Lv.{enemyLevel}
                    </span>
                  </p>
                  
                  {/* HP Bar */}
                  <div className={`h-2 w-20 mx-auto rounded-full overflow-hidden mt-1 ${
                    istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-full transition-all duration-300 ${getHPBarColor(enemyHPPercent)}`}
                      style={{ width: `${enemyHPPercent}%` }}
                    />
                  </div>
                  <p className={`text-[10px] ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                    {enemyHP}/{enemyMaxHP} HP
                  </p>
                  
                  {/* Type Badges */}
                  <div className="flex justify-center gap-1 mt-1">
                    {enemyPokemon.types?.map(type => (
                      <span 
                        key={type}
                        className={`w-3 h-3 rounded-full ${TYPE_COLORS[type]}`}
                        title={type}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className={`w-20 h-20 mx-auto rounded-full animate-pulse ${
                  istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
              )}
            </div>
          </div>
          
          {/* Battle Log */}
          <div className={`rounded-lg p-3 h-28 overflow-y-auto text-xs space-y-1 mb-3 ${
            istDunkel ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            {battleLog.map((log) => (
              <p key={log.id} className={getLogColor(log.type, istDunkel)}>
                {log.message}
              </p>
            ))}
            {battlePhase === BATTLE_PHASES.SEARCHING && (
              <p className="text-blue-400 animate-pulse">🔍 Suche...</p>
            )}
          </div>
          
          {/* Action Buttons - nur wenn Spieler am Zug */}
          {isPlayerTurn && playerPokemon?.moves && (
            <div className="space-y-2">
              {/* Moves */}
              <div className="grid grid-cols-2 gap-2">
                {playerPokemon.moves.map((move, i) => (
                  <button
                    key={i}
                    onClick={() => executeMove(move)}
                    className={`p-2 rounded-lg text-left transition-all hover:scale-[1.02] ${
                      istDunkel ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${TYPE_COLORS[move.type]}`} />
                      <span className={`text-xs font-medium ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
                        {move.name}
                      </span>
                    </div>
                    <p className={`text-[10px] ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                      {move.power > 0 ? `${move.power} PWR` : 'Status'} • {move.type}
                    </p>
                  </button>
                ))}
              </div>
              
              {/* Items & Actions */}
              <div className="flex gap-2">
                {/* Items Dropdown */}
                {battleItems.length > 0 && (
                  <div className="relative group flex-1">
                    <button className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      istDunkel 
                        ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30' 
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}>
                      🎒 Items
                    </button>
                    <div className={`absolute bottom-full left-0 w-full mb-1 rounded-lg overflow-hidden shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity ${
                      istDunkel ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      {battleItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => useItemInBattle(item.id)}
                          className={`w-full p-2 text-left text-xs flex items-center justify-between ${
                            istDunkel ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          <span>{item.emoji} {item.name}</span>
                          <span className={istDunkel ? 'text-gray-500' : 'text-gray-400'}>
                            x{item.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Flucht (nur bei wilden Pokemon) */}
                {battleType === BATTLE_TYPES.WILD && (
                  <button
                    onClick={attemptFlee}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      istDunkel 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    🏃 Fliehen
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Result / Close Button */}
          {battlePhase === BATTLE_PHASES.RESULT && (
            <button
              onClick={closeBattle}
              className="w-full mt-3 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:scale-[1.02] transition-all"
            >
              Schließen
            </button>
          )}
          
          {/* Waiting indicator */}
          {(battlePhase === BATTLE_PHASES.ENEMY_TURN || battlePhase === BATTLE_PHASES.ANIMATION) && (
            <div className={`text-center py-2 text-xs ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className="animate-pulse">
                {battlePhase === BATTLE_PHASES.ENEMY_TURN ? 'Gegner ist am Zug...' : 'Bitte warten...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Log Farben Helper
function getLogColor(type, isDark) {
  const colors = {
    system: isDark ? 'text-gray-400' : 'text-gray-500',
    encounter: 'text-yellow-400 font-bold',
    attack: isDark ? 'text-gray-300' : 'text-gray-700',
    damage: 'text-red-400',
    heal: 'text-green-400',
    effective: 'text-green-400 font-medium',
    weak: 'text-orange-400',
    critical: 'text-yellow-400 font-bold',
    miss: 'text-gray-500 italic',
    victory: 'text-green-400 font-bold',
    defeat: 'text-red-400 font-bold',
    xp: 'text-cyan-400',
    coins: 'text-yellow-400',
    badge: 'text-yellow-400 font-bold',
    catch: 'text-blue-400',
    success: 'text-green-400 font-bold',
    fail: 'text-red-400',
    error: 'text-red-500 font-bold',
    boost: 'text-purple-400',
  }
  return colors[type] || (isDark ? 'text-gray-300' : 'text-gray-700')
}
