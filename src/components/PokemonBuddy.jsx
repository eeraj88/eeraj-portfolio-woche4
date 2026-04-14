import { useState, useEffect, useContext, useCallback } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

// Starter Pokemon mit ihren Evolutionsketten
const STARTER_POKEMON = [
  { id: 1, name: 'Bisasam' },
  { id: 4, name: 'Glumanda' },
  { id: 7, name: 'Schiggy' },
  { id: 25, name: 'Pikachu' },
  { id: 133, name: 'Evoli' },
  { id: 152, name: 'Endivie' },
  { id: 155, name: 'Feurigel' },
  { id: 158, name: 'Karnimani' },
  { id: 252, name: 'Geckarbor' },
  { id: 255, name: 'Flemmli' },
  { id: 258, name: 'Hydropi' },
]

// Alle möglichen Gegner-Pokemon (ID 1-151 Gen 1)
const WILD_POKEMON_IDS = [
  16, 19, 21, 23, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58,
  60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 95, 96, 98, 100,
  102, 104, 109, 111, 114, 116, 118, 120, 123, 127, 128, 129, 131, 133, 137, 147
]

// Trainer mit verschiedenen Titeln
const TRAINER_TITLES = [
  'Recruiter', 'HR Manager', 'Tech Lead', 'Senior Developer', 'CTO', 
  'Hiring Manager', 'Engineering Manager', 'Besucher', 'Frontend Lead',
  'Product Owner', 'Scrum Master', 'DevOps Engineer', 'UX Designer'
]

const TRAINER_FIRST_NAMES = [
  'Anna', 'Max', 'Sophie', 'Leon', 'Emma', 'Paul', 'Laura', 'Tim',
  'Julia', 'Felix', 'Sarah', 'David', 'Lisa', 'Jonas', 'Marie', 'Lukas',
  'Hannah', 'Finn', 'Lea', 'Noah', 'Mia', 'Ben', 'Lena', 'Tom',
  'Christina', 'Michael', 'Sandra', 'Stefan', 'Melanie', 'Andreas'
]

const TRAINER_LAST_NAMES = [
  'Müller', 'Schmidt', 'Weber', 'Fischer', 'Meyer', 'Wagner', 'Becker',
  'Hoffmann', 'Koch', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann',
  'Braun', 'Zimmermann', 'Krüger', 'Hartmann', 'Lange', 'Werner',
  'Schwarz', 'Hofmann', 'Krause', 'Lehmann', 'Köhler', 'Maier'
]

const generateTrainerName = () => {
  const title = TRAINER_TITLES[Math.floor(Math.random() * TRAINER_TITLES.length)]
  const firstName = TRAINER_FIRST_NAMES[Math.floor(Math.random() * TRAINER_FIRST_NAMES.length)]
  const lastName = TRAINER_LAST_NAMES[Math.floor(Math.random() * TRAINER_LAST_NAMES.length)]
  return `${title} ${firstName} ${lastName}`
}

// Evolution chains
const EVOLUTION_CHAINS = {
  1: [1, 2, 3],
  4: [4, 5, 6],
  7: [7, 8, 9],
  25: [25, 26],
  133: [133, 134, 135, 136, 196, 197, 470, 471, 700],
  152: [152, 153, 154],
  155: [155, 156, 157],
  158: [158, 159, 160],
  252: [252, 253, 254],
  255: [255, 256, 257],
  258: [258, 259, 260],
}

const EVOLUTION_LEVELS = { stage2: 16, stage3: 36 }

// 8 Tech-Arenen mit CEOs und ihren Pokemon-Teams
// requiredLevel = Mindestlevel um Arena zu betreten
const TECH_ARENAS = [
  { 
    id: 1, 
    company: 'Google', 
    leader: 'CEO Sundar Pichai', 
    color: 'from-blue-500 to-red-500',
    requiredLevel: 3,
    pokemon: [25, 81, 137] // Pikachu, Magnetilo, Porygon (Tech/Electric)
  },
  { 
    id: 2, 
    company: 'Apple', 
    leader: 'CEO Tim Cook', 
    color: 'from-gray-400 to-gray-600',
    requiredLevel: 7,
    pokemon: [82, 132, 233] // Magneton, Ditto, Porygon2
  },
  { 
    id: 3, 
    company: 'Microsoft', 
    leader: 'CEO Satya Nadella', 
    color: 'from-blue-600 to-green-500',
    requiredLevel: 12,
    pokemon: [137, 474, 462] // Porygon, Porygon-Z, Magnezone
  },
  { 
    id: 4, 
    company: 'Amazon', 
    leader: 'CEO Andy Jassy', 
    color: 'from-orange-500 to-yellow-500',
    requiredLevel: 18,
    pokemon: [52, 53, 143] // Mauzi, Snobilikat, Relaxo (Lieferung & Faulenzen)
  },
  { 
    id: 5, 
    company: 'Meta', 
    leader: 'CEO Mark Zuckerberg', 
    color: 'from-blue-600 to-blue-400',
    requiredLevel: 25,
    pokemon: [63, 64, 65] // Abra, Kadabra, Simsala (Mind Control lol)
  },
  { 
    id: 6, 
    company: 'Tesla', 
    leader: 'CEO Elon Musk', 
    color: 'from-red-600 to-gray-800',
    requiredLevel: 33,
    pokemon: [100, 101, 145] // Voltobal, Lektrobal, Zapdos (Electric)
  },
  { 
    id: 7, 
    company: 'Netflix', 
    leader: 'CEO Ted Sarandos', 
    color: 'from-red-600 to-black',
    requiredLevel: 42,
    pokemon: [92, 93, 94] // Nebulak, Alpollo, Gengar (Binge-Watching Geister)
  },
  { 
    id: 8, 
    company: 'OpenAI', 
    leader: 'CEO Sam Altman', 
    color: 'from-emerald-500 to-teal-600',
    requiredLevel: 50,
    pokemon: [150, 151, 386] // Mewtu, Mew, Deoxys (AI/Psychic legendaries)
  },
]

const getStoredData = () => {
  try {
    const stored = localStorage.getItem('pokemonBuddy')
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

const xpForNextLevel = (level) => Math.floor(20 * Math.pow(1.3, level))

// Custom Event für XP
export const giveXP = (amount, reason) => {
  window.dispatchEvent(new CustomEvent('pokemon-xp', { detail: { amount, reason } }))
}

export default function PokemonBuddy() {
  const { istDunkel } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(getStoredData)
  const [pokemonInfo, setPokemonInfo] = useState(null)
  const [message, setMessage] = useState('')
  const [xpPopup, setXpPopup] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isEvolving, setIsEvolving] = useState(false)
  const [starterList, setStarterList] = useState([])
  const [isLoadingStarters, setIsLoadingStarters] = useState(false)
  const [canPet, setCanPet] = useState(true)
  const [isInitializing, setIsInitializing] = useState(false) // NEW: Pokemon wird initialisiert
  
  // Battle states
  const [isBattling, setIsBattling] = useState(false)
  const [canBattle, setCanBattle] = useState(true)
  const [opponent, setOpponent] = useState(null)
  const [trainerName, setTrainerName] = useState('')
  const [battleLog, setBattleLog] = useState([])
  const [battlePhase, setBattlePhase] = useState('idle') // idle, searching, intro, fighting, result
  const [playerHP, setPlayerHP] = useState(100)
  const [opponentHP, setOpponentHP] = useState(100)
  
  // Arena states
  const [currentArena, setCurrentArena] = useState(null)
  const [arenaOpponentIndex, setArenaOpponentIndex] = useState(0) // 0, 1, 2 für die 3 Pokemon
  const [arenaOpponents, setArenaOpponents] = useState([]) // Die 3 Pokemon des Arenaleiters
  
  // Move/Attacken states
  const [availableMoves, setAvailableMoves] = useState([]) // Alle gelernten Moves mit Details
  const [pendingMoveChoice, setPendingMoveChoice] = useState(null) // Neuer Move der gelernt werden kann
  const [showMoveSelect, setShowMoveSelect] = useState(false)

  // XP Event Listener
  useEffect(() => {
    const handleXP = (e) => {
      if (!data) return
      const { amount, reason } = e.detail
      
      setData(prev => ({ ...prev, xp: prev.xp + amount }))
      setXpPopup({ amount, reason })
      setIsAnimating(true)
      
      setTimeout(() => {
        setXpPopup(null)
        setIsAnimating(false)
      }, 2000)
    }
    
    window.addEventListener('pokemon-xp', handleXP)
    return () => window.removeEventListener('pokemon-xp', handleXP)
  }, [data])

  // Zeit auf Seite tracken - alle 30 Sekunden +3 XP
  useEffect(() => {
    if (!data) return
    
    const interval = setInterval(() => {
      giveXP(3, 'Zeit auf Seite')
    }, 30000)
    
    return () => clearInterval(interval)
  }, [data])

  // Scroll XP - Scrollen gibt XP in beide Richtungen (aber max 4x pro Richtung)
  useEffect(() => {
    if (!data) return

    const scrollXPKey = `scrollXP_${data.createdAt}_${Date.now()}`
    const storedScrollXP = localStorage.getItem(scrollXPKey)
    const scrollMilestones = storedScrollXP ? JSON.parse(storedScrollXP) : {
      down: { 50: false, 100: false },
      up: { 50: false, 100: false }
    }

    let lastScrollPercent = 0
    let scrollDirection = 'down'

    const handleScroll = () => {
      const scrollPercent = Math.floor(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )

      // Richtung ermitteln
      if (scrollPercent > lastScrollPercent + 2) {
        scrollDirection = 'down'
      } else if (scrollPercent < lastScrollPercent - 2) {
        scrollDirection = 'up'
      }
      lastScrollPercent = scrollPercent

      const milestones = scrollDirection === 'down' ? scrollMilestones.down : scrollMilestones.up

      // Runterscrollen: 50% und 100%
      if (scrollDirection === 'down') {
        if (scrollPercent >= 50 && !milestones[50]) {
          milestones[50] = true
          giveXP(2, '50% gescrollt (runter)')
          localStorage.setItem(scrollXPKey, JSON.stringify(scrollMilestones))
        }
        if (scrollPercent >= 95 && !milestones[100]) {
          milestones[100] = true
          giveXP(2, 'Seite komplett')
          localStorage.setItem(scrollXPKey, JSON.stringify(scrollMilestones))
        }
      }
      // Hochscrollen: 50% und 0% (oben)
      else if (scrollDirection === 'up') {
        if (scrollPercent <= 50 && scrollPercent > 5 && !milestones[50]) {
          milestones[50] = true
          giveXP(2, '50% gescrollt (hoch)')
          localStorage.setItem(scrollXPKey, JSON.stringify(scrollMilestones))
        }
        if (scrollPercent <= 5 && !milestones[100]) {
          milestones[100] = true
          giveXP(2, 'Zurück nach oben')
          localStorage.setItem(scrollXPKey, JSON.stringify(scrollMilestones))
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data])

  // Wiederkehr-Bonus beim Laden
  useEffect(() => {
    if (!data) return
    
    const hoursSinceLastVisit = (Date.now() - data.lastVisit) / (1000 * 60 * 60)
    
    if (hoursSinceLastVisit >= 1) {
      // +5 XP pro Stunde weg, max 100
      const bonusXP = Math.min(Math.floor(hoursSinceLastVisit * 5), 100)
      
      setData(prev => ({
        ...prev,
        totalVisits: prev.totalVisits + 1,
        lastVisit: Date.now(),
      }))
      
      // Verzögert anzeigen
      setTimeout(() => {
        giveXP(bonusXP, `Willkommen zurück!`)
      }, 1000)
    } else if (data.lastVisit) {
      // Nur lastVisit updaten
      setData(prev => ({ ...prev, lastVisit: Date.now() }))
    }
  }, []) // Nur einmal beim Mount

  // Pokemon-Daten laden (mit Stats und Moves)
  const fetchPokemonData = async (pokemonId) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      const pokemon = await res.json()
      
      const speciesRes = await fetch(pokemon.species.url)
      const species = await speciesRes.json()
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
      
      return {
        id: pokemon.id,
        name: germanName,
        sprite: pokemon.sprites.versions['generation-v']['black-white'].animated?.front_default 
          || pokemon.sprites.front_default,
        spriteStatic: pokemon.sprites.front_default,
        shinySprite: pokemon.sprites.front_shiny,
        types: pokemon.types.map(t => t.type.name),
        stats,
        levelUpMoves,
      }
    } catch (error) {
      console.error('Pokemon fetch error:', error)
      return null
    }
  }
  
  // Move-Details laden (deutsche Namen, Power, etc.)
  const fetchMoveDetails = async (moveUrl) => {
    try {
      const res = await fetch(moveUrl)
      const move = await res.json()
      const germanName = move.names.find(n => n.language.name === 'de')?.name || move.name
      
      return {
        id: move.id,
        name: germanName,
        englishName: move.name,
        power: move.power || 0,
        accuracy: move.accuracy || 100,
        type: move.type.name,
        damageClass: move.damage_class.name, // physical, special, status
        pp: move.pp,
        // Stat-Boosts aus effect
        statBoost: parseStatBoost(move),
      }
    } catch (error) {
      console.error('Move fetch error:', error)
      return null
    }
  }
  
  // Stat-Boost aus Move-Effect parsen
  const parseStatBoost = (move) => {
    const boosts = {}
    if (move.stat_changes && move.stat_changes.length > 0) {
      move.stat_changes.forEach(sc => {
        const statName = sc.stat.name
        boosts[statName] = sc.change
      })
    }
    return boosts
  }

  // Starter laden
  const loadStarters = async () => {
    setIsLoadingStarters(true)
    const starters = []
    for (const starter of STARTER_POKEMON) {
      const info = await fetchPokemonData(starter.id)
      if (info) starters.push({ ...starter, ...info })
    }
    setStarterList(starters)
    setIsLoadingStarters(false)
  }

  // Pokemon laden wenn data existiert
  useEffect(() => {
    if (data?.pokemonId) {
      fetchPokemonData(data.pokemonId).then(info => {
        if (info) setPokemonInfo(info)
      })
    }
  }, [data?.pokemonId])

  // Speichern
  useEffect(() => {
    if (data) localStorage.setItem('pokemonBuddy', JSON.stringify(data))
  }, [data])

  // Level-Up Check
  useEffect(() => {
    if (!data) return
    const xpNeeded = xpForNextLevel(data.level)
    
    if (data.xp >= xpNeeded) {
      const newLevel = data.level + 1
      
      setData(prev => ({
        ...prev,
        level: newLevel,
        xp: prev.xp - xpNeeded,
      }))
      
      setMessage(`LEVEL UP! Level ${newLevel}!`)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1500)
      
      checkEvolution(newLevel)
      checkNewMoves(newLevel)
    }
  }, [data?.xp])
  
  // Check ob neue Moves bei Level-Up verfügbar sind
  const checkNewMoves = async (newLevel) => {
    if (!pokemonInfo?.levelUpMoves) return
    
    // Finde Moves die bei diesem Level gelernt werden
    const newMoves = pokemonInfo.levelUpMoves.filter(m => m.level === newLevel)
    
    for (const move of newMoves) {
      const moveDetails = await fetchMoveDetails(move.url)
      if (moveDetails) {
        // Wenn weniger als 4 Moves, automatisch lernen
        const currentMoves = data?.moves || []
        if (currentMoves.length < 4) {
          setData(prev => ({
            ...prev,
            moves: [...(prev.moves || []), moveDetails]
          }))
          setMessage(`${pokemonInfo.name} lernt ${moveDetails.name}!`)
        } else {
          // Sonst als Benachrichtigung speichern (nicht sofort Popup)
          setPendingMoveChoice(moveDetails)
          // Nicht automatisch öffnen - User klickt auf Glocke
        }
      }
    }
  }
  
  // Move lernen (ersetzt einen bestehenden)
  const learnMove = (replaceIndex) => {
    if (!pendingMoveChoice) return
    
    if (replaceIndex === -1) {
      // Move nicht lernen
      setMessage(`${pokemonInfo.name} lernt ${pendingMoveChoice.name} nicht.`)
    } else {
      // Move ersetzen
      setData(prev => {
        const newMoves = [...(prev.moves || [])]
        const oldMove = newMoves[replaceIndex]
        newMoves[replaceIndex] = pendingMoveChoice
        setMessage(`${pokemonInfo.name} vergisst ${oldMove.name} und lernt ${pendingMoveChoice.name}!`)
        return { ...prev, moves: newMoves }
      })
    }
    
    setPendingMoveChoice(null)
    setShowMoveSelect(false)
  }
  
  // Initiale Moves laden wenn Pokemon gewählt wird
  const loadInitialMoves = async (pokemonInfo, level = 1) => {
    if (!pokemonInfo?.levelUpMoves) return []
    
    // Alle Moves die bis zum aktuellen Level gelernt werden können
    const learnableMoves = pokemonInfo.levelUpMoves.filter(m => m.level <= level)
    
    // Die ersten 4 Moves laden (oder alle wenn weniger)
    const initialMoves = []
    for (const move of learnableMoves.slice(0, 4)) {
      const details = await fetchMoveDetails(move.url)
      if (details) initialMoves.push(details)
    }
    
    return initialMoves
  }
  
  // Berechne effektive Stats basierend auf Level und Moves
  const calculateEffectiveStats = (baseStats, level, moves = [], isShiny = false) => {
    if (!baseStats) return { total: 300 }
    
    // Base Stats skaliert mit Level (wie in echtem Pokemon)
    const levelMultiplier = 1 + (level * 0.02) // +2% pro Level
    
    const stats = {
      hp: Math.floor(baseStats.hp * levelMultiplier),
      attack: Math.floor(baseStats.attack * levelMultiplier),
      defense: Math.floor(baseStats.defense * levelMultiplier),
      spAttack: Math.floor(baseStats.spAttack * levelMultiplier),
      spDefense: Math.floor(baseStats.spDefense * levelMultiplier),
      speed: Math.floor(baseStats.speed * levelMultiplier),
    }
    
    // Move-Boosts anwenden (Status-Moves geben permanente Boosts)
    moves.forEach(move => {
      if (move.statBoost) {
        Object.entries(move.statBoost).forEach(([stat, boost]) => {
          const statKey = stat.replace('-', '')
            .replace('specialattack', 'spAttack')
            .replace('specialdefense', 'spDefense')
          if (stats[statKey]) {
            stats[statKey] = Math.floor(stats[statKey] * (1 + boost * 0.1))
          }
        })
      }
      // Damage Moves addieren ihre Power zu Attack/SpAttack
      if (move.power > 0) {
        if (move.damageClass === 'physical') {
          stats.attack += Math.floor(move.power * 0.3)
        } else if (move.damageClass === 'special') {
          stats.spAttack += Math.floor(move.power * 0.3)
        }
      }
    })
    
    // Shiny Bonus: +10% auf alle Stats
    if (isShiny) {
      Object.keys(stats).forEach(key => {
        stats[key] = Math.floor(stats[key] * 1.1)
      })
    }
    
    stats.total = stats.hp + stats.attack + stats.defense + stats.spAttack + stats.spDefense + stats.speed
    return stats
  }

  // Evolution
  const checkEvolution = async (newLevel) => {
    if (!data) return
    
    const chain = EVOLUTION_CHAINS[data.baseId]
    if (!chain) return
    
    const currentIndex = chain.indexOf(data.pokemonId)
    if (currentIndex === -1 || currentIndex >= chain.length - 1) return
    
    let shouldEvolve = false
    if (currentIndex === 0 && newLevel >= EVOLUTION_LEVELS.stage2) shouldEvolve = true
    else if (currentIndex === 1 && newLevel >= EVOLUTION_LEVELS.stage3) shouldEvolve = true
    
    // Evoli special
    if (data.baseId === 133 && newLevel >= 20 && currentIndex === 0) {
      const eeveelutions = [134, 135, 136, 196, 197, 470, 471, 700]
      evolve(eeveelutions[Math.floor(Math.random() * eeveelutions.length)])
      return
    }
    
    if (shouldEvolve) evolve(chain[currentIndex + 1])
  }

  const evolve = async (newPokemonId) => {
    setIsEvolving(true)
    setMessage('Was? Dein Pokemon entwickelt sich!')
    
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const newInfo = await fetchPokemonData(newPokemonId)
    if (newInfo) {
      setData(prev => ({ ...prev, pokemonId: newPokemonId }))
      setPokemonInfo(newInfo)
      setMessage(`Es wurde zu ${newInfo.name}!`)
    }
    
    setIsEvolving(false)
  }

  // Streicheln - einzige direkte Aktion
  const handlePet = () => {
    if (!canPet) return
    
    giveXP(5, 'Streicheln')
    setMessage(['*freut sich*', '❤️', '*schnurr*', 'Danke!'][Math.floor(Math.random() * 4)])
    
    setCanPet(false)
    setTimeout(() => setCanPet(true), 10000) // 10 Sek Cooldown
  }

  // === BATTLE SYSTEM ===
  const startBattle = async () => {
    if (!canBattle || !data) return
    
    setCanBattle(false)
    setIsBattling(true)
    setBattlePhase('searching') // Neue Phase: Gegner suchen
    setBattleLog(['Suche Gegner...'])
    setPlayerHP(100)
    setOpponentHP(100)
    setOpponent(null)
    setTrainerName('')
    
    // Kurze Pause für "Suche Gegner..."
    await new Promise(r => setTimeout(r, 1500))
    
    // Trainer generieren
    const trainer = generateTrainerName()
    setTrainerName(trainer)
    
    // "Trainer ist aufgetaucht!" anzeigen
    setBattleLog([`${trainer} ist aufgetaucht!`])
    setBattlePhase('intro')
    
    // Kurze Pause bevor Pokemon gezeigt wird
    await new Promise(r => setTimeout(r, 1200))
    
    // Zufälliges Gegner-Pokemon laden
    const randomId = WILD_POKEMON_IDS[Math.floor(Math.random() * WILD_POKEMON_IDS.length)]
    const opponentInfo = await fetchPokemonData(randomId)
    
    if (opponentInfo) {
      // Gegner Level basierend auf Spieler Level (±3)
      const opponentLevel = Math.max(1, data.level + Math.floor(Math.random() * 7) - 3)
      setOpponent({ ...opponentInfo, level: opponentLevel })
      
      setBattleLog([
        `${trainer} ist aufgetaucht!`,
        `${trainer} schickt ${opponentInfo.name} (Lv.${opponentLevel})!`
      ])
      
      // Kampf starten nach kurzer Pause
      setTimeout(() => {
        setBattlePhase('fighting')
        runBattle(opponentInfo, opponentLevel, trainer)
      }, 1500)
    }
  }
  
  // Schaden berechnen basierend auf Stats
  const calculateDamage = (attackerStats, defenderStats, isPlayer) => {
    // Mische physischen und speziellen Angriff/Verteidigung
    const attack = (attackerStats.attack + attackerStats.spAttack) / 2
    const defense = (defenderStats.defense + defenderStats.spDefense) / 2
    
    // Basis-Schaden mit etwas Variation
    const baseDamage = (attack / defense) * 15
    const variation = 0.8 + Math.random() * 0.4 // 80%-120%
    
    return Math.floor(baseDamage * variation)
  }

  const runBattle = async (opponentInfo, opponentLevel, trainer) => {
    // Stats berechnen
    const playerStats = calculateEffectiveStats(
      pokemonInfo?.stats, 
      data.level, 
      data.moves || [], 
      data.isShiny
    )
    const opponentStats = calculateEffectiveStats(
      opponentInfo?.stats, 
      opponentLevel, 
      [], // Gegner hat keine custom Moves
      false
    )
    
    let pHP = 100
    let oHP = 100
    const logs = [
      `${trainer} ist aufgetaucht!`,
      `${trainer} schickt ${opponentInfo.name} (Lv.${opponentLevel})!`,
      `📊 Deine Stats: ${playerStats.total} | Gegner: ${opponentStats.total}`
    ]
    
    // Wer ist schneller? (Initiative)
    const playerFirst = playerStats.speed >= opponentStats.speed
    
    // Simuliere Kampfrunden
    const rounds = 3 + Math.floor(Math.random() * 2)
    
    for (let i = 0; i < rounds && pHP > 0 && oHP > 0; i++) {
      if (playerFirst) {
        // Spieler greift zuerst an
        await new Promise(r => setTimeout(r, 700))
        const dmg = calculateDamage(playerStats, opponentStats, true)
        oHP = Math.max(0, oHP - dmg)
        logs.push(`${pokemonInfo.name} greift an! -${dmg} HP`)
        setBattleLog([...logs])
        setOpponentHP(oHP)
        
        if (oHP <= 0) break
        
        await new Promise(r => setTimeout(r, 500))
        const oppDmg = calculateDamage(opponentStats, playerStats, false)
        pHP = Math.max(0, pHP - oppDmg)
        logs.push(`${opponentInfo.name} greift an! -${oppDmg} HP`)
        setBattleLog([...logs])
        setPlayerHP(pHP)
      } else {
        // Gegner greift zuerst an
        await new Promise(r => setTimeout(r, 700))
        const oppDmg = calculateDamage(opponentStats, playerStats, false)
        pHP = Math.max(0, pHP - oppDmg)
        logs.push(`${opponentInfo.name} greift an! -${oppDmg} HP`)
        setBattleLog([...logs])
        setPlayerHP(pHP)
        
        if (pHP <= 0) break
        
        await new Promise(r => setTimeout(r, 500))
        const dmg = calculateDamage(playerStats, opponentStats, true)
        oHP = Math.max(0, oHP - dmg)
        logs.push(`${pokemonInfo.name} greift an! -${dmg} HP`)
        setBattleLog([...logs])
        setOpponentHP(oHP)
      }
    }
    
    await new Promise(r => setTimeout(r, 500))
    
    // Ergebnis basierend auf Stats (80%) und Glück (20%)
    let playerWins = false
    if (oHP <= 0) {
      playerWins = true
    } else if (pHP <= 0) {
      playerWins = false
    } else {
      // Beide leben noch - Stats-Vergleich mit Glücksfaktor
      const statAdvantage = playerStats.total / (playerStats.total + opponentStats.total) // 0-1
      const luck = Math.random() * 0.2 // 0-0.2 (20% Glück)
      const shinyBonus = data.isShiny ? 0.05 : 0 // 5% extra für Shiny
      const winChance = (statAdvantage * 0.8) + luck + shinyBonus
      
      playerWins = winChance > 0.5
    }
    
    if (playerWins) {
      const xpGain = 15 + Math.floor(opponentLevel * 1.5)
      logs.push(`🎉 ${opponentInfo.name} wurde besiegt!`)
      logs.push(`${trainer}: "Beeindruckend!"`)
      logs.push(`+${xpGain} XP erhalten!`)
      setBattleLog([...logs])
      setOpponentHP(0)
      
      setTimeout(() => {
        giveXP(xpGain, 'Kampf gewonnen')
        setData(prev => ({ ...prev, wins: (prev.wins || 0) + 1 }))
      }, 500)
    } else {
      // Niederlage: XP-Verlust (aber nie unter 0)
      const xpLoss = Math.min(data.xp, 10 + Math.floor(opponentLevel * 0.5))
      logs.push(`${pokemonInfo.name} wurde besiegt...`)
      logs.push(`${trainer}: "Vielleicht nächstes Mal!"`)
      logs.push(`-${xpLoss} XP verloren`)
      setBattleLog([...logs])
      setPlayerHP(0)
      
      setTimeout(() => {
        setData(prev => ({ 
          ...prev, 
          xp: Math.max(0, prev.xp - xpLoss),
          losses: (prev.losses || 0) + 1 
        }))
      }, 500)
    }
    
    setBattlePhase('result')
    
    // Cooldown 60 Sekunden
    setTimeout(() => setCanBattle(true), 60000)
  }

  const closeBattle = () => {
    setIsBattling(false)
    setBattlePhase('idle')
    setOpponent(null)
    setBattleLog([])
    setCurrentArena(null)
    setArenaOpponentIndex(0)
    setArenaOpponents([])
  }

  // === ARENA SYSTEM ===
  const getDefeatedArenas = () => data?.defeatedArenas || []
  
  // Nächste verfügbare Arena ermitteln
  const getNextArena = () => {
    const defeated = getDefeatedArenas()
    // Finde die erste Arena die noch nicht besiegt ist
    return TECH_ARENAS.find(arena => !defeated.includes(arena.id)) || null
  }
  
  // Prüfen ob Arena verfügbar ist (Level-Check)
  const canChallengeArena = (arena) => {
    if (!data || !arena) return false
    return data.level >= arena.requiredLevel
  }
  
  const startNextArena = () => {
    const nextArena = getNextArena()
    if (nextArena && canChallengeArena(nextArena)) {
      startArenaBattle(nextArena)
    }
  }
  
  const startArenaBattle = async (arena) => {
    if (!data) return
    
    setCurrentArena(arena)
    setArenaOpponentIndex(0)
    setIsBattling(true)
    setBattlePhase('searching')
    setBattleLog(['Betrete Arena...'])
    setPlayerHP(100)
    setOpponentHP(100)
    setOpponent(null)
    setTrainerName(arena.leader)
    
    await new Promise(r => setTimeout(r, 1500))
    
    // Alle 3 Pokemon des Arenaleiters laden
    const opponentInfos = []
    for (const pokemonId of arena.pokemon) {
      const info = await fetchPokemonData(pokemonId)
      if (info) opponentInfos.push(info)
    }
    setArenaOpponents(opponentInfos)
    
    // Arena-Level ist immer Spieler-Level + 2
    const arenaLevel = data.level + 2
    
    setBattleLog([
      `🏟️ ${arena.company} Arena!`,
      `${arena.leader} ist aufgetaucht!`
    ])
    setBattlePhase('intro')
    
    await new Promise(r => setTimeout(r, 1500))
    
    // Erstes Pokemon des Arenaleiters
    if (opponentInfos[0]) {
      setOpponent({ ...opponentInfos[0], level: arenaLevel })
      setBattleLog([
        `🏟️ ${arena.company} Arena!`,
        `${arena.leader} ist aufgetaucht!`,
        `${arena.leader} schickt ${opponentInfos[0].name} (Lv.${arenaLevel})!`,
        `[Pokemon 1/3]`
      ])
      
      setTimeout(() => {
        setBattlePhase('fighting')
        runArenaBattle(arena, opponentInfos, 0, arenaLevel, 100)
      }, 1500)
    }
  }

  const runArenaBattle = async (arena, opponentInfos, oppIndex, arenaLevel, currentPlayerHP) => {
    const opponentInfo = opponentInfos[oppIndex]
    
    // Stats berechnen
    const playerStats = calculateEffectiveStats(
      pokemonInfo?.stats, 
      data.level, 
      data.moves || [], 
      data.isShiny
    )
    const opponentStats = calculateEffectiveStats(
      opponentInfo?.stats, 
      arenaLevel, 
      [], 
      false
    )
    
    let pHP = currentPlayerHP
    let oHP = 100
    
    const logs = [
      `🏟️ ${arena.company} Arena!`,
      `${arena.leader}: Pokemon ${oppIndex + 1}/3`,
      `${opponentInfo.name} (Lv.${arenaLevel}) kämpft!`,
      `📊 Deine Stats: ${playerStats.total} | Gegner: ${opponentStats.total}`
    ]
    
    // Wer ist schneller?
    const playerFirst = playerStats.speed >= opponentStats.speed
    
    // Simuliere Kampf
    const rounds = 3 + Math.floor(Math.random() * 2)
    
    for (let i = 0; i < rounds && pHP > 0 && oHP > 0; i++) {
      if (playerFirst) {
        await new Promise(r => setTimeout(r, 600))
        const dmg = calculateDamage(playerStats, opponentStats, true)
        oHP = Math.max(0, oHP - dmg)
        logs.push(`${pokemonInfo.name} greift an! -${dmg} HP`)
        setBattleLog([...logs])
        setOpponentHP(oHP)
        
        if (oHP <= 0) break
        
        await new Promise(r => setTimeout(r, 400))
        const oppDmg = calculateDamage(opponentStats, playerStats, false)
        pHP = Math.max(0, pHP - oppDmg)
        logs.push(`${opponentInfo.name} greift an! -${oppDmg} HP`)
        setBattleLog([...logs])
        setPlayerHP(pHP)
      } else {
        await new Promise(r => setTimeout(r, 600))
        const oppDmg = calculateDamage(opponentStats, playerStats, false)
        pHP = Math.max(0, pHP - oppDmg)
        logs.push(`${opponentInfo.name} greift an! -${oppDmg} HP`)
        setBattleLog([...logs])
        setPlayerHP(pHP)
        
        if (pHP <= 0) break
        
        await new Promise(r => setTimeout(r, 400))
        const dmg = calculateDamage(playerStats, opponentStats, true)
        oHP = Math.max(0, oHP - dmg)
        logs.push(`${pokemonInfo.name} greift an! -${dmg} HP`)
        setBattleLog([...logs])
        setOpponentHP(oHP)
      }
    }
    
    await new Promise(r => setTimeout(r, 500))
    
    // Ergebnis basierend auf Stats (80%) und Glück (20%)
    let playerWins = false
    if (oHP <= 0) {
      playerWins = true
    } else if (pHP <= 0) {
      playerWins = false
    } else {
      const statAdvantage = playerStats.total / (playerStats.total + opponentStats.total)
      const luck = Math.random() * 0.2
      const shinyBonus = data.isShiny ? 0.05 : 0
      const winChance = (statAdvantage * 0.8) + luck + shinyBonus
      playerWins = winChance > 0.5
    }
    
    if (playerWins) {
      setOpponentHP(0)
      
      // Gibt es noch mehr Pokemon?
      if (oppIndex < 2 && opponentInfos[oppIndex + 1]) {
        logs.push(`✓ ${opponentInfo.name} besiegt!`)
        logs.push(`${arena.leader} schickt ${opponentInfos[oppIndex + 1].name}!`)
        setBattleLog([...logs])
        
        await new Promise(r => setTimeout(r, 1500))
        
        // Nächstes Pokemon
        setArenaOpponentIndex(oppIndex + 1)
        setOpponent({ ...opponentInfos[oppIndex + 1], level: arenaLevel })
        setOpponentHP(100)
        
        // Weiterkämpfen mit verbleibendem HP
        setTimeout(() => {
          runArenaBattle(arena, opponentInfos, oppIndex + 1, arenaLevel, pHP)
        }, 500)
      } else {
        // ALLE 3 BESIEGT - Arena gewonnen!
        const xpGain = 50 + (arena.id * 10) // Mehr XP für spätere Arenen
        logs.push(`🏆 ARENA BESIEGT!`)
        logs.push(`${arena.leader}: "Unglaublich!"`)
        logs.push(`+${xpGain} XP erhalten!`)
        logs.push(`🎖️ ${arena.company}-Orden erhalten!`)
        setBattleLog([...logs])
        
        setTimeout(() => {
          giveXP(xpGain, `${arena.company} Arena`)
          setData(prev => ({
            ...prev,
            defeatedArenas: [...(prev.defeatedArenas || []), arena.id]
          }))
        }, 500)
        
        setBattlePhase('result')
      }
    } else {
      // Spieler verloren
      const xpLoss = Math.min(data.xp, 15 + arena.id * 2)
      logs.push(`${pokemonInfo.name} wurde besiegt...`)
      logs.push(`${arena.leader}: "Trainiere mehr und komm wieder!"`)
      logs.push(`-${xpLoss} XP verloren`)
      setBattleLog([...logs])
      setPlayerHP(0)
      
      setTimeout(() => {
        setData(prev => ({
          ...prev,
          xp: Math.max(0, prev.xp - xpLoss)
        }))
      }, 500)
      
      setBattlePhase('result')
    }
  }

  // Starter wählen
  const selectStarter = async (starter) => {
    setIsInitializing(true) // Zeige Loading-State

    const isShiny = Math.random() < 0.10 // 10% Shiny-Chance

    // Initiale Moves laden
    const initialMoves = await loadInitialMoves(starter, 1)

    const newData = {
      pokemonId: starter.id,
      baseId: starter.id,
      level: 1,
      xp: 0,
      isShiny,
      moves: initialMoves,
      totalVisits: 1,
      lastVisit: Date.now(),
      createdAt: Date.now(),
    }

    // Setze beide States
    setPokemonInfo(starter)
    setData(newData)
    setMessage(isShiny ? `WOW! Ein SHINY ${starter.name}!` : `${starter.name}, ich wähle dich!`)

    // Kurze Pause damit React rendern kann
    await new Promise(r => setTimeout(r, 100))
    setIsInitializing(false)
  }

  // Reset
  const resetPokemon = () => {
    if (confirm('Pokemon freilassen? Fortschritt geht verloren!')) {
      localStorage.removeItem('pokemonBuddy')
      setData(null)
      setPokemonInfo(null)
      setStarterList([])
    }
  }

  const xpNeeded = data ? xpForNextLevel(data.level) : 0
  const xpProgress = data ? (data.xp / xpNeeded) * 100 : 0

  const typeColors = {
    fire: 'bg-orange-500', water: 'bg-blue-500', grass: 'bg-green-500',
    electric: 'bg-yellow-400', psychic: 'bg-pink-500', ice: 'bg-cyan-300',
    dragon: 'bg-purple-600', dark: 'bg-gray-700', fairy: 'bg-pink-300',
    normal: 'bg-gray-400', fighting: 'bg-red-700', flying: 'bg-indigo-300',
    poison: 'bg-purple-500', ground: 'bg-amber-600', rock: 'bg-amber-800',
    bug: 'bg-lime-500', ghost: 'bg-purple-800', steel: 'bg-gray-500',
  }

  return (
    <>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          25% { transform: rotate(3deg) scale(1.05); }
          50% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg) scale(1.05); }
        }
        @keyframes evolve-glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 10px white); }
          50% { filter: brightness(3) drop-shadow(0 0 40px white); }
        }
        @keyframes xp-float {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-30px); }
        }
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
          </div>
        </div>
      )}
      
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(!isOpen)
            if (!data && starterList.length === 0) loadStarters()
          }}
          className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
            isAnimating ? 'animate-bounce' : 'wiggle-animation'
          } ${
            istDunkel 
              ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/30' 
              : 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-400/30'
          }`}
          style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
        >
          {pokemonInfo ? (
            <img 
              src={data?.isShiny ? pokemonInfo.shinySprite : (pokemonInfo.sprite || pokemonInfo.spriteStatic)}
              alt={pokemonInfo.name}
              className={`w-14 h-14 object-contain ${data?.isShiny ? 'shiny-sparkle' : ''} ${isEvolving ? 'evolving' : ''}`}
            />
          ) : (
            <span className="text-3xl">🎮</span>
          )}
        </button>
        
        {/* Benachrichtigung Badge für neue Attacke */}
        {pendingMoveChoice && (
          <button
            onClick={() => setShowMoveSelect(true)}
            className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce shadow-lg"
            title="Neue Attacke verfügbar!"
          >
            <span className="text-sm">🔔</span>
          </button>
        )}
      </div>

      {/* Panel */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-72 rounded-2xl shadow-2xl overflow-hidden ${
          istDunkel ? 'bg-gray-900/95 border border-gray-700' : 'bg-white/95 border border-gray-200'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-700 p-3 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                Pokemon Buddy
                {data?.isShiny && <span className="text-yellow-300 text-xs">✨</span>}
              </h3>
              <div className="flex items-center gap-2">
                {/* Glocke für neue Attacke */}
                {pendingMoveChoice && (
                  <button 
                    onClick={() => setShowMoveSelect(true)}
                    className="bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold animate-pulse flex items-center gap-1"
                  >
                    🔔 Neue Attacke!
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">×</button>
              </div>
            </div>
            {pokemonInfo && (
              <p className="text-xs text-white/80">{pokemonInfo.name} • Lv. {data.level}</p>
            )}
          </div>

          <div className="p-4">
            {!data ? (
              // Starter Auswahl
              <div>
                <p className={`text-center mb-3 text-sm font-medium ${istDunkel ? 'text-gray-200' : 'text-gray-700'}`}>
                  Wähle dein Pokemon!
                </p>
                {isLoadingStarters || isInitializing ? (
                  <div className="text-center py-6">
                    <div className="animate-spin text-3xl">🎮</div>
                    <p className={`text-xs mt-2 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                      Pokemon wird vorbereitet...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {starterList.map(starter => (
                      <button
                        key={starter.id}
                        onClick={() => selectStarter(starter)}
                        className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                          istDunkel ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <img src={starter.spriteStatic} alt={starter.name} className="w-10 h-10 mx-auto" />
                      </button>
                    ))}
                  </div>
                )}
                <p className={`text-center mt-2 text-xs ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                  10% Shiny-Chance! ✨
                </p>
              </div>
            ) : (
              <>
                {/* Pokemon */}
                <div className={`text-center mb-3 ${isEvolving ? 'evolving' : isAnimating ? 'animate-bounce' : ''}`}>
                  {pokemonInfo && (
                    <>
                      <img 
                        src={data.isShiny ? pokemonInfo.shinySprite : (pokemonInfo.sprite || pokemonInfo.spriteStatic)}
                        alt={pokemonInfo.name}
                        className={`w-20 h-20 mx-auto ${data.isShiny ? 'shiny-sparkle' : ''}`}
                      />
                      <div className="flex justify-center gap-1 mt-1">
                        {pokemonInfo.types.map(type => (
                          <span key={type} className={`px-2 py-0.5 rounded text-[9px] text-white uppercase font-bold ${typeColors[type]}`}>
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

                {/* XP Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>
                      {data.xp}/{xpNeeded} XP
                    </span>
                    <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>
                      Lv. {data.level}
                    </span>
                  </div>
                  <div className={`h-2.5 rounded-full overflow-hidden ${istDunkel ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${Math.min(xpProgress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Streicheln Button */}
                <button
                  onClick={handlePet}
                  disabled={!canPet}
                  className={`w-full py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    canPet 
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:scale-105' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  💕 {canPet ? 'Streicheln (+5 XP)' : 'Warte...'}
                </button>

                {/* Battle Button */}
                <button
                  onClick={startBattle}
                  disabled={!canBattle}
                  className={`w-full py-2 mt-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    canBattle 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-105' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ⚔️ {canBattle ? 'Kämpfen!' : 'Cooldown...'}
                </button>

                {/* Arena Button */}
                {(() => {
                  const nextArena = getNextArena()
                  const canChallenge = nextArena && canChallengeArena(nextArena)
                  const allDefeated = !nextArena
                  
                  return (
                    <button
                      onClick={startNextArena}
                      disabled={!canChallenge && !allDefeated}
                      className={`w-full py-2 mt-2 rounded-xl font-medium transition-all flex flex-col items-center justify-center ${
                        allDefeated
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                          : canChallenge
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:scale-105'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        🏟️ {allDefeated 
                          ? 'Alle Arenen besiegt! 🏆' 
                          : `Arena: ${nextArena.company}`
                        }
                      </span>
                      {!allDefeated && (
                        <span className="text-[10px] opacity-80">
                          {canChallenge 
                            ? `${nextArena.leader} (${getDefeatedArenas().length + 1}/8)`
                            : `Ab Level ${nextArena.requiredLevel} (${getDefeatedArenas().length}/8)`
                          }
                        </span>
                      )}
                    </button>
                  )
                })()}

                {/* Info */}
                <div className={`mt-3 text-xs space-y-1 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                  {/* Stats Anzeige */}
                  {pokemonInfo?.stats && (
                    <div className={`p-2 rounded-lg mb-2 ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className="font-medium text-center mb-1">Stats (Total: {calculateEffectiveStats(pokemonInfo.stats, data.level, data.moves || [], data.isShiny).total})</p>
                      <div className="grid grid-cols-3 gap-1 text-[10px]">
                        <span>❤️ {calculateEffectiveStats(pokemonInfo.stats, data.level, data.moves || [], data.isShiny).hp}</span>
                        <span>⚔️ {calculateEffectiveStats(pokemonInfo.stats, data.level, data.moves || [], data.isShiny).attack}</span>
                        <span>🛡️ {calculateEffectiveStats(pokemonInfo.stats, data.level, data.moves || [], data.isShiny).defense}</span>
                        <span>✨ {calculateEffectiveStats(pokemonInfo.stats, data.level, data.moves || [], data.isShiny).spAttack}</span>
                        <span>🔮 {calculateEffectiveStats(pokemonInfo.stats, data.level, data.moves || [], data.isShiny).spDefense}</span>
                        <span>💨 {calculateEffectiveStats(pokemonInfo.stats, data.level, data.moves || [], data.isShiny).speed}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Moves Anzeige */}
                  {data.moves && data.moves.length > 0 && (
                    <div className={`p-2 rounded-lg mb-2 ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className="font-medium text-center mb-1">Attacken</p>
                      <div className="space-y-1">
                        {data.moves.map((move, i) => (
                          <div key={i} className="flex justify-between text-[10px]">
                            <span>{move.name}</span>
                            <span className="opacity-60">
                              {move.power > 0 ? `${move.power} PWR` : 'Status'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-center">XP durch: Seite besuchen, Zeit verbringen, Wiederkommen</p>
                  <div className="flex justify-between pt-1 border-t border-gray-700">
                    <span>Besuche: {data.totalVisits}</span>
                    <span>Tag {Math.floor((Date.now() - data.createdAt) / 86400000) + 1}</span>
                  </div>
                </div>

                <button
                  onClick={resetPokemon}
                  className={`w-full mt-3 py-1 text-xs ${istDunkel ? 'text-gray-600 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                >
                  Freilassen
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Battle Overlay */}
      {isBattling && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl overflow-hidden ${
            istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Battle Header */}
            <div className={`p-3 text-white text-center bg-gradient-to-r ${
              currentArena ? currentArena.color : 'from-purple-600 to-indigo-700'
            }`}>
              <h3 className="font-bold text-sm">
                {currentArena ? `🏟️ ${currentArena.company} Arena` : '⚔️ Trainer-Kampf'}
              </h3>
              <p className="text-xs text-white/80">{trainerName}</p>
              {currentArena && (
                <p className="text-xs text-white/60">Pokemon {arenaOpponentIndex + 1}/3</p>
              )}
            </div>

            {/* Battle Arena */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                {/* Player Pokemon */}
                <div className="text-center flex-1">
                  <p className={`text-[10px] mb-1 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>Du</p>
                  {pokemonInfo && (
                    <>
                      <img 
                        src={data?.isShiny ? pokemonInfo.shinySprite : pokemonInfo.spriteStatic}
                        alt={pokemonInfo.name}
                        className={`w-20 h-20 mx-auto ${playerHP <= 0 ? 'grayscale opacity-50' : ''} ${
                          battlePhase === 'fighting' ? 'animate-pulse' : ''
                        }`}
                      />
                      <p className={`text-xs font-bold mt-1 ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
                        {pokemonInfo.name} Lv.{data?.level}
                      </p>
                      <div className={`h-2 w-20 mx-auto rounded-full overflow-hidden mt-1 ${
                        istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div 
                          className={`h-full transition-all duration-300 ${
                            playerHP > 50 ? 'bg-green-500' : playerHP > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${playerHP}%` }}
                        />
                      </div>
                      <p className={`text-[10px] ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                        {playerHP}/100 HP
                      </p>
                    </>
                  )}
                </div>

                <span className={`text-2xl font-bold ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                  VS
                </span>

                {/* Opponent Pokemon */}
                <div className="text-center flex-1">
                  <p className={`text-[10px] mb-1 truncate px-1 ${istDunkel ? 'text-orange-400' : 'text-orange-600'}`}>
                    {trainerName.split(' ')[0]}
                  </p>
                  {opponent ? (
                    <>
                      <img 
                        src={opponent.spriteStatic}
                        alt={opponent.name}
                        className={`w-20 h-20 mx-auto ${opponentHP <= 0 ? 'grayscale opacity-50' : ''} ${
                          battlePhase === 'fighting' ? 'animate-pulse' : ''
                        }`}
                      />
                      <p className={`text-xs font-bold mt-1 ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
                        {opponent.name} Lv.{opponent.level}
                      </p>
                      <div className={`h-2 w-20 mx-auto rounded-full overflow-hidden mt-1 ${
                        istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div 
                          className={`h-full transition-all duration-300 ${
                            opponentHP > 50 ? 'bg-green-500' : opponentHP > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${opponentHP}%` }}
                        />
                      </div>
                      <p className={`text-[10px] ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                        {opponentHP}/100 HP
                      </p>
                    </>
                  ) : (
                    <div className="w-20 h-20 mx-auto animate-pulse bg-gray-600 rounded-full" />
                  )}
                </div>
              </div>

              {/* Battle Log */}
              <div className={`rounded-lg p-3 h-32 overflow-y-auto text-xs space-y-1 ${
                istDunkel ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                {battleLog.map((log, i) => (
                  <p key={i} className={`${
                    log.includes('🎉') ? 'text-green-400 font-bold' : 
                    log.includes('besiegt...') ? 'text-red-400' :
                    log.includes('+') && log.includes('XP') ? 'text-cyan-400' :
                    log.includes('-') && log.includes('XP') ? 'text-red-500 font-bold' :
                    log.includes('ARENA BESIEGT') || log.includes('Orden') ? 'text-yellow-400 font-bold' :
                    log.includes('Beeindruckend') || log.includes('nächstes Mal') || log.includes('Unglaublich') || log.includes('Trainiere mehr') ? 'text-orange-400 italic' :
                    log.includes('aufgetaucht') ? 'text-yellow-400 font-bold' :
                    log.includes('Arena!') ? 'text-orange-500 font-bold' :
                    log.includes('schickt') || log.includes('kämpft') ? 'text-purple-400' :
                    log.includes('✓') ? 'text-green-400' :
                    log.includes('Suche') || log.includes('Betrete') ? 'text-blue-400 animate-pulse' :
                    log.includes('Pokemon') && log.includes('/3') ? 'text-gray-400 text-[10px]' :
                    istDunkel ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {log}
                  </p>
                ))}
                {battlePhase === 'searching' && !currentArena && (
                  <p className="text-blue-400 animate-pulse">🔍 Suche Gegner...</p>
                )}
                {battlePhase === 'fighting' && (
                  <p className="text-yellow-400 animate-pulse">Kampf läuft...</p>
                )}
              </div>

              {/* Close Button */}
              {battlePhase === 'result' && (
                <button
                  onClick={closeBattle}
                  className="w-full mt-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:scale-105 transition-all"
                >
                  Schließen
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Move Learn Overlay */}
      {showMoveSelect && pendingMoveChoice && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl overflow-hidden ${
            istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 text-white text-center">
              <h3 className="font-bold">🎉 Neue Attacke!</h3>
              <p className="text-xs text-white/80">{pokemonInfo?.name} will {pendingMoveChoice.name} lernen!</p>
            </div>
            
            <div className="p-4">
              {/* Neue Attacke */}
              <div className={`p-3 rounded-lg mb-3 border-2 border-green-500 ${istDunkel ? 'bg-green-900/30' : 'bg-green-50'}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
                    {pendingMoveChoice.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${istDunkel ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {pendingMoveChoice.type}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                  {pendingMoveChoice.power > 0 
                    ? `Power: ${pendingMoveChoice.power} | ${pendingMoveChoice.damageClass}` 
                    : 'Status-Attacke'
                  }
                </p>
              </div>
              
              <p className={`text-sm mb-2 ${istDunkel ? 'text-gray-300' : 'text-gray-700'}`}>
                Welche Attacke vergessen?
              </p>
              
              {/* Bestehende Attacken */}
              {data.moves?.map((move, i) => (
                <button
                  key={i}
                  onClick={() => learnMove(i)}
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
              
              {/* Nicht lernen */}
              <button
                onClick={() => learnMove(-1)}
                className={`w-full p-2 rounded-lg text-sm ${
                  istDunkel ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                {pendingMoveChoice.name} nicht lernen
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}
