
import React, { useEffect, useRef } from "react";
import { cn } from "../../utils";

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let animationFrameId: number;
    let rotation = 0;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const dots: { x: number; y: number; z: number; phi: number; theta: number }[] = [];
    const DOT_COUNT = 400;
    const RADIUS = Math.min(width, height) * 0.4;

    for (let i = 0; i < DOT_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
      const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;
      dots.push({
        x: 0,
        y: 0,
        z: 0,
        phi,
        theta,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotation += 0.005;

      const cx = width / 2;
      const cy = height / 2;

      dots.forEach((dot) => {
        const x = RADIUS * Math.sin(dot.phi) * Math.cos(dot.theta + rotation);
        const z = RADIUS * Math.sin(dot.phi) * Math.sin(dot.theta + rotation);
        const y = RADIUS * Math.cos(dot.phi);

        const scale = (z + RADIUS * 2) / (RADIUS * 2); // Simple perspective
        const alpha = (z + RADIUS) / (RADIUS * 2);

        if (z > -RADIUS / 2) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 170, 13, ${Math.max(0.1, alpha)})`; // Hive gold
            ctx.arc(cx + x, cy + y, 1.5 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("w-full h-full", className)} />;
};
