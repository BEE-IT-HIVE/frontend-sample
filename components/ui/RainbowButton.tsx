
import React from "react";
import { cn } from "../../utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-bold text-white transition-colors [background-image:linear-gradient(90deg,#00C9FF,#92FE9D,#FFAA0D,#DB3069,#00C9FF)] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
RainbowButton.displayName = "RainbowButton";
