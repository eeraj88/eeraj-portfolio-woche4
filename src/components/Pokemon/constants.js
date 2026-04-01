// ============================================
// POKEMON GAME CONSTANTS - UPDATED
// ============================================

// Starter Pokemon - Alle Gen 1-3 Starter + beliebte Pokemon
export const STARTER_POKEMON = [
  // Gen 1
  { id: 1, name: 'Bisasam' },
  { id: 4, name: 'Glumanda' },
  { id: 7, name: 'Schiggy' },
  { id: 25, name: 'Pikachu' },
  { id: 133, name: 'Evoli' },
  { id: 39, name: 'Pummeluff' },
  { id: 35, name: 'Piepi' },
  { id: 37, name: 'Vulpix' },
  { id: 58, name: 'Fukano' },
  { id: 63, name: 'Abra' },
  { id: 66, name: 'Machollo' },
  { id: 74, name: 'Kleinstein' },
  { id: 92, name: 'Nebulak' },
  { id: 129, name: 'Karpador' },
  // Gen 2
  { id: 152, name: 'Endivie' },
  { id: 155, name: 'Feurigel' },
  { id: 158, name: 'Karnimani' },
  { id: 175, name: 'Togepi' },
  { id: 179, name: 'Voltilamm' },
  { id: 196, name: 'Psiana' },
  { id: 197, name: 'Nachtara' },
  // Gen 3
  { id: 252, name: 'Geckarbor' },
  { id: 255, name: 'Flemmli' },
  { id: 258, name: 'Hydropi' },
  { id: 280, name: 'Trasla' },
  { id: 304, name: 'Stollunior' },
  { id: 363, name: 'Seemops' },
  { id: 374, name: 'Tanhel' },
]

// Wilde Pokemon (Gen 1 IDs)
export const WILD_POKEMON_IDS = [
  16, 19, 21, 23, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58,
  60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 95, 96, 98, 100,
  102, 104, 109, 111, 114, 116, 118, 120, 123, 127, 128, 129, 131, 133, 137, 147
]

// Seltene/Legendäre Pokemon für besondere Events
export const RARE_POKEMON_IDS = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250]
export const LEGENDARY_POKEMON_IDS = [150, 151, 249, 250, 384, 483, 484]

// Evolution Chains
export const EVOLUTION_CHAINS = {
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

export const EVOLUTION_LEVELS = { stage2: 16, stage3: 36 }

// ============================================
// INDIVIDUAL VALUES (IVs) - Macht jedes Pokemon einzigartig
// ============================================
export const IV_RANGE = { min: 0, max: 31 } // Wie im echten Spiel

// Naturen - beeinflussen Stats (+10% / -10%)
export const NATURES = {
  robust: { name: 'Robust', up: 'hp', down: null, emoji: '💪' },
  hart: { name: 'Hart', up: 'attack', down: 'spAttack', emoji: '⚔️' },
  kühn: { name: 'Kühn', up: 'defense', down: 'attack', emoji: '🛡️' },
  mäßig: { name: 'Mäßig', up: 'spAttack', down: 'attack', emoji: '✨' },
  still: { name: 'Still', up: 'spDefense', down: 'speed', emoji: '🔮' },
  scheu: { name: 'Scheu', up: 'speed', down: 'attack', emoji: '💨' },
  froh: { name: 'Froh', up: 'speed', down: 'spAttack', emoji: '😊' },
  sanft: { name: 'Sanft', up: 'spDefense', down: 'defense', emoji: '🌸' },
  locker: { name: 'Locker', up: 'defense', down: 'speed', emoji: '😌' },
  hitzig: { name: 'Hitzig', up: 'spAttack', down: 'spDefense', emoji: '🔥' },
  ernst: { name: 'Ernst', up: null, down: null, emoji: '😐' }, // Neutral
}

// Persönlichkeiten - Flavor + kleine Boni
export const PERSONALITIES = [
  { name: 'Kämpferisch', trait: 'Liebt es zu kämpfen', bonusStat: 'attack', bonus: 5 },
  { name: 'Neugierig', trait: 'Erkundet gerne', bonusStat: 'speed', bonus: 5 },
  { name: 'Schüchtern', trait: 'Versteckt sich oft', bonusStat: 'defense', bonus: 5 },
  { name: 'Stolz', trait: 'Sehr selbstbewusst', bonusStat: 'spAttack', bonus: 5 },
  { name: 'Verspielt', trait: 'Immer gut drauf', bonusStat: 'hp', bonus: 5 },
  { name: 'Klug', trait: 'Lernt schnell', bonusStat: 'spDefense', bonus: 5 },
  { name: 'Mutig', trait: 'Fürchtet nichts', bonusStat: 'attack', bonus: 8 },
  { name: 'Mysteriös', trait: 'Wirkt geheimnisvoll', bonusStat: 'spAttack', bonus: 8 },
]

// ============================================
// SELTENE EVENTS
// ============================================
export const RARE_EVENTS = {
  SHINY_ENCOUNTER: { chance: 0.02, name: 'Shiny-Begegnung', emoji: '✨' },
  LEGENDARY_GLIMPSE: { chance: 0.005, name: 'Legendäre Sichtung', emoji: '🌟' },
  STAT_BOOST: { chance: 0.08, name: 'Trainings-Durchbruch', emoji: '💪' },
  RARE_CANDY: { chance: 0.05, name: 'Sonderbonbon gefunden', emoji: '🍬' },
  PERFECT_IV: { chance: 0.03, name: 'Perfekte Gene', emoji: '🧬' },
  CRITICAL_TRAINING: { chance: 0.10, name: 'Intensives Training', emoji: '🔥' },
  FRIENDSHIP_BOOST: { chance: 0.15, name: 'Freundschaftsmoment', emoji: '❤️' },
  MOVE_MASTERY: { chance: 0.07, name: 'Attacken-Meisterschaft', emoji: '⚡' },
}

// ============================================
// COOLDOWNS & XP
// ============================================
export const COOLDOWNS = {
  PET: 10000,
  BATTLE: 3000,        // Viel kürzer! Auto-Battle ist schnell
  WILD_ENCOUNTER: 5000,
  TIME_XP: 30000,
}

export const XP_REWARDS = {
  PET: 5,
  SCROLL_50: 2,
  SCROLL_100: 2,
  PROJECT_VIEW: 10,
  TIME_ON_PAGE: 3,
  BATTLE_WIN_BASE: 20,
  BATTLE_WIN_LEVEL_MULT: 2,
  ARENA_WIN_BASE: 50,
  ARENA_WIN_MULT: 15,
  RARE_EVENT: 30,
}

export const xpForNextLevel = (level) => Math.floor(25 * Math.pow(1.25, level))

// ============================================
// TYP-EFFEKTIVITÄT
// ============================================
export const TYPE_EFFECTIVENESS = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
}

// Trainer Namen
export const TRAINER_TITLES = [
  'Recruiter', 'HR Manager', 'Tech Lead', 'Senior Dev', 'CTO', 
  'Hiring Manager', 'Engineering Lead', 'Besucher', 'Frontend Lead',
  'Product Owner', 'Scrum Master', 'DevOps', 'UX Designer', 'Praktikant'
]

export const TRAINER_NAMES = [
  'Anna', 'Max', 'Sophie', 'Leon', 'Emma', 'Paul', 'Laura', 'Tim',
  'Julia', 'Felix', 'Sarah', 'David', 'Lisa', 'Jonas', 'Marie', 'Lukas'
]

export const generateTrainerName = () => {
  const title = TRAINER_TITLES[Math.floor(Math.random() * TRAINER_TITLES.length)]
  const name = TRAINER_NAMES[Math.floor(Math.random() * TRAINER_NAMES.length)]
  return `${title} ${name}`
}

// Tech-Arenen
export const TECH_ARENAS = [
  { id: 1, company: 'Google', leader: 'Sundar', color: 'from-blue-500 to-red-500', requiredLevel: 5, pokemon: [25, 81, 137], badge: '🔍', power: 150 },
  { id: 2, company: 'Apple', leader: 'Tim', color: 'from-gray-400 to-gray-600', requiredLevel: 10, pokemon: [82, 132, 233], badge: '🍎', power: 280 },
  { id: 3, company: 'Microsoft', leader: 'Satya', color: 'from-blue-600 to-green-500', requiredLevel: 18, pokemon: [137, 474, 462], badge: '🪟', power: 450 },
  { id: 4, company: 'Amazon', leader: 'Andy', color: 'from-orange-500 to-yellow-500', requiredLevel: 25, pokemon: [52, 53, 143], badge: '📦', power: 600 },
  { id: 5, company: 'Meta', leader: 'Mark', color: 'from-blue-600 to-blue-400', requiredLevel: 32, pokemon: [63, 64, 65], badge: '👁️', power: 750 },
  { id: 6, company: 'Tesla', leader: 'Elon', color: 'from-red-600 to-gray-800', requiredLevel: 40, pokemon: [100, 101, 145], badge: '⚡', power: 900 },
  { id: 7, company: 'Netflix', leader: 'Ted', color: 'from-red-600 to-black', requiredLevel: 48, pokemon: [92, 93, 94], badge: '🎬', power: 1050 },
  { id: 8, company: 'OpenAI', leader: 'Sam', color: 'from-emerald-500 to-teal-600', requiredLevel: 55, pokemon: [150, 151, 386], badge: '🤖', power: 1500 },
]

// Typ Farben
export const TYPE_COLORS = {
  fire: 'bg-orange-500', water: 'bg-blue-500', grass: 'bg-green-500',
  electric: 'bg-yellow-400', psychic: 'bg-pink-500', ice: 'bg-cyan-300',
  dragon: 'bg-purple-600', dark: 'bg-gray-700', fairy: 'bg-pink-300',
  normal: 'bg-gray-400', fighting: 'bg-red-700', flying: 'bg-indigo-300',
  poison: 'bg-purple-500', ground: 'bg-amber-600', rock: 'bg-amber-800',
  bug: 'bg-lime-500', ghost: 'bg-purple-800', steel: 'bg-gray-500',
}

// Shiny Chance
export const SHINY_CHANCE = 0.10

// Items (vereinfacht)
export const ITEMS = {
  potion: { id: 'potion', name: 'Trank', effect: 'heal', value: 20, emoji: '🧪' },
  rareCandy: { id: 'rareCandy', name: 'Sonderbonbon', effect: 'levelup', value: 1, emoji: '🍬' },
  protein: { id: 'protein', name: 'Protein', effect: 'boost_attack', value: 5, emoji: '💪' },
  calcium: { id: 'calcium', name: 'Kalzium', effect: 'boost_spAttack', value: 5, emoji: '✨' },
}

// Max Team Size
export const MAX_TEAM_SIZE = 6

// Daily Quests
export const DAILY_QUESTS = [
  { id: 'pet5', type: 'pet', goal: 5, reward: 50, description: 'Streichle dein Pokémon 5x' },
  { id: 'battle3', type: 'battle', goal: 3, reward: 100, description: 'Gewinne 3 Kämpfe' },
  { id: 'xp100', type: 'xp', goal: 100, reward: 75, description: 'Sammle 100 XP' },
  { id: 'arena1', type: 'arena', goal: 1, reward: 200, description: 'Besiege eine Arena' },
  { id: 'catch1', type: 'catch', goal: 1, reward: 150, description: 'Fange ein Pokémon' },
]
