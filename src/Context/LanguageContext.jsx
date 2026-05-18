import { createContext, useState, useEffect, useContext } from 'react'

const LanguageContext = createContext(undefined)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return saved || 'de'
  })

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'de' ? 'en' : 'de'
      localStorage.setItem('language', newLang)
      return newLang
    })
  }

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.setAttribute('lang', language)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export { LanguageContext }
