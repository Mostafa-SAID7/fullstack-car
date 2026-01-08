import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-podcast-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="podcast-search">
      <div class="search-container">
        <div class="search-input-group">
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            placeholder="Search podcasts..."
            class="search-input"
          >
          <button class="search-btn" (click)="performSearch()">
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <div class="search-filters">
          <select [(ngModel)]="selectedCategory" (change)="onFilterChange()" class="filter-select">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
          
          <select [(ngModel)]="sortBy" (change)="onFilterChange()" class="filter-select">
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="popularity">Popularity</option>
            <option value="duration">Duration</option>
          </select>
          
          <select [(ngModel)]="duration" (change)="onFilterChange()" class="filter-select">
            <option value="">Any Duration</option>
            <option value="short">Under 30 min</option>
            <option value="medium">30-60 min</option>
            <option value="long">Over 60 min</option>
          </select>
        </div>
      </div>
      
      <div class="search-results" *ngIf="searchResults.length > 0">
        <div class="results-header">
          <span>{{ searchResults.length }} results found</span>
          <button class="clear-search" (click)="clearSearch()">Clear</button>
        </div>
        
        <div class="results-grid">
          <div *ngFor="let podcast of searchResults" class="result-item" (click)="selectPodcast(podcast)">
            <img [src]="podcast.thumbnail" [alt]="podcast.title" class="result-thumbnail">
            <div class="result-info">
              <h4>{{ podcast.title }}</h4>
              <p>{{ podcast.description }}</p>
              <div class="result-meta">
                <span class="category">{{ podcast.category }}</span>
                <span class="duration">{{ podcast.duration }}</span>
                <span class="date">{{ podcast.publishedDate | date:'shortDate' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="no-results" *ngIf="searchQuery && searchResults.length === 0">
        <i class="fas fa-search"></i>
        <h3>No podcasts found</h3>
        <p>Try adjusting your search terms or filters</p>
      </div>
    </div>
  `,
  styleUrls: ['./podcast-search.component.scss']
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