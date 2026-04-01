// ============================================
// AUTO-BATTLE OVERLAY COMPONENT
// Animated battles with HP bars
// ============================================

import { useContext } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'
import { BATTLE_PHASES, BATTLE_TYPES } from '../hooks/useBattle'
import { TYPE_COLORS } from '../constants'

export default function BattleOverlay({ battle, onClose }) {
  const { istDunkel } = useContext(ThemeContext)
  
  const {
    battlePhase,
    battleType,
    battleLog,
    battleResult,
    playerPokemon,
    playerPower,
    playerHP,
    enemyPokemon,
    enemyPower,
    enemyLevel,
    opponentHP,
    trainerName,
    currentArena,
    arenaProgress,
    closeBattle,
  } = battle
  
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
            <p className="text-xs text-white/60">Pokémon {arenaProgress + 1}/3</p>
          )}
        </div>
        
        {/* Battle Arena */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            
            {/* Player Pokemon */}
            <div className="text-center flex-1">
              <p className={`text-[10px] mb-1 ${istDunkel ? 'text-cyan-400' : 'text-cyan-600'}`}>
                Du
              </p>
              {playerPokemon && (
                <>
                  <div className={`relative ${battlePhase === BATTLE_PHASES.BATTLING ? 'animate-bounce' : ''}`}>
                    <img 
                      src={playerPokemon.isShiny ? 
                        (playerPokemon.pokemonInfo?.shinySprite || playerPokemon.pokemonInfo?.spriteStatic) :
                        playerPokemon.pokemonInfo?.spriteStatic
                      }
                      alt="Dein Pokemon"
                      className={`w-20 h-20 mx-auto ${
                        playerPokemon.isShiny ? 'drop-shadow-[0_0_8px_gold]' : ''
                      }`}
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
                  <div className="mt-2 px-2">
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>HP</span>
                      <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>{Math.round(playerHP || 0)}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${istDunkel ? 'bg-gray-700' : 'bg-gray-300'}`}>
                      <div 
                        className={`h-full transition-all duration-500 ${
                          (playerHP || 0) > 50 ? 'bg-green-500' : (playerHP || 0) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${playerHP || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Power Score */}
                  <div className={`mt-1 px-3 py-1 rounded-full inline-block ${
                    istDunkel ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    <span className="text-xs font-bold">⚡ {Math.round(playerPower || 0)}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* VS with Battle Animation */}
            <div className="flex flex-col items-center px-4">
              <div className={`text-2xl font-black ${
                battlePhase === BATTLE_PHASES.BATTLING 
                  ? 'text-yellow-400 animate-pulse' 
                  : battleResult?.won ? 'text-green-400' 
                  : battleResult ? 'text-red-400'
                  : istDunkel ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {battlePhase === BATTLE_PHASES.BATTLING ? '⚔️' : 
                 battleResult?.won ? '🏆' : 
                 battleResult ? '💀' : 'VS'}
              </div>
            </div>
            
            {/* Enemy Pokemon */}
            <div className="text-center flex-1">
              <p className={`text-[10px] mb-1 truncate ${istDunkel ? 'text-orange-400' : 'text-orange-600'}`}>
                {trainerName?.split(' ')[0] || 'Gegner'}
              </p>
              {enemyPokemon ? (
                <>
                  <div className={`relative ${battlePhase === BATTLE_PHASES.BATTLING ? 'animate-bounce' : ''}`} 
                       style={{ animationDelay: '0.1s' }}>
                    <img 
                      src={enemyPokemon.spriteStatic}
                      alt={enemyPokemon.name}
                      className="w-20 h-20 mx-auto"
                    />
                  </div>
                  
                  <p className={`text-xs font-bold mt-1 ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
                    {enemyPokemon.name}
                    <span className={`ml-1 text-[10px] ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                      Lv.{enemyLevel}
                    </span>
                  </p>
                  
                  {/* HP Bar */}
                  <div className="mt-2 px-2">
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>HP</span>
                      <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>{Math.round(opponentHP || 0)}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${istDunkel ? 'bg-gray-700' : 'bg-gray-300'}`}>
                      <div 
                        className={`h-full transition-all duration-500 ${
                          (opponentHP || 0) > 50 ? 'bg-green-500' : (opponentHP || 0) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${opponentHP || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Power Score */}
                  <div className={`mt-1 px-3 py-1 rounded-full inline-block ${
                    istDunkel ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                  }`}>
                    <span className="text-xs font-bold">⚡ {Math.round(enemyPower || 0)}</span>
                  </div>
                  
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
          <div className={`rounded-lg p-3 h-32 overflow-y-auto text-xs space-y-1 mb-3 ${
            istDunkel ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            {battleLog.map((log, index) => {
              // Support both string logs and object logs
              const isString = typeof log === 'string'
              const message = isString ? log : log.message
              const logType = isString ? 'system' : log.type
              
              return (
                <p key={isString ? index : log.id} className={getLogColor(logType, istDunkel)}>
                  {message}
                </p>
              )
            })}
            {battlePhase === BATTLE_PHASES.SEARCHING && (
              <p className="text-blue-400 animate-pulse">🔍 Suche Gegner...</p>
            )}
          </div>
          
          {/* Result Display */}
          {battleResult && (
            <div className={`rounded-xl p-4 mb-3 text-center ${
              battleResult.won 
                ? istDunkel ? 'bg-green-500/20 border border-green-500/50' : 'bg-green-100 border border-green-300'
                : istDunkel ? 'bg-red-500/20 border border-red-500/50' : 'bg-red-100 border border-red-300'
            }`}>
              <p className={`text-lg font-bold mb-2 ${
                battleResult.won ? 'text-green-400' : 'text-red-400'
              }`}>
                {battleResult.won ? '🎉 Sieg!' : '😔 Niederlage'}
              </p>
              
              {battleResult.won && (
                <div className="space-y-1 text-sm">
                  {battleResult.xpGain > 0 && (
                    <p className="text-cyan-400">+{battleResult.xpGain} XP</p>
                  )}
                  {battleResult.badge && (
                    <p className="text-yellow-400 font-bold">{battleResult.badge} Orden erhalten!</p>
                  )}
                  {battleResult.rareEvent && (
                    <p className="text-purple-400 font-bold animate-pulse">
                      {battleResult.rareEvent.emoji} {battleResult.rareEvent.name}!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Close Button */}
          {battlePhase === BATTLE_PHASES.RESULT && (
            <button
              onClick={closeBattle}
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:scale-[1.02] transition-all"
            >
              Schließen
            </button>
          )}
          
          {/* Battle in progress indicator */}
          {battlePhase === BATTLE_PHASES.BATTLING && (
            <div className={`text-center py-2 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-xs animate-pulse">
                ⚔️ Kampf läuft...
              </p>
            </div>
          )}
          
          {/* Searching indicator */}
          {(battlePhase === BATTLE_PHASES.SEARCHING || battlePhase === BATTLE_PHASES.INTRO) && (
            <div className={`text-center py-2 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className="text-xs animate-pulse">
                🔍 Lade Gegner...
              </p>
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
    rare: 'text-purple-400 font-bold animate-pulse',
  }
  return colors[type] || (isDark ? 'text-gray-300' : 'text-gray-700')
}
