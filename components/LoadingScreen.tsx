
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LOGO_URL } from '../constants';

interface BeeProps {
  orbitRadius: number;   // distance from center
  orbitDuration: number; // time for one full orbit
  orbitDelay: number;    // staggered start
  direction: number;     // 1 = clockwise, -1 = counterclockwise
  size: 'small' | 'normal' | 'large';
  bobAmplitude?: number; // vertical bobbing
}

const Bee: React.FC<BeeProps> = ({ orbitRadius, orbitDuration, orbitDelay, direction, size, bobAmplitude = 20 }) => {
  const sizes = {
    small: { scale: 0.7 },
    normal: { scale: 1 },
    large: { scale: 1.4 },
  };

  const s = sizes[size];

  return (
    <motion.div
      animate={{
        rotate: direction * 360,
        x: [0, orbitRadius * Math.cos(Math.PI / 4), orbitRadius, orbitRadius * Math.cos(3 * Math.PI / 4), 0, -orbitRadius * Math.cos(3 * Math.PI / 4), -orbitRadius, -orbitRadius * Math.cos(Math.PI / 4), 0],
        y: [0, -orbitRadius * Math.sin(Math.PI / 4), -orbitRadius, -orbitRadius * Math.sin(3 * Math.PI / 4), 0, orbitRadius * Math.sin(3 * Math.PI / 4), orbitRadius, orbitRadius * Math.sin(Math.PI / 4), 0],
      }}
      transition={{
        rotate: { duration: orbitDuration, repeat: Infinity, ease: "linear", delay: orbitDelay },
        x: { duration: orbitDuration, repeat: Infinity, ease: "linear", delay: orbitDelay },
        y: { duration: orbitDuration, repeat: Infinity, ease: "linear", delay: orbitDelay },
      }}
      className="absolute"
      style={{ scale: s.scale }}
    >
      {/* Subtle vertical bobbing for life-like motion */}
      <motion.div
        animate={{ y: [0, -bobAmplitude, 0, bobAmplitude, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-12 h-12"
      >
        {/* Bee Body */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 rounded-full shadow-2xl border-2 border-yellow-800 overflow-hidden">
          <div className="absolute inset-x-0 top-1/4 h-1/5 bg-black/70"></div>
          <div className="absolute inset-x-0 top-1/2 h-1/5 bg-black/70"></div>
          <div className="absolute inset-x-0 bottom-1/4 h-1/5 bg-black/70"></div>
        </div>

        {/* Eyes */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex justify-between w-3/4 px-1">
          <div className="w-2.5 h-2.5 bg-black rounded-full shadow-inner" />
          <div className="w-2.5 h-2.5 bg-black rounded-full shadow-inner" />
        </div>

        {/* Flapping Wings */}
        <motion.div
          animate={{ rotate: [-50, 50, -50] }}
          transition={{ duration: 0.05, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-12 bg-white/75 rounded-full blur-sm border border-gray-300 origin-right"
        />
        <motion.div
          animate={{ rotate: [50, -50, 50] }}
          transition={{ duration: 0.05, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-12 bg-white/75 rounded-full blur-sm border border-gray-300 origin-left"
        />
      </motion.div>
    </motion.div>
  );
};

const LoadingScreen: React.FC = () => {
  // 24 bees orbiting in different rings and directions - FASTER SPEEDS
  const bees = [
    // Inner ring - fast, small bees (clockwise)
    ...Array.from({ length: 8 }, (_, i) => ({
      orbitRadius: 120,
      orbitDuration: 1.0 + i * 0.1, // Even faster
      orbitDelay: i * 0.05,
      direction: 1,
      size: 'small' as const,
      bobAmplitude: 10,
    })),
    // Middle ring - normal bees (counterclockwise)
    ...Array.from({ length: 10 }, (_, i) => ({
      orbitRadius: 200,
      orbitDuration: 1.5 + i * 0.15, // Even faster
      orbitDelay: i * 0.1,
      direction: -1,
      size: 'normal' as const,
      bobAmplitude: 15,
    })),
    // Outer ring - large bees, slower (clockwise)
    ...Array.from({ length: 6 }, (_, i) => ({
      orbitRadius: 280,
      orbitDuration: 2.0 + i * 0.2, // Even faster
      orbitDelay: i * 0.15,
      direction: 1,
      size: 'large' as const,
      bobAmplitude: 20,
    })),
  ];

  return (
    <div className="fixed inset-0 z-[10000] bg-[#01041a] flex items-center justify-center overflow-hidden">
      {/* Ambient golden glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[800px] h-[800px] bg-hive-gold/20 rounded-full blur-[200px] pointer-events-none"
      />

      {/* Central Hive Icon - pulsing and rotating faster */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-30"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }} // Very fast rotation
          className="w-48 h-48 bg-gradient-to-br from-hive-gold/90 to-yellow-600 rounded-3xl flex items-center justify-center shadow-[0_0_80px_rgba(255,170,13,0.8)] border-8 border-hive-gold/50 overflow-hidden bg-white"
        >
          <img src={LOGO_URL} alt="Hive Logo" className="w-full h-full object-cover" />
        </motion.div>

        {/* Inner subtle spinner */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-8 border-dashed border-hive-gold/30 rounded-3xl"
        />
      </motion.div>

      {/* Swarm of bees orbiting the hive */}
      {bees.map((bee, i) => (
        <Bee
          key={i}
          orbitRadius={bee.orbitRadius}
          orbitDuration={bee.orbitDuration}
          orbitDelay={bee.orbitDelay}
          direction={bee.direction}
          size={bee.size}
          bobAmplitude={bee.bobAmplitude}
        />
      ))}
    </div>
  );
};

export default LoadingScreen;
