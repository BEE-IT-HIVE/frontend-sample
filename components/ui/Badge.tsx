import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-hive-blue text-white hover:bg-hive-blue/80 dark:bg-white dark:text-hive-blue",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gold: "border-transparent bg-hive-gold text-hive-blue hover:bg-hive-gold/80",
        ghost: "border-transparent bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "gold" | "ghost" | null;
    className?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };