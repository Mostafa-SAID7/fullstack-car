import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-podcast-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="podcast-search space-y-8 animate-fade-in">
      <div class="search-container fb-card p-6">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-grow relative">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              (input)="onSearchInput()"
              placeholder="Search podcasts..."
              class="w-full bg-secondary/50 dark:bg-white/5 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-bold placeholder:text-muted-foreground"
            >
          </div>
          <button (click)="performSearch()"
            class="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            Search
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <select [(ngModel)]="selectedCategory" (change)="onFilterChange()" 
            class="w-full bg-secondary/50 dark:bg-white/5 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-bold cursor-pointer appearance-none">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
          
          <select [(ngModel)]="sortBy" (change)="onFilterChange()" 
            class="w-full bg-secondary/50 dark:bg-white/5 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-bold cursor-pointer appearance-none">
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="popularity">Popularity</option>
            <option value="duration">Duration</option>
          </select>
          
          <select [(ngModel)]="duration" (change)="onFilterChange()" 
            class="w-full bg-secondary/50 dark:bg-white/5 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground font-bold cursor-pointer appearance-none">
            <option value="">Any Duration</option>
            <option value="short">Under 30 min</option>
            <option value="medium">30-60 min</option>
            <option value="long">Over 60 min</option>
          </select>
        </div>
      </div>
      
      <div class="search-results space-y-6" *ngIf="searchResults.length > 0">
        <div class="flex items-center justify-between px-4">
          <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{{ searchResults.length }} results found</span>
          <button (click)="clearSearch()" 
            class="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">Clear All</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let podcast of searchResults" (click)="selectPodcast(podcast)"
            class="fb-card p-4 flex gap-4 cursor-pointer group hover:border-primary/20 transition-all">
            <img [src]="podcast.thumbnail" [alt]="podcast.title" 
              class="w-24 h-24 rounded-xl object-cover border border-black/5 dark:border-white/5 shadow-sm flex-shrink-0">
            <div class="flex-grow flex flex-col justify-between">
              <div>
                <h4 class="font-black text-sm text-foreground uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">{{ podcast.title }}</h4>
                <p class="text-xs text-muted-foreground line-clamp-2 mt-1">{{ podcast.description }}</p>
              </div>
              <div class="flex items-center gap-3 mt-3">
                <span class="px-2 py-0.5 bg-secondary dark:bg-white/5 rounded text-[9px] font-black uppercase tracking-widest text-muted-foreground">{{ podcast.category }}</span>
                <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{{ podcast.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="no-results flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-[#111] rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10" *ngIf="searchQuery && searchResults.length === 0">
        <div class="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-xl mb-6">
          <i class="fas fa-search text-2xl text-slate-300"></i>
        </div>
        <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase italic">No podcasts found</h3>
        <p class="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Expand your filters and try again</p>
      </div>
    </div>
  `
})
export class PodcastSearchComponent implements OnInit {
  @Output() podcastSelected = new EventEmitter<any>();

  searchQuery = '';
  selectedCategory = '';
  sortBy = 'relevance';
  duration = '';
  searchResults: any[] = [];

  categories = [
    { id: 'technology', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Health & Fitness' },
    { id: 'news', name: 'News & Politics' }
  ];

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
    // Implement search logic
    // This would typically call a service to search podcasts
    console.log('Searching for:', this.searchQuery);
  }

  onFilterChange() {
    if (this.searchQuery) {
      this.performSearch();
    }
  }

  selectPodcast(podcast: any) {
    this.podcastSelected.emit(podcast);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedCategory = '';
    this.sortBy = 'relevance';
    this.duration = '';
  }
}