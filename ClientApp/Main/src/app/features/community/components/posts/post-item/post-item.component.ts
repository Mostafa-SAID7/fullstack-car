import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Post } from '../../../../../core/models/post.model';
import { PostService } from '../../../services/post.service';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
    selector: 'app-post-item',
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule],
    templateUrl: './post-item.component.html',
    host: { 'class': 'block' }
})
export class PostItemComponent implements OnInit, OnDestroy {
    @Input() post!: Post;

    isLiked = false;
    showComments = false;
    commentContent = '';
    isSubmittingComment = false;
    
    private destroy$ = new Subject<void>();

    constructor(
        private postService: PostService,
        private translationService: TranslationService
    ) { }

    ngOnInit(): void {
        this.initializeTranslations();
        // In a real app, we'd check if the current user has liked this post
        // For now, we'll initialize based on backend data if available
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private async initializeTranslations(): Promise<void> {
        try {
            // Ensure posts translations are loaded
            const currentLanguage = this.translationService.getCurrentLanguage().code;
            await this.translationService.loadSingleFeatureTranslations(currentLanguage, 'posts');
        } catch (error) {
            console.error('Failed to load posts translations:', error);
        }
    }

    toggleLike(): void {
        if (this.isLiked) {
            this.postService.unlikePost(this.post.id).subscribe(result => {
                if (result.succeeded) {
                    this.isLiked = false;
                    this.post.likesCount--;
                }
            });
        } else {
            this.postService.likePost(this.post.id).subscribe(result => {
                if (result.succeeded) {
                    this.isLiked = true;
                    this.post.likesCount++;
                }
            });
        }
    }

    toggleComments(): void {
        this.showComments = !this.showComments;
    }

    submitComment(): void {
        if (this.commentContent.trim() && !this.isSubmittingComment) {
            this.isSubmittingComment = true;
            this.postService.addComment(this.post.id, this.commentContent).subscribe({
                next: (result) => {
                    if (result.succeeded) {
                        this.post.commentsCount++;
                        this.commentContent = '';
                    }
                    this.isSubmittingComment = false;
                },
                error: () => {
                    this.isSubmittingComment = false;
                }
            });
        }
    }
}
