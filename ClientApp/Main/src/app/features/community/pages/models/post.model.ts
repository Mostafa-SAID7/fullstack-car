export interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    type: number;
    status: number;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt?: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userProfileImageUrl?: string;
    groupId?: string;
    groupName?: string;
}

export interface CreatePostRequest {
    title: string;
    content: string;
    imageUrl?: string;
    type: number;
    groupId?: string;
}

