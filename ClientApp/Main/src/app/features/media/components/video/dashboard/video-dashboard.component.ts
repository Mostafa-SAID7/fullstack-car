import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-video-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <!-- Header Section -->
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 class="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-2">
              Video Studio
            </h1>
            <p class="text-slate-600 text-lg">
              Create, manage, and analyze your video content
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              (click)="navigateToUpload()"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <i class="fas fa-video"></i>
              Upload Video
            </button>
            <button 
              (click)="navigateToAnalytics()"
              class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <i class="fas fa-chart-line"></i>
              Analytics
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-blue-100 rounded-xl">
                <i class="fas fa-video text-blue-600 text-xl"></i>
              </div>
              <span class="text-2xl font-bold text-slate-900">{{ totalVideos }}</span>
            </div>
            <h3 class="text-slate-600 font-medium">Total Videos</h3>
            <p class="text-sm text-green-600 mt-1">+{{ newVideosThisMonth }} this month</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-100 rounded-xl">
                <i class="fas fa-eye text-purple-600 text-xl"></i>
              </div>
              <span class="text-2xl font-bold text-slate-900">{{ formatNumber(totalViews) }}</span>
            </div>
            <h3 class="text-slate-600 font-medium">Total Views</h3>
            <p class="text-sm text-green-600 mt-1">+{{ formatNumber(viewsThisMonth) }} this month</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-green-100 rounded-xl">
                <i class="fas fa-thumbs-up text-green-600 text-xl"></i>
              </div>
              <span class="text-2xl font-bold text-slate-900">{{ formatNumber(totalLikes) }}</span>
            </div>
            <h3 class="text-slate-600 font-medium">Total Likes</h3>
            <p class="text-sm text-green-600 mt-1">{{ likeRate }}% like rate</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-orange-100 rounded-xl">
                <i class="fas fa-clock text-orange-600 text-xl"></i>
              </div>
              <span class="text-2xl font-bold text-slate-900">{{ averageWatchTime }}</span>
            </div>
            <h3 class="text-slate-600 font-medium">Avg. Watch Time</h3>
            <p class="text-sm text-blue-600 mt-1">{{ retentionRate }}% retention</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              (click)="navigateToUpload()"
              class="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center group"
            >
              <i class="fas fa-upload text-blue-600 text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
              <p class="text-sm font-medium text-slate-700">Upload Video</p>
            </button>
            
            <button 
              (click)="navigateToList()"
              class="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center group"
            >
              <i class="fas fa-list text-purple-600 text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
              <p class="text-sm font-medium text-slate-700">Manage Videos</p>
            </button>
            
            <button 
              (click)="navigateToAnalytics()"
              class="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center group"
            >
              <i class="fas fa-chart-bar text-green-600 text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
              <p class="text-sm font-medium text-slate-700">View Analytics</p>
            </button>
            
            <button 
              (click)="navigateToSearch()"
              class="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center group"
            >
              <i class="fas fa-search text-orange-600 text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
              <p class="text-sm font-medium text-slate-700">Search Videos</p>
            </button>
          </div>
        </div>

        <!-- Recent Videos -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-slate-900">Recent Videos</h2>
            <button 
              (click)="navigateToList()"
              class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              View All
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>

          <div *ngIf="loading" class="space-y-4">
            <div *ngFor="let i of [1,2,3]" class="animate-pulse">
              <div class="flex gap-4">
                <div class="w-32 h-20 bg-slate-200 rounded-lg"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div class="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="!loading && recentVideos.length > 0" class="space-y-4">
            <div 
              *ngFor="let video of recentVideos" 
              class="flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
              (click)="navigateToVideo(video.id)"
            >
              <div class="relative w-32 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  *ngIf="video.thumbnail" 
                  [src]="video.thumbnail" 
                  [alt]="video.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <i class="fas fa-play text-white opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
                <div class="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                  {{ formatDuration(video.duration) }}
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {{ video.title }}
                </h3>
                <p class="text-sm text-slate-600 mt-1">
                  {{ formatNumber(video.viewCount) }} views • {{ formatDate(video.createdAt) }}
                </p>
                <div class="flex items-center gap-4 mt-2 text-xs text-slate-500">
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

          <div *ngIf="!loading && recentVideos.length === 0" class="text-center py-12">
            <i class="fas fa-video text-slate-300 text-4xl mb-4"></i>
            <h3 class="text-lg font-medium text-slate-600 mb-2">No videos yet</h3>
            <p class="text-slate-500 mb-4">Upload your first video to get started</p>
            <button 
              (click)="navigateToUpload()"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Upload Video
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VideoDashboardComponent implements OnInit {
  loading = true;
  totalVideos = 0;
  newVideosThisMonth = 0;
  totalViews = 0;
  viewsThisMonth = 0;
  totalLikes = 0;
  likeRate = 0;
  averageWatchTime = '0:00';
  retentionRate = 0;
  recentVideos: any[] = [];

  constructor(
    private videoService: VideoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load dashboard statistics
    // This would typically call various service methods
    this.loading = true;
    
    // Mock data for now
    setTimeout(() => {
      this.totalVideos = 24;
      this.newVideosThisMonth = 5;
      this.totalViews = 125000;
      this.viewsThisMonth = 18500;
      this.totalLikes = 8900;
      this.likeRate = 94;
      this.averageWatchTime = '4:32';
      this.retentionRate = 68;
      
      this.recentVideos = [
        {
          id: '1',
          title: 'Car Review: 2024 Tesla Model S',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:08:45',
          viewCount: 15420,
          likeCount: 892,
          commentsCount: 156,
          createdAt: new Date(Date.now() - 86400000) // 1 day ago
        },
        {
          id: '2',
          title: 'Top 10 Electric Cars of 2024',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:12:30',
          viewCount: 8750,
          likeCount: 654,
          commentsCount: 89,
          createdAt: new Date(Date.now() - 172800000) // 2 days ago
        },
        {
          id: '3',
          title: 'How to Maintain Your Car Engine',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:06:15',
          viewCount: 12300,
          likeCount: 743,
          commentsCount: 201,
          createdAt: new Date(Date.now() - 259200000) // 3 days ago
        }
      ];
      
      this.loading = false;
    }, 1000);
  }

  navigateToUpload() {
    this.router.navigate(['/media/videos/upload']);
  }

  navigateToList() {
    this.router.navigate(['/media'], { queryParams: { tab: 'videos' } });
  }

  navigateToAnalytics() {
    this.router.navigate(['/media'], { queryParams: { tab: 'video-analytics' } });
  }

  navigateToSearch() {
    this.router.navigate(['/media'], { queryParams: { tab: 'video-search' } });
  }

  navigateToVideo(id: string) {
    this.router.navigate(['/media/videos', id]);
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
    // Convert from HH:MM:SS to MM:SS if less than an hour
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