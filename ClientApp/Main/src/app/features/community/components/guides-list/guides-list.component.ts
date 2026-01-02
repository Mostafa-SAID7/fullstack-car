import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GuidesService } from '../../services/guides.service';
import {
  GuideListItem,
  GuideFilters,
  GuideCategory,
  GuideDifficulty
} from '../../models/guide.model';
import { PaginatedResult } from '../../../../core/models/pagination.model';
import { ListViewComponent, PaginationConfig } from '../../../../shared/components/list-view/list-view.component';
import { GuideCardComponent } from '../guide-card/guide-card.component';

@Component({
  selector: 'app-guides-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ListViewComponent, GuideCardComponent],
  templateUrl: './guides-list.component.html',
  styleUrls: ['./guides-list.component.scss']
})
export class GuidesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  guides: GuideListItem[] = [];
  loading = false;
  error: string | null = null;

  paginationConfig: PaginationConfig = {
    currentPage: 1,
    pageSize: 12,
    totalItems: 0,
    totalPages: 0
  };

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

  constructor(
    private guidesService: GuidesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOptions();
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

  loadGuides(): void {
    this.loading = true;
    this.error = null;

    this.guidesService.getGuides(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: PaginatedResult<GuideListItem>) => {
          this.guides = result.items;
          this.paginationConfig = {
            currentPage: result.pageNumber,
            pageSize: result.pageSize,
            totalItems: result.totalCount,
            totalPages: result.totalPages
          };
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load guides. Please try again.';
          this.loading = false;
          console.error('Error loading guides:', error);
        }
      });
  }

  onSearchChange(): void {
    this.filters.searchTerm = this.searchTerm || undefined;
    this.resetPagination();
  }

  onCategoryChange(): void {
    this.filters.category = this.selectedCategory;
    this.resetPagination();
  }

  onDifficultyChange(): void {
    this.filters.difficulty = this.selectedDifficulty;
    this.resetPagination();
  }

  onFeaturedToggle(): void {
    this.filters.isFeatured = this.showFeaturedOnly ? true : undefined;
    this.resetPagination();
  }

  onSortChange(sortBy: string): void {
    this.filters.sortBy = sortBy;
    this.resetPagination();
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.loadGuides();
  }

  onBookmarkGuide(guide: GuideListItem): void {
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

    this.loadGuides();
  }

  private resetPagination(): void {
    this.filters.page = 1;
    this.loadGuides();
  }
}
