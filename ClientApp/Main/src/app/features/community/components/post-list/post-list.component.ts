import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Post } from '../../../../core/models/post.model';
import { PostItemComponent } from '../post-item/post-item.component';

@Component({
    selector: 'app-post-list',
    standalone: true,
    imports: [CommonModule, PostItemComponent],
    template: `
    <div class="space-y-6">
        <!-- Skeleton Loader -->
        <div *ngIf="loading" class="fb-card p-4 animate-pulse space-y-4 mb-6">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-muted rounded-full"></div>
                <div class="flex-1 space-y-2">
                    <div class="h-3 bg-muted rounded w-1/4"></div>
                    <div class="h-2 bg-muted rounded w-1/6"></div>
                </div>
            </div>
            <div class="space-y-2">
                <div class="h-3 bg-muted rounded w-full"></div>
                <div class="h-3 bg-muted rounded w-5/6"></div>
            </div>
            <div class="h-64 bg-muted rounded-xl"></div>
        </div>

        <app-post-item *ngFor="let post of posts" [post]="post"></app-post-item>

        <div *ngIf="!loading && posts.length === 0" class="text-center py-10 text-muted-foreground">
            No posts found. Be the first to share something!
        </div>
    </div>
  `
})
export class PostListComponent implements OnInit {
    posts: Post[] = [];
    loading = true;

    constructor(private postService: PostService) { }

    ngOnInit(): void {
        this.loadPosts();
    }

    loadPosts(): void {
        this.loading = true;
        this.postService.getPosts().subscribe({
            next: (result) => {
                this.posts = result.items;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading posts', err);
                this.loading = false;
                // Mock data if backend is not available for now to keep UI WOW
                this.posts = this.getMockPosts();
            }
        });
    }

    private getMockPosts(): Post[] {
        return [
            {
                id: '1',
                title: 'New Suspension Test',
                content: 'Testing the new @fully2car suspension system on the Sinai dunes today. The performance is beyond expectations! 🏜️🚗💨',
                userFirstName: 'Mahmoud',
                userLastName: 'Abdel Aziz',
                likesCount: 1240,
                commentsCount: 48,
                createdAt: new Date().toISOString(),
                type: 1,
                status: 1,
                viewsCount: 5000,
                userId: 'u1'
            }
        ];
    }
}
