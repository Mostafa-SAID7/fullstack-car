/**
 * Author information
 */
export interface AuthorInfo {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isVerified?: boolean;
    reputation?: number;
    role?: string;
}

/**
 * File attachment
 */
export interface Attachment {
    id: string;
    url: string;
    type: AttachmentType;
    name?: string;
    size?: number;
    mimeType?: string;
    thumbnailUrl?: string;
}

export type AttachmentType = 'image' | 'video' | 'audio' | 'document' | 'file';

/**
 * Engagement metrics
 */
export interface EngagementMetrics {
    views: number;
    likes: number;
    comments: number;
    shares?: number;
    bookmarks?: number;
    rating?: number;
    ratingCount?: number;
}

/**
 * User interaction state
 */
export interface UserInteractionState {
    isLiked: boolean;
    isBookmarked: boolean;
    isFollowing?: boolean;
    isFlagged?: boolean;
    rating?: number;
}

/**
 * Address/Location information
 */
export interface LocationInfo {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
}

/**
 * Time range
 */
export interface TimeRange {
    start: Date | string;
    end: Date | string;
}

/**
 * Price range
 */
export interface PriceRange {
    min: number;
    max: number;
    currency?: string;
}

/**
 * Sort configuration
 */
export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

/**
 * Filter value
 */
export type FilterValue = string | number | boolean | Date | string[] | number[] | PriceRange | TimeRange;

/**
 * Generic filter
 */
export interface Filter {
    field: string;
    operator: FilterOperator;
    value: FilterValue;
}

export type FilterOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'greaterThan'
    | 'lessThan'
    | 'greaterThanOrEqual'
    | 'lessThanOrEqual'
    | 'in'
    | 'notIn'
    | 'between';

/**
 * Action button configuration
 */
export interface ActionButton {
    label: string;
    icon?: string;
    action: string | (() => void);
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

/**
 * Badge configuration
 */
export interface Badge {
    label: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
    icon?: string;
}

/**
 * Notification/Alert
 */
export interface Alert {
    id?: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
    dismissible?: boolean;
}

/**
 * Error information
 */
export interface ErrorInfo {
    code?: string;
    message: string;
    details?: any;
    timestamp?: Date | string;
}

/**
 * Comment with threading/reply support
 */
export interface ThreadedComment {
    id: number | string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    parentCommentId?: number | string;
    replies?: ThreadedComment[];
    likeCount: number;
    isLiked?: boolean;
    depth?: number;
}
