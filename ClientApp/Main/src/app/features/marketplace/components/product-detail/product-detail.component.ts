/**
 * ProductDetailComponent (Angular)
 * Displays detailed product information with images, specs, and reviews
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../services';
import { ProductDto } from '../../models';
import { MarketplaceSignalRService } from '../../services/marketplace-signalr.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: ProductDto | null = null;
  loading = false;
  error: string | null = null;
  
  selectedImageIndex = 0;
  quantity = 1;

  // SignalR connection status
  isSignalRConnected = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private marketplaceSignalR: MarketplaceSignalRService
  ) {}

  ngOnInit(): void {
    this.setupSignalRListeners();
    
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load product details
   */
  private loadProduct(id: string): void {
    this.loading = true;
    this.error = null;

    this.productService.getProduct(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load product';
        this.loading = false;
      }
    });
  }

  /**
   * Setup SignalR listeners for real-time updates
   */
  private setupSignalRListeners(): void {
    // Monitor connection status
    this.marketplaceSignalR.connectionStatus$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isConnected => {
      this.isSignalRConnected = isConnected;
    });

    // Listen for product updated events
    this.marketplaceSignalR.productUpdated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(updatedProduct => {
      if (this.product && updatedProduct.id === this.product.id) {
        console.log('Current product updated via SignalR');
        this.product = updatedProduct;
        
        // Reset quantity if it exceeds new stock
        if (this.quantity > updatedProduct.stockQuantity) {
          this.quantity = Math.max(1, updatedProduct.stockQuantity);
        }
      }
    });

    // Listen for product deleted events
    this.marketplaceSignalR.productDeleted$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(productId => {
      if (this.product && productId === this.product.id) {
        console.log('Current product deleted via SignalR');
        alert('This product has been removed and is no longer available.');
        this.goBack();
      }
    });

    // Listen for price changed events
    this.marketplaceSignalR.priceChanged$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(priceChange => {
      if (this.product && priceChange.id === this.product.id) {
        console.log('Product price changed via SignalR:', priceChange);
        this.product.price = priceChange.newPrice;
      }
    });
  }

  /**
   * Navigate back to product list
   */
  goBack(): void {
    this.router.navigate(['/marketplace/products']);
  }

  /**
   * Add product to cart
   */
  addToCart(): void {
    if (!this.product) return;
    
    // TODO: Implement cart functionality
    console.log('Add to cart:', this.product, 'Quantity:', this.quantity);
    alert(`Added ${this.quantity} ${this.product.name} to cart`);
  }

  /**
   * Share product
   */
  shareProduct(): void {
    if (!this.product) return;

    if (navigator.share) {
      navigator.share({
        title: this.product.name,
        text: this.product.description,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }

  /**
   * Increment quantity
   */
  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  /**
   * Decrement quantity
   */
  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /**
   * Select image for display
   */
  selectImage(index: number): void {
    this.selectedImageIndex = index;
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
   * Get display price (discounted or regular)
   */
  getDisplayPrice(): number {
    if (!this.product) return 0;
    return this.product.discountPrice || this.product.price;
  }

  /**
   * Check if product has discount
   */
  hasDiscount(): boolean {
    if (!this.product) return false;
    return !!this.product.discountPrice && this.product.discountPrice < this.product.price;
  }

  /**
   * Calculate discount percentage
   */
  getDiscountPercentage(): number {
    if (!this.product || !this.hasDiscount()) return 0;
    return Math.round(((this.product.price - this.product.discountPrice!) / this.product.price) * 100);
  }

  /**
   * Check if product is in stock
   */
  isInStock(): boolean {
    if (!this.product) return false;
    return this.product.stockQuantity > 0;
  }

  /**
   * Get stock status message
   */
  getStockStatus(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity === 0) {
      return 'Out of Stock';
    } else if (this.product.stockQuantity <= this.product.minStockLevel) {
      return `Only ${this.product.stockQuantity} left in stock`;
    } else {
      return 'In Stock';
    }
  }

  /**
   * Get stock status class
   */
  getStockStatusClass(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity === 0) {
      return 'out-of-stock';
    } else if (this.product.stockQuantity <= this.product.minStockLevel) {
      return 'low-stock';
    } else {
      return 'in-stock';
    }
  }

  /**
   * Get product tags as array
   */
  getTags(): string[] {
    if (!this.product || !this.product.tags) return [];
    return this.product.tags.split(',').map(tag => tag.trim());
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
}
