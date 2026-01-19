import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Shared Components (reusing existing)
// No longer using ListViewComponent - using custom pagination

// QA Types and Services
import { QAQuestionService } from '../../services/qa-question.service';
import { QuestionList, QuestionFilter, PaginatedResponse } from '../../models/qa-api.types';

// QA Components
import { CategoryFilterComponent } from '../../components/category-filter/category-filter.component';
import { TagCloudComponent } from '../../components/tag-cloud/tag-cloud.component';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CategoryFilterComponent,
    TagCloudComponent
  ],
  templateUrl: './question-list.component.html'
})
export class QuestionListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  // Make Math available in template
  Math = Math;

  // Form and filters
  searchForm!: FormGroup;
  showFilters = false;
  selectedCategory = '';
  selectedTags: string[] = [];

  // Data and state
  questions: QuestionList[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Sort options
  sortOptions = [
    { value: 'createdAt', label: 'Newest First', icon: 'clock' },
    { value: 'voteScore', label: 'Most Voted', icon: 'thumbs-up' },
    { value: 'answerCount', label: 'Most Answered', icon: 'comments' },
    { value: 'viewCount', label: 'Most Viewed', icon: 'eye' },
    { value: 'lastActivityAt', label: 'Recent Activity', icon: 'history' }
  ];

  // Filter tabs
  filterTabs = [
    { value: 'all', label: 'All Questions', icon: 'list' },
    { value: 'unanswered', label: 'Unanswered', icon: 'question-circle' },
    { value: 'answered', label: 'Answered', icon: 'check-circle' },
    { value: 'closed', label: 'Closed', icon: 'lock' }
  ];

  activeTab = 'all';
  activeTabIndex = 0;

  constructor(
    private qaQuestionService: QAQuestionService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupFormSubscriptions();
    this.loadQuestions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      sortBy: ['createdAt'],
      sortDirection: ['desc'],
      category: [''],
      status: ['all']
    });
  }

  private setupFormSubscriptions(): void {
    // Combine form changes with refresh trigger
    const formChanges$ = this.searchForm.valueChanges.pipe(
      startWith(this.searchForm.value),
      debounceTime(300),
      distinctUntilChanged()
    );

    combineLatest([formChanges$, this.refreshTrigger$])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.loadQuestionsData()),
        catchError(error => {
          this.error = error.message || 'Failed to load questions';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response?.succeeded && response.data) {
          this.questions = response.data.items;
          this.updatePagination(response.data);
          this.error = null;
        }
        this.loading = false;
      });
  }

  private loadQuestionsData() {
    this.loading = true;
    this.error = null;

    const formValue = this.searchForm.value;
    const filter: QuestionFilter = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: formValue.searchTerm || undefined,
      sortBy: formValue.sortBy,
      sortDirection: formValue.sortDirection,
      category: this.selectedCategory || undefined,
      tags: this.selectedTags.length > 0 ? this.selectedTags : undefined,
      status: this.getStatusFilter(this.activeTab)
    };

    return this.qaQuestionService.getQuestions(filter);
  }

  private getStatusFilter(tab: string): QuestionFilter['status'] {
    switch (tab) {
      case 'unanswered': return 'unanswered';
      case 'answered': return 'answered';
      case 'closed': return 'closed';
      default: return undefined;
    }
  }

  private updatePagination(data: PaginatedResponse<QuestionList>): void {
    this.totalItems = data.totalCount;
    this.totalPages = data.totalPages;
    this.currentPage = data.pageNumber;
  }

  // Event handlers
  loadQuestions(): void {
    this.refreshTrigger$.next();
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
    this.activeTabIndex = this.filterTabs.findIndex(t => t.value === tab);
    this.currentPage = 1;
    this.loadQuestions();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadQuestions();
  }

  onTagsChange(tags: string[]): void {
    this.selectedTags = tags;
    this.currentPage = 1;
    this.loadQuestions();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadQuestions();
    // Scroll to top smoothly (reusing existing pattern)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onRetry(): void {
    this.loadQuestions();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      sortBy: 'createdAt',
      sortDirection: 'desc',
      category: '',
      status: 'all'
    });
    this.selectedCategory = '';
    this.selectedTags = [];
    this.activeTab = 'all';
    this.currentPage = 1;
    this.loadQuestions();
  }

  navigateToAskQuestion(): void {
    this.router.navigate(['/community/qa/ask']);
  }

  navigateToQuestion(question: QuestionList): void {
    this.router.navigate(['/community/qa', question.id]);
  }

  // Utility methods for template
  getQuestionUrl(question: QuestionList): string {
    return `/community/qa/${question.id}`;
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

  getStatusColor(question: QuestionList): string {
    if (question.isClosed) return 'text-red-500';
    if (question.hasAcceptedAnswer) return 'text-green-500';
    if (question.answerCount > 0) return 'text-blue-500';
    return 'text-gray-500';
  }

  getStatusIcon(question: QuestionList): string {
    if (question.isClosed) return 'lock';
    if (question.hasAcceptedAnswer) return 'check_circle';
    if (question.answerCount > 0) return 'question_answer';
    return 'help_outline';
  }

  getTabIcon(tabValue: string): string {
    const tab = this.filterTabs.find(t => t.value === tabValue);
    return tab ? `fa-${tab.icon.replace('_', '-')}` : 'fa-list';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}