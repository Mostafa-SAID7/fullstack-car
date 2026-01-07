import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { CarService, MarketplaceFilters, ServiceType } from '../../models/marketplace.model';
import { PaginatedResult } from '../../../../core/models/pagination.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  services: CarService[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalItems = 0;
  totalPages = 0;
  
  // Filters
  filters: MarketplaceFilters = {
    searchTerm: '',
    serviceType: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    isEmergencyService: undefined,
    isAvailable24x7: undefined,
    minRating: undefined,
    sortBy: 'CreatedAt',
    sortDescending: true
  };
  
  serviceTypes = Object.values(ServiceType);
  Math = Math;

  constructor(
    private marketplaceService: MarketplaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.error = null;

    this.marketplaceService.getServices(this.filters, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.services = response.data.items;
            this.totalItems = response.data.totalCount;
            this.totalPages = response.data.totalPages;
          } else {
            this.error = 'Failed to load services';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading services:', error);
          this.error = 'Failed to load services';
          this.loading = false;
        }
      });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadServices();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadServices();
  }

  viewService(service: CarService): void {
    this.router.navigate(['/app/marketplace/services', service.id]);
  }

  bookService(service: CarService): void {
    this.router.navigate(['/app/marketplace/bookings/create'], { 
      queryParams: { serviceId: service.id } 
    });
  }

  clearFilters(): void {
    this.filters = {
      searchTerm: '',
      serviceType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isEmergencyService: undefined,
      isAvailable24x7: undefined,
      minRating: undefined,
      sortBy: 'CreatedAt',
      sortDescending: true
    };
    this.onFilterChange();
  }

  getServiceTypeLabel(type: ServiceType): string {
    return type.replace(/([A-Z])/g, ' $1').trim();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

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

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/default-service.jpg';
    }
  }
}