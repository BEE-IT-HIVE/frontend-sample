
import React, { useRef, useEffect } from "react";
import { cn } from "../../utils";

export const GlowingEffect = ({
  className,
  glow = true,
  blur = 0,
  spread = 40,
  inactiveZone = 0.7,
  proximity = 0,
}: {
  className?: string;
  glow?: boolean;
  blur?: number;
  spread?: number;
  inactiveZone?: number;
  proximity?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty("--x", `${x}px`);
      container.style.setProperty("--y", `${y}px`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        className
      )}
      style={
        {
          background: `radial-gradient(${spread}px circle at var(--x) var(--y), var(--glow-color, rgba(255,170,13,0.3)), transparent ${100 * inactiveZone}%)`,
        } as React.CSSProperties
      }
    />
  );
};
