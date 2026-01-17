import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { GuidesService } from '../../../services/guides.service';
import {
  GuideListItem,
  GuideFilters,
  GuideCategory,
  GuideDifficulty
} from '../../../models/guide.model';
import { PaginatedResult } from '../../../../../core/models/pagination.model';
import { PaginationComponent } from '@shared/components/ui/pagination/pagination.component';
import { GuideCardComponent } from '../guide-card/guide-card.component';

@Component({
  selector: 'app-guides-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TranslateModule, PaginationComponent, GuideCardComponent],
  template: `
    <div class="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      
      <!-- Card 1: Search & Actions -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <form [formGroup]="searchForm" class="flex flex-col md:flex-row gap-4 mb-0">
          <!-- Search Input -->
          <div class="relative flex-grow group">
            <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300"></i>
            <input formControlName="searchTerm" type="text" [placeholder]="'guides.search.searchGuides' | translate"
              class="w-full bg-secondary/30 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-full pl-12 pr-6 py-4 outline-none transition-all text-foreground font-bold">
          </div>

          <!-- Filter Actions -->
          <div class="flex gap-2">
            <button type="button" (click)="toggleFilters()"
              [ngClass]="showFilters ? 'bg-primary text-white' : 'bg-secondary dark:bg-white/5'"
              class="px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-sliders-h"></i>
              <span>{{ 'guides.search.searchFilters' | translate }}</span>
            </button>

            <button type="button" routerLink="/community/guides/create"
              class="px-8 py-4 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-plus"></i>
              <span>{{ 'guides.creation.createGuide' | translate }}</span>
            </button>
          </div>
        </form>

        <!-- Collapsible Filters -->
        <div *ngIf="showFilters" class="pt-6 animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Category -->
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">{{ 'guides.creation.category' | translate }}</label>
              <div class="relative">
                <i class="fas fa-layer-group absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="category"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option [ngValue]="undefined">{{ 'guides.categories.allCategories' | translate }}</option>
                  <option *ngFor="let category of categories" [ngValue]="category.value">{{ category.name }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>

            <!-- Difficulty -->
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">{{ 'guides.creation.difficulty' | translate }}</label>
              <div class="relative">
                <i class="fas fa-gauge-high absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="difficulty"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option [ngValue]="undefined">{{ 'guides.difficulty.selectDifficulty' | translate }}</option>
                  <option *ngFor="let difficulty of difficulties" [ngValue]="difficulty.value">{{ difficulty.name }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-none"></i>
              </div>
            </div>

            <!-- Sort By -->
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">{{ 'guides.search.sortBy' | translate }}</label>
              <div class="relative">
                <i class="fas fa-sort absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="sortBy"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option *ngFor="let option of sortOptions" [value]="option.value">{{ option.label | translate }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>

            <!-- Featured Toggle -->
            <div class="flex flex-col justify-end pb-2">
              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative">
                  <input type="checkbox" formControlName="isFeatured" class="sr-only peer">
                  <div class="w-10 h-6 bg-slate-200 dark:bg-white/10 rounded-full peer-checked:bg-primary transition-all"></div>
                  <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4"></div>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-foreground opacity-70 group-hover:opacity-100 transition-opacity">{{ 'guides.search.featured' | translate }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-primary"></i>
        <p class="mt-4 text-foreground/60">{{ 'common.loading' | translate }}</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
        <i class="fas fa-exclamation-circle text-3xl text-red-600 dark:text-red-400 mb-3"></i>
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
        <button (click)="loadGuides()" class="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
          {{ 'common.retry' | translate }}
        </button>
      </div>

      <!-- Guides Grid -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <app-guide-card 
          *ngFor="let guide of guides" 
          [guide]="guide"
          (bookmarkClick)="onBookmarkGuide($event)">
        </app-guide-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !error && guides.length === 0" class="text-center py-12">
        <i class="fas fa-book-open text-6xl text-slate-300 dark:text-slate-700 mb-4"></i>
        <h3 class="text-xl font-bold text-foreground mb-2">{{ 'guides.guides.noGuidesFound' | translate }}</h3>
        <button routerLink="/community/guides/create" class="mt-4 px-6 py-3 bg-primary text-white rounded-full hover:scale-105 transition-transform">
          {{ 'guides.creation.createGuide' | translate }}
        </button>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && !error && guides.length > 0" class="flex justify-center mt-8">
        <app-pagination
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          [totalItems]="totalCount"
          (pageChange)="onPageChange($event)">
        </app-pagination>
      </div>
    </div>
  `,
})
export class GuidesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  guides: GuideListItem[] = [];
  loading = false;
  error: string | null = null;

  currentPage = 1;
  pageSize = 12;
  totalCount = 0;
  totalPages = 0;
  showFilters = false;
  searchForm: FormGroup;

  // Options
  categories: { value: number; name: string }[] = [];
  difficulties: { value: number; name: string }[] = [];
  sortOptions = [
    { value: 'CreatedAt', label: 'guides.search.newest' },
    { value: 'Title', label: 'guides.search.relevance' },
    { value: 'ViewCount', label: 'guides.search.mostPopular' },
    { value: 'Rating', label: 'guides.search.highestRated' },
    { value: 'LikeCount', label: 'guides.search.mostCompleted' }
  ];

  constructor(
    private guidesService: GuidesService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      category: [undefined],
      difficulty: [undefined],
      sortBy: ['CreatedAt'],
      isFeatured: [false]
    });
  }

  ngOnInit(): void {
    this.loadOptions();
    this.loadGuides();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadGuides();
      });
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

    const formValue = this.searchForm.value;
    const filters: GuideFilters = {
      page: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: formValue.searchTerm || undefined,
      category: formValue.category,
      difficulty: formValue.difficulty,
      sortBy: formValue.sortBy,
      isFeatured: formValue.isFeatured || undefined,
      sortDescending: true
    };

    this.guidesService.getGuides(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: PaginatedResult<GuideListItem>) => {
          this.guides = result.items;
          this.totalCount = result.totalCount;
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadGuides();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
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
    this.searchForm.reset({
      searchTerm: '',
      category: undefined,
      difficulty: undefined,
      sortBy: 'CreatedAt',
      isFeatured: false
    });
  }
}
