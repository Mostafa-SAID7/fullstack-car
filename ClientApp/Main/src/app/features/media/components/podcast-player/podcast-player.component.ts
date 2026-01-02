import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { PodcastDetails } from '../../models/media.model';

@Component({
  selector: 'app-podcast-player',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './podcast-player.component.html',
  styleUrls: ['./podcast-player.component.scss']
})
export class PodcastPlayerComponent implements OnInit {
  podcast: PodcastDetails | null = null;
  loading = true;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  showComments = false;
  newComment = '';
  
  private audioElement: HTMLAudioElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    const podcastId = this.route.snapshot.paramMap.get('id');
    if (podcastId) {
      this.loadPodcast(podcastId);
    }
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
  }

  private loadPodcast(id: string): void {
    this.loading = true;
    this.mediaService.getPodcast(id).subscribe({
      next: (podcast) => {
        this.podcast = podcast;
        this.initializeAudioPlayer();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading podcast:', error);
        this.loading = false;
        this.router.navigate(['/media/podcasts']);
      }
    });
  }

  private initializeAudioPlayer(): void {
    if (!this.podcast?.audioUrl) return;

    this.audioElement = new Audio(this.podcast.audioUrl);
    
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.duration = this.audioElement!.duration;
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime = this.audioElement!.currentTime;
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
    });

    this.audioElement.addEventListener('error', (error) => {
      console.error('Audio playback error:', error);
    });
  }

  togglePlayPause(): void {
    if (!this.audioElement) return;

    if (this.isPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  seek(event: Event): void {
    if (!this.audioElement) return;

    const target = event.target as HTMLInputElement;
    const seekTime = (parseFloat(target.value) / 100) * this.duration;
    this.audioElement.currentTime = seekTime;
  }

  setVolume(event: Event): void {
    if (!this.audioElement) return;

    const target = event.target as HTMLInputElement;
    this.volume = parseFloat(target.value) / 100;
    this.audioElement.volume = this.volume;
  }

  skipForward(): void {
    if (!this.audioElement) return;
    this.audioElement.currentTime = Math.min(this.audioElement.currentTime + 30, this.duration);
  }

  skipBackward(): void {
    if (!this.audioElement) return;
    this.audioElement.currentTime = Math.max(this.audioElement.currentTime - 30, 0);
  }

  likePodcast(): void {
    if (!this.podcast) return;

    this.mediaService.likePodcast(this.podcast.id).subscribe({
      next: () => {
        if (this.podcast) {
          this.podcast.isLiked = !this.podcast.isLiked;
          this.podcast.likesCount += this.podcast.isLiked ? 1 : -1;
        }
      },
      error: (error) => {
        console.error('Error liking podcast:', error);
      }
    });
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  addComment(): void {
    if (!this.podcast || !this.newComment.trim()) return;

    this.mediaService.addPodcastComment(this.podcast.id, this.newComment).subscribe({
      next: (comment) => {
        if (this.podcast) {
          this.podcast.comments.unshift(comment);
          this.podcast.commentsCount++;
        }
        this.newComment = '';
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      }
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  getProgressPercentage(): number {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  goBack(): void {
    this.router.navigate(['/media/podcasts']);
  }
}