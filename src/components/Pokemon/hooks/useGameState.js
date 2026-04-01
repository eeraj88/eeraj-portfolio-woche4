// ============================================
// POKEMON GAME STATE HOOK (useReducer)
// ============================================

import { useReducer, useEffect, useCallback } from 'react'
import { xpForNextLevel, SHINY_CHANCE, MAX_TEAM_SIZE, ITEMS, DAILY_QUESTS, IV_RANGE, NATURES, PERSONALITIES, RARE_EVENTS } from '../constants'
import { fetchPokemonData, loadInitialMoves } from '../api'
import { checkEvolutionPossible, generateUniqueId, generateIVs, getRandomNature, getRandomPersonality } from '../utils'

// Initial State
const getInitialState = () => {
  try {
    const stored = localStorage.getItem('pokemonGame')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Migration: alte Daten unterstützen
      if (parsed.pokemonId && !parsed.team) {
        // Altes Format -> neues Format migrieren
        return {
          ...getDefaultState(),
          team: [{
            uniqueId: generateUniqueId(),
            pokemonId: parsed.pokemonId,
            baseId: parsed.baseId,
            level: parsed.level || 1,
            xp: parsed.xp || 0,
            isShiny: parsed.isShiny || false,
            moves: parsed.moves || [],
            currentHP: 100,
            maxHP: 100,
            nickname: null,
          }],
          activeIndex: 0,
          totalVisits: parsed.totalVisits || 1,
          lastVisit: parsed.lastVisit || Date.now(),
          createdAt: parsed.createdAt || Date.now(),
          wins: parsed.wins || 0,
          losses: parsed.losses || 0,
          defeatedArenas: parsed.defeatedArenas || [],
        }
      }
      return { ...getDefaultState(), ...parsed }
    }
  } catch (e) {
    console.error('Error loading game state:', e)
  }
  return null
}

const getDefaultState = () => ({
  // Team (max 6 Pokemon)
  team: [],
  activeIndex: 0, // Welches Pokemon ist aktiv
  
  // Pokedex: { [id]: { seen: boolean, caught: boolean, shiny: boolean } }
  pokedex: {},
  
  // Inventar
  inventory: {
    pokeball: 5,
    potion: 3,
    coins: 100,
  },
  
  // Statistiken
  totalVisits: 1,
  lastVisit: Date.now(),
  createdAt: Date.now(),
  wins: 0,
  losses: 0,
  catches: 0,
  
  // Arena-Fortschritt
  defeatedArenas: [],
  
  // Tägliche Quests
  dailyQuests: [],
  lastQuestReset: null,
  questProgress: {},
  
  // UI-State
  error: null,
  isLoading: false,
})

// Action Types
const ACTIONS = {
  // Team & Pokemon
  ADD_POKEMON: 'ADD_POKEMON',
  REMOVE_POKEMON: 'REMOVE_POKEMON',
  SET_ACTIVE: 'SET_ACTIVE',
  UPDATE_POKEMON: 'UPDATE_POKEMON',
  EVOLVE_POKEMON: 'EVOLVE_POKEMON',
  HEAL_POKEMON: 'HEAL_POKEMON',
  LEARN_MOVE: 'LEARN_MOVE',
  
  // XP & Level
  ADD_XP: 'ADD_XP',
  LEVEL_UP: 'LEVEL_UP',
  
  // Inventar
  ADD_ITEM: 'ADD_ITEM',
  USE_ITEM: 'USE_ITEM',
  ADD_COINS: 'ADD_COINS',
  SPEND_COINS: 'SPEND_COINS',
  
  // Pokedex
  MARK_SEEN: 'MARK_SEEN',
  MARK_CAUGHT: 'MARK_CAUGHT',
  
  // Statistiken
  RECORD_WIN: 'RECORD_WIN',
  RECORD_LOSS: 'RECORD_LOSS',
  RECORD_CATCH: 'RECORD_CATCH',
  DEFEAT_ARENA: 'DEFEAT_ARENA',
  UPDATE_VISIT: 'UPDATE_VISIT',
  
  // Quests
  UPDATE_QUEST_PROGRESS: 'UPDATE_QUEST_PROGRESS',
  COMPLETE_QUEST: 'COMPLETE_QUEST',
  RESET_DAILY_QUESTS: 'RESET_DAILY_QUESTS',
  
  // System
  SET_ERROR: 'SET_ERROR',
  SET_LOADING: 'SET_LOADING',
  RESET_GAME: 'RESET_GAME',
  LOAD_STATE: 'LOAD_STATE',
}

// Reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    // ============ TEAM & POKEMON ============
    case ACTIONS.ADD_POKEMON: {
      if (state.team.length >= MAX_TEAM_SIZE) return state
      return {
        ...state,
        team: [...state.team, action.payload],
        pokedex: {
          ...state.pokedex,
          [action.payload.pokemonId]: {
            ...state.pokedex[action.payload.pokemonId],
            seen: true,
            caught: true,
            shiny: action.payload.isShiny || state.pokedex[action.payload.pokemonId]?.shiny,
          }
        }
      }
    }
    
    case ACTIONS.REMOVE_POKEMON: {
      const newTeam = state.team.filter((_, i) => i !== action.payload)
      return {
        ...state,
        team: newTeam,
        activeIndex: Math.min(state.activeIndex, newTeam.length - 1),
      }
    }
    
    case ACTIONS.SET_ACTIVE:
      return { ...state, activeIndex: action.payload }
    
    case ACTIONS.UPDATE_POKEMON: {
      const { index, updates } = action.payload
      const newTeam = [...state.team]
      newTeam[index] = { ...newTeam[index], ...updates }
      return { ...state, team: newTeam }
    }
    
    case ACTIONS.EVOLVE_POKEMON: {
      const { index, newPokemonId } = action.payload
      const newTeam = [...state.team]
      newTeam[index] = { ...newTeam[index], pokemonId: newPokemonId }
      return {
        ...state,
        team: newTeam,
        pokedex: {
          ...state.pokedex,
          [newPokemonId]: { seen: true, caught: true, shiny: newTeam[index].isShiny }
        }
      }
    }
    
    case ACTIONS.HEAL_POKEMON: {
      const { index, amount } = action.payload
      const newTeam = [...state.team]
      const pokemon = newTeam[index]
      newTeam[index] = {
        ...pokemon,
        currentHP: Math.min(pokemon.maxHP, pokemon.currentHP + amount)
      }
      return { ...state, team: newTeam }
    }
    
    case ACTIONS.LEARN_MOVE: {
      const { index, move, replaceIndex } = action.payload
      const newTeam = [...state.team]
      const pokemon = newTeam[index]
      let newMoves = [...(pokemon.moves || [])]
      
      if (replaceIndex === -1) {
        // Nicht lernen
        return state
      } else if (replaceIndex !== undefined) {
        // Ersetzen
        newMoves[replaceIndex] = move
      } else if (newMoves.length < 4) {
        // Hinzufügen
        newMoves.push(move)
      }
      
      newTeam[index] = { ...pokemon, moves: newMoves }
      return { ...state, team: newTeam }
    }
    
    // ============ XP & LEVEL ============
    case ACTIONS.ADD_XP: {
      const { index, amount } = action.payload
      const newTeam = [...state.team]
      const pokemon = newTeam[index]
      const newXP = pokemon.xp + amount
      const xpNeeded = xpForNextLevel(pokemon.level)
      
      if (newXP >= xpNeeded) {
        // Level Up!
        newTeam[index] = {
          ...pokemon,
          xp: newXP - xpNeeded,
          level: pokemon.level + 1,
        }
      } else {
        newTeam[index] = { ...pokemon, xp: newXP }
      }
      
      return { ...state, team: newTeam }
    }
    
    // ============ INVENTAR ============
    case ACTIONS.ADD_ITEM: {
      const { itemId, amount } = action.payload
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [itemId]: (state.inventory[itemId] || 0) + amount
        }
      }
    }
    
    case ACTIONS.USE_ITEM: {
      const { itemId } = action.payload
      if (!state.inventory[itemId] || state.inventory[itemId] <= 0) return state
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [itemId]: state.inventory[itemId] - 1
        }
      }
    }
    
    case ACTIONS.ADD_COINS:
      return { ...state, inventory: { ...state.inventory, coins: state.inventory.coins + action.payload } }
    
    case ACTIONS.SPEND_COINS: {
      if (state.inventory.coins < action.payload) return state
      return { ...state, inventory: { ...state.inventory, coins: state.inventory.coins - action.payload } }
    }
    
    // ============ POKEDEX ============
    case ACTIONS.MARK_SEEN:
      return {
        ...state,
        pokedex: {
          ...state.pokedex,
          [action.payload]: { ...state.pokedex[action.payload], seen: true }
        }
      }
    
    case ACTIONS.MARK_CAUGHT:
      return {
        ...state,
        pokedex: {
          ...state.pokedex,
          [action.payload.id]: {
            ...state.pokedex[action.payload.id],
            seen: true,
            caught: true,
            shiny: action.payload.shiny || state.pokedex[action.payload.id]?.shiny
          }
        }
      }
    
    // ============ STATISTIKEN ============
    case ACTIONS.RECORD_WIN:
      return { ...state, wins: state.wins + 1 }
    
    case ACTIONS.RECORD_LOSS:
      return { ...state, losses: state.losses + 1 }
    
    case ACTIONS.RECORD_CATCH:
      return { ...state, catches: state.catches + 1 }
    
    case ACTIONS.DEFEAT_ARENA:
      return {
        ...state,
        defeatedArenas: [...state.defeatedArenas, action.payload]
      }
    
    case ACTIONS.UPDATE_VISIT:
      return {
        ...state,
        totalVisits: state.totalVisits + 1,
        lastVisit: Date.now()
      }
    
    // ============ QUESTS ============
    case ACTIONS.UPDATE_QUEST_PROGRESS: {
      const { questType, amount } = action.payload
      return {
        ...state,
        questProgress: {
          ...state.questProgress,
          [questType]: (state.questProgress[questType] || 0) + amount
        }
      }
    }
    
    case ACTIONS.RESET_DAILY_QUESTS: {
      // 3 zufällige Quests auswählen
      const shuffled = [...DAILY_QUESTS].sort(() => Math.random() - 0.5)
      return {
        ...state,
        dailyQuests: shuffled.slice(0, 3),
        lastQuestReset: Date.now(),
        questProgress: {}
      }
    }
    
    // ============ SYSTEM ============
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload }
    
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case ACTIONS.RESET_GAME:
      localStorage.removeItem('pokemonGame')
      localStorage.removeItem('pokemonBuddy') // Alte Daten auch löschen
      return null
    
    case ACTIONS.LOAD_STATE:
      return action.payload
    
    default:
      return state
  }
}

// Custom Hook
export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, null, getInitialState)
  
  // Auto-Save bei State-Änderungen
  useEffect(() => {
    if (state) {
      localStorage.setItem('pokemonGame', JSON.stringify(state))
    }
  }, [state])
  
  // Tägliche Quest-Reset Prüfung
  useEffect(() => {
    if (!state) return
    
    const now = new Date()
    const lastReset = state.lastQuestReset ? new Date(state.lastQuestReset) : null
    
    // Reset wenn neuer Tag oder noch nie zurückgesetzt
    if (!lastReset || now.toDateString() !== lastReset.toDateString()) {
      dispatch({ type: ACTIONS.RESET_DAILY_QUESTS })
    }
  }, [state?.lastQuestReset])
  
  // === ACTION CREATORS ===
  
  const selectStarter = useCallback(async (starterInfo) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true })
    
    try {
      const isShiny = Math.random() < SHINY_CHANCE
      const initialMoves = await loadInitialMoves(starterInfo, 1)
      
      // Generate individual stats for this Pokemon
      const ivs = generateIVs()
      const nature = getRandomNature()
      const personality = getRandomPersonality()
      
      const newPokemon = {
        uniqueId: generateUniqueId(),
        pokemonId: starterInfo.id,
        baseId: starterInfo.id,
        level: 1,
        xp: 0,
        isShiny,
        moves: initialMoves,
        currentHP: 100,
        maxHP: 100,
        nickname: null,
        // NEW: Individual stats
        ivs,           // { hp, attack, defense, spAttack, spDefense, speed }
        nature,        // { name, up, down, emoji }
        personality,   // { name, trait, bonusStat, bonus }
        friendship: 70, // Base friendship (affects some mechanics)
      }
      
      dispatch({ type: ACTIONS.ADD_POKEMON, payload: newPokemon })
      dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      
      return { isShiny, pokemon: newPokemon, ivs, nature, personality }
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Fehler beim Laden des Starters' })
      dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      throw error
    }
  }, [])
  
  const addXP = useCallback((amount, index = null) => {
    const targetIndex = index ?? state?.activeIndex ?? 0
    if (!state?.team?.[targetIndex]) return
    
    dispatch({ type: ACTIONS.ADD_XP, payload: { index: targetIndex, amount } })
    dispatch({ type: ACTIONS.UPDATE_QUEST_PROGRESS, payload: { questType: 'xp', amount } })
  }, [state?.activeIndex, state?.team])
  
  const catchPokemon = useCallback(async (pokemonInfo, isShiny = false) => {
    if (!state || state.team.length >= MAX_TEAM_SIZE) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Team ist voll!' })
      return false
    }
    
    try {
      const initialMoves = await loadInitialMoves(pokemonInfo, 5)
      
      // Generate individual stats for caught Pokemon
      const ivs = generateIVs()
      const nature = getRandomNature()
      const personality = getRandomPersonality()
      
      const newPokemon = {
        uniqueId: generateUniqueId(),
        pokemonId: pokemonInfo.id,
        baseId: pokemonInfo.id,
        level: Math.max(1, Math.floor(Math.random() * 10) + 1),
        xp: 0,
        isShiny,
        moves: initialMoves,
        currentHP: 100,
        maxHP: 100,
        nickname: null,
        // Individual stats
        ivs,
        nature,
        personality,
        friendship: 70,
      }
      
      dispatch({ type: ACTIONS.ADD_POKEMON, payload: newPokemon })
      dispatch({ type: ACTIONS.RECORD_CATCH })
      dispatch({ type: ACTIONS.UPDATE_QUEST_PROGRESS, payload: { questType: 'catch', amount: 1 } })
      
      return true
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Fehler beim Fangen' })
      return false
    }
  }, [state])
  
  const useItem = useCallback((itemId, targetIndex = null) => {
    const item = ITEMS[itemId]
    if (!item || !state?.inventory?.[itemId]) return false
    
    const index = targetIndex ?? state.activeIndex
    
    if (item.effect === 'heal' && state.team[index]) {
      dispatch({ type: ACTIONS.USE_ITEM, payload: { itemId } })
      dispatch({ type: ACTIONS.HEAL_POKEMON, payload: { index, amount: item.value } })
      return true
    }
    
    return false
  }, [state])
  
  const evolvePokemon = useCallback((index, newPokemonId) => {
    dispatch({ type: ACTIONS.EVOLVE_POKEMON, payload: { index, newPokemonId } })
  }, [])
  
  const learnMove = useCallback((index, move, replaceIndex) => {
    dispatch({ type: ACTIONS.LEARN_MOVE, payload: { index, move, replaceIndex } })
  }, [])
  
  const recordBattle = useCallback((won, xpGain = 0) => {
    if (won) {
      dispatch({ type: ACTIONS.RECORD_WIN })
      if (xpGain > 0) addXP(xpGain)
      dispatch({ type: ACTIONS.UPDATE_QUEST_PROGRESS, payload: { questType: 'battle', amount: 1 } })
    } else {
      dispatch({ type: ACTIONS.RECORD_LOSS })
    }
  }, [addXP])
  
  const defeatArena = useCallback((arenaId, xpGain) => {
    dispatch({ type: ACTIONS.DEFEAT_ARENA, payload: arenaId })
    if (xpGain > 0) addXP(xpGain)
    dispatch({ type: ACTIONS.UPDATE_QUEST_PROGRESS, payload: { questType: 'arena', amount: 1 } })
  }, [addXP])
  
  const markSeen = useCallback((pokemonId) => {
    dispatch({ type: ACTIONS.MARK_SEEN, payload: pokemonId })
  }, [])
  
  const resetGame = useCallback(() => {
    if (confirm('Spiel wirklich zurücksetzen? Aller Fortschritt geht verloren!')) {
      dispatch({ type: ACTIONS.RESET_GAME })
    }
  }, [])
  
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null })
  }, [])
  
  const setActiveIndex = useCallback((index) => {
    dispatch({ type: ACTIONS.SET_ACTIVE, payload: index })
  }, [])
  
  const addCoins = useCallback((amount) => {
    dispatch({ type: ACTIONS.ADD_COINS, payload: amount })
  }, [])
  
  const spendCoins = useCallback((amount) => {
    if (state?.inventory?.coins >= amount) {
      dispatch({ type: ACTIONS.SPEND_COINS, payload: amount })
      return true
    }
    return false
  }, [state?.inventory?.coins])
  
  const addItem = useCallback((itemId, amount = 1) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: { itemId, amount } })
  }, [])
  
  const updateQuestProgress = useCallback((questType, amount = 1) => {
    dispatch({ type: ACTIONS.UPDATE_QUEST_PROGRESS, payload: { questType, amount } })
  }, [])
  
  const healTeam = useCallback(() => {
    state?.team?.forEach((_, index) => {
      dispatch({ type: ACTIONS.HEAL_POKEMON, payload: { index, amount: 100 } })
    })
  }, [state?.team])
  
  // Aktives Pokemon
  const activePokemon = state?.team?.[state?.activeIndex] || null
  
  return {
    state,
    activePokemon,
    hasStarted: state !== null && state?.team?.length > 0,
    
    // Actions
    selectStarter,
    addXP,
    catchPokemon,
    useItem,
    evolvePokemon,
    learnMove,
    recordBattle,
    defeatArena,
    markSeen,
    resetGame,
    clearError,
    setActiveIndex,
    addCoins,
    spendCoins,
    addItem,
    updateQuestProgress,
    healTeam,
    
    // Dispatch für erweiterte Aktionen
    dispatch,
    ACTIONS,
  }
}

export { ACTIONS }
