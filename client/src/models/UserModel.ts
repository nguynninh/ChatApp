export interface User {
    id: string;
    name: string;
    username?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
    role?: 'user' | 'admin' | 'moderator';
}