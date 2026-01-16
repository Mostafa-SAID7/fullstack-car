/**
 * ProductService (Angular)
 * Service for managing product API calls in the Main App
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductDto, ProductFilters, PagedResult } from '../models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  /**
   * Get products with optional filtering and pagination
   * @param filters - Filter parameters
   * @returns Observable of paged product results
   */
  getProducts(filters?: ProductFilters): Observable<PagedResult<ProductDto>> {
    const params = this.buildParams(filters);
    
    return this.http.get<PagedResult<ProductDto>>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get a single product by ID
   * @param id - Product ID
   * @returns Observable of product
   */
  getProduct(id: string): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Search products with filters
   * @param searchTerm - Search term
   * @param filters - Additional filters
   * @returns Observable of paged product results
   */
  searchProducts(searchTerm: string, filters?: ProductFilters): Observable<PagedResult<ProductDto>> {
    const searchFilters: ProductFilters = {
      ...filters,
      search: searchTerm
    };
    
    return this.getProducts(searchFilters);
  }

  /**
   * Get featured products
   * @param limit - Maximum number of products to return
   * @returns Observable of product array
   */
  getFeaturedProducts(limit: number = 10): Observable<ProductDto[]> {
    const filters: ProductFilters = {
      isFeatured: true,
      pageSize: limit,
      page: 1
    };
    
    return this.getProducts(filters).pipe(
      map(result => result.items)
    );
  }

  /**
   * Get products by category
   * @param category - Product category
   * @param filters - Additional filters
   * @returns Observable of paged product results
   */
  getProductsByCategory(category: string, filters?: ProductFilters): Observable<PagedResult<ProductDto>> {
    const categoryFilters: ProductFilters = {
      ...filters,
      category: category as any
    };
    
    return this.getProducts(categoryFilters);
  }

  /**
   * Get products by brand
   * @param brand - Brand name
   * @param filters - Additional filters
   * @returns Observable of paged product results
   */
  getProductsByBrand(brand: string, filters?: ProductFilters): Observable<PagedResult<ProductDto>> {
    const brandFilters: ProductFilters = {
      ...filters,
      brand
    };
    
    return this.getProducts(brandFilters);
  }

  /**
   * Build HTTP params from filters
   * @param filters - Filter parameters
   * @returns HttpParams object
   */
  private buildParams(filters?: ProductFilters): HttpParams {
    let params = new HttpParams();

    if (!filters) {
      return params;
    }

    // Pagination
    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.pageSize !== undefined) {
      params = params.set('pageSize', filters.pageSize.toString());
    }

    // Search
    if (filters.search) {
      params = params.set('search', filters.search);
    }

    // Status and category
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }

    // Brand
    if (filters.brand) {
      params = params.set('brand', filters.brand);
    }

    // Price range
    if (filters.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }

    // Boolean filters
    if (filters.isFeatured !== undefined) {
      params = params.set('isFeatured', filters.isFeatured.toString());
    }
    if (filters.isLowStock !== undefined) {
      params = params.set('isLowStock', filters.isLowStock.toString());
    }

    // Sorting
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortDirection) {
      params = params.set('sortDirection', filters.sortDirection);
    }

    return params;
  }

  /**
   * Handle HTTP errors
   * @param error - Error object
   * @returns Observable error
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while fetching products';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('ProductService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
