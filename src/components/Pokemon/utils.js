// ============================================
// POKEMON GAME UTILITIES
// ============================================

import { TYPE_EFFECTIVENESS, EVOLUTION_CHAINS, EVOLUTION_LEVELS } from './constants'

/**
 * Berechne Typ-Effektivität zwischen Attacke und Verteidiger
 * @returns Multiplikator (0, 0.5, 1, 2, 4)
 */
export const getTypeEffectiveness = (attackType, defenderTypes) => {
  let multiplier = 1
  
  for (const defType of defenderTypes) {
    const effectiveness = TYPE_EFFECTIVENESS[attackType]?.[defType]
    if (effectiveness !== undefined) {
      multiplier *= effectiveness
    }
  }
  
  return multiplier
}

/**
 * Beschreibung der Effektivität
 */
export const getEffectivenessText = (multiplier) => {
  if (multiplier === 0) return { text: 'Kein Effekt!', color: 'text-gray-500' }
  if (multiplier < 1) return { text: 'Nicht sehr effektiv...', color: 'text-orange-400' }
  if (multiplier > 1) return { text: 'Sehr effektiv!', color: 'text-green-400' }
  return { text: '', color: '' }
}

/**
 * Berechne effektive Stats basierend auf Level, Moves und Shiny-Status
 */
export const calculateEffectiveStats = (baseStats, level, moves = [], isShiny = false) => {
  if (!baseStats) return { hp: 50, attack: 50, defense: 50, spAttack: 50, spDefense: 50, speed: 50, total: 300 }
  
  // Level-Multiplikator (wie im echten Pokemon)
  const levelMultiplier = 1 + (level * 0.02)
  
  const stats = {
    hp: Math.floor(baseStats.hp * levelMultiplier),
    attack: Math.floor(baseStats.attack * levelMultiplier),
    defense: Math.floor(baseStats.defense * levelMultiplier),
    spAttack: Math.floor(baseStats.spAttack * levelMultiplier),
    spDefense: Math.floor(baseStats.spDefense * levelMultiplier),
    speed: Math.floor(baseStats.speed * levelMultiplier),
  }
  
  // Move-Boosts anwenden
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
    // Damage Moves addieren ihre Power
    if (move.power > 0) {
      if (move.damageClass === 'physical') {
        stats.attack += Math.floor(move.power * 0.2)
      } else if (move.damageClass === 'special') {
        stats.spAttack += Math.floor(move.power * 0.2)
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

/**
 * Berechne Schaden einer Attacke (echte Pokemon-Formel vereinfacht)
 */
export const calculateDamage = (attacker, defender, move, attackerLevel, defenderLevel) => {
  if (!move || move.power === 0) return 0
  
  // Welcher Angriffs-/Verteidigungs-Stat?
  const isPhysical = move.damageClass === 'physical'
  const attack = isPhysical ? attacker.attack : attacker.spAttack
  const defense = isPhysical ? defender.defense : defender.spDefense
  
  // Basis-Schadensformel (vereinfacht von der echten Formel)
  const levelFactor = ((2 * attackerLevel / 5) + 2)
  const baseDamage = ((levelFactor * move.power * (attack / defense)) / 50) + 2
  
  // Typ-Effektivität
  const typeMultiplier = getTypeEffectiveness(move.type, defender.types || [])
  
  // STAB (Same Type Attack Bonus) - +50% wenn Attacken-Typ = Pokemon-Typ
  const stab = attacker.types?.includes(move.type) ? 1.5 : 1
  
  // Kritischer Treffer (6.25% Chance)
  const critical = Math.random() < 0.0625 ? 1.5 : 1
  
  // Zufalls-Variation (85-100%)
  const random = 0.85 + Math.random() * 0.15
  
  // Genauigkeit
  const accuracyCheck = Math.random() * 100 < (move.accuracy || 100)
  if (!accuracyCheck) return { damage: 0, missed: true }
  
  const finalDamage = Math.floor(baseDamage * typeMultiplier * stab * critical * random)
  
  return {
    damage: Math.max(1, finalDamage), // Mindestens 1 Schaden
    typeMultiplier,
    critical: critical > 1,
    missed: false,
  }
}

/**
 * Berechne HP-Prozent für Anzeige
 */
export const calculateHPPercent = (currentHP, maxHP) => {
  return Math.max(0, Math.min(100, (currentHP / maxHP) * 100))
}

/**
 * HP-Balken Farbe basierend auf Prozent
 */
export const getHPBarColor = (percent) => {
  if (percent > 50) return 'bg-green-500'
  if (percent > 20) return 'bg-yellow-500'
  return 'bg-red-500'
}

/**
 * Prüfe ob Evolution möglich ist
 */
export const checkEvolutionPossible = (baseId, currentId, newLevel) => {
  const chain = EVOLUTION_CHAINS[baseId]
  if (!chain) return null
  
  const currentIndex = chain.indexOf(currentId)
  if (currentIndex === -1 || currentIndex >= chain.length - 1) return null
  
  // Evoli spezial: Zufällige Evolution ab Level 20
  if (baseId === 133 && newLevel >= 20 && currentIndex === 0) {
    const eeveelutions = [134, 135, 136, 196, 197, 470, 471, 700]
    return eeveelutions[Math.floor(Math.random() * eeveelutions.length)]
  }
  
  // Normale Evolution
  if (currentIndex === 0 && newLevel >= EVOLUTION_LEVELS.stage2) {
    return chain[1]
  }
  if (currentIndex === 1 && newLevel >= EVOLUTION_LEVELS.stage3) {
    return chain[2]
  }
  
  return null
}

/**
 * Fang-Wahrscheinlichkeit berechnen
 */
export const calculateCatchRate = (pokemon, currentHP, maxHP, ballMultiplier = 1) => {
  // Basis Catch Rate aus Pokemon-Daten (0-255)
  const baseCatchRate = pokemon.catchRate || 45
  
  // HP-Faktor: Je weniger HP, desto leichter zu fangen
  const hpFactor = (3 * maxHP - 2 * currentHP) / (3 * maxHP)
  
  // Berechnung (vereinfacht)
  const catchProbability = (baseCatchRate / 255) * hpFactor * ballMultiplier
  
  return Math.min(0.95, Math.max(0.05, catchProbability)) // 5-95% Range
}

/**
 * Zufällige Nachricht auswählen
 */
export const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Formatiere Zahl mit Tausender-Trennzeichen
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Berechne Zeit-String (z.B. "vor 2 Stunden")
 */
export const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return 'gerade eben'
  if (seconds < 3600) return `vor ${Math.floor(seconds / 60)} Min.`
  if (seconds < 86400) return `vor ${Math.floor(seconds / 3600)} Std.`
  return `vor ${Math.floor(seconds / 86400)} Tagen`
}

/**
 * Generiere eine eindeutige ID
 */
export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
