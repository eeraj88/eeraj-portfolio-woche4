function TestimonialsNew() {
  const testimonials = [
    {
      name: 'Anna Schmidt',
      role: 'Product Manager',
      company: 'TechStart GmbH',
      image: '/api/placeholder/100/100',
      stars: 5,
      quote: 'Eeraj hat unsere Web-App komplett überarbeitet. Die Performance ist exzellent und das Design modern.',
      project: 'E-Commerce Platform'
    },
    {
      name: 'Max Müller',
      role: 'CTO',
      company: 'Innovate Labs',
      image: '/api/placeholder/100/100',
      stars: 5,
      quote: 'Professionelle Arbeit, sauberer Code und immer pünktlich. Eeraj ist ein echter Team-Player.',
      project: 'AI Dashboard'
    },
    {
      name: 'Sophie Weber',
      role: 'UX Designer',
      company: 'Design Co',
      image: '/api/placeholder/100/100',
      stars: 5,
      quote: 'Die Umsetzung meiner Designs war pixelgenau. Eeraj versteht moderne UI/UX perfekt.',
      project: 'Portfolio v1'
    },
    {
      name: 'Thomas Fischer',
      role: 'Startup Founder',
      company: 'TechVenture',
      image: '/api/placeholder/100/100',
      stars: 5,
      quote: 'Schnelle, zuverlässige Arbeit. Eeraj hat unsere MVP in rekordzeit fertiggestellt.',
      project: 'Task Management'
    },
    {
      name: 'Lisa Wagner',
      role: 'Marketing Lead',
      company: 'BrandBoost',
      image: '/api/placeholder/100/100',
      stars: 5,
      quote: 'Creative Lösungen und proaktive Kommunikation. Echter Mehrwert für unser Team.',
      project: 'Weather App'
    },
    {
      name: 'David Klein',
      role: 'Software Architect',
      company: 'CodeCraft',
      image: '/api/placeholder/100/100',
      stars: 5,
      quote: 'Exzellente Code-Qualität und gute Dokumentation. Echte Freude zusammenzuarbeiten.',
      project: 'Chat Application'
    }
  ]

  // Duplicate for infinite marquee
  const marqueeItems = [...testimonials, ...testimonials]

  return (
    <section id="testimonials">
      <div className="container">
        {/* Section Head */}
        <div className="section-head reveal">
          <span className="eyebrow">Testimonials</span>
          <h2 className="section-title">
            What Clients & <em>Partners Say</em>
          </h2>
          <p className="section-sub">
            Feedback von Kollegen und Kunden aus meinen Projekten.
          </p>
        </div>

        {/* Marquee */}
        <div className="testi-stage">
          <div className="testi-row" style={{ '--testi-duration': '70s' }}>
            {marqueeItems.map((item, i) => (
              <div key={`${item.name}-${i}`} className="testi-card">
                <div className="testi-head">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="testi-avatar"
                  />
                  <div className="testi-meta">
                    <div className="testi-name">{item.name}</div>
                    <div className="testi-role">{item.role}</div>
                  </div>
                </div>
                <div className="testi-stars">
                  {[...Array(item.stars)].map((_, j) => (
                    <svg key={j} viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="testi-quote">{item.quote}</p>
                <span className="testi-project-tag">{item.project}</span>
              </div>
            ))}
          </div>
          <div className="testi-row row-2" style={{ '--testi-duration-2': '85s' }}>
            {marqueeItems.reverse().map((item, i) => (
              <div key={`${item.name}-${i}-2`} className="testi-card">
                <div className="testi-head">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="testi-avatar"
                  />
                  <div className="testi-meta">
                    <div className="testi-name">{item.name}</div>
                    <div className="testi-role">{item.role}</div>
                  </div>
                </div>
                <div className="testi-stars">
                  {[...Array(item.stars)].map((_, j) => (
                    <svg key={j} viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="testi-quote">{item.quote}</p>
                <span className="testi-project-tag">{item.project}</span>
              </div>
            ))}
          </div>
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

        .testi-stage {
          position: relative;
          margin: 0 -24px;
          -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
                  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
        }
        .testi-row {
          display: flex;
          gap: 22px;
          width: max-content;
          padding: 12px 0;
          animation: testiMarquee var(--testi-duration, 70s) linear infinite;
          will-change: transform;
        }
        .testi-row.row-2 {
          animation-direction: reverse;
          animation-duration: var(--testi-duration-2, 85s);
          margin-top: 22px;
        }
        .testi-stage:hover .testi-row { animation-play-state: paused; }
        @keyframes testiMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .testi-card {
          flex: 0 0 380px;
          min-height: 340px;
          display: flex;
          flex-direction: column;
          background: var(--bg-2);
          border: 1px solid var(--cyan-border);
          border-radius: var(--r-xl);
          padding: 26px 26px 22px;
          position: relative;
          box-shadow: var(--shadow-card);
          transition: transform 0.3s var(--ease), border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);
        }
        .testi-card .testi-project-tag { margin-top: auto; align-self: flex-start; }
        .testi-card:hover {
          border-color: var(--cyan-border-strong);
          transform: translateY(-4px);
          box-shadow: var(--shadow-card), 0 0 32px rgba(34,211,238,0.18);
        }
        .testi-card::before {
          content: """;
          position: absolute; top: 8px; right: 22px;
          font-family: var(--font-display);
          font-size: 64px; line-height: 1;
          color: var(--cyan); opacity: 0.25;
          text-shadow: 0 0 24px var(--cyan-glow);
        }
        .testi-head {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 16px;
        }
        .testi-avatar {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 1.5px solid var(--cyan);
          box-shadow: 0 0 16px var(--cyan-glow);
          object-fit: cover;
          flex-shrink: 0;
        }
        .testi-meta { min-width: 0; }
        .testi-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          color: var(--text-0);
          line-height: 1.2;
        }
        .testi-role {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--cyan);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .testi-stars { display: flex; gap: 3px; margin-bottom: 12px; }
        .testi-stars svg { width: 13px; height: 13px; fill: var(--cyan); filter: drop-shadow(0 0 3px var(--cyan-glow)); }
        .testi-quote {
          color: var(--text-1);
          font-style: italic;
          line-height: 1.6;
          font-size: 14px;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .testi-project-tag {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-3);
          padding: 5px 11px;
          border-radius: var(--r-full);
          border: 1px solid rgba(255,255,255,0.08);
          display: inline-block;
        }
        @media (max-width: 720px) {
          .testi-card { flex: 0 0 300px; }
        }
      `}</style>
    </section>
  )
}

export default TestimonialsNew
