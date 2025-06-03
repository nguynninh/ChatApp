"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  callType: 'voice' | 'video';
  openInNewWindow?: boolean; // Option to open call in new window
}

export const CallModal = ({ isOpen, onClose, userName, callType, openInNewWindow = true }: CallModalProps) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [showLocalVideo, setShowLocalVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [newWindowOpened, setNewWindowOpened] = useState(false);
  const [useNewWindow, setUseNewWindow] = useState(openInNewWindow);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOpen && callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, callStatus]);

  useEffect(() => {
    if (isOpen) {
      if (useNewWindow && !newWindowOpened) {
        // Open call in a new window
        const callUrl = `/chats/call?userName=${encodeURIComponent(userName)}&callType=${callType}`;
        const newWindow = window.open(callUrl, '_blank', 'width=800,height=600');
        
        if (newWindow) {
          setNewWindowOpened(true);
          // Close the modal when new window is opened
          onClose();
          
          // Reset when window is closed
          const checkIfClosed = setInterval(() => {
            if (newWindow.closed) {
              clearInterval(checkIfClosed);
              setNewWindowOpened(false);
            }
          }, 1000);
        } else {
          // If popup blocked, continue with modal
          const timer = setTimeout(() => {
            setCallStatus('connected');
          }, 2000);
          return () => clearTimeout(timer);
        }
      } else if (!useNewWindow) {
        // Regular modal behavior when useNewWindow is false
        const timer = setTimeout(() => {
          setCallStatus('connected');
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      setCallStatus('connecting');
      setCallDuration(0);
      setNewWindowOpened(false);
    }
  }, [isOpen, useNewWindow, newWindowOpened, userName, callType, onClose]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const MicIcon = ({ className, muted }: { className?: string; muted?: boolean }) => {
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
        {muted ? (
          <>
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </>
        ) : (
          <>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </>
        )}
      </svg>
    );
  };

  const VideoIcon = ({ className, off }: { className?: string; off?: boolean }) => {
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
        {off ? (
          <>
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M15 11v-6l8 2v10l-4-1" />
            <path d="M10 11l-2-1-.445.44m7.89 7.89A6 6 0 0 1 2 12v-2" />
          </>
        ) : (
          <>
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </>
        )}
      </svg>
    );
  };

  const NewWindowIcon = ({ className }: { className?: string }) => {
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
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    );
  };

  const EndCallIcon = ({ className }: { className?: string }) => {
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
        <path d="M16 2v2c8.5 0 8.5 12 0 12v2" />
        <path d="M8 2v2C-.5 4-.5 16 8 16v2" />
        <path d="m4 8 4 4 4-4" />
        <path d="m16 8-4 4-4-4" />
      </svg>
    );
  };

  // Don't render if we've successfully opened a new window
  if (newWindowOpened) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleEndCall()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {callStatus === 'connecting' && 'Connecting...'}
            {callStatus === 'connected' && `${callType === 'video' ? 'Video' : 'Voice'} call with ${userName}`}
            {callStatus === 'ended' && 'Call ended'}
          </DialogTitle>
          {callStatus === 'connecting' && (
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Label htmlFor="new-window" className="text-sm">Mở trong cửa sổ mới</Label>
              <Switch id="new-window" checked={useNewWindow} onCheckedChange={setUseNewWindow} />
            </div>
          )}
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4 py-6">
          {callType === 'video' && callStatus === 'connected' && (
            <div className="relative w-full h-56 bg-secondary rounded-md flex items-center justify-center">
              {showLocalVideo ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-violet-500 rounded-md flex items-center justify-center">
                  <div className="absolute top-2 right-2 w-24 h-24 bg-secondary rounded-md overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500">
                        <div className="relative w-full h-full">
                            <video 
                                autoPlay 
                                playsInline 
                                muted 
                                ref={(videoElement) => {
                                    if (videoElement && showLocalVideo) {
                                        // Request camera access and connect to the video element
                                        navigator.mediaDevices.getUserMedia({ video: true })
                                            .then((stream) => {
                                                videoElement.srcObject = stream;
                                            })
                                            .catch((error) => {
                                                console.error("Error accessing camera:", error);
                                            });
                                    }
                                }}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl mb-2">
                    {userName.substring(0, 1).toUpperCase()}
                  </div>
                  <p className="text-sm text-muted-foreground">Camera off</p>
                </div>
              )}
            </div>
          )}

          {(callType === 'voice' || !showLocalVideo) && callStatus === 'connected' && (
            <div className="flex flex-col items-center justify-center my-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl text-white mb-2">
                {userName.substring(0, 1).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold">{userName}</h3>
            </div>
          )}

          {callStatus === 'connecting' && (
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl mb-2">
                {userName.substring(0, 1).toUpperCase()}
              </div>
              <div className="animate-pulse">Calling {userName}...</div>
            </div>
          )}

          {callStatus === 'connected' && (
            <div className="text-center text-sm text-muted-foreground">
              {formatDuration(callDuration)}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-4">
            {callStatus === 'connected' && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  <MicIcon className="h-5 w-5" muted={isMuted} />
                </Button>

                {callType === 'video' && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12"
                    onClick={() => setShowLocalVideo(!showLocalVideo)}
                  >
                    <VideoIcon className="h-5 w-5" off={!showLocalVideo} />
                  </Button>
                )}

                {useNewWindow && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12"
                    onClick={() => {
                      // Reopen the call in a new window
                      const callUrl = `/chats/call?userName=${encodeURIComponent(userName)}&callType=${callType}`;
                      window.open(callUrl, '_blank', 'width=800,height=600');
                    }}
                  >
                    <NewWindowIcon className="h-5 w-5" />
                  </Button>
                )}
              </>
            )}

            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={handleEndCall}
            >
              <EndCallIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
