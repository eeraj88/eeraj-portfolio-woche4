import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function About() {
  const { istDunkel } = useContext(ThemeContext)

  // YouTube Video ID
  const youtubeVideoId = "NGS0H2DRKo8"

  const stats = [
    { value: '5+', label: 'Projekte' },
    { value: '20+', label: 'Skills' },
    { value: '3+', label: 'Jahre Sales' }
  ]

  const highlights = [
    'AI & Automation',
    'Frontend Development',
    'Digital Marketing',
    'B2B Strategie'
  ]

  return (
    <section id="about" className={`${istDunkel ? 'section-alt' : ''} py-20 px-4`}>
      <div className="container">
        {/* Section Head */}
        <div className="section-head reveal">
          <span className="eyebrow">01 — About</span>
          <h2 className="section-title">
            Über <em>mich</em>
          </h2>
        </div>

        {/* About Grid */}
        <div className="about-grid">
          {/* Video - NEUES DESIGN mit Cyan Border */}
          <div className="about-video reveal">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="Eeraj - Ein kreativer Nerd"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Body - NEUES DESIGN Styling */}
          <div className="about-body reveal">
            <h3>Sales trifft Tech.</h3>

            <p>
              <strong>Jahrelang als Sales & Account Manager</strong> + <strong>Consultant</strong> in der Automotive-Branche. Weiterentwicklung zum Profi für digitale Lösungen. Ich spreche beide Sprachen: Business und Code.
            </p>

            <p>
              Fokus aktuell: <strong>Webentwicklung</strong>, <strong>UI & UX</strong>, <strong>Automation</strong> und <strong>Marketing</strong>. Mit Tools wie n8n, Make und Tally baue ich Workflows, die echte Business-Probleme loesen.
            </p>

            {/* Highlight Tags - NEUES DESIGN */}
            <div className="about-tags">
              {highlights.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '8px' }}>
              {stats.map(({ value, label }, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    padding: '24px 20px 22px',
                    background: 'linear-gradient(160deg, #111111 0%, #161616 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(34,211,238,0.55)'
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.5), 0 0 28px rgba(34,211,238,0.15)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* corner glow */}
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(circle at 100% 0%, rgba(34,211,238,0.12) 0%, transparent 55%)',
                  }} />
                  <span style={{
                    position: 'absolute', top: '16px', right: '18px',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                    letterSpacing: '0.22em', color: '#71717a',
                  }}>
                    0{i + 1}
                  </span>
                  <div style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: '2.4rem', fontWeight: 600,
                    color: '#22d3ee',
                    textShadow: '0 0 24px rgba(34,211,238,0.45)',
                    lineHeight: 1, marginBottom: '8px',
                    position: 'relative', zIndex: 1,
                  }}>{value}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px', letterSpacing: '0.14em',
                    color: '#a1a1aa', textTransform: 'uppercase',
                    position: 'relative', zIndex: 1,
                  }}>{label}</div>
                  <div style={{
                    fontSize: '12px', color: '#71717a',
                    marginTop: '6px', position: 'relative', zIndex: 1,
                  }}>Erfahrung</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .section-alt { background: var(--bg-0, #050505); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 3; }
        section { padding: var(--sp-24, 6rem) 0; position: relative; }

        .section-head { margin-bottom: 56px; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #22d3ee;
        }
        .eyebrow::before {
          content: ""; width: 24px; height: 1px; background: #22d3ee;
          box-shadow: 0 0 6px rgba(34, 211, 238, 0.45);
        }
        .section-title {
          font-family: var(--font-display, 'Space Grotesk', system-ui, sans-serif);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.05;
          margin: 16px 0 12px;
          color: var(--text-0, #ffffff);
        }
        .section-title em {
          font-style: normal;
          color: #22d3ee;
          text-shadow: 0 0 24px rgba(34, 211, 238, 0.45);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 820px) {
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
          .about-video { max-width: 320px; justify-self: center; }
        }

        .about-video {
          width: 100%;
          aspect-ratio: 9 / 16;
          border-radius: var(--r-lg, 16px);
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(34,211,238,0.55);
          box-shadow:
            0 0 0 1px rgba(34,211,238,0.2),
            0 0 24px rgba(34,211,238,0.35),
            0 0 60px rgba(34,211,238,0.15),
            0 8px 40px rgba(0,0,0,0.6);
          animation: videoGlow 3s ease-in-out infinite;
        }
        @keyframes videoGlow {
          0%,100% { box-shadow: 0 0 0 1px rgba(34,211,238,0.2), 0 0 24px rgba(34,211,238,0.35), 0 0 60px rgba(34,211,238,0.15), 0 8px 40px rgba(0,0,0,0.6); border-color: rgba(34,211,238,0.55); }
          50%      { box-shadow: 0 0 0 1px rgba(34,211,238,0.3), 0 0 36px rgba(34,211,238,0.5),  0 0 80px rgba(34,211,238,0.22), 0 8px 40px rgba(0,0,0,0.6); border-color: rgba(34,211,238,0.75); }
        }
        .about-video iframe { width: 100%; height: 100%; border: 0; }
        .about-video::before {
          content: ""; position: absolute; inset: 0;
          border-radius: var(--r-lg, 16px);
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(34,211,238,0.25);
          z-index: 2;
        }

        .about-body h3 {
          font-family: var(--font-display, 'Space Grotesk', system-ui, sans-serif);
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--text-0, #ffffff);
          margin: 0 0 20px;
        }
        .about-body p {
          color: var(--text-2, #a1a1aa);
          font-size: 16px;
          line-height: 1.75;
          margin: 0 0 18px;
        }
        .about-body strong { color: #22d3ee; font-weight: 500; }

        .about-tags {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin: 28px 0 36px;
        }
        .tag {
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 12px;
          padding: 7px 14px;
          border-radius: var(--r-full, 9999px);
          background: var(--cyan-bg-soft, rgba(34, 211, 238, 0.06));
          border: 1px solid var(--cyan-border, rgba(34, 211, 238, 0.22));
          color: #22d3ee;
          transition: all 0.25s var(--ease, cubic-bezier(0.22, 0.61, 0.36, 1));
        }
        .tag:hover {
          border-color: #22d3ee;
          background: rgba(34, 211, 238, 0.12);
          box-shadow: var(--glow-sm, 0 0 12px var(--cyan-glow, rgba(34,211,238,0.45)]);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          padding: 0;
          background: transparent;
          border: none;
        }
        @media (max-width: 640px) { .stats { grid-template-columns: 1fr; } }
        .stat {
          position: relative;
          text-align: left;
          padding: 24px 22px 22px;
          background: linear-gradient(160deg, var(--bg-2, #111111) 0%, var(--bg-3, #161616) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--r-lg, 16px);
          overflow: hidden;
          transition: all 0.3s var(--ease, cubic-bezier(0.22, 0.61, 0.36, 1));
        }
        .stat::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 100% 0%, var(--stat-glow, rgba(34,211,238,0.18)) 0%, transparent 55%);
          opacity: 0.7;
          pointer-events: none;
          transition: opacity 0.3s var(--ease, cubic-bezier(0.22, 0.61, 0.36, 1));
        }
        .stat:hover {
          border-color: var(--cyan-border-strong, rgba(34, 211, 238, 0.55));
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.5), 0 0 28px var(--stat-glow, rgba(34,211,238,0.15));
        }
        .stat:hover::after { opacity: 1; }
        .stat-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(34,211,238,0.08);
          border: 1px solid var(--cyan-border-strong, rgba(34, 211,238, 0.55));
          color: #22d3ee;
          margin-bottom: 18px;
          box-shadow: 0 0 18px var(--cyan-glow, rgba(34, 211,238, 0.45));
          position: relative; z-index: 1;
          font-size: 18px;
        }
        .stat-num {
          position: absolute; top: 18px; right: 20px;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 10px;
          letter-spacing: 0.22em;
          color: var(--text-3, #71717a);
          z-index: 1;
        }
        .stat-value {
          font-family: var(--font-display, 'Space Grotesk', system-ui, sans-serif);
          font-size: 2.6rem;
          font-weight: 600;
          color: #22d3ee;
          text-shadow: 0 0 24px var(--cyan-glow, rgba(34, 211, 238, 0.45));
          line-height: 1;
          margin-bottom: 8px;
          position: relative; z-index: 1;
        }
        .stat-label {
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 11px;
          letter-spacing: 0.14em;
          color: var(--text-2, #a1a1aa);
          text-transform: uppercase;
          position: relative; z-index: 1;
        }
        .stat-sub {
          font-size: 12px;
          color: var(--text-3, #71717a);
          margin-top: 8px;
          position: relative; z-index: 1;
          line-height: 1.4;
        }

        .reveal {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
        }
        .reveal.in { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  )
}

export default About
