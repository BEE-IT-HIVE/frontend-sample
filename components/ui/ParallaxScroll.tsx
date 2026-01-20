
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "../../utils";
import { Lens } from "./Lens";
import { GlowingEffect } from "./GlowingEffect";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll();

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div
      className={cn("h-auto items-start overflow-y-auto w-full", className)}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-40 px-10"
      >
        <div className="grid gap-10">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
              className="relative rounded-lg group"
            >
              <GlowingEffect blur={20} spread={40} />
              <Lens zoomFactor={2} lensSize={150}>
                <img
                    src={el}
                    className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                    alt="thumbnail"
                />
              </Lens>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <motion.div style={{ y: translateSecond }} key={"grid-2" + idx} className="relative rounded-lg group">
              <GlowingEffect blur={20} spread={40} />
              <Lens zoomFactor={2} lensSize={150}>
                <img
                    src={el}
                    className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                    alt="thumbnail"
                />
              </Lens>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div style={{ y: translateThird }} key={"grid-3" + idx} className="relative rounded-lg group">
              <GlowingEffect blur={20} spread={40} />
              <Lens zoomFactor={2} lensSize={150}>
                <img
                    src={el}
                    className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                    alt="thumbnail"
                />
              </Lens>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
