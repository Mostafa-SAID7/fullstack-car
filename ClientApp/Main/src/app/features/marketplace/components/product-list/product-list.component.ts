/**
 * ProductListComponent (Angular)
 * Displays products in grid/list view with filtering and infinite scroll
 */

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ProductService } from '../../services';
import { ProductDto, ProductFilters, ProductCategory } from '../../models';
import { MarketplaceSignalRService } from '../../services/marketplace-signalr.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: ProductDto[] = [];
  loading = false;
  error: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';

  // Pagination
  currentPage = 1;
  pageSize = 20;
  hasMorePages = true;
  totalCount = 0;

  // Filters
  filters: ProductFilters = {
    page: 1,
    pageSize: 20
  };

  searchTerm = '';
  selectedCategory: ProductCategory | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Categories for filter dropdown
  categories = Object.values(ProductCategory);

  // Search debouncing
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // SignalR connection status
  isSignalRConnected = false;

  constructor(
    private productService: ProductService,
    private marketplaceSignalR: MarketplaceSignalRService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearchDebounce();
    this.setupSignalRListeners();
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
   * Setup SignalR listeners for real-time updates
   */
  private setupSignalRListeners(): void {
    // Monitor connection status
    this.marketplaceSignalR.connectionStatus$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isConnected => {
      this.isSignalRConnected = isConnected;
      console.log('SignalR connection status:', isConnected);
    });

    // Listen for product created events
    this.marketplaceSignalR.productCreated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(product => {
      console.log('New product created, refreshing list...');
      this.handleProductCreated(product);
    });

    // Listen for product updated events
    this.marketplaceSignalR.productUpdated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(product => {
      console.log('Product updated, refreshing data...');
      this.handleProductUpdated(product);
    });

    // Listen for product deleted events
    this.marketplaceSignalR.productDeleted$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(productId => {
      console.log('Product deleted, removing from list...');
      this.handleProductDeleted(productId);
    });

    // Listen for price changed events
    this.marketplaceSignalR.priceChanged$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(priceChange => {
      console.log('Product price changed:', priceChange);
      this.handlePriceChanged(priceChange);
    });
  }

  /**
   * Handle product created event
   */
  private handleProductCreated(product: ProductDto): void {
    // Check if product matches current filters
    if (this.matchesCurrentFilters(product)) {
      // Add to beginning of list
      this.products = [product, ...this.products];
      this.totalCount++;
    }
  }

  /**
   * Handle product updated event
   */
  private handleProductUpdated(updatedProduct: ProductDto): void {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    
    if (index !== -1) {
      // Check if updated product still matches filters
      if (this.matchesCurrentFilters(updatedProduct)) {
        // Update the product in place
        this.products[index] = updatedProduct;
        this.products = [...this.products]; // Trigger change detection
      } else {
        // Remove product if it no longer matches filters
        this.products = this.products.filter(p => p.id !== updatedProduct.id);
        this.totalCount--;
      }
    } else if (this.matchesCurrentFilters(updatedProduct)) {
      // Product now matches filters, add it
      this.products = [updatedProduct, ...this.products];
      this.totalCount++;
    }
  }

  /**
   * Handle product deleted event
   */
  private handleProductDeleted(productId: string): void {
    const index = this.products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
      this.products = this.products.filter(p => p.id !== productId);
      this.totalCount--;
    }
  }

  /**
   * Handle price changed event
   */
  private handlePriceChanged(priceChange: { id: string, oldPrice: number, newPrice: number }): void {
    const product = this.products.find(p => p.id === priceChange.id);
    
    if (product) {
      product.price = priceChange.newPrice;
      this.products = [...this.products]; // Trigger change detection
    }
  }

  /**
   * Check if a product matches current filters
   */
  private matchesCurrentFilters(product: ProductDto): boolean {
    // Check category filter
    if (this.selectedCategory && product.category !== this.selectedCategory) {
      return false;
    }

    // Check price range filter
    const displayPrice = this.getDisplayPrice(product);
    if (this.minPrice !== null && displayPrice < this.minPrice) {
      return false;
    }
    if (this.maxPrice !== null && displayPrice > this.maxPrice) {
      return false;
    }

    // Check search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower)) ||
        (product.sku && product.sku.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  }

  /**
   * Load products with current filters
   */
  loadProducts(): void {
    if (this.loading || !this.hasMorePages) {
      return;
    }

    this.loading = true;
    this.error = null;

    const filters: ProductFilters = {
      ...this.filters,
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      category: this.selectedCategory || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined
    };

    this.productService.getProducts(filters).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        this.products = [...this.products, ...result.items];
        this.totalCount = result.totalCount;
        this.hasMorePages = result.hasNextPage;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load products';
        this.loading = false;
      }
    });
  }

  /**
   * Reset products and reload from first page
   */
  public resetAndLoad(): void {
    this.products = [];
    this.currentPage = 1;
    this.hasMorePages = true;
    this.loadProducts();
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
   * Handle category filter change
   */
  onCategoryChange(category: ProductCategory | null): void {
    this.selectedCategory = category;
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
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.minPrice = null;
    this.maxPrice = null;
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
      this.loadProducts();
    }
  }

  /**
   * Navigate to product detail
   */
  viewProductDetail(product: ProductDto): void {
    // TODO: Navigate to product detail page
    console.log('View product:', product);
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
  getDisplayPrice(product: ProductDto): number {
    return product.discountPrice || product.price;
  }

  /**
   * Check if product has discount
   */
  hasDiscount(product: ProductDto): boolean {
    return !!product.discountPrice && product.discountPrice < product.price;
  }

  /**
   * Calculate discount percentage
   */
  getDiscountPercentage(product: ProductDto): number {
    if (!this.hasDiscount(product)) {
      return 0;
    }
    return Math.round(((product.price - product.discountPrice!) / product.price) * 100);
  }

  /**
   * Check if product is in stock
   */
  isInStock(product: ProductDto): boolean {
    return product.stockQuantity > 0;
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByProductId(index: number, product: ProductDto): string {
    return product.id;
  }
}
