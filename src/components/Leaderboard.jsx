// ============================================
// LEADERBOARD COMPONENT
// Shows top trainers globally
// ============================================

import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import { subscribeToLeaderboard } from '../firebase'

export default function Leaderboard() {
  const { istDunkel } = useContext(ThemeContext)
  const [trainers, setTrainers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  
  useEffect(() => {
    setIsLoading(true)
    
    // Timeout falls Firebase nicht antwortet
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    
    const unsubscribe = subscribeToLeaderboard((data) => {
      clearTimeout(timeout)
      setTrainers(data)
      setIsLoading(false)
    }, 10)
    
    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])
  
  // Get medal emoji for top 3
  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}.`
  }
  
  // Get starter emoji
  const getStarterEmoji = (pokemonId) => {
    const starters = {
      1: '🌱', 4: '🔥', 7: '💧', // Gen 1
      25: '⚡', 133: '🦊', 143: '😴', // Special
      152: '🍃', 155: '🔥', 158: '🐊', // Gen 2
    }
    return starters[pokemonId] || '🎮'
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`fixed bottom-6 left-6 z-40 px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 ${
          istDunkel 
            ? 'bg-gray-800 text-white border border-gray-700 hover:border-orange-500' 
            : 'bg-white text-gray-900 border border-gray-200 hover:border-orange-500'
        }`}
      >
        <span>🏆</span>
        <span className="text-sm font-medium">Ranking</span>
        {trainers.length > 0 && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            istDunkel ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
          }`}>
            {trainers.length}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className={`w-72 rounded-2xl shadow-2xl overflow-hidden ${
        istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 text-white">
          <div className="flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <span>🏆</span> Trainer-Ranking
            </h3>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-white/80 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-white/70">Top 10 Trainer weltweit</p>
        </div>
        
        {/* Content */}
        <div className="p-3 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-2xl mb-2">🏆</div>
              <p className={`text-xs ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                Lade Ranking...
              </p>
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">🎮</div>
              <p className={`text-sm ${istDunkel ? 'text-gray-400' : 'text-gray-600'}`}>
                Noch keine Trainer registriert
              </p>
              <p className={`text-xs mt-1 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                Sei der Erste!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {trainers.map((trainer, index) => (
                <div 
                  key={trainer.id}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                    index === 0 
                      ? istDunkel ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
                      : index === 1
                        ? istDunkel ? 'bg-gray-500/20 border border-gray-500/30' : 'bg-gray-50 border border-gray-200'
                        : index === 2
                          ? istDunkel ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
                          : istDunkel ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}
                >
                  {/* Rank */}
                  <span className={`w-8 text-center font-bold ${
                    index < 3 ? 'text-lg' : 'text-sm'
                  } ${istDunkel ? 'text-gray-300' : 'text-gray-600'}`}>
                    {getMedal(index)}
                  </span>
                  
                  {/* Trainer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{getStarterEmoji(trainer.pokemonId)}</span>
                      <span className={`font-medium truncate ${
                        istDunkel ? 'text-white' : 'text-gray-900'
                      }`}>
                        {trainer.name}
                      </span>
                      {trainer.isShiny && <span className="text-yellow-400">✨</span>}
                    </div>
                    <div className={`text-[10px] flex items-center gap-2 ${
                      istDunkel ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <span>Lv.{trainer.level || 1}</span>
                      <span>•</span>
                      <span>{trainer.wins || 0}W/{trainer.losses || 0}L</span>
                      {trainer.defeatedArenas?.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{trainer.defeatedArenas.length}🏟️</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className={`text-right ${
                    index === 0 ? 'text-yellow-500' : istDunkel ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                    <span className="text-sm font-bold">{trainer.score?.toLocaleString() || 0}</span>
                    <p className={`text-[9px] ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>Punkte</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className={`p-2 text-center border-t ${
          istDunkel ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'
        }`}>
          <p className="text-[10px]">
            Updates in Echtzeit • Powered by Firebase
          </p>
        </div>
      </div>
    </div>
  )
}
