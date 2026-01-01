import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { GuidesService } from '../../services/guides.service';
import { 
  GuideListItem, 
  GuideFilters, 
  GuideCategory, 
  GuideDifficulty 
} from '../../models/guide.model';
import { PaginatedResult } from '../../../../core/models/pagination.model';

@Component({
  selector: 'app-guides-list',
  templateUrl: './guides-list.component.html',
  styleUrls: ['./guides-list.component.scss']
})
export class GuidesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  guides: GuideListItem[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;

  // Filters
  filters: GuideFilters = {
    page: 1,
    pageSize: 12,
    sortBy: 'CreatedAt',
    sortDescending: true
  };

  searchTerm = '';
  selectedCategory?: GuideCategory;
  selectedDifficulty?: GuideDifficulty;
  showFeaturedOnly = false;

  // Options
  categories: { value: number; name: string }[] = [];
  difficulties: { value: number; name: string }[] = [];
  sortOptions = [
    { value: 'CreatedAt', label: 'Newest First' },
    { value: 'Title', label: 'Title A-Z' },
    { value: 'ViewCount', label: 'Most Viewed' },
    { value: 'Rating', label: 'Highest Rated' },
    { value: 'LikeCount', label: 'Most Liked' }
  ];

  // Enums for template
  GuideCategory = GuideCategory;
  GuideDifficulty = GuideDifficulty;

  constructor(
    private guidesService: GuidesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOptions();
    this.setupSearch();
    this.loadGuides();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOptions(): void {
    this.guidesService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => this.categories = categories);

    this.guidesService.getDifficulties()
      .pipe(takeUntil(this.destroy$))
      .subscribe(difficulties => this.difficulties = difficulties);
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.filters.searchTerm = searchTerm || undefined;
        this.filters.page = 1;
        this.currentPage = 1;
        this.loadGuides();
      });
  }

  loadGuides(): void {
    this.loading = true;
    this.error = null;

    this.guidesService.getGuides(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: PaginatedResult<GuideListItem>) => {
          this.guides = result.items;
          this.totalItems = result.totalCount;
          this.totalPages = result.totalPages;
          this.currentPage = result.pageNumber;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load guides. Please try again.';
          this.loading = false;
          console.error('Error loading guides:', error);
        }
      });
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  onCategoryChange(category: GuideCategory | undefined): void {
    this.selectedCategory = category;
    this.filters.category = category;
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadGuides();
  }

  onDifficultyChange(difficulty: GuideDifficulty | undefined): void {
    this.selectedDifficulty = difficulty;
    this.filters.difficulty = difficulty;
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadGuides();
  }

  onFeaturedToggle(): void {
    this.showFeaturedOnly = !this.showFeaturedOnly;
    this.filters.isFeatured = this.showFeaturedOnly ? true : undefined;
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadGuides();
  }

  onSortChange(sortBy: string): void {
    this.filters.sortBy = sortBy;
    this.filters.page = 1;
    this.currentPage = 1;
    this.loadGuides();
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.currentPage = page;
    this.loadGuides();
  }

  viewGuide(guide: GuideListItem): void {
    this.router.navigate(['/community/guides', guide.id]);
  }

  bookmarkGuide(guide: GuideListItem, event: Event): void {
    event.stopPropagation();
    
    this.guidesService.bookmarkGuide(guide.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          guide.isBookmarked = !guide.isBookmarked;
          guide.bookmarkCount += guide.isBookmarked ? 1 : -1;
        },
        error: (error) => {
          console.error('Error bookmarking guide:', error);
        }
      });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = undefined;
    this.selectedDifficulty = undefined;
    this.showFeaturedOnly = false;
    
    this.filters = {
      page: 1,
      pageSize: 12,
      sortBy: 'CreatedAt',
      sortDescending: true
    };
    
    this.currentPage = 1;
    this.loadGuides();
  }

  getDifficultyColor(difficulty: GuideDifficulty): string {
    return this.guidesService.getDifficultyColor(difficulty);
  }

  formatReadTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min read`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m read` : `${hours}h read`;
  }
}