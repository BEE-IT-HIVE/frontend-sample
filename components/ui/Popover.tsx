
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export const Popover: React.FC<PopoverProps> = ({ trigger, content, className, align = 'start' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClass = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 mt-2 w-auto bg-white dark:bg-[#0b1129] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl p-4",
              alignClass[align],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
