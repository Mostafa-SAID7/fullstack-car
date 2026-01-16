/**
 * ServiceListComponent (Angular)
 * Displays services in grid/list view with filtering, location search, and infinite scroll
 */

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ServiceService } from '../../services';
import { ServiceDto, ServiceFilters, ServiceType } from '../../models';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent]
})
export class ServiceListComponent implements OnInit, OnDestroy {
  services: ServiceDto[] = [];
  loading = false;
  error: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';

  // Pagination
  currentPage = 1;
  pageSize = 20;
  hasMorePages = true;
  totalCount = 0;
  totalItems = 0;
  totalPages = 0;

  // Filters
  filters: ServiceFilters = {
    page: 1,
    pageSize: 20
  };

  searchTerm = '';
  selectedType: ServiceType | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minRating: number | null = null;
  showFilters = false;

  // Location-based search
  useLocationSearch = false;
  userLatitude: number | null = null;
  userLongitude: number | null = null;
  searchRadius = 10; // Default 10km radius

  // Service types for filter dropdown
  serviceTypes = Object.values(ServiceType);

  // Search debouncing
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private serviceService: ServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadServices();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup search input debouncing (300ms)
   */
  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.resetAndLoad();
    });
  }

  /**
   * Load services with current filters
   */
  loadServices(): void {
    if (this.loading || !this.hasMorePages) {
      return;
    }

    this.loading = true;
    this.error = null;

    const filters: ServiceFilters = {
      ...this.filters,
      page: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      type: this.selectedType || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      minRating: this.minRating || undefined
    };

    // Use location-based search if enabled and coordinates available
    if (this.useLocationSearch && this.userLatitude !== null && this.userLongitude !== null) {
      this.serviceService.searchByLocation({
        latitude: this.userLatitude,
        longitude: this.userLongitude,
        radiusKm: this.searchRadius,
        filters: filters
      }).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (result) => {
          this.services = [...this.services, ...result.items];
          this.totalCount = result.totalCount;
          this.totalItems = result.totalCount;
          this.totalPages = result.totalPages;
          this.hasMorePages = result.hasNextPage;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load services';
          this.loading = false;
        }
      });
    } else {
      // Regular search
      this.serviceService.getServices(filters).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (result) => {
          this.services = [...this.services, ...result.items];
          this.totalCount = result.totalCount;
          this.totalItems = result.totalCount;
          this.totalPages = result.totalPages;
          this.hasMorePages = result.hasNextPage;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load services';
          this.loading = false;
        }
      });
    }
  }

  /**
   * Reset services and reload from first page
   */
  public resetAndLoad(): void {
    this.services = [];
    this.currentPage = 1;
    this.hasMorePages = true;
    this.loadServices();
  }

  /**
   * Handle search input change
   */
  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  /**
   * Toggle view mode between grid and list
   */
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  /**
   * Handle service type filter change
   */
  onTypeChange(type: ServiceType | null): void {
    this.selectedType = type;
    this.resetAndLoad();
  }

  /**
   * Handle price range filter change
   */
  onPriceRangeChange(min: number | null, max: number | null): void {
    this.minPrice = min;
    this.maxPrice = max;
    this.resetAndLoad();
  }

  /**
   * Handle rating filter change
   */
  onRatingChange(rating: number | null): void {
    this.minRating = rating;
    this.resetAndLoad();
  }

  /**
   * Enable location-based search
   */
  enableLocationSearch(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLatitude = position.coords.latitude;
          this.userLongitude = position.coords.longitude;
          this.useLocationSearch = true;
          this.resetAndLoad();
        },
        (error) => {
          this.error = 'Unable to get your location. Please enable location services.';
          console.error('Geolocation error:', error);
        }
      );
    } else {
      this.error = 'Geolocation is not supported by your browser.';
    }
  }

  /**
   * Disable location-based search
   */
  disableLocationSearch(): void {
    this.useLocationSearch = false;
    this.userLatitude = null;
    this.userLongitude = null;
    this.resetAndLoad();
  }

  /**
   * Update search radius
   */
  onRadiusChange(radius: number): void {
    this.searchRadius = radius;
    if (this.useLocationSearch) {
      this.resetAndLoad();
    }
  }

  /**
   * Handle filter change
   */
  onFilterChange(): void {
    this.resetAndLoad();
  }

  /**
   * Toggle filters visibility
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
   * Navigate to create service page
   */
  createService(): void {
    this.router.navigate(['/marketplace/services/create']);
  }

  /**
   * Book a service
   */
  bookService(service: ServiceDto): void {
    this.router.navigate(['/marketplace/services', service.id, 'book']);
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.resetAndLoad();
  }

  /**
   * Get label for service type
   */
  getServiceTypeLabel(type: ServiceType | string): string {
    return type.toString();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.minRating = null;
    this.resetAndLoad();
  }

  /**
   * Handle scroll event for infinite scrolling
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    // Load more when user scrolls to 80% of page
    if (scrollPosition >= pageHeight * 0.8 && !this.loading && this.hasMorePages) {
      this.currentPage++;
      this.loadServices();
    }
  }

  /**
   * Navigate to service detail
   */
  viewServiceDetail(service: ServiceDto): void {
    // TODO: Navigate to service detail page
    console.log('View service:', service);
  }

  /**
   * Format price as currency
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  /**
   * Get price range display
   */
  getPriceRange(service: ServiceDto): string {
    if (service.maxPrice && service.maxPrice > service.basePrice) {
      return `${this.formatPrice(service.basePrice)} - ${this.formatPrice(service.maxPrice)}`;
    }
    return this.formatPrice(service.basePrice);
  }

  /**
   * Format duration in hours and minutes
   */
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  }

  /**
   * Get duration range display
   */
  getDurationRange(service: ServiceDto): string {
    if (service.maxDuration && service.maxDuration > service.estimatedDuration) {
      return `${this.formatDuration(service.estimatedDuration)} - ${this.formatDuration(service.maxDuration)}`;
    }
    return this.formatDuration(service.estimatedDuration);
  }

  /**
   * Check if service is active
   */
  isActive(service: ServiceDto): boolean {
    return service.isActive && service.status === 'Active';
  }

  /**
   * Generate star rating array for display
   */
  getStarRating(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < Math.round(rating));
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByServiceId(index: number, service: ServiceDto): string {
    return service.id;
  }
}
