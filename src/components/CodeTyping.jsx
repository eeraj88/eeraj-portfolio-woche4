import { useState, useEffect } from 'react'

const CODE_SNIPPETS = [
  {
    language: 'javascript',
    code: `const eeraj = {
  role: "Frontend Developer",
  skills: ["React", "Tailwind", "JavaScript"],
  passion: "Building great UX"
};`,
  },
  {
    language: 'jsx',
    code: `function Portfolio() {
  const [awesome, setAwesome] = useState(true);
  
  return <Website isAwesome={awesome} />;
}`,
  },
  {
    language: 'css',
    code: `.developer {
  creativity: infinite;
  coffee-level: 100%;
  bugs-fixed: many;
}`,
  },
]

export default function CodeTyping({ istDunkel }) {
  const [currentSnippet, setCurrentSnippet] = useState(0)
  const [displayedCode, setDisplayedCode] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const snippet = CODE_SNIPPETS[currentSnippet]
    let charIndex = 0
    
    if (isTyping) {
      const typeInterval = setInterval(() => {
        if (charIndex <= snippet.code.length) {
          setDisplayedCode(snippet.code.slice(0, charIndex))
          charIndex++
        } else {
          clearInterval(typeInterval)
          // Warte, dann lösche
          setTimeout(() => setIsTyping(false), 2000)
        }
      }, 40)
      
      return () => clearInterval(typeInterval)
    } else {
      // Löschen
      let deleteIndex = snippet.code.length
      const deleteInterval = setInterval(() => {
        if (deleteIndex >= 0) {
          setDisplayedCode(snippet.code.slice(0, deleteIndex))
          deleteIndex--
        } else {
          clearInterval(deleteInterval)
          setCurrentSnippet((prev) => (prev + 1) % CODE_SNIPPETS.length)
          setIsTyping(true)
        }
      }, 20)
      
      return () => clearInterval(deleteInterval)
    }
  }, [currentSnippet, isTyping])

  const snippet = CODE_SNIPPETS[currentSnippet]

  return (
    <div className={`rounded-xl overflow-hidden font-mono text-sm ${
      istDunkel ? 'bg-gray-900/80 border border-gray-700' : 'bg-gray-100 border border-gray-300'
    }`}>
      {/* Terminal Header */}
      <div className={`flex items-center gap-2 px-4 py-2 ${
        istDunkel ? 'bg-gray-800' : 'bg-gray-200'
      }`}>
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className={`ml-2 text-xs ${istDunkel ? 'text-gray-400' : 'text-gray-500'}`}>
          {snippet.language}
        </span>
      </div>
      
      {/* Code */}
      <div className="p-4 min-h-[140px]">
        <pre className={`whitespace-pre-wrap ${istDunkel ? 'text-green-400' : 'text-gray-800'}`}>
          {displayedCode}
          <span className="animate-pulse">|</span>
        </pre>
      </div>
    </div>
  )
}
