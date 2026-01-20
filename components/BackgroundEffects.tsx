
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppSettings } from '../types';
import { cn } from '../utils';

// --- Sparkles Core ---
const SparklesCore = ({
  id,
  background,
  minSize,
  maxSize,
  particleDensity,
  className,
  particleColor,
}: {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      setContext(canvasRef.current.getContext("2d"));
    }
  }, []);

  useEffect(() => {
    let animationId: number;
    if (canvasRef.current && context) {
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.scale(dpr, dpr);

      const particles: any[] = [];
      const particleCount = particleDensity || 50;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (maxSize || 2) + (minSize || 0.5),
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random(),
        });
      }

      const animate = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.opacity -= 0.005;

          if (p.opacity <= 0) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
            p.opacity = 1;
          }

          context.globalAlpha = p.opacity;
          context.fillStyle = particleColor || "#FFFFFF";
          context.beginPath();
          context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          context.fill();
        });
        animationId = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => cancelAnimationFrame(animationId);
  }, [context, maxSize, minSize, particleColor, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("absolute inset-0 z-0 h-full w-full pointer-events-none", className)}
      style={{ background }}
    />
  );
};

// --- Background Beams ---
const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30 dark:opacity-40">
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-hive-gold/20 to-hive-blue/20 blur-[100px] rounded-full animate-pulse-slow" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/20 dark:to-[#01041a]" />
    </div>
  );
};

// --- Existing Retro Grid ---
const RetroGrid = ({ theme }: { theme: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden [perspective:200px] pointer-events-none opacity-20 dark:opacity-30">
      <div className="absolute inset-0 [transform:rotateX(35deg)]">
        <div
          className={`animate-grid-flow [background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:200%] ${
            theme === 'dark'
              ? '[background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_0)]'
              : '[background-image:linear-gradient(to_right,rgba(3,10,55,0.1)_1px,transparent_0),linear-gradient(to_bottom,rgba(3,10,55,0.1)_1px,transparent_0)]'
          }`}
        />
      </div>
      <div className={`absolute inset-0 bg-gradient-to-t to-transparent to-90% ${theme === 'dark' ? 'from-[#01041a]' : 'from-[#F9FAFB]'}`} />
    </div>
  );
};

// --- Flickering Grid ---
const FlickeringGrid: React.FC<{ theme: string }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let squares: { x: number; y: number; opacity: number; targetOpacity: number; speed: number }[] = [];
    const gap = 30;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      squares = [];
      const cols = Math.ceil(window.innerWidth / gap);
      const rows = Math.ceil(window.innerHeight / gap);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          squares.push({
            x: i * gap,
            y: j * gap,
            opacity: Math.random() * 0.1,
            targetOpacity: Math.random() * 0.1,
            speed: 0.002 + Math.random() * 0.008
          });
        }
      }
    };

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const color = theme === 'dark' ? '255, 255, 255' : '3, 10, 55';
      
      squares.forEach(sq => {
        if (Math.abs(sq.opacity - sq.targetOpacity) < 0.01) {
          sq.targetOpacity = Math.random() * (theme === 'dark' ? 0.2 : 0.1);
        }
        sq.opacity += (sq.targetOpacity - sq.opacity) * sq.speed;
        
        ctx.fillStyle = `rgba(${color}, ${sq.opacity})`;
        ctx.beginPath();
        ctx.arc(sq.x, sq.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrame);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />;
};

const BackgroundEffects: React.FC<{ settings: AppSettings }> = ({ settings }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-fixed">
      {/* 1. Sparkles Layer */}
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={40}
        className="w-full h-full"
        particleColor={settings.theme === 'dark' ? '#FFAA0D' : '#030A37'}
      />

      {/* 2. Retro Grid (Perspective) */}
      <RetroGrid theme={settings.theme} />

      {/* 3. Flickering Grid (Static) */}
      <FlickeringGrid theme={settings.theme} />

      {/* 4. Background Beams (Aurora feel) */}
      <BackgroundBeams />
      
      {/* 5. Interactive Mouse Gradient (Tunnel Shader feel) */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out z-10"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${settings.theme === 'dark' ? '255, 170, 13' : '3, 10, 55'}, 0.06), transparent 40%)`
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
