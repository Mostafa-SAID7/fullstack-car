import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { PodcastDetails, PodcastComment } from '../../models/media.model';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-podcast-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './podcast-detail.component.html',
    styleUrls: ['./podcast-detail.component.scss']
})
export class PodcastDetailComponent implements OnInit, OnDestroy {
    podcast: PodcastDetails | null = null;
    loading = true;
    error: string | null = null;
    newComment = '';
    submittingComment = false;
    private routeSub: Subscription | null = null;

    constructor(
        private route: ActivatedRoute,
        private mediaService: MediaService
    ) { }

    ngOnInit(): void {
        this.routeSub = this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.loadPodcast(id);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }

    loadPodcast(id: string): void {
        this.loading = true;
        this.mediaService.getPodcast(id).subscribe({
            next: (podcast) => {
                this.podcast = podcast;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading podcast:', err);
                this.error = 'Failed to load podcast details.';
                this.loading = false;
            }
        });
    }

    likePodcast(): void {
        if (!this.podcast) return;
        this.mediaService.likePodcast(this.podcast.id).subscribe({
            next: () => {
                if (this.podcast) {
                    this.podcast.isLikedByUser = !this.podcast.isLikedByUser;
                    this.podcast.likesCount += this.podcast.isLikedByUser ? 1 : -1;
                }
            },
            error: (err) => console.error('Error liking podcast:', err)
        });
    }

    addComment(): void {
        if (!this.podcast || !this.newComment.trim()) return;
        this.submittingComment = true;
        this.mediaService.addPodcastComment(this.podcast.id, this.newComment).subscribe({
            next: (comment) => {
                if (this.podcast) {
                    this.podcast.comments = [comment, ...this.podcast.comments];
                    this.podcast.commentsCount++;
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
                return `${hours}h ${minutes}m`;
            } else {
                return `${minutes}m ${seconds}s`;
            }
        }
        return duration;
    }
}
