
import React from "react";
import { cn } from "../../utils";

export function DotBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center bg-white dark:bg-[#01041a]", className)}>
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-[#01041a]"></div>
      <div className="relative z-20 w-full">{children}</div>
    </div>
  );
}
