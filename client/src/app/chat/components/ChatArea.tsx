"use client";

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Image from 'next/image';
import { ChatAttachment } from '@/app/chat/components/ChatAttachment';
import { EmojiPicker } from '@/app/chat/components/EmojiPicker';
import { TypingIndicator } from '@/app/chat/components/TypingIndicator';
import { ChatOptions } from '@/app/chat/components/ChatOptions';
import { UserProfile } from '@/app/chat/components/UserProfile';
import { VoiceRecorder } from '@/app/chat/components/VoiceRecorder';
import { CallButtons } from '@/app/chat/components/CallButtons';

type Message = {
    id: number;
    text: string;
    sent: boolean;
    time: string;
    attachment?: {
        type: 'image' | 'document' | 'audio';
        name: string;
        url: string;
        duration?: string;
    };
};

type Chat = {
    id: number;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    avatar: string;
};

interface ChatAreaProps {
    selectedChat: Chat | undefined;
    initialMessages: Message[];
}

const SendIcon = ({ className }: { className?: string }) => {
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
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    );
};



export const ChatArea = ({ selectedChat, initialMessages }: ChatAreaProps) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showProfile, setShowProfile] = useState(false);

    const handleSendMessage = () => {
        if (newMessage.trim() || selectedFile) {
            const newMsg: Message = {
                id: messages.length + 1,
                text: newMessage,
                sent: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            if (selectedFile) {
                const isImage = selectedFile.type.startsWith('image/');
                newMsg.attachment = {
                    type: isImage ? 'image' : 'document',
                    name: selectedFile.name,
                    url: URL.createObjectURL(selectedFile)
                };
                setSelectedFile(null);
            }

            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    const handleAttachment = (file: File) => {
        setSelectedFile(file);
    };

    const userDetails = selectedChat ? {
        id: selectedChat.id,
        name: selectedChat.name,
        avatar: selectedChat.avatar,
        status: 'online' as const,
        lastSeen: '3 minutes ago',
        email: `${selectedChat.name.toLowerCase().replace(' ', '.')}@example.com`,
        phone: '+1 (555) 123-4567'
    } : undefined;

    if (!selectedChat) {
        return (
            <Card className="flex-1 flex items-center justify-center rounded-r-lg text-muted-foreground">
                Select a chat to start messaging
            </Card>
        );
    }

    return (
        <div className="flex-1 flex flex-col rounded-r-lg" style={{ backgroundColor: '#1e1e1e' }}>
            <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div
                        className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 text-lg cursor-pointer hover:opacity-80"
                        onClick={() => setShowProfile(true)}
                    >
                        {selectedChat.avatar}
                    </div>
                    <h2 className="font-semibold">{selectedChat.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <CallButtons
                        userName={selectedChat.name}
                        onPhoneCall={() => {
                            // Handle voice call
                            console.log('Starting voice call with', selectedChat.name);
                        }}
                        onVideoCall={() => {
                            // Handle video call
                            console.log('Starting video call with', selectedChat.name);
                        }}
                    />

                    <ChatOptions
                        onDeleteChat={() => {
                            // In a real app, this would call an API to delete the chat
                            console.log('Delete chat', selectedChat.id);
                        }}
                        onMuteNotifications={() => {
                            // In a real app, this would toggle notifications for this chat
                            console.log('Mute notifications', selectedChat.id);
                        }}
                        onBlockUser={() => {
                            // In a real app, this would block the user
                            console.log('Block user', selectedChat.id);
                        }}
                    />
                </div>
            </div>

            {userDetails && (
                <UserProfile
                    user={userDetails}
                    isOpen={showProfile}
                    onClose={() => setShowProfile(false)}
                />
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.sent
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary'
                                }`}
                        >
                            {message.attachment && message.attachment.type === 'image' && (
                                <div className="mb-2 relative h-60 w-auto">
                                    <Image
                                        src={message.attachment.url}
                                        alt={message.attachment.name}
                                        className="rounded object-contain"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOlFPQAAAABJRU5ErkJggg=="
                                    />
                                </div>
                            )}

                            {message.attachment && message.attachment.type === 'document' && (
                                <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded mb-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    <span className="text-sm truncate">{message.attachment.name}</span>
                                </div>
                            )}

                            {message.attachment && message.attachment.type === 'audio' && (
                                <div className="flex flex-col gap-2 mb-2">
                                    <audio
                                        src={message.attachment.url}
                                        controls
                                        className="w-full h-10"
                                    />
                                    <div className="flex justify-between items-center text-xs">
                                        <span>Voice message</span>
                                        {message.attachment.duration && (
                                            <span>{message.attachment.duration}</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {message.text && <p>{message.text}</p>}

                            <span className="text-xs block text-right mt-1 opacity-70">
                                {message.time}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                <TypingIndicator userName={selectedChat.name} />
            </div>

            {selectedFile && (
                <div className="px-4 pt-2 flex items-center gap-2">
                    <div className="border rounded p-1 flex items-center gap-1 bg-secondary/10">
                        <span className="text-xs truncate max-w-[200px]">{selectedFile.name}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={() => setSelectedFile(null)}
                        >
                            <span>×</span>
                        </Button>
                    </div>
                </div>
            )}

            <div className="p-4 border-t flex gap-2">
                <ChatAttachment onAttach={handleAttachment} />
                <EmojiPicker onEmojiSelect={(emoji) => setNewMessage(prev => prev + emoji)} />
                <VoiceRecorder
                    onRecordingComplete={(audioBlob) => {
                        const newMsg: Message = {
                            id: messages.length + 1,
                            text: '',
                            sent: true,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            attachment: {
                                type: 'audio',
                                name: `Voice Message (${new Date().toLocaleTimeString()})`,
                                url: URL.createObjectURL(audioBlob),
                                duration: '0:15' // In a real app, calculate actual duration
                            }
                        };
                        setMessages([...messages, newMsg]);
                    }}
                />

                <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    className="flex-1"
                />

                <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!newMessage.trim() && !selectedFile}
                >
                    <SendIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
