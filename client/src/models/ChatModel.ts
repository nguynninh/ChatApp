export interface Chat {
    id: number;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    photoUrl: string;
    lastActive?: string;
}

export interface Message {
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
}