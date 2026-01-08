import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-podcast-subscription',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="podcast-subscription">
      <div class="subscription-header">
        <h2>My Subscriptions</h2>
        <p>Manage your podcast subscriptions and get notified of new episodes</p>
      </div>
      
      <div class="subscription-stats">
        <div class="stat-card">
          <h3>Total Subscriptions</h3>
          <span class="stat-number">{{ totalSubscriptions }}</span>
        </div>
        <div class="stat-card">
          <h3>New Episodes</h3>
          <span class="stat-number">{{ newEpisodes }}</span>
        </div>
        <div class="stat-card">
          <h3>Hours Listened</h3>
          <span class="stat-number">{{ hoursListened }}</span>
        </div>
      </div>
      
      <div class="subscription-actions">
        <button class="btn-primary" (click)="discoverPodcasts()">
          <i class="fas fa-search"></i>
          Discover New Podcasts
        </button>
        <button class="btn-secondary" (click)="importSubscriptions()">
          <i class="fas fa-upload"></i>
          Import Subscriptions
        </button>
      </div>
      
      <div class="new-episodes" *ngIf="newEpisodesList.length > 0">
        <h3>New Episodes</h3>
        <div class="episode-list">
          <div *ngFor="let episode of newEpisodesList" class="episode-item new">
            <img [src]="episode.podcastThumbnail" [alt]="episode.podcastTitle" class="episode-thumbnail">
            <div class="episode-info">
              <h4>{{ episode.title }}</h4>
              <p class="podcast-name">{{ episode.podcastTitle }}</p>
              <p class="episode-description">{{ episode.description }}</p>
              <div class="episode-meta">
                <span class="duration">{{ episode.duration }}</span>
                <span class="publish-date">{{ episode.publishedDate | date:'shortDate' }}</span>
                <span class="new-badge">NEW</span>
              </div>
            </div>
            <div class="episode-actions">
              <button class="btn-play" (click)="playEpisode(episode)">
                <i class="fas fa-play"></i>
              </button>
              <button class="btn-download" (click)="downloadEpisode(episode)">
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="subscribed-podcasts">
        <h3>My Podcasts</h3>
        <div class="podcast-grid">
          <div *ngFor="let podcast of subscribedPodcasts" class="subscription-card">
            <img [src]="podcast.thumbnail" [alt]="podcast.title" class="podcast-thumbnail">
            <div class="podcast-info">
              <h4>{{ podcast.title }}</h4>
              <p>{{ podcast.author }}</p>
              <div class="podcast-stats">
                <span class="episode-count">{{ podcast.episodeCount }} episodes</span>
                <span class="last-episode">Last: {{ podcast.lastEpisodeDate | date:'shortDate' }}</span>
              </div>
            </div>
            <div class="subscription-actions">
              <button class="btn-unsubscribe" (click)="unsubscribe(podcast)">
                <i class="fas fa-times"></i>
              </button>
              <button class="btn-settings" (click)="openSettings(podcast)">
                <i class="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="empty-state" *ngIf="subscribedPodcasts.length === 0">
        <i class="fas fa-podcast"></i>
        <h3>No Subscriptions Yet</h3>
        <p>Start discovering and subscribing to podcasts to see them here</p>
        <button class="btn-primary" (click)="discoverPodcasts()">
          Discover Podcasts
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./podcast-subscription.component.scss']
})
export class PodcastSubscriptionComponent implements OnInit {
  totalSubscriptions = 0;
  newEpisodes = 0;
  hoursListened = 0;
  newEpisodesList: any[] = [];
  subscribedPodcasts: any[] = [];

  ngOnInit() {
    this.loadSubscriptionData();
  }

  loadSubscriptionData() {
    // Load user's subscription data
    // This would typically call a service
  }

  discoverPodcasts() {
    // Navigate to podcast discovery/search
    console.log('Navigating to podcast discovery');
  }

  importSubscriptions() {
    // Open import dialog or navigate to import page
    console.log('Opening import subscriptions dialog');
  }

  playEpisode(episode: any) {
    // Play the selected episode
    console.log('Playing episode:', episode.title);
  }

  downloadEpisode(episode: any) {
    // Download episode for offline listening
    console.log('Downloading episode:', episode.title);
  }

  unsubscribe(podcast: any) {
    // Unsubscribe from podcast
    console.log('Unsubscribing from:', podcast.title);
  }

  openSettings(podcast: any) {
    // Open podcast-specific settings
    console.log('Opening settings for:', podcast.title);
  }
}