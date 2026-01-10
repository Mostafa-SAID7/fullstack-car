import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VideoService } from '../../../services/video.service';
import { VideoDetails } from '../../../models';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-video-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './video-detail.component.html'
})
export class VideoDetailComponent implements OnInit, OnDestroy {
    video: VideoDetails | null = null;
    loading = true;
    error: string | null = null;
    newComment = '';
    submittingComment = false;
    private routeSub: Subscription | null = null;

    constructor(
        private route: ActivatedRoute,
        private videoService: VideoService
    ) { }

    ngOnInit(): void {
        this.routeSub = this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.loadVideo(id);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }

    loadVideo(id: string): void {
        this.loading = true;
        this.videoService.getVideo(id).subscribe({
            next: (video) => {
                this.video = video;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading video:', err);
                this.error = 'Failed to load video details.';
                this.loading = false;
            }
        });
    }

    likeVideo(): void {
        if (!this.video) return;
        const isLike = !this.video.isLikedByUser;
        this.videoService.likeVideo(this.video.id).subscribe({
            next: () => {
                if (this.video) {
                    this.video.isLikedByUser = isLike;
                    this.video.likeCount += isLike ? 1 : -1;
                }
            },
            error: (err) => console.error('Error liking video:', err)
        });
    }

    addComment(): void {
        if (!this.video || !this.newComment.trim()) return;
        this.submittingComment = true;
        this.videoService.addComment(this.video.id, this.newComment).subscribe({
            next: (comment) => {
                if (this.video) {
                    this.video.comments = [comment, ...this.video.comments];
                    this.video.commentsCount++;
                }
                this.newComment = '';
                this.submittingComment = false;
            },
            error: (err) => {
                console.error('Error adding comment:', err);
                this.submittingComment = false;
            }
        });
    }

    formatDuration(duration: string): string {
        const parts = duration.split(':');
        if (parts.length >= 3) {
            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const seconds = parseInt(parts[2]);
            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
        return duration;
    }
}
