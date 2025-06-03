"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChatAttachmentProps {
  onAttach: (file: File) => void;
}

export const ChatAttachment = ({ onAttach }: ChatAttachmentProps) => {
  const [showOptions, setShowOptions] = useState(false);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAttach(files[0]);
      setShowOptions(false);
    }
  };
  
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setShowOptions(!showOptions)}
        className="rounded-full h-9 w-9"
      >
        <PaperclipIcon className="h-5 w-5" />
      </Button>
      
      {showOptions && (
        <div className="absolute bottom-full mb-2 right-0 bg-background shadow-md rounded-lg border p-2 flex flex-col gap-1">
          <label className="flex items-center gap-2 p-2 rounded hover:bg-secondary cursor-pointer">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm">Image</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileSelect}
            />
          </label>
          <label className="flex items-center gap-2 p-2 rounded hover:bg-secondary cursor-pointer">
            <FileIcon className="h-4 w-4" />
            <span className="text-sm">Document</span>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" 
              className="hidden" 
              onChange={handleFileSelect}
            />
          </label>
        </div>
      )}
    </div>
  );
};

const PaperclipIcon = ({ className }: { className?: string }) => {
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
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
};

const ImageIcon = ({ className }: { className?: string }) => {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
};

const FileIcon = ({ className }: { className?: string }) => {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
};
