
import React, { useRef } from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[1rem] text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest active:scale-95 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-hive-blue text-white hover:bg-hive-blue/90 dark:bg-hive-gold dark:text-hive-blue dark:hover:bg-hive-gold/90 shadow-md hover:shadow-[0_0_20px_rgba(3,10,55,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,170,13,0.4)] border border-transparent",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/90 shadow-md hover:shadow-red-500/30",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-hive-gold transition-colors",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/20 border border-transparent hover:border-gray-300 dark:hover:border-white/30",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:bg-hive-gold/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-2xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
  enableSound?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, enableSound = true, onClick, ...props }, ref) => {
    
    const playClickSound = () => {
      if (!enableSound) return;
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
      } catch (e) {
        // Audio context might be blocked or not supported
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClickSound();
      if (onClick) onClick(e);
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
