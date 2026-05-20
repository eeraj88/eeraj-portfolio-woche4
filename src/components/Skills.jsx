import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'
import { useLanguage } from '../Context/LanguageContext'
import translationsDe from '../translations/de'
import translationsEn from '../translations/en'

const translations = {
  de: translationsDe,
  en: translationsEn
}

const getSkillCards = (t) => [
  {
    size: 'lg',
    num: '01',
    cat: 'AI & Workflow',
    title: 'Automation Stack',
    tag: t.skills.focus,
    chips: ['n8n','Make','Zapier','Webhooks & API','API-Integration','LLM Orchestration','RAG',
      t.skills.chips.multimodalAI, t.skills.chips.workflowEng, 'Prompt Engineering (CoT)'],
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
    chips: ['Social Media','Performance MKT', t.skills.chips.contentStrategy,'SEO','GA4','E-Commerce', t.skills.chips.campaigns,'E-Mail Marketing'],
  },
  {
    size: 'med',
    num: '04',
    cat: 'Sales',
    title: 'Business & B2B',
    tag: null,
    chips: [t.skills.chips.b2bSales,'Key Account Mgmt', t.skills.chips.negotiation, t.skills.chips.erpSystems,'KPIs','Remote'],
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
  const { language } = useLanguage()
  const t = translations[language]
  const skillCards = getSkillCards(t)

  return (
    <section id="skills" style={{ padding: '96px 0', background: 'transparent', position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 3 }}>

        {/* Section head */}
        <div className="reveal" style={{ marginBottom: '56px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
            letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cyan)',
          }}>
            <span style={{ width: '24px', height: '1px', background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan-glow)', display: 'inline-block' }} />
            {t.skills.eyebrow}
          </span>
          <h2 style={{
            fontFamily: 'Space Grotesk, system-ui, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600,
            letterSpacing: '-0.025em', lineHeight: 1.05,
            margin: '16px 0 12px',
            color: 'var(--text-0)',
          }}>
            {t.skills.headingPre}<em style={{ fontStyle: 'normal', color: 'var(--cyan)', textShadow: '0 0 24px var(--cyan-glow)' }}>{t.skills.headingEm}</em>
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '16px', maxWidth: '640px' }}>
            {t.skills.desc}
          </p>
        </div>

        {/* Bento grid */}
        <div className="skills-grid">
          {skillCards.map((card) => (
            <div
              key={card.num}
              className={`skill-card skill-${card.size} reveal`}
              style={{
                background: card.size === 'lg'
                  ? 'radial-gradient(ellipse at 100% 0%, var(--cyan-bg-soft) 0%, transparent 55%), var(--bg-2)'
                  : 'var(--bg-2)',
                border: `1px solid ${card.size === 'lg' ? 'var(--cyan-border)' : 'var(--cyan-border)'}`,
                borderRadius: '16px', padding: '24px',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.22,0.61,0.36,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--cyan-border-strong)'
                e.currentTarget.style.background = 'radial-gradient(ellipse at 100% 0%, var(--cyan-bg-soft) 0%, transparent 55%), var(--bg-3)'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-card), var(--glow-sm)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--cyan-border)'
                e.currentTarget.style.background = card.size === 'lg'
                  ? 'radial-gradient(ellipse at 100% 0%, var(--cyan-bg-soft) 0%, transparent 55%), var(--bg-2)'
                  : 'var(--bg-2)'
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
                letterSpacing: '0.16em', color: 'var(--text-3)', textTransform: 'uppercase',
              }}>
                <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{card.num}</span>
                <span>{card.cat}</span>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'Space Grotesk, system-ui, sans-serif',
                fontSize: card.size === 'lg' ? '28px' : '18px',
                fontWeight: 600, margin: card.tag ? '0 0 8px' : '0 0 16px',
                color: 'var(--text-0)', letterSpacing: '-0.01em',
              }}>
                {card.title}
              </h3>

              {/* Schwerpunkt tag (lg only) */}
              {card.tag && (
                <span style={{
                  display: 'block',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
                  color: 'var(--cyan)', letterSpacing: '0.14em',
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
                      border: '1px solid var(--cyan-border)',
                      color: 'var(--text-1)', whiteSpace: 'nowrap',
                      transition: 'all 0.2s cubic-bezier(0.22,0.61,0.36,1)',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--cyan-border-strong)'
                      e.currentTarget.style.color = 'var(--cyan)'
                      e.currentTarget.style.boxShadow = 'var(--glow-sm)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--cyan-border)'
                      e.currentTarget.style.color = 'var(--text-1)'
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
