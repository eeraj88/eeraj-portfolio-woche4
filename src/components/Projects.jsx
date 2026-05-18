import { useState, useContext } from 'react'
import projects from '../data/projects'
import { ThemeContext } from '../Context/ThemeContext'
import { useLanguage } from '../Context/LanguageContext'
import translationsDe from '../translations/de'
import translationsEn from '../translations/en'
import { giveXP } from './PokemonBuddy'
import LikeButton from './LikeButton'
import Comments from './Comments'

const translations = {
  de: translationsDe,
  en: translationsEn
}

const C = { cyan: 'var(--cyan)', cyanGlow: 'var(--cyan-glow)', cyanBorder: 'var(--cyan-border)', cyanBorderStrong: 'var(--cyan-border-strong)', cyanBg: 'var(--cyan-bg-soft)', bg2: 'var(--bg-2)', bg3: 'var(--bg-3)', text0: 'var(--text-0)', text1: 'var(--text-1)', text2: 'var(--text-2)', text3: 'var(--text-3)' }
const fontDisplay = "'Space Grotesk', system-ui, sans-serif"
const fontMono = "'JetBrains Mono', ui-monospace, monospace"
const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: fontMono, fontSize: '12px', letterSpacing: '0.04em',
        padding: '9px 18px', borderRadius: '9999px',
        background: active ? C.cyan : 'transparent',
        border: `1px solid ${active ? 'var(--cyan)' : 'var(--cyan-border)'}`,
        color: active ? 'var(--bg-0)' : 'var(--text-2)',
        boxShadow: active ? `0 0 16px ${C.cyanGlow}` : 'none',
        cursor: 'pointer',
        transition: `all 0.25s ${ease}`,
        fontWeight: active ? 600 : 400,
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--cyan)'; e.currentTarget.style.borderColor = 'var(--cyan-border-strong)' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--cyan-border)' } }}
    >
      {label}
    </button>
  )
}

function ProjectCard({ projekt, idx, onClick, detailsLabel, categoryLabel }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={() => onClick(projekt)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.bg2,
        border: `1px solid ${hov ? 'var(--cyan-border-strong)' : 'var(--cyan-border)'}`,
        borderRadius: '16px', overflow: 'hidden',
        position: 'relative',
        transform: hov ? 'translateY(-6px)' : 'none',
        boxShadow: hov ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(34,211,238,0.15)` : 'none',
        transition: `all 0.35s ${ease}`,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Inner glow border on hover */}
      {hov && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '16px',
          border: `1px solid ${C.cyan}`,
          boxShadow: `0 0 20px ${C.cyanGlow}`,
          pointerEvents: 'none', zIndex: 3,
        }} />
      )}

      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: C.bg3 }}>
        {projekt.bild ? (
          <img
            src={projekt.bild}
            alt={projekt.titel}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hov ? 'scale(1.06)' : 'scale(1)',
              filter: hov ? 'grayscale(0%) brightness(1)' : 'grayscale(20%) brightness(0.85)',
              transition: `transform 0.6s ${ease}, filter 0.4s`,
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, transparent 70%)`,
          }}>
            <span style={{ fontFamily: fontMono, fontSize: '48px', fontWeight: 700, color: C.cyanBorder }}>
              {String(projekt.id).padStart(2, '0')}
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.7) 100%)',
          opacity: hov ? 1 : 0, transition: 'opacity 0.3s',
        }} />
        {/* Number badge */}
        <div style={{
          position: 'absolute', top: '14px', left: '16px',
          fontFamily: fontMono, fontSize: '11px', letterSpacing: '0.1em',
          color: C.cyan,
          background: 'rgba(5,5,5,0.7)',
          padding: '4px 10px', borderRadius: '9999px',
          border: `1px solid ${C.cyanBorder}`,
          zIndex: 2,
        }}>
          {String(idx + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: fontDisplay, fontSize: '19px', fontWeight: 600, color: C.text0, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
          {projekt.titel}
        </h3>
        <p style={{ fontSize: '14px', color: C.text2, margin: '0 0 18px', lineHeight: 1.6, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {projekt.beschreibung}
        </p>

        {/* Tech chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
          {projekt.technologien.slice(0, 3).map(tech => (
            <span key={tech} style={{
              fontFamily: fontMono, fontSize: '10px', padding: '4px 9px', borderRadius: '9999px',
              background: 'transparent',
              border: '1px solid var(--cyan-border)',
              color: 'var(--text-1)',
            }}>{tech}</span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--cyan-border)' }}>
          <span style={{ fontFamily: fontMono, fontSize: '12px', color: C.cyan, letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: hov ? '10px' : '6px', transition: 'gap 0.2s' }}>
            {detailsLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div onClick={e => e.stopPropagation()}><LikeButton projectId={projekt.id} compact /></div>
            {projekt.github && (
              <a href={projekt.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ fontFamily: fontMono, fontSize: '12px', color: C.text3, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = C.cyan}
                onMouseLeave={e => e.currentTarget.style.color = C.text3}
              >GitHub</a>
            )}
            {projekt.link && projekt.link !== '#' && (
              <a href={projekt.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ fontFamily: fontMono, fontSize: '12px', color: C.cyan, textDecoration: 'none' }}
              >Live →</a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Projects() {
  const { istDunkel } = useContext(ThemeContext)
  const { language } = useLanguage()
  const t = translations[language]
  const [aktiverFilter, setAktiverFilter] = useState('__all__')
  const [aktivesProjekt, setAktivesProjekt] = useState(null)
  const [viewedProjects, setViewedProjects] = useState(new Set())

  const alleKategorien = projects.flatMap(p => Array.isArray(p.kategorie) ? p.kategorie : [p.kategorie])
  const kategorienRaw = [...new Set(alleKategorien)]
  const kategorien = [{ key: '__all__', label: t.projects.filters.all }, ...kategorienRaw.map(k => ({ key: k, label: k }))]

  const gefiltert = aktiverFilter === '__all__'
    ? projects
    : projects.filter(p => (Array.isArray(p.kategorie) ? p.kategorie : [p.kategorie]).includes(aktiverFilter))

  const openProject = (p) => {
    setAktivesProjekt(p)
    if (!viewedProjects.has(p.id)) {
      setViewedProjects(prev => new Set([...prev, p.id]))
      giveXP(10, 'Projekt angeschaut')
    }
  }

  return (
    <section id="projects" style={{ padding: '96px 0', background: 'var(--bg-2)', position: 'relative' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 3 }}>
        {/* Section head */}
        <div style={{ marginBottom: '56px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: fontMono, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.cyan }}>
            <span style={{ width: '24px', height: '1px', background: C.cyan, boxShadow: `0 0 6px ${C.cyanGlow}`, display: 'inline-block' }} />
            {t.projects.eyebrow}
          </span>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05, margin: '16px 0 12px', color: 'var(--text-0)' }}>
            {t.projects.headingPre}<em style={{ fontStyle: 'normal', color: 'var(--cyan)', textShadow: '0 0 24px var(--cyan-glow)' }}>{t.projects.title}</em>
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '16px' }}>{t.projects.subtitle}</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
          {kategorien.map(({ key, label }) => (
            <FilterBtn key={key} label={label} active={aktiverFilter === key} onClick={() => setAktiverFilter(key)} />
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="projects-grid">
          {gefiltert.map((p, i) => (
            <ProjectCard key={p.id} projekt={p} idx={i} onClick={openProject} detailsLabel={t.projects.detailsLink} categoryLabel={t.projects.categoryLabel} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {aktivesProjekt && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', padding: '16px', backdropFilter: 'blur(8px)' }}
          onClick={() => setAktivesProjekt(null)}
        >
          <div
            style={{ width: '100%', maxWidth: '680px', borderRadius: '20px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-1)', border: `1px solid var(--cyan-border)`, boxShadow: `0 0 60px var(--cyan-glow)` }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setAktivesProjekt(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg2, border: `1px solid ${C.cyanBorder}`, color: C.text2, cursor: 'pointer', fontSize: '16px', zIndex: 10 }}
            >✕</button>

            {aktivesProjekt.bild && (
              <div style={{ height: '200px', margin: '-32px -32px 24px', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
                <img src={aktivesProjekt.bild} alt={aktivesProjekt.titel} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <h3 style={{ fontFamily: fontDisplay, fontSize: '24px', fontWeight: 700, color: C.text0, margin: '0 0 16px' }}>{aktivesProjekt.titel}</h3>
            <p style={{ color: C.text2, marginBottom: '24px', lineHeight: 1.7 }}>{aktivesProjekt.beschreibung}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {aktivesProjekt.technologien.map(tech => (
                <span key={tech} style={{ fontFamily: fontMono, fontSize: '12px', padding: '5px 12px', borderRadius: '9999px', background: C.cyanBg, border: `1px solid ${C.cyanBorder}`, color: C.cyan }}>{tech}</span>
              ))}
            </div>

            <p style={{ fontFamily: fontMono, fontSize: '12px', color: C.text3, marginBottom: '24px' }}>
              {t.projects.categoryLabel}: {Array.isArray(aktivesProjekt.kategorie) ? aktivesProjekt.kategorie.join(', ') : aktivesProjekt.kategorie}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {aktivesProjekt.link && aktivesProjekt.link !== '#' && (
                <a href={aktivesProjekt.link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', background: 'var(--cyan)', color: 'var(--bg-0)', fontFamily: fontMono, fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: `all 0.3s ${ease}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#00fff5'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.cyan; e.currentTarget.style.transform = 'none' }}
                >Live Demo</a>
              )}
              {aktivesProjekt.github && (
                <a href={aktivesProjekt.github} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', background: 'transparent', color: C.cyan, fontFamily: fontMono, fontSize: '13px', border: `1px solid ${C.cyanBorderStrong}`, textDecoration: 'none' }}>GitHub</a>
              )}
            </div>

            <div><LikeButton projectId={aktivesProjekt.id} /></div>
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid var(--cyan-border)` }}>
              <Comments projectId={aktivesProjekt.id} />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .projects-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .projects-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

export default Projects
