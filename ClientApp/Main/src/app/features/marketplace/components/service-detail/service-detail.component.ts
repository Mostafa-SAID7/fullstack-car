/**
 * ServiceDetailComponent (Angular)
 * Displays detailed service information with provider details, reviews, and booking functionality
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServiceService } from '../../services';
import { ServiceDto } from '../../models';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  service: ServiceDto | null = null;
  loading = false;
  error: string | null = null;
  
  // Booking state
  selectedDate: string = '';
  selectedTime: string = '';
  showBookingForm = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const serviceId = params['id'];
      if (serviceId) {
        this.loadService(serviceId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load service details
   */
  private loadService(id: string): void {
    this.loading = true;
    this.error = null;

    this.serviceService.getService(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (service) => {
        this.service = service;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load service';
        this.loading = false;
      }
    });
  }

  /**
   * Navigate back to service list
   */
  goBack(): void {
    this.router.navigate(['/marketplace/services']);
  }

  /**
   * Toggle booking form visibility
   */
  toggleBookingForm(): void {
    this.showBookingForm = !this.showBookingForm;
  }

  /**
   * Book service
   */
  bookService(): void {
    if (!this.service) return;
    
    if (!this.selectedDate || !this.selectedTime) {
      alert('Please select a date and time for your booking');
      return;
    }
    
    // TODO: Implement booking functionality
    console.log('Book service:', this.service, 'Date:', this.selectedDate, 'Time:', this.selectedTime);
    alert(`Booking request sent for ${this.service.title} on ${this.selectedDate} at ${this.selectedTime}`);
    this.showBookingForm = false;
  }

  /**
   * Contact service provider
   */
  contactProvider(): void {
    if (!this.service) return;
    
    // TODO: Implement contact functionality
    console.log('Contact provider for service:', this.service);
    alert('Contact form will be displayed here');
  }

  /**
   * Share service
   */
  shareService(): void {
    if (!this.service) return;

    if (navigator.share) {
      navigator.share({
        title: this.service.title,
        text: this.service.shortDescription,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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
  getPriceRange(): string {
    if (!this.service) return '';
    
    if (this.service.maxPrice && this.service.maxPrice > this.service.basePrice) {
      return `${this.formatPrice(this.service.basePrice)} - ${this.formatPrice(this.service.maxPrice)}`;
    }
    return this.formatPrice(this.service.basePrice);
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
  getDurationRange(): string {
    if (!this.service) return '';
    
    if (this.service.maxDuration && this.service.maxDuration > this.service.estimatedDuration) {
      return `${this.formatDuration(this.service.estimatedDuration)} - ${this.formatDuration(this.service.maxDuration)}`;
    }
    return this.formatDuration(this.service.estimatedDuration);
  }

  /**
   * Check if service is active
   */
  isActive(): boolean {
    if (!this.service) return false;
    return this.service.isActive && this.service.status === 'Active';
  }

  /**
   * Get service status message
   */
  getStatusMessage(): string {
    if (!this.service) return '';
    
    if (!this.service.isActive) {
      return 'Service Unavailable';
    } else if (this.service.status !== 'Active') {
      return `Service ${this.service.status}`;
    } else {
      return 'Available for Booking';
    }
  }

  /**
   * Get status class
   */
  getStatusClass(): string {
    if (!this.service) return '';
    
    if (!this.service.isActive || this.service.status !== 'Active') {
      return 'unavailable';
    } else {
      return 'available';
    }
  }

  /**
   * Generate star rating array for display
   */
  getStarRating(): boolean[] {
    if (!this.service) return [];
    return Array(5).fill(false).map((_, index) => index < Math.round(this.service!.averageRating));
  }

  /**
   * Get service tags as array
   */
  getTags(): string[] {
    if (!this.service || !this.service.tags) return [];
    return this.service.tags.split(',').map(tag => tag.trim());
  }

  /**
   * Get requirements as array
   */
  getRequirements(): string[] {
    if (!this.service || !this.service.requirements) return [];
    return this.service.requirements.split('\n').filter(req => req.trim());
  }

  /**
   * Get inclusions as array
   */
  getInclusions(): string[] {
    if (!this.service || !this.service.inclusions) return [];
    return this.service.inclusions.split('\n').filter(inc => inc.trim());
  }

  /**
   * Get exclusions as array
   */
  getExclusions(): string[] {
    if (!this.service || !this.service.exclusions) return [];
    return this.service.exclusions.split('\n').filter(exc => exc.trim());
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Get minimum date for booking (today)
   */
  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get available time slots (placeholder)
   */
  getTimeSlots(): string[] {
    return [
      '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
  }
}
