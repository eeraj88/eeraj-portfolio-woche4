// ============================================
// POKEMON BUDDY - MAIN COMPONENT (REFACTORED)
// ============================================

import { useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { ThemeContext } from '../../Context/ThemeContext'

// Hooks
import { useGameState } from './hooks/useGameState'
import { useBattle, BATTLE_PHASES } from './hooks/useBattle'
import { useXPEvents, giveXP } from './hooks/useXPEvents'

// Components
import StarterSelection from './components/StarterSelection'
import PokemonStats from './components/PokemonStats'
import BattleOverlay from './components/BattleOverlay'
import TeamDisplay from './components/TeamDisplay'
import Inventory, { Shop } from './components/Inventory'
import Pokedex from './components/Pokedex'
import DailyQuests, { QuestBadge } from './components/DailyQuests'

// Utils & Constants
import { fetchPokemonData, fetchMoveDetails } from './api'
import { checkEvolutionPossible, calculateEffectiveStats } from './utils'
import { TECH_ARENAS, COOLDOWNS, TYPE_COLORS, xpForNextLevel } from './constants'

// Re-export giveXP for external use
export { giveXP }

export default function PokemonBuddy() {
  const { istDunkel } = useContext(ThemeContext)
  
  // Game State (useReducer)
  const gameState = useGameState()
  const { state, activePokemon, hasStarted } = gameState
  
  // Battle System
  const battle = useBattle(
    { activePokemon: activePokemon ? { ...activePokemon, pokemonInfo: null } : null },
    gameState
  )
  
  // XP Events (Portfolio Interactions)
  const xpEvents = useXPEvents(gameState, hasStarted)
  
  // UI State
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('pokemon') // pokemon, team, inventory
  const [showPokedex, setShowPokedex] = useState(false)
  const [showQuests, setShowQuests] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showMoveSelect, setShowMoveSelect] = useState(false)
  const [pendingMove, setPendingMove] = useState(null)
  
  // Pokemon Info Cache
  const [pokemonInfoMap, setPokemonInfoMap] = useState({})
  const [message, setMessage] = useState('')
  const [xpPopup, setXpPopup] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isEvolving, setIsEvolving] = useState(false)
  const [canPet, setCanPet] = useState(true)
  const [canBattle, setCanBattle] = useState(true)
  
  // Load Pokemon Info when team changes
  useEffect(() => {
    if (!state?.team) return
    
    state.team.forEach(async (pokemon) => {
      if (!pokemonInfoMap[pokemon.pokemonId]) {
        const info = await fetchPokemonData(pokemon.pokemonId)
        if (info) {
          setPokemonInfoMap(prev => ({ ...prev, [pokemon.pokemonId]: info }))
        }
      }
    })
  }, [state?.team])
  
  // Active Pokemon Info
  const activePokemonInfo = useMemo(() => {
    return activePokemon ? pokemonInfoMap[activePokemon.pokemonId] : null
  }, [activePokemon, pokemonInfoMap])
  
  // Update battle with pokemon info
  useEffect(() => {
    if (activePokemon && activePokemonInfo) {
      // Update the battle state with full pokemon info
    }
  }, [activePokemon, activePokemonInfo])
  
  // XP Event Listener (for UI feedback)
  useEffect(() => {
    const handleXP = (e) => {
      const { amount, reason } = e.detail
      setXpPopup({ amount, reason })
      setIsAnimating(true)
      setTimeout(() => {
        setXpPopup(null)
        setIsAnimating(false)
      }, 2000)
    }
    
    window.addEventListener('pokemon-xp', handleXP)
    return () => window.removeEventListener('pokemon-xp', handleXP)
  }, [])
  
  // Level Up & Evolution Check
  useEffect(() => {
    if (!activePokemon || !activePokemonInfo) return
    
    const newEvolutionId = checkEvolutionPossible(
      activePokemon.baseId,
      activePokemon.pokemonId,
      activePokemon.level
    )
    
    if (newEvolutionId) {
      handleEvolution(newEvolutionId)
    }
  }, [activePokemon?.level])
  
  // Check for new moves on level up
  useEffect(() => {
    if (!activePokemon || !activePokemonInfo) return
    
    const checkNewMoves = async () => {
      const learnableMoves = activePokemonInfo.levelUpMoves?.filter(
        m => m.level === activePokemon.level
      ) || []
      
      for (const move of learnableMoves) {
        const moveDetails = await fetchMoveDetails(move.url)
        if (moveDetails) {
          const currentMoves = activePokemon.moves || []
          if (currentMoves.length < 4) {
            gameState.learnMove(state.activeIndex, moveDetails)
            setMessage(`${activePokemonInfo.name} lernt ${moveDetails.name}!`)
          } else {
            setPendingMove(moveDetails)
            // Don't auto-open - user clicks notification
          }
        }
      }
    }
    
    checkNewMoves()
  }, [activePokemon?.level, activePokemonInfo])
  
  // === HANDLERS ===
  
  const handleStarterSelect = async (starter) => {
    try {
      const result = await gameState.selectStarter(starter)
      setPokemonInfoMap(prev => ({ ...prev, [starter.id]: starter }))
      
      if (result.isShiny) {
        setMessage(`WOW! Ein SHINY ${starter.name}! ✨`)
      } else {
        setMessage(`${starter.name}, ich wähle dich!`)
      }
    } catch (error) {
      setMessage('Fehler beim Laden des Starters!')
    }
  }
  
  const handlePet = () => {
    if (!canPet) return
    
    const result = xpEvents.handlePet()
    if (result.success) {
      gameState.addXP(5)
      setMessage(['*freut sich*', '❤️', '*schnurr*', 'Danke!'][Math.floor(Math.random() * 4)])
      setCanPet(false)
      setTimeout(() => setCanPet(true), COOLDOWNS.PET)
    }
  }
  
  const handleEvolution = async (newPokemonId) => {
    setIsEvolving(true)
    setMessage('Was? Dein Pokémon entwickelt sich!')
    
    await new Promise(r => setTimeout(r, 2500))
    
    const newInfo = await fetchPokemonData(newPokemonId)
    if (newInfo) {
      gameState.evolvePokemon(state.activeIndex, newPokemonId)
      setPokemonInfoMap(prev => ({ ...prev, [newPokemonId]: newInfo }))
      setMessage(`Es wurde zu ${newInfo.name}!`)
    }
    
    setIsEvolving(false)
  }
  
  const handleLearnMove = (replaceIndex) => {
    if (!pendingMove) return
    
    if (replaceIndex === -1) {
      setMessage(`${activePokemonInfo?.name} lernt ${pendingMove.name} nicht.`)
    } else {
      const oldMove = activePokemon.moves[replaceIndex]
      gameState.learnMove(state.activeIndex, pendingMove, replaceIndex)
      setMessage(`${activePokemonInfo?.name} vergisst ${oldMove.name} und lernt ${pendingMove.name}!`)
    }
    
    setPendingMove(null)
    setShowMoveSelect(false)
  }
  
  const handleStartBattle = async (type = 'trainer') => {
    if (!canBattle) return
    
    setCanBattle(false)
    setTimeout(() => setCanBattle(true), COOLDOWNS.BATTLE)
    
    // Update battle with current pokemon info
    if (activePokemon && activePokemonInfo) {
      battle.playerPokemon = { ...activePokemon, pokemonInfo: activePokemonInfo }
    }
    
    if (type === 'wild') {
      await battle.startWildBattle()
    } else {
      await battle.startTrainerBattle()
    }
  }
  
  const handleStartArena = async (arena) => {
    if (!activePokemon || activePokemon.level < arena.requiredLevel) return
    
    if (activePokemon && activePokemonInfo) {
      battle.playerPokemon = { ...activePokemon, pokemonInfo: activePokemonInfo }
    }
    
    await battle.startArenaBattle(arena)
  }
  
  const handleBuyItem = (itemId, price) => {
    if (gameState.spendCoins(price)) {
      gameState.addItem(itemId)
      setMessage(`${itemId} gekauft!`)
    }
  }
  
  const handleUseItem = (itemId) => {
    if (gameState.useItem(itemId)) {
      setMessage('Item benutzt!')
    }
  }
  
  // Get next available arena
  const nextArena = useMemo(() => {
    if (!state?.defeatedArenas) return TECH_ARENAS[0]
    return TECH_ARENAS.find(a => !state.defeatedArenas.includes(a.id)) || null
  }, [state?.defeatedArenas])
  
  const canChallengeArena = nextArena && activePokemon && activePokemon.level >= nextArena.requiredLevel
  
  // Effective Stats (memoized)
  const effectiveStats = useMemo(() => {
    if (!activePokemonInfo?.stats || !activePokemon) return null
    return calculateEffectiveStats(
      activePokemonInfo.stats,
      activePokemon.level,
      activePokemon.moves || [],
      activePokemon.isShiny
    )
  }, [activePokemonInfo?.stats, activePokemon?.level, activePokemon?.moves, activePokemon?.isShiny])
  
  // XP Progress
  const xpNeeded = activePokemon ? xpForNextLevel(activePokemon.level) : 0
  const xpProgress = activePokemon ? (activePokemon.xp / xpNeeded) * 100 : 0

  return (
    <>
      {/* Styles */}
      <style>{`
        @keyframes wiggle { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg) scale(1.05); } }
        @keyframes evolve-glow { 0%, 100% { filter: brightness(1) drop-shadow(0 0 10px white); } 50% { filter: brightness(3) drop-shadow(0 0 40px white); } }
        @keyframes xp-float { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-30px); } }
        .wiggle-animation { animation: wiggle 2s ease-in-out infinite; }
        .evolving { animation: evolve-glow 0.5s ease-in-out infinite; }
        .shiny-sparkle { filter: drop-shadow(0 0 8px gold) drop-shadow(0 0 15px yellow); }
        .xp-popup { animation: xp-float 2s ease-out forwards; }
      `}</style>
      
      {/* XP Popup */}
      {xpPopup && (
        <div className="fixed bottom-24 right-8 z-50 xp-popup">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            +{xpPopup.amount} XP
            <span className="text-xs ml-1 opacity-80">{xpPopup.reason}</span>
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
            isAnimating ? 'animate-bounce' : 'wiggle-animation'
          } ${
            istDunkel 
              ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/30' 
              : 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-400/30'
          }`}
          style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
        >
          {activePokemonInfo ? (
            <img 
              src={activePokemon?.isShiny ? activePokemonInfo.shinySprite : activePokemonInfo.sprite}
              alt={activePokemonInfo.name}
              className={`w-14 h-14 object-contain ${activePokemon?.isShiny ? 'shiny-sparkle' : ''} ${isEvolving ? 'evolving' : ''}`}
            />
          ) : (
            <span className="text-3xl">🎮</span>
          )}
        </button>
        
        {/* Notification Badge */}
        {pendingMove && (
          <button
            onClick={() => setShowMoveSelect(true)}
            className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce shadow-lg"
          >
            <span className="text-sm">🔔</span>
          </button>
        )}
      </div>

      {/* Main Panel */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden ${
          istDunkel ? 'bg-gray-900/95 border border-gray-700' : 'bg-white/95 border border-gray-200'
        }`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-700 p-3 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                Pokémon Buddy
                {activePokemon?.isShiny && <span className="text-yellow-300">✨</span>}
              </h3>
              <div className="flex items-center gap-2">
                {/* Quest Badge */}
                {state?.dailyQuests?.length > 0 && (
                  <QuestBadge 
                    quests={state.dailyQuests} 
                    progress={state.questProgress || {}}
                    onClick={() => setShowQuests(true)}
                  />
                )}
                {/* Pending Move */}
                {pendingMove && (
                  <button 
                    onClick={() => setShowMoveSelect(true)}
                    className="bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold animate-pulse"
                  >
                    🔔
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl">×</button>
              </div>
            </div>
            {activePokemonInfo && (
              <p className="text-xs text-white/80">{activePokemonInfo.name} • Lv. {activePokemon?.level}</p>
            )}
          </div>

          {/* Content */}
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {!hasStarted ? (
              <StarterSelection onSelect={handleStarterSelect} />
            ) : (
              <>
                {/* Tabs */}
                <div className="flex gap-1 mb-3">
                  {['pokemon', 'team', 'items'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeTab === tab
                          ? 'bg-red-500 text-white'
                          : istDunkel
                            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tab === 'pokemon' && '🎮 Pokémon'}
                      {tab === 'team' && `👥 Team (${state?.team?.length || 0})`}
                      {tab === 'items' && '🎒 Items'}
                    </button>
                  ))}
                </div>

                {/* Pokemon Tab */}
                {activeTab === 'pokemon' && (
                  <>
                    {/* Pokemon Display */}
                    <div className={`text-center mb-3 ${isEvolving ? 'evolving' : isAnimating ? 'animate-bounce' : ''}`}>
                      {activePokemonInfo && (
                        <>
                          <img 
                            src={activePokemon?.isShiny ? activePokemonInfo.shinySprite : activePokemonInfo.sprite}
                            alt={activePokemonInfo.name}
                            className={`w-24 h-24 mx-auto ${activePokemon?.isShiny ? 'shiny-sparkle' : ''}`}
                          />
                          <div className="flex justify-center gap-1 mt-1">
                            {activePokemonInfo.types?.map(type => (
                              <span key={type} className={`px-2 py-0.5 rounded text-[9px] text-white uppercase font-bold ${TYPE_COLORS[type]}`}>
                                {type}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Message */}
                    {message && (
                      <div className={`text-center p-2 mb-3 rounded-lg text-xs ${
                        isEvolving ? 'bg-yellow-500/20 text-yellow-400 font-bold' 
                        : istDunkel ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {message}
                      </div>
                    )}

                    {/* Stats */}
                    {activePokemon && activePokemonInfo && (
                      <PokemonStats pokemon={activePokemon} pokemonInfo={activePokemonInfo} />
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2 mt-3">
                      {/* Pet Button */}
                      <button
                        onClick={handlePet}
                        disabled={!canPet}
                        className={`w-full py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          canPet 
                            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:scale-[1.02]' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        💕 {canPet ? 'Streicheln (+5 XP)' : 'Warte...'}
                      </button>

                      {/* Battle Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleStartBattle('wild')}
                          disabled={!canBattle}
                          className={`py-2 rounded-xl font-medium text-sm transition-all ${
                            canBattle 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-[1.02]' 
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          🌿 Wild
                        </button>
                        <button
                          onClick={() => handleStartBattle('trainer')}
                          disabled={!canBattle}
                          className={`py-2 rounded-xl font-medium text-sm transition-all ${
                            canBattle 
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-[1.02]' 
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          ⚔️ Trainer
                        </button>
                      </div>

                      {/* Arena Button */}
                      {nextArena ? (
                        <button
                          onClick={() => handleStartArena(nextArena)}
                          disabled={!canChallengeArena}
                          className={`w-full py-2 rounded-xl font-medium transition-all flex flex-col items-center ${
                            canChallengeArena
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:scale-[1.02]'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <span>🏟️ Arena: {nextArena.company}</span>
                          <span className="text-[10px] opacity-80">
                            {canChallengeArena 
                              ? `${nextArena.leader} (${state?.defeatedArenas?.length || 0}/8)`
                              : `Ab Level ${nextArena.requiredLevel}`
                            }
                          </span>
                        </button>
                      ) : (
                        <div className="w-full py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-center">
                          🏆 Alle Arenen besiegt!
                        </div>
                      )}
                    </div>

                    {/* Quick Links */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setShowPokedex(true)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
                          istDunkel ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        📖 Pokédex
                      </button>
                      <button
                        onClick={gameState.resetGame}
                        className={`py-1.5 px-3 rounded-lg text-xs ${
                          istDunkel ? 'text-gray-600 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}

                {/* Team Tab */}
                {activeTab === 'team' && (
                  <TeamDisplay
                    team={state?.team}
                    activeIndex={state?.activeIndex}
                    onSelect={gameState.setActiveIndex}
                    pokemonInfoMap={pokemonInfoMap}
                  />
                )}

                {/* Items Tab */}
                {activeTab === 'items' && (
                  <Inventory
                    inventory={state?.inventory}
                    onUseItem={handleUseItem}
                    onBuyItem={() => setShowShop(true)}
                  />
                )}

                {/* Stats Footer */}
                <div className={`mt-3 pt-2 border-t text-[10px] flex justify-between ${
                  istDunkel ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
                }`}>
                  <span>🏆 {state?.wins || 0}W / {state?.losses || 0}L</span>
                  <span>📖 {Object.keys(state?.pokedex || {}).length} gesehen</span>
                  <span>Tag {Math.floor((Date.now() - (state?.createdAt || Date.now())) / 86400000) + 1}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Battle Overlay */}
      {battle.isInBattle && (
        <BattleOverlay
          battle={{
            ...battle,
            playerPokemon: activePokemon ? { ...activePokemon, pokemonInfo: activePokemonInfo } : null,
          }}
          inventory={state?.inventory}
          onClose={battle.closeBattle}
        />
      )}

      {/* Move Learn Overlay */}
      {showMoveSelect && pendingMove && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl overflow-hidden ${
            istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 text-white text-center">
              <h3 className="font-bold">🎉 Neue Attacke!</h3>
              <p className="text-xs text-white/80">{activePokemonInfo?.name} will {pendingMove.name} lernen!</p>
            </div>
            
            <div className="p-4">
              {/* New Move */}
              <div className={`p-3 rounded-lg mb-3 border-2 border-green-500 ${istDunkel ? 'bg-green-900/30' : 'bg-green-50'}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${istDunkel ? 'text-white' : 'text-gray-900'}`}>{pendingMove.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${TYPE_COLORS[pendingMove.type]} text-white`}>{pendingMove.type}</span>
                </div>
                <p className={`text-xs mt-1 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                  {pendingMove.power > 0 ? `Power: ${pendingMove.power} | ${pendingMove.damageClass}` : 'Status-Attacke'}
                </p>
              </div>
              
              <p className={`text-sm mb-2 ${istDunkel ? 'text-gray-300' : 'text-gray-700'}`}>Welche Attacke vergessen?</p>
              
              {activePokemon?.moves?.map((move, i) => (
                <button
                  key={i}
                  onClick={() => handleLearnMove(i)}
                  className={`w-full p-3 rounded-lg mb-2 text-left transition-all hover:scale-[1.02] ${
                    istDunkel ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={istDunkel ? 'text-white' : 'text-gray-900'}>{move.name}</span>
                    <span className={`text-xs ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                      {move.power > 0 ? `${move.power} PWR` : 'Status'}
                    </span>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => handleLearnMove(-1)}
                className={`w-full p-2 rounded-lg text-sm ${
                  istDunkel ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                {pendingMove.name} nicht lernen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pokedex Overlay */}
      {showPokedex && (
        <Pokedex pokedex={state?.pokedex} onClose={() => setShowPokedex(false)} />
      )}

      {/* Quests Overlay */}
      {showQuests && (
        <DailyQuests
          quests={state?.dailyQuests || []}
          progress={state?.questProgress || {}}
          onClose={() => setShowQuests(false)}
        />
      )}

      {/* Shop Overlay */}
      {showShop && (
        <Shop
          inventory={state?.inventory}
          onBuy={handleBuyItem}
          onClose={() => setShowShop(false)}
        />
      )}
    </>
  )
}
