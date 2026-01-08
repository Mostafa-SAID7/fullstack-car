import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VideoList, PodcastList } from '../../models';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './media-card.component.html',
  styleUrls: ['./media-card.component.scss']
})
export class MediaCardComponent {
  @Input() media!: VideoList | PodcastList;
  @Input() type!: 'video' | 'podcast';
  @Input() showActions = true;
  @Output() play = new EventEmitter<void>();
  @Output() like = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();

  get isVideo(): boolean {
    return this.type === 'video';
  }

  get isPodcast(): boolean {
    return this.type === 'podcast';
  }

  get thumbnail(): string {
    if (this.isVideo) {
      return (this.media as VideoList).thumbnail || '/assets/images/video-placeholder.jpg';
    } else {
      return (this.media as PodcastList).coverImage || '/assets/images/podcast-placeholder.jpg';
    }
  }

  get viewOrPlayCount(): number {
    if (this.isVideo) {
      return (this.media as VideoList).viewCount;
    } else {
      return (this.media as PodcastList).playCount;
    }
  }

  get episodeInfo(): string | null {
    if (this.isPodcast) {
      const podcast = this.media as PodcastList;
      return `Episode ${podcast.episodeNumber}`;
    }
    return null;
  }

  onPlay(): void {
    this.play.emit();
  }

  onLike(): void {
    this.like.emit();
  }

  onShare(): void {
    this.share.emit();
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

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    
    const now = new Date();
    const mediaDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - mediaDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  }
}