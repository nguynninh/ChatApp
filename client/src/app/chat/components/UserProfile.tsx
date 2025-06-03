"use client";

import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar } from '@radix-ui/react-avatar';

type User = {
  id: number;
  name: string;
  avatar: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
  email?: string;
  phone?: string;
};

interface UserProfileProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile = ({ user, isOpen, onClose }: UserProfileProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div>
            <Avatar>
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <AvatarFallback className="h-24 w-24 flex items-center justify-center bg-primary/10 text-5xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            View information about {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 pt-4">
          {/* <div className="h-24 w-24 rounded-full flex items-center justify-center bg-primary/10 text-5xl">
            {user.avatar}
          </div> */}

          <div className="text-center">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <div className="flex items-center justify-center mt-1 gap-1">
              <span className={`h-2 w-2 rounded-full ${user.status === 'online' ? 'bg-green-500' :
                  user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></span>
              <span className="text-sm text-muted-foreground">
                {user.status === 'online' ? 'Online' :
                  user.status === 'away' ? 'Away' : 'Offline'}
              </span>
            </div>
            {user.lastSeen && user.status !== 'online' && (
              <p className="text-sm text-muted-foreground mt-1">Last seen {user.lastSeen}</p>
            )}
          </div>

          <div className="w-full space-y-2">
            {user.email && (
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Email</span>
                <span>{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Phone</span>
                <span>{user.phone}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <Button>Send Message</Button>
            <Button variant="outline">Block User</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
