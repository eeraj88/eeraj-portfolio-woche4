function GameTeaser() {
  const goToGame = () => {
    window.open('https://eeraj-world.vercel.app', '_blank')
  }

  return (
    <section className="game-teaser-section">
      <div className="game-teaser-container reveal">
        <div className="game-teaser-character">
          <div className="pg-screen">
            <div className="pg-stars"></div>
            <div className="pg-floor"></div>
            <div className="pg-platform"></div>
            <img className="pg-sprite" src="/eeraj_thumbsup.png" alt="Eeraj Pixel" />
            <div className="pg-scan"></div>
            <div className="pg-hud">
              <span className="hud-tl">LV.99<br />EERAJ</span>
              <span className="hud-tr">{'\u2665\u2665\u2665'}</span>
              <span className="hud-start">PRESS START</span>
            </div>
            <span className="pg-corner tl"></span>
            <span className="pg-corner tr"></span>
            <span className="pg-corner bl"></span>
            <span className="pg-corner br"></span>
          </div>
        </div>

        <div className="game-teaser-content">
          <span className="game-teaser-new">NEW</span>
          <div className="game-teaser-meta">
            <span className="game-teaser-eyebrow">Pixel Portfolio</span>
          </div>
          <h2>Erlebe das Portfolio interaktiv</h2>
          <p>
            Betritt das Raumschiff. Entdecke Skills, Projekte und mehr als Pixel Art Game.
          </p>
          <button type="button" className="game-teaser-button" onClick={goToGame}>
            <span>{'\u25ba'} JETZT SPIELEN</span>
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .game-teaser-section {
          position: relative;
          overflow: hidden;
          padding: clamp(1.8rem, 3.8vw, 3rem) 0 clamp(1.5rem, 3vw, 2.4rem);
          background:
            radial-gradient(circle at 24% 42%, rgba(34, 211, 238, 0.07) 0%, transparent 32%),
            linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%);
        }

        .game-teaser-section::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          pointer-events: none;
          background: linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.22) 50%, transparent 100%);
          box-shadow: 0 0 14px rgba(34, 211, 238, 0.08);
          opacity: 0.9;
        }

        .game-teaser-section::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          pointer-events: none;
          background: linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.18) 50%, transparent 100%);
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.06);
          opacity: 0.8;
        }

        .game-teaser-container {
          position: relative;
          z-index: 1;
          width: min(1400px, calc(100% - 48px));
          margin: 0 auto;
          display: flex;
          align-items: center;
          min-height: 420px;
        }

        .game-teaser-character {
          flex: 0 0 40%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-height: 380px;
          padding-right: clamp(1rem, 3vw, 3rem);
        }

        .game-teaser-content {
          flex: 0 0 60%;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          text-align: right;
          padding: 112px clamp(0rem, 1vw, 1rem) 0 clamp(0.5rem, 2vw, 2rem);
        }

        .pg-screen {
          position: relative;
          width: min(112%, 560px);
          aspect-ratio: 4 / 3;
          border-radius: 16px;
          background: radial-gradient(ellipse at 50% 38%, #103040 0%, #0a1a26 45%, #05080d 100%);
          border: 2px solid rgba(34, 211, 238, 0.55);
          box-shadow:
            0 0 0 6px #0c0c0c,
            0 0 0 7px rgba(34, 211, 238, 0.18),
            0 24px 70px rgba(0, 0, 0, 0.6),
            0 0 70px rgba(34, 211, 238, 0.18),
            inset 0 0 90px rgba(0, 0, 0, 0.7);
          overflow: hidden;
          isolation: isolate;
        }

        .pg-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          border-radius: 16px;
          background:
            radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55) 100%),
            linear-gradient(125deg, rgba(255, 255, 255, 0.06) 0%, transparent 30%);
        }

        .pg-scan {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.18) 0 1px, transparent 1px 3px);
          mix-blend-mode: multiply;
        }

        .pg-scan::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(180deg, transparent, rgba(34, 211, 238, 0.06), transparent);
          animation: pgSweep 5s linear infinite;
        }

        @keyframes pgSweep {
          0% { transform: translateY(-120%); }
          100% { transform: translateY(320%); }
        }

        .pg-stars {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image:
            radial-gradient(1px 1px at 20% 25%, #bdf3ff 50%, transparent 51%),
            radial-gradient(1px 1px at 70% 15%, #fff 50%, transparent 51%),
            radial-gradient(1px 1px at 45% 40%, #7fdfff 50%, transparent 51%),
            radial-gradient(1px 1px at 85% 50%, #fff 50%, transparent 51%),
            radial-gradient(1px 1px at 15% 60%, #bdf3ff 50%, transparent 51%),
            radial-gradient(1px 1px at 60% 65%, #fff 50%, transparent 51%);
          animation: pgTwinkle 3s steps(2) infinite;
        }

        @keyframes pgTwinkle {
          50% { opacity: 0.45; }
        }

        .pg-floor {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 32%;
          z-index: 2;
          background:
            linear-gradient(180deg, transparent, rgba(34, 211, 238, 0.06)),
            repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.12) 0 2px, transparent 2px 44px);
          border-top: 2px solid rgba(34, 211, 238, 0.4);
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.25);
          transform: perspective(280px) rotateX(52deg);
          transform-origin: bottom;
        }

        .pg-sprite {
          position: absolute;
          z-index: 3;
          left: 50%;
          bottom: 6%;
          width: 52%;
          transform: translateX(-50%);
          image-rendering: pixelated;
          filter:
            drop-shadow(0 0 12px rgba(34, 211, 238, 0.55))
            drop-shadow(0 8px 10px rgba(0, 0, 0, 0.6));
          animation: pgBob 2.4s ease-in-out infinite;
        }

        @keyframes pgBob {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -8px); }
        }

        .pg-platform {
          position: absolute;
          z-index: 2;
          left: 50%;
          bottom: 8%;
          width: 48%;
          height: 14px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(34, 211, 238, 0.5), transparent 70%);
          filter: blur(3px);
          animation: pgPlat 2.4s ease-in-out infinite;
        }

        @keyframes pgPlat {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 0.35; transform: translateX(-50%) scaleX(0.8); }
        }

        .pg-hud {
          position: absolute;
          z-index: 6;
          inset: 0;
          pointer-events: none;
          font-family: 'Press Start 2P', monospace;
          color: #22d3ee;
        }

        .pg-hud span {
          position: absolute;
          font-size: 9px;
          line-height: 1.6;
          letter-spacing: 0.04em;
          text-shadow: 0 0 8px rgba(34, 211, 238, 0.45);
        }

        .pg-hud .hud-tl {
          top: 14px;
          left: 16px;
          color: #bdf3ff;
        }

        .pg-hud .hud-tr {
          top: 14px;
          right: 16px;
          color: #ff5d8f;
          text-shadow: 0 0 8px rgba(255, 93, 143, 0.6);
        }

        .pg-hud .hud-start {
          left: 50%;
          bottom: 12px;
          transform: translateX(-50%);
          color: #fff;
          font-size: 20px;
          white-space: nowrap;
          animation: pgBlink 1.1s steps(2) infinite;
        }

        @keyframes pgBlink {
          50% { opacity: 0; }
        }

        .pg-corner {
          position: absolute;
          z-index: 6;
          width: 18px;
          height: 18px;
          border: 2px solid #22d3ee;
          opacity: 0.6;
        }

        .pg-corner.tl { top: 8px; left: 8px; border-right: 0; border-bottom: 0; }
        .pg-corner.tr { top: 8px; right: 8px; border-left: 0; border-bottom: 0; }
        .pg-corner.bl { bottom: 8px; left: 8px; border-right: 0; border-top: 0; }
        .pg-corner.br { bottom: 8px; right: 8px; border-left: 0; border-top: 0; }

        .game-teaser-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }

        .game-teaser-new {
          position: absolute;
          top: 42px;
          right: clamp(0rem, 1vw, 1rem);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 16px 12px;
          background: var(--cyan);
          color: var(--bg-0);
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: clamp(1.4rem, 2.3vw, 2rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: 0.08em;
          border-radius: 6px;
          box-shadow:
            4px 4px 0 rgba(0, 0, 0, 0.55),
            0 0 18px var(--cyan-glow);
        }

        .game-teaser-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cyan);
        }

        .game-teaser-eyebrow::before {
          content: "";
          width: 24px;
          height: 1px;
          background: currentColor;
          box-shadow: 0 0 8px var(--cyan-glow);
        }

        .game-teaser-content h2 {
          max-width: 720px;
          margin: 0;
          font-family: var(--font-display, 'Space Grotesk', system-ui, sans-serif);
          font-size: clamp(2rem, 4vw, 3.4rem);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.04;
          color: var(--text-0);
          text-shadow: 0 0 22px var(--cyan-glow);
        }

        .game-teaser-content p {
          max-width: 560px;
          margin: 14px 0 0;
          color: var(--text-2);
          font-size: clamp(1rem, 1.5vw, 1.18rem);
          line-height: 1.75;
        }

        .game-teaser-button {
          position: relative;
          margin-top: 22px;
          border: 1px solid var(--cyan-border-strong);
          border-radius: 6px;
          padding: 15px 24px;
          background: var(--cyan);
          color: var(--bg-0);
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow:
            4px 4px 0 rgba(0, 0, 0, 0.5),
            0 0 24px var(--cyan-glow);
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }

        .game-teaser-button:hover {
          transform: translate(2px, 2px);
          box-shadow:
            2px 2px 0 rgba(0, 0, 0, 0.55),
            0 0 30px var(--cyan-glow);
          filter: brightness(1.08);
        }

        .game-teaser-button:active {
          transform: translate(4px, 4px);
          box-shadow: 0 0 18px var(--cyan-glow);
        }

        .game-teaser-button:focus-visible {
          outline: 3px solid var(--cyan-glow);
          outline-offset: 4px;
        }

        @media (max-width: 820px) {
          .game-teaser-section {
            padding: 2.4rem 0 3rem;
          }

          .game-teaser-container {
            width: min(100% - 32px, 620px);
            flex-direction: column;
            min-height: auto;
          }

          .game-teaser-character,
          .game-teaser-content {
            flex: 0 0 auto;
            width: 100%;
          }

          .game-teaser-character {
            min-height: 300px;
            padding-right: 0;
          }

          .pg-screen {
            width: min(100%, 470px);
          }

          .game-teaser-content {
            padding: 82px 0 0;
            align-items: center;
            text-align: center;
          }

          .game-teaser-new {
            top: 0;
          right: 50%;
          transform: translateX(50%);
            font-size: 1.35rem;
          }

          .game-teaser-meta {
            justify-content: center;
            flex-wrap: wrap;
          }

          .game-teaser-eyebrow::before {
            display: none;
          }

          .game-teaser-content p {
            margin-top: 18px;
          }

          .pg-hud span {
            font-size: 7px;
          }

          .pg-hud .hud-start {
            font-size: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pg-sprite,
          .pg-platform,
          .pg-scan::before,
          .pg-hud .hud-start,
          .pg-stars {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

export default GameTeaser
