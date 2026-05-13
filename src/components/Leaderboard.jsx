import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import { subscribeToLeaderboard } from '../firebase'

const C = {
  cyan: '#22d3ee', cyanGlow: 'rgba(34,211,238,0.45)',
  cyanBorder: 'rgba(34,211,238,0.22)', cyanBorderStrong: 'rgba(34,211,238,0.55)',
  bg0: '#050505', bg1: '#0a0a0a', bg2: '#111111', bg3: '#161616',
  text0: '#ffffff', text1: '#e4e4e7', text2: '#a1a1aa', text3: '#71717a',
}
const fontMono = "'JetBrains Mono', ui-monospace, monospace"
const fontDisplay = "'Space Grotesk', system-ui, sans-serif"
const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

const RANK_COLORS = ['#fbbf24', '#94a3b8', '#f97316']

const getMedal = (i) => i < 3 ? ['01', '02', '03'][i] : `${String(i + 1).padStart(2, '0')}`

const getStarterEmoji = (id) => ({ 1:'🌱',4:'🔥',7:'💧',25:'⚡',133:'🦊',143:'😴',152:'🍃',155:'🔥',158:'🐊' })[id] || '🎮'

export default function Leaderboard({ isNav = false, iconOnly = false }) {
  const { istDunkel } = useContext(ThemeContext)
  const [trainers, setTrainers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => setIsLoading(false), 3000)
    const unsubscribe = subscribeToLeaderboard((data) => {
      clearTimeout(timeout)
      setTrainers(data)
      setIsLoading(false)
    }, 10)
    return () => { clearTimeout(timeout); unsubscribe() }
  }, [])

  const triggerStyle = {
    width: '38px', height: '38px', borderRadius: '10px',
    background: C.bg2,
    border: `1px solid ${C.cyanBorder}`,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: `all 0.25s ${ease}`,
    position: 'relative',
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        title="Trainer Ranking"
        style={triggerStyle}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = C.cyanBorderStrong
          e.currentTarget.style.boxShadow = `0 0 18px ${C.cyanGlow}`
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = C.cyanBorder
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'none'
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.8">
          {/* Cup body */}
          <path d="M6 3h12v7a6 6 0 0 1-12 0V3z"/>
          {/* Handles */}
          <path d="M6 6H3.5a2.5 2.5 0 0 0 2.5 4.5" strokeLinecap="round"/>
          <path d="M18 6h2.5a2.5 2.5 0 0 1-2.5 4.5" strokeLinecap="round"/>
          {/* Stem */}
          <path d="M12 16v-3" strokeLinecap="round"/>
          {/* Pedestal */}
          <path d="M9 19h6" strokeLinecap="round"/>
          <path d="M8 22h8" strokeLinecap="round"/>
          {/* Star accent inside cup */}
          <path d="M12 6l.8 2h2l-1.6 1.2.6 2L12 10l-1.8 1.2.6-2L9.2 8h2z" fill={C.cyan} stroke="none"/>
        </svg>
        {trainers.length > 0 && !iconOnly && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: C.cyan, color: C.bg0,
            fontFamily: fontMono, fontSize: '8px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{trainers.length}</span>
        )}
      </button>
    )
  }

  return (
    <div style={{ position: isNav ? 'absolute' : 'fixed', right: 0, top: isNav ? '48px' : undefined, bottom: isNav ? undefined : '80px', zIndex: 50 }}>
      {isNav && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsExpanded(false)} />
      )}
      <div style={{
        width: '300px', borderRadius: '16px', overflow: 'hidden',
        background: C.bg1,
        border: `1px solid ${C.cyanBorder}`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(34,211,238,0.06)`,
        position: 'relative', zIndex: 50,
      }}>
        {/* Cyan top-line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
        }} />

        {/* Header */}
        <div style={{
          padding: '16px 20px 14px',
          borderBottom: `1px solid rgba(255,255,255,0.05)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: fontMono, fontSize: '10px', letterSpacing: '0.18em', color: C.cyan, textTransform: 'uppercase', marginBottom: '4px' }}>
              // Ranking
            </div>
            <div style={{ fontFamily: fontDisplay, fontSize: '16px', fontWeight: 600, color: C.text0 }}>
              Trainer-Ranking
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: C.bg2, border: `1px solid ${C.cyanBorder}`,
              color: C.text2, cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Content */}
        <div style={{ padding: '12px', maxHeight: '320px', overflowY: 'auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontFamily: fontMono, fontSize: '11px', color: C.text3 }}>Lade Ranking...</div>
            </div>
          ) : trainers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontFamily: fontMono, fontSize: '13px', color: C.text2, marginBottom: '6px' }}>Noch keine Trainer</div>
              <div style={{ fontFamily: fontMono, fontSize: '11px', color: C.text3 }}>Sei der Erste!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {trainers.map((trainer, i) => (
                <div key={trainer.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  background: i === 0 ? 'rgba(251,191,36,0.06)' : C.bg2,
                  border: `1px solid ${i < 3 ? `${RANK_COLORS[i]}30` : 'rgba(255,255,255,0.05)'}`,
                  transition: `border-color 0.2s`,
                }}>
                  <span style={{
                    fontFamily: fontMono, fontSize: '11px', fontWeight: 700,
                    color: i < 3 ? RANK_COLORS[i] : C.text3,
                    minWidth: '22px', textAlign: 'center',
                  }}>{getMedal(i)}</span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{getStarterEmoji(trainer.pokemonId)}</span>
                      <span style={{ fontFamily: fontDisplay, fontSize: '13px', fontWeight: 600, color: C.text0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {trainer.name}
                      </span>
                      {trainer.isShiny && <span style={{ color: '#fbbf24' }}>✨</span>}
                    </div>
                    <div style={{ fontFamily: fontMono, fontSize: '10px', color: C.text3, marginTop: '2px', display: 'flex', gap: '6px' }}>
                      <span>Lv.{trainer.level || 1}</span>
                      <span>·</span>
                      <span>{trainer.wins || 0}W/{trainer.losses || 0}L</span>
                      {trainer.defeatedArenas?.length > 0 && <><span>·</span><span>{trainer.defeatedArenas.length}🏟️</span></>}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: fontMono, fontSize: '12px', fontWeight: 700, color: i === 0 ? '#fbbf24' : C.cyan }}>
                      {trainer.score?.toLocaleString() || 0}
                    </div>
                    <div style={{ fontFamily: fontMono, fontSize: '9px', color: C.text3 }}>Punkte</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px', borderTop: `1px solid rgba(255,255,255,0.05)`,
          fontFamily: fontMono, fontSize: '10px', color: C.text3, textAlign: 'center',
        }}>
          Echtzeit · Firebase
        </div>
      </div>
    </div>
  )
}
