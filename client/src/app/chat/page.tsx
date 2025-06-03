"use client";

import { useEffect, useState } from 'react';
import { ChatSidebar } from '@/app/chat/components';
import { ChatArea } from './components/ChatArea';
import { handleAPI } from '@/lib/http';

// Mock data for demonstration
const mockChats = [
	{
		id: 1,
		name: 'John Doe',
		lastMessage: 'Hey there!',
		time: '12:30 PM',
		unread: 2,
		avatar: '👨‍💼',
	},
	{
		id: 2,
		name: 'Jane Smith',
		lastMessage: 'How are you doing?',
		time: 'Yesterday',
		unread: 0,
		avatar: '👩‍💼',
	},
	{
		id: 3,
		name: 'Mike Johnson',
		lastMessage: 'See you tomorrow!',
		time: '2d ago',
		unread: 0,
		avatar: '👨‍🦱',
	},
	{
		id: 4,
		name: 'Sarah Williams',
		lastMessage: 'Thanks for the help!',
		time: '1w ago',
		unread: 0,
		avatar: '👩‍🦰',
	},
	{
		id: 5,
		name: 'David Lee',
		lastMessage: 'Can we schedule a call?',
		time: '3d ago',
		unread: 1,
		avatar: '👨‍🦲',
	},
	{
		id: 6,
		name: 'Emma Davis',
		lastMessage: 'I sent you the documents',
		time: '5d ago',
		unread: 0,
		avatar: '👩‍🦱',
	},
];

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
	const [selectedChatId, setSelectedChatId] = useState(1);

	useEffect(() => {
		const handleGetMyFriends = async () => {
			const api = "/profiles/friends/me";
			setIsLoading(true);
			
			try {
				const res: any = handleAPI(api);

				if (res && res.data) {
					console.log("Friends list:", res.data);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		handleGetMyFriends();
	}, []);

	const selectedChat = mockChats.find((chat) => chat.id === selectedChatId);

	return <div className="flex h-[calc(100vh-80px)] mx-auto mt-4 p-0.5 max-w-7xl rounded-lg border bg-secondary">
			<ChatSidebar
				chats={mockChats}
				selectedChat={selectedChatId}
				onSelectChat={setSelectedChatId}
			/>
			<ChatArea
				selectedChat={selectedChat}
				initialMessages={mockMessages}
			/>
		</div>;
};

export default ChatPage;