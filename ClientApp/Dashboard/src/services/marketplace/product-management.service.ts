/**
 * Product Management Service
 * Handles bulk operations and management tasks for products
 */

import { productApiService } from './product-api.service';
import type {
  ProductDto,
  ProductFilters,
  ProductStatus,
  UpdateProductRequest
} from '../../types/marketplace';

/**
 * Product Management Service
 * Provides high-level management operations for products
 */
export class ProductManagementService {
  /**
   * Bulk delete multiple products
   * @param productIds - Array of product IDs to delete
   * @throws Error if any deletion fails
   */
  async bulkDelete(productIds: string[]): Promise<void> {
    if (!productIds || productIds.length === 0) {
      throw new Error('No product IDs provided for bulk delete');
    }

    try {
      await Promise.all(productIds.map(id => productApiService.deleteProduct(id)));
    } catch (error) {
      console.error('Bulk delete failed:', error);
      throw new Error(`Failed to delete products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Bulk update status for multiple products
   * @param productIds - Array of product IDs to update
   * @param status - New status to apply
   * @throws Error if any update fails
   */
  async bulkUpdateStatus(productIds: string[], status: ProductStatus): Promise<void> {
    if (!productIds || productIds.length === 0) {
      throw new Error('No product IDs provided for bulk status update');
    }

    if (!status) {
      throw new Error('Status is required for bulk update');
    }

    try {
      await Promise.all(
        productIds.map(id => 
          productApiService.updateProduct(id, { id, status } as UpdateProductRequest)
        )
      );
    } catch (error) {
      console.error('Bulk status update failed:', error);
      throw new Error(`Failed to update product status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Bulk update multiple fields for products
   * @param productIds - Array of product IDs to update
   * @param updates - Fields to update
   * @throws Error if any update fails
   */
  async bulkUpdateFields(productIds: string[], updates: Partial<UpdateProductRequest>): Promise<void> {
    if (!productIds || productIds.length === 0) {
      throw new Error('No product IDs provided for bulk update');
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('No updates provided for bulk update');
    }

    try {
      await Promise.all(
        productIds.map(id => 
          productApiService.updateProduct(id, { id, ...updates } as UpdateProductRequest)
        )
      );
    } catch (error) {
      console.error('Bulk field update failed:', error);
      throw new Error(`Failed to update products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export products to CSV format
   * @param filters - Optional filters to apply before export
   * @returns Blob containing CSV data
   */
  async exportProducts(filters?: ProductFilters): Promise<Blob> {
    try {
      const blob = await productApiService.exportProducts(filters);
      return blob;
    } catch (error) {
      console.error('Export products failed:', error);
      throw new Error(`Failed to export products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download exported products as a file
   * @param filters - Optional filters to apply before export
   * @param filename - Optional filename (default: 'products-export.csv')
   */
  async downloadProductsExport(filters?: ProductFilters, filename: string = 'products-export.csv'): Promise<void> {
    try {
      const blob = await this.exportProducts(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download export failed:', error);
      throw new Error(`Failed to download export: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get products that need attention (low stock, discontinued, etc.)
   * @returns Object containing products needing attention
   */
  async getProductsNeedingAttention(): Promise<{
    lowStock: ProductDto[];
    outOfStock: ProductDto[];
    discontinued: ProductDto[];
  }> {
    try {
      const [lowStock, allProducts] = await Promise.all([
        productApiService.getLowStockProducts(),
        productApiService.getProducts({ 
          status: ProductStatus.OutOfStock,
          pageSize: 100 
        })
      ]);

      const outOfStock = allProducts.items.filter(p => p.status === ProductStatus.OutOfStock);
      const discontinued = allProducts.items.filter(p => p.status === ProductStatus.Discontinued);

      return {
        lowStock,
        outOfStock,
        discontinued
      };
    } catch (error) {
      console.error('Failed to get products needing attention:', error);
      throw new Error(`Failed to get products needing attention: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Duplicate a product
   * @param productId - ID of product to duplicate
   * @param newName - Optional new name for the duplicated product
   * @returns Created product
   */
  async duplicateProduct(productId: string, newName?: string): Promise<ProductDto> {
    try {
      const original = await productApiService.getProduct(productId);
      
      const duplicateData = {
        ...original,
        name: newName || `${original.name} (Copy)`,
        sku: `${original.sku}-COPY-${Date.now()}`,
        id: undefined, // Remove ID to create new product
        createdAt: undefined,
        updatedAt: undefined,
        createdByUserId: undefined,
        updatedByUserId: undefined
      };

      return await productApiService.createProduct(duplicateData as any);
    } catch (error) {
      console.error('Duplicate product failed:', error);
      throw new Error(`Failed to duplicate product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Archive multiple products (set status to Discontinued)
   * @param productIds - Array of product IDs to archive
   */
  async archiveProducts(productIds: string[]): Promise<void> {
    return this.bulkUpdateStatus(productIds, ProductStatus.Discontinued);
  }

  /**
   * Activate multiple products (set status to Active)
   * @param productIds - Array of product IDs to activate
   */
  async activateProducts(productIds: string[]): Promise<void> {
    return this.bulkUpdateStatus(productIds, ProductStatus.Active);
  }

  /**
   * Deactivate multiple products (set status to Inactive)
   * @param productIds - Array of product IDs to deactivate
   */
  async deactivateProducts(productIds: string[]): Promise<void> {
    return this.bulkUpdateStatus(productIds, ProductStatus.Inactive);
  }

  /**
   * Update stock for multiple products
   * @param updates - Array of {productId, stockQuantity} objects
   */
  async bulkUpdateStock(updates: Array<{ productId: string; stockQuantity: number }>): Promise<void> {
    if (!updates || updates.length === 0) {
      throw new Error('No stock updates provided');
    }

    try {
      await Promise.all(
        updates.map(({ productId, stockQuantity }) => 
          productApiService.updateProduct(productId, { 
            id: productId, 
            stockQuantity 
          } as UpdateProductRequest)
        )
      );
    } catch (error) {
      console.error('Bulk stock update failed:', error);
      throw new Error(`Failed to update stock: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update prices for multiple products
   * @param updates - Array of {productId, price, discountPrice?} objects
   */
  async bulkUpdatePrices(updates: Array<{ 
    productId: string; 
    price: number; 
    discountPrice?: number 
  }>): Promise<void> {
    if (!updates || updates.length === 0) {
      throw new Error('No price updates provided');
    }

    try {
      await Promise.all(
        updates.map(({ productId, price, discountPrice }) => 
          productApiService.updateProduct(productId, { 
            id: productId, 
            price,
            discountPrice
          } as UpdateProductRequest)
        )
      );
    } catch (error) {
      console.error('Bulk price update failed:', error);
      throw new Error(`Failed to update prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const productManagementService = new ProductManagementService();
