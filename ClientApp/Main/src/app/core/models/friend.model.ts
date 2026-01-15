export interface Friend {
    id: string;
    userId: string;
    friendId: string;
    status: number;
    createdAt: string;
    acceptedAt?: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    friendsSince: string;
    friendFirstName: string;
    friendLastName: string;
    friendProfileImageUrl?: string;
    friendIsVerified: boolean;
}

export interface FriendRequest {
    id: string; // request record id
    senderId: string;
    receiverId: string;
    status: number;
    message?: string;
    createdAt: string;
    respondedAt?: string;
    requesterId: string;
    requesterFirstName: string;
    requesterLastName: string;
    requesterProfileImageUrl?: string;
    requestedAt: string;
    senderFirstName: string;
    senderLastName: string;
    senderProfileImageUrl?: string;
    senderIsVerified: boolean;
}
