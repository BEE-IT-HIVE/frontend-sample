
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils';
import { Skeleton } from './Skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  threshold?: number;
  wrapperClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className, 
  wrapperClassName,
  threshold = 300,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden w-full h-full bg-gray-100 dark:bg-white/5", wrapperClassName)}>
      <Skeleton className={cn("absolute inset-0 w-full h-full transition-opacity duration-500", isLoaded ? "opacity-0" : "opacity-100")} />
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-xl scale-105",
            className
          )}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
};
