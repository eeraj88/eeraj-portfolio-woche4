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
import TrainerNameInput from './components/TrainerNameInput'
import PokemonStats from './components/PokemonStats'
import BattleOverlay from './components/BattleOverlay'
import Pokedex from './components/Pokedex'

// Utils & Constants
import { fetchPokemonData, fetchMoveDetails } from './api'
import { checkEvolutionPossible, calculateEffectiveStats, calculatePowerScore } from './utils'
import { TECH_ARENAS, COOLDOWNS, TYPE_COLORS, xpForNextLevel } from './constants'

// Firebase
import { saveTrainerData, calculateTrainerScore } from '../../firebase'

// Re-export giveXP for external use
export { giveXP }

export default function PokemonBuddy() {
  const { istDunkel } = useContext(ThemeContext)
  
  // Game State (useReducer)
  const gameState = useGameState()
  const { state, activePokemon, hasStarted, hasTrainerName } = gameState
  
  // Battle System
  const battle = useBattle(
    { activePokemon: activePokemon ? { ...activePokemon, pokemonInfo: null } : null },
    gameState
  )
  
  // XP Events (Portfolio Interactions)
  const xpEvents = useXPEvents(gameState, hasStarted)
  
  // UI State
  const [isOpen, setIsOpen] = useState(false)
  const [showPokedex, setShowPokedex] = useState(false)
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
  
  // Sync to Firebase leaderboard when important stats change
  useEffect(() => {
    if (!state?.trainerId || !state?.trainerName || !activePokemon) return
    
    const syncToLeaderboard = async () => {
      const trainerData = {
        name: state.trainerName,
        pokemonId: activePokemon.pokemonId,
        level: activePokemon.level,
        wins: state.wins || 0,
        losses: state.losses || 0,
        defeatedArenas: state.defeatedArenas || [],
        isShiny: activePokemon.isShiny || false,
        score: calculateTrainerScore({
          level: activePokemon.level,
          wins: state.wins || 0,
          losses: state.losses || 0,
          defeatedArenas: state.defeatedArenas || [],
          isShiny: activePokemon.isShiny || false,
        })
      }
      
      await saveTrainerData(state.trainerId, trainerData)
    }
    
    syncToLeaderboard()
  }, [state?.trainerId, activePokemon?.level, state?.wins, state?.losses, state?.defeatedArenas?.length])
  
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
      if (!starter || !starter.id) {
        setMessage('Fehler: Ungültiges Pokémon!')
        return
      }
      
      const result = await gameState.selectStarter(starter)
      
      if (!result || !result.pokemon) {
        setMessage('Fehler beim Laden des Starters!')
        return
      }
      
      setPokemonInfoMap(prev => ({ ...prev, [starter.id]: starter }))
      
      // Show detailed info about the Pokemon's unique characteristics
      let msg = `${starter.name}, ich wähle dich!`
      if (result.isShiny) {
        msg = `WOW! Ein SHINY ${starter.name}! ✨`
      }
      if (result.nature?.name) {
        msg += ` (${result.nature.emoji || ''} ${result.nature.name})`
      }
      if (result.ivs?.potential === 'Outstanding') {
        msg += ' ⭐ Ausgezeichnete Gene!'
      }
      setMessage(msg)
    } catch (error) {
      console.error('Starter selection error:', error)
      setMessage('Fehler beim Laden! Bitte nochmal versuchen.')
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
  
  const handleStartBattle = async () => {
    if (!canBattle) return
    
    setCanBattle(false)
    setTimeout(() => setCanBattle(true), COOLDOWNS.BATTLE)
    
    // Update battle with current pokemon info
    if (activePokemon && activePokemonInfo) {
      battle.playerPokemon = { ...activePokemon, pokemonInfo: activePokemonInfo }
    }
    
    await battle.startTrainerBattle()
  }
  
  const handleStartArena = async (arena) => {
    if (!activePokemon || activePokemon.level < arena.requiredLevel) return
    
    if (activePokemon && activePokemonInfo) {
      battle.playerPokemon = { ...activePokemon, pokemonInfo: activePokemonInfo }
    }
    
    await battle.startArenaBattle(arena)
  }
  
  // Get next available arena
  const nextArena = useMemo(() => {
    if (!state?.defeatedArenas) return TECH_ARENAS[0]
    return TECH_ARENAS.find(a => !state.defeatedArenas.includes(a.id)) || null
  }, [state?.defeatedArenas])
  
  const canChallengeArena = nextArena && activePokemon && activePokemon.level >= nextArena.requiredLevel
  
  // Effective Stats (memoized) - Updated for new Pokemon structure
  const effectiveStats = useMemo(() => {
    if (!activePokemonInfo?.stats || !activePokemon) return null
    return calculateEffectiveStats(
      activePokemonInfo.stats,
      activePokemon.level,
      activePokemon // Pass whole pokemon object with IVs, nature, etc.
    )
  }, [activePokemonInfo?.stats, activePokemon])
  
  // Power Score for display
  const powerScore = useMemo(() => {
    if (!activePokemon) return 0
    return calculatePowerScore(activePokemon, activePokemonInfo?.stats)
  }, [activePokemon, activePokemonInfo?.stats])
  
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
          className={`pokemon-button-pulse w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
            isAnimating ? 'animate-bounce' : ''
          } ${
            istDunkel 
              ? 'bg-gradient-to-br from-cyan-500 to-cyan-700' 
              : 'bg-gradient-to-br from-teal-400 to-teal-600'
          }`}
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
          <div className={`p-3 text-white ${istDunkel ? 'bg-gradient-to-r from-cyan-600 to-cyan-800' : 'bg-gradient-to-r from-teal-500 to-teal-700'}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                {state?.trainerName ? `Trainer ${state.trainerName}` : 'Pokémon Buddy'}
                {activePokemon?.isShiny && <span className="text-yellow-300">✨</span>}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl">×</button>
            </div>
            {activePokemonInfo && (
              <p className="text-xs text-white/80">{activePokemonInfo.name} • Lv. {activePokemon?.level}</p>
            )}
          </div>

          {/* Content */}
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            {!hasTrainerName ? (
              <TrainerNameInput onSubmit={(name) => {
                gameState.setTrainerName(name)
                setMessage(`Willkommen, ${name}!`)
              }} />
            ) : !hasStarted ? (
              <StarterSelection onSelect={handleStarterSelect} />
            ) : (
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

                {/* Power Score & Nature - Simplified */}
                {activePokemon && (
                  <div className={`flex justify-center items-center gap-3 mb-3 p-2 rounded-lg text-sm ${
                    istDunkel ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <span className={`font-bold ${istDunkel ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      ⚡ {powerScore}
                    </span>
                    {activePokemon.nature && (
                      <span className={istDunkel ? 'text-gray-300' : 'text-gray-600'}>
                        {activePokemon.nature.emoji} {activePokemon.nature.name}
                      </span>
                    )}
                  </div>
                )}

                {/* XP Bar */}
                {activePokemon && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>XP</span>
                      <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>
                        {activePokemon.xp}/{xpNeeded}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${istDunkel ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
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

                  {/* Trainer Battle Button */}
                  <button
                    onClick={handleStartBattle}
                    disabled={!canBattle}
                    className={`w-full py-2 rounded-xl font-medium transition-all ${
                      canBattle 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-[1.02]' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    ⚔️ {canBattle ? 'Trainer-Kampf' : 'Warte...'}
                  </button>

                  {/* Arena Button */}
                  {nextArena && (
                    <button
                      onClick={() => handleStartArena(nextArena)}
                      disabled={!canChallengeArena}
                      className={`w-full py-2 rounded-xl font-medium transition-all text-sm ${
                        canChallengeArena
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:scale-[1.02]'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      🏟️ {nextArena.company} Arena {!canChallengeArena && `(Lv.${nextArena.requiredLevel})`}
                    </button>
                  )}
                </div>

                {/* Footer Stats */}
                <div className={`mt-3 pt-2 border-t text-[10px] flex justify-between ${
                  istDunkel ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
                }`}>
                  <span>🏆 {state?.wins || 0}W/{state?.losses || 0}L</span>
                  <button
                    onClick={() => setShowPokedex(true)}
                    className="hover:text-cyan-400"
                  >
                    📖 Pokédex
                  </button>
                  <button
                    onClick={gameState.resetGame}
                    className="hover:text-red-400"
                  >
                    🗑️ Reset
                  </button>
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
    </>
  )
}
