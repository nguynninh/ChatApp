"use client";

import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { ChatSearch } from './ChatSearch';

type Chat = {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
};

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: number;
  onSelectChat: (id: number) => void;
}

export const ChatSidebar = ({ chats, selectedChat, onSelectChat }: ChatSidebarProps) => {
  const [filteredChats, setFilteredChats] = useState(chats);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredChats(chats);
      return;
    }

    const filtered = chats.filter(chat => 
      chat.name.toLowerCase().includes(query.toLowerCase()) || 
      chat.lastMessage.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredChats(filtered);
  };

  return (
    <div style={{
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2d2e2f',
    }}>
      <div className="p-4 border-b bg-secondary/30">
        <h2 className="font-semibold text-xl">Chats</h2>
        <div className="mt-2">
          <ChatSearch onSearch={handleSearch} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-3 p-3 hover:bg-secondary/50 cursor-pointer ${
              selectedChat === chat.id ? 'bg-secondary' : ''
            }`}
            onClick={() => onSelectChat(chat.id)}>
            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-lg">
              {chat.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
        
        {filteredChats.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
};
