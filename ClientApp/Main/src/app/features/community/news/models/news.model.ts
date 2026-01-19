export interface Article {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    featuredImageUrl?: string;
    status: ArticleStatus;
    priority: ArticlePriority;
    publishedAt?: Date;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    tags?: string;
    isFeatured: boolean;
    authorId: string;
    categoryId: string;
    author?: any;
    category?: any;
    createdAt: Date;
}

export enum ArticleStatus {
    Draft = 0,
    Published = 1,
    Archived = 2,
    Scheduled = 3,
    Trash = 4
}

export enum ArticlePriority {
    Low = 0,
    Normal = 1,
    High = 2,
    Breaking = 3
}

export interface NewsComment {
    id: string;
    content: string;
    articleId: string;
    userId: string;
    user?: any;
    createdAt: Date;
}
