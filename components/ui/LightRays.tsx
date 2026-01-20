
import React from "react";
import { cn } from "../../utils";

export const LightRays = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute -top-[50%] left-[50%] -translate-x-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,170,13,0.1)_20deg,transparent_40deg,rgba(3,10,55,0.1)_60deg,transparent_80deg,rgba(255,255,255,0.1)_100deg,transparent_360deg)] animate-[spin_20s_linear_infinite] opacity-50 dark:opacity-30 blur-3xl" />
    </div>
  );
};
