import { useContext, flushSync } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

export function AnimatedThemeToggler({ duration = 500, className }) {
  const { istDunkel, toggleDarkMode } = useContext(ThemeContext);

  const handleToggle = async (event) => {
    if (!document.startViewTransition) {
      toggleDarkMode();
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(async () => {
      flushSync(() => toggleDarkMode());
    });
    await transition.ready;
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
      { duration, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
    );
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle Theme"
      style={{
        width: '38px', height: '38px', borderRadius: '10px',
        background: '#111111',
        border: `1px solid ${istDunkel ? 'rgba(34,211,238,0.22)' : 'rgba(0,0,0,0.12)'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: `all 0.25s ${ease}`,
        color: istDunkel ? '#22d3ee' : '#525252',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = istDunkel ? 'rgba(34,211,238,0.55)' : 'rgba(0,0,0,0.25)'
        e.currentTarget.style.boxShadow = istDunkel ? '0 0 18px rgba(34,211,238,0.45)' : 'none'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = istDunkel ? 'rgba(34,211,238,0.22)' : 'rgba(0,0,0,0.12)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'none'
      }}
    >
      {istDunkel ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}
