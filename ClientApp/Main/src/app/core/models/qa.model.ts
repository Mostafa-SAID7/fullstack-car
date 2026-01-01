export interface Question {
    id: string;
    title: string;
    content: string;
    status: QuestionStatus;
    priority: QuestionPriority;
    viewsCount: number;
    upvotesCount: number;
    downvotesCount: number;
    answersCount: number;
    hasAcceptedAnswer: boolean;
    acceptedAnswerId?: string;
    tags?: string;
    bountyAmount: number;
    bountyExpiresAt?: Date;
    userId: string;
    groupId?: string;
    categoryId?: string;
    user?: any;
    answers?: Answer[];
    createdAt: Date;
}

export enum QuestionStatus {
    Open = 0,
    Closed = 1,
    Resolved = 2,
    OnHold = 3,
    Duplicate = 4
}

export enum QuestionPriority {
    Low = 0,
    Normal = 1,
    High = 2,
    Urgent = 3
}

export interface Answer {
    id: string;
    content: string;
    status: number;
    upvotesCount: number;
    downvotesCount: number;
    isAccepted: boolean;
    acceptedAt?: Date;
    imageUrl?: string;
    isVerified: boolean;
    questionId: string;
    userId: string;
    user?: any;
    createdAt: Date;
}

export interface CreateQuestionRequest {
    title: string;
    content: string;
    groupId?: string;
    categoryId?: string;
    tags?: string[];
}

export interface CreateAnswerRequest {
    questionId: string;
    content: string;
    imageUrl?: string;
}
