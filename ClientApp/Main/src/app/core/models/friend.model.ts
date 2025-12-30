export interface Friend {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    friendsSince: string;
}

export interface FriendRequest {
    id: string; // request record id
    requesterId: string;
    requesterFirstName: string;
    requesterLastName: string;
    requesterProfileImageUrl?: string;
    requestedAt: string;
}
