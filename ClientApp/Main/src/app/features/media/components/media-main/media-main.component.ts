import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { VideoListComponent } from '../video/list/video-list.component';
import { VideoAnalyticsComponent } from '../video/analytics/video-analytics.component';
import { VideoCategoryComponent } from '../video/category/video-category.component';
import { PodcastListComponent } from '../podcast/list/podcast-list.component';
import { PodcastSubscriptionComponent } from '../podcast/subscription/podcast-subscription.component';
import { PodcastCategoryComponent } from '../podcast/category/podcast-category.component';
import { AuthService } from '../../../../core/services/auth.service';


export interface MediaTab {
  id: string;
  label: string;
  icon: string;
}

export type MediaTabId = 'explore' | 'videos' | 'podcasts' | 'video-analytics' | 'video-categories' | 'podcast-subscriptions' | 'podcast-categories';

@Component({
  selector: 'app-media-main',
  standalone: true,
  imports: [
    CommonModule,
    VideoListComponent,
    VideoAnalyticsComponent,
    VideoCategoryComponent,
    PodcastListComponent,
    PodcastSubscriptionComponent,
    PodcastCategoryComponent
  ],
  template: `
    <div class="media-main-view w-full max-w-[1600px] mx-auto animate-fade-in px-2 pb-6">
      
      <!-- Content Overlay Shell - Only for certain tabs -->
      <div *ngIf="activeTab === 'explore' || activeTab === 'video-analytics' || activeTab === 'video-categories' || activeTab === 'podcast-subscriptions' || activeTab === 'podcast-categories'" 
           class="bg-white dark:bg-[#111] rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden mb-6">
        <div class="tab-content py-10 px-6 lg:px-12">
          
          <!-- Tab Content Views -->
          <div class="view-container">
            <!-- Explore Feed Tab -->
            <div *ngIf="activeTab === 'explore'" class="tab-pane active space-y-12">
              

              <!-- Trending Videos Section -->
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-1.5 h-6 bg-primary rounded-full"></div>
                    <h3 class="text-xl font-black text-foreground uppercase tracking-tight">Trending Transmission</h3>
                  </div>
                  <button (click)="onTabChange('videos')" class="text-[10px] font-black uppercase text-primary tracking-widest hover:underline px-4 py-2 bg-primary/5 rounded-lg transition-all">View All Videos</button>
                </div>
                <app-video-list [compact]="true" [limit]="4"></app-video-list>
              </div>

              <!-- Podcast Highlights -->
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                    <h3 class="text-xl font-black text-foreground uppercase tracking-tight">Audio Studio Highlights</h3>
                  </div>
                  <button (click)="onTabChange('podcasts')" class="text-[10px] font-black uppercase text-purple-600 tracking-widest hover:underline px-4 py-2 bg-purple-500/5 rounded-lg transition-all">Listen to More</button>
                </div>
                <app-podcast-list [compact]="true" [limit]="4"></app-podcast-list>
              </div>

              <!-- Shorts Section (Placeholder) -->
              <div class="space-y-6 pb-12">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                    <h3 class="text-xl font-black text-foreground uppercase tracking-tight">Instant Clips</h3>
                  </div>
                  <span class="text-[9px] font-black uppercase text-orange-500/50 tracking-widest bg-orange-500/5 px-3 py-1.5 rounded-full border border-orange-500/10">Beta Feature</span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div *ngFor="let i of [1,2,3,4,5,6]" class="aspect-[9/16] bg-secondary/50 dark:bg-white/5 rounded-3xl animate-pulse flex items-end p-4 border border-black/5 dark:border-white/5 overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
                    <div class="w-full space-y-2">
                      <div class="h-3 w-3/4 bg-white/20 rounded"></div>
                      <div class="h-2 w-1/2 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
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
        </div>
      </div>

      <!-- Videos Tab (Outer) -->
      <div *ngIf="activeTab === 'videos'" class="tab-pane active">
        <app-video-list></app-video-list>
      </div>

      <!-- Podcasts Tab (Outer) -->
      <div *ngIf="activeTab === 'podcasts'" class="tab-pane active">
        <app-podcast-list></app-podcast-list>
      </div>

      <!-- Loading Overlay -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="loading-spinner">
          <i class="fas fa-spinner animate-spin text-4xl text-blue-500"></i>
          <p class="mt-4 text-gray-600 font-bold uppercase tracking-widest text-[10px]">Filtering Content...</p>
        </div>
      </div>
    </div>
  `
})
export class MediaMainComponent implements OnInit {
  activeTab: MediaTabId = 'explore';
  selectedCategoryId = '';
  selectedCategoryName = '';
  selectedCategoryDescription = '';
  isRefreshing = false;
  isLoading = false;

  tabs: MediaTab[] = [
    { id: 'explore', label: 'Explore', icon: 'fas fa-compass' },
    { id: 'videos', label: 'Videos', icon: 'fas fa-video' },
    { id: 'video-analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
    { id: 'video-categories', label: 'Video Categories', icon: 'fas fa-folder' },
    { id: 'podcasts', label: 'Podcasts', icon: 'fas fa-podcast' },
    { id: 'podcast-subscriptions', label: 'Subscriptions', icon: 'fas fa-heart' },
    { id: 'podcast-categories', label: 'Podcast Categories', icon: 'fas fa-tags' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) { }


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