'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LOGO_URL } from '../constants';

interface Bee {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  angle: number;
  size: number;
  tilt: number;
  wingPhase: number;
  dispersing: boolean;
}

const LoadingScreen: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoPositionsRef = useRef<{ x: number; y: number }[]>([]);
  const beesRef = useRef<Bee[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const centerX = w / 2;
    const centerY = h / 2;

    // sample logo pixels for bee positions
    const sampleLogoPositions = async () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = LOGO_URL;
      await new Promise((res) => (img.onload = res));

      const off = document.createElement('canvas');
      const octx = off.getContext('2d')!;
      const size = 200;
      off.width = size;
      off.height = size;
      octx.drawImage(img, 0, 0, size, size);
      const data = octx.getImageData(0, 0, size, size).data;

      const positions: { x: number; y: number }[] = [];
      for (let y = 0; y < size; y += 6) {
        for (let x = 0; x < size; x += 6) {
          const idx = (y * size + x) * 4;
          if (data[idx + 3] > 180) positions.push({ x, y });
        }
      }

      const offsetX = centerX - size / 2;
      const offsetY = centerY - size / 2;
      logoPositionsRef.current = positions.map(p => ({
        x: p.x + offsetX,
        y: p.y + offsetY,
      }));
    };

    const initBees = () => {
      const logoPositions = logoPositionsRef.current;
      const bees: Bee[] = [];

      for (let i = 0; i < logoPositions.length; i++) {
        const pos = logoPositions[i];
        bees.push({
          x: Math.random() * w,
          y: Math.random() * h,
          targetX: pos.x,
          targetY: pos.y,
          vx: 0,
          vy: 0,
          angle: 0,
          size: 0.5 + Math.random() * 0.6,
          tilt: 0,
          wingPhase: Math.random() * Math.PI * 2,
          dispersing: false,
        });
      }

      beesRef.current = bees;

      // Disperse after 1.5s
      setTimeout(() => {
        beesRef.current.forEach(bee => (bee.dispersing = true));
      }, 1500);

      // Stop loader after 4s
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 4000);
    };

    sampleLogoPositions().then(initBees);

    const drawHex = (x: number, y: number, size: number, alpha: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 3 * i;
        ctx.lineTo(x + size * Math.cos(a), y + size * Math.sin(a));
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      ctx.shadowColor = `rgba(255, 215, 0, ${alpha * 0.3})`;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    let lastTime = performance.now();
    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, w, h);

      // honeycomb background
      const size = 50;
      const height = Math.sqrt(3) * size;
      for (let row = 0; row * height * 0.75 < h + size; row++) {
        for (let col = 0; col * size * 1.5 < w + size; col++) {
          const xo = (row % 2) * size * 0.75;
          const x = col * size * 1.5 + xo;
          const y = row * height * 0.75;
          const alpha = 0.02 + 0.02 * Math.sin(time / 400 + col + row);
          drawHex(x, y, size, alpha);
        }
      }

      // bees
      beesRef.current.forEach(bee => {
        if (!bee.dispersing) {
          bee.vx += (bee.targetX - bee.x) * 5 * dt;
          bee.vy += (bee.targetY - bee.y) * 5 * dt;
        } else {
          const angle = Math.random() * Math.PI * 2;
          bee.vx += Math.cos(angle) * 50 * dt;
          bee.vy += Math.sin(angle) * 50 * dt;
        }

        bee.x += bee.vx * dt;
        bee.y += bee.vy * dt;

        const speed = Math.sqrt(bee.vx ** 2 + bee.vy ** 2);
        bee.tilt = Math.atan2(bee.vy, bee.vx);
        bee.wingPhase += speed * dt * 12;

        // wing trail
        for (let i = 3; i > 0; i--) {
          const alpha = (i / 3) * 0.25;
          ctx.fillStyle = `rgba(255,255,180,${alpha})`;
          ctx.beginPath();
          ctx.arc(bee.x - bee.vx * i * dt, bee.y - bee.vy * i * dt, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // bee body
        ctx.save();
        ctx.translate(bee.x, bee.y);
        ctx.rotate(bee.tilt);
        ctx.scale(bee.size, bee.size);
        ctx.shadowColor = 'rgba(255,240,150,0.6)';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFEC33';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.fillRect(-6, -3, 12, 3);
        ctx.fillRect(-6, 0, 12, 3);

        const wingAngle = Math.sin(bee.wingPhase) * 0.9;
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.ellipse(-10, -8, 6, 14, wingAngle, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(10, -8, 6, 14, -wingAngle, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#01041a]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative z-20 flex flex-col items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="w-48 h-48 rounded-3xl flex items-center justify-center shadow-[0_0_130px_rgba(255,210,70,0.8)] border-8 border-yellow-500 bg-white overflow-hidden"
        >
          <img src={LOGO_URL} className="w-full h-full object-cover" alt="Hive Logo" />
        </motion.div>

        <p className="mt-6 text-2xl font-extrabold text-yellow-400 drop-shadow-lg">
          Entering Hive…
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;