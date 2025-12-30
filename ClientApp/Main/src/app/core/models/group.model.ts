export interface Group {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    type: number; // enum GroupType
    privacy: number; // enum GroupPrivacy
    membersCount: number;
    postsCount: number;
    createdAt: string;
    updatedAt?: string;
    ownerId: string;
    ownerFirstName: string;
    ownerLastName: string;
    ownerProfileImageUrl?: string;
}

export interface CreateGroupRequest {
    name: string;
    description: string;
    imageUrl?: string;
    type: number;
    privacy: number;
}

export interface UpdateGroupRequest {
    name?: string;
    description?: string;
    imageUrl?: string;
    type?: number;
    privacy?: number;
}
