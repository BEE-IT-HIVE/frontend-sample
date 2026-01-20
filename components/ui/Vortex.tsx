
import React, { useEffect, useRef } from "react";
import { cn } from "../../utils";

export const Vortex = ({
  children,
  className,
  containerClassName,
  particleCount = 200,
  rangeY = 100,
  baseHue = 220,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: any[] = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2,
            hue: baseHue + Math.random() * 60
        });
    }

    const animate = () => {
        // Create trailing effect
        ctx.fillStyle = "rgba(0,0,0,0.1)"; 
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Swirl effect logic (simplified vortex)
            const dx = p.x - width / 2;
            const dy = p.y - height / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const force = Math.max(0, (500 - dist) / 500); // pull towards center

            p.vx += Math.cos(angle + Math.PI / 2) * force * 0.1 - p.x * 0.0001;
            p.vy += Math.sin(angle + Math.PI / 2) * force * 0.1 - p.y * 0.0001;

            if(p.x < 0) p.x = width;
            if(p.x > width) p.x = 0;
            if(p.y < 0) p.y = height;
            if(p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.fillStyle = `hsl(${p.hue}, 70%, 50%)`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    };
    animate();

    return () => {
        window.removeEventListener("resize", resize);
    };
  }, [particleCount, baseHue]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", containerClassName)}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-transparent" />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
