import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { VideoDetails } from '../../models/media.model';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  video: VideoDetails | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    const videoId = this.route.snapshot.paramMap.get('id');
    if (videoId) {
      this.loadVideo(videoId);
    } else {
      this.router.navigate(['/media/videos']);
    }
  }

  private loadVideo(id: string): void {
    this.loading = true;
    this.error = null;

    this.mediaService.getVideo(id).subscribe({
      next: (video) => {
        this.video = video;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading video:', error);
        this.error = 'Failed to load video';
        this.loading = false;
      }
    });
  }

  onLike(): void {
    if (this.video) {
      this.mediaService.likeVideo(this.video.id, !this.video.isLikedByUser).subscribe({
        next: () => {
          if (this.video) {
            this.video.isLikedByUser = !this.video.isLikedByUser;
            this.video.likeCount += this.video.isLikedByUser ? 1 : -1;
          }
        },
        error: (error) => {
          console.error('Error liking video:', error);
        }
      });
    }
  }

  onAddComment(content: string): void {
    if (this.video && content.trim()) {
      this.mediaService.addVideoComment(this.video.id, content).subscribe({
        next: (comment) => {
          if (this.video) {
            this.video.comments.unshift(comment);
          }
        },
        error: (error) => {
          console.error('Error adding comment:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/media/videos']);
  }
}