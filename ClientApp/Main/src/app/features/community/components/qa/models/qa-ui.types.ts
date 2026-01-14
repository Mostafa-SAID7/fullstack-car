import { Answer, QuestionSimilarity } from './qa-api.types';

export interface RealTimeAnswer extends Omit<Answer, 'createdAt' | 'updatedAt' | 'acceptedAt' | 'userVote'> {
    userAvatar?: string;
    createdAt: Date;
    updatedAt?: Date;
    acceptedAt?: Date;
    userVote?: 'Up' | 'Down' | null;
}

export interface TypingUser {
    userId: string;
    userName: string;
    isTyping: boolean;
}

export interface SimilarQuestion extends QuestionSimilarity {
    relevanceLevel: 'high' | 'medium' | 'low';
    matchReason: string;
}
