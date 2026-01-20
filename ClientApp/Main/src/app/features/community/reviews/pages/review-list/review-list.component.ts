import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Review } from '../models/review.model';
import { ReviewService } from '../../services/review.service';
import { ReviewItemComponent } from '../review-item/review-item.component';
import { PaginationComponent } from '@shared/components/ui/pagination/pagination.component';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReviewItemComponent, PaginationComponent, ReactiveFormsModule],
  template: `
    <div class="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      
      <!-- Card 1: Search & Actions -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <form [formGroup]="searchForm" class="flex flex-col md:flex-row gap-4 mb-0">
          <!-- Search Input -->
          <div class="relative flex-grow group">
            <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300"></i>
            <input formControlName="searchTerm" type="text" [placeholder]="'reviews.filters.filterReviews' | translate"
              class="w-full bg-secondary/30 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-full pl-12 pr-6 py-4 outline-none transition-all text-foreground font-bold">
          </div>

          <!-- Filter Actions -->
          <div class="flex gap-2">
            <button type="button" (click)="toggleFilters()"
              [ngClass]="showFilters ? 'bg-primary text-white' : 'bg-secondary dark:bg-white/5'"
              class="px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-sliders-h"></i>
              <span>{{ 'reviews.filters.filterReviews' | translate }}</span>
            </button>

            <button type="button"
              class="px-8 py-4 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-plus"></i>
              <span>{{ 'reviews.writeReview' | translate }}</span>
            </button>
          </div>
        </form>

        <!-- Collapsible Filters -->
        <div *ngIf="showFilters" class="pt-6 animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">{{ 'reviews.filters.sortBy' | translate }}</label>
              <div class="relative">
                <i class="fas fa-sort absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="sortBy"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option value="createdAt">{{ 'reviews.filters.mostRecent' | translate }}</option>
                  <option value="rating">{{ 'reviews.filters.highestRated' | translate }}</option>
                  <option value="helpful">{{ 'reviews.filters.mostHelpful' | translate }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
            
            <!-- Rating Filter -->
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">{{ 'reviews.filters.filterByRating' | translate }}</label>
              <div class="relative">
                <i class="fas fa-star absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="ratingFilter"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option value="">{{ 'reviews.filters.allReviews' | translate }}</option>
                  <option value="5">{{ 'stars.fiveStars' | translate }} ({{ 'stars.fiveStarsDesc' | translate }})</option>
                  <option value="4">{{ 'stars.fourStars' | translate }} ({{ 'stars.fourStarsDesc' | translate }})</option>
                  <option value="3">{{ 'stars.threeStars' | translate }} ({{ 'stars.threeStarsDesc' | translate }})</option>
                  <option value="2">{{ 'stars.twoStars' | translate }} ({{ 'stars.twoStarsDesc' | translate }})</option>
                  <option value="1">{{ 'stars.oneStar' | translate }} ({{ 'stars.oneStarDesc' | translate }})</option>
                </select>
                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Content Grid -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5 min-h-[500px]">
        <!-- Loading -->
        <div *ngIf="loading" class="space-y-4">
          <div *ngFor="let i of [1,2,3,4]" class="h-40 bg-secondary/30 dark:bg-white/5 rounded-3xl animate-pulse"></div>
        </div>

        <!-- List -->
        <div *ngIf="!loading && reviews.length > 0" class="space-y-4">
          <app-review-item *ngFor="let review of reviews" [review]="review"></app-review-item>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && reviews.length === 0" class="py-24 text-center">
          <div class="w-20 h-20 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <i class="fas fa-star-half-stroke text-3xl text-muted-foreground/30"></i>
          </div>
          <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">{{ 'reviews.noReviewsFound' | translate }}</h3>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest">{{ 'reviews.noReviews' | translate }}</p>
        </div>
      </div>

      <!-- Card 3: Pagination -->
      <div *ngIf="totalPages > 1" class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <app-pagination [currentPage]="currentPage" [totalPages]="totalPages" [pageSize]="pageSize"
          [totalItems]="totalCount" (pageChange)="onPageChange($event)"></app-pagination>
      </div>

    </div>
  `
})
export class ReviewListComponent implements OnInit, OnDestroy {
  reviews: Review[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  showFilters = false;
  searchForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      sortBy: ['createdAt'],
      ratingFilter: ['']
    });
  }

  ngOnInit(): void {
    // Load initial reviews
    this.loadReviews();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.onSearch());

    this.searchForm.get('sortBy')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onSearch());

    this.searchForm.get('ratingFilter')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onSearch());
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getReviews(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        if (result) {
          this.reviews = result.items || [];
          this.totalCount = result.totalCount || 0;
          this.totalPages = result.totalPages || 0;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reviews', err);
        this.loading = false;
      }
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Get localized filter text
   */
  getFilterText(): string {
    return this.translateService.instant('reviews.filters.filterReviews');
  }

  /**
   * Get localized write review text
   */
  getWriteReviewText(): string {
    return this.translateService.instant('reviews.writeReview');
  }

  /**
   * Get localized no reviews text
   */
  getNoReviewsText(): string {
    return this.translateService.instant('reviews.noReviews');
  }

  /**
   * Get localized no reviews found text
   */
  getNoReviewsFoundText(): string {
    return this.translateService.instant('reviews.noReviewsFound');
  }

  /**
   * Check if current language is RTL
   */
  isRTL(): boolean {
    return this.translateService.isCurrentLanguageRTL();
  }
}
