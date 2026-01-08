import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-podcast-category',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="podcast-category">
      <div class="category-header">
        <h2>{{ categoryName }}</h2>
        <p>{{ categoryDescription }}</p>
      </div>
      
      <div class="category-stats">
        <div class="stat">
          <span class="stat-number">{{ podcastCount }}</span>
          <span class="stat-label">Podcasts</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ subscriberCount }}</span>
          <span class="stat-label">Subscribers</span>
        </div>
      </div>
      
      <div class="featured-podcasts" *ngIf="featuredPodcasts.length > 0">
        <h3>Featured Podcasts</h3>
        <div class="podcast-grid">
          <div *ngFor="let podcast of featuredPodcasts" class="podcast-card featured">
            <img [src]="podcast.thumbnail" [alt]="podcast.title" class="podcast-thumbnail">
            <div class="podcast-info">
              <h4>{{ podcast.title }}</h4>
              <p>{{ podcast.description }}</p>
              <div class="podcast-meta">
                <span class="duration">{{ podcast.duration }}</span>
                <span class="listens">{{ podcast.listens }} listens</span>
              </div>
            </div>
            <button class="play-btn" (click)="playPodcast(podcast)">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="recent-podcasts">
        <h3>Recent in {{ categoryName }}</h3>
        <div class="podcast-list">
          <div *ngFor="let podcast of recentPodcasts" class="podcast-item">
            <img [src]="podcast.thumbnail" [alt]="podcast.title" class="podcast-thumbnail-small">
            <div class="podcast-details">
              <h5>{{ podcast.title }}</h5>
              <p>{{ podcast.author }}</p>
              <span class="publish-date">{{ podcast.publishedDate | date:'shortDate' }}</span>
            </div>
            <div class="podcast-actions">
              <button class="btn-play" (click)="playPodcast(podcast)">
                <i class="fas fa-play"></i>
              </button>
              <button class="btn-subscribe" (click)="subscribeToPodcast(podcast)">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="load-more" *ngIf="hasMorePodcasts">
        <button class="btn-load-more" (click)="loadMorePodcasts()">
          Load More Podcasts
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./podcast-category.component.scss']
})
export class PodcastCategoryComponent implements OnInit {
  @Input() categoryId: string = '';
  @Input() categoryName: string = '';
  @Input() categoryDescription: string = '';
  
  podcastCount = 0;
  subscriberCount = 0;
  featuredPodcasts: any[] = [];
  recentPodcasts: any[] = [];
  hasMorePodcasts = false;

  ngOnInit() {
    this.loadCategoryData();
  }

  loadCategoryData() {
    // Load category-specific data
    // This would typically call a service
  }

  playPodcast(podcast: any) {
    // Implement play functionality
    console.log('Playing podcast:', podcast.title);
  }

  subscribeToPodcast(podcast: any) {
    // Implement subscribe functionality
    console.log('Subscribing to podcast:', podcast.title);
  }

  loadMorePodcasts() {
    // Load more podcasts in this category
    console.log('Loading more podcasts for category:', this.categoryName);
  }
}