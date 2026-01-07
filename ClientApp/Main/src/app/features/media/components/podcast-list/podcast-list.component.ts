import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { PodcastList } from '../../models/media.model';

@Component({
  selector: 'app-podcast-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit {
  podcasts: PodcastList[] = [];
  loading = false;

  constructor(
    private mediaService: MediaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPodcasts();
  }

  private loadPodcasts(): void {
    this.loading = true;
    this.mediaService.getPodcasts().subscribe({
      next: (response) => {
        this.podcasts = response.items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading podcasts:', error);
        this.loading = false;
      }
    });
  }

  playPodcast(podcast: PodcastList): void {
    this.router.navigate(['/app/media/podcasts', podcast.id]);
  }

  navigateToUpload(): void {
    this.router.navigate(['/app/media/podcasts/upload']);
  }
}