import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-podcast-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="podcast-dashboard">
      <div class="dashboard-header">
        <h2>Podcast Dashboard</h2>
        <p>Manage your podcasts and analytics</p>
      </div>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Total Podcasts</h3>
          <span class="stat-number">{{ totalPodcasts }}</span>
        </div>
        <div class="stat-card">
          <h3>Total Listens</h3>
          <span class="stat-number">{{ totalListens }}</span>
        </div>
        <div class="stat-card">
          <h3>Subscribers</h3>
          <span class="stat-number">{{ totalSubscribers }}</span>
        </div>
        <div class="stat-card">
          <h3>This Month</h3>
          <span class="stat-number">{{ monthlyListens }}</span>
        </div>
      </div>

      <div class="dashboard-actions">
        <button class="btn-primary" (click)="uploadPodcast()">Upload New Podcast</button>
        <button class="btn-secondary" (click)="viewAnalytics()">View Analytics</button>
      </div>

      <div class="recent-podcasts">
        <h3>Recent Podcasts</h3>
        <div class="podcast-grid">
          <div *ngFor="let podcast of recentPodcasts" class="podcast-card">
            <img [src]="podcast.thumbnail" [alt]="podcast.title" class="podcast-thumbnail">
            <div class="podcast-info">
              <h4>{{ podcast.title }}</h4>
              <p>{{ podcast.description }}</p>
              <span class="podcast-date">{{ podcast.publishedDate | date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./podcast-dashboard.component.scss']
})
export class PodcastDashboardComponent implements OnInit {
  totalPodcasts = 0;
  totalListens = 0;
  totalSubscribers = 0;
  monthlyListens = 0;
  recentPodcasts: any[] = [];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load dashboard statistics and recent podcasts
    // This would typically call a service
  }

  uploadPodcast() {
    // Navigate to upload component
  }

  viewAnalytics() {
    // Navigate to analytics view
  }
}