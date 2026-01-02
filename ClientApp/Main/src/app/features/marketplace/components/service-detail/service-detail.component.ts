import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { CarService } from '../../models/marketplace.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="service-detail-container" *ngIf="service">
      <div class="service-header">
        <button (click)="goBack()" class="back-btn">
          <i class="fas fa-arrow-left"></i> Back to Services
        </button>
        <h1>{{ service.name }}</h1>
        <p>{{ service.description }}</p>
      </div>

      <div class="service-content">
        <div class="service-image">
          <img [src]="service.imageUrl || '/assets/images/default-service.jpg'" [alt]="service.name">
        </div>
        
        <div class="service-info">
          <div class="price-section">
            <span class="price">{{ formatPrice(service.basePrice) }}</span>
            <span class="duration">{{ formatDuration(service.duration) }}</span>
          </div>
          
          <div class="service-features">
            <div class="feature" *ngIf="service.isEmergencyService">
              <i class="fas fa-exclamation-triangle"></i>
              Emergency Service
            </div>
            <div class="feature" *ngIf="service.isAvailable24x7">
              <i class="fas fa-clock"></i>
              24/7 Available
            </div>
          </div>
          
          <button (click)="bookService()" class="book-btn">
            Book This Service
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading service details...</p>
    </div>

    <div *ngIf="error" class="error">
      <p>{{ error }}</p>
      <button (click)="loadService()">Try Again</button>
    </div>
  `,
  styles: [`
    .service-detail-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .back-btn {
      background: none;
      border: none;
      color: #3b82f6;
      cursor: pointer;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .service-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .service-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }

    .service-image img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
    }

    .price-section {
      margin-bottom: 1rem;
    }

    .price {
      font-size: 2rem;
      font-weight: 700;
      color: #059669;
    }

    .book-btn {
      width: 100%;
      padding: 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 1rem;
    }

    .loading, .error {
      text-align: center;
      padding: 2rem;
    }

    .spinner {
      width: 2rem;
      height: 2rem;
      border: 3px solid #e5e7eb;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .service-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ServiceDetailComponent implements OnInit {
  service: CarService | null = null;
  loading = false;
  error: string | null = null;
  serviceId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (this.serviceId) {
      this.loadService();
    }
  }

  loadService(): void {
    if (!this.serviceId) return;

    this.loading = true;
    this.error = null;

    this.marketplaceService.getService(this.serviceId).subscribe({
      next: (response) => {
        if (response.success) {
          this.service = response.data;
        } else {
          this.error = 'Service not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading service:', error);
        this.error = 'Failed to load service';
        this.loading = false;
      }
    });
  }

  bookService(): void {
    if (this.service) {
      this.router.navigate(['/marketplace/bookings/create'], {
        queryParams: { serviceId: this.service.id }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/marketplace/services']);
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
}