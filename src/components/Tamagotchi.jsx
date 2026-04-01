import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

// Verschiedene Evolutionsstufen des Tamagotchi
const EVOLUTION_STAGES = [
  { name: 'Ei', emoji: '🥚', minLevel: 0 },
  { name: 'Baby', emoji: '🐣', minLevel: 1 },
  { name: 'Kind', emoji: '🐥', minLevel: 5 },
  { name: 'Teen', emoji: '🐤', minLevel: 10 },
  { name: 'Erwachsen', emoji: '🐔', minLevel: 20 },
  { name: 'Champion', emoji: '🦅', minLevel: 35 },
  { name: 'Legende', emoji: '🐉', minLevel: 50 },
  { name: 'Gott', emoji: '👑', minLevel: 100 },
]

// Aktivitäten die XP geben
const ACTIVITIES = [
  { id: 'feed', name: 'Füttern', emoji: '🍕', xp: 5, cooldown: 30000, message: 'Lecker! *mampf mampf*' },
  { id: 'play', name: 'Spielen', emoji: '🎮', xp: 8, cooldown: 45000, message: 'Das macht Spaß!' },
  { id: 'pet', name: 'Streicheln', emoji: '💕', xp: 3, cooldown: 15000, message: '*schnurr*' },
  { id: 'train', name: 'Training', emoji: '💪', xp: 15, cooldown: 120000, message: 'Ich werde stärker!' },
  { id: 'sleep', name: 'Schlafen', emoji: '😴', xp: 10, cooldown: 180000, message: 'zzZZzz...' },
]

// Zufällige Nachrichten
const IDLE_MESSAGES = [
  'Hallo! Ich bin dein Portfolio-Buddy!',
  'Schau dir Eerajs Projekte an!',
  'Ich liebe es hier zu sein!',
  '*hüpft fröhlich herum*',
  'Komm bald wieder!',
  'Du bist toll!',
  'Eeraj ist ein cooler Entwickler!',
  '*winkt*',
]

const getStoredData = () => {
  const stored = localStorage.getItem('tamagotchi')
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    name: '',
    xp: 0,
    level: 0,
    totalVisits: 1,
    lastVisit: Date.now(),
    cooldowns: {},
    createdAt: Date.now(),
    happiness: 100,
  }
}

const getCurrentStage = (level) => {
  for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
    if (level >= EVOLUTION_STAGES[i].minLevel) {
      return EVOLUTION_STAGES[i]
    }
  }
  return EVOLUTION_STAGES[0]
}

const xpForNextLevel = (level) => Math.floor(10 * Math.pow(1.5, level))

export default function Tamagotchi() {
  const { istDunkel } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(getStoredData)
  const [message, setMessage] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showNameInput, setShowNameInput] = useState(!data.name)
  const [nameInput, setNameInput] = useState('')
  const [cooldownTimers, setCooldownTimers] = useState({})

  // Speichern bei Änderungen
  useEffect(() => {
    localStorage.setItem('tamagotchi', JSON.stringify(data))
  }, [data])

  // Besucher-Bonus bei Wiederkehr
  useEffect(() => {
    const hoursSinceLastVisit = (Date.now() - data.lastVisit) / (1000 * 60 * 60)
    if (hoursSinceLastVisit > 1) {
      const bonusXP = Math.min(Math.floor(hoursSinceLastVisit * 2), 50)
      setData(prev => ({
        ...prev,
        xp: prev.xp + bonusXP,
        totalVisits: prev.totalVisits + 1,
        lastVisit: Date.now(),
      }))
      setMessage(`Willkommen zurück! +${bonusXP} XP Bonus!`)
    }
  }, [])

  // Level-Up Check
  useEffect(() => {
    const xpNeeded = xpForNextLevel(data.level)
    if (data.xp >= xpNeeded) {
      setData(prev => ({
        ...prev,
        level: prev.level + 1,
        xp: prev.xp - xpNeeded,
      }))
      setMessage(`LEVEL UP! Level ${data.level + 1}!`)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [data.xp, data.level])

  // Cooldown Timer updaten
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const newTimers = {}
      ACTIVITIES.forEach(activity => {
        const cooldownEnd = data.cooldowns[activity.id] || 0
        if (cooldownEnd > now) {
          newTimers[activity.id] = Math.ceil((cooldownEnd - now) / 1000)
        }
      })
      setCooldownTimers(newTimers)
    }, 1000)
    return () => clearInterval(interval)
  }, [data.cooldowns])

  // Zufällige Idle-Nachrichten
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setMessage(IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)])
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [isOpen])

  const handleActivity = (activity) => {
    const now = Date.now()
    const cooldownEnd = data.cooldowns[activity.id] || 0
    
    if (now < cooldownEnd) return

    setData(prev => ({
      ...prev,
      xp: prev.xp + activity.xp,
      happiness: Math.min(prev.happiness + 5, 100),
      cooldowns: {
        ...prev.cooldowns,
        [activity.id]: now + activity.cooldown,
      },
    }))

    setMessage(`${activity.message} +${activity.xp} XP`)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (nameInput.trim()) {
      setData(prev => ({ ...prev, name: nameInput.trim() }))
      setShowNameInput(false)
      setMessage(`Hallo! Ich bin ${nameInput.trim()}!`)
    }
  }

  const resetPet = () => {
    if (confirm('Wirklich neu starten? Dein Fortschritt geht verloren!')) {
      const newData = {
        name: '',
        xp: 0,
        level: 0,
        totalVisits: 1,
        lastVisit: Date.now(),
        cooldowns: {},
        createdAt: Date.now(),
        happiness: 100,
      }
      setData(newData)
      setShowNameInput(true)
      setMessage('')
    }
  }

  const stage = getCurrentStage(data.level)
  const xpNeeded = xpForNextLevel(data.level)
  const xpProgress = (data.xp / xpNeeded) * 100
  const nextStage = EVOLUTION_STAGES.find(s => s.minLevel > data.level)

  return (
    <>
      {/* Floating Button mit Wackel-Animation */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          25% { transform: rotate(3deg) scale(1.05); }
          50% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg) scale(1.05); }
        }
        @keyframes wiggle-strong {
          0%, 100% { transform: rotate(-5deg) scale(1); }
          20% { transform: rotate(5deg) scale(1.1); }
          40% { transform: rotate(-5deg) scale(1); }
          60% { transform: rotate(5deg) scale(1.1); }
          80% { transform: rotate(-5deg) scale(1); }
        }
        .wiggle-animation {
          animation: wiggle 2s ease-in-out infinite;
        }
        .wiggle-animation:hover {
          animation: wiggle-strong 0.5s ease-in-out;
        }
      `}</style>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center text-3xl ${
          isAnimating ? 'animate-bounce' : 'wiggle-animation'
        } ${
          istDunkel 
            ? 'bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-orange-500/30' 
            : 'bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-300 hover:to-red-400 shadow-orange-400/30'
        }`}
        style={{ boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)' }}
        title="Portfolio Buddy - Klick mich!"
      >
        {stage.emoji}
      </button>

      {/* Tamagotchi Panel */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          istDunkel 
            ? 'bg-gray-900/95 border border-gray-700' 
            : 'bg-white/95 border border-gray-200'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Portfolio Buddy</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            {data.name && (
              <p className="text-sm text-white/80">
                {data.name} der {stage.name}
              </p>
            )}
          </div>

          {/* Body */}
          <div className="p-4">
            {showNameInput ? (
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <div className="text-center text-6xl mb-4 animate-pulse">🥚</div>
                <p className={`text-center ${istDunkel ? 'text-gray-300' : 'text-gray-600'}`}>
                  Gib deinem neuen Freund einen Namen!
                </p>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Name eingeben..."
                  maxLength={15}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    istDunkel 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!nameInput.trim()}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium disabled:opacity-50 hover:from-orange-400 hover:to-red-500 transition-all"
                >
                  Los geht's!
                </button>
              </form>
            ) : (
              <>
                {/* Pet Display */}
                <div className={`text-center mb-4 ${isAnimating ? 'animate-bounce' : ''}`}>
                  <div className="text-7xl mb-2">{stage.emoji}</div>
                  <p className={`text-sm font-medium ${istDunkel ? 'text-gray-300' : 'text-gray-600'}`}>
                    Level {data.level} {stage.name}
                  </p>
                </div>

                {/* Message Bubble */}
                {message && (
                  <div className={`text-center p-2 mb-4 rounded-lg text-sm ${
                    istDunkel ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'
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
                    {nextStage && (
                      <span className={istDunkel ? 'text-gray-400' : 'text-gray-500'}>
                        Nächste Evolution: Lv.{nextStage.minLevel}
                      </span>
                    )}
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden ${
                    istDunkel ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
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
                        disabled={isOnCooldown}
                        title={`${activity.name} (+${activity.xp} XP)${isOnCooldown ? ` - ${cooldownTimers[activity.id]}s` : ''}`}
                        className={`p-2 rounded-lg text-2xl transition-all relative ${
                          isOnCooldown 
                            ? 'opacity-40 cursor-not-allowed' 
                            : 'hover:scale-110 hover:bg-orange-500/20 cursor-pointer'
                        } ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}
                      >
                        {activity.emoji}
                        {isOnCooldown && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-orange-500 font-bold">
                            {cooldownTimers[activity.id]}s
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Stats */}
                <div className={`text-xs space-y-1 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="flex justify-between">
                    <span>Besuche insgesamt:</span>
                    <span className="font-medium">{data.totalVisits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tage zusammen:</span>
                    <span className="font-medium">
                      {Math.floor((Date.now() - data.createdAt) / (1000 * 60 * 60 * 24)) + 1}
                    </span>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetPet}
                  className={`w-full mt-4 py-1 text-xs rounded ${
                    istDunkel 
                      ? 'text-gray-500 hover:text-red-400' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  Neu starten
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
