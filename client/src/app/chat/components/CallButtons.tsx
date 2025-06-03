"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CallModal } from './CallModal';

interface CallButtonsProps {
  onPhoneCall?: () => void;
  onVideoCall?: () => void;
  userName: string;
}

export const CallButtons = ({ onPhoneCall, onVideoCall, userName }: CallButtonsProps) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');

  const handlePhoneCall = () => {
    setCallType('voice');
    setIsCallModalOpen(true);
    onPhoneCall?.();
  };

  const handleVideoCall = () => {
    setCallType('video');
    setIsCallModalOpen(true);
    onVideoCall?.();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8"
          onClick={handlePhoneCall}
          title="Voice Call"
        >
          <PhoneCallIcon className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8"
          onClick={handleVideoCall}
          title="Video Call"
        >
          <VideoCallIcon className="h-4 w-4" />
        </Button>
      </div>

      <CallModal 
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        userName={userName}
        callType={callType}
      />
    </>
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
