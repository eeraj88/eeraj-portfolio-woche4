import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

// Content 1:1 from design reference — hardcoded as specified
const SKILL_CARDS = [
  {
    size: 'lg',
    num: '01',
    cat: 'AI & Workflow',
    title: 'Automation Stack',
    tag: '// Schwerpunkt',
    chips: ['n8n','Make','Zapier','Webhooks & API','API-Integration','LLM Orchestration','RAG','Multimodale KI-Workflows','Workflow-Engineering','Prompt Engineering (CoT)'],
  },
  {
    size: 'wide',
    num: '02',
    cat: 'Frontend',
    title: 'Code & Interface',
    tag: null,
    chips: ['HTML','CSS','JavaScript','React','Tailwind CSS','Bootstrap','Git & GitHub','Python'],
  },
  {
    size: 'wide',
    num: '03',
    cat: 'Marketing',
    title: 'Growth',
    tag: null,
    chips: ['Social Media','Performance MKT','Content Strategie','SEO','GA4','E-Commerce','Kampagnen','E-Mail Marketing'],
  },
  {
    size: 'med',
    num: '04',
    cat: 'Sales',
    title: 'Business & B2B',
    tag: null,
    chips: ['B2B Vertrieb','Key Account Mgmt','Verhandlung','ERP Systeme','KPIs','Remote'],
  },
  {
    size: 'med',
    num: '05',
    cat: 'Design',
    title: 'Visual',
    tag: null,
    chips: ['Photoshop','Premiere Pro','After Effects','Canva','CapCut','Procreate'],
  },
  {
    size: 'med',
    num: '06',
    cat: 'Tools',
    title: 'Daily Drivers',
    tag: null,
    chips: ['HubSpot','Ableton Live','MS Office','Notion','Slack & Teams'],
  },
]

function Skills() {
  const { istDunkel } = useContext(ThemeContext)

  return (
    <section id="skills" style={{ padding: '96px 0', background: istDunkel ? '#0a0a0a' : '#fafafa', position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 3 }}>

        {/* Section head */}
        <div className="reveal" style={{ marginBottom: '56px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
            letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee',
          }}>
            <span style={{ width: '24px', height: '1px', background: '#22d3ee', boxShadow: '0 0 6px rgba(34,211,238,0.45)', display: 'inline-block' }} />
            02 — Stack
          </span>
          <h2 style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600,
            letterSpacing: '-0.025em', lineHeight: 1.05,
            margin: '16px 0 12px',
            color: istDunkel ? '#ffffff' : '#171717',
          }}>
            Meine{' '}
            <em style={{ fontStyle: 'normal', color: '#22d3ee', textShadow: istDunkel ? '0 0 24px rgba(34,211,238,0.45)' : 'none' }}>Skills</em>
          </h2>
          <p style={{ color: istDunkel ? '#a1a1aa' : '#525252', fontSize: '16px', maxWidth: '640px' }}>
            Technologien und Tools aus meinem Werkzeugkasten — von Frontend über Automation bis Business.
          </p>
        </div>

        {/* Bento grid */}
        <div className="skills-grid">
          {SKILL_CARDS.map((card) => (
            <div
              key={card.num}
              className={`skill-card skill-${card.size} reveal`}
              style={{
                background: card.size === 'lg'
                  ? 'radial-gradient(ellipse at 100% 0%, rgba(34,211,238,0.12) 0%, transparent 55%), #111111'
                  : '#111111',
                border: `1px solid ${card.size === 'lg' ? 'rgba(34,211,238,0.22)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '16px', padding: '24px',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.22,0.61,0.36,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(34,211,238,0.55)'
                e.currentTarget.style.background = 'radial-gradient(ellipse at 100% 0%, rgba(34,211,238,0.12) 0%, transparent 55%), #161616'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), 0 0 24px rgba(34,211,238,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = card.size === 'lg' ? 'rgba(34,211,238,0.22)' : 'rgba(255,255,255,0.05)'
                e.currentTarget.style.background = card.size === 'lg'
                  ? 'radial-gradient(ellipse at 100% 0%, rgba(34,211,238,0.12) 0%, transparent 55%), #111111'
                  : '#111111'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Top shimmer on hover */}
              <div className="card-topline" style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.55), transparent)',
                opacity: 0, transition: 'opacity 0.3s',
              }} />

              {/* Head */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                marginBottom: '16px',
                fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                letterSpacing: '0.16em', color: '#71717a', textTransform: 'uppercase',
              }}>
                <span style={{ color: '#22d3ee', fontWeight: 600 }}>{card.num}</span>
                <span>{card.cat}</span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'Space Grotesk, system-ui, sans-serif',
                fontSize: card.size === 'lg' ? '28px' : '18px',
                fontWeight: 600, margin: card.tag ? '0 0 8px' : '0 0 16px',
                color: '#ffffff', letterSpacing: '-0.01em',
              }}>
                {card.title}
              </h3>

              {/* Schwerpunkt tag (lg only) */}
              {card.tag && (
                <span style={{
                  display: 'block',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                  color: '#22d3ee', letterSpacing: '0.14em',
                  textTransform: 'uppercase', marginBottom: '16px',
                }}>
                  {card.tag}
                </span>
              )}

              {/* Chips */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '7px',
                marginTop: card.size === 'lg' ? 'auto' : '0',
              }}>
                {card.chips.map(chip => (
                  <span
                    key={chip}
                    className="skill-chip"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                      padding: '5px 11px', borderRadius: '9999px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#e4e4e7', whiteSpace: 'nowrap',
                      transition: 'all 0.2s cubic-bezier(0.22,0.61,0.36,1)',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(34,211,238,0.55)'
                      e.currentTarget.style.color = '#22d3ee'
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(34,211,238,0.15)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.color = '#e4e4e7'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: minmax(180px, auto);
          gap: 16px;
        }
        .skill-lg   { grid-column: span 3; grid-row: span 2; }
        .skill-wide { grid-column: span 3; }
        .skill-med  { grid-column: span 2; }
        .skill-card:hover .card-topline { opacity: 1; }
        @media (max-width: 900px) {
          .skills-grid { grid-template-columns: repeat(4, 1fr); }
          .skill-lg   { grid-column: span 4; grid-row: span 2; }
          .skill-wide { grid-column: span 4; }
          .skill-med  { grid-column: span 2; }
        }
        @media (max-width: 520px) {
          .skills-grid { grid-template-columns: 1fr !important; grid-auto-rows: auto !important; }
          .skill-lg, .skill-wide, .skill-med { grid-column: span 1 !important; grid-row: auto !important; }
        }
      `}</style>
    </section>
  )
}

export default Skills
