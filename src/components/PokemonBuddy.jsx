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

  // Starter wählen
  const selectStarter = (starter) => {
    const isShiny = Math.random() < 0.05
    
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
                  5% Shiny-Chance! ✨
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
    </>
  )
}
