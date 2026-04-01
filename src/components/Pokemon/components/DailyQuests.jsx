// ============================================
// DAILY QUESTS COMPONENT
// ============================================

import { useContext } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'

export default function DailyQuests({ quests, progress, onClose }) {
  const { istDunkel } = useContext(ThemeContext)
  
  const completedCount = quests.filter(q => (progress[q.type] || 0) >= q.target).length
  
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-sm rounded-2xl overflow-hidden ${
        istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">📋 Tägliche Quests</h3>
            <span className="text-sm">{completedCount}/{quests.length}</span>
          </div>
          <p className="text-xs text-white/70 mt-1">
            Erneuern sich täglich um Mitternacht
          </p>
        </div>
        
        {/* Quests List */}
        <div className="p-4 space-y-3">
          {quests.map((quest, i) => {
            const currentProgress = progress[quest.type] || 0
            const isComplete = currentProgress >= quest.target
            const progressPercent = Math.min(100, (currentProgress / quest.target) * 100)
            
            return (
              <div
                key={quest.id || i}
                className={`p-3 rounded-lg relative overflow-hidden ${
                  isComplete
                    ? 'bg-green-500/20 border border-green-500/50'
                    : istDunkel
                      ? 'bg-gray-800'
                      : 'bg-gray-100'
                }`}
              >
                {/* Progress Background */}
                <div 
                  className={`absolute inset-0 transition-all ${
                    isComplete ? 'bg-green-500/10' : 'bg-cyan-500/10'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      isComplete 
                        ? 'text-green-400 line-through' 
                        : istDunkel ? 'text-white' : 'text-gray-900'
                    }`}>
                      {isComplete && '✓ '}{quest.description}
                    </p>
                    <p className={`text-xs mt-0.5 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                      {currentProgress}/{quest.target}
                    </p>
                  </div>
                  <div className={`text-right ${isComplete ? 'text-green-400' : 'text-cyan-400'}`}>
                    <p className="text-sm font-bold">+{quest.xp}</p>
                    <p className="text-[10px]">XP</p>
                  </div>
                </div>
              </div>
            )
          })}
          
          {quests.length === 0 && (
            <p className={`text-center py-4 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
              Keine Quests verfügbar
            </p>
          )}
        </div>
        
        {/* Close Button */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={onClose}
            className={`w-full py-2 rounded-lg text-sm font-medium ${
              istDunkel 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  )
}

// Compact Quest Display für Main UI
export function QuestBadge({ quests, progress, onClick }) {
  const { istDunkel } = useContext(ThemeContext)
  
  const completedCount = quests.filter(q => (progress[q.type] || 0) >= q.target).length
  const hasIncomplete = completedCount < quests.length
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
        hasIncomplete
          ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
          : 'bg-green-500/20 text-green-400'
      }`}
    >
      <span>📋</span>
      <span>{completedCount}/{quests.length}</span>
      {hasIncomplete && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
    </button>
  )
}
