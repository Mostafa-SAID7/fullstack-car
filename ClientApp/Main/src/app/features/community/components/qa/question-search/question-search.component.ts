import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// QA Types and Services
import { QAQuestionService } from '../../../services/qa-question.service';
import { QuestionList, SearchFilter } from '../../../../../shared/types/qa-api.types';

// QA Components
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { TagCloudComponent } from '../tag-cloud/tag-cloud.component';

@Component({
  selector: 'app-question-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoryFilterComponent,
    TagCloudComponent
  ],
  template: `
    <div class="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      
      <!-- Card 1: Search Header -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <i class="fas fa-search text-primary text-2xl"></i>
          </div>
          <h1 class="text-3xl lg:text-4xl font-black text-foreground uppercase tracking-widest">
            Search Questions & Answers
          </h1>
          <p class="text-muted-foreground font-bold text-sm uppercase tracking-widest">
            Find answers to your questions or discover new knowledge
          </p>
        </div>
      </div>

      <!-- Card 2: Search Form -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5">
        <form [formGroup]="searchForm" class="space-y-6">
          <!-- Main Search Input -->
          <div class="flex flex-col md:flex-row gap-4">
            <div class="relative flex-grow group">
              <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300"></i>
              <input 
                formControlName="searchTerm" 
                type="text" 
                placeholder="Search questions, answers, or topics..."
                class="w-full bg-secondary/30 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-full pl-12 pr-6 py-4 outline-none transition-all text-foreground font-bold">
            </div>
            
            <button 
              type="button" 
              (click)="performSearch()"
              class="px-8 py-4 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-search"></i>
              <span>Search</span>
            </button>
          </div>

          <!-- Quick Filters -->
          <div class="flex flex-wrap gap-2">
            <button 
              *ngFor="let filter of quickFilters" 
              type="button"
              (click)="toggleQuickFilter(filter.value)"
              [ngClass]="isQuickFilterSelected(filter.value) ? 'bg-primary text-white' : 'bg-secondary/50 dark:bg-white/5'"
              class="px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <i class="fas" [ngClass]="filter.icon"></i>
              <span>{{ filter.label }}</span>
            </button>
          </div>

          <!-- Advanced Filters Toggle -->
          <div class="text-center">
            <button 
              type="button" 
              (click)="toggleAdvancedFilters()"
              class="px-6 py-3 bg-secondary/50 dark:bg-white/5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-all flex items-center gap-2 mx-auto">
              <i class="fas" [ngClass]="showAdvancedFilters ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              <span>{{ showAdvancedFilters ? 'Hide' : 'Show' }} Advanced Filters</span>
            </button>
          </div>

          <!-- Advanced Filters Panel -->
          <div *ngIf="showAdvancedFilters" class="space-y-6 pt-6 border-t border-border/50 animate-fade-in">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Category Filter -->
              <app-category-filter
                [selectedCategory]="selectedCategory"
                (categoryChange)="onCategoryChange($event)">
              </app-category-filter>

              <!-- Tag Filter -->
              <app-tag-cloud
                [selectedTags]="selectedTags"
                (tagsChange)="onTagsChange($event)">
              </app-tag-cloud>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Date Range -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Date Range</label>
                <div class="relative">
                  <i class="fas fa-calendar absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                  <select 
                    formControlName="dateRange"
                    class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-12 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                    <option value="">Any time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                    <option value="year">This year</option>
                  </select>
                  <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>
              </div>

              <!-- Sort Options -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Sort By</label>
                <div class="relative">
                  <i class="fas fa-sort absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                  <select 
                    formControlName="sortBy"
                    class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-12 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                    <option value="votes">Most Voted</option>
                    <option value="answers">Most Answered</option>
                    <option value="views">Most Viewed</option>
                  </select>
                  <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>
              </div>
            </div>

            <!-- Filter Actions -->
            <div class="text-center">
              <button 
                type="button" 
                (click)="clearAllFilters()"
                class="px-6 py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-200 dark:hover:bg-red-900/30 transition-all flex items-center gap-2 mx-auto">
                <i class="fas fa-times"></i>
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Card 3: Search Results -->
      <div *ngIf="hasSearched" class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5 min-h-[500px]">
        <!-- Results Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <h2 class="text-xl font-black text-foreground uppercase tracking-widest flex items-center gap-3">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <i class="fas fa-search text-green-600"></i>
            </div>
            Search Results
            <span *ngIf="!loading" class="text-muted-foreground font-normal">
              ({{ totalResults }} {{ totalResults === 1 ? 'result' : 'results' }})
            </span>
          </h2>

          <!-- Search Tabs -->
          <div class="flex gap-2">
            <button 
              *ngFor="let tab of searchTabs; let i = index"
              (click)="onTabChange(i)"
              [ngClass]="activeTabIndex === i ? 'bg-primary text-white' : 'bg-secondary/50 dark:bg-white/5'"
              class="px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <i class="fas" [ngClass]="tab.icon"></i>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <!-- Loading - Skeleton -->
        <div *ngIf="loading" class="space-y-4 animate-pulse">
          <div *ngFor="let i of [1,2,3,4]" class="bg-secondary/20 dark:bg-white/5 rounded-3xl p-6">
            
            <!-- Result Header Skeleton -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="h-6 bg-secondary/30 dark:bg-white/5 rounded-full w-20"></div>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-full w-12"></div>
                <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-full w-16"></div>
              </div>
            </div>

            <!-- Result Content Skeleton -->
            <div class="space-y-3">
              <div class="h-6 bg-secondary/30 dark:bg-white/5 rounded-2xl w-4/5"></div>
              <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-full w-full"></div>
              <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-full w-3/4"></div>
            </div>
            
            <!-- Result Meta Skeleton -->
            <div class="flex flex-wrap items-center gap-4 mt-4">
              <div class="h-3 bg-secondary/30 dark:bg-white/5 rounded-full w-20"></div>
              <div class="h-3 bg-secondary/30 dark:bg-white/5 rounded-full w-16"></div>
              <div class="h-3 bg-secondary/30 dark:bg-white/5 rounded-full w-18"></div>
            </div>
          </div>
        </div>

        <!-- Results List -->
        <div *ngIf="!loading && searchResults.length > 0" class="space-y-4">
          <div 
            *ngFor="let result of searchResults" 
            (click)="navigateToResult(result)"
            class="bg-secondary/20 dark:bg-white/5 rounded-3xl p-6 hover:bg-secondary/30 dark:hover:bg-white/10 transition-all cursor-pointer group">
            
            <!-- Result Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <i class="fas" [ngClass]="getResultIcon(result.type)"></i>
                  <span>{{ result.type }}</span>
                </div>
              </div>
              
              <div class="flex items-center gap-4 text-xs text-muted-foreground font-bold">
                <span class="flex items-center gap-1">
                  <i class="fas fa-thumbs-up"></i>
                  {{ result.score }}
                </span>
                <span *ngIf="result.type === 'Question'" class="flex items-center gap-1">
                  <i class="fas fa-comments"></i>
                  {{ result.answerCount }}
                </span>
              </div>
            </div>

            <!-- Result Content -->
            <h3 class="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
              {{ result.title }}
            </h3>
            <p class="text-muted-foreground text-sm mb-4 line-clamp-2" [innerHTML]="result.excerpt"></p>
            
            <!-- Result Meta -->
            <div class="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-bold">
              <span class="flex items-center gap-1">
                <i class="fas fa-folder"></i>
                {{ result.category }}
              </span>
              <span class="flex items-center gap-1">
                <i class="fas fa-user"></i>
                {{ result.author }}
              </span>
              <span class="flex items-center gap-1">
                <i class="fas fa-clock"></i>
                {{ formatDate(result.createdAt) }}
              </span>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div *ngIf="!loading && searchResults.length === 0" class="py-24 text-center">
          <div class="w-20 h-20 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <i class="fas fa-search text-3xl text-muted-foreground/30"></i>
          </div>
          <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">No results found</h3>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest">Try adjusting your search terms or filters</p>
        </div>
      </div>

      <!-- Card 4: Popular Searches (when no search performed) -->
      <div *ngIf="!hasSearched" class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5">
        <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
          <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
            <i class="fas fa-fire text-yellow-600"></i>
          </div>
          Popular Searches
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            *ngFor="let suggestion of popularSearches" 
            (click)="applySuggestion(suggestion)"
            class="p-4 bg-secondary/20 dark:bg-white/5 rounded-3xl hover:bg-secondary/30 dark:hover:bg-white/10 transition-all text-left group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <i class="fas text-primary" [ngClass]="suggestion.icon"></i>
              </div>
              <span class="font-bold text-foreground group-hover:text-primary transition-colors">{{ suggestion.text }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class QuestionSearchComponent implements OnInit {
  private destroy$ = new Subject<void>();
  
  searchForm!: FormGroup;
  loading = false;
  error: string | null = null;
  hasSearched = false;
  showAdvancedFilters = false;
  
  // Search state
  selectedCategory = '';
  selectedTags: string[] = [];
  searchResults: any[] = [];
  totalResults = 0;
  activeTabIndex = 0;

  quickFilters = [
    { value: 'unanswered', label: 'Unanswered', icon: 'fa-help-circle' },
    { value: 'answered', label: 'Answered', icon: 'fa-check-circle' },
    { value: 'recent', label: 'Recent', icon: 'fa-clock' },
    { value: 'popular', label: 'Popular', icon: 'fa-trending-up' }
  ];

  searchTabs = [
    { label: 'All', icon: 'fa-list' },
    { label: 'Questions', icon: 'fa-question-circle' },
    { label: 'Answers', icon: 'fa-comments' }
  ];

  popularSearches = [
    { text: 'JavaScript async/await', icon: 'fa-code' },
    { text: 'React hooks', icon: 'fa-react' },
    { text: 'SQL joins', icon: 'fa-database' },
    { text: 'Docker containers', icon: 'fa-docker' },
    { text: 'Python pandas', icon: 'fa-python' },
    { text: 'Git merge conflicts', icon: 'fa-git-alt' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private qaQuestionService: QAQuestionService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      dateRange: [''],
      sortBy: ['relevance']
    });
  }

  private setupFormSubscriptions(): void {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (this.searchForm.get('searchTerm')?.value?.length > 2) {
          this.performSearch();
        }
      });
  }

  performSearch(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (!searchTerm || searchTerm.length < 2) return;

    this.loading = true;
    this.hasSearched = true;
    this.error = null;

    const searchFilter: SearchFilter = {
      searchTerm: searchTerm,
      categories: this.selectedCategory ? [this.selectedCategory] : undefined,
      tags: this.selectedTags.length > 0 ? this.selectedTags : undefined,
      sortBy: this.searchForm.get('sortBy')?.value || 'relevance',
      pageNumber: 1,
      pageSize: 10
    };

    this.qaQuestionService.searchQuestions(searchFilter)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.error = error.message || 'Search failed';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response?.succeeded && response.data) {
          this.searchResults = this.convertToSearchResults(response.data.items);
          this.totalResults = response.data.totalCount;
        } else {
          // Fallback to mock results
          this.searchResults = this.getMockSearchResults();
          this.totalResults = this.searchResults.length;
        }
        this.loading = false;
      });
  }

  private convertToSearchResults(questions: any[]): any[] {
    return questions.map(q => ({
      id: q.id,
      type: 'Question',
      title: q.title,
      excerpt: q.title, // Since QuestionList doesn't have content
      category: q.category,
      author: q.userName,
      score: q.voteScore,
      answerCount: q.answerCount,
      createdAt: q.createdAt
    }));
  }

  private getMockSearchResults(): any[] {
    const searchTerm = this.searchForm.get('searchTerm')?.value?.toLowerCase() || '';
    
    const mockResults = [
      {
        id: '1',
        type: 'Question',
        title: 'How to use async/await in JavaScript?',
        excerpt: 'I\'m trying to understand how to properly use async/await syntax in modern JavaScript applications...',
        category: 'Web Development',
        author: 'john_doe',
        score: 15,
        answerCount: 3,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'Question',
        title: 'Best practices for React state management?',
        excerpt: 'What are the current best practices for managing state in large React applications? Should I use Redux or Context API?',
        category: 'Web Development',
        author: 'jane_smith',
        score: 23,
        answerCount: 5,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'Question',
        title: 'SQL Server performance optimization tips?',
        excerpt: 'My queries are running slowly on SQL Server. What are some optimization techniques I can apply?',
        category: 'Database Design',
        author: 'db_expert',
        score: 18,
        answerCount: 4,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Filter results based on search term
    return mockResults.filter(result => 
      result.title.toLowerCase().includes(searchTerm) ||
      result.excerpt.toLowerCase().includes(searchTerm) ||
      result.category.toLowerCase().includes(searchTerm)
    );
  }

  // Event handlers
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  toggleQuickFilter(value: string): void {
    // Implement quick filter logic
    console.log('Toggle quick filter:', value);
  }

  isQuickFilterSelected(value: string): boolean {
    return false; // Implement logic
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    if (this.hasSearched) {
      this.performSearch();
    }
  }

  onTagsChange(tags: string[]): void {
    this.selectedTags = tags;
    if (this.hasSearched) {
      this.performSearch();
    }
  }

  onTabChange(index: number): void {
    this.activeTabIndex = index;
    this.performSearch();
  }

  clearAllFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      dateRange: '',
      sortBy: 'relevance'
    });
    this.selectedCategory = '';
    this.selectedTags = [];
  }

  applySuggestion(suggestion: any): void {
    this.searchForm.patchValue({ searchTerm: suggestion.text });
    this.performSearch();
  }

  navigateToResult(result: any): void {
    if (result.type === 'Question') {
      this.router.navigate(['/community/qa', result.id]);
    }
  }

  getResultIcon(type: string): string {
    return type === 'Question' ? 'fa-question-circle' : 'fa-comments';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  }
}