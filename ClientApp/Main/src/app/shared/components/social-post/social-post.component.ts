import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocialInteractionService, SocialPost, Comment } from '../../../core/services/social-interaction.service';
import { UserProfileService } from '../../../core/services/user-profile.service';

@Component({
  selector: 'app-social-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './social-post.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SocialPostComponent {
  @Input({ required: true }) post!: SocialPost;

  private socialService = inject(SocialInteractionService);
  private userService = inject(UserProfileService);

  protected showComments = signal(false);
  protected comments = signal<Comment[]>([]);
  protected newCommentText = '';
  protected currentUser = this.userService.currentProfile;

  ngOnInit() {
    this.loadComments();
  }

  private loadComments(): void {
    const postComments = this.socialService.getPostComments(this.post.id);
    this.comments.set(postComments);
  }

  protected toggleLike(): void {
    this.socialService.togglePostLike(this.post.id);
  }

  protected toggleComments(): void {
    this.showComments.update(show => !show);
    if (this.showComments()) {
      this.loadComments();
    }
  }

  protected sharePost(): void {
    // In a real app, this would open a share dialog
    this.socialService.sharePost(this.post.id, 'repost');
  }

  protected toggleBookmark(): void {
    this.socialService.toggleBookmark(this.post.id);
  }

  protected async addComment(): Promise<void> {
    if (!this.newCommentText.trim()) return;

    try {
      await this.socialService.addComment(this.post.id, this.newCommentText.trim());
      this.newCommentText = '';
      this.loadComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }

  protected toggleCommentLike(commentId: string): void {
    // Implementation for comment likes would go here
    console.log('Toggle comment like:', commentId);
  }

  protected togglePostMenu(): void {
    // Implementation for post menu would go here
    console.log('Toggle post menu');
  }

  protected getLikeButtonClass(): string {
    return this.post.userInteraction.isLiked
      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
      : 'text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700';
  }

  protected getBookmarkButtonClass(): string {
    return this.post.userInteraction.isBookmarked
      ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      : 'text-gray-500 hover:text-yellow-600 hover:bg-gray-100 dark:hover:bg-gray-700';
  }

  protected getMediaGridClass(): string {
    const count = this.post.mediaAttachments.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2';
    return 'grid-cols-2';
  }

  protected formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  }

  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}