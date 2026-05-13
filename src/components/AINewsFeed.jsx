import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const C = {
  cyan: 'var(--cyan)', cyanGlow: 'var(--cyan-glow)',
  cyanBorder: 'var(--cyan-border)', cyanBorderStrong: 'var(--cyan-border-strong)',
  bg0: 'var(--bg-0)', bg1: 'var(--bg-1)', bg2: 'var(--bg-2)',
  text0: 'var(--text-0)', text1: 'var(--text-1)', text2: 'var(--text-2)', text3: 'var(--text-3)',
}
const fontMono = "'JetBrains Mono', ui-monospace, monospace"
const fontDisplay = "'Space Grotesk', system-ui, sans-serif"

const CATEGORY_CONFIG = {
  '🟢 DEEP IMPACT':     { color: '#10b981', priority: 1 },
  '🟡 EVOLUTIONARY':    { color: '#f59e0b', priority: 2 },
  '🔵 FREE TOOL ALERT': { color: '#3b82f6', priority: 3 },
  '🚀 MUST-TRY':        { color: '#ef4444', priority: 4 },
  '🔌 APIs & MCPs':     { color: '#8b5cf6', priority: 5 },
  '📊 MARKET & TRENDS': { color: '#6366f1', priority: 6 },
}

export default function AINewsFeed() {
  const { istDunkel } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(false)
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasNew, setHasNew] = useState(true)
  const [supabaseReady] = useState(!!(supabaseUrl && supabaseKey))
  const [expandedCategories, setExpandedCategories] = useState({})

  const fetchNews = async () => {
    if (!supabaseReady) { setNewsData({ error: true }); return }
    setLoading(true)
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await supabase
        .from('ai_news_archive')
        .select('*')
        .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100)
      if (error) throw new Error(error.message)
      if (!data || data.length === 0) { setNewsData(null); return }
      const grouped = {}
      data.forEach(item => {
        const cat = item.category || 'General'
        if (!grouped[cat]) grouped[cat] = []
        grouped[cat].push(item)
      })
      const sorted = Object.entries(grouped).sort((a, b) =>
        (CATEGORY_CONFIG[a[0]]?.priority || 999) - (CATEGORY_CONFIG[b[0]]?.priority || 999)
      )
      setNewsData(sorted)
      if (sorted.length > 0) setExpandedCategories({ [sorted[0][0]]: true })
      setHasNew(false)
    } catch (e) {
      console.error(e)
      setNewsData({ error: true })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && !newsData && supabaseReady) fetchNews()
  }, [isOpen, supabaseReady])

  const toggleCategory = (cat) =>
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }))

  return (
    <>
      <style>{`
        @keyframes newsGlow {
          0%,100% { text-shadow: 0 0 6px ${C.cyanGlow}, 0 0 14px ${C.cyanGlow}; opacity: 1; }
          50%      { text-shadow: 0 0 3px ${C.cyanGlow}, 0 0 7px ${C.cyanGlow};  opacity: 0.75; }
        }
        @keyframes tabPulse {
          0%,100% { box-shadow: 4px 0 20px rgba(34,211,238,0.18), 0 0 0 0 rgba(34,211,238,0); }
          50%     { box-shadow: 4px 0 32px rgba(34,211,238,0.45), 0 0 0 3px rgba(34,211,238,0.08); }
        }
        .news-glow-text { animation: newsGlow 2s ease-in-out infinite; }
        .news-tab-btn { animation: tabPulse 2.5s ease-in-out infinite; }
        .news-tab-btn:hover { animation: none !important; box-shadow: 0 4px 24px rgba(34,211,238,0.5) !important; background: #161616 !important; }
      `}</style>

      {/* Tab button — left edge */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="AI News Feed"
          className="news-tab-btn"
          style={{
            position: 'fixed', left: 0, top: '66px', zIndex: 55,
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 16px 7px 10px',
            background: 'var(--bg-2)',
            borderRight: `1px solid ${C.cyanBorder}`,
            borderBottom: `2px solid ${C.cyan}`,
            borderTop: 'none',
            borderLeft: 'none',
            borderRadius: '0 0 12px 0',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: C.cyan,
            boxShadow: `0 0 10px ${C.cyanGlow}, 0 0 20px rgba(34,211,238,0.3)`,
            display: 'inline-block',
            flexShrink: 0,
            animation: 'heroPing 1.8s ease-in-out infinite',
          }} />
          <span
            className="news-glow-text"
            style={{
              fontFamily: fontMono, fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan,
            }}
          >
            AI NEWS
          </span>
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 54, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 56,
          width: '380px',
          background: C.bg1,
          borderRight: `1px solid ${C.cyanBorder}`,
          boxShadow: isOpen ? `12px 0 50px rgba(0,0,0,0.5), 0 0 40px rgba(34,211,238,0.06)` : 'none',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Cyan top accent */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${C.cyan}, rgba(34,211,238,0.3))`, flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: `1px solid var(--cyan-border)`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: fontMono, fontSize: '10px', letterSpacing: '0.18em', color: C.cyan, textTransform: 'uppercase', marginBottom: '4px' }}>
              // AI News Daily
            </div>
            <div style={{ fontFamily: fontDisplay, fontSize: '20px', fontWeight: 600, color: C.text0 }}>
              AI NEWS
            </div>
            <div style={{ fontFamily: fontMono, fontSize: '11px', color: C.text3, marginTop: '2px' }}>
              {newsData && Array.isArray(newsData)
                ? `${newsData.reduce((s, [, items]) => s + items.length, 0)} Stories`
                : 'Loading...'}
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: C.bg2, border: `1px solid ${C.cyanBorder}`,
              color: C.text2, cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >✕</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                border: `2px solid rgba(34,211,238,0.2)`,
                borderTopColor: C.cyan,
                animation: 'contactSpin 0.8s linear infinite',
              }} />
              <span style={{ fontFamily: fontMono, fontSize: '11px', color: C.text3 }}>Lade News...</span>
            </div>
          ) : newsData && Array.isArray(newsData) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {newsData.map(([category, items]) => {
                const cfg = CATEGORY_CONFIG[category] || { color: '#64748b' }
                const expanded = expandedCategories[category]
                return (
                  <div key={category} style={{
                    borderRadius: '10px', overflow: 'hidden',
                    border: `1px solid ${cfg.color}30`,
                    background: C.bg2,
                  }}>
                    {/* Category header */}
                    <div
                      onClick={() => toggleCategory(category)}
                      style={{
                        padding: '9px 12px', cursor: 'pointer',
                        background: `${cfg.color}18`,
                        borderBottom: expanded ? `1px solid ${cfg.color}20` : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color, flexShrink: 0, display: 'inline-block' }} />
                        <span style={{ fontFamily: fontMono, fontSize: '10px', fontWeight: 700, color: cfg.color, letterSpacing: '0.06em' }}>{category}</span>
                        <span style={{
                          fontFamily: fontMono, fontSize: '9px', padding: '1px 6px',
                          borderRadius: '9999px', background: `${cfg.color}25`, color: cfg.color,
                        }}>{items.length}</span>
                      </div>
                      {items.length > 1 && (
                        <span style={{ fontFamily: fontMono, fontSize: '9px', color: C.text3 }}>
                          {expanded ? '▲' : '▼'}
                        </span>
                      )}
                    </div>

                    {/* Items */}
                    <div>
                      {(expanded ? items : [items[0]]).map((item, idx) => (
                        <div key={item.id || idx} style={{
                          padding: '10px 12px',
                          borderBottom: idx < (expanded ? items : [items[0]]).length - 1 ? `1px solid var(--cyan-border)` : 'none',
                        }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ width: '2px', borderRadius: '2px', background: cfg.color, flexShrink: 0, alignSelf: 'stretch', minHeight: '14px' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: fontDisplay, fontSize: '12px', fontWeight: 600, color: C.text1, marginBottom: '4px', lineHeight: 1.4 }}>
                                {item.title}
                              </div>
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontFamily: fontMono, fontSize: '10px', color: cfg.color,
                                    textDecoration: 'none', display: 'inline-block', marginBottom: '4px',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                >
                                  Weiterlesen →
                                </a>
                              )}
                              {item.summary && (
                                <p style={{ fontFamily: fontMono, fontSize: '10px', color: C.text3, lineHeight: 1.5, marginBottom: '4px' }}>
                                  {item.summary}
                                </p>
                              )}
                              <div style={{ fontFamily: fontMono, fontSize: '10px', color: C.text3, display: 'flex', gap: '6px' }}>
                                <span>{item.source || 'Unknown'}</span>
                                {item.business_impact && <><span>·</span><span>{item.business_impact}</span></>}
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
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontFamily: fontMono, fontSize: '12px', color: C.text2, marginBottom: '8px' }}>Keine News verfügbar</div>
              <div style={{ fontFamily: fontMono, fontSize: '11px', color: C.text3 }}>Aggregator starten um Feed zu befüllen</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 16px', flexShrink: 0,
          borderTop: `1px solid var(--cyan-border)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: C.bg2,
        }}>
          <span style={{ fontFamily: fontMono, fontSize: '10px', color: C.text3 }}>Daily AI News</span>
          <button
            onClick={fetchNews}
            disabled={loading || !supabaseReady}
            style={{
              fontFamily: fontMono, fontSize: '11px', fontWeight: 600,
              padding: '5px 12px', borderRadius: '8px',
              background: loading || !supabaseReady ? 'rgba(34,211,238,0.1)' : 'rgba(34,211,238,0.15)',
              border: `1px solid ${C.cyanBorder}`,
              color: loading || !supabaseReady ? C.text3 : C.cyan,
              cursor: loading || !supabaseReady ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    </>
  )
}
