import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 lg:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Category Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-2xl mb-6">
            <i [class]="categoryIcon" class="text-indigo-600 text-3xl"></i>
          </div>
          <h1 class="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {{ categoryName }}
          </h1>
          <p class="text-slate-600 text-lg max-w-2xl mx-auto mb-6">
            {{ categoryDescription }}
          </p>
          
          <!-- Category Stats -->
          <div class="flex justify-center gap-8 text-center">
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ videoCount }}</div>
              <div class="text-sm text-slate-600">Videos</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ formatNumber(totalViews) }}</div>
              <div class="text-sm text-slate-600">Total Views</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-900">{{ formatNumber(subscriberCount) }}</div>
              <div class="text-sm text-slate-600">Subscribers</div>
            </div>
          </div>
        </div>

        <!-- Featured Videos -->
        <div *ngIf="featuredVideos.length > 0" class="mb-12">
          <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-star text-yellow-600"></i>
            </span>
            Featured Videos
          </h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              *ngFor="let video of featuredVideos" 
              class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              (click)="playVideo(video)"
            >
              <div class="relative aspect-video bg-slate-100">
                <img 
                  *ngIf="video.thumbnail" 
                  [src]="video.thumbnail" 
                  [alt]="video.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <i class="fas fa-play text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
                <div class="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                  {{ formatDuration(video.duration) }}
                </div>
                <div class="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-medium">
                  FEATURED
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {{ video.title }}
                </h3>
                <p class="text-slate-600 mb-4 line-clamp-2">
                  {{ video.description }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4 text-sm text-slate-500">
                    <span class="flex items-center gap-1">
                      <i class="fas fa-eye"></i>
                      {{ formatNumber(video.viewCount) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <i class="fas fa-thumbs-up"></i>
                      {{ formatNumber(video.likeCount) }}
                    </span>
                  </div>
                  <span class="text-sm text-slate-500">{{ formatDate(video.publishedDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Videos in Category -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-slate-900">All {{ categoryName }} Videos</h2>
            
            <!-- Sort Options -->
            <select 
              [(ngModel)]="sortBy" 
              (change)="onSortChange()"
              class="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="views">Most Viewed</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
              *ngFor="let video of sortedVideos" 
              class="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              (click)="playVideo(video)"
            >
              <div class="relative aspect-video bg-slate-100">
                <img 
                  *ngIf="video.thumbnail" 
                  [src]="video.thumbnail" 
                  [alt]="video.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <i class="fas fa-play text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
                <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {{ formatDuration(video.duration) }}
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {{ video.title }}
                </h3>
                
                <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span class="flex items-center gap-1">
                    <i class="fas fa-eye"></i>
                    {{ formatNumber(video.viewCount) }}
                  </span>
                  <span>{{ formatDate(video.publishedDate) }}</span>
                </div>
                
                <div class="flex items-center gap-3 text-xs text-slate-500">
                  <span class="flex items-center gap-1">
                    <i class="fas fa-thumbs-up"></i>
                    {{ formatNumber(video.likeCount) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="fas fa-comment"></i>
                    {{ video.commentsCount || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div *ngIf="hasMoreVideos" class="text-center">
          <button 
            (click)="loadMoreVideos()"
            [disabled]="loading"
            class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-colors"
          >
            <span *ngIf="!loading">Load More Videos</span>
            <span *ngIf="loading" class="flex items-center gap-2">
              <i class="fas fa-spinner animate-spin"></i>
              Loading...
            </span>
          </button>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && categoryVideos.length === 0" class="text-center py-16">
          <i class="fas fa-video text-slate-300 text-6xl mb-6"></i>
          <h3 class="text-2xl font-bold text-slate-600 mb-2">No videos in this category yet</h3>
          <p class="text-slate-500 mb-6">Be the first to upload a video in {{ categoryName }}</p>
          <button 
            (click)="navigateToUpload()"
            class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
          >
            Upload Video
          </button>
        </div>
      </div>
    </div>
  `
})
export class VideoCategoryComponent implements OnInit {
  @Input() categoryId: string = '';
  @Input() categoryName: string = '';
  @Input() categoryDescription: string = '';
  @Input() categoryIcon: string = 'fas fa-video';
  
  videoCount = 0;
  totalViews = 0;
  subscriberCount = 0;
  featuredVideos: any[] = [];
  categoryVideos: any[] = [];
  sortBy = 'newest';
  loading = false;
  hasMoreVideos = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCategoryData();
  }

  loadCategoryData() {
    this.loading = true;
    
    // Mock data based on category
    setTimeout(() => {
      this.videoCount = 156;
      this.totalViews = 2400000;
      this.subscriberCount = 45600;
      
      this.featuredVideos = [
        {
          id: '1',
          title: 'Ultimate Guide to Electric Vehicle Maintenance',
          description: 'Everything you need to know about maintaining your electric vehicle for optimal performance and longevity.',
          thumbnail: 'https://via.placeholder.com/640x360',
          duration: '00:15:30',
          viewCount: 89000,
          likeCount: 7200,
          publishedDate: new Date(Date.now() - 86400000)
        },
        {
          id: '2',
          title: 'Top 5 Electric Cars Under $50,000',
          description: 'Our comprehensive review of the best affordable electric vehicles available in 2024.',
          thumbnail: 'https://via.placeholder.com/640x360',
          duration: '00:12:45',
          viewCount: 156000,
          likeCount: 12400,
          publishedDate: new Date(Date.now() - 172800000)
        }
      ];
      
      this.categoryVideos = [
        {
          id: '3',
          title: 'Tesla Model 3 vs BMW i4 Comparison',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:18:20',
          viewCount: 245000,
          likeCount: 18500,
          commentsCount: 892,
          publishedDate: new Date(Date.now() - 259200000)
        },
        {
          id: '4',
          title: 'How Electric Car Batteries Work',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:08:15',
          viewCount: 67000,
          likeCount: 5400,
          commentsCount: 234,
          publishedDate: new Date(Date.now() - 345600000)
        },
        {
          id: '5',
          title: 'Electric Vehicle Charging Network Guide',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:11:30',
          viewCount: 123000,
          likeCount: 9800,
          commentsCount: 567,
          publishedDate: new Date(Date.now() - 432000000)
        },
        {
          id: '6',
          title: 'Future of Electric Transportation',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:14:45',
          viewCount: 89000,
          likeCount: 7200,
          commentsCount: 345,
          publishedDate: new Date(Date.now() - 518400000)
        }
      ];
      
      this.loading = false;
    }, 1000);
  }

  get sortedVideos() {
    const videos = [...this.categoryVideos];
    
    switch (this.sortBy) {
      case 'newest':
        return videos.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
      case 'oldest':
        return videos.sort((a, b) => a.publishedDate.getTime() - b.publishedDate.getTime());
      case 'popular':
        return videos.sort((a, b) => (b.likeCount + b.viewCount * 0.1) - (a.likeCount + a.viewCount * 0.1));
      case 'views':
        return videos.sort((a, b) => b.viewCount - a.viewCount);
      case 'likes':
        return videos.sort((a, b) => b.likeCount - a.likeCount);
      default:
        return videos;
    }
  }

  onSortChange() {
    // Sorting is handled by the getter
  }

  playVideo(video: any) {
    this.router.navigate(['/media/videos', video.id]);
  }

  loadMoreVideos() {
    this.loading = true;
    
    // Mock loading more videos
    setTimeout(() => {
      // Add more mock videos
      const moreVideos = [
        {
          id: `${this.categoryVideos.length + 1}`,
          title: 'Electric Car Road Trip Planning',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:09:30',
          viewCount: 45000,
          likeCount: 3600,
          commentsCount: 189,
          publishedDate: new Date(Date.now() - 604800000)
        }
      ];
      
      this.categoryVideos = [...this.categoryVideos, ...moreVideos];
      this.hasMoreVideos = this.categoryVideos.length < 20; // Mock limit
      this.loading = false;
    }, 1000);
  }

  navigateToUpload() {
    this.router.navigate(['/media/videos/upload']);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatDuration(duration: string): string {
    const parts = duration.split(':');
    if (parts.length === 3 && parts[0] === '00') {
      return `${parts[1]}:${parts[2]}`;
    }
    return duration;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }
}