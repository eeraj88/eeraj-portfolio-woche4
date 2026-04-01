// ============================================
// FIREBASE CONFIGURATION
// ============================================

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, onValue, query, orderByChild, limitToLast } from 'firebase/database'

// Firebase configuration - Diese Werte musst du mit deinen eigenen ersetzen!
// Erstelle ein Firebase Projekt auf https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://YOUR_PROJECT-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
}

// Initialize Firebase
let app = null
let database = null

try {
  app = initializeApp(firebaseConfig)
  database = getDatabase(app)
} catch (error) {
  console.warn('Firebase initialization failed:', error.message)
}

// ============================================
// LEADERBOARD FUNCTIONS
// ============================================

/**
 * Save trainer data to Firebase
 */
export const saveTrainerData = async (trainerId, trainerData) => {
  if (!database) {
    console.warn('Firebase not initialized')
    return false
  }
  
  try {
    const trainerRef = ref(database, `trainers/${trainerId}`)
    await set(trainerRef, {
      ...trainerData,
      lastUpdated: Date.now()
    })
    return true
  } catch (error) {
    console.error('Error saving trainer data:', error)
    return false
  }
}

/**
 * Get top trainers from leaderboard
 */
export const getLeaderboard = async (limit = 10) => {
  if (!database) {
    console.warn('Firebase not initialized')
    return []
  }
  
  try {
    const trainersRef = ref(database, 'trainers')
    const topTrainersQuery = query(trainersRef, orderByChild('score'), limitToLast(limit))
    const snapshot = await get(topTrainersQuery)
    
    if (!snapshot.exists()) return []
    
    const trainers = []
    snapshot.forEach((child) => {
      trainers.push({
        id: child.key,
        ...child.val()
      })
    })
    
    // Sort descending by score
    return trainers.sort((a, b) => b.score - a.score)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

/**
 * Subscribe to leaderboard updates (real-time)
 */
export const subscribeToLeaderboard = (callback, limit = 10) => {
  if (!database) {
    console.warn('Firebase not initialized')
    callback([]) // Return empty array immediately
    return () => {}
  }
  
  try {
    const trainersRef = ref(database, 'trainers')
    const topTrainersQuery = query(trainersRef, orderByChild('score'), limitToLast(limit))
    
    const unsubscribe = onValue(topTrainersQuery, (snapshot) => {
      if (!snapshot.exists()) {
        callback([])
        return
      }
      
      const trainers = []
      snapshot.forEach((child) => {
        trainers.push({
          id: child.key,
          ...child.val()
        })
      })
      
      // Sort descending by score
      callback(trainers.sort((a, b) => b.score - a.score))
    }, (error) => {
      console.error('Leaderboard subscription error:', error)
      callback([])
    })
    
    return unsubscribe
  } catch (error) {
    console.error('Leaderboard setup error:', error)
    callback([])
    return () => {}
  }
}

/**
 * Calculate trainer score
 */
export const calculateTrainerScore = (trainerData) => {
  const {
    level = 1,
    wins = 0,
    losses = 0,
    defeatedArenas = [],
    isShiny = false,
  } = trainerData
  
  // Score formula:
  // - Level: 100 points per level
  // - Wins: 50 points per win
  // - Losses: -10 points per loss
  // - Arenas: 500 points per defeated arena
  // - Shiny bonus: 1000 points
  
  let score = 0
  score += level * 100
  score += wins * 50
  score -= losses * 10
  score += defeatedArenas.length * 500
  if (isShiny) score += 1000
  
  return Math.max(0, score)
}

export { database }
