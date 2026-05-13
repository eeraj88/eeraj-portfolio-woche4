import { useState } from 'react'

function ProjectsNew() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = ['all', 'React', 'TypeScript', 'Next.js', 'Node.js', 'UI/UX']

  const projects = [
    {
      id: 1,
      num: '01',
      title: 'E-Commerce Platform',
      desc: 'Vollständige E-Commerce Lösung mit React, Node.js und PostgreSQL. Features: Warenkorb, Checkout, Payment Integration.',
      tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      image: '/api/placeholder/600/400',
      demo: '#',
      github: '#'
    },
    {
      id: 2,
      num: '02',
      title: 'AI Dashboard',
      desc: 'Real-time Dashboard für AI-Metriken mit WebSocket-Integration und automatischen Updates.',
      tech: ['Next.js', 'WebSocket', 'Tailwind', 'Chart.js'],
      image: '/api/placeholder/600/400',
      demo: '#',
      github: '#'
    },
    {
      id: 3,
      num: '03',
      title: 'Portfolio v1',
      desc: 'Mein erstes Portfolio mit Animationen, Dark Mode und responsive Design.',
      tech: ['React', 'CSS3', 'Framer Motion'],
      image: '/api/placeholder/600/400',
      demo: '#',
      github: '#'
    },
    {
      id: 4,
      num: '04',
      title: 'Task Management',
      desc: 'Kanban-Board mit Drag & Drop, Team-Collaboration und Real-time Sync.',
      tech: ['Vue', 'Firebase', 'Tailwind'],
      image: '/api/placeholder/600/400',
      demo: '#',
      github: '#'
    },
    {
      id: 5,
      num: '05',
      title: 'Weather App',
      desc: 'Wetter-App mit Standort-basierten Vorhersagen und animierten Icons.',
      tech: ['React', 'OpenWeather API', 'CSS3'],
      image: '/api/placeholder/600/400',
      demo: '#',
      github: '#'
    },
    {
      id: 6,
      num: '06',
      title: 'Chat Application',
      desc: 'Real-time Chat mit Rooms, Direct Messages und File Sharing.',
      tech: ['Next.js', 'Socket.io', 'MongoDB'],
      image: '/api/placeholder/600/400',
      demo: '#',
      github: '#'
    }
  ]

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.tech.includes(activeFilter))

  return (
    <section id="projects" className="section-alt">
      <div className="container">
        {/* Section Head */}
        <div className="section-head reveal">
          <span className="eyebrow">Projekte</span>
          <h2 className="section-title">
            Selected Work & <em>Projects</em>
          </h2>
          <p className="section-sub">
            Eine Auswahl meiner besten Projekte und Implementierungen.
          </p>
        </div>

        {/* Filter */}
        <div className="filter-row reveal">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project, i) => (
            <div key={project.id} className="project-card reveal">
              <div className="project-image">
                <span className="project-num">{project.num}</span>
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                />
              </div>
              <div className="project-body">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tech">
                  {project.tech.map(t => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
                <div className="project-footer">
                  <span className="project-cta">
                    View Project
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </span>
                  <div className="project-links">
                    <a href={project.demo} target="_blank" rel="noopener">Demo</a>
                    <span>•</span>
                    <a href={project.github} target="_blank" rel="noopener">GitHub</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        section { padding: var(--sp-24) 0; position: relative; }
        .section-alt { background: var(--bg-0); }
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

        .filter-row {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px;
        }
        .filter-btn {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.04em;
          padding: 9px 18px;
          border-radius: var(--r-full);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-2);
          transition: all 0.25s var(--ease);
        }
        .filter-btn:hover {
          color: var(--cyan); border-color: var(--cyan-border-strong);
        }
        .filter-btn.active {
          background: var(--cyan);
          color: var(--bg-0);
          border-color: var(--cyan);
          box-shadow: 0 0 16px var(--cyan-glow);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .projects-grid { grid-template-columns: 1fr; } }

        .project-card {
          background: var(--bg-2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--r-lg);
          overflow: hidden;
          position: relative;
          transition: all 0.35s var(--ease);
          cursor: pointer;
          display: flex; flex-direction: column;
        }
        .project-card::before {
          content: ""; position: absolute; inset: 0;
          border-radius: var(--r-lg); pointer-events: none;
          border: 1px solid transparent;
          transition: border-color 0.3s var(--ease);
          z-index: 3;
        }
        .project-card:hover {
          transform: translateY(-6px);
          border-color: var(--cyan-border-strong);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(34,211,238,0.15);
        }
        .project-card:hover::before { border-color: var(--cyan); box-shadow: 0 0 20px var(--cyan-glow); }

        .project-image {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: var(--bg-3);
        }
        .project-image img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s var(--ease), filter 0.4s;
          filter: grayscale(20%) brightness(0.85);
        }
        .project-card:hover .project-image img {
          transform: scale(1.06);
          filter: grayscale(0%) brightness(1);
        }
        .project-image::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.7) 100%);
        }
        .project-num {
          position: absolute; top: 14px; left: 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--cyan);
          background: rgba(5,5,5,0.7);
          padding: 4px 10px;
          border-radius: var(--r-full);
          border: 1px solid var(--cyan-border);
          z-index: 2;
        }

        .project-body {
          padding: 24px;
          display: flex; flex-direction: column;
          flex: 1;
        }
        .project-title {
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 600;
          color: var(--text-0);
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }
        .project-desc {
          font-size: 14px;
          color: var(--text-2);
          margin: 0 0 18px;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .project-tech { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
        .project-tech .chip { font-size: 10px; padding: 4px 9px; }

        .project-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .project-cta {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--cyan);
          letter-spacing: 0.04em;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .project-cta:hover { gap: 10px; }
        .project-links { display: flex; gap: 12px; font-family: var(--font-mono); font-size: 12px; }
        .project-links a { color: var(--text-3); transition: color 0.2s; }
        .project-links a:hover { color: var(--cyan); }

        .chip {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 5px 11px;
          border-radius: var(--r-full);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-1);
        }
      `}</style>
    </section>
  )
}

export default ProjectsNew
