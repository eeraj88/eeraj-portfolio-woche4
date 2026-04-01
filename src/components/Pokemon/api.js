// ============================================
// POKEMON API SERVICE MIT CACHING
// ============================================

// In-Memory Cache für API Responses
const pokemonCache = new Map()
const moveCache = new Map()
const speciesCache = new Map()

// Cache TTL: 1 Stunde
const CACHE_TTL = 60 * 60 * 1000

/**
 * Generische Fetch-Funktion mit Cache
 */
const fetchWithCache = async (url, cache) => {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  
  const data = await response.json()
  cache.set(url, { data, timestamp: Date.now() })
  return data
}

/**
 * Pokemon-Daten laden (mit Stats, Moves, Sprites)
 */
export const fetchPokemonData = async (pokemonId) => {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    const pokemon = await fetchWithCache(url, pokemonCache)
    
    // Species für deutschen Namen
    const species = await fetchWithCache(pokemon.species.url, speciesCache)
    const germanName = species.names.find(n => n.language.name === 'de')?.name || pokemon.name
    
    // Base Stats extrahieren
    const stats = {
      hp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 50,
      attack: pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 50,
      defense: pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 50,
      spAttack: pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 50,
      spDefense: pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 50,
      speed: pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 50,
    }
    stats.total = stats.hp + stats.attack + stats.defense + stats.spAttack + stats.spDefense + stats.speed
    
    // Level-Up Moves extrahieren (sortiert nach Level)
    const levelUpMoves = pokemon.moves
      .filter(m => m.version_group_details.some(v => v.move_learn_method.name === 'level-up'))
      .map(m => {
        const levelDetail = m.version_group_details.find(v => v.move_learn_method.name === 'level-up')
        return {
          name: m.move.name,
          url: m.move.url,
          level: levelDetail?.level_learned_at || 1
        }
      })
      .sort((a, b) => a.level - b.level)
    
    // Catch Rate aus Species
    const catchRate = species.capture_rate || 45
    
    return {
      id: pokemon.id,
      name: germanName,
      englishName: pokemon.name,
      sprite: pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default 
        || pokemon.sprites.front_default,
      spriteStatic: pokemon.sprites.front_default,
      spriteBack: pokemon.sprites.back_default,
      shinySprite: pokemon.sprites.front_shiny,
      shinyBack: pokemon.sprites.back_shiny,
      types: pokemon.types.map(t => t.type.name),
      stats,
      levelUpMoves,
      catchRate,
      height: pokemon.height,
      weight: pokemon.weight,
    }
  } catch (error) {
    console.error('Pokemon fetch error:', error)
    throw error // Re-throw für Error-Handling in UI
  }
}

/**
 * Move-Details laden (deutsche Namen, Power, Typ)
 */
export const fetchMoveDetails = async (moveUrl) => {
  try {
    const move = await fetchWithCache(moveUrl, moveCache)
    const germanName = move.names.find(n => n.language.name === 'de')?.name || move.name
    
    // Stat-Boosts parsen
    const statBoost = {}
    if (move.stat_changes && move.stat_changes.length > 0) {
      move.stat_changes.forEach(sc => {
        statBoost[sc.stat.name] = sc.change
      })
    }
    
    return {
      id: move.id,
      name: germanName,
      englishName: move.name,
      power: move.power || 0,
      accuracy: move.accuracy || 100,
      type: move.type.name,
      damageClass: move.damage_class.name, // physical, special, status
      pp: move.pp,
      priority: move.priority || 0,
      statBoost,
      effectChance: move.effect_chance,
      description: move.flavor_text_entries.find(f => f.language.name === 'de')?.flavor_text 
        || move.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text 
        || '',
    }
  } catch (error) {
    console.error('Move fetch error:', error)
    throw error
  }
}

/**
 * Mehrere Pokemon parallel laden (für Starter etc.)
 */
export const fetchMultiplePokemon = async (ids) => {
  const promises = ids.map(id => fetchPokemonData(id).catch(() => null))
  const results = await Promise.all(promises)
  return results.filter(Boolean)
}

/**
 * Initiale Moves für ein Pokemon laden
 */
export const loadInitialMoves = async (pokemonInfo, level = 1) => {
  if (!pokemonInfo?.levelUpMoves) return []
  
  // Alle Moves die bis zum aktuellen Level gelernt werden können
  const learnableMoves = pokemonInfo.levelUpMoves.filter(m => m.level <= level)
  
  // Duplikate entfernen (nach URL)
  const uniqueMoves = learnableMoves.filter((move, index, self) => 
    index === self.findIndex(m => m.url === move.url)
  )
  
  // Die letzten 4 Moves laden (oder alle wenn weniger)
  const movesToLoad = uniqueMoves.slice(-4)
  const promises = movesToLoad.map(m => fetchMoveDetails(m.url).catch(() => null))
  const moves = await Promise.all(promises)
  
  // Nochmal Duplikate nach ID filtern
  const uniqueResults = moves.filter(Boolean).filter((move, index, self) =>
    index === self.findIndex(m => m.id === move.id)
  )
  
  return uniqueResults
}

/**
 * Cache leeren (für Debug/Reset)
 */
export const clearCache = () => {
  pokemonCache.clear()
  moveCache.clear()
  speciesCache.clear()
}

/**
 * Cache-Statistiken (für Debug)
 */
export const getCacheStats = () => ({
  pokemon: pokemonCache.size,
  moves: moveCache.size,
  species: speciesCache.size,
})
