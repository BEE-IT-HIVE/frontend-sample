
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { cn } from "../../utils";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-[#020515] font-sans md:px-10"
      ref={containerRef}
    >
      {/* Mobile Vertical Timeline */}
      <div className="md:hidden px-4 pb-20 relative">
         {/* Vertical Guide Line */}
         <div className="absolute left-[85px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10" />
         
         <div className="space-y-12">
            {data.map((item, index) => (
               <div key={index} className="flex gap-6 relative">
                  {/* Sticky Year Anchor */}
                  <div className="w-[60px] flex-shrink-0 text-right sticky top-24 self-start z-10 h-fit">
                     <span className="font-heading font-bold text-xl text-hive-gold drop-shadow-sm bg-white/80 dark:bg-[#020515]/80 backdrop-blur-sm px-1 rounded">
                        {item.title}
                     </span>
                  </div>

                  {/* Marker Node */}
                  <div className="absolute left-[85px] -translate-x-1/2 mt-1.5 z-20">
                     <div className="w-3 h-3 rounded-full bg-hive-blue border-2 border-hive-gold shadow-[0_0_10px_rgba(255,170,13,0.5)]"></div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 pb-4">
                     <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        {item.content}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Desktop Animated Timeline */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 hidden md:block">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-40 gap-10"
          >
            {/* Sticky Marker Section */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-[#0b1129] flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/10 z-50">
                {/* Inner active dot */}
                <div className="h-3 w-3 rounded-full bg-hive-gold border border-hive-gold/50 shadow-[0_0_10px_rgba(255,170,13,0.5)]" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 font-heading">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              {item.content}
            </div>
          </div>
        ))}
        
        {/* Base Line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-[31px] top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          {/* Light-Speed Trail Effect */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          >
             {/* Glowing Tip */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-20 bg-gradient-to-t from-hive-gold to-transparent blur-md"></div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
