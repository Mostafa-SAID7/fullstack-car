import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-video-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 lg:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 class="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-2">
              Video Analytics
            </h1>
            <p class="text-slate-600 text-lg">
              Track performance and insights for your video content
            </p>
          </div>
          
          <div class="flex gap-3">
            <select class="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
            <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              <i class="fas fa-download mr-2"></i>
              Export
            </button>
          </div>
        </div>

        <!-- Overview Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-blue-100 rounded-xl">
                <i class="fas fa-eye text-blue-600 text-xl"></i>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-slate-900">{{ formatNumber(totalViews) }}</div>
                <div class="text-sm text-green-600">+{{ viewsGrowth }}%</div>
              </div>
            </div>
            <h3 class="text-slate-600 font-medium">Total Views</h3>
            <div class="mt-2 bg-slate-100 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="viewsProgress"></div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-purple-100 rounded-xl">
                <i class="fas fa-clock text-purple-600 text-xl"></i>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-slate-900">{{ averageWatchTime }}</div>
                <div class="text-sm text-green-600">+{{ watchTimeGrowth }}%</div>
              </div>
            </div>
            <h3 class="text-slate-600 font-medium">Avg. Watch Time</h3>
            <div class="mt-2 bg-slate-100 rounded-full h-2">
              <div class="bg-purple-600 h-2 rounded-full" [style.width.%]="watchTimeProgress"></div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-green-100 rounded-xl">
                <i class="fas fa-thumbs-up text-green-600 text-xl"></i>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-slate-900">{{ engagementRate }}%</div>
                <div class="text-sm text-green-600">+{{ engagementGrowth }}%</div>
              </div>
            </div>
            <h3 class="text-slate-600 font-medium">Engagement Rate</h3>
            <div class="mt-2 bg-slate-100 rounded-full h-2">
              <div class="bg-green-600 h-2 rounded-full" [style.width.%]="engagementProgress"></div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-orange-100 rounded-xl">
                <i class="fas fa-users text-orange-600 text-xl"></i>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-slate-900">{{ formatNumber(subscribers) }}</div>
                <div class="text-sm text-green-600">+{{ subscriberGrowth }}%</div>
              </div>
            </div>
            <h3 class="text-slate-600 font-medium">Subscribers</h3>
            <div class="mt-2 bg-slate-100 rounded-full h-2">
              <div class="bg-orange-600 h-2 rounded-full" [style.width.%]="subscriberProgress"></div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Views Chart -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Views Over Time</h2>
            <div class="h-64 bg-slate-50 rounded-xl flex items-center justify-center">
              <div class="text-center">
                <i class="fas fa-chart-line text-slate-300 text-4xl mb-2"></i>
                <p class="text-slate-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>

          <!-- Audience Retention -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Audience Retention</h2>
            <div class="h-64 bg-slate-50 rounded-xl flex items-center justify-center">
              <div class="text-center">
                <i class="fas fa-chart-area text-slate-300 text-4xl mb-2"></i>
                <p class="text-slate-500">Retention chart would go here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Performing Videos -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <h2 class="text-xl font-bold text-slate-900 mb-6">Top Performing Videos</h2>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-slate-100">
                  <th class="text-left py-3 px-4 font-medium text-slate-600">Video</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-600">Views</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-600">Watch Time</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-600">Engagement</th>
                  <th class="text-left py-3 px-4 font-medium text-slate-600">Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let video of topVideos; let i = index" class="border-b border-slate-50 hover:bg-slate-50">
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-16 h-10 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                        <img *ngIf="video.thumbnail" [src]="video.thumbnail" [alt]="video.title" class="w-full h-full object-cover">
                      </div>
                      <div class="min-w-0 flex-1">
                        <h3 class="font-medium text-slate-900 truncate">{{ video.title }}</h3>
                        <p class="text-sm text-slate-500">{{ formatDate(video.publishedDate) }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="font-medium text-slate-900">{{ formatNumber(video.views) }}</div>
                    <div class="text-sm text-green-600">+{{ video.viewsGrowth }}%</div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="font-medium text-slate-900">{{ video.watchTime }}</div>
                    <div class="text-sm text-slate-500">{{ video.retention }}% retention</div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="font-medium text-slate-900">{{ video.engagement }}%</div>
                    <div class="text-sm text-slate-500">{{ formatNumber(video.likes) }} likes</div>
                  </td>
                  <td class="py-4 px-4">
                    <div class="font-medium text-slate-900">\${{ video.revenue }}</div>
                    <div class="text-sm text-slate-500">\${{ video.rpm }} RPM</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Demographics and Traffic Sources -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Demographics -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 class="text-xl font-bold text-slate-900 mb-6">Audience Demographics</h2>
            
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-slate-700 mb-2">Age Groups</h3>
                <div class="space-y-2">
                  <div *ngFor="let age of ageGroups" class="flex items-center justify-between">
                    <span class="text-sm text-slate-600">{{ age.range }}</span>
                    <div class="flex items-center gap-2">
                      <div class="w-24 bg-slate-100 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="age.percentage"></div>
                      </div>
                      <span class="text-sm font-medium text-slate-900 w-8">{{ age.percentage }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100">
                <h3 class="font-medium text-slate-700 mb-2">Top Countries</h3>
                <div class="space-y-2">
                  <div *ngFor="let country of topCountries" class="flex items-center justify-between">
                    <span class="text-sm text-slate-600">{{ country.name }}</span>
                    <span class="text-sm font-medium text-slate-900">{{ country.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Traffic Sources -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 class="text-xl font-bold text-slate-900 mb-6">Traffic Sources</h2>
            
            <div class="space-y-4">
              <div *ngFor="let source of trafficSources" class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white rounded-lg">
                    <i [class]="source.icon" class="text-slate-600"></i>
                  </div>
                  <div>
                    <h3 class="font-medium text-slate-900">{{ source.name }}</h3>
                    <p class="text-sm text-slate-500">{{ formatNumber(source.views) }} views</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium text-slate-900">{{ source.percentage }}%</div>
                  <div class="text-sm text-green-600">+{{ source.growth }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VideoAnalyticsComponent implements OnInit {
  totalViews = 0;
  viewsGrowth = 0;
  viewsProgress = 0;
  
  averageWatchTime = '0:00';
  watchTimeGrowth = 0;
  watchTimeProgress = 0;
  
  engagementRate = 0;
  engagementGrowth = 0;
  engagementProgress = 0;
  
  subscribers = 0;
  subscriberGrowth = 0;
  subscriberProgress = 0;

  topVideos: any[] = [];
  ageGroups: any[] = [];
  topCountries: any[] = [];
  trafficSources: any[] = [];

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.loadAnalyticsData();
  }

  loadAnalyticsData() {
    // Mock analytics data
    this.totalViews = 1250000;
    this.viewsGrowth = 15.2;
    this.viewsProgress = 75;
    
    this.averageWatchTime = '4:32';
    this.watchTimeGrowth = 8.7;
    this.watchTimeProgress = 68;
    
    this.engagementRate = 12.4;
    this.engagementGrowth = 5.3;
    this.engagementProgress = 82;
    
    this.subscribers = 45600;
    this.subscriberGrowth = 12.1;
    this.subscriberProgress = 91;

    this.topVideos = [
      {
        title: '2024 Tesla Model S Plaid Review',
        thumbnail: 'https://via.placeholder.com/64x40',
        views: 245000,
        viewsGrowth: 18.5,
        watchTime: '6:45',
        retention: 72,
        engagement: 15.2,
        likes: 18500,
        revenue: 1240,
        rpm: 5.06,
        publishedDate: new Date(Date.now() - 86400000)
      },
      {
        title: 'Top 10 Electric Cars 2024',
        thumbnail: 'https://via.placeholder.com/64x40',
        views: 189000,
        viewsGrowth: 12.3,
        watchTime: '8:12',
        retention: 68,
        engagement: 13.8,
        likes: 14200,
        revenue: 980,
        rpm: 5.18,
        publishedDate: new Date(Date.now() - 172800000)
      },
      {
        title: 'BMW M3 vs Mercedes AMG C63',
        thumbnail: 'https://via.placeholder.com/64x40',
        views: 156000,
        viewsGrowth: 9.7,
        watchTime: '5:28',
        retention: 75,
        engagement: 16.4,
        likes: 12800,
        revenue: 820,
        rpm: 5.26,
        publishedDate: new Date(Date.now() - 259200000)
      }
    ];

    this.ageGroups = [
      { range: '18-24', percentage: 28 },
      { range: '25-34', percentage: 35 },
      { range: '35-44', percentage: 22 },
      { range: '45-54', percentage: 12 },
      { range: '55+', percentage: 3 }
    ];

    this.topCountries = [
      { name: 'United States', percentage: 42 },
      { name: 'United Kingdom', percentage: 18 },
      { name: 'Germany', percentage: 12 },
      { name: 'Canada', percentage: 8 },
      { name: 'Australia', percentage: 6 }
    ];

    this.trafficSources = [
      {
        name: 'YouTube Search',
        icon: 'fas fa-search',
        views: 520000,
        percentage: 41.6,
        growth: 12.3
      },
      {
        name: 'Suggested Videos',
        icon: 'fas fa-list',
        views: 375000,
        percentage: 30.0,
        growth: 8.7
      },
      {
        name: 'External Sources',
        icon: 'fas fa-external-link-alt',
        views: 200000,
        percentage: 16.0,
        growth: 15.2
      },
      {
        name: 'Direct Traffic',
        icon: 'fas fa-globe',
        views: 155000,
        percentage: 12.4,
        growth: 5.8
      }
    ];
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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