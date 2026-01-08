import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { VideoList, PodcastList } from '../../models';

import { MediaCardComponent } from '../media-card/media-card.component';

@Component({
  selector: 'app-media-dashboard',
  standalone: true,
  imports: [CommonModule, MediaCardComponent],
  templateUrl: './media-dashboard.component.html',
  styleUrls: ['./media-dashboard.component.scss']
})
export class MediaDashboardComponent implements OnInit {
  trendingVideos: VideoList[] = [];
  trendingPodcasts: PodcastList[] = [];
  recentVideos: VideoList[] = [];
  recentPodcasts: PodcastList[] = [];
  loading = true;

  constructor(
    private mediaService: MediaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Load trending videos
    this.mediaService.getTrendingVideos(6).subscribe({
      next: (videos) => {
        this.trendingVideos = videos;
      },
      error: (error) => {
        console.error('Error loading trending videos:', error);
      }
    });

    // Load trending podcasts
    this.mediaService.getTrendingPodcasts(6).subscribe({
      next: (podcasts) => {
        this.trendingPodcasts = podcasts;
      },
      error: (error) => {
        console.error('Error loading trending podcasts:', error);
      }
    });

    // Load recent videos
    this.mediaService.getVideos({ pageNumber: 1, pageSize: 6, sortBy: 'CreatedAt', sortDescending: true }).subscribe({
      next: (response) => {
        this.recentVideos = response.items;
      },
      error: (error) => {
        console.error('Error loading recent videos:', error);
      }
    });

    // Load recent podcasts
    this.mediaService.getPodcasts({ pageNumber: 1, pageSize: 6, sortBy: 'CreatedAt', sortDescending: true }).subscribe({
      next: (response) => {
        this.recentPodcasts = response.items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recent podcasts:', error);
        this.loading = false;
      }
    });
  }

  navigateToVideos(): void {
    this.router.navigate(['/media/videos']);
  }

  navigateToPodcasts(): void {
    this.router.navigate(['/media/podcasts']);
  }

  navigateToUpload(type: 'video' | 'podcast'): void {
    this.router.navigate([`/media/${type}s/upload`]);
  }

  playVideo(video: VideoList): void {
    this.router.navigate(['/media/videos', video.id]);
  }

  playPodcast(podcast: PodcastList): void {
    this.router.navigate(['/media/podcasts', podcast.id]);
  }

  formatDuration(duration: string): string {
    // Convert TimeSpan string to readable format
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
}