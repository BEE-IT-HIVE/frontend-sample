
import React from "react";
import { cn } from "../../utils";

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
}: {
  children?: React.ReactNode;
  className?: string;
  svgOptions?: {
    duration?: number;
  };
}) => {
  return (
    <div
      className={cn(
        "relative h-full w-full bg-white dark:bg-[#030A37] overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 h-full w-full pointer-events-none opacity-20">
        <svg
          className="absolute inset-0 h-full w-full stroke-gray-300 dark:stroke-white/10"
          {...svgOptions}
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
        {/* Animated Lines */}
        <div className="absolute inset-0">
           {Array.from({length: 5}).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-[1px] h-[40%] bg-gradient-to-b from-transparent via-hive-gold to-transparent opacity-50"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 50}%`,
                    animation: `drop ${5 + Math.random() * 5}s infinite linear`,
                    animationDelay: `${Math.random() * 5}s`
                }}
              />
           ))}
        </div>
      </div>
      <div className="relative z-10">{children}</div>
      
      <style>{`
        @keyframes drop {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(300%); }
        }
      `}</style>
    </div>
  );
};
