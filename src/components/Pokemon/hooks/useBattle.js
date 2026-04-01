// ============================================
// BATTLE SYSTEM HOOK - SIMPLIFIED
// Based on original PokemonBuddy battle system
// ============================================

import { useState, useCallback } from 'react'
import { fetchPokemonData } from '../api'
import { WILD_POKEMON_IDS, generateTrainerName, XP_REWARDS, TECH_ARENAS } from '../constants'

// Battle Phases
export const BATTLE_PHASES = {
  IDLE: 'idle',
  SEARCHING: 'searching',
  INTRO: 'intro',
  BATTLING: 'battling',  // Changed from FIGHTING to match BattleOverlay
  RESULT: 'result',
}

// Battle Types (for BattleOverlay)
export const BATTLE_TYPES = {
  TRAINER: 'trainer',
  ARENA: 'arena',
}

export const useBattle = (gameState, gameActions) => {
  // Battle State
  const [battlePhase, setBattlePhase] = useState(BATTLE_PHASES.IDLE)
  const [battleType, setBattleType] = useState(BATTLE_TYPES.TRAINER)
  const [battleLog, setBattleLog] = useState([])
  
  // HP State (0-100 percent)
  const [playerHP, setPlayerHP] = useState(100)
  const [opponentHP, setOpponentHP] = useState(100)
  
  // Pokemon State
  const [playerPokemon, setPlayerPokemon] = useState(null)
  const [opponentPokemon, setOpponentPokemon] = useState(null)
  const [opponentLevel, setOpponentLevel] = useState(1)
  
  // Trainer/Arena State
  const [trainerName, setTrainerName] = useState('')
  const [currentArena, setCurrentArena] = useState(null)
  const [arenaIndex, setArenaIndex] = useState(0)
  const [arenaTeam, setArenaTeam] = useState([])
  
  // Result
  const [battleResult, setBattleResult] = useState(null)
  
  // Helper: delay
  const delay = (ms) => new Promise(r => setTimeout(r, ms))
  
  // Helper: add to log
  const addLog = useCallback((msg) => {
    setBattleLog(prev => [...prev, msg])
  }, [])
  
  // Calculate effective stats (simplified)
  const calculateStats = (pokemon, level, isPlayer = false) => {
    const baseTotal = pokemon?.stats?.total || 300
    const levelBonus = level * 10
    
    // Player gets bonus from moves
    let moveBonus = 0
    if (isPlayer && gameState?.activePokemon?.moves) {
      gameState.activePokemon.moves.forEach(move => {
        if (move.power > 0) moveBonus += move.power * 0.3
      })
    }
    
    // Shiny bonus
    const shinyBonus = (isPlayer && gameState?.activePokemon?.isShiny) ? 50 : 0
    
    return baseTotal + levelBonus + moveBonus + shinyBonus
  }
  
  // Calculate damage (returns 10-30 based on stat difference)
  const calculateDamage = (attackerPower, defenderPower) => {
    const ratio = attackerPower / defenderPower
    const baseDamage = 15 * ratio
    const variation = 0.8 + Math.random() * 0.4 // 80-120%
    return Math.floor(Math.max(8, Math.min(35, baseDamage * variation)))
  }
  
  // === TRAINER BATTLE ===
  const startTrainerBattle = useCallback(async () => {
    if (!gameState?.activePokemon) return
    
    // Reset state
    setBattlePhase(BATTLE_PHASES.SEARCHING)
    setBattleType(BATTLE_TYPES.TRAINER)
    setBattleLog(['Suche Gegner...'])
    setPlayerHP(100)
    setOpponentHP(100)
    setOpponentPokemon(null)
    setBattleResult(null)
    setCurrentArena(null)
    
    const pokemon = gameState.activePokemon
    setPlayerPokemon(pokemon)
    
    await delay(1500)
    
    // Generate trainer
    const trainer = generateTrainerName()
    setTrainerName(trainer)
    setBattlePhase(BATTLE_PHASES.INTRO)
    setBattleLog([`${trainer} ist aufgetaucht!`])
    
    await delay(1200)
    
    // Load opponent Pokemon
    const randomId = WILD_POKEMON_IDS[Math.floor(Math.random() * WILD_POKEMON_IDS.length)]
    const oppInfo = await fetchPokemonData(randomId)
    
    if (!oppInfo) {
      setBattlePhase(BATTLE_PHASES.IDLE)
      return
    }
    
    gameActions.markSeen(randomId)
    
    // Opponent level: player level -2 to +1 (easier at start)
    const playerLevel = pokemon.level || 1
    const oppLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 4) - 2)
    
    setOpponentPokemon(oppInfo)
    setOpponentLevel(oppLevel)
    
    setBattleLog([
      `${trainer} ist aufgetaucht!`,
      `${trainer} schickt ${oppInfo.name} (Lv.${oppLevel})!`
    ])
    
    await delay(1500)
    
    // Start fighting
    setBattlePhase(BATTLE_PHASES.BATTLING)
    await runBattle(oppInfo, oppLevel, trainer)
    
  }, [gameState?.activePokemon, gameActions])
  
  // === RUN BATTLE (animated rounds) ===
  const runBattle = useCallback(async (oppInfo, oppLevel, trainer) => {
    const pokemon = gameState.activePokemon
    const playerLevel = pokemon?.level || 1
    
    // Get player pokemon info for stats
    const playerInfo = pokemon?.pokemonInfo
    
    // Calculate power scores
    const playerPower = calculateStats(playerInfo, playerLevel, true)
    const oppPower = calculateStats(oppInfo, oppLevel, false)
    
    let pHP = 100
    let oHP = 100
    
    const logs = [
      `${trainer} ist aufgetaucht!`,
      `${trainer} schickt ${oppInfo.name} (Lv.${oppLevel})!`,
      `⚡ Deine Stärke: ${Math.floor(playerPower)} | Gegner: ${Math.floor(oppPower)}`
    ]
    setBattleLog([...logs])
    
    await delay(1000)
    
    // Player attacks first (always, for fairness at low levels)
    const playerFirst = playerLevel >= oppLevel || playerPower >= oppPower
    
    // Fight until someone reaches 0 HP (max 10 rounds for safety)
    let round = 0
    const maxRounds = 10
    
    while (pHP > 0 && oHP > 0 && round < maxRounds) {
      round++
      
      if (playerFirst) {
        // Player attacks
        await delay(800)
        const dmg = calculateDamage(playerPower, oppPower)
        oHP = Math.max(0, oHP - dmg)
        logs.push(`${playerInfo?.name || 'Dein Pokémon'} greift an! -${dmg} HP`)
        setBattleLog([...logs])
        setOpponentHP(oHP)
        
        if (oHP <= 0) break
        
        // Opponent attacks
        await delay(600)
        const oppDmg = calculateDamage(oppPower, playerPower)
        pHP = Math.max(0, pHP - oppDmg)
        logs.push(`${oppInfo.name} greift an! -${oppDmg} HP`)
        setBattleLog([...logs])
        setPlayerHP(pHP)
      } else {
        // Opponent attacks first
        await delay(800)
        const oppDmg = calculateDamage(oppPower, playerPower)
        pHP = Math.max(0, pHP - oppDmg)
        logs.push(`${oppInfo.name} greift an! -${oppDmg} HP`)
        setBattleLog([...logs])
        setPlayerHP(pHP)
        
        if (pHP <= 0) break
        
        // Player attacks
        await delay(600)
        const dmg = calculateDamage(playerPower, oppPower)
        oHP = Math.max(0, oHP - dmg)
        logs.push(`${playerInfo?.name || 'Dein Pokémon'} greift an! -${dmg} HP`)
        setBattleLog([...logs])
        setOpponentHP(oHP)
      }
    }
    
    await delay(500)
    
    // Determine winner - must have 0 HP to lose
    const won = oHP <= 0
    
    if (won) {
      const xpGain = XP_REWARDS.BATTLE_WIN_BASE + (oppLevel * XP_REWARDS.BATTLE_WIN_LEVEL_MULT)
      
      logs.push(`🎉 ${oppInfo.name} wurde besiegt!`)
      logs.push(`+${xpGain} XP`)
      setBattleLog([...logs])
      
      gameActions.recordBattle(true, xpGain)
      
      setBattleResult({ won: true, xpGain })
    } else {
      logs.push(`😔 ${playerInfo?.name || 'Dein Pokémon'} wurde besiegt...`)
      setBattleLog([...logs])
      
      gameActions.recordBattle(false)
      setBattleResult({ won: false })
    }
    
    setBattlePhase(BATTLE_PHASES.RESULT)
    
  }, [gameState?.activePokemon, gameActions])
  
  // === ARENA BATTLE ===
  const startArenaBattle = useCallback(async (arena) => {
    if (!gameState?.activePokemon) return
    
    const pokemon = gameState.activePokemon
    if (pokemon.level < arena.requiredLevel) {
      return
    }
    
    // Check if already defeated
    if (gameState.state?.defeatedArenas?.includes(arena.id)) {
      return
    }
    
    // Reset state
    setBattlePhase(BATTLE_PHASES.SEARCHING)
    setBattleType(BATTLE_TYPES.ARENA)
    setBattleLog([`Betrete ${arena.company} Arena...`])
    setPlayerHP(100)
    setOpponentHP(100)
    setBattleResult(null)
    setCurrentArena(arena)
    setArenaIndex(0)
    setPlayerPokemon(pokemon)
    
    await delay(1500)
    
    setTrainerName(arena.leader)
    setBattleLog([
      `Betrete ${arena.company} Arena...`,
      `${arena.leader} fordert dich heraus!`
    ])
    setBattlePhase(BATTLE_PHASES.INTRO)
    
    await delay(1200)
    
    // Load all 3 arena Pokemon
    const team = []
    for (const pokemonId of arena.pokemon) {
      const info = await fetchPokemonData(pokemonId)
      if (info) {
        team.push(info)
        gameActions.markSeen(pokemonId)
      }
    }
    setArenaTeam(team)
    
    if (team.length === 0) {
      setBattlePhase(BATTLE_PHASES.IDLE)
      return
    }
    
    // Fight each Pokemon in sequence
    await runArenaFights(arena, team, pokemon)
    
  }, [gameState?.activePokemon, gameState?.state?.defeatedArenas, gameActions])
  
  // Run all arena fights
  const runArenaFights = async (arena, team, playerPokemon) => {
    const playerLevel = playerPokemon.level || 1
    const playerInfo = playerPokemon.pokemonInfo
    let currentPlayerHP = 100
    
    for (let i = 0; i < team.length; i++) {
      setArenaIndex(i)
      const oppInfo = team[i]
      const oppLevel = arena.requiredLevel + (i * 2) + Math.floor(Math.random() * 3)
      
      setOpponentPokemon(oppInfo)
      setOpponentLevel(oppLevel)
      setOpponentHP(100)
      setPlayerHP(currentPlayerHP)
      
      setBattleLog([
        `${arena.leader} schickt ${oppInfo.name}! [${i + 1}/3]`
      ])
      setBattlePhase(BATTLE_PHASES.BATTLING)
      
      await delay(1000)
      
      // Calculate powers
      const playerPower = calculateStats(playerInfo, playerLevel, true)
      const oppPower = calculateStats(oppInfo, oppLevel, false) * (1 + i * 0.1) // Each Pokemon is stronger
      
      let pHP = currentPlayerHP
      let oHP = 100
      
      const logs = [`${arena.leader} schickt ${oppInfo.name}! [${i + 1}/3]`]
      
      // Fight until someone reaches 0 HP
      let round = 0
      const maxRounds = 10
      
      while (pHP > 0 && oHP > 0 && round < maxRounds) {
        round++
        
        // Player attacks
        await delay(700)
        const dmg = calculateDamage(playerPower, oppPower)
        oHP = Math.max(0, oHP - dmg)
        logs.push(`${playerInfo?.name || 'Dein Pokémon'} greift an! -${dmg} HP`)
        setBattleLog([...logs])
        setOpponentHP(oHP)
        
        if (oHP <= 0) break
        
        // Opponent attacks
        await delay(500)
        const oppDmg = calculateDamage(oppPower, playerPower)
        pHP = Math.max(0, pHP - oppDmg)
        logs.push(`${oppInfo.name} greift an! -${oppDmg} HP`)
        setBattleLog([...logs])
        setPlayerHP(pHP)
      }
      
      // Check if player lost
      if (pHP <= 0) {
        logs.push(`😔 Niederlage gegen ${arena.company}...`)
        setBattleLog([...logs])
        setBattleResult({ won: false })
        setBattlePhase(BATTLE_PHASES.RESULT)
        gameActions.recordBattle(false)
        return
      }
      
      logs.push(`✅ ${oppInfo.name} besiegt!`)
      setBattleLog([...logs])
      currentPlayerHP = pHP
      
      if (i < team.length - 1) {
        await delay(1500)
      }
    }
    
    // Won the arena!
    await delay(500)
    const xpGain = XP_REWARDS.ARENA_WIN_BASE + (arena.id * XP_REWARDS.ARENA_WIN_MULT)
    
    const finalLogs = [
      `🏆 ${arena.company} Arena besiegt!`,
      `${arena.leader} übergibt den Orden!`,
      `+${xpGain} XP`
    ]
    setBattleLog(finalLogs)
    
    gameActions.defeatArena(arena.id, xpGain)
    
    setBattleResult({ won: true, xpGain, badge: `${arena.company}` })
    setBattlePhase(BATTLE_PHASES.RESULT)
  }
  
  // === CLOSE BATTLE ===
  const closeBattle = useCallback(() => {
    setBattlePhase(BATTLE_PHASES.IDLE)
    setBattleLog([])
    setPlayerPokemon(null)
    setOpponentPokemon(null)
    setCurrentArena(null)
    setArenaTeam([])
    setBattleResult(null)
    setPlayerHP(100)
    setOpponentHP(100)
  }, [])
  
  return {
    // State
    battlePhase,
    battleType,
    battleLog,
    isInBattle: battlePhase !== BATTLE_PHASES.IDLE,
    
    // HP
    playerHP,
    opponentHP,
    
    // Pokemon
    playerPokemon,
    opponentPokemon,
    opponentLevel,
    
    // Power scores for display (calculated on demand)
    playerPower: playerPokemon ? calculateStats(playerPokemon?.pokemonInfo, playerPokemon?.level || 1, true) : 0,
    enemyPower: opponentPokemon ? calculateStats(opponentPokemon, opponentLevel, false) : 0,
    enemyPokemon: opponentPokemon,  // Alias for BattleOverlay
    enemyLevel: opponentLevel,      // Alias for BattleOverlay
    
    // Trainer/Arena
    trainerName,
    currentArena,
    arenaIndex,
    arenaProgress: arenaIndex,      // Alias for BattleOverlay
    arenaTeam,
    
    // Result
    battleResult,
    
    // Actions
    startTrainerBattle,
    startArenaBattle,
    closeBattle,
    
    // Constants
    BATTLE_PHASES,
    BATTLE_TYPES,
  }
}
