import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { EventTrackingService } from '../../../core/services/event-tracking.service';

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'podcast' | 'audio' | 'playlist';
  thumbnailUrl: string;
  duration: number;
  publishDate: Date;
  author: string;
  authorAvatar?: string;
  viewCount: number;
  likeCount: number;
  tags: string[];
  categories: string[];
  url: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  watchProgress?: number;
  quality?: string;
  fileSize?: number;
}

export interface MediaCategory {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
  subcategories?: MediaCategory[];
}

export interface SearchFilters {
  query: string;
  type: MediaItem['type'] | 'all';
  category: string;
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  duration: 'all' | 'short' | 'medium' | 'long';
  sortBy: 'relevance' | 'date' | 'views' | 'likes' | 'duration' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface MediaLibraryConfig {
  enableSearch: boolean;
  enableFilters: boolean;
  enableCategories: boolean;
  enableRecommendations: boolean;
  enableBookmarks: boolean;
  enableHistory: boolean;
  enableAnalytics: boolean;
  itemsPerPage: number;
  gridColumns: number;
  showViewCounts: boolean;
  showDurations: boolean;
  showTags: boolean;
}

/**
 * Media Library Component
 * 
 * Comprehensive media discovery and browsing:
 * - Advanced search with filters
 * - Category-based browsing
 * - Tag-based filtering
 * - Personalized recommendations
 * - Bookmarks and watch history
 * - Grid and list view modes
 * - Infinite scroll pagination
 * - Analytics tracking
 */
@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media-library.component.html',
  styles: [`
    .media-library {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .media-card:hover {
      transform: translateY(-2px);
    }

    .category-card:hover {
      transform: translateY(-1px);
    }

    .recommendation-card:hover {
      transform: translateY(-1px);
    }

    .media-list-item:hover {
      transform: translateX(4px);
    }
  `]
})
export class MediaLibraryComponent implements OnInit, OnDestroy {
  @Input() mediaItems = signal<MediaItem[]>([]);
  @Input() categories = signal<MediaCategory[]>([]);
  @Input() config = signal<MediaLibraryConfig>({
    enableSearch: true,
    enableFilters: true,
    enableCategories: true,
    enableRecommendations: true,
    enableBookmarks: true,
    enableHistory: true,
    enableAnalytics: true,
    itemsPerPage: 20,
    gridColumns: 4,
    showViewCounts: true,
    showDurations: true,
    showTags: true
  });

  @Output() itemSelected = new EventEmitter<MediaItem>();
  @Output() categorySelected = new EventEmitter<MediaCategory>();
  @Output() searchPerformed = new EventEmitter<string>();
  @Output() filtersChanged = new EventEmitter<SearchFilters>();
  @Output() itemLiked = new EventEmitter<MediaItem>();
  @Output() itemBookmarked = new EventEmitter<MediaItem>();

  private analyticsService = inject(AnalyticsService);
  private eventTrackingService = inject(EventTrackingService);

  // Signals for reactive state
  protected searchQuery = '';
  protected viewMode = signal<'grid' | 'list'>('grid');
  protected showFilters = signal(false);
  protected isLoading = signal(false);
  protected currentPage = signal(1);

  private filters = signal<SearchFilters>({
    query: '',
    type: 'all',
    category: '',
    tags: [],
    dateRange: 'all',
    duration: 'all',
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  // Writable filter properties for ngModel
  protected filterType: SearchFilters['type'] = 'all';
  protected filterCategory = '';
  protected filterDateRange: SearchFilters['dateRange'] = 'all';
  protected filterSortBy: SearchFilters['sortBy'] = 'relevance';

  protected recommendations = signal<MediaItem[]>([]);

  // Computed values
  protected readonly filteredItems = computed(() => {
    let items = this.mediaItems();
    const currentFilters = this.filters();

    // Apply search query
    if (currentFilters.query) {
      const query = currentFilters.query.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (currentFilters.type !== 'all') {
      items = items.filter(item => item.type === currentFilters.type);
    }

    // Apply category filter
    if (currentFilters.category) {
      items = items.filter(item => item.categories.includes(currentFilters.category));
    }

    // Apply date range filter
    if (currentFilters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (currentFilters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      items = items.filter(item => item.publishDate >= cutoffDate);
    }

    // Apply duration filter
    if (currentFilters.duration !== 'all') {
      switch (currentFilters.duration) {
        case 'short':
          items = items.filter(item => item.duration < 300); // Less than 5 minutes
          break;
        case 'medium':
          items = items.filter(item => item.duration >= 300 && item.duration < 1800); // 5-30 minutes
          break;
        case 'long':
          items = items.filter(item => item.duration >= 1800); // More than 30 minutes
          break;
      }
    }

    // Apply sorting
    items.sort((a, b) => {
      let comparison = 0;

      switch (currentFilters.sortBy) {
        case 'date':
          comparison = a.publishDate.getTime() - b.publishDate.getTime();
          break;
        case 'views':
          comparison = a.viewCount - b.viewCount;
          break;
        case 'likes':
          comparison = a.likeCount - b.likeCount;
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default: // relevance
          comparison = 0;
      }

      return currentFilters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  });

  protected readonly totalItems = computed(() => this.mediaItems().length);
  protected readonly totalPages = computed(() =>
    Math.ceil(this.filteredItems().length / this.config().itemsPerPage)
  );

  protected readonly paginatedItems = computed(() => {
    const items = this.filteredItems();
    const startIndex = (this.currentPage() - 1) * this.config().itemsPerPage;
    const endIndex = startIndex + this.config().itemsPerPage;
    return items.slice(startIndex, endIndex);
  });

  protected readonly trackItem = (index: number, item: MediaItem) => item.id;

  ngOnInit(): void {
    this.initializeMediaLibrary();
    this.generateRecommendations();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Initialize media library
   */
  private initializeMediaLibrary(): void {
    // Set initial filters
    this.filters.set({
      ...this.filters(),
      query: this.searchQuery
    });
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(): void {
    // Simple recommendation algorithm based on liked items and view history
    const items = this.mediaItems();
    const likedItems = items.filter(item => item.isLiked);
    const viewedItems = items.filter(item => item.watchProgress && item.watchProgress > 0);

    // Get categories and tags from liked/viewed items
    const preferredCategories = new Set<string>();
    const preferredTags = new Set<string>();

    [...likedItems, ...viewedItems].forEach(item => {
      item.categories.forEach(cat => preferredCategories.add(cat));
      item.tags.forEach(tag => preferredTags.add(tag));
    });

    // Find similar items
    const recommendations = items
      .filter(item => !item.isLiked && (!item.watchProgress || item.watchProgress < 10))
      .filter(item =>
        item.categories.some(cat => preferredCategories.has(cat)) ||
        item.tags.some(tag => preferredTags.has(tag))
      )
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 8);

    this.recommendations.set(recommendations);
  }

  /**
   * Search functionality
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;

    // Debounce search
    setTimeout(() => {
      if (this.searchQuery === target.value) {
        this.performSearch();
      }
    }, 300);
  }

  performSearch(): void {
    this.filters.set({
      ...this.filters(),
      query: this.searchQuery
    });

    this.currentPage.set(1);
    this.searchPerformed.emit(this.searchQuery);

    if (this.config().enableAnalytics) {
      this.analyticsService.trackSearch(this.searchQuery, this.filteredItems().length);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filters.set({
      ...this.filters(),
      query: ''
    });
    this.currentPage.set(1);
  }

  /**
   * Filter functionality
   */
  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  onFilterChange(): void {
    // Update the filters signal with the current form values
    this.filters.set({
      ...this.filters(),
      type: this.filterType,
      category: this.filterCategory,
      dateRange: this.filterDateRange,
      sortBy: this.filterSortBy
    });

    this.currentPage.set(1);
    this.filtersChanged.emit(this.filters());

    if (this.config().enableAnalytics) {
      this.eventTrackingService.trackCustomEvent({
        name: 'media_filter_applied',
        category: 'media_library',
        action: 'filter',
        parameters: {
          filter_type: this.filterType,
          filter_category: this.filterCategory,
          filter_date_range: this.filterDateRange,
          filter_sort_by: this.filterSortBy
        }
      });
    }
  }

  /**
   * View mode
   */
  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);

    if (this.config().enableAnalytics) {
      this.eventTrackingService.trackCustomEvent({
        name: 'media_view_mode_changed',
        category: 'media_library',
        action: 'view_mode',
        parameters: { view_mode: mode }
      });
    }
  }

  /**
   * Item interactions
   */
  selectItem(item: MediaItem): void {
    this.itemSelected.emit(item);

    if (this.config().enableAnalytics) {
      this.analyticsService.trackContentEngagement(item.id, item.type, 'select');
    }
  }

  selectCategory(category: MediaCategory): void {
    this.filters.set({
      ...this.filters(),
      category: category.id
    });
    this.currentPage.set(1);
    this.categorySelected.emit(category);

    if (this.config().enableAnalytics) {
      this.eventTrackingService.trackCustomEvent({
        name: 'media_category_selected',
        category: 'media_library',
        action: 'category_select',
        parameters: { category_id: category.id, category_name: category.name }
      });
    }
  }

  toggleLike(item: MediaItem): void {
    item.isLiked = !item.isLiked;
    if (item.isLiked) {
      item.likeCount++;
    } else {
      item.likeCount--;
    }

    this.itemLiked.emit(item);

    if (this.config().enableAnalytics) {
      this.analyticsService.trackContentEngagement(
        item.id,
        item.type,
        item.isLiked ? 'like' : 'unlike'
      );
    }
  }

  toggleBookmark(item: MediaItem): void {
    item.isBookmarked = !item.isBookmarked;
    this.itemBookmarked.emit(item);

    if (this.config().enableAnalytics) {
      this.analyticsService.trackContentEngagement(
        item.id,
        item.type,
        item.isBookmarked ? 'bookmark' : 'unbookmark'
      );
    }
  }

  /**
   * Pagination
   */
  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  /**
   * Utility methods
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/default-media.png';
  }
}