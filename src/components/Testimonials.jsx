import { useContext } from 'react'
import testimonials from '../data/testimonials'
import { ThemeContext } from '../Context/ThemeContext'

const C = { cyan: '#22d3ee', cyanGlow: 'rgba(34,211,238,0.45)', cyanBorder: 'rgba(34,211,238,0.22)', cyanBorderStrong: 'rgba(34,211,238,0.55)', bg2: '#111111', text0: '#ffffff', text1: '#e4e4e7', text2: '#a1a1aa', text3: '#71717a' }
const fontDisplay = "'Space Grotesk', system-ui, sans-serif"
const fontMono = "'JetBrains Mono', ui-monospace, monospace"
const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

function TestiCard({ t }) {
  return (
    <div style={{
      flex: '0 0 380px',
      minHeight: '320px',
      display: 'flex', flexDirection: 'column',
      background: C.bg2,
      border: `1px solid ${C.cyanBorder}`,
      borderRadius: '24px',
      padding: '26px 26px 22px',
      position: 'relative',
      boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      transition: `transform 0.3s ${ease}, border-color 0.3s ${ease}, box-shadow 0.3s ${ease}`,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.cyanBorderStrong
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.5), 0 0 32px rgba(34,211,238,0.18)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.cyanBorder
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)'
      }}
    >
      {/* Quote mark */}
      <div style={{
        position: 'absolute', top: '8px', right: '22px',
        fontFamily: fontDisplay, fontSize: '72px', lineHeight: 1,
        color: C.cyanBorder, pointerEvents: 'none',
      }}>"</div>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {[...Array(t.bewertung || 5)].map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={C.cyan}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '14px', lineHeight: 1.7,
        color: C.text1,
        margin: '0 0 20px',
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: 5,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        "{t.text}"
      </blockquote>

      {/* Person */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: '16px' }}>
        <img
          src={t.bild}
          alt={t.name}
          onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}` }}
          style={{
            width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover',
            border: `2px solid ${C.cyanBorder}`,
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontFamily: fontDisplay, fontSize: '15px', fontWeight: 600, color: C.text0 }}>{t.name}</div>
          <div style={{ fontFamily: fontMono, fontSize: '11px', color: C.cyan, letterSpacing: '0.04em' }}>{t.rolle}</div>
        </div>
        {/* Project tag */}
        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            fontFamily: fontMono, fontSize: '10px', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: C.text3,
            padding: '4px 10px', borderRadius: '9999px',
            border: `1px solid rgba(255,255,255,0.07)`,
            whiteSpace: 'nowrap',
          }}>
            {t.projekt}
          </span>
        </div>
      </div>
    </div>
  )
}

function Testimonials() {
  const { istDunkel } = useContext(ThemeContext)

  // Duplicate array for seamless infinite scroll
  const doubled = [...testimonials, ...testimonials]
  const half1 = doubled
  const half2 = [...testimonials.slice(4), ...testimonials, ...testimonials.slice(0, 4)]

  return (
    <section id="testimonials" style={{
      padding: '96px 0',
      background: istDunkel ? '#050505' : '#f5f5f5',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 3 }}>
        {/* Section head */}
        <div style={{ marginBottom: '56px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: fontMono, fontSize: '12px', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: C.cyan,
          }}>
            <span style={{ width: '24px', height: '1px', background: C.cyan, boxShadow: `0 0 6px ${C.cyanGlow}`, display: 'inline-block' }} />
            05 — Referenzen
          </span>
          <h2 style={{
            fontFamily: fontDisplay,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05,
            margin: '16px 0 12px',
            color: istDunkel ? C.text0 : '#171717',
          }}>
            Kunden<em style={{ fontStyle: 'normal', color: C.cyan, textShadow: istDunkel ? `0 0 24px ${C.cyanGlow}` : 'none' }}>stimmen</em>
          </h2>
          <p style={{ color: istDunkel ? C.text2 : '#525252', fontSize: '16px' }}>
            Was Kunden über meine Arbeit sagen.
          </p>
        </div>
      </div>

      {/* Marquee stage */}
      <div style={{
        position: 'relative',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        overflow: 'hidden',
      }}>
        {/* Row 1 — left scroll */}
        <div style={{
          display: 'flex', gap: '22px',
          width: 'max-content', padding: '12px 0',
          animation: 'testiMarquee 70s linear infinite',
        }}>
          {half1.map((t, i) => <TestiCard key={`r1-${i}`} t={t} />)}
        </div>

      </div>

      <style>{`
        @keyframes testiMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes testiMarqueeR {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        /* Pause on hover */
        div:has(> div[style*="testiMarquee"]):hover > div { animation-play-state: paused !important; }
      `}</style>
    </section>
  )
}

export default Testimonials
