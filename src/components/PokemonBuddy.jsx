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
  
  // Battle states
  const [isBattling, setIsBattling] = useState(false)
  const [canBattle, setCanBattle] = useState(true)
  const [opponent, setOpponent] = useState(null)
  const [trainerName, setTrainerName] = useState('')
  const [battleLog, setBattleLog] = useState([])
  const [battlePhase, setBattlePhase] = useState('idle') // idle, intro, fighting, result
  const [playerHP, setPlayerHP] = useState(100)
  const [opponentHP, setOpponentHP] = useState(100)

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

  // Scroll XP - alle 25% der Seite = +5 XP
  useEffect(() => {
    if (!data) return
    
    let lastMilestone = 0
    
    const handleScroll = () => {
      const scrollPercent = Math.floor(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      
      // Alle 25% ein Milestone
      const currentMilestone = Math.floor(scrollPercent / 25)
      
      if (currentMilestone > lastMilestone && currentMilestone <= 4) {
        lastMilestone = currentMilestone
        giveXP(5, `${currentMilestone * 25}% gescrollt`)
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

  // Pokemon-Daten laden
  const fetchPokemonData = async (pokemonId) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      const pokemon = await res.json()
      
      const speciesRes = await fetch(pokemon.species.url)
      const species = await speciesRes.json()
      const germanName = species.names.find(n => n.language.name === 'de')?.name || pokemon.name
      
      return {
        id: pokemon.id,
        name: germanName,
        sprite: pokemon.sprites.versions['generation-v']['black-white'].animated?.front_default 
          || pokemon.sprites.front_default,
        spriteStatic: pokemon.sprites.front_default,
        shinySprite: pokemon.sprites.front_shiny,
        types: pokemon.types.map(t => t.type.name),
      }
    } catch (error) {
      console.error('Pokemon fetch error:', error)
      return null
    }
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
    }
  }, [data?.xp])

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

  const runBattle = async (opponentInfo, opponentLevel, trainer) => {
    // Kampfkraft basiert stark auf Level - höheres Level = mehr Schaden & weniger einstecken
    const levelDiff = data.level - opponentLevel
    
    let pHP = 100
    let oHP = 100
    const logs = [
      `${trainer} ist aufgetaucht!`,
      `${trainer} schickt ${opponentInfo.name} (Lv.${opponentLevel})!`
    ]
    
    // Simuliere 3-5 Runden
    const rounds = 3 + Math.floor(Math.random() * 3)
    
    for (let i = 0; i < rounds && pHP > 0 && oHP > 0; i++) {
      await new Promise(r => setTimeout(r, 800))
      
      // Spieler greift an - Schaden basiert auf Level
      // Basis 10-20, plus 3 pro Level, plus Bonus wenn höheres Level
      const playerBaseDmg = 10 + Math.random() * 10
      const playerLevelBonus = data.level * 3
      const playerAdvantage = levelDiff > 0 ? levelDiff * 5 : 0
      const playerDmg = Math.floor(playerBaseDmg + playerLevelBonus + playerAdvantage)
      oHP = Math.max(0, oHP - playerDmg)
      logs.push(`${pokemonInfo.name} greift an! -${playerDmg} HP`)
      setBattleLog([...logs])
      setOpponentHP(oHP)
      
      if (oHP <= 0) break
      
      await new Promise(r => setTimeout(r, 600))
      
      // Gegner greift an - stärker wenn höheres Level
      const opponentBaseDmg = 10 + Math.random() * 10
      const opponentLevelBonus = opponentLevel * 3
      const opponentAdvantage = levelDiff < 0 ? Math.abs(levelDiff) * 5 : 0
      const opponentDmg = Math.floor(opponentBaseDmg + opponentLevelBonus + opponentAdvantage)
      pHP = Math.max(0, pHP - opponentDmg)
      logs.push(`${opponentInfo.name} greift an! -${opponentDmg} HP`)
      setBattleLog([...logs])
      setPlayerHP(pHP)
    }
    
    await new Promise(r => setTimeout(r, 500))
    
    // Ergebnis: Wer hat mehr HP? Bei Gleichstand gewinnt höheres Level
    let playerWins = false
    if (oHP <= 0) {
      playerWins = true
    } else if (pHP <= 0) {
      playerWins = false
    } else {
      // Beide leben noch - wer hat mehr HP?
      if (pHP > oHP) {
        playerWins = true
      } else if (oHP > pHP) {
        playerWins = false
      } else {
        // Gleichstand: höheres Level gewinnt
        playerWins = data.level >= opponentLevel
      }
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
  }

  // Starter wählen
  const selectStarter = (starter) => {
    const isShiny = Math.random() < 0.10 // 10% Shiny-Chance
    
    const newData = {
      pokemonId: starter.id,
      baseId: starter.id,
      level: 1,
      xp: 0,
      isShiny,
      totalVisits: 1,
      lastVisit: Date.now(),
      createdAt: Date.now(),
    }
    
    setData(newData)
    setMessage(isShiny ? `WOW! Ein SHINY ${starter.name}!` : `${starter.name}, ich wähle dich!`)
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
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!data && starterList.length === 0) loadStarters()
        }}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
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
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">×</button>
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
                {isLoadingStarters ? (
                  <div className="text-center py-6">
                    <div className="animate-spin text-3xl">🎮</div>
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

                {/* Info */}
                <div className={`mt-3 text-xs space-y-1 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
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
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-3 text-white text-center">
              <h3 className="font-bold text-sm">⚔️ Trainer-Kampf</h3>
              <p className="text-xs text-white/80">{trainerName}</p>
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
                    log.includes('Beeindruckend') || log.includes('nächstes Mal') ? 'text-orange-400 italic' :
                    log.includes('aufgetaucht') ? 'text-yellow-400 font-bold' :
                    log.includes('schickt') ? 'text-purple-400' :
                    log.includes('Suche') ? 'text-blue-400 animate-pulse' :
                    istDunkel ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {log}
                  </p>
                ))}
                {battlePhase === 'searching' && (
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
    </>
  )
}
