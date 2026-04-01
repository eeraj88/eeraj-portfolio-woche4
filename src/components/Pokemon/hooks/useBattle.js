// ============================================
// AUTO-BATTLE SYSTEM HOOK
// Fast, automatic battles - no turn-based mechanics
// ============================================

import { useState, useCallback, useRef } from 'react'
import { calculatePowerScore, calculateEffectiveStats } from '../utils'
import { fetchPokemonData } from '../api'
import { WILD_POKEMON_IDS, generateTrainerName, XP_REWARDS, TECH_ARENAS, RARE_EVENTS } from '../constants'

// Battle Phases (simplified for auto-battle)
export const BATTLE_PHASES = {
  IDLE: 'idle',
  SEARCHING: 'searching',
  BATTLING: 'battling',      // Auto-battle in progress
  RESULT: 'result',
}

// Battle Types
export const BATTLE_TYPES = {
  WILD: 'wild',
  TRAINER: 'trainer',
  ARENA: 'arena',
}

export const useBattle = (gameState, gameActions) => {
  // Battle State
  const [battlePhase, setBattlePhase] = useState(BATTLE_PHASES.IDLE)
  const [battleType, setBattleType] = useState(null)
  const [battleLog, setBattleLog] = useState([])
  
  // Battle Data
  const [playerPokemon, setPlayerPokemon] = useState(null)
  const [playerPower, setPlayerPower] = useState(0)
  const [enemyPokemon, setEnemyPokemon] = useState(null)
  const [enemyPower, setEnemyPower] = useState(0)
  const [enemyLevel, setEnemyLevel] = useState(1)
  
  // Trainer/Arena State
  const [trainerName, setTrainerName] = useState('')
  const [currentArena, setCurrentArena] = useState(null)
  const [arenaProgress, setArenaProgress] = useState(0) // 0, 1, 2 for 3 fights
  
  // Result State
  const [battleResult, setBattleResult] = useState(null) // { won, xpGain, coins, rareEvent }
  
  // Animation progress (0-100)
  const [battleProgress, setBattleProgress] = useState(0)
  const animationRef = useRef(null)
  
  // === HELPER FUNCTIONS ===
  
  const addLog = useCallback((message, type = 'normal') => {
    setBattleLog(prev => [...prev.slice(-10), { message, type, id: Date.now() }])
  }, [])
  
  const clearLog = useCallback(() => {
    setBattleLog([])
  }, [])
  
  /**
   * Check for rare events during battle
   */
  const checkRareEvent = useCallback(() => {
    for (const [eventKey, event] of Object.entries(RARE_EVENTS)) {
      if (Math.random() < event.chance) {
        return { key: eventKey, ...event }
      }
    }
    return null
  }, [])
  
  /**
   * Run the auto-battle simulation
   * Returns { won: boolean, margin: number }
   */
  const simulateBattle = useCallback((playerPwr, enemyPwr) => {
    // Add randomness (±20%)
    const playerFinal = playerPwr * (0.8 + Math.random() * 0.4)
    const enemyFinal = enemyPwr * (0.8 + Math.random() * 0.4)
    
    // Higher power = higher win chance, but not guaranteed
    const total = playerFinal + enemyFinal
    const winChance = playerFinal / total
    const roll = Math.random()
    
    const won = roll < winChance
    const margin = Math.abs(playerFinal - enemyFinal) / Math.max(playerFinal, enemyFinal)
    
    return { won, margin, playerFinal, enemyFinal }
  }, [])
  
  /**
   * Animate the battle progress bar
   */
  const animateBattle = useCallback((duration, onComplete) => {
    const startTime = Date.now()
    
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, (elapsed / duration) * 100)
      setBattleProgress(progress)
      
      if (progress < 100) {
        animationRef.current = requestAnimationFrame(tick)
      } else {
        onComplete()
      }
    }
    
    animationRef.current = requestAnimationFrame(tick)
  }, [])
  
  // === WILD BATTLE ===
  
  const startWildBattle = useCallback(async () => {
    if (!gameState?.activePokemon) return
    
    setBattleType(BATTLE_TYPES.WILD)
    setBattlePhase(BATTLE_PHASES.SEARCHING)
    setBattleProgress(0)
    clearLog()
    addLog('Suche wildes Pokémon...', 'system')
    
    // Random wild Pokemon
    const randomId = WILD_POKEMON_IDS[Math.floor(Math.random() * WILD_POKEMON_IDS.length)]
    const wildPokemon = await fetchPokemonData(randomId)
    
    if (!wildPokemon) {
      addLog('Kein Pokémon gefunden!', 'error')
      setBattlePhase(BATTLE_PHASES.IDLE)
      return
    }
    
    gameActions.markSeen(randomId)
    
    // Level based on player (±3)
    const playerLevel = gameState.activePokemon.level
    const wildLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 7) - 3)
    
    // Calculate power scores
    const pPower = calculatePowerScore(gameState.activePokemon, null)
    const ePower = wildLevel * 8 + (wildPokemon.stats?.total || 300) * 0.3
    
    setPlayerPokemon(gameState.activePokemon)
    setPlayerPower(pPower)
    setEnemyPokemon(wildPokemon)
    setEnemyPower(Math.floor(ePower))
    setEnemyLevel(wildLevel)
    setTrainerName('')
    
    addLog(`Wildes ${wildPokemon.name} (Lv.${wildLevel}) erscheint!`, 'encounter')
    addLog(`Deine Power: ${pPower} vs Gegner: ${Math.floor(ePower)}`, 'system')
    
    // Start auto-battle
    setBattlePhase(BATTLE_PHASES.BATTLING)
    
    animateBattle(2000, () => {
      const result = simulateBattle(pPower, ePower)
      finishBattle(result, wildPokemon, wildLevel, BATTLE_TYPES.WILD)
    })
  }, [gameState?.activePokemon, gameActions, addLog, clearLog, animateBattle, simulateBattle])
  
  // === TRAINER BATTLE ===
  
  const startTrainerBattle = useCallback(async () => {
    if (!gameState?.activePokemon) return
    
    setBattleType(BATTLE_TYPES.TRAINER)
    setBattlePhase(BATTLE_PHASES.SEARCHING)
    setBattleProgress(0)
    clearLog()
    
    const trainer = generateTrainerName()
    setTrainerName(trainer)
    addLog(`${trainer} fordert dich heraus!`, 'encounter')
    
    // Random trainer Pokemon
    const randomId = WILD_POKEMON_IDS[Math.floor(Math.random() * WILD_POKEMON_IDS.length)]
    const trainerPokemon = await fetchPokemonData(randomId)
    
    if (!trainerPokemon) {
      addLog('Fehler!', 'error')
      setBattlePhase(BATTLE_PHASES.IDLE)
      return
    }
    
    gameActions.markSeen(randomId)
    
    const playerLevel = gameState.activePokemon.level
    const oppLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 5) - 2)
    
    // Trainers have slightly higher power
    const pPower = calculatePowerScore(gameState.activePokemon, null)
    const ePower = (oppLevel * 10 + (trainerPokemon.stats?.total || 300) * 0.35) * 1.1
    
    setPlayerPokemon(gameState.activePokemon)
    setPlayerPower(pPower)
    setEnemyPokemon(trainerPokemon)
    setEnemyPower(Math.floor(ePower))
    setEnemyLevel(oppLevel)
    
    addLog(`${trainer} schickt ${trainerPokemon.name} (Lv.${oppLevel})!`, 'system')
    addLog(`Power: ${pPower} vs ${Math.floor(ePower)}`, 'system')
    
    setBattlePhase(BATTLE_PHASES.BATTLING)
    
    animateBattle(2500, () => {
      const result = simulateBattle(pPower, ePower)
      finishBattle(result, trainerPokemon, oppLevel, BATTLE_TYPES.TRAINER, trainer)
    })
  }, [gameState?.activePokemon, gameActions, addLog, clearLog, animateBattle, simulateBattle])
  
  // === ARENA BATTLE ===
  
  const startArenaBattle = useCallback(async (arena) => {
    if (!gameState?.activePokemon) return
    
    if (gameState.activePokemon.level < arena.requiredLevel) {
      addLog(`Level ${arena.requiredLevel} erforderlich!`, 'error')
      return
    }
    
    if (gameState.defeatedArenas?.includes(arena.id)) {
      addLog('Arena bereits besiegt!', 'system')
      return
    }
    
    setBattleType(BATTLE_TYPES.ARENA)
    setBattlePhase(BATTLE_PHASES.SEARCHING)
    setBattleProgress(0)
    clearLog()
    setCurrentArena(arena)
    setArenaProgress(0)
    
    addLog(`Betrete ${arena.company} Arena!`, 'encounter')
    addLog(`${arena.leader} fordert dich heraus!`, 'system')
    setTrainerName(arena.leader)
    
    // Fight all 3 arena Pokemon in sequence
    await runArenaBattles(arena, 0)
  }, [gameState?.activePokemon, gameState?.defeatedArenas, addLog, clearLog])
  
  const runArenaBattles = useCallback(async (arena, startIndex) => {
    const playerLevel = gameState.activePokemon.level
    const pPower = calculatePowerScore(gameState.activePokemon, null)
    
    let won = true
    let totalXP = 0
    
    for (let i = startIndex; i < arena.pokemon.length && won; i++) {
      setArenaProgress(i)
      
      const pokemonId = arena.pokemon[i]
      const arenaPokemon = await fetchPokemonData(pokemonId)
      
      if (!arenaPokemon) continue
      
      gameActions.markSeen(pokemonId)
      
      // Arena level scales with arena difficulty
      const arenaLevel = arena.requiredLevel + (i * 3)
      const ePower = arena.power + (i * 50)
      
      setEnemyPokemon(arenaPokemon)
      setEnemyPower(ePower)
      setEnemyLevel(arenaLevel)
      
      addLog(`${arena.leader} schickt ${arenaPokemon.name}! [${i + 1}/3]`, 'encounter')
      
      setBattlePhase(BATTLE_PHASES.BATTLING)
      
      // Wait for battle animation
      await new Promise(resolve => {
        animateBattle(2000, () => {
          const result = simulateBattle(pPower, ePower)
          won = result.won
          
          if (won) {
            addLog(`${arenaPokemon.name} besiegt!`, 'victory')
            totalXP += Math.floor(arenaLevel * 3)
          } else {
            addLog(`Dein Pokémon wurde besiegt...`, 'defeat')
          }
          
          resolve()
        })
      })
      
      if (won && i < arena.pokemon.length - 1) {
        await new Promise(r => setTimeout(r, 1000))
        setBattleProgress(0)
      }
    }
    
    // Final result
    if (won) {
      const xpGain = XP_REWARDS.ARENA_WIN_BASE + (arena.id * XP_REWARDS.ARENA_WIN_MULT) + totalXP
      const coins = 50 + arena.id * 20
      
      addLog(`${arena.badge} ${arena.company}-Orden erhalten!`, 'badge')
      addLog(`+${xpGain} XP, +${coins} Münzen!`, 'xp')
      
      gameActions.defeatArena(arena.id, xpGain)
      gameActions.addCoins(coins)
      
      setBattleResult({ won: true, xpGain, coins, badge: arena.badge })
    } else {
      gameActions.recordBattle(false)
      setBattleResult({ won: false, xpGain: 0, coins: 0 })
    }
    
    setBattlePhase(BATTLE_PHASES.RESULT)
    
    setTimeout(() => {
      closeBattle()
    }, 3000)
  }, [gameState?.activePokemon, gameActions, addLog, animateBattle, simulateBattle])
  
  // === FINISH BATTLE ===
  
  const finishBattle = useCallback((result, enemy, enemyLvl, type, trainerNm = '') => {
    const { won, margin } = result
    
    // Check for rare event
    const rareEvent = won ? checkRareEvent() : null
    
    if (won) {
      addLog(`${enemy.name} wurde besiegt!`, 'victory')
      
      // Calculate rewards
      let xpGain = XP_REWARDS.BATTLE_WIN_BASE + Math.floor(enemyLvl * XP_REWARDS.BATTLE_WIN_LEVEL_MULT)
      let coins = 0
      
      // Bonus for close battles
      if (margin < 0.1) {
        xpGain = Math.floor(xpGain * 1.5)
        addLog('Knapper Sieg! +50% XP!', 'critical')
      }
      
      if (type === BATTLE_TYPES.TRAINER) {
        coins = 10 + enemyLvl * 2
        gameActions.addCoins(coins)
      }
      
      // Handle rare event
      if (rareEvent) {
        addLog(`${rareEvent.emoji} ${rareEvent.name}!`, 'rare')
        
        switch (rareEvent.key) {
          case 'STAT_BOOST':
          case 'CRITICAL_TRAINING':
            xpGain = Math.floor(xpGain * 1.5)
            break
          case 'RARE_CANDY':
            xpGain += 100
            break
          case 'FRIENDSHIP_BOOST':
            xpGain += 30
            break
          default:
            xpGain += XP_REWARDS.RARE_EVENT
        }
      }
      
      gameActions.recordBattle(true, xpGain)
      addLog(`+${xpGain} XP${coins > 0 ? `, +${coins} Münzen` : ''}!`, 'xp')
      
      setBattleResult({ won: true, xpGain, coins, rareEvent })
    } else {
      addLog('Dein Pokémon wurde besiegt...', 'defeat')
      gameActions.recordBattle(false)
      setBattleResult({ won: false, xpGain: 0, coins: 0 })
    }
    
    setBattlePhase(BATTLE_PHASES.RESULT)
    
    // Auto-close after delay
    setTimeout(() => {
      closeBattle()
    }, 2500)
  }, [gameActions, addLog, checkRareEvent])
  
  // === CLOSE BATTLE ===
  
  const closeBattle = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    setBattlePhase(BATTLE_PHASES.IDLE)
    setBattleType(null)
    setPlayerPokemon(null)
    setEnemyPokemon(null)
    setCurrentArena(null)
    setBattleResult(null)
    setBattleProgress(0)
    setArenaProgress(0)
    clearLog()
  }, [clearLog])
  
  return {
    // State
    battlePhase,
    battleType,
    battleLog,
    battleProgress,
    battleResult,
    isInBattle: battlePhase !== BATTLE_PHASES.IDLE,
    
    // Pokemon
    playerPokemon,
    playerPower,
    enemyPokemon,
    enemyPower,
    enemyLevel,
    
    // Trainer/Arena
    trainerName,
    currentArena,
    arenaProgress,
    
    // Actions
    startWildBattle,
    startTrainerBattle,
    startArenaBattle,
    closeBattle,
    
    // Constants
    BATTLE_PHASES,
    BATTLE_TYPES,
  }
}
