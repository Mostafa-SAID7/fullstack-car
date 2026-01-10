import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { Review } from '../../../../../core/models/review.model';
import { ReviewService } from '../../../services/review.service';
import { ReviewItemComponent } from '../review-item/review-item.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

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
            <input formControlName="searchTerm" type="text" placeholder="Search reviews..."
              class="w-full bg-secondary/30 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-full pl-12 pr-6 py-4 outline-none transition-all text-foreground font-bold">
          </div>

          <!-- Filter Actions -->
          <div class="flex gap-2">
            <button type="button" (click)="toggleFilters()"
              [ngClass]="showFilters ? 'bg-primary text-white' : 'bg-secondary dark:bg-white/5'"
              class="px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-sliders-h"></i>
              <span>Filters</span>
            </button>

            <button type="button"
              class="px-8 py-4 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-plus"></i>
              <span>Write Review</span>
            </button>
          </div>
        </form>

        <!-- Collapsible Filters -->
        <div *ngIf="showFilters" class="pt-6 animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">Sort By</label>
              <div class="relative">
                <i class="fas fa-sort absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="sortBy"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option value="createdAt">Newest First</option>
                  <option value="rating">Highest Rated</option>
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
          <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">No reviews found</h3>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest">Be the first to share your experience!</p>
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
export class ReviewListComponent implements OnInit {
  reviews: Review[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  showFilters = false;
  searchForm: FormGroup;

  constructor(private reviewService: ReviewService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      sortBy: ['createdAt']
    });
  }

  ngOnInit(): void {
    this.loadReviews();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.onSearch());

    this.searchForm.get('sortBy')?.valueChanges.subscribe(() => this.onSearch());
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
}
