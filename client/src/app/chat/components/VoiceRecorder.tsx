"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
        setRecordingTime(0);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      // Update timer every second
      const timerInterval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Store interval ID as a property on the recorder to clear it later
      (recorder as any).timerInterval = timerInterval;
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      // Here you would show an error message to the user
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Clear the timer interval
      clearInterval((mediaRecorder as any).timerInterval);
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div className="relative">
      {isRecording ? (
        <div className="flex items-center gap-2">
          <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs">{formatTime(recordingTime)}</span>
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={stopRecording}
            className="h-8 w-8 rounded-full"
          >
            <StopIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={startRecording}
          className="rounded-full h-9 w-9"
        >
          <MicrophoneIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

const MicrophoneIcon = ({ className }: { className?: string }) => {
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
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
};

const StopIcon = ({ className }: { className?: string }) => {
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
      <rect width="14" height="14" x="5" y="5" rx="2" />
    </svg>
  );
};
