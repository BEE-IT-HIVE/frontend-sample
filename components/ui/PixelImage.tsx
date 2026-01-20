
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils";

interface PixelImageProps {
  src: string;
  alt?: string;
  className?: string;
  pixelSize?: number; // Size of "pixels" in the effect
}

export const PixelImage: React.FC<PixelImageProps> = ({
  src,
  alt,
  className,
  pixelSize = 8,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // We'll simulate the pixel effect using a low-res CSS filter transition
  // for a smoother performance than thousands of DOM nodes.
  
  return (
    <div 
      className={cn("relative overflow-hidden bg-gray-100 dark:bg-white/5", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* High Res Image (The Goal) */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          // When hovered, show clear image. When not hovered (and loaded), keep it somewhat stylized or clear?
          // Let's make it pixelated by default and clear on hover for the "Magic" effect.
          isHovered ? "blur-0 scale-105" : "blur-0 scale-100" 
        )}
      />

      {/* Pixelated Overlay */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 pointer-events-none mix-blend-hard-light"
            style={{
               backgroundImage: `url(${src})`,
               backgroundSize: '100% 100%',
               // CSS Pixelation Hack: Scale down and back up via background-size if we had a canvas, 
               // but here we can use `image-rendering`.
               // Since we can't easily downsample CSS background-image dynamically without canvas data URL,
               // We will use a backdrop filter or a simple pattern overlay to simulate 'tech' pixels.
            }}
          >
             {/* Actual Pixelation Simulation via Backdrop Filter + SVG Pattern */}
             <div className="w-full h-full absolute inset-0 bg-hive-blue/20 dark:bg-hive-gold/10 backdrop-blur-[2px]" />
             
             {/* Grid Lines to simulate pixels */}
             <div 
               className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
                 backgroundSize: `${pixelSize}px ${pixelSize}px`
               }}
             ></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-white/10 animate-pulse z-20" />
      )}
    </div>
  );
};
