// ============================================
// POKEMON GAME UTILITIES
// ============================================

import { TYPE_EFFECTIVENESS, EVOLUTION_CHAINS, EVOLUTION_LEVELS, IV_RANGE, NATURES, PERSONALITIES } from './constants'

// ============================================
// IV, NATURE & PERSONALITY GENERATION
// ============================================

/**
 * Generate random IVs for a Pokemon (0-31 for each stat)
 */
export const generateIVs = () => {
  const stats = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed']
  const ivs = {}
  let total = 0
  
  stats.forEach(stat => {
    const iv = Math.floor(Math.random() * (IV_RANGE.max - IV_RANGE.min + 1)) + IV_RANGE.min
    ivs[stat] = iv
    total += iv
  })
  
  ivs.total = total
  ivs.potential = total >= 150 ? 'Outstanding' : total >= 120 ? 'Great' : total >= 90 ? 'Good' : 'Decent'
  
  return ivs
}

/**
 * Get a random Nature
 */
export const getRandomNature = () => {
  const natureKeys = Object.keys(NATURES)
  const randomKey = natureKeys[Math.floor(Math.random() * natureKeys.length)]
  return { key: randomKey, ...NATURES[randomKey] }
}

/**
 * Get a random Personality
 */
export const getRandomPersonality = () => {
  return PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
}

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
 * Berechne effektive Stats basierend auf Level, Moves, IVs, Nature, Personality und Shiny-Status
 * This also calculates POWER SCORE used in auto-battles
 */
export const calculateEffectiveStats = (baseStats, level, pokemon = {}) => {
  const { moves = [], isShiny = false, ivs = null, nature = null, personality = null } = pokemon
  
  if (!baseStats) return { hp: 50, attack: 50, defense: 50, spAttack: 50, spDefense: 50, speed: 50, total: 300, powerScore: 100 }
  
  // Level-Multiplikator (wie im echten Pokemon)
  const levelMultiplier = 1 + (level * 0.02)
  
  // Base stats with level scaling
  const stats = {
    hp: Math.floor(baseStats.hp * levelMultiplier),
    attack: Math.floor(baseStats.attack * levelMultiplier),
    defense: Math.floor(baseStats.defense * levelMultiplier),
    spAttack: Math.floor(baseStats.spAttack * levelMultiplier),
    spDefense: Math.floor(baseStats.spDefense * levelMultiplier),
    speed: Math.floor(baseStats.speed * levelMultiplier),
  }
  
  // Apply IVs (0-31 bonus per stat, scaled)
  if (ivs) {
    stats.hp += Math.floor(ivs.hp * 0.5)
    stats.attack += Math.floor(ivs.attack * 0.5)
    stats.defense += Math.floor(ivs.defense * 0.5)
    stats.spAttack += Math.floor(ivs.spAttack * 0.5)
    stats.spDefense += Math.floor(ivs.spDefense * 0.5)
    stats.speed += Math.floor(ivs.speed * 0.5)
  }
  
  // Apply Nature (+10% one stat, -10% another)
  if (nature) {
    if (nature.up && stats[nature.up]) {
      stats[nature.up] = Math.floor(stats[nature.up] * 1.1)
    }
    if (nature.down && stats[nature.down]) {
      stats[nature.down] = Math.floor(stats[nature.down] * 0.9)
    }
  }
  
  // Apply Personality bonus
  if (personality && personality.bonusStat && stats[personality.bonusStat]) {
    stats[personality.bonusStat] += personality.bonus
  }
  
  // Move-Boosts anwenden
  let movePowerBonus = 0
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
    // Each move adds to the Power Score
    if (move.power > 0) {
      movePowerBonus += Math.floor(move.power * 0.3)
      if (move.damageClass === 'physical') {
        stats.attack += Math.floor(move.power * 0.15)
      } else if (move.damageClass === 'special') {
        stats.spAttack += Math.floor(move.power * 0.15)
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
  
  // ============================================
  // POWER SCORE CALCULATION (für Auto-Battle)
  // ============================================
  // Power Score = Base Stats + Level Bonus + IV Bonus + Move Bonus + Shiny Bonus
  const baseScore = stats.total
  const levelBonus = level * 5
  const ivBonus = ivs ? Math.floor(ivs.total * 0.5) : 0
  const shinyBonus = isShiny ? 50 : 0
  
  stats.powerScore = baseScore + levelBonus + ivBonus + movePowerBonus + shinyBonus
  
  return stats
}

/**
 * Schnelle Power-Score Berechnung für Auto-Battle
 */
export const calculatePowerScore = (pokemon, baseStats) => {
  const level = pokemon.level || 1
  const moves = pokemon.moves || []
  const ivs = pokemon.ivs || null
  const isShiny = pokemon.isShiny || false
  
  // Base power from level
  let power = level * 10
  
  // Add base stats contribution
  if (baseStats) {
    power += Math.floor(baseStats.total * 0.5)
  }
  
  // IV contribution
  if (ivs && ivs.total) {
    power += Math.floor(ivs.total * 0.3)
  }
  
  // Move power contribution
  moves.forEach(move => {
    if (move.power > 0) {
      power += Math.floor(move.power * 0.4)
    }
  })
  
  // Shiny bonus
  if (isShiny) {
    power = Math.floor(power * 1.15)
  }
  
  return power
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
