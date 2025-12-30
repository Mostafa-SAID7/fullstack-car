import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../../../core/models/post.model';
import { PostItemComponent } from '../post-item/post-item.component';

@Component({
    selector: 'app-post-list',
    standalone: true,
    imports: [CommonModule, PostItemComponent, TranslateModule],
    templateUrl: './post-list.component.html',
    host: { 'class': 'block' }
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
