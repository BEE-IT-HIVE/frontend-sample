
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-full w-10 h-10 bg-transparent border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-[1.2rem] w-[1.2rem] text-white" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] text-hive-blue" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
