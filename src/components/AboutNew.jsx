function AboutNew() {
  const stats = [
    {
      icon: '🚀',
      value: '3+',
      label: 'Jahre Erfahrung',
      sub: 'React & Frontend'
    },
    {
      icon: '💼',
      value: '20+',
      label: 'Projekte',
      sub: 'Realisiert'
    },
    {
      icon: '⚡',
      value: '100%',
      label: 'Engagement',
      sub: 'Für Qualität'
    }
  ]

  return (
    <section id="about" className="section-alt">
      <div className="container">
        {/* Section Head */}
        <div className="section-head reveal">
          <span className="eyebrow">Über mich</span>
          <h2 className="section-title">
            Digital Creative & <em>Frontend Developer</em>
          </h2>
          <p className="section-sub">
            Ich kreire moderne, performante Web-Anwendungen mit Fokus auf User Experience und technische Exzellenz.
          </p>
        </div>

        {/* About Grid */}
        <div className="about-grid">
          {/* Video */}
          <div className="about-video reveal">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="About Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Body */}
          <div className="about-body reveal">
            <h3>Hi, ich bin Eeraj 👋</h3>
            <p>
              Ich bin ein <strong>Frontend Developer</strong> aus Deutschland mit einer Leidenschaft für
              moderne Web-Technologien und intuitives Design. Mein Fokus liegt auf der Entwicklung von
              <strong> React-Anwendungen</strong>, die nicht nur funktional, sondern auch visuell beeindruckend sind.
            </p>
            <p>
              Mit Erfahrung in <strong>TypeScript</strong>, <strong>Tailwind CSS</strong> und modernen
              Build-Tools schaffe ich skalierbare Lösungen. Ich glaube daran, dass guter Code
              und gutes Design Hand in Hand gehen.
            </p>

            {/* Tags */}
            <div className="about-tags">
              {['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js', 'UI/UX'].map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            {/* Stats */}
            <div className="stats">
              {stats.map((stat, i) => (
                <div key={i} className="stat" style={{ '--stat-glow': 'rgba(34,211,238,0.18)' }}>
                  <div className="stat-icon">{stat.icon}</div>
                  <span className="stat-num">0{i + 1}</span>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-sub">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .section-head { margin-bottom: 56px; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cyan);
        }
        .eyebrow::before {
          content: ""; width: 24px; height: 1px; background: var(--cyan);
          box-shadow: 0 0 6px var(--cyan-glow);
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.05;
          margin: 16px 0 12px;
          color: var(--text-0);
        }
        .section-title em {
          font-style: normal;
          color: var(--cyan);
          text-shadow: 0 0 24px var(--cyan-glow);
        }
        .section-sub {
          color: var(--text-2);
          max-width: 640px;
          font-size: 16px;
        }

        .section-alt { background: var(--bg-0); }

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
          border-radius: var(--r-lg);
          overflow: hidden;
          position: relative;
          border: 1px solid var(--cyan-border);
          box-shadow: var(--shadow-card), 0 0 40px rgba(34,211,238,0.1);
        }
        .about-video iframe { width: 100%; height: 100%; border: 0; }
        .about-video::before {
          content: ""; position: absolute; inset: 0;
          border-radius: var(--r-lg);
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(34,211,238,0.2);
          z-index: 2;
        }

        .about-body h3 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--text-0);
          margin: 0 0 20px;
        }
        .about-body p {
          color: var(--text-2);
          font-size: 16px;
          line-height: 1.75;
          margin: 0 0 18px;
        }
        .about-body strong { color: var(--cyan); font-weight: 500; }

        .about-tags {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin: 28px 0 36px;
        }
        .tag {
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 7px 14px;
          border-radius: var(--r-full);
          background: var(--cyan-bg-soft);
          border: 1px solid var(--cyan-border);
          color: var(--cyan);
          transition: all 0.25s var(--ease);
        }
        .tag:hover {
          border-color: var(--cyan);
          background: rgba(34, 211, 238, 0.12);
          box-shadow: var(--glow-sm);
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
          background: linear-gradient(160deg, var(--bg-2) 0%, var(--bg-3) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--r-lg);
          overflow: hidden;
          transition: all 0.3s var(--ease);
        }
        .stat::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 100% 0%, var(--stat-glow, rgba(34,211,238,0.18)) 0%, transparent 55%);
          opacity: 0.7;
          pointer-events: none;
          transition: opacity 0.3s var(--ease);
        }
        .stat:hover {
          border-color: var(--cyan-border-strong);
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.5), 0 0 28px var(--stat-glow, rgba(34,211,238,0.15));
        }
        .stat:hover::after { opacity: 1; }
        .stat-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(34,211,238,0.08);
          border: 1px solid var(--cyan-border-strong);
          color: var(--cyan);
          margin-bottom: 18px;
          box-shadow: 0 0 18px var(--cyan-glow);
          position: relative; z-index: 1;
          font-size: 18px;
        }
        .stat-num {
          position: absolute; top: 18px; right: 20px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          color: var(--text-3);
          z-index: 1;
        }
        .stat-value {
          font-family: var(--font-display);
          font-size: 2.6rem;
          font-weight: 600;
          color: var(--cyan);
          text-shadow: 0 0 24px var(--cyan-glow);
          line-height: 1;
          margin-bottom: 8px;
          position: relative; z-index: 1;
        }
        .stat-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          color: var(--text-2);
          text-transform: uppercase;
          position: relative; z-index: 1;
        }
        .stat-sub {
          font-size: 12px;
          color: var(--text-3);
          margin-top: 8px;
          position: relative; z-index: 1;
          line-height: 1.4;
        }
      `}</style>
    </section>
  )
}

export default AboutNew
