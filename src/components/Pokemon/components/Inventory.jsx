// ============================================
// INVENTORY COMPONENT
// ============================================

import { useContext } from 'react'
import { ThemeContext } from '../../../Context/ThemeContext'
import { ITEMS } from '../constants'

export default function Inventory({ inventory, onUseItem, onBuyItem, compact = false }) {
  const { istDunkel } = useContext(ThemeContext)
  
  const items = Object.entries(inventory || {})
    .filter(([key, count]) => key !== 'coins' && count > 0 && ITEMS[key])
    .map(([key, count]) => ({ ...ITEMS[key], count }))
  
  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
        <span>💰 {inventory?.coins || 0}</span>
        <span>🔴 {inventory?.pokeball || 0}</span>
        <span>🧪 {inventory?.potion || 0}</span>
      </div>
    )
  }
  
  return (
    <div className={`p-3 rounded-lg ${istDunkel ? 'bg-gray-800' : 'bg-gray-100'}`}>
      {/* Coins Header */}
      <div className="flex items-center justify-between mb-3">
        <p className={`text-sm font-medium ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
          🎒 Inventar
        </p>
        <span className={`text-sm font-bold ${istDunkel ? 'text-yellow-400' : 'text-yellow-600'}`}>
          💰 {inventory?.coins || 0}
        </span>
      </div>
      
      {items.length === 0 ? (
        <p className={`text-xs text-center py-2 ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
          Keine Items vorhanden
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onUseItem?.(item.id)}
              disabled={!onUseItem}
              className={`p-2 rounded-lg text-left transition-all ${
                onUseItem 
                  ? istDunkel 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                  : istDunkel 
                    ? 'bg-gray-700/50' 
                    : 'bg-gray-200/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{item.emoji}</span>
                <span className={`text-xs font-bold ${istDunkel ? 'text-gray-300' : 'text-gray-600'}`}>
                  x{item.count}
                </span>
              </div>
              <p className={`text-[10px] mt-1 ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.name}
              </p>
            </button>
          ))}
        </div>
      )}
      
      {/* Shop Button */}
      {onBuyItem && (
        <button
          onClick={onBuyItem}
          className={`w-full mt-3 py-2 rounded-lg text-xs font-medium transition-all ${
            istDunkel 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-[1.02]' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-[1.02]'
          }`}
        >
          🛒 Shop öffnen
        </button>
      )}
    </div>
  )
}

// Shop Component
export function Shop({ inventory, onBuy, onClose }) {
  const { istDunkel } = useContext(ThemeContext)
  
  const shopItems = [
    ITEMS.pokeball,
    ITEMS.greatball,
    ITEMS.potion,
    ITEMS.superPotion,
    ITEMS.xAttack,
    ITEMS.berry,
  ]
  
  const coins = inventory?.coins || 0
  
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-sm rounded-2xl overflow-hidden ${
        istDunkel ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">🛒 Pokémon Shop</h3>
            <span className="text-yellow-300 font-bold">💰 {coins}</span>
          </div>
        </div>
        
        <div className="p-4 max-h-80 overflow-y-auto">
          <div className="space-y-2">
            {shopItems.map(item => {
              const canAfford = coins >= item.price
              
              return (
                <button
                  key={item.id}
                  onClick={() => canAfford && onBuy(item.id, item.price)}
                  disabled={!canAfford}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                    canAfford
                      ? istDunkel 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-100 hover:bg-gray-200'
                      : istDunkel
                        ? 'bg-gray-800/50 opacity-50'
                        : 'bg-gray-100/50 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                      <p className={`text-[10px] ${istDunkel ? 'text-gray-500' : 'text-gray-400'}`}>
                        {item.effect === 'heal' && `+${item.value} HP`}
                        {item.effect === 'catch' && `${item.value}x Fangrate`}
                        {item.effect === 'boost' && `${item.stat} +${((item.value - 1) * 100)}%`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${
                    canAfford ? 'text-yellow-500' : istDunkel ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    💰 {item.price}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        
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
