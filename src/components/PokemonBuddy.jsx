import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

// Starter Pokemon mit ihren Evolutionsketten
const STARTER_POKEMON = [
  // Gen 1
  { id: 1, name: 'Bisasam', evolvesTo: 2, evolveLevel: 16 },
  { id: 4, name: 'Glumanda', evolvesTo: 5, evolveLevel: 16 },
  { id: 7, name: 'Schiggy', evolvesTo: 8, evolveLevel: 16 },
  { id: 25, name: 'Pikachu', evolvesTo: 26, evolveLevel: 20 },
  // Gen 2
  { id: 152, name: 'Endivie', evolvesTo: 153, evolveLevel: 16 },
  { id: 155, name: 'Feurigel', evolvesTo: 156, evolveLevel: 14 },
  { id: 158, name: 'Karnimani', evolvesTo: 159, evolveLevel: 18 },
  // Gen 3
  { id: 252, name: 'Geckarbor', evolvesTo: 253, evolveLevel: 16 },
  { id: 255, name: 'Flemmli', evolvesTo: 256, evolveLevel: 16 },
  { id: 258, name: 'Hydropi', evolvesTo: 259, evolveLevel: 16 },
  // Legendäre als Bonus
  { id: 133, name: 'Evoli', evolvesTo: null, evolveLevel: null }, // Special case
]

// Evolution chains (Pokemon ID -> Evolution ID -> Final Evolution ID)
const EVOLUTION_CHAINS = {
  1: [1, 2, 3],       // Bisasam -> Bisaknosp -> Bisaflor
  4: [4, 5, 6],       // Glumanda -> Glutexo -> Glurak
  7: [7, 8, 9],       // Schiggy -> Schillok -> Turtok
  25: [25, 26],       // Pikachu -> Raichu
  152: [152, 153, 154], // Endivie -> Lorblatt -> Meganie
  155: [155, 156, 157], // Feurigel -> Igelavar -> Tornupto
  158: [158, 159, 160], // Karnimani -> Tyracroc -> Impergator
  252: [252, 253, 254], // Geckarbor -> Reptain -> Gewaldro
  255: [255, 256, 257], // Flemmli -> Jungglut -> Lohgock
  258: [258, 259, 260], // Hydropi -> Moorabbel -> Sumpex
  133: [133, 134, 135, 136, 196, 197, 470, 471, 700], // Evoli -> Random Eeveelution
}

// Evolution levels for each stage
const EVOLUTION_LEVELS = {
  stage1: 0,   // Basis
  stage2: 16,  // Erste Evolution
  stage3: 36,  // Finale Evolution
}

// Aktivitäten
const ACTIVITIES = [
  { id: 'feed', name: 'Füttern', emoji: '🍎', xp: 5, cooldown: 30000, messages: ['Lecker!', '*mampf*', 'Danke!'] },
  { id: 'play', name: 'Spielen', emoji: '⚽', xp: 8, cooldown: 45000, messages: ['Juhu!', 'Nochmal!', 'Spaß!'] },
  { id: 'train', name: 'Training', emoji: '💪', xp: 15, cooldown: 120000, messages: ['Ich werde stärker!', 'Puh!', 'Yeah!'] },
  { id: 'pet', name: 'Streicheln', emoji: '💕', xp: 3, cooldown: 15000, messages: ['*freut sich*', '❤️', 'Mehr!'] },
  { id: 'battle', name: 'Kämpfen', emoji: '⚔️', xp: 20, cooldown: 180000, messages: ['Sieg!', 'Getroffen!', 'Stark!'] },
]

const getStoredData = () => {
  const stored = localStorage.getItem('pokemonBuddy')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

const xpForNextLevel = (level) => Math.floor(15 * Math.pow(1.4, level))

export default function PokemonBuddy() {
  const { istDunkel } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(getStoredData)
  const [pokemonInfo, setPokemonInfo] = useState(null)
  const [message, setMessage] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isEvolving, setIsEvolving] = useState(false)
  const [cooldownTimers, setCooldownTimers] = useState({})
  const [starterList, setStarterList] = useState([])
  const [isLoadingStarters, setIsLoadingStarters] = useState(false)

  // Pokemon-Daten von API laden
  const fetchPokemonData = async (pokemonId) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      const pokemon = await res.json()
      
      // Deutsche Namen holen
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
        stats: {
          hp: pokemon.stats[0].base_stat,
          attack: pokemon.stats[1].base_stat,
          defense: pokemon.stats[2].base_stat,
          speed: pokemon.stats[5].base_stat,
        },
        cry: pokemon.cries?.latest || null,
      }
    } catch (error) {
      console.error('Pokemon fetch error:', error)
      return null
    }
  }

  // Starter-Liste laden
  const loadStarters = async () => {
    setIsLoadingStarters(true)
    const starters = []
    for (const starter of STARTER_POKEMON) {
      const info = await fetchPokemonData(starter.id)
      if (info) {
        starters.push({ ...starter, ...info })
      }
    }
    setStarterList(starters)
    setIsLoadingStarters(false)
  }

  // Aktuelles Pokemon laden
  useEffect(() => {
    if (data?.pokemonId) {
      fetchPokemonData(data.pokemonId).then(info => {
        if (info) setPokemonInfo(info)
      })
    }
  }, [data?.pokemonId])

  // Speichern
  useEffect(() => {
    if (data) {
      localStorage.setItem('pokemonBuddy', JSON.stringify(data))
    }
  }, [data])

  // Besucher-Bonus
  useEffect(() => {
    if (!data) return
    const hoursSinceLastVisit = (Date.now() - data.lastVisit) / (1000 * 60 * 60)
    if (hoursSinceLastVisit > 1) {
      const bonusXP = Math.min(Math.floor(hoursSinceLastVisit * 3), 60)
      setData(prev => ({
        ...prev,
        xp: prev.xp + bonusXP,
        totalVisits: prev.totalVisits + 1,
        lastVisit: Date.now(),
      }))
      setMessage(`Willkommen zurück! +${bonusXP} XP!`)
    }
  }, [])

  // Level-Up & Evolution Check
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
      setTimeout(() => setIsAnimating(false), 1000)
      
      // Evolution prüfen
      checkEvolution(newLevel)
    }
  }, [data?.xp, data?.level])

  // Evolution Check
  const checkEvolution = async (newLevel) => {
    if (!data) return
    
    const chain = EVOLUTION_CHAINS[data.baseId]
    if (!chain) return
    
    const currentIndex = chain.indexOf(data.pokemonId)
    if (currentIndex === -1 || currentIndex >= chain.length - 1) return
    
    // Check if should evolve
    let shouldEvolve = false
    if (currentIndex === 0 && newLevel >= EVOLUTION_LEVELS.stage2) {
      shouldEvolve = true
    } else if (currentIndex === 1 && newLevel >= EVOLUTION_LEVELS.stage3) {
      shouldEvolve = true
    }
    
    // Special case for Evoli - random evolution at level 20
    if (data.baseId === 133 && newLevel >= 20 && currentIndex === 0) {
      const eeveelutions = [134, 135, 136, 196, 197, 470, 471, 700]
      const randomEvolution = eeveelutions[Math.floor(Math.random() * eeveelutions.length)]
      evolve(randomEvolution)
      return
    }
    
    if (shouldEvolve) {
      const nextPokemonId = chain[currentIndex + 1]
      evolve(nextPokemonId)
    }
  }

  const evolve = async (newPokemonId) => {
    setIsEvolving(true)
    setMessage('Was? Dein Pokemon entwickelt sich!')
    
    // Warte auf Animation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newInfo = await fetchPokemonData(newPokemonId)
    if (newInfo) {
      setData(prev => ({
        ...prev,
        pokemonId: newPokemonId,
      }))
      setPokemonInfo(newInfo)
      setMessage(`Glückwunsch! Es wurde zu ${newInfo.name}!`)
    }
    
    setIsEvolving(false)
  }

  // Cooldown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const newTimers = {}
      ACTIVITIES.forEach(activity => {
        const cooldownEnd = data?.cooldowns?.[activity.id] || 0
        if (cooldownEnd > now) {
          newTimers[activity.id] = Math.ceil((cooldownEnd - now) / 1000)
        }
      })
      setCooldownTimers(newTimers)
    }, 1000)
    return () => clearInterval(interval)
  }, [data?.cooldowns])

  // Aktivität ausführen
  const handleActivity = (activity) => {
    const now = Date.now()
    const cooldownEnd = data?.cooldowns?.[activity.id] || 0
    
    if (now < cooldownEnd) return

    setData(prev => ({
      ...prev,
      xp: prev.xp + activity.xp,
      cooldowns: {
        ...prev.cooldowns,
        [activity.id]: now + activity.cooldown,
      },
    }))

    const randomMessage = activity.messages[Math.floor(Math.random() * activity.messages.length)]
    setMessage(`${randomMessage} +${activity.xp} XP`)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Starter wählen
  const selectStarter = (starter) => {
    const isShiny = Math.random() < 0.05 // 5% Shiny Chance!
    
    setData({
      pokemonId: starter.id,
      baseId: starter.id,
      nickname: '',
      level: 1,
      xp: 0,
      isShiny,
      totalVisits: 1,
      lastVisit: Date.now(),
      cooldowns: {},
      createdAt: Date.now(),
    })
    
    if (isShiny) {
      setMessage(`WOW! Ein SHINY ${starter.name}! Du hast mega Glück!`)
    } else {
      setMessage(`${starter.name}, ich wähle dich!`)
    }
  }

  // Reset
  const resetPokemon = () => {
    if (confirm('Pokemon freilassen? Dein Fortschritt geht verloren!')) {
      localStorage.removeItem('pokemonBuddy')
      setData(null)
      setPokemonInfo(null)
      setMessage('')
      setStarterList([])
    }
  }

  const xpNeeded = data ? xpForNextLevel(data.level) : 0
  const xpProgress = data ? (data.xp / xpNeeded) * 100 : 0

  // Type colors
  const typeColors = {
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-400',
    psychic: 'bg-pink-500',
    ice: 'bg-cyan-300',
    dragon: 'bg-purple-600',
    dark: 'bg-gray-700',
    fairy: 'bg-pink-300',
    normal: 'bg-gray-400',
    fighting: 'bg-red-700',
    flying: 'bg-indigo-300',
    poison: 'bg-purple-500',
    ground: 'bg-amber-600',
    rock: 'bg-amber-800',
    bug: 'bg-lime-500',
    ghost: 'bg-purple-800',
    steel: 'bg-gray-500',
  }

  return (
    <>
      {/* Floating Button */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          25% { transform: rotate(3deg) scale(1.05); }
          50% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg) scale(1.05); }
        }
        @keyframes evolve-glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 10px white); }
          50% { filter: brightness(2) drop-shadow(0 0 30px white); }
        }
        .wiggle-animation {
          animation: wiggle 2s ease-in-out infinite;
        }
        .evolving {
          animation: evolve-glow 0.5s ease-in-out infinite;
        }
        .shiny-sparkle {
          filter: drop-shadow(0 0 8px gold) drop-shadow(0 0 15px yellow);
        }
      `}</style>
      
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!data && starterList.length === 0) {
            loadStarters()
          }
        }}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden ${
          isAnimating ? 'animate-bounce' : 'wiggle-animation'
        } ${
          istDunkel 
            ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/30' 
            : 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-400/30'
        }`}
        style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
        title={pokemonInfo ? pokemonInfo.name : 'Wähle dein Pokemon!'}
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

      {/* Pokemon Panel */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          istDunkel 
            ? 'bg-gray-900/95 border border-gray-700' 
            : 'bg-white/95 border border-gray-200'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-700 p-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                Pokemon Buddy
                {data?.isShiny && <span className="text-yellow-300 text-sm">✨ SHINY</span>}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            {pokemonInfo && (
              <p className="text-sm text-white/80">
                {data.nickname || pokemonInfo.name} • Lv. {data.level}
              </p>
            )}
          </div>

          {/* Body */}
          <div className="p-4">
            {!data ? (
              // Starter Auswahl
              <div>
                <p className={`text-center mb-4 font-medium ${istDunkel ? 'text-gray-200' : 'text-gray-700'}`}>
                  Wähle dein Starter-Pokemon!
                </p>
                {isLoadingStarters ? (
                  <div className="text-center py-8">
                    <div className="animate-spin text-4xl">🎮</div>
                    <p className={`mt-2 text-sm ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                      Lade Pokemon...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {starterList.map(starter => (
                      <button
                        key={starter.id}
                        onClick={() => selectStarter(starter)}
                        className={`p-2 rounded-lg transition-all hover:scale-110 flex flex-col items-center ${
                          istDunkel ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        title={starter.name}
                      >
                        <img 
                          src={starter.spriteStatic || starter.sprite} 
                          alt={starter.name}
                          className="w-12 h-12 object-contain"
                        />
                        <span className={`text-[10px] truncate w-full text-center ${
                          istDunkel ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {starter.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <p className={`text-center mt-3 text-xs ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                  5% Chance auf ein Shiny! ✨
                </p>
              </div>
            ) : (
              // Pokemon Display
              <>
                {/* Pokemon Sprite */}
                <div className={`text-center mb-4 ${isEvolving ? 'evolving' : isAnimating ? 'animate-bounce' : ''}`}>
                  {pokemonInfo ? (
                    <img 
                      src={data.isShiny ? pokemonInfo.shinySprite : (pokemonInfo.sprite || pokemonInfo.spriteStatic)}
                      alt={pokemonInfo.name}
                      className={`w-24 h-24 mx-auto object-contain ${data.isShiny ? 'shiny-sparkle' : ''}`}
                    />
                  ) : (
                    <div className="w-24 h-24 mx-auto animate-pulse bg-gray-300 rounded-full" />
                  )}
                  
                  {/* Types */}
                  {pokemonInfo && (
                    <div className="flex justify-center gap-1 mt-2">
                      {pokemonInfo.types.map(type => (
                        <span 
                          key={type}
                          className={`px-2 py-0.5 rounded text-[10px] text-white uppercase font-bold ${typeColors[type] || 'bg-gray-500'}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message */}
                {message && (
                  <div className={`text-center p-2 mb-4 rounded-lg text-sm ${
                    isEvolving 
                      ? 'bg-yellow-500/20 text-yellow-500 font-bold' 
                      : istDunkel ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'
                  }`}>
                    "{message}"
                  </div>
                )}

                {/* XP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>
                      XP: {data.xp}/{xpNeeded}
                    </span>
                    <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>
                      Level {data.level}
                    </span>
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden ${
                    istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </div>

                {/* Activities */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {ACTIVITIES.map(activity => {
                    const isOnCooldown = cooldownTimers[activity.id] > 0
                    return (
                      <button
                        key={activity.id}
                        onClick={() => handleActivity(activity)}
                        disabled={isOnCooldown || isEvolving}
                        title={`${activity.name} (+${activity.xp} XP)${isOnCooldown ? ` - ${cooldownTimers[activity.id]}s` : ''}`}
                        className={`p-2 rounded-lg text-2xl transition-all relative ${
                          isOnCooldown || isEvolving
                            ? 'opacity-40 cursor-not-allowed' 
                            : 'hover:scale-110 hover:bg-red-500/20 cursor-pointer'
                        } ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}
                      >
                        {activity.emoji}
                        {isOnCooldown && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-red-500 font-bold">
                            {cooldownTimers[activity.id]}s
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Stats */}
                {pokemonInfo && (
                  <div className={`text-xs grid grid-cols-2 gap-2 mb-3 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex justify-between">
                      <span>❤️ HP:</span>
                      <span className="font-medium">{pokemonInfo.stats.hp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⚔️ ATK:</span>
                      <span className="font-medium">{pokemonInfo.stats.attack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🛡️ DEF:</span>
                      <span className="font-medium">{pokemonInfo.stats.defense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💨 SPD:</span>
                      <span className="font-medium">{pokemonInfo.stats.speed}</span>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className={`text-xs space-y-1 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="flex justify-between">
                    <span>Besuche:</span>
                    <span className="font-medium">{data.totalVisits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tage zusammen:</span>
                    <span className="font-medium">
                      {Math.floor((Date.now() - data.createdAt) / (1000 * 60 * 60 * 24)) + 1}
                    </span>
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={resetPokemon}
                  className={`w-full mt-4 py-1 text-xs rounded ${
                    istDunkel 
                      ? 'text-gray-500 hover:text-red-400' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  Pokemon freilassen
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
