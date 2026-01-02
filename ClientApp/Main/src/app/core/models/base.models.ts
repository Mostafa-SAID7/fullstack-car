/**
 * Base entity interface with common properties
 */
export interface BaseEntity<TId = number | string> {
    id: TId;
    createdAt: Date | string;
    updatedAt?: Date | string;
}

/**
 * Hierarchical entity for parent-child relationships
 */
export interface HierarchicalEntity<TParent, TChild> extends BaseEntity {
    parentId?: number | string;
    parent?: TParent;
    children?: TChild[];
}

/**
 * Tree node structure for nested hierarchies
 */
export interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    parent?: TreeNode<T>;
    depth: number;
    isExpanded?: boolean;
}

/**
 * Entity with engagement metrics
 */
export interface WithMetadata {
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    shareCount?: number;
    bookmarkCount?: number;
}

/**
 * Entity created by a user
 */
export interface WithAuthor {
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    authorIsVerified?: boolean;
}

/**
 * Entity that can be liked/bookmarked by current user
 */
export interface WithUserInteraction {
    isLiked?: boolean;
    isBookmarked?: boolean;
    isFlagged?: boolean;
}

/**
 * Entity with tags/categories
 */
export interface WithTags {
    tags: string[];
}

/**
 * Entity with rich content
 */
export interface WithContent {
    title: string;
    content: string;
    summary?: string;
}

/**
 * Entity with media attachments
 */
export interface WithMedia {
    thumbnailUrl?: string;
    imageUrls?: string[];
    videoUrls?: string[];
}

/**
 * Publishable entity
 */
export interface Publishable {
    isPublished: boolean;
    publishedAt?: Date | string;
    isFeatured?: boolean;
}

/**
 * Soft-deletable entity
 */
export interface SoftDeletable {
    isDeleted: boolean;
    deletedAt?: Date | string;
    deletedBy?: string;
}

/**
 * Entity with moderation status
 */
export interface Moderatable {
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    moderatedAt?: Date | string;
    moderatedBy?: string;
    moderationNotes?: string;
}

/**
 * Combine multiple interfaces into a rich entity
 */
export type RichEntity<T = {}> = BaseEntity &
    WithContent &
    WithAuthor &
    WithMetadata &
    WithUserInteraction &
    Publishable &
    T;

/**
 * Comment-like entity with threading support
 */
export interface ThreadedComment extends BaseEntity, WithAuthor {
    content: string;
    parentCommentId?: number;
    replies?: ThreadedComment[];
    likeCount: number;
    isLiked?: boolean;
    depth?: number;
}
