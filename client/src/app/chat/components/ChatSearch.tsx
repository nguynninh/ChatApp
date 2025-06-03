"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface ChatSearchProps {
  onSearch: (query: string) => void;
}

export const ChatSearch = ({ onSearch }: ChatSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative">
      <Input 
        placeholder="Search conversations..." 
        className="pl-8"
        value={searchQuery}
        onChange={handleSearch}
      />
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      
      {searchQuery && (
        <button 
          className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground"
          onClick={() => {
            setSearchQuery('');
            onSearch('');
          }}
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
};

const XIcon = ({ className }: { className?: string }) => {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
};
