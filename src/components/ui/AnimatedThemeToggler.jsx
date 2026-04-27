import { useContext, flushSync } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import { cn } from "../../lib/utils";

export function AnimatedThemeToggler({
  duration = 500,
  className,
}) {
  const { istDunkel, toggleDarkMode } = useContext(ThemeContext);

  const handleToggle = async (event) => {
    // Falls der Browser die API nicht unterstützt
    if (!document.startViewTransition) {
      toggleDarkMode();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(async () => {
      // Wir nutzen flushSync, damit React den DOM-Zustand 
      // sofort aktualisiert, bevor der Screenshot gemacht wird
      toggleDarkMode();
    });

    await transition.ready;

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 hover:scale-110",
        istDunkel
          ? "bg-[#112240] text-[#64ffda] border-[#233554] hover:bg-[#1d3557]"
          : "bg-gray-100 text-[#0d9488] border-gray-200 hover:bg-gray-200",
        className
      )}
      aria-label="Toggle Theme"
    >
      <span className="text-xl">
        {istDunkel ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
