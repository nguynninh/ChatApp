"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CallPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [showLocalVideo, setShowLocalVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  
  // Get call parameters from URL
  const userName = searchParams.get('userName') || 'User';
  const callType = (searchParams.get('callType') as 'voice' | 'video') || 'video';
  
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  // Initialize camera/video when component loads
  useEffect(() => {
    async function initializeMedia() {
      try {
        if (callType === 'video') {
          const constraints = { 
            video: { facingMode: isFrontCamera ? "user" : "environment" },
            audio: true 
          };
          
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          // Store the stream for later use
          localStreamRef.current = stream;
          
          // Connect the stream to video element if it exists
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
        
        // Simulate connecting to call server
        setTimeout(() => {
          setCallStatus('connected');
        }, 2000);
      } catch (error) {
        console.error("Error accessing media devices:", error);
        // Fall back to voice only if video fails
        if (callType === 'video') {
          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStreamRef.current = audioStream;
          } catch (audioError) {
            console.error("Could not access audio:", audioError);
          }
        }
        // Still show as connected
        setTimeout(() => {
          setCallStatus('connected');
        }, 2000);
      }
    }
    
    initializeMedia();
    
    return () => {
      // Cleanup: stop all tracks when component unmounts
      const currentLocalStream = localStreamRef.current;
      const currentScreenShareStream = screenShareStreamRef.current;
      
      if (currentLocalStream) {
        currentLocalStream.getTracks().forEach(track => track.stop());
      }
      
      if (currentScreenShareStream) {
        currentScreenShareStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [callType, isFrontCamera]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleEndCall = useCallback(() => {
    setCallStatus('ended');
    setTimeout(() => {
      window.close(); // Close the window
      // If window doesn't close (when opened as a tab), redirect back
      router.push('/chats');
    }, 500);
  }, [router]);

  // Handle before unload to end call properly when window is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (callStatus === 'connected') {
        // Can add actual call hangup logic here
        if (localStreamRef.current) {
          const tracks = localStreamRef.current.getTracks();
          tracks.forEach(track => track.stop());
        }
        
        if (screenShareStreamRef.current) {
          const screenTracks = screenShareStreamRef.current.getTracks();
          screenTracks.forEach(track => track.stop());
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [callStatus]);

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
  
  const ScreenShareIcon = ({ className, active }: { className?: string; active?: boolean }) => {
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
        {active ? (
          <>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="m16 8-4-4-4 4" />
            <path d="M12 4v7" />
          </>
        ) : (
          <>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </>
        )}
      </svg>
    );
  };
  
  const FlipCameraIcon = ({ className }: { className?: string }) => {
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
        <path d="M9 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        <path d="M10 2h4" />
        <path d="M14 6h.01" />
        <path d="M20 2a4 4 0 0 1 4 4v10c0 2.21-1.79 4-4 4H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h3.17" />
        <path d="M14 2v4" />
        <path d="m14 15 2-2 4 4" />
        <path d="m4 15 4 4 2-2" />
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
        <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
        <line x1="22" y1="2" x2="2" y2="22" />
      </svg>
    );
  };

  // Handle screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const displayMediaOptions = {
          video: {
            cursor: "always",
            displaySurface: "monitor"
          },
          audio: false
        };
        
        const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions as DisplayMediaStreamOptions);
        
        // Save stream reference for cleanup
        screenShareStreamRef.current = screenStream;
        
        // When screen sharing ends (user clicks "Stop sharing")
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          setIsScreenSharing(false);
          screenShareStreamRef.current = null;
        });
        
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing
        if (screenShareStreamRef.current) {
          screenShareStreamRef.current.getTracks().forEach(track => track.stop());
          screenShareStreamRef.current = null;
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      setIsScreenSharing(false);
    }
  }, [isScreenSharing]);
  
  // Handle camera flipping (front/back)
  const toggleCamera = useCallback(async () => {
    if (!localStreamRef.current) return;
    
    // Stop current video tracks
    localStreamRef.current.getVideoTracks().forEach(track => track.stop());
    
    try {
      // Request new stream with opposite facing mode
      const newFacingMode = isFrontCamera ? "environment" : "user";
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
        audio: true
      });
      
      // Keep audio tracks from original stream
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        newStream.addTrack(track);
      });
      
      // Update local stream reference
      localStreamRef.current = newStream;
      
      // Update video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }
      
      setIsFrontCamera(!isFrontCamera);
    } catch (err) {
      console.error("Error flipping camera:", err);
    }
  }, [isFrontCamera]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      <header className="p-4 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">
              {callStatus === 'connecting' && 'Connecting...'}
              {callStatus === 'connected' && `${callType === 'video' ? 'Video' : 'Voice'} call with ${userName}`}
              {callStatus === 'ended' && 'Call ended'}
            </h1>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">
              {callStatus === 'connected' && formatDuration(callDuration)}
            </span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {callType === 'video' && callStatus === 'connected' && (
          <div className="relative w-full max-w-4xl h-full max-h-[70vh] bg-secondary rounded-lg flex items-center justify-center">
            {showLocalVideo ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-violet-500 rounded-lg flex items-center justify-center">
                {/* Main remote video - would be replaced with real remote stream */}
                <video 
                  autoPlay 
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                  muted
                  poster="/chats/image.png"
                />
                
                <div className="absolute top-4 right-4 w-48 h-36 bg-secondary rounded-lg overflow-hidden">
                  <div className="w-full h-full">
                    {/* Local video */}
                    <video 
                      autoPlay 
                      playsInline 
                      muted 
                      ref={localVideoRef}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center text-4xl mb-4">
                  {userName.substring(0, 1).toUpperCase()}
                </div>
                <p className="text-lg text-muted-foreground">Camera off</p>
              </div>
            )}
          </div>
        )}

        {(callType === 'voice' || !showLocalVideo) && callStatus === 'connected' && (
          <div className="flex flex-col items-center justify-center my-8">
            <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-5xl text-white mb-4">
              {userName.substring(0, 1).toUpperCase()}
            </div>
            <h2 className="text-2xl font-semibold">{userName}</h2>
          </div>
        )}

        {callStatus === 'connecting' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-secondary flex items-center justify-center text-5xl mb-4">
              {userName.substring(0, 1).toUpperCase()}
            </div>
            <div className="text-xl animate-pulse">Calling {userName}...</div>
          </div>
        )}

        {callStatus === 'ended' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-secondary flex items-center justify-center text-5xl mb-4">
              {userName.substring(0, 1).toUpperCase()}
            </div>
            <div className="text-xl">Call ended</div>
          </div>
        )}
      </main>
      
      <footer className="p-6 border-t">
        <div className="max-w-md mx-auto flex flex-wrap items-center justify-center gap-4">
          {callStatus === 'connected' && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-14 w-14"
                onClick={() => setIsMuted(!isMuted)}
              >
                <MicIcon className="h-6 w-6" muted={isMuted} />
              </Button>

              {callType === 'video' && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-14 w-14"
                    onClick={() => setShowLocalVideo(!showLocalVideo)}
                  >
                    <VideoIcon className="h-6 w-6" off={!showLocalVideo} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full h-14 w-14 ${isScreenSharing ? 'bg-accent' : ''}`}
                    onClick={toggleScreenShare}
                  >
                    <ScreenShareIcon className="h-6 w-6" active={isScreenSharing} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-14 w-14"
                    onClick={toggleCamera}
                  >
                    <FlipCameraIcon className="h-6 w-6" />
                  </Button>
                </>
              )}
            </>
          )}

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-14 w-14"
            onClick={handleEndCall}
          >
            <EndCallIcon className="h-6 w-6" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
