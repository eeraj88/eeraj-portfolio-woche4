import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const FALLBACK_MESSAGE = `# AI News Feed

## Currently Loading...

The AI News Feed will display the latest AI news, market trends, and tech insights once the aggregator has generated data.

**To populate the feed:**
1. Run the Python aggregator from: \`C:\\Users\\eeraj\\Downloads\\ai-pulse-aggregator\`
2. Execute: \`python src\\main.py\`
3. The data will be stored in Supabase automatically
4. Refresh this page

**Data source:** Supabase - ai_news_archive table
`

// Kategorie-Farben und Sortierung
const CATEGORY_CONFIG = {
  '⚡ DEEP IMPACT': {
    bgColor: '#10b981',
    bgLight: '#ecfdf5',
    bgDark: '#064e3b',
    priority: 2
  },
  '🔄 EVOLUTIONARY': {
    bgColor: '#f59e0b',
    bgLight: '#fffbeb',
    bgDark: '#78350f',
    priority: 1
  },
  '🔥 MUST TRY': {
    bgColor: '#ef4444',
    bgLight: '#fef2f2',
    bgDark: '#991b1b',
    priority: 3
  },
  '🚀 BREAKTHROUGHS': {
    bgColor: '#8b5cf6',
    bgLight: '#f5f3ff',
    bgDark: '#5b21b6',
    priority: 4
  },
  '📚 RESEARCH': {
    bgColor: '#3b82f6',
    bgLight: '#eff6ff',
    bgDark: '#1e40af',
    priority: 5
  },
  '🛠️ TOOLS': {
    bgColor: '#06b6d4',
    bgLight: '#ecfeff',
    bgDark: '#164e63',
    priority: 6
  },
}

export default function AINewsFeed() {
  const { istDunkel } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasNew, setHasNew] = useState(true)
  const [supabaseReady, setSupabaseReady] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})

  useEffect(() => {
    if (supabaseUrl && supabaseKey) {
      try {
        createClient(supabaseUrl, supabaseKey)
        setSupabaseReady(true)
      } catch (error) {
        console.error('Supabase config error:', error)
        setSupabaseReady(false)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen && !newsData && supabaseReady) {
      fetchNews()
    }
  }, [isOpen, supabaseReady])

  const fetchNews = async () => {
    if (!supabaseReady) {
      setNewsData({ error: 'Supabase credentials not found' })
      return
    }

    setLoading(true)
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data, error } = await supabase
        .from('ai_news_archive')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw new Error(error.message)
      if (!data || data.length === 0) {
        setNewsData(null)
        return
      }

      const grouped = {}
      data.forEach(item => {
        const cat = item.category || 'General'
        if (!grouped[cat]) grouped[cat] = []
        grouped[cat].push(item)
      })

      const sortedCategories = Object.entries(grouped).sort((a, b) => {
        const priorityA = CATEGORY_CONFIG[a[0]]?.priority || 999
        const priorityB = CATEGORY_CONFIG[b[0]]?.priority || 999
        return priorityA - priorityB
      })

      setNewsData(sortedCategories)

      if (sortedCategories.length > 0) {
        setExpandedCategories({ [sortedCategories[0][0]]: true })
      }

      setHasNew(false)
    } catch (error) {
      console.error('Failed to fetch news:', error)
      setNewsData({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const bgColor = istDunkel ? '#0f172a' : '#f1f5f9'
  const textColor = istDunkel ? '#e2e8f0' : '#1e293b'
  const mutedColor = istDunkel ? '#94a3b8' : '#64748b'
  const borderColor = istDunkel ? '#334155' : '#e2e8f0'

  return (
    <>
      <style>{`
        @keyframes neon-glow {
          0%, 100% { 
            text-shadow: 0 0 4px #10b981, 0 0 10px #10b981, 0 0 15px #10b981;
            opacity: 1;
          }
          50% { 
            text-shadow: 0 0 2px #10b981, 0 0 5px #10b981, 0 0 8px #10b981;
            opacity: 0.8;
          }
        }
        .news-glow {
          animation: neon-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Tab Button - HORIZONTAL an der LINKEN SEITE */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 z-40 flex items-center justify-center gap-2 px-4 py-2 transition-all hover:px-5"
        style={{
          top: '15%',
          display: isOpen ? 'none' : 'flex',
          backgroundColor: istDunkel ? '#1e293b' : '#ffffff',
          borderRight: `2px solid #10b981`, // Green border for the neon look
          borderTop: `2px solid #10b981`,
          borderBottom: `2px solid #10b981`,
          borderRadius: '0 12px 12px 0',
          boxShadow: istDunkel ? '0 0 15px rgba(16, 185, 129, 0.3)' : '4px 0 12px rgba(0,0,0,0.1)',
        }}
        title="AI News Feed"
      >
        {hasNew && (
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#10b981' }} />
        )}
        <span
          className="text-xs font-black tracking-widest news-glow"
          style={{
            color: '#10b981',
            fontSize: '13px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          News
        </span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel - VERTIKALES DESIGN an der LINKEN SEITE */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          width: '380px',
          backgroundColor: bgColor,
          borderRight: `2px solid ${borderColor}`,
          boxShadow: '12px 0 40px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
            padding: '16px',
          }}
          className="flex justify-between items-start flex-shrink-0"
        >
          <div>
            <h2 className="text-white font-black text-lg mb-1">AI NEWS</h2>
            <p className="text-xs text-blue-100">
              {newsData && newsData.length > 0
                ? `${newsData.reduce((sum, [, items]) => sum + items.length, 0)} Stories`
                : 'Loading...'}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-lg w-8 h-8 flex items-center justify-center transition flex-shrink-0 font-bold text-xl"
          >
            ×
          </button>
        </div>

        {/* Content - VERTIKALES LAYOUT */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
              <p className="text-xs mt-2" style={{ color: mutedColor }}>
                Loading...
              </p>
            </div>
          ) : newsData && newsData.length > 0 ? (
            <div className="space-y-2">
              {newsData.map(([category, items]) => {
                const config = CATEGORY_CONFIG[category] || {
                  bgColor: '#64748b',
                  bgLight: '#f1f5f9',
                  bgDark: '#1e293b',
                }
                const isExpanded = expandedCategories[category]

                return (
                  <div
                    key={category}
                    className="rounded-lg overflow-hidden transition-all hover:shadow-md"
                    style={{
                      backgroundColor: istDunkel ? config.bgDark : config.bgLight,
                      border: `1px solid ${config.bgColor}40`,
                    }}
                  >
                    {/* Category Header */}
                    <div
                      onClick={() => toggleCategory(category)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:opacity-90 transition"
                      style={{
                        backgroundColor: config.bgColor,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <h3 className="font-bold text-xs text-white">
                          {category}
                        </h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-white/20 text-white">
                          {items.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {items.length > 1 && (
                          <span className="text-[10px] text-white">
                            {isExpanded ? '▲' : '▼'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* News Items - VERTIKAL */}
                    <div className="divide-y" style={{ borderColor: config.bgColor + '30' }}>
                      {(isExpanded ? items : [items[0]]).map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-3 hover:bg-black/5 transition"
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className="w-0.5 h-full rounded-full flex-shrink-0 mt-1"
                              style={{ backgroundColor: config.bgColor }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs mb-1 leading-snug" style={{ color: textColor }}>
                                {item.title}
                              </h4>
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px font-semibold hover:underline mb-1 inline-block"
                                  style={{ color: config.bgColor }}
                                >
                                  Read more →
                                </a>
                              )}
                              {item.summary && (
                                <p className="text-[10px] leading-relaxed mb-1" style={{ color: mutedColor }}>
                                  {item.summary}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-[10px]" style={{ color: mutedColor }}>
                                <span>{item.source || 'Unknown'}</span>
                                {item.business_impact && (
                                  <span>• {item.business_impact}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">📰</div>
              <p className="text-sm font-medium mb-2" style={{ color: textColor }}>
                No news available yet
              </p>
              <p className="text-xs" style={{ color: mutedColor }}>
                Run the aggregator to populate the feed
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex justify-between items-center px-3 py-2 flex-shrink-0 text-[10px]"
          style={{
            borderTop: `1px solid ${borderColor}`,
            backgroundColor: istDunkel ? '#1e293b' : '#ffffff'
          }}
        >
          <span style={{ color: mutedColor }}>
            Daily AI News
          </span>
          <button
            onClick={fetchNews}
            disabled={loading || !supabaseReady}
            className="px-2 py-1 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    </>
  )
}
