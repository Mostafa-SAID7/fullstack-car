export interface Review {
    id: string;
    title: string;
    content: string;
    rating: number;
    type: number; // enum ReviewType
    imageUrl?: string;
    isVerified: boolean;
    helpfulCount: number;
    createdAt: string;
    updatedAt?: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    userProfileImageUrl?: string;
    carBrand?: string;
    carModel?: string;
    carYear?: number;
}

export interface CreateReviewRequest {
    title: string;
    content: string;
    rating: number;
    type: number;
    imageUrl?: string;
    carBrand?: string;
    carModel?: string;
    carYear?: number;
}

export interface UpdateReviewRequest {
    title?: string;
    content?: string;
    rating?: number;
    type?: number;
    imageUrl?: string;
    carBrand?: string;
    carModel?: string;
    carYear?: number;
}
