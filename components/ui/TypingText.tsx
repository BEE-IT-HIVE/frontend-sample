
import React, { useState, useEffect } from 'react';
import { cn } from '../../utils';

interface TypingTextProps {
  text: string;
  typingSpeed?: number;
  className?: string;
  onCharacterTyped?: () => void;
  onComplete?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({ 
  text, 
  typingSpeed = 30, 
  className, 
  onCharacterTyped,
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        if (onCharacterTyped) onCharacterTyped();
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, typingSpeed, onCharacterTyped, onComplete]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse inline-block w-1.5 h-4 bg-hive-gold ml-0.5 align-middle"></span>
      )}
    </span>
  );
};
