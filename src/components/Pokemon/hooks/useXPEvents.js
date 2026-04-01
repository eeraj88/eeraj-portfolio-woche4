// ============================================
// XP EVENTS HOOK - Portfolio Interactions
// ============================================

import { useEffect, useCallback, useRef } from 'react'
import { COOLDOWNS, XP_REWARDS } from '../constants'

/**
 * Hook für XP-Events durch Portfolio-Interaktionen
 */
export const useXPEvents = (gameActions, isActive) => {
  const scrollMilestones = useRef({ 50: false, 100: false })
  const timeXPInterval = useRef(null)
  const lastPetTime = useRef(0)
  
  // Zeit auf Seite tracken - alle 30 Sekunden +3 XP
  useEffect(() => {
    if (!isActive) return
    
    timeXPInterval.current = setInterval(() => {
      gameActions.addXP(XP_REWARDS.TIME_ON_PAGE)
      gameActions.updateQuestProgress('time', 30)
      
      // Custom Event für UI-Feedback
      window.dispatchEvent(new CustomEvent('pokemon-xp', {
        detail: { amount: XP_REWARDS.TIME_ON_PAGE, reason: 'Zeit auf Seite' }
      }))
    }, COOLDOWNS.TIME_XP)
    
    return () => {
      if (timeXPInterval.current) {
        clearInterval(timeXPInterval.current)
      }
    }
  }, [isActive, gameActions])
  
  // Scroll XP - bei 50% und 100%
  useEffect(() => {
    if (!isActive) return
    
    const handleScroll = () => {
      const scrollPercent = Math.floor(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent >= 50 && !scrollMilestones.current[50]) {
        scrollMilestones.current[50] = true
        gameActions.addXP(XP_REWARDS.SCROLL_50)
        gameActions.updateQuestProgress('scroll', 50)
        
        window.dispatchEvent(new CustomEvent('pokemon-xp', {
          detail: { amount: XP_REWARDS.SCROLL_50, reason: '50% gescrollt' }
        }))
      }
      
      if (scrollPercent >= 95 && !scrollMilestones.current[100]) {
        scrollMilestones.current[100] = true
        gameActions.addXP(XP_REWARDS.SCROLL_100)
        gameActions.updateQuestProgress('scroll', 50)
        
        window.dispatchEvent(new CustomEvent('pokemon-xp', {
          detail: { amount: XP_REWARDS.SCROLL_100, reason: 'Seite komplett' }
        }))
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isActive, gameActions])
  
  // Streicheln mit Cooldown
  const handlePet = useCallback(() => {
    const now = Date.now()
    if (now - lastPetTime.current < COOLDOWNS.PET) {
      return { success: false, cooldownRemaining: COOLDOWNS.PET - (now - lastPetTime.current) }
    }
    
    lastPetTime.current = now
    gameActions.addXP(XP_REWARDS.PET)
    gameActions.updateQuestProgress('pet', 1)
    
    window.dispatchEvent(new CustomEvent('pokemon-xp', {
      detail: { amount: XP_REWARDS.PET, reason: 'Streicheln' }
    }))
    
    return { success: true, cooldownRemaining: 0 }
  }, [gameActions])
  
  // Projekt angeschaut (wird von Projects.jsx aufgerufen)
  const handleProjectView = useCallback((projectId) => {
    // Prüfe ob bereits angeschaut (in sessionStorage)
    const viewedKey = `viewed_project_${projectId}`
    if (sessionStorage.getItem(viewedKey)) return
    
    sessionStorage.setItem(viewedKey, 'true')
    gameActions.addXP(XP_REWARDS.PROJECT_VIEW)
    gameActions.updateQuestProgress('project', 1)
    
    window.dispatchEvent(new CustomEvent('pokemon-xp', {
      detail: { amount: XP_REWARDS.PROJECT_VIEW, reason: 'Projekt angeschaut' }
    }))
  }, [gameActions])
  
  // Quest abgeschlossen
  const handleQuestComplete = useCallback((questId, xpReward) => {
    gameActions.addXP(xpReward)
    
    window.dispatchEvent(new CustomEvent('pokemon-xp', {
      detail: { amount: xpReward, reason: 'Quest abgeschlossen!' }
    }))
  }, [gameActions])
  
  // Wiederkehr-Bonus berechnen
  const calculateReturnBonus = useCallback((lastVisit) => {
    if (!lastVisit) return 0
    
    const hoursSince = (Date.now() - lastVisit) / (1000 * 60 * 60)
    if (hoursSince < 1) return 0
    
    // +5 XP pro Stunde, max 100
    return Math.min(Math.floor(hoursSince * 5), 100)
  }, [])
  
  return {
    handlePet,
    handleProjectView,
    handleQuestComplete,
    calculateReturnBonus,
    petCooldown: COOLDOWNS.PET,
  }
}

/**
 * Globale XP-Funktion für externe Komponenten
 */
export const giveXP = (amount, reason) => {
  window.dispatchEvent(new CustomEvent('pokemon-xp-external', {
    detail: { amount, reason }
  }))
}
