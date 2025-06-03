'use client';

import React, { useEffect, useState } from 'react'
import ChatSidebar from '@/app/(messages)/chats/chat-sidebar';
import ChatArea from '@/app/(messages)/chats/chat-area';
import { handleAPI } from '@/lib/http';
import { toast } from 'sonner';
import { User } from '@/models/UserModel';

const mockMessages = [
  { id: 1, text: 'Hey there!', sent: false, time: '12:30 PM' },
  { id: 2, text: 'Hi! How are you?', sent: true, time: '12:31 PM' },
  {
    id: 3,
    text: "I'm good. Just wanted to check in.",
    sent: false,
    time: '12:32 PM',
  },
  {
    id: 4,
    text: "That's great to hear! I've been busy with work lately.",
    sent: true,
    time: '12:33 PM',
  },
  { id: 5, text: 'Anything interesting happening?', sent: false, time: '12:35 PM' },
];

const ChatPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mockChats, setMockChats] = useState<User[]>([]);
  const [selectedChatId, setSelectedChatId] = useState(0);

  useEffect(() => {
    const handleGetChatLast = async () => {
      const api = "/profiles/friends/me";
      setIsLoading(true);

      try {
        const res: any = await handleAPI(api);

        if (res) {
          toast.success(res.message);
          setMockChats(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    handleGetChatLast();
  }, []);

  const selectedChat = mockChats?.find((chat) => chat.id === String(selectedChatId));

  return <div
    style={{
      display: 'flex',
      height: 'calc(100vh - 50px)',
      width: '95%',
      margin: 'auto',
      marginTop: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid var(--primary)',
      backgroundColor: 'var(--secondary)',
    }}>
    <div className="bg-primary/10">
      <div className="flex flex-col w-86">
        <ChatSidebar
          chats={mockChats}
          selectedChat={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      <ChatArea
        selectedChat={selectedChat}
        initialMessages={mockMessages}
      />
    </div>
  </div>
}

export default ChatPage;