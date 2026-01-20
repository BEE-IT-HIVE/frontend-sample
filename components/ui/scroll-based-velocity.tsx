
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { cn } from "../../utils";

interface ParallaxProps {
  children?: React.ReactNode;
  baseVelocity: number;
  className?: string;
}

function ParallaxText({ children, baseVelocity = 100, className }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  /**
   * The range for wrap must be carefully adjusted based on the content width.
   * -20 to -45 is a heuristic that works well when content is repeated 4 times
   * and the visible area is roughly within that window.
   */
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div className={cn("scroller font-bold uppercase text-4xl md:text-7xl flex whitespace-nowrap flex-nowrap font-heading", className)} style={{ x }}>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
      </motion.div>
    </div>
  );
}

interface VelocityScrollProps {
  text?: string;
  children?: React.ReactNode;
  default_velocity?: number;
  className?: string;
  rows?: number;
  direction?: "left" | "right";
}

export function VelocityScroll({
  text,
  children,
  default_velocity = 5,
  className,
  rows = 1,
  direction = "left",
}: VelocityScrollProps) {
  const calculatedVelocity = direction === "right" ? -default_velocity : default_velocity;

  return (
    <section className="relative w-full overflow-hidden">
      <ParallaxText baseVelocity={calculatedVelocity} className={className}>
        {children || text}
      </ParallaxText>
      {rows > 1 && (
        <ParallaxText baseVelocity={-calculatedVelocity} className={className}>
          {children || text}
        </ParallaxText>
      )}
    </section>
  );
}
