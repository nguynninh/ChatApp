"use client";

import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    CircleEllipsisIcon,
    VideoIcon,
    BlocksIcon
} from 'lucide-react';

interface ChatOptionsProps {
  onDeleteChat: () => void;
  onMuteNotifications: () => void;
  onBlockUser: () => void;
  onPhoneCall?: () => void;
  onVideoCall?: () => void;
}

export const ChatOptions = ({ 
  onDeleteChat,
  onMuteNotifications,
  onBlockUser,
  onPhoneCall,
  onVideoCall
}: ChatOptionsProps) => {
  return (
    <div className="flex items-center gap-2">
      {onPhoneCall && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8"
          onClick={onPhoneCall}
          title="Gọi điện"
        >
          <PhoneCallIcon className="h-4 w-4" />
        </Button>
      )}
      
      {onVideoCall && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8"
          onClick={onVideoCall}
          title="Gọi video"
        >
          <VideoIcon className="h-4 w-4" />
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <CircleEllipsisIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onMuteNotifications()}>
          <BlockIcon className="h-4 w-4 mr-2" />
          <span>Mute notifications</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <SearchIcon className="h-4 w-4 mr-2" />
          <span>Search in chat</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onBlockUser()} className="text-orange-600">
          <BlocksIcon className="h-4 w-4 mr-2" />
          <span>Block user</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDeleteChat()} className="text-destructive">
          <TrashIcon className="h-4 w-4 mr-2" />
          <span>Delete chat</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>
          <PhoneCallIcon className="h-4 w-4 mr-2" />
          <span>Audio call</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <VideoIcon className="h-4 w-4 mr-2" />
          <span>Video call</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
};

const MoreIcon = ({ className }: { className?: string }) => {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
};

const BellOffIcon = ({ className }: { className?: string }) => {
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
      <path d="M8.56 2.9A7 7 0 0 1 19 9v4m-2 4H2a3 3 0 0 0 3-3V9a7 7 0 0 1 .78-3.22M13.73 21a2 2 0 0 1-3.46 0" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
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

const BlockIcon = ({ className }: { className?: string }) => {
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
      <path d="m4.93 4.93 14.14 14.14" />
    </svg>
  );
};

const TrashIcon = ({ className }: { className?: string }) => {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
};

const PhoneCallIcon = ({ className }: { className?: string }) => {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
};

const VideoCallIcon = ({ className }: { className?: string }) => {
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
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
};
