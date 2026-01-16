/**
 * ServiceProviderListComponent (Angular)
 * Displays service providers in grid/list view with filtering and search
 */

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ServiceProviderService, ServiceProviderFilters } from '../../services/service-provider.service';
import { ServiceProviderDto } from '../../models';

@Component({
  selector: 'app-service-provider-list',
  templateUrl: './service-provider-list.component.html',
  styleUrls: ['./service-provider-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ServiceProviderListComponent implements OnInit, OnDestroy {
  providers: ServiceProviderDto[] = [];
  loading = false;
  error: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';

  // Pagination
  currentPage = 1;
  pageSize = 20;
  hasMorePages = true;
  totalCount = 0;

  // Filters
  filters: ServiceProviderFilters = {
    page: 1,
    pageSize: 20
  };

  searchTerm = '';
  selectedCity: string | null = null;
  minRating: number | null = null;
  showVerifiedOnly = false;

  // Cities for filter dropdown (can be populated from API)
  cities: string[] = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose'
  ];

  // Search debouncing
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private serviceProviderService: ServiceProviderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProviders();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Setup search input debouncing
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
   * Load service providers with current filters
   */
  loadProviders(): void {
    if (this.loading || !this.hasMorePages) {
      return;
    }

    this.loading = true;
    this.error = null;

    const filters: ServiceProviderFilters = {
      ...this.filters,
      page: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm || undefined,
      city: this.selectedCity || undefined,
      minRating: this.minRating || undefined,
      isVerified: this.showVerifiedOnly || undefined,
      isActive: true
    };

    this.serviceProviderService.getServiceProviders(filters).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        if (this.currentPage === 1) {
          this.providers = result.items;
        } else {
          this.providers = [...this.providers, ...result.items];
        }
        
        this.totalCount = result.totalCount;
        this.hasMorePages = result.hasNextPage;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load service providers';
        this.loading = false;
      }
    });
  }

  /**
   * Reset pagination and reload
   */
  resetAndLoad(): void {
    this.currentPage = 1;
    this.hasMorePages = true;
    this.providers = [];
    this.loadProviders();
  }

  /**
   * Handle search input
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  /**
   * Handle category filter change
   */
  onCityChange(): void {
    this.resetAndLoad();
  }

  /**
   * Handle rating filter change
   */
  onRatingChange(): void {
    this.resetAndLoad();
  }

  /**
   * Handle verified filter toggle
   */
  onVerifiedToggle(): void {
    this.resetAndLoad();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCity = null;
    this.minRating = null;
    this.showVerifiedOnly = false;
    this.resetAndLoad();
  }

  /**
   * Toggle view mode between grid and list
   */
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  /**
   * Navigate to provider profile
   */
  viewProviderProfile(providerId: string): void {
    this.router.navigate(['/marketplace/providers', providerId]);
  }

  /**
   * Infinite scroll handler
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    // Load more when user scrolls to 80% of page
    if (scrollPosition >= pageHeight * 0.8 && !this.loading && this.hasMorePages) {
      this.currentPage++;
      this.loadProviders();
    }
  }

  /**
   * Format rating for display
   */
  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  /**
   * Get star rating array for display
   */
  getStarRating(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < Math.round(rating));
  }

  /**
   * Get provider initials for avatar
   */
  getProviderInitials(name: string): string {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Get verification badge text
   */
  getVerificationBadge(provider: ServiceProviderDto): string {
    return provider.isVerified ? 'Verified' : 'Unverified';
  }

  /**
   * Check if provider has high rating
   */
  hasHighRating(rating: number): boolean {
    return rating >= 4.5;
  }

  /**
   * Get rating class for styling
   */
  getRatingClass(rating: number): string {
    if (rating >= 4.5) return 'rating-excellent';
    if (rating >= 4.0) return 'rating-good';
    if (rating >= 3.0) return 'rating-average';
    return 'rating-poor';
  }

  /**
   * Format phone number
   */
  formatPhone(phone: string | undefined): string {
    if (!phone) return 'N/A';
    // Simple formatting: (XXX) XXX-XXXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
  }

  /**
   * Get display address
   */
  getDisplayAddress(provider: ServiceProviderDto): string {
    const parts = [];
    if (provider.address) parts.push(provider.address);
    if (provider.city) parts.push(provider.city);
    return parts.join(', ') || 'Location not specified';
  }

  /**
   * Check if filters are active
   */
  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedCity || this.minRating || this.showVerifiedOnly);
  }

  /**
   * Get active filter count
   */
  getActiveFilterCount(): number {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.selectedCity) count++;
    if (this.minRating) count++;
    if (this.showVerifiedOnly) count++;
    return count;
  }
}
