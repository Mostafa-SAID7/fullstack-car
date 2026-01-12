import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Shared Components
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '../../../../shared/components/error-display/error-display.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

// QA Components
import { QACategoryFilterComponent } from '../qa-category-filter/qa-category-filter.component';
import { QATagCloudComponent } from '../qa-tag-cloud/qa-tag-cloud.component';
import { SimilarQuestionsComponent } from '../similar-questions/similar-questions.component';

// QA Types and Services
import { QASearchService } from '../../../community/services/qa-search.service';
import { QuestionList, SearchFilter, PaginatedResponse } from '../../../../shared/types/qa-api.types';

interface SearchResult {
  id: string;
  type: 'Question' | 'Answer';
  title: string;
  excerpt: string;
  category: string;
  author: string;
  score: number;
  answerCount?: number;
  createdAt: string;
  tags: string[];
}

@Component({
  selector: 'app-qa-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    FormInputComponent,
    LoadingSpinnerComponent,
    ErrorDisplayComponent,
    PaginationComponent,
    QACategoryFilterComponent,
    QATagCloudComponent,
    SimilarQuestionsComponent
  ],
  templateUrl: './qa-search.component.html',
  styleUrls: ['./qa-search.component.scss']
})
export class QASearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Make Math available in template
  Math = Math;
  
  searchForm!: FormGroup;
  loading = false;
  error: string | null = null;
  hasSearched = false;
  showAdvancedFilters = false;
  
  // Search state
  selectedCategory = '';
  selectedTags: string[] = [];
  searchResults: SearchResult[] = [];
  totalResults = 0;
  currentPage = 1;
  pageSize = 10;
  activeTabIndex = 0;

  // Quick filters for common search patterns
  quickFilters = [
    { value: 'unanswered', label: 'Unanswered', icon: 'help_outline', active: false },
    { value: 'answered', label: 'Answered', icon: 'check_circle', active: false },
    { value: 'recent', label: 'Recent', icon: 'schedule', active: false },
    { value: 'popular', label: 'Popular', icon: 'trending_up', active: false }
  ];

  // Search result tabs
  searchTabs = [
    { label: 'All', icon: 'list', count: 0 },
    { label: 'Questions', icon: 'help_outline', count: 0 },
    { label: 'Answers', icon: 'chat_bubble_outline', count: 0 }
  ];

  // Popular search suggestions
  popularSearches = [
    { text: 'JavaScript async/await', icon: 'code', category: 'Web Development' },
    { text: 'React hooks best practices', icon: 'web', category: 'Web Development' },
    { text: 'SQL query optimization', icon: 'storage', category: 'Database Design' },
    { text: 'Docker container setup', icon: 'developer_board', category: 'DevOps & Cloud' },
    { text: 'Python data analysis', icon: 'analytics', category: 'Data Science' },
    { text: 'Git merge conflicts', icon: 'merge_type', category: 'DevOps & Cloud' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private qaSearchService: QASearchService
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
      sortBy: ['relevance'],
      minVoteScore: [null],
      hasAcceptedAnswer: [null]
    });
  }

  private setupFormSubscriptions(): void {
    // Auto-search on search term changes with debounce
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        if (searchTerm && searchTerm.length > 2) {
          this.performSearch();
        } else if (searchTerm === '') {
          this.clearSearch();
        }
      });

    // Auto-search on other form changes
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300)
      )
      .subscribe(() => {
        if (this.hasSearched && this.searchForm.get('searchTerm')?.value) {
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
      searchTerm: searchTerm.trim(),
      categories: this.selectedCategory ? [this.selectedCategory] : undefined,
      tags: this.selectedTags.length > 0 ? this.selectedTags : undefined,
      sortBy: this.searchForm.get('sortBy')?.value || 'relevance',
      sortDirection: 'desc',
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      minVoteScore: this.searchForm.get('minVoteScore')?.value,
      hasAcceptedAnswer: this.searchForm.get('hasAcceptedAnswer')?.value,
      includeContent: true,
      includeTags: true,
      includeUserInfo: true
    };

    // Apply date range filter
    const dateRange = this.searchForm.get('dateRange')?.value;
    if (dateRange) {
      const dates = this.getDateRangeFilter(dateRange);
      searchFilter.dateFrom = dates.from;
      searchFilter.dateTo = dates.to;
    }

    // Apply content type filter based on active tab
    if (this.activeTabIndex === 1) {
      searchFilter.contentTypes = ['Question'];
    } else if (this.activeTabIndex === 2) {
      searchFilter.contentTypes = ['Answer'];
    }

    this.qaSearchService.searchQuestions(searchFilter)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.error = error.message || 'Search failed. Please try again.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response?.succeeded && response.data) {
          this.searchResults = this.convertToSearchResults(response.data.items);
          this.totalResults = response.data.totalCount;
          this.updateTabCounts();
        } else {
          this.searchResults = [];
          this.totalResults = 0;
        }
        this.loading = false;
      });
  }

  private convertToSearchResults(questions: QuestionList[]): SearchResult[] {
    return questions.map(q => ({
      id: q.id,
      type: 'Question' as const,
      title: q.title,
      excerpt: this.truncateText(q.title, 150), // Use title as excerpt since QuestionList doesn't have content
      category: q.category,
      author: q.userName,
      score: q.voteScore,
      answerCount: q.answerCount,
      createdAt: q.createdAt,
      tags: q.tags
    }));
  }

  private updateTabCounts(): void {
    this.searchTabs[0].count = this.totalResults;
    this.searchTabs[1].count = this.searchResults.filter(r => r.type === 'Question').length;
    this.searchTabs[2].count = this.searchResults.filter(r => r.type === 'Answer').length;
  }

  private getDateRangeFilter(range: string): { from?: string; to?: string } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'today':
        return { from: today.toISOString() };
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { from: weekAgo.toISOString() };
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return { from: monthAgo.toISOString() };
      case 'year':
        const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        return { from: yearAgo.toISOString() };
      default:
        return {};
    }
  }

  // Event handlers
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  toggleQuickFilter(value: string): void {
    const filter = this.quickFilters.find(f => f.value === value);
    if (filter) {
      // Reset all other quick filters
      this.quickFilters.forEach(f => f.active = false);
      filter.active = !filter.active;

      // Apply the filter logic
      switch (value) {
        case 'unanswered':
          this.searchForm.patchValue({ hasAcceptedAnswer: false });
          break;
        case 'answered':
          this.searchForm.patchValue({ hasAcceptedAnswer: true });
          break;
        case 'recent':
          this.searchForm.patchValue({ sortBy: 'newest', dateRange: 'week' });
          break;
        case 'popular':
          this.searchForm.patchValue({ sortBy: 'votes', minVoteScore: 5 });
          break;
      }

      if (this.hasSearched) {
        this.performSearch();
      }
    }
  }

  isQuickFilterSelected(value: string): boolean {
    return this.quickFilters.find(f => f.value === value)?.active || false;
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    if (this.hasSearched) {
      this.currentPage = 1; // Reset to first page
      this.performSearch();
    }
  }

  onTagsChange(tags: string[]): void {
    this.selectedTags = tags;
    if (this.hasSearched) {
      this.currentPage = 1; // Reset to first page
      this.performSearch();
    }
  }

  onTabChange(index: number): void {
    this.activeTabIndex = index;
    this.currentPage = 1; // Reset to first page
    if (this.hasSearched) {
      this.performSearch();
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.performSearch();
  }

  clearSearch(): void {
    this.hasSearched = false;
    this.searchResults = [];
    this.totalResults = 0;
    this.error = null;
  }

  clearAllFilters(): void {
    this.searchForm.reset({
      searchTerm: this.searchForm.get('searchTerm')?.value || '',
      dateRange: '',
      sortBy: 'relevance',
      minVoteScore: null,
      hasAcceptedAnswer: null
    });
    this.selectedCategory = '';
    this.selectedTags = [];
    this.quickFilters.forEach(f => f.active = false);
    this.currentPage = 1;
    
    if (this.hasSearched) {
      this.performSearch();
    }
  }

  applySuggestion(suggestion: any): void {
    this.searchForm.patchValue({ searchTerm: suggestion.text });
    if (suggestion.category) {
      this.selectedCategory = suggestion.category;
    }
    this.performSearch();
  }

  navigateToResult(result: SearchResult): void {
    if (result.type === 'Question') {
      this.router.navigate(['/community/qa/questions', result.id]);
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
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

  // Getters for template
  get paginationConfig() {
    return {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      totalItems: this.totalResults,
      totalPages: Math.ceil(this.totalResults / this.pageSize)
    };
  }

  get hasActiveFilters(): boolean {
    return this.selectedCategory !== '' || 
           this.selectedTags.length > 0 || 
           this.quickFilters.some(f => f.active) ||
           this.searchForm.get('dateRange')?.value ||
           this.searchForm.get('minVoteScore')?.value ||
           this.searchForm.get('hasAcceptedAnswer')?.value !== null;
  }

  trackByFn(index: number, item: SearchResult): string {
    return item.id;
  }
}