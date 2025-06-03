"use client";

import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  userName?: string;
}

export const TypingIndicator = ({ userName }: TypingIndicatorProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show typing indicator for 3 seconds, then hide it
    // In a real app, this would be controlled by real-time events
    const timeout = setTimeout(() => {
      setVisible(true);
      
      const hideTimeout = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(hideTimeout);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="flex px-4 py-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <div className="flex items-center">
          <span className="sr-only">Loading</span>
          <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
          <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
        </div>
        {userName && <span>{userName} is typing</span>}
      </div>
    </div>
  );
};
