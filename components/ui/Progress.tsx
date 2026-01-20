
import React from 'react';
import { cn } from '../../utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, indicatorClassName, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10",
          className
        )}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 bg-hive-gold transition-all duration-500 ease-in-out", indicatorClassName)}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
