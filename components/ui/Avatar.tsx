
import React from 'react';
import { cn } from '../../utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-white/10 shadow-sm",
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-hive-blue dark:text-hive-gold font-bold text-xs">
            {fallback}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
