export interface Notification {
    id: string;
    title: string;
    message: string;
    targetUrl?: string; // Optional, might navigate somewhere
    isRead: boolean;
    createdAt: Date;
    sourceUserId?: string; // Who triggered this?
    sourceUserAvatar?: string; // Optional avatar for UI
}
