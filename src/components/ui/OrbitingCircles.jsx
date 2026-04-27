import { cn } from "../../lib/utils";

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 10,
  radius = 160,
  path = true,
}) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-black/5 stroke-1 dark:stroke-white/5"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeDasharray="4 4"
          />
        </svg>
      )}

      <div
        style={{
          "--duration": duration,
          "--radius": radius,
          "--delay": -delay,
        }}
        className={cn(
          "absolute flex size-full transform-gpu animate-orbit items-center justify-center [animation-delay:calc(var(--delay)*1s)]",
          { "[animation-direction:reverse]": reverse },
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
