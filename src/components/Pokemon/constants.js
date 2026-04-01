// ============================================
// POKEMON GAME CONSTANTS
// ============================================

// Starter Pokemon mit Evolutionsketten
export const STARTER_POKEMON = [
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

// Wilde Pokemon (Gen 1 IDs)
export const WILD_POKEMON_IDS = [
  16, 19, 21, 23, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58,
  60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 95, 96, 98, 100,
  102, 104, 109, 111, 114, 116, 118, 120, 123, 127, 128, 129, 131, 133, 137, 147
]

// Evolution Chains
export const EVOLUTION_CHAINS = {
  1: [1, 2, 3],       // Bisasam -> Bisaknosp -> Bisaflor
  4: [4, 5, 6],       // Glumanda -> Glutexo -> Glurak
  7: [7, 8, 9],       // Schiggy -> Schillok -> Turtok
  25: [25, 26],       // Pikachu -> Raichu
  133: [133, 134, 135, 136, 196, 197, 470, 471, 700], // Evoli -> alle Eeveelutions
  152: [152, 153, 154],
  155: [155, 156, 157],
  158: [158, 159, 160],
  252: [252, 253, 254],
  255: [255, 256, 257],
  258: [258, 259, 260],
}

export const EVOLUTION_LEVELS = { stage2: 16, stage3: 36 }

// Cooldowns in Millisekunden
export const COOLDOWNS = {
  PET: 10000,           // 10 Sekunden
  BATTLE: 60000,        // 60 Sekunden
  TIME_XP: 30000,       // 30 Sekunden
  WILD_ENCOUNTER: 45000, // 45 Sekunden
}

// XP Rewards
export const XP_REWARDS = {
  PET: 5,
  SCROLL_50: 2,
  SCROLL_100: 2,
  PROJECT_VIEW: 10,
  TIME_ON_PAGE: 3,
  BATTLE_WIN_BASE: 15,
  BATTLE_WIN_LEVEL_MULT: 1.5,
  ARENA_WIN_BASE: 50,
  ARENA_WIN_MULT: 10,
  CATCH_POKEMON: 25,
  QUEST_COMPLETE: 20,
}

// XP Formel
export const xpForNextLevel = (level) => Math.floor(20 * Math.pow(1.3, level))

// Typ-Effektivitäten (komplett wie im echten Spiel)
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
  'Recruiter', 'HR Manager', 'Tech Lead', 'Senior Developer', 'CTO', 
  'Hiring Manager', 'Engineering Manager', 'Besucher', 'Frontend Lead',
  'Product Owner', 'Scrum Master', 'DevOps Engineer', 'UX Designer'
]

export const TRAINER_FIRST_NAMES = [
  'Anna', 'Max', 'Sophie', 'Leon', 'Emma', 'Paul', 'Laura', 'Tim',
  'Julia', 'Felix', 'Sarah', 'David', 'Lisa', 'Jonas', 'Marie', 'Lukas',
  'Hannah', 'Finn', 'Lea', 'Noah', 'Mia', 'Ben', 'Lena', 'Tom',
  'Christina', 'Michael', 'Sandra', 'Stefan', 'Melanie', 'Andreas'
]

export const TRAINER_LAST_NAMES = [
  'Müller', 'Schmidt', 'Weber', 'Fischer', 'Meyer', 'Wagner', 'Becker',
  'Hoffmann', 'Koch', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann',
  'Braun', 'Zimmermann', 'Krüger', 'Hartmann', 'Lange', 'Werner',
  'Schwarz', 'Hofmann', 'Krause', 'Lehmann', 'Köhler', 'Maier'
]

export const generateTrainerName = () => {
  const title = TRAINER_TITLES[Math.floor(Math.random() * TRAINER_TITLES.length)]
  const firstName = TRAINER_FIRST_NAMES[Math.floor(Math.random() * TRAINER_FIRST_NAMES.length)]
  const lastName = TRAINER_LAST_NAMES[Math.floor(Math.random() * TRAINER_LAST_NAMES.length)]
  return `${title} ${firstName} ${lastName}`
}

// Tech-Arenen
export const TECH_ARENAS = [
  { 
    id: 1, company: 'Google', leader: 'CEO Sundar Pichai', 
    color: 'from-blue-500 to-red-500', requiredLevel: 3,
    pokemon: [25, 81, 137], badge: '🔍'
  },
  { 
    id: 2, company: 'Apple', leader: 'CEO Tim Cook', 
    color: 'from-gray-400 to-gray-600', requiredLevel: 7,
    pokemon: [82, 132, 233], badge: '🍎'
  },
  { 
    id: 3, company: 'Microsoft', leader: 'CEO Satya Nadella', 
    color: 'from-blue-600 to-green-500', requiredLevel: 12,
    pokemon: [137, 474, 462], badge: '🪟'
  },
  { 
    id: 4, company: 'Amazon', leader: 'CEO Andy Jassy', 
    color: 'from-orange-500 to-yellow-500', requiredLevel: 18,
    pokemon: [52, 53, 143], badge: '📦'
  },
  { 
    id: 5, company: 'Meta', leader: 'CEO Mark Zuckerberg', 
    color: 'from-blue-600 to-blue-400', requiredLevel: 25,
    pokemon: [63, 64, 65], badge: '👁️'
  },
  { 
    id: 6, company: 'Tesla', leader: 'CEO Elon Musk', 
    color: 'from-red-600 to-gray-800', requiredLevel: 33,
    pokemon: [100, 101, 145], badge: '⚡'
  },
  { 
    id: 7, company: 'Netflix', leader: 'CEO Ted Sarandos', 
    color: 'from-red-600 to-black', requiredLevel: 42,
    pokemon: [92, 93, 94], badge: '🎬'
  },
  { 
    id: 8, company: 'OpenAI', leader: 'CEO Sam Altman', 
    color: 'from-emerald-500 to-teal-600', requiredLevel: 50,
    pokemon: [150, 151, 386], badge: '🤖'
  },
]

// Items
export const ITEMS = {
  potion: { id: 'potion', name: 'Trank', effect: 'heal', value: 20, price: 10, emoji: '🧪' },
  superPotion: { id: 'superPotion', name: 'Supertrank', effect: 'heal', value: 50, price: 25, emoji: '💊' },
  hyperPotion: { id: 'hyperPotion', name: 'Hypertrank', effect: 'heal', value: 100, price: 50, emoji: '💉' },
  revive: { id: 'revive', name: 'Beleber', effect: 'revive', value: 50, price: 75, emoji: '✨' },
  pokeball: { id: 'pokeball', name: 'Pokéball', effect: 'catch', value: 1, price: 20, emoji: '🔴' },
  greatball: { id: 'greatball', name: 'Superball', effect: 'catch', value: 1.5, price: 40, emoji: '🔵' },
  ultraball: { id: 'ultraball', name: 'Hyperball', effect: 'catch', value: 2, price: 80, emoji: '⚫' },
  xAttack: { id: 'xAttack', name: 'X-Angriff', effect: 'boost', stat: 'attack', value: 1.5, price: 30, emoji: '⚔️' },
  xDefense: { id: 'xDefense', name: 'X-Verteidigung', effect: 'boost', stat: 'defense', value: 1.5, price: 30, emoji: '🛡️' },
  berry: { id: 'berry', name: 'Sinelbeere', effect: 'heal', value: 10, price: 5, emoji: '🍇' },
}

// Tägliche Quests
export const DAILY_QUESTS = [
  { id: 'pet3', type: 'pet', target: 3, xp: 15, description: '3x Pokémon streicheln' },
  { id: 'battle2', type: 'battle', target: 2, xp: 25, description: '2 Kämpfe gewinnen' },
  { id: 'scroll', type: 'scroll', target: 100, xp: 10, description: 'Seite komplett scrollen' },
  { id: 'visit', type: 'visit', target: 1, xp: 5, description: 'Portfolio besuchen' },
  { id: 'catch1', type: 'catch', target: 1, xp: 30, description: '1 Pokémon fangen' },
  { id: 'arena1', type: 'arena', target: 1, xp: 50, description: '1 Arena herausfordern' },
]

// Typ Farben für UI
export const TYPE_COLORS = {
  fire: 'bg-orange-500', water: 'bg-blue-500', grass: 'bg-green-500',
  electric: 'bg-yellow-400', psychic: 'bg-pink-500', ice: 'bg-cyan-300',
  dragon: 'bg-purple-600', dark: 'bg-gray-700', fairy: 'bg-pink-300',
  normal: 'bg-gray-400', fighting: 'bg-red-700', flying: 'bg-indigo-300',
  poison: 'bg-purple-500', ground: 'bg-amber-600', rock: 'bg-amber-800',
  bug: 'bg-lime-500', ghost: 'bg-purple-800', steel: 'bg-gray-500',
}

// Max Team Größe
export const MAX_TEAM_SIZE = 6

// Shiny Chance
export const SHINY_CHANCE = 0.10 // 10%

// Catch Rate Basis
export const BASE_CATCH_RATE = 0.4 // 40% Basis
