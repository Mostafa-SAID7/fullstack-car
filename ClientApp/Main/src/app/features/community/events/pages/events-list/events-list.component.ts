import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services and Models
import { EventsService } from '../../services/events.service';
import { EventSummaryDto, EventFilter, EventsPagedResponse, EventCategoryDto } from '../../models/event-api.types';

// Components
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventFiltersComponent } from '../../components/event-filters/event-filters.component';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    EventCardComponent,
    EventFiltersComponent
  ],
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  // Make Math available in template
  Math = Math;

  // Form and filters
  searchForm!: FormGroup;
  showFilters = false;
  selectedCategory = '';
  selectedEventType = '';
  selectedLocation = '';

  // Data and state
  events: EventSummaryDto[] = [];
  categories: EventCategoryDto[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;

  // Filter tabs
  filterTabs = [
    { value: 'all', label: 'All Events', icon: 'event' },
    { value: 'upcoming', label: 'Upcoming', icon: 'schedule' },
    { value: 'today', label: 'Today', icon: 'today' },
    { value: 'this_week', label: 'This Week', icon: 'date_range' },
    { value: 'free', label: 'Free Events', icon: 'money_off' },
    { value: 'online', label: 'Online', icon: 'computer' }
  ];

  // Sort options
  sortOptions = [
    { value: 'startDate', label: 'Date (Earliest First)', icon: 'schedule' },
    { value: 'startDate_desc', label: 'Date (Latest First)', icon: 'schedule' },
    { value: 'title', label: 'Title (A-Z)', icon: 'sort_by_alpha' },
    { value: 'attendeeCount_desc', label: 'Most Popular', icon: 'people' },
    { value: 'createdAt_desc', label: 'Recently Added', icon: 'fiber_new' }
  ];

  activeTab = 'all';
  activeTabIndex = 0;

  constructor(
    private eventsService: EventsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.setupFormSubscriptions();
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      sortBy: ['startDate'],
      category: [''],
      eventType: [''],
      location: [''],
      isOnline: [null],
      isFree: [null]
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
        switchMap(() => this.loadEventsData()),
        catchError(error => {
          this.error = error.message || 'Failed to load events';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response?.succeeded && response.data) {
          this.events = response.data.items;
          this.updatePagination(response.data);
          this.error = null;
        }
        this.loading = false;
      });
  }

  private loadEventsData() {
    this.loading = true;
    this.error = null;

    const formValue = this.searchForm.value;
    const filter: EventFilter = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: formValue.searchTerm || undefined,
      category: this.selectedCategory || undefined,
      eventType: this.selectedEventType || undefined,
      location: this.selectedLocation || undefined,
      isOnline: formValue.isOnline,
      isFree: formValue.isFree,
      ...this.getTabFilter(this.activeTab),
      ...this.parseSortBy(formValue.sortBy)
    };

    return this.eventsService.getEvents(filter);
  }

  private getTabFilter(tab: string): Partial<EventFilter> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch (tab) {
      case 'upcoming':
        return { fromDate: now.toISOString() };
      case 'today':
        return { 
          fromDate: today.toISOString(),
          toDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        };
      case 'this_week':
        return { 
          fromDate: today.toISOString(),
          toDate: weekFromNow.toISOString()
        };
      case 'free':
        return { isFree: true };
      case 'online':
        return { isOnline: true };
      default:
        return {};
    }
  }

  private parseSortBy(sortBy: string): { sortBy: string; sortDirection: string } {
    const [field, direction] = sortBy.split('_');
    return {
      sortBy: field,
      sortDirection: direction === 'desc' ? 'desc' : 'asc'
    };
  }

  private updatePagination(data: EventsPagedResponse): void {
    this.totalItems = data.totalCount;
    this.totalPages = data.totalPages;
    this.currentPage = data.pageNumber;
  }

  private loadCategories(): void {
    this.eventsService.getEventCategories().subscribe(response => {
      if (response.succeeded) {
        this.categories = response.data;
      }
    });
  }

  // Event handlers
  loadEvents(): void {
    this.refreshTrigger$.next();
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
    this.activeTabIndex = this.filterTabs.findIndex(t => t.value === tab);
    this.currentPage = 1;
    this.loadEvents();
  }

  onFiltersChange(filters: any): void {
    this.selectedCategory = filters.category || '';
    this.selectedEventType = filters.eventType || '';
    this.selectedLocation = filters.location || '';
    this.searchForm.patchValue({
      category: filters.category,
      eventType: filters.eventType,
      location: filters.location,
      isOnline: filters.isOnline,
      isFree: filters.isFree
    });
    this.currentPage = 1;
    this.loadEvents();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEvents();
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onRetry(): void {
    this.loadEvents();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      sortBy: 'startDate',
      category: '',
      eventType: '',
      location: '',
      isOnline: null,
      isFree: null
    });
    this.selectedCategory = '';
    this.selectedEventType = '';
    this.selectedLocation = '';
    this.activeTab = 'all';
    this.currentPage = 1;
    this.loadEvents();
  }

  navigateToCreateEvent(): void {
    this.router.navigate(['/community/events/create']);
  }

  navigateToEvent(event: EventSummaryDto): void {
    this.router.navigate(['/community/events', event.id]);
  }

  navigateToCalendar(): void {
    this.router.navigate(['/community/events/calendar']);
  }

  // Utility methods for template
  getEventUrl(event: EventSummaryDto): string {
    return `/community/events/${event.id}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays > 1 && diffInDays <= 7) return `In ${diffInDays} days`;
    return date.toLocaleDateString();
  }

  getTabIcon(tabValue: string): string {
    const tab = this.filterTabs.find(t => t.value === tabValue);
    return tab?.icon || 'event';
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

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Technology': 'bg-blue-500',
      'Business': 'bg-green-500',
      'Education': 'bg-purple-500',
      'Entertainment': 'bg-pink-500',
      'Sports': 'bg-orange-500',
      'Health': 'bg-red-500',
      'Community': 'bg-indigo-500'
    };
    return colors[category] || 'bg-gray-500';
  }

  trackByEventId(index: number, event: EventSummaryDto): string {
    return event.id;
  }
}