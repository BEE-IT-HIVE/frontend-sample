
import React, { useState, useRef, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils";

interface LensProps {
  children: ReactElement; // Expecting an image element
  zoomFactor?: number;
  lensSize?: number;
  className?: string;
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 2.5,
  lensSize = 180,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  // Extract src from children if available (basic check)
  const childSrc = (children.props as any).src;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-crosshair group", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 pointer-events-none border-2 border-white/30 shadow-2xl bg-no-repeat rounded-full bg-white"
            style={{
              width: lensSize,
              height: lensSize,
              left: mousePos.x - lensSize / 2,
              top: mousePos.y - lensSize / 2,
              backgroundImage: `url(${childSrc})`,
              backgroundSize: `${(containerRef.current?.offsetWidth || 0) * zoomFactor}px ${(containerRef.current?.offsetHeight || 0) * zoomFactor}px`,
              backgroundPosition: `-${mousePos.x * zoomFactor - lensSize / 2}px -${mousePos.y * zoomFactor - lensSize / 2}px`,
            }}
          >
             {/* Optional: Add a glass reflection effect */}
             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-50"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
