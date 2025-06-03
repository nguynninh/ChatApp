"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥳',
  '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '❤️',
  '👋', '🤚', '✋', '🖐️', '👌', '🤌', '🤏', '✌️', '🫰', '🤞',
  '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶'
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full h-9 w-9"
      >
        <SmileIcon className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-background shadow-md rounded-lg border p-2 w-64 z-10">
          <div className="grid grid-cols-8 gap-1">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                className="p-1.5 text-lg hover:bg-secondary rounded cursor-pointer"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SmileIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
};
