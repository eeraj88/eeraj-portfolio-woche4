// ============================================
// TURN-BASED BATTLE SYSTEM HOOK
// ============================================

import { useState, useCallback, useRef } from 'react'
import { calculateDamage, calculateEffectiveStats, getEffectivenessText, calculateCatchRate } from '../utils'
import { fetchPokemonData } from '../api'
import { WILD_POKEMON_IDS, generateTrainerName, ITEMS, XP_REWARDS, TECH_ARENAS } from '../constants'

// Battle Phases
export const BATTLE_PHASES = {
  IDLE: 'idle',
  SEARCHING: 'searching',
  INTRO: 'intro',
  PLAYER_TURN: 'player_turn',
  ENEMY_TURN: 'enemy_turn',
  ANIMATION: 'animation',
  CATCH_ATTEMPT: 'catch_attempt',
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
  
  // Player State
  const [playerPokemon, setPlayerPokemon] = useState(null)
  const [playerHP, setPlayerHP] = useState(100)
  const [playerMaxHP, setPlayerMaxHP] = useState(100)
  const [playerStats, setPlayerStats] = useState(null)
  const [playerBoosts, setPlayerBoosts] = useState({})
  
  // Enemy State
  const [enemyPokemon, setEnemyPokemon] = useState(null)
  const [enemyHP, setEnemyHP] = useState(100)
  const [enemyMaxHP, setEnemyMaxHP] = useState(100)
  const [enemyLevel, setEnemyLevel] = useState(1)
  const [enemyStats, setEnemyStats] = useState(null)
  const [enemyMoves, setEnemyMoves] = useState([])
  
  // Trainer/Arena State
  const [trainerName, setTrainerName] = useState('')
  const [currentArena, setCurrentArena] = useState(null)
  const [arenaTeam, setArenaTeam] = useState([])
  const [arenaIndex, setArenaIndex] = useState(0)
  
  // Catch State
  const [canCatch, setCanCatch] = useState(false)
  const [catchAttempts, setCatchAttempts] = useState(0)
  
  // Animation ref
  const animationRef = useRef(null)
  
  // === HELPER FUNCTIONS ===
  
  const addLog = useCallback((message, type = 'normal') => {
    setBattleLog(prev => [...prev, { message, type, id: Date.now() }])
  }, [])
  
  const clearLog = useCallback(() => {
    setBattleLog([])
  }, [])
  
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  
  // === BATTLE INITIALIZATION ===
  
  const startWildBattle = useCallback(async () => {
    if (!gameState?.activePokemon) return
    
    setBattleType(BATTLE_TYPES.WILD)
    setBattlePhase(BATTLE_PHASES.SEARCHING)
    clearLog()
    addLog('Ein wildes Pokémon erscheint...', 'system')
    
    await delay(1000)
    
    // Zufälliges wildes Pokemon
    const randomId = WILD_POKEMON_IDS[Math.floor(Math.random() * WILD_POKEMON_IDS.length)]
    const wildPokemon = await fetchPokemonData(randomId)
    
    if (!wildPokemon) {
      addLog('Fehler beim Laden des Pokémon!', 'error')
      setBattlePhase(BATTLE_PHASES.IDLE)
      return
    }
    
    // Pokedex: Als gesehen markieren
    gameActions.markSeen(randomId)
    
    // Level basierend auf Spieler (±3)
    const playerLevel = gameState.activePokemon.level
    const wildLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 7) - 3)
    
    // Stats berechnen
    const wildStats = calculateEffectiveStats(wildPokemon.stats, wildLevel, [], false)
    const pStats = calculateEffectiveStats(
      null, // Wird später mit echten Stats gefüllt
      playerLevel,
      gameState.activePokemon.moves,
      gameState.activePokemon.isShiny
    )
    
    setEnemyPokemon(wildPokemon)
    setEnemyLevel(wildLevel)
    setEnemyStats(wildStats)
    setEnemyHP(wildStats.hp)
    setEnemyMaxHP(wildStats.hp)
    setEnemyMoves([]) // Wilde Pokemon haben Random-Moves
    
    setPlayerPokemon(gameState.activePokemon)
    setPlayerStats(pStats)
    setPlayerHP(pStats.hp)
    setPlayerMaxHP(pStats.hp)
    setPlayerBoosts({})
    
    setCanCatch(true)
    setCatchAttempts(0)
    setTrainerName('')
    
    setBattlePhase(BATTLE_PHASES.INTRO)
    addLog(`Ein wildes ${wildPokemon.name} (Lv.${wildLevel}) erscheint!`, 'encounter')
    
    await delay(1500)
    
    // Wer ist schneller?
    if (pStats.speed >= wildStats.speed) {
      setBattlePhase(BATTLE_PHASES.PLAYER_TURN)
      addLog('Du bist am Zug!', 'system')
    } else {
      setBattlePhase(BATTLE_PHASES.ENEMY_TURN)
      addLog(`${wildPokemon.name} greift zuerst an!`, 'system')
      await executeEnemyTurn(wildPokemon, wildStats, pStats)
    }
  }, [gameState?.activePokemon, gameActions, addLog, clearLog])
  
  const startTrainerBattle = useCallback(async () => {
    if (!gameState?.activePokemon) return
    
    setBattleType(BATTLE_TYPES.TRAINER)
    setBattlePhase(BATTLE_PHASES.SEARCHING)
    clearLog()
    addLog('Suche Trainer...', 'system')
    
    await delay(1500)
    
    const trainer = generateTrainerName()
    setTrainerName(trainer)
    addLog(`${trainer} fordert dich heraus!`, 'encounter')
    
    await delay(1000)
    
    // Zufälliges Pokemon für Trainer
    const randomId = WILD_POKEMON_IDS[Math.floor(Math.random() * WILD_POKEMON_IDS.length)]
    const trainerPokemon = await fetchPokemonData(randomId)
    
    if (!trainerPokemon) {
      addLog('Fehler beim Laden!', 'error')
      setBattlePhase(BATTLE_PHASES.IDLE)
      return
    }
    
    gameActions.markSeen(randomId)
    
    const playerLevel = gameState.activePokemon.level
    const oppLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 5) - 2)
    const oppStats = calculateEffectiveStats(trainerPokemon.stats, oppLevel, [], false)
    const pStats = calculateEffectiveStats(null, playerLevel, gameState.activePokemon.moves, gameState.activePokemon.isShiny)
    
    setEnemyPokemon(trainerPokemon)
    setEnemyLevel(oppLevel)
    setEnemyStats(oppStats)
    setEnemyHP(oppStats.hp)
    setEnemyMaxHP(oppStats.hp)
    
    setPlayerPokemon(gameState.activePokemon)
    setPlayerStats(pStats)
    setPlayerHP(pStats.hp)
    setPlayerMaxHP(pStats.hp)
    setPlayerBoosts({})
    
    setCanCatch(false) // Trainer-Pokemon kann man nicht fangen
    
    addLog(`${trainer} schickt ${trainerPokemon.name} (Lv.${oppLevel})!`, 'encounter')
    
    setBattlePhase(BATTLE_PHASES.INTRO)
    await delay(1500)
    
    if (pStats.speed >= oppStats.speed) {
      setBattlePhase(BATTLE_PHASES.PLAYER_TURN)
      addLog('Du bist am Zug!', 'system')
    } else {
      setBattlePhase(BATTLE_PHASES.ENEMY_TURN)
      await executeEnemyTurn(trainerPokemon, oppStats, pStats)
    }
  }, [gameState?.activePokemon, gameActions, addLog, clearLog])
  
  const startArenaBattle = useCallback(async (arena) => {
    if (!gameState?.activePokemon) return
    if (gameState.activePokemon.level < arena.requiredLevel) {
      addLog(`Du brauchst Level ${arena.requiredLevel} für diese Arena!`, 'error')
      return
    }
    
    setBattleType(BATTLE_TYPES.ARENA)
    setBattlePhase(BATTLE_PHASES.SEARCHING)
    clearLog()
    setCurrentArena(arena)
    setArenaIndex(0)
    addLog(`Betrete ${arena.company} Arena...`, 'system')
    
    await delay(1500)
    
    addLog(`${arena.leader} fordert dich heraus!`, 'encounter')
    setTrainerName(arena.leader)
    
    // Lade alle 3 Arena-Pokemon
    const team = []
    for (const pokemonId of arena.pokemon) {
      const pokemon = await fetchPokemonData(pokemonId)
      if (pokemon) {
        team.push(pokemon)
        gameActions.markSeen(pokemonId)
      }
    }
    setArenaTeam(team)
    
    if (team.length === 0) {
      addLog('Fehler beim Laden der Arena!', 'error')
      setBattlePhase(BATTLE_PHASES.IDLE)
      return
    }
    
    // Arena-Level ist Spieler-Level + 2
    const arenaLevel = gameState.activePokemon.level + 2
    const firstPokemon = team[0]
    const oppStats = calculateEffectiveStats(firstPokemon.stats, arenaLevel, [], false)
    const pStats = calculateEffectiveStats(null, gameState.activePokemon.level, gameState.activePokemon.moves, gameState.activePokemon.isShiny)
    
    setEnemyPokemon(firstPokemon)
    setEnemyLevel(arenaLevel)
    setEnemyStats(oppStats)
    setEnemyHP(oppStats.hp)
    setEnemyMaxHP(oppStats.hp)
    
    setPlayerPokemon(gameState.activePokemon)
    setPlayerStats(pStats)
    setPlayerHP(pStats.hp)
    setPlayerMaxHP(pStats.hp)
    setPlayerBoosts({})
    
    setCanCatch(false)
    
    addLog(`${arena.leader} schickt ${firstPokemon.name} (Lv.${arenaLevel})! [1/3]`, 'encounter')
    
    setBattlePhase(BATTLE_PHASES.INTRO)
    await delay(1500)
    
    if (pStats.speed >= oppStats.speed) {
      setBattlePhase(BATTLE_PHASES.PLAYER_TURN)
      addLog('Du bist am Zug!', 'system')
    } else {
      setBattlePhase(BATTLE_PHASES.ENEMY_TURN)
      await executeEnemyTurn(firstPokemon, oppStats, pStats)
    }
  }, [gameState?.activePokemon, gameActions, addLog, clearLog])
  
  // === PLAYER ACTIONS ===
  
  const executeMove = useCallback(async (move) => {
    if (battlePhase !== BATTLE_PHASES.PLAYER_TURN) return
    
    setBattlePhase(BATTLE_PHASES.ANIMATION)
    
    // Berechne Schaden mit Typ-Effektivität
    const result = calculateDamage(
      { ...playerStats, types: playerPokemon?.types || [] },
      { ...enemyStats, types: enemyPokemon?.types || [] },
      move,
      playerPokemon?.level || 1,
      enemyLevel
    )
    
    if (result.missed) {
      addLog(`${playerPokemon?.nickname || 'Dein Pokémon'} setzt ${move.name} ein... Aber es verfehlt!`, 'miss')
    } else {
      const effectiveness = getEffectivenessText(result.typeMultiplier)
      addLog(`${playerPokemon?.nickname || 'Dein Pokémon'} setzt ${move.name} ein!`, 'attack')
      
      if (effectiveness.text) {
        addLog(effectiveness.text, effectiveness.color.includes('green') ? 'effective' : 'weak')
      }
      if (result.critical) {
        addLog('Kritischer Treffer!', 'critical')
      }
      
      addLog(`${enemyPokemon.name} erleidet ${result.damage} Schaden!`, 'damage')
      
      const newHP = Math.max(0, enemyHP - result.damage)
      setEnemyHP(newHP)
      
      await delay(800)
      
      // Check ob Gegner besiegt
      if (newHP <= 0) {
        await handleEnemyDefeated()
        return
      }
    }
    
    await delay(500)
    
    // Gegner ist dran
    setBattlePhase(BATTLE_PHASES.ENEMY_TURN)
    await executeEnemyTurn(enemyPokemon, enemyStats, playerStats)
  }, [battlePhase, playerPokemon, playerStats, enemyPokemon, enemyStats, enemyHP, enemyLevel, addLog])
  
  const useItemInBattle = useCallback(async (itemId) => {
    if (battlePhase !== BATTLE_PHASES.PLAYER_TURN) return
    
    const item = ITEMS[itemId]
    if (!item || !gameState?.inventory?.[itemId]) {
      addLog('Item nicht verfügbar!', 'error')
      return
    }
    
    setBattlePhase(BATTLE_PHASES.ANIMATION)
    
    if (item.effect === 'heal') {
      const healAmount = item.value
      const newHP = Math.min(playerMaxHP, playerHP + healAmount)
      setPlayerHP(newHP)
      gameActions.useItem(itemId)
      addLog(`Du benutzt ${item.name}! +${healAmount} HP`, 'heal')
    } else if (item.effect === 'boost') {
      setPlayerBoosts(prev => ({
        ...prev,
        [item.stat]: (prev[item.stat] || 1) * item.value
      }))
      gameActions.useItem(itemId)
      addLog(`Du benutzt ${item.name}! ${item.stat} steigt!`, 'boost')
    } else if (item.effect === 'catch') {
      await attemptCatch(item)
      return // Catch hat eigene Logik
    }
    
    await delay(800)
    
    // Gegner ist dran
    setBattlePhase(BATTLE_PHASES.ENEMY_TURN)
    await executeEnemyTurn(enemyPokemon, enemyStats, playerStats)
  }, [battlePhase, gameState?.inventory, playerHP, playerMaxHP, gameActions, enemyPokemon, enemyStats, playerStats, addLog])
  
  const attemptCatch = useCallback(async (ball) => {
    if (!canCatch || !enemyPokemon) {
      addLog('Du kannst dieses Pokémon nicht fangen!', 'error')
      return
    }
    
    setBattlePhase(BATTLE_PHASES.CATCH_ATTEMPT)
    setCatchAttempts(prev => prev + 1)
    gameActions.useItem(ball.id)
    
    addLog(`Du wirfst einen ${ball.name}...`, 'catch')
    await delay(1000)
    
    const catchRate = calculateCatchRate(enemyPokemon, enemyHP, enemyMaxHP, ball.value)
    const roll = Math.random()
    
    // Shake Animation (1-3 Shakes)
    const shakes = roll < catchRate ? 3 : Math.floor(roll / catchRate * 3)
    
    for (let i = 0; i < shakes; i++) {
      addLog('...wackelt...', 'catch')
      await delay(600)
    }
    
    if (roll < catchRate) {
      // Gefangen!
      addLog(`Gotcha! ${enemyPokemon.name} wurde gefangen!`, 'success')
      
      const isShiny = Math.random() < 0.05 // 5% Shiny Chance beim Fangen
      await gameActions.catchPokemon(enemyPokemon, isShiny)
      
      const xpGain = XP_REWARDS.CATCH_POKEMON
      gameActions.addXP(xpGain)
      addLog(`+${xpGain} XP erhalten!`, 'xp')
      
      await delay(1000)
      endBattle(true)
    } else {
      addLog(`${enemyPokemon.name} ist entkommen!`, 'fail')
      
      await delay(500)
      
      // Gegner greift an nach fehlgeschlagenem Fangversuch
      setBattlePhase(BATTLE_PHASES.ENEMY_TURN)
      await executeEnemyTurn(enemyPokemon, enemyStats, playerStats)
    }
  }, [canCatch, enemyPokemon, enemyHP, enemyMaxHP, gameActions, enemyStats, playerStats, addLog])
  
  const attemptFlee = useCallback(async () => {
    if (battleType !== BATTLE_TYPES.WILD) {
      addLog('Du kannst nicht fliehen!', 'error')
      return
    }
    
    setBattlePhase(BATTLE_PHASES.ANIMATION)
    
    // Fluchtchance basierend auf Speed
    const fleeChance = (playerStats?.speed || 50) / ((enemyStats?.speed || 50) + (playerStats?.speed || 50))
    
    if (Math.random() < fleeChance + 0.3) { // +30% Bonus
      addLog('Du bist erfolgreich geflohen!', 'system')
      await delay(800)
      endBattle(false)
    } else {
      addLog('Flucht fehlgeschlagen!', 'fail')
      await delay(500)
      setBattlePhase(BATTLE_PHASES.ENEMY_TURN)
      await executeEnemyTurn(enemyPokemon, enemyStats, playerStats)
    }
  }, [battleType, playerStats, enemyStats, enemyPokemon, addLog])
  
  // === ENEMY TURN ===
  
  const executeEnemyTurn = useCallback(async (pokemon, eStats, pStats) => {
    await delay(800)
    
    // Zufälliger Angriff basierend auf Stats
    const isPhysical = eStats.attack > eStats.spAttack
    const basePower = 40 + Math.floor(Math.random() * 40) // 40-80 Power
    
    const fakeMove = {
      name: 'Attacke',
      power: basePower,
      type: pokemon.types?.[0] || 'normal',
      damageClass: isPhysical ? 'physical' : 'special',
      accuracy: 95,
    }
    
    const result = calculateDamage(
      { ...eStats, types: pokemon.types || [] },
      { ...pStats, types: playerPokemon?.types || [] },
      fakeMove,
      enemyLevel,
      playerPokemon?.level || 1
    )
    
    if (result.missed) {
      addLog(`${pokemon.name} greift an... Aber es verfehlt!`, 'miss')
    } else {
      addLog(`${pokemon.name} greift an!`, 'attack')
      
      if (result.critical) {
        addLog('Kritischer Treffer!', 'critical')
      }
      
      addLog(`Du erleidest ${result.damage} Schaden!`, 'damage')
      
      const newHP = Math.max(0, playerHP - result.damage)
      setPlayerHP(newHP)
      
      if (newHP <= 0) {
        await handlePlayerDefeated()
        return
      }
    }
    
    await delay(500)
    setBattlePhase(BATTLE_PHASES.PLAYER_TURN)
    addLog('Du bist am Zug!', 'system')
  }, [playerHP, playerPokemon, enemyLevel, addLog])
  
  // === BATTLE END ===
  
  const handleEnemyDefeated = useCallback(async () => {
    addLog(`${enemyPokemon.name} wurde besiegt!`, 'victory')
    
    if (battleType === BATTLE_TYPES.ARENA && arenaIndex < arenaTeam.length - 1) {
      // Nächstes Arena-Pokemon
      await delay(1000)
      const nextIndex = arenaIndex + 1
      setArenaIndex(nextIndex)
      
      const nextPokemon = arenaTeam[nextIndex]
      const arenaLevel = (playerPokemon?.level || 1) + 2
      const nextStats = calculateEffectiveStats(nextPokemon.stats, arenaLevel, [], false)
      
      setEnemyPokemon(nextPokemon)
      setEnemyStats(nextStats)
      setEnemyHP(nextStats.hp)
      setEnemyMaxHP(nextStats.hp)
      
      addLog(`${trainerName} schickt ${nextPokemon.name}! [${nextIndex + 1}/3]`, 'encounter')
      
      await delay(1000)
      setBattlePhase(BATTLE_PHASES.PLAYER_TURN)
      addLog('Du bist am Zug!', 'system')
    } else {
      // Kampf gewonnen!
      let xpGain = XP_REWARDS.BATTLE_WIN_BASE + Math.floor(enemyLevel * XP_REWARDS.BATTLE_WIN_LEVEL_MULT)
      
      if (battleType === BATTLE_TYPES.ARENA) {
        xpGain = XP_REWARDS.ARENA_WIN_BASE + (currentArena.id * XP_REWARDS.ARENA_WIN_MULT)
        addLog(`${currentArena.badge} ${currentArena.company}-Orden erhalten!`, 'badge')
        gameActions.defeatArena(currentArena.id, xpGain)
      } else {
        gameActions.recordBattle(true, xpGain)
      }
      
      addLog(`+${xpGain} XP erhalten!`, 'xp')
      
      if (battleType === BATTLE_TYPES.TRAINER) {
        const coins = 10 + enemyLevel * 2
        gameActions.addCoins(coins)
        addLog(`+${coins} Münzen erhalten!`, 'coins')
      }
      
      await delay(1000)
      endBattle(true)
    }
  }, [enemyPokemon, battleType, arenaIndex, arenaTeam, playerPokemon, trainerName, currentArena, enemyLevel, gameActions, addLog])
  
  const handlePlayerDefeated = useCallback(async () => {
    addLog('Dein Pokémon wurde besiegt...', 'defeat')
    gameActions.recordBattle(false)
    
    await delay(1000)
    endBattle(false)
  }, [gameActions, addLog])
  
  const endBattle = useCallback((won) => {
    setBattlePhase(BATTLE_PHASES.RESULT)
    
    setTimeout(() => {
      setBattlePhase(BATTLE_PHASES.IDLE)
      setBattleType(null)
      setPlayerPokemon(null)
      setEnemyPokemon(null)
      setCurrentArena(null)
      setArenaTeam([])
      clearLog()
    }, 2000)
  }, [clearLog])
  
  const closeBattle = useCallback(() => {
    setBattlePhase(BATTLE_PHASES.IDLE)
    setBattleType(null)
    setPlayerPokemon(null)
    setEnemyPokemon(null)
    setCurrentArena(null)
    setArenaTeam([])
    clearLog()
  }, [clearLog])
  
  return {
    // State
    battlePhase,
    battleType,
    battleLog,
    isInBattle: battlePhase !== BATTLE_PHASES.IDLE,
    isPlayerTurn: battlePhase === BATTLE_PHASES.PLAYER_TURN,
    
    // Player
    playerPokemon,
    playerHP,
    playerMaxHP,
    playerStats,
    playerBoosts,
    
    // Enemy
    enemyPokemon,
    enemyHP,
    enemyMaxHP,
    enemyLevel,
    enemyStats,
    
    // Arena/Trainer
    trainerName,
    currentArena,
    arenaIndex,
    arenaTeam,
    canCatch,
    
    // Actions
    startWildBattle,
    startTrainerBattle,
    startArenaBattle,
    executeMove,
    useItemInBattle,
    attemptCatch,
    attemptFlee,
    closeBattle,
    
    // Constants
    BATTLE_PHASES,
    BATTLE_TYPES,
  }
}
