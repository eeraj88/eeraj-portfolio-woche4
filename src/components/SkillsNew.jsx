function SkillsNew() {
  const skills = [
    {
      size: 'size-lg',
      num: '01',
      title: 'Frontend Development',
      chips: ['React', 'TypeScript', 'Next.js', 'Vue', 'Tailwind CSS', 'Vite']
    },
    {
      size: 'size-med',
      num: '02',
      title: 'Backend & APIs',
      chips: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'Supabase', 'Firebase']
    },
    {
      size: 'size-med',
      num: '03',
      title: 'Tools & DevOps',
      chips: ['Git', 'Docker', 'CI/CD', 'Webpack', 'ESLint', 'Prettier']
    },
    {
      size: 'size-wide',
      num: '04',
      title: 'UI/UX Design',
      chips: ['Figma', 'Adobe XD', 'Design Systems', 'Wireframing', 'Prototyping']
    },
    {
      size: 'size-wide',
      num: '05',
      title: 'Datenbanken',
      chips: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Drizzle']
    },
    {
      size: 'size-med',
      num: '06',
      title: 'Testing',
      chips: ['Jest', 'Cypress', 'Vitest', 'Playwright', 'React Testing Library']
    }
  ]

  return (
    <section id="skills">
      <div className="container">
        {/* Section Head */}
        <div className="section-head reveal">
          <span className="eyebrow">Skills</span>
          <h2 className="section-title">
            Tech Stack & <em>Expertise</em>
          </h2>
          <p className="section-sub">
            Moderne Technologien für performante, skalierbare Anwendungen.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skills.map((skill, i) => (
            <div key={i} className={`skill-card ${skill.size} reveal`}>
              <div className="skill-head">
                <span className="num">{skill.num}</span>
                <span>//</span>
              </div>
              {skill.size === 'size-lg' && (
                <span className="skill-tag">Kernkompetenzen</span>
              )}
              <h3>{skill.title}</h3>
              <div className="skill-chips">
                {skill.chips.map(chip => (
                  <span key={chip} className="chip">{chip}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        section { padding: var(--sp-24) 0; position: relative; }
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

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: minmax(180px, auto);
          gap: 16px;
        }
        @media (max-width: 900px) { .skills-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 520px) { .skills-grid { grid-template-columns: 1fr; grid-auto-rows: auto; } }

        .skill-card {
          background: var(--bg-2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--r-lg);
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s var(--ease);
          display: flex; flex-direction: column;
        }
        .skill-card.size-lg   { grid-column: span 3; grid-row: span 2; }
        .skill-card.size-wide { grid-column: span 3; }
        .skill-card.size-med  { grid-column: span 2; }
        @media (max-width: 900px) {
          .skill-card.size-lg   { grid-column: span 4; grid-row: span 2; }
          .skill-card.size-wide { grid-column: span 4; }
          .skill-card.size-med  { grid-column: span 2; }
        }
        @media (max-width: 520px) {
          .skill-card.size-lg, .skill-card.size-wide, .skill-card.size-med { grid-column: span 1; grid-row: auto; }
        }

        .skill-card.size-lg {
          background:
            radial-gradient(ellipse at 100% 0%, rgba(34,211,238,0.12) 0%, transparent 55%),
            var(--bg-2);
          border-color: var(--cyan-border);
        }
        .skill-card.size-lg h3 { font-size: 28px; margin-bottom: 8px; }
        .skill-card.size-lg .skill-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--cyan);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: block;
        }
        .skill-card.size-lg .skill-chips { margin-top: auto; }

        .skill-card:hover {
          border-color: var(--cyan-border-strong);
          background: var(--bg-3);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 24px rgba(34,211,238,0.08);
        }
        .skill-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan-border-strong), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .skill-card:hover::before { opacity: 1; }

        .skill-head {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--text-3);
          text-transform: uppercase;
        }
        .skill-head .num {
          color: var(--cyan); font-weight: 600;
        }
        .skill-card h3 {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px;
          color: var(--text-0);
          letter-spacing: -0.01em;
        }
        .skill-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .chip {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 5px 11px;
          border-radius: var(--r-full);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-1);
          transition: all 0.2s var(--ease);
          white-space: nowrap;
        }
        .chip:hover {
          border-color: var(--cyan-border-strong);
          color: var(--cyan);
          box-shadow: 0 0 10px rgba(34,211,238,0.15);
        }
      `}</style>
    </section>
  )
}

export default SkillsNew
