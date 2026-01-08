import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MediaDashboardComponent } from '../media-dashboard/media-dashboard.component';
import { VideoListComponent } from '../video/list/video-list.component';
import { VideoDashboardComponent } from '../video/dashboard/video-dashboard.component';
import { VideoSearchComponent } from '../video/search/video-search.component';
import { VideoAnalyticsComponent } from '../video/analytics/video-analytics.component';
import { VideoCategoryComponent } from '../video/category/video-category.component';
import { PodcastListComponent } from '../podcast/list/podcast-list.component';
import { PodcastDashboardComponent } from '../podcast/dashboard/podcast-dashboard.component';
import { PodcastSearchComponent } from '../podcast/search/podcast-search.component';
import { PodcastSubscriptionComponent } from '../podcast/subscription/podcast-subscription.component';
import { PodcastCategoryComponent } from '../podcast/category/podcast-category.component';
import { MediaTabNavComponent, MediaTab } from '../shared/media-tab-nav/media-tab-nav.component';

export type MediaTabId = 'dashboard' | 'videos' | 'video-dashboard' | 'video-search' | 'video-analytics' | 'video-categories' | 'podcasts' | 'podcast-dashboard' | 'podcast-search' | 'podcast-subscriptions' | 'podcast-categories';

@Component({
  selector: 'app-media-main',
  standalone: true,
  imports: [
    CommonModule,
    MediaTabNavComponent,
    MediaDashboardComponent,
    VideoListComponent,
    VideoDashboardComponent,
    VideoSearchComponent,
    VideoAnalyticsComponent,
    VideoCategoryComponent,
    PodcastListComponent,
    PodcastDashboardComponent,
    PodcastSearchComponent,
    PodcastSubscriptionComponent,
    PodcastCategoryComponent
  ],
  template: `
    <div class="media-main">
      <!-- Tab Navigation -->
      <app-media-tab-nav
        [tabs]="tabs"
        [activeTab]="activeTab"
        [showActions]="true"
        (tabChange)="onTabChange($event)"
      >
        <!-- Tab Actions -->
        <div slot="actions" class="flex items-center gap-3">
          <button 
            *ngIf="activeTab === 'videos' || activeTab.includes('video')"
            class="action-btn primary"
            (click)="navigateToUpload()"
          >
            <i class="fas fa-video"></i>
            <span class="hidden sm:inline">Upload Video</span>
          </button>
          
          <button 
            *ngIf="activeTab.includes('podcast')"
            class="action-btn primary podcast"
            (click)="navigateToPodcastUpload()"
          >
            <i class="fas fa-microphone"></i>
            <span class="hidden sm:inline">Create Podcast</span>
          </button>
          
          <button 
            class="action-btn secondary"
            (click)="refreshContent()"
            [disabled]="isRefreshing"
          >
            <i class="fas fa-refresh" [class.animate-spin]="isRefreshing"></i>
            <span class="hidden md:inline">Refresh</span>
          </button>
        </div>
      </app-media-tab-nav>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Dashboard Tab -->
        <div *ngIf="activeTab === 'dashboard'" class="tab-pane active">
          <app-media-dashboard></app-media-dashboard>
        </div>

        <!-- Videos Tab -->
        <div *ngIf="activeTab === 'videos'" class="tab-pane active">
          <app-video-list></app-video-list>
        </div>

        <!-- Video Dashboard Tab -->
        <div *ngIf="activeTab === 'video-dashboard'" class="tab-pane active">
          <app-video-dashboard></app-video-dashboard>
        </div>

        <!-- Video Search Tab -->
        <div *ngIf="activeTab === 'video-search'" class="tab-pane active">
          <app-video-search (videoSelected)="onVideoSelected($event)"></app-video-search>
        </div>

        <!-- Video Analytics Tab -->
        <div *ngIf="activeTab === 'video-analytics'" class="tab-pane active">
          <app-video-analytics></app-video-analytics>
        </div>

        <!-- Video Categories Tab -->
        <div *ngIf="activeTab === 'video-categories'" class="tab-pane active">
          <app-video-category 
            [categoryId]="selectedCategoryId"
            [categoryName]="selectedCategoryName"
            [categoryDescription]="selectedCategoryDescription">
          </app-video-category>
        </div>

        <!-- Podcasts Tab -->
        <div *ngIf="activeTab === 'podcasts'" class="tab-pane active">
          <app-podcast-list></app-podcast-list>
        </div>

        <!-- Podcast Dashboard Tab -->
        <div *ngIf="activeTab === 'podcast-dashboard'" class="tab-pane active">
          <app-podcast-dashboard></app-podcast-dashboard>
        </div>

        <!-- Podcast Search Tab -->
        <div *ngIf="activeTab === 'podcast-search'" class="tab-pane active">
          <app-podcast-search (podcastSelected)="onPodcastSelected($event)"></app-podcast-search>
        </div>

        <!-- Podcast Subscriptions Tab -->
        <div *ngIf="activeTab === 'podcast-subscriptions'" class="tab-pane active">
          <app-podcast-subscription></app-podcast-subscription>
        </div>

        <!-- Podcast Categories Tab -->
        <div *ngIf="activeTab === 'podcast-categories'" class="tab-pane active">
          <app-podcast-category 
            [categoryId]="selectedCategoryId"
            [categoryName]="selectedCategoryName"
            [categoryDescription]="selectedCategoryDescription">
          </app-podcast-category>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="loading-spinner">
          <i class="fas fa-spinner animate-spin text-4xl text-blue-500"></i>
          <p class="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./media-main.component.scss']
})
export class MediaMainComponent implements OnInit {
  activeTab: MediaTabId = 'dashboard';
  selectedCategoryId = '';
  selectedCategoryName = '';
  selectedCategoryDescription = '';
  isRefreshing = false;
  isLoading = false;

  tabs: MediaTab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
    { id: 'videos', label: 'Videos', icon: 'fas fa-video' },
    { id: 'video-dashboard', label: 'Video Studio', icon: 'fas fa-film' },
    { id: 'video-search', label: 'Discover Videos', icon: 'fas fa-search' },
    { id: 'video-analytics', label: 'Video Analytics', icon: 'fas fa-chart-line' },
    { id: 'video-categories', label: 'Video Categories', icon: 'fas fa-folder' },
    { id: 'podcasts', label: 'Podcasts', icon: 'fas fa-podcast' },
    { id: 'podcast-dashboard', label: 'Podcast Studio', icon: 'fas fa-microphone-alt' },
    { id: 'podcast-search', label: 'Discover Podcasts', icon: 'fas fa-headphones' },
    { id: 'podcast-subscriptions', label: 'Subscriptions', icon: 'fas fa-heart' },
    { id: 'podcast-categories', label: 'Podcast Categories', icon: 'fas fa-tags' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check for initial tab from route params or query params
    this.route.queryParams.subscribe(params => {
      if (params['tab'] && this.isValidTab(params['tab'])) {
        this.activeTab = params['tab'];
      }
    });

    // Check for category selection
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        this.selectedCategoryId = params['categoryId'];
        this.selectedCategoryName = params['categoryName'] || '';
        this.selectedCategoryDescription = params['categoryDescription'] || '';
        this.activeTab = 'podcast-categories';
      }
    });
  }

  onTabChange(tabId: string) {
    this.activeTab = tabId as MediaTabId;
    
    // Update URL with tab parameter
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge'
    });
  }

  navigateToUpload() {
    this.router.navigate(['/media/videos/upload']);
  }

  navigateToPodcastUpload() {
    this.router.navigate(['/media/podcasts/upload']);
  }

  async refreshContent() {
    this.isRefreshing = true;
    
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Emit refresh event or reload current tab content
      // In a real app, you would call the appropriate service methods
      console.log('Refreshing content for tab:', this.activeTab);
      
    } catch (error) {
      console.error('Error refreshing content:', error);
    } finally {
      this.isRefreshing = false;
    }
  }

  onVideoSelected(video: any) {
    // Navigate to video detail
    this.router.navigate(['/media/videos', video.id]);
  }

  onPodcastSelected(podcast: any) {
    // Navigate to podcast detail
    this.router.navigate(['/media/podcasts', podcast.id]);
  }

  private isValidTab(tab: string): boolean {
    return this.tabs.some(t => t.id === tab);
  }
}