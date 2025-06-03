'use client';

import { Button } from '@/components/ui/button';
import { Chat } from '@/models/ChatModel';
import { SquarePen } from 'lucide-react';
import { ChatSearch } from './components';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { ModeToggle } from '@/components/mode-toggle';
import { use, useEffect, useState } from 'react';
import { get } from 'http';
import { toast } from 'sonner';

interface ChatSidebarProps {
  chat: Chat[];
  selectedChat: number;
  onSelectChat: (id: number) => void;
}

const ChatSidebar = (props: ChatSidebarProps) => {
  const { chat, selectedChat, onSelectChat } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const getRooms = async () =>  {
      setIsLoading(true);
      const api = "chat/rooms/history";
      
      try{
        const res: any = await get(api);

        console.log(res);

        if (res.data) {
          // setChats(res.data.map((room: any) => ({
          //   id: room.id,
          //   name: room.name,
          //   photoUrl: room.photoUrl,
          //   lastMessage: room.lastMessage,
          //   time: room.time,
          //   unread: room.unread || 0
          // })));
        }
      } catch (error) {
        toast.error((error as Error).message || 'Failed to load chats');
      } finally {
        setIsLoading(false);
      }
    }

    getRooms()
  }, []);

  return <div style={{
    display: 'flex',
    flexDirection: 'column',
  }}>
    <div className="flex items-center justify-between p-4">
      <div className='flex items-center gap-2'>
        <h2 className="font-semibold text-xl"
        onClick={() => onSelectChat}>Chats</h2>
        <ModeToggle />
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-8 w-8"
        onClick={() => {}}>
        <SquarePen className="h-5 w-5" />
      </Button>
    </div>

    <div className="p-4">
      <ChatSearch onSearch={() => {}} />
    </div>

    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-3 p-3 hover:bg-secondary/50 cursor-pointer ${
              selectedChat === chat.id ? 'bg-secondary' : ''
            }`}
            onClick={() => onSelectChat(chat.id)}>
              <Avatar>
                <AvatarImage 
                  src={chat.photoUrl} 
                  alt={chat.name} />
                <AvatarFallback>{chat.name}</AvatarFallback>
              </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
              <div className='flex items-center'>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                <span className="ml-2 text-xs text-muted-foreground">{" . "}</span>
              </div>
            </div>
            {chat.unread > 0 && (
              <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {chat.unread}
              </div>
            )}
          </div>
      ))}
      {chats.length === 0 && (
        <div className="text-center p-4 text-gray-500">
            No conversations found
        </div>
      )}
    </div>
  </div>;
}

export default ChatSidebar
