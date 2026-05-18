import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [istDunkel, setIstDunkel] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === null ? true : saved === 'true'
  })

  const toggleDarkMode = () => setIstDunkel(prev => !prev)

  useEffect(() => {
    localStorage.setItem('darkMode', istDunkel)
    document.documentElement.setAttribute('data-theme', istDunkel ? 'dark' : 'light')
  }, [istDunkel])

  return (
    <ThemeContext.Provider value={{ istDunkel, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export { ThemeContext }