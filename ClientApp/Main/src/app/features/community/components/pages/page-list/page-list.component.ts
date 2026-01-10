import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
    selector: 'app-page-list',
    standalone: true,
    imports: [CommonModule, TranslateModule, PaginationComponent, ReactiveFormsModule],
    template: `
    <div class="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      
      <!-- Card 1: Search & Actions -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <form [formGroup]="searchForm" class="flex flex-col md:flex-row gap-4 mb-0">
          <!-- Search Input -->
          <div class="relative flex-grow group">
            <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300"></i>
            <input formControlName="searchTerm" type="text" placeholder="Search pages..."
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
              <span>Create Page</span>
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
                  <option value="name">Name A-Z</option>
                  <option value="likes">Most Liked</option>
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
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="aspect-video bg-secondary/30 dark:bg-white/5 rounded-3xl animate-pulse"></div>
        </div>

        <!-- Grid -->
        <div *ngIf="!loading && pages.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let page of pages" class="bg-secondary/10 dark:bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/5 overflow-hidden hover:scale-[1.02] transition-all cursor-pointer">
            <div class="aspect-video bg-primary/20 flex items-center justify-center">
              <i class="fas fa-image text-3xl text-primary/30"></i>
            </div>
            <div class="p-4">
              <h3 class="font-black uppercase text-sm tracking-widest text-foreground">{{page.name}}</h3>
              <p class="text-[10px] font-bold text-muted-foreground uppercase mt-1">Official Page</p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && pages.length === 0" class="py-24 text-center">
          <div class="w-20 h-20 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <i class="fas fa-file-contract text-3xl text-muted-foreground/30"></i>
          </div>
          <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">No pages found</h3>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest">Discover official automotive pages in the community!</p>
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
export class PageListComponent implements OnInit {
    pages: any[] = [];
    loading = false;
    currentPage = 1;
    pageSize = 12;
    totalCount = 0;
    totalPages = 0;
    showFilters = false;
    searchForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.searchForm = this.fb.group({
            searchTerm: [''],
            sortBy: ['name']
        });
    }

    ngOnInit(): void {
        this.loadPages();
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
        this.loadPages();
    }

    loadPages(): void {
        this.loading = true;
        // Mocking for now to show the standardized layout
        setTimeout(() => {
            this.pages = [
                { id: '1', name: 'BMW Enthusiasts Egypt' },
                { id: '2', name: 'Mercedes-Benz Owners' },
                { id: '3', name: 'Classic Car Restoration' },
                { id: '4', name: 'Off-Road Adventures' }
            ];
            this.totalCount = 4;
            this.totalPages = 1;
            this.loading = false;
        }, 500);
    }

    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadPages();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
