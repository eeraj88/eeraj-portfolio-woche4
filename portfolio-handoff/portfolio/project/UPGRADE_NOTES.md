# Portfolio Cyberpunk Upgrade — Liefer-Notizen

## Was du bekommen hast

1. **`Portfolio Redesign.html`** — Komplette single-file Vorschau im neuen Design.
   Alle deine echten Inhalte (7 Projekte, 9 Testimonials, alle Skills, Texte) sind drin.
   → Öffne diese Datei, um zu sehen wie das Endergebnis aussieht.

2. **`react-drop-in.css`** — Drop-in CSS für dein bestehendes React-Projekt.
   Kein Refactor nötig, nichts an deinen Komponenten ändern.
   → `import './react-drop-in.css'` in `main.jsx`, fertig.

## Designsystem auf einen Blick

| Token | Wert |
|---|---|
| Background | `#0a0a0a` (primary) · `#111` (cards) · `#050505` (deepest) |
| Cyan | `#22d3ee` (primary) · `#00fff5` (hover) |
| Magenta (sparingly) | `#ff2bd6` |
| Text | `#ffffff` / `#e4e4e7` / `#a1a1aa` / `#71717a` |
| Display | Space Grotesk 600/700 |
| Body | Inter 400/500 |
| Mono | JetBrains Mono (für Labels, Eyebrows, Code) |

## Konkrete Layout-Änderungen

- **Nav:** Sticky, blur-Hintergrund, scroll-state mit cyan Bottom-Border. Mono-Font für Links mit `//` Hover-Präfix.
- **Hero:** Grid-Background + 2 cyan orbs, Typewriter-Effekt für `> role:`, runde Photo + animated cyan ring.
- **About:** YouTube-Video-Frame (9:16) links, Bio + cyan tags + Stats-Box rechts.
- **Skills:** 4-spaltiges Bento-Grid (2 cards span 2), nummeriert `01–06`, hover cyan border + glow.
- **Projects:** 3-spaltiges Grid mit Filter-Pills (Alle / React / Frontend / AI / Full-Stack / Marketing). Card lift + cyan glow on hover, image zoom + grayscale removal.
- **Testimonials:** Single-card Carousel mit dots + autoplay (6.5s) und prev/next.
- **Contact:** Zentriertes Card-Formular mit `> label` Stil und cyan focus glow.
- **Footer:** 3-Spalten Brand / Quick Links / Socials, cyan top-glow line.

## Effekte die schon drin sind

- ✅ Scroll progress bar (oben, cyan glow)
- ✅ Cursor-glow (Desktop, soft cyan radial follower)
- ✅ IntersectionObserver reveal animations (`.reveal` class)
- ✅ Glow auf cyan elementen (box-shadow + text-shadow)
- ✅ Glassmorphism-Nav (`backdrop-filter: blur`)
- ✅ Animated grid background + floating orbs (Hero)
- ✅ Typewriter (rotierende roles)
- ✅ Hover lift + glow auf cards
- ✅ `prefers-reduced-motion` respektiert
- ✅ Mobile hamburger menu mit slide-down

## Floating Widgets (rechts/links)

- **News-Feed Button** (links mitte) — verlinkt deinen bestehenden `AINewsFeed.jsx`
- **Pokemon Buddy** (rechts unten) — verlinkt deinen bestehenden `PokemonBuddy.jsx`
- **Chatbot Slot** (rechts unten, "soon" Badge) — Platzhalter für Phase 2

## Was bleibt unverändert

- ✅ Pokemon XP System
- ✅ Supabase Struktur (AI News)
- ✅ EmailJS Integration
- ✅ Firebase Config & Rules
- ✅ ThemeContext (kannst du im React-Drop-in auf `dark` fixieren)
- ✅ Komponenten-API — nur CSS-Layer wurde getauscht

## Empfohlene nächste Schritte

1. **Schau dir `Portfolio Redesign.html` an** — gefällt dir die Richtung?
2. **Wenn ja:** importiere `react-drop-in.css` in dein Vite-Projekt und teste.
3. **Feinschliff:** Pokemon-Buddy + News-Feed UI an cyan theme angleichen (extra Pass).
4. **Optional:** Three.js Partikel-Hintergrund im Hero statt orbs (siehe `PORTFOLIO_UPGRADE_PLAN.md`).
