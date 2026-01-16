/**
 * Image Upload Service for Marketplace Products
 * Handles image uploads, validation, and management for products
 */

import { apiClient } from '../api';
import { API_ENDPOINTS, REQUEST_TIMEOUTS } from '../../config/api';

export interface ImageUploadOptions {
  /** Maximum file size in bytes (default: 5MB) */
  maxSize?: number;
  /** Allowed image formats */
  allowedFormats?: string[];
  /** Whether to compress images before upload */
  compress?: boolean;
  /** Compression quality (0-1) */
  quality?: number;
  /** Maximum width for resizing */
  maxWidth?: number;
  /** Maximum height for resizing */
  maxHeight?: number;
}

export interface ImageUploadResult {
  /** Uploaded image URL */
  url: string;
  /** Original filename */
  filename: string;
  /** File size in bytes */
  size: number;
  /** Image dimensions */
  dimensions?: {
    width: number;
    height: number;
  };
  /** Upload timestamp */
  uploadedAt: string;
}

export interface ImageUploadProgress {
  /** Upload progress percentage (0-100) */
  progress: number;
  /** Current file being uploaded */
  filename: string;
  /** Upload speed in bytes per second */
  speed?: number;
  /** Estimated time remaining in seconds */
  timeRemaining?: number;
}

export class ImageUploadService {
  private static instance: ImageUploadService;
  
  private readonly defaultOptions: Required<ImageUploadOptions> = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    compress: true,
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080
  };

  private constructor() {}

  static getInstance(): ImageUploadService {
    if (!ImageUploadService.instance) {
      ImageUploadService.instance = new ImageUploadService();
    }
    return ImageUploadService.instance;
  }

  /**
   * Validate image file before upload
   */
  validateImage(file: File, options?: Partial<ImageUploadOptions>): { isValid: boolean; error?: string } {
    const opts = { ...this.defaultOptions, ...options };

    // Check file size
    if (file.size > opts.maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${this.formatFileSize(opts.maxSize)}`
      };
    }

    // Check file type
    if (!opts.allowedFormats.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not supported. Allowed formats: ${opts.allowedFormats.join(', ')}`
      };
    }

    return { isValid: true };
  }

  /**
   * Compress and resize image if needed
   */
  private async processImage(file: File, options: Required<ImageUploadOptions>): Promise<File> {
    if (!options.compress) {
      return file;
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > options.maxWidth) {
          height = (height * options.maxWidth) / width;
          width = options.maxWidth;
        }
        
        if (height > options.maxHeight) {
          width = (width * options.maxHeight) / height;
          height = options.maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(processedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          options.quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Upload single image for product
   */
  async uploadProductImage(
    productId: string,
    file: File,
    options?: Partial<ImageUploadOptions>,
    onProgress?: (progress: ImageUploadProgress) => void
  ): Promise<ImageUploadResult> {
    const opts = { ...this.defaultOptions, ...options };

    // Validate file
    const validation = this.validateImage(file, opts);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Process image if needed
    const processedFile = await this.processImage(file, opts);

    // Create form data
    const formData = new FormData();
    formData.append('file', processedFile);
    formData.append('productId', productId);
    formData.append('type', 'product-image');

    // Upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      let startTime = Date.now();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = e.loaded / elapsed;
          const timeRemaining = (e.total - e.loaded) / speed;

          onProgress({
            progress,
            filename: file.name,
            speed,
            timeRemaining
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out'));
      });

      // Configure request
      xhr.timeout = REQUEST_TIMEOUTS.UPLOAD;
      xhr.open('POST', `${API_ENDPOINTS.PRODUCTS.BASE}/${productId}/images`);
      
      // Add authorization header if available
      const token = localStorage.getItem('authToken');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  /**
   * Upload multiple images for product
   */
  async uploadProductImages(
    productId: string,
    files: File[],
    options?: Partial<ImageUploadOptions>,
    onProgress?: (progress: ImageUploadProgress) => void,
    onFileComplete?: (result: ImageUploadResult, index: number) => void
  ): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await this.uploadProductImage(
          productId,
          file,
          options,
          (progress) => {
            if (onProgress) {
              onProgress({
                ...progress,
                progress: ((i / files.length) * 100) + (progress.progress / files.length)
              });
            }
          }
        );
        
        results.push(result);
        onFileComplete?.(result, i);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Delete product image
   */
  async deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/${productId}/images`, {
        data: { imageUrl }
      });
    } catch (error) {
      console.error('Failed to delete product image:', error);
      throw error;
    }
  }

  /**
   * Get product images
   */
  async getProductImages(productId: string): Promise<ImageUploadResult[]> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${productId}/images`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get product images:', error);
      throw error;
    }
  }

  /**
   * Upload single image for service
   */
  async uploadServiceImage(
    serviceId: string,
    file: File,
    options?: Partial<ImageUploadOptions>,
    onProgress?: (progress: ImageUploadProgress) => void
  ): Promise<ImageUploadResult> {
    const opts = { ...this.defaultOptions, ...options };

    // Validate file
    const validation = this.validateImage(file, opts);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Process image if needed
    const processedFile = await this.processImage(file, opts);

    // Create form data
    const formData = new FormData();
    formData.append('file', processedFile);
    formData.append('serviceId', serviceId);
    formData.append('type', 'service-image');

    // Upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      let startTime = Date.now();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = e.loaded / elapsed;
          const timeRemaining = (e.total - e.loaded) / speed;

          onProgress({
            progress,
            filename: file.name,
            speed,
            timeRemaining
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out'));
      });

      // Configure request
      xhr.timeout = REQUEST_TIMEOUTS.UPLOAD;
      xhr.open('POST', `${API_ENDPOINTS.SERVICES.BASE}/${serviceId}/images`);
      
      // Add authorization header if available
      const token = localStorage.getItem('authToken');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  /**
   * Upload multiple images for service
   */
  async uploadServiceImages(
    serviceId: string,
    files: File[],
    options?: Partial<ImageUploadOptions>,
    onProgress?: (progress: ImageUploadProgress) => void,
    onFileComplete?: (result: ImageUploadResult, index: number) => void
  ): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await this.uploadServiceImage(
          serviceId,
          file,
          options,
          (progress) => {
            if (onProgress) {
              onProgress({
                ...progress,
                progress: ((i / files.length) * 100) + (progress.progress / files.length)
              });
            }
          }
        );
        
        results.push(result);
        onFileComplete?.(result, i);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Delete service image
   */
  async deleteServiceImage(serviceId: string, imageUrl: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.SERVICES.BASE}/${serviceId}/images`, {
        data: { imageUrl }
      });
    } catch (error) {
      console.error('Failed to delete service image:', error);
      throw error;
    }
  }

  /**
   * Get service images
   */
  async getServiceImages(serviceId: string): Promise<ImageUploadResult[]> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.SERVICES.BASE}/${serviceId}/images`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get service images:', error);
      throw error;
    }
  }

  /**
   * Set primary service image
   */
  async setPrimaryServiceImage(serviceId: string, imageUrl: string): Promise<void> {
    try {
      await apiClient.patch(`${API_ENDPOINTS.SERVICES.BASE}/${serviceId}/images/primary`, {
        imageUrl
      });
    } catch (error) {
      console.error('Failed to set primary service image:', error);
      throw error;
    }
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Generate image preview URL
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoke preview URL to free memory
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const imageUploadService = ImageUploadService.getInstance();