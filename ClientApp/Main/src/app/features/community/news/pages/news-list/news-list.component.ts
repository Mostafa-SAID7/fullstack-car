import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewsService, NewsFilters } from '../../services/news.service';
import { Article } from '../../../../../core/models/news.model';
import { NewsCardComponent } from '../news-card/news-card.component';
import { PaginationComponent } from '@shared/components/ui/pagination/pagination.component';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, NewsCardComponent, PaginationComponent, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      
      <!-- Card 1: Search & Actions -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <form [formGroup]="searchForm" class="flex flex-col md:flex-row gap-4 mb-0">
          <!-- Search Input -->
          <div class="relative flex-grow group">
            <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300"></i>
            <input formControlName="searchTerm" type="text" [placeholder]="'search.placeholder' | translate"
              class="w-full bg-secondary/30 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-full pl-12 pr-6 py-4 outline-none transition-all text-foreground font-bold">
          </div>

          <!-- Filter Actions -->
          <div class="flex gap-2">
            <button type="button" (click)="toggleFilters()"
              [ngClass]="showFilters ? 'bg-primary text-white' : 'bg-secondary dark:bg-white/5'"
              class="px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-sliders-h"></i>
              <span>{{ 'filters.title' | translate }}</span>
            </button>
          </div>
        </form>

        <!-- Collapsible Filters -->
        <div *ngIf="showFilters" class="pt-6 animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">{{ 'filters.sortBy' | translate }}</label>
              <div class="relative">
                <i class="fas fa-sort absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="sortBy"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option value="createdAt">{{ 'filters.date' | translate }}</option>
                  <option value="views">{{ 'filters.popularity' | translate }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
            
            <!-- Category Filter -->
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">{{ 'categories.title' | translate }}</label>
              <div class="relative">
                <i class="fas fa-tags absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="category"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option value="">{{ 'categories.all' | translate }}</option>
                  <option value="automotive">{{ 'categories.automotive' | translate }}</option>
                  <option value="technology">{{ 'categories.technology' | translate }}</option>
                  <option value="business">{{ 'categories.business' | translate }}</option>
                  <option value="sports">{{ 'categories.sports' | translate }}</option>
                  <option value="entertainment">{{ 'categories.entertainment' | translate }}</option>
                  <option value="health">{{ 'categories.health' | translate }}</option>
                  <option value="science">{{ 'categories.science' | translate }}</option>
                  <option value="politics">{{ 'categories.politics' | translate }}</option>
                  <option value="lifestyle">{{ 'categories.lifestyle' | translate }}</option>
                  <option value="travel">{{ 'categories.travel' | translate }}</option>
                  <option value="education">{{ 'categories.education' | translate }}</option>
                  <option value="environment">{{ 'categories.environment' | translate }}</option>
                  <option value="local">{{ 'categories.local' | translate }}</option>
                  <option value="international">{{ 'categories.international' | translate }}</option>
                  <option value="breaking">{{ 'categories.breaking' | translate }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
          </div>
          
          <!-- Filter Actions -->
          <div class="flex gap-3 mt-6">
            <button type="button" (click)="applyFilters()"
              class="px-6 py-3 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
              {{ 'filters.applyFilters' | translate }}
            </button>
            <button type="button" (click)="clearFilters()"
              class="px-6 py-3 bg-secondary dark:bg-white/5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
              {{ 'filters.clearFilters' | translate }}
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2: Content Grid -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5 min-h-[500px]">
        <!-- Loading -->
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="h-[400px] rounded-[2rem] bg-secondary/30 dark:bg-white/5 animate-pulse"></div>
        </div>

        <!-- Grid -->
        <div *ngIf="!loading && articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-news-card *ngFor="let article of articles" [article]="article"></app-news-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && articles.length === 0" class="py-24 text-center">
          <div class="w-20 h-20 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <i class="fas fa-newspaper text-3xl text-muted-foreground/30"></i>
          </div>
          <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">{{ 'news.noNews' | translate }}</h3>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest">{{ 'news.refresh' | translate }}</p>
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
export class NewsListComponent implements OnInit {
  articles: Article[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 12;
  totalCount = 0;
  totalPages = 0;
  showFilters = false;
  searchForm: FormGroup;

  constructor(
    private newsService: NewsService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      sortBy: ['createdAt'],
      category: ['']
    });
  }

  ngOnInit(): void {
    this.loadNews();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.onSearch());

    this.searchForm.get('sortBy')?.valueChanges.subscribe(() => this.onSearch());
    this.searchForm.get('category')?.valueChanges.subscribe(() => this.onSearch());
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadNews();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadNews();
  }

  clearFilters(): void {
    this.searchForm.patchValue({
      searchTerm: '',
      sortBy: 'createdAt',
      category: ''
    });
    this.currentPage = 1;
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;

    const filters: NewsFilters = {
      searchTerm: this.searchForm.get('searchTerm')?.value || undefined,
      category: this.searchForm.get('category')?.value || undefined,
      sortBy: this.searchForm.get('sortBy')?.value || undefined
    };

    this.newsService.getArticles(this.currentPage, this.pageSize, filters).subscribe({
      next: (result) => {
        this.articles = result.items;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this.currentPage = result.pageNumber;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
