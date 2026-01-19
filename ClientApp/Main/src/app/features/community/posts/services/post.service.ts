import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { PostApiService } from '../../../shared/services/api/post-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { Post, CreatePostRequest } from '../../../core/models/post.model';
import { PostDto } from '../../../shared/models/community/post.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private postsSubject = new BehaviorSubject<Post[]>([]);
    public posts$ = this.postsSubject.asObservable();

    constructor(
        private postApi: PostApiService,
        private toastService: ToastService,
        private loadingService: LoadingService
    ) { }

    getPosts(pageNumber: number = 1, pageSize: number = 10, groupId?: string): Observable<PaginatedResult<Post>> {
        this.loadingService.show('posts-list', 'Loading posts...');

        return this.postApi.getPosts({ pageNumber, pageSize, groupId }).pipe(
            map((result: any) => this.mapToLegacyFormat(result) as PaginatedResult<Post>),
            tap(result => {
                if (result.items) {
                    this.postsSubject.next(result.items);
                }
            }),
            catchError(error => {
                this.toastService.error('Failed to load posts', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('posts-list'))
        );
    }

    getPost(id: string): Observable<Result<Post>> {
        return this.postApi.getPost(id).pipe(
            map(dto => ({ succeeded: true, data: this.mapDtoToPost(dto) } as Result<Post>)),
            catchError(error => {
                this.toastService.error('Failed to load post', error.message);
                return throwError(() => error);
            })
        );
    }

    createPost(request: CreatePostRequest): Observable<Result<Post>> {
        this.loadingService.show('create-post', 'Creating post...');

        return this.postApi.createPost(request).pipe(
            map(dto => {
                const post = this.mapDtoToPost(dto);
                // Add new post to the beginning of the list
                const currentPosts = this.postsSubject.value;
                this.postsSubject.next([post, ...currentPosts]);
                this.toastService.success('Post created successfully');
                return { succeeded: true, data: post } as Result<Post>;
            }),
            catchError(error => {
                this.toastService.error('Failed to create post', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('create-post'))
        );
    }

    likePost(id: string): Observable<Result<any>> {
        return this.postApi.likePost(id).pipe(
            tap(() => {
                // Update post in the list
                const posts = this.postsSubject.value.map(post =>
                    post.id === id ? { ...post, likesCount: post.likesCount + 1 } : post
                );
                this.postsSubject.next(posts);
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to like post', error.message);
                return throwError(() => error);
            })
        );
    }

    unlikePost(id: string): Observable<Result<any>> {
        return this.postApi.unlikePost(id).pipe(
            tap(() => {
                // Update post in the list
                const posts = this.postsSubject.value.map(post =>
                    post.id === id ? { ...post, likesCount: Math.max(0, post.likesCount - 1) } : post
                );
                this.postsSubject.next(posts);
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to unlike post', error.message);
                return throwError(() => error);
            })
        );
    }

    addComment(id: string, content: string): Observable<Result<any>> {
        return this.postApi.addComment(id, content).pipe(
            tap(() => {
                // Update post in the list
                const posts = this.postsSubject.value.map(post =>
                    post.id === id ? { ...post, commentsCount: post.commentsCount + 1 } : post
                );
                this.postsSubject.next(posts);
                this.toastService.success('Comment added successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to add comment', error.message);
                return throwError(() => error);
            })
        );
    }

    deletePost(id: string): Observable<Result<any>> {
        this.loadingService.show('delete-post', 'Deleting post...');

        return this.postApi.deletePost(id).pipe(
            tap(() => {
                // Remove post from the list
                const posts = this.postsSubject.value.filter(post => post.id !== id);
                this.postsSubject.next(posts);
                this.toastService.success('Post deleted successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to delete post', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('delete-post'))
        );
    }

    updatePost(id: string, request: any): Observable<Result<Post>> {
        this.loadingService.show('update-post', 'Updating post...');

        return this.postApi.updatePost(id, request).pipe(
            map(dto => {
                const post = this.mapDtoToPost(dto);
                // Update post in the list
                const posts = this.postsSubject.value.map(p =>
                    p.id === id ? post : p
                );
                this.postsSubject.next(posts);
                this.toastService.success('Post updated successfully');
                return { succeeded: true, data: post } as Result<Post>;
            }),
            catchError(error => {
                this.toastService.error('Failed to update post', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('update-post'))
        );
    }

    reportPost(id: string, reason: string, description?: string): Observable<Result<any>> {
        // Note: Report functionality would need to be added to PostApiService if backend supports it
        this.toastService.info('Report functionality coming soon');
        return new Observable(observer => {
            observer.next({ succeeded: true } as Result<any>);
            observer.complete();
        });
    }

    getPostComments(id: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<any>> {
        return this.postApi.getComments(id, pageNumber).pipe(
            map(result => this.mapToLegacyFormat(result)),
            catchError(error => {
                this.toastService.error('Failed to load comments', error.message);
                return throwError(() => error);
            })
        );
    }

    // Helper methods to map between DTOs and legacy models
    private mapDtoToPost(dto: PostDto): Post {
        return {
            id: dto.id,
            title: dto.title,
            content: dto.content,
            imageUrl: dto.imageUrl,
            type: dto.type,
            status: dto.status,
            viewsCount: dto.viewsCount,
            likesCount: dto.likesCount,
            commentsCount: dto.commentsCount,
            createdAt: typeof dto.createdAt === 'string' ? dto.createdAt : dto.createdAt.toISOString(),
            updatedAt: dto.updatedAt ? (typeof dto.updatedAt === 'string' ? dto.updatedAt : dto.updatedAt.toISOString()) : undefined,
            userId: dto.userId,
            userFirstName: dto.userFirstName,
            userLastName: dto.userLastName,
            userProfileImageUrl: dto.userProfileImageUrl,
            groupId: dto.groupId,
            groupName: dto.groupName
        };
    }

    private mapToLegacyFormat<T>(result: any): PaginatedResult<T> {
        return {
            items: (result.items as any[])?.map((item: any) => this.mapDtoToPost(item)) as T[] || [],
            pageNumber: result.pageNumber,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
            totalCount: result.totalCount,
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        };
    }
}
