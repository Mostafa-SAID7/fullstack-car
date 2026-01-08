import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-video-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 lg:p-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Discover Videos
          </h1>
          <p class="text-slate-600 text-lg max-w-2xl mx-auto">
            Search through thousands of automotive videos to find exactly what you're looking for
          </p>
        </div>

        <!-- Search Container -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <!-- Search Input -->
          <div class="relative mb-6">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i class="fas fa-search text-slate-400"></i>
            </div>
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              (input)="onSearchInput()"
              placeholder="Search for car reviews, tutorials, news..."
              class="w-full pl-12 pr-4 py-4 text-lg border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
            <button 
              *ngIf="searchQuery"
              (click)="clearSearch()"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Filters -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select 
              [(ngModel)]="selectedCategory" 
              (change)="onFilterChange()"
              class="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }}
              </option>
            </select>
            
            <select 
              [(ngModel)]="sortBy" 
              (change)="onFilterChange()"
              class="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Most Relevant</option>
              <option value="date">Newest First</option>
              <option value="views">Most Viewed</option>
              <option value="likes">Most Liked</option>
              <option value="duration">Duration</option>
            </select>
            
            <select 
              [(ngModel)]="duration" 
              (change)="onFilterChange()"
              class="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Duration</option>
              <option value="short">Under 5 min</option>
              <option value="medium">5-20 min</option>
              <option value="long">Over 20 min</option>
            </select>

            <select 
              [(ngModel)]="quality" 
              (change)="onFilterChange()"
              class="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Quality</option>
              <option value="720p">HD (720p)</option>
              <option value="1080p">Full HD (1080p)</option>
              <option value="4k">4K Ultra HD</option>
            </select>
          </div>
        </div>

        <!-- Search Results -->
        <div *ngIf="searchResults.length > 0" class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-slate-900">
              {{ searchResults.length }} results found
              <span *ngIf="searchQuery" class="text-slate-600 font-normal">for "{{ searchQuery }}"</span>
            </h2>
            <button 
              (click)="clearSearch()"
              class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              <i class="fas fa-times"></i>
              Clear Search
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              *ngFor="let video of searchResults" 
              class="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              (click)="selectVideo(video)"
            >
              <div class="relative aspect-video bg-slate-100">
                <img 
                  *ngIf="video.thumbnail" 
                  [src]="video.thumbnail" 
                  [alt]="video.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <i class="fas fa-play text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
                <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {{ formatDuration(video.duration) }}
                </div>
                <div *ngIf="video.quality" class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {{ video.quality }}
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {{ video.title }}
                </h3>
                <p class="text-sm text-slate-600 mb-3 line-clamp-2">
                  {{ video.description }}
                </p>
                
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1">
                      <i class="fas fa-eye"></i>
                      {{ formatNumber(video.viewCount) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <i class="fas fa-thumbs-up"></i>
                      {{ formatNumber(video.likeCount) }}
                    </span>
                  </div>
                  <span class="bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {{ video.category }}
                  </span>
                </div>
                
                <div class="mt-3 pt-3 border-t border-slate-100">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-500">{{ formatDate(video.publishedDate) }}</span>
                    <span class="text-xs text-slate-600 font-medium">{{ video.creatorName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div *ngIf="searchQuery && searchResults.length === 0 && !searching" class="text-center py-16">
          <i class="fas fa-search text-slate-300 text-6xl mb-6"></i>
          <h3 class="text-2xl font-bold text-slate-600 mb-2">No videos found</h3>
          <p class="text-slate-500 mb-6 max-w-md mx-auto">
            We couldn't find any videos matching your search. Try adjusting your filters or search terms.
          </p>
          <button 
            (click)="clearSearch()"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            Clear Search
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="searching" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="animate-pulse">
            <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
              <div class="aspect-video bg-slate-200"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                <div class="h-3 bg-slate-200 rounded w-full"></div>
                <div class="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Searches -->
        <div *ngIf="!searchQuery && !searching" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Popular Searches</h2>
          <div class="flex flex-wrap gap-2">
            <button 
              *ngFor="let tag of popularTags"
              (click)="searchByTag(tag)"
              class="px-4 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-full text-sm font-medium transition-colors"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VideoSearchComponent implements OnInit {
  @Output() videoSelected = new EventEmitter<any>();
  
  searchQuery = '';
  selectedCategory = '';
  sortBy = 'relevance';
  duration = '';
  quality = '';
  searchResults: any[] = [];
  searching = false;
  
  categories = [
    { id: 'reviews', name: 'Car Reviews' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'news', name: 'Automotive News' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'racing', name: 'Racing' },
    { id: 'electric', name: 'Electric Vehicles' }
  ];

  popularTags = [
    'Tesla Model 3', 'BMW M3', 'Car Maintenance', 'Electric Cars',
    'Racing', 'Luxury Cars', 'SUV Reviews', 'Hybrid Vehicles'
  ];

  constructor(
    private videoService: VideoService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize component
  }

  onSearchInput() {
    if (this.searchQuery.length > 2) {
      this.performSearch();
    } else if (this.searchQuery.length === 0) {
      this.searchResults = [];
    }
  }

  performSearch() {
    this.searching = true;
    
    // Mock search results
    setTimeout(() => {
      this.searchResults = [
        {
          id: '1',
          title: '2024 Tesla Model S Plaid Review - Insane Performance!',
          description: 'Complete review of the fastest Tesla ever made. We test acceleration, handling, and range.',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:12:45',
          viewCount: 245000,
          likeCount: 18500,
          category: 'Reviews',
          quality: '4K',
          creatorName: 'AutoReview Pro',
          publishedDate: new Date(Date.now() - 86400000)
        },
        {
          id: '2',
          title: 'How to Change Your Car Oil - Complete Guide',
          description: 'Step-by-step tutorial on changing your car oil at home. Save money and learn a valuable skill.',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:08:30',
          viewCount: 156000,
          likeCount: 12400,
          category: 'Tutorials',
          quality: '1080p',
          creatorName: 'DIY Garage',
          publishedDate: new Date(Date.now() - 172800000)
        },
        {
          id: '3',
          title: 'Top 10 Electric Cars of 2024',
          description: 'Our comprehensive list of the best electric vehicles you can buy this year.',
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '00:15:20',
          viewCount: 89000,
          likeCount: 7200,
          category: 'Reviews',
          quality: '1080p',
          creatorName: 'EV Central',
          publishedDate: new Date(Date.now() - 259200000)
        }
      ].filter(video => 
        video.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      
      this.searching = false;
    }, 1000);
  }

  onFilterChange() {
    if (this.searchQuery) {
      this.performSearch();
    }
  }

  selectVideo(video: any) {
    this.videoSelected.emit(video);
    this.router.navigate(['/media/videos', video.id]);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedCategory = '';
    this.sortBy = 'relevance';
    this.duration = '';
    this.quality = '';
  }

  searchByTag(tag: string) {
    this.searchQuery = tag;
    this.performSearch();
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