import { Injectable, signal, computed } from '@angular/core';

export interface ImageFormat {
  extension: string;
  mimeType: string;
  quality: number;
  compression: number;
  browserSupport: number; // Percentage of browser support
}

export interface ImageSize {
  width: number;
  height: number;
  descriptor: string; // e.g., '1x', '2x', '320w'
}

export interface OptimizedImageSet {
  original: string;
  webp?: string;
  avif?: string;
  sizes: ImageSize[];
  srcset: string;
  placeholder?: string;
}

export interface ImageOptimizationMetrics {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  formatUsed: string;
  loadTime: number;
}

/**
 * Image Optimization Service
 * 
 * Handles image format conversion, responsive sizing, and optimization
 */
@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private _supportedFormats = signal<Map<string, boolean>>(new Map());
  private _optimizationMetrics = signal<ImageOptimizationMetrics[]>([]);

  readonly supportedFormats = computed(() => Object.fromEntries(this._supportedFormats()));
  readonly metrics = this._optimizationMetrics.asReadonly();
  readonly averageCompressionRatio = computed(() => {
    const metrics = this.metrics();
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.compressionRatio, 0) / metrics.length;
  });

  // Predefined image formats with their characteristics
  private readonly formats: Record<string, ImageFormat> = {
    avif: {
      extension: 'avif',
      mimeType: 'image/avif',
      quality: 80,
      compression: 0.5, // 50% smaller than JPEG
      browserSupport: 85
    },
    webp: {
      extension: 'webp',
      mimeType: 'image/webp',
      quality: 80,
      compression: 0.7, // 30% smaller than JPEG
      browserSupport: 95
    },
    jpeg: {
      extension: 'jpg',
      mimeType: 'image/jpeg',
      quality: 80,
      compression: 1.0, // Baseline
      browserSupport: 100
    },
    png: {
      extension: 'png',
      mimeType: 'image/png',
      quality: 100,
      compression: 1.2, // Usually larger than JPEG
      browserSupport: 100
    }
  };

  // Common responsive breakpoints
  private readonly breakpoints = [
    { width: 320, descriptor: '320w' },
    { width: 640, descriptor: '640w' },
    { width: 768, descriptor: '768w' },
    { width: 1024, descriptor: '1024w' },
    { width: 1280, descriptor: '1280w' },
    { width: 1920, descriptor: '1920w' }
  ];

  constructor() {
    this.detectFormatSupport();
  }

  /**
   * Generate optimized image set with multiple formats and sizes
   */
  generateOptimizedImageSet(
    originalSrc: string,
    options: {
      enableWebP?: boolean;
      enableAVIF?: boolean;
      sizes?: number[];
      quality?: number;
      generatePlaceholder?: boolean;
    } = {}
  ): OptimizedImageSet {
    const {
      enableWebP = true,
      enableAVIF = true,
      sizes = [320, 640, 1024, 1920],
      quality = 80,
      generatePlaceholder = true
    } = options;

    const imageSizes = sizes.map(width => ({
      width,
      height: 0, // Will be calculated based on aspect ratio
      descriptor: `${width}w`
    }));

    const result: OptimizedImageSet = {
      original: originalSrc,
      sizes: imageSizes,
      srcset: this.generateSrcSet(originalSrc, imageSizes)
    };

    // Generate WebP version if supported and enabled
    if (enableWebP && this.isFormatSupported('webp')) {
      result.webp = this.convertToFormat(originalSrc, 'webp', quality);
    }

    // Generate AVIF version if supported and enabled
    if (enableAVIF && this.isFormatSupported('avif')) {
      result.avif = this.convertToFormat(originalSrc, 'avif', quality);
    }

    // Generate placeholder if requested
    if (generatePlaceholder) {
      result.placeholder = this.generatePlaceholder(originalSrc);
    }

    return result;
  }

  /**
   * Get the best format for the current browser
   */
  getBestFormat(): string {
    if (this.isFormatSupported('avif')) return 'avif';
    if (this.isFormatSupported('webp')) return 'webp';
    return 'jpeg';
  }

  /**
   * Calculate optimal image dimensions for responsive design
   */
  calculateResponsiveSizes(
    originalWidth: number,
    originalHeight: number,
    targetSizes: number[] = [320, 640, 1024, 1920]
  ): ImageSize[] {
    const aspectRatio = originalHeight / originalWidth;
    
    return targetSizes
      .filter(width => width <= originalWidth) // Don't upscale
      .map(width => ({
        width,
        height: Math.round(width * aspectRatio),
        descriptor: `${width}w`
      }));
  }

  /**
   * Estimate file size reduction for different formats
   */
  estimateOptimization(originalSize: number, targetFormat: string): number {
    const format = this.formats[targetFormat];
    if (!format) return originalSize;
    
    return Math.round(originalSize * format.compression);
  }

  /**
   * Generate blur placeholder data URL
   */
  generatePlaceholder(src: string, size: number = 10): string {
    // In a real implementation, this would generate a tiny, blurred version
    // For now, we'll create a simple gradient placeholder
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Create a simple gradient as placeholder
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    return canvas.toDataURL('image/jpeg', 0.1);
  }

  /**
   * Record optimization metrics
   */
  recordOptimization(metrics: ImageOptimizationMetrics): void {
    this._optimizationMetrics.update(current => [...current, metrics]);
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(imageSrc: string): string[] {
    const recommendations: string[] = [];
    const extension = this.getFileExtension(imageSrc);

    // Format recommendations
    if (extension === 'png' && !imageSrc.includes('logo') && !imageSrc.includes('icon')) {
      recommendations.push('Consider converting PNG to WebP/AVIF for better compression');
    }

    if (extension === 'jpg' || extension === 'jpeg') {
      if (this.isFormatSupported('avif')) {
        recommendations.push('Use AVIF format for 50% better compression than JPEG');
      } else if (this.isFormatSupported('webp')) {
        recommendations.push('Use WebP format for 30% better compression than JPEG');
      }
    }

    // Size recommendations
    if (imageSrc.includes('hero') || imageSrc.includes('banner')) {
      recommendations.push('Use responsive images with multiple sizes for hero/banner images');
    }

    // Loading recommendations
    recommendations.push('Enable lazy loading for images below the fold');
    recommendations.push('Use appropriate loading priority (high for above-the-fold images)');

    return recommendations;
  }

  /**
   * Analyze image performance across the application
   */
  getPerformanceAnalysis(): any {
    const metrics = this.metrics();
    
    return {
      totalImages: metrics.length,
      averageLoadTime: metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length,
      averageCompressionRatio: this.averageCompressionRatio(),
      formatDistribution: this.getFormatDistribution(metrics),
      totalSizeSaved: metrics.reduce((sum, m) => sum + (m.originalSize - m.optimizedSize), 0),
      recommendations: this.getGlobalRecommendations(metrics)
    };
  }

  /**
   * Check if a specific format is supported by the browser
   */
  isFormatSupported(format: string): boolean {
    return this._supportedFormats().get(format) || false;
  }

  /**
   * Clear optimization metrics
   */
  clearMetrics(): void {
    this._optimizationMetrics.set([]);
  }

  private detectFormatSupport(): void {
    const formats = new Map<string, boolean>();

    // Test WebP support
    const webpCanvas = document.createElement('canvas');
    webpCanvas.width = 1;
    webpCanvas.height = 1;
    formats.set('webp', webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0);

    // Test AVIF support (more complex detection)
    this.testAVIFSupport().then(supported => {
      formats.set('avif', supported);
      this._supportedFormats.set(formats);
    });

    // Always supported formats
    formats.set('jpeg', true);
    formats.set('jpg', true);
    formats.set('png', true);
    formats.set('gif', true);
    formats.set('svg', true);

    this._supportedFormats.set(formats);
  }

  private async testAVIFSupport(): Promise<boolean> {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = () => resolve(true);
      avif.onerror = () => resolve(false);
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }

  private convertToFormat(src: string, format: string, quality: number): string {
    // In a real implementation, this would integrate with an image optimization service
    // For now, we'll simulate the conversion by changing the extension
    const baseName = src.replace(/\.[^/.]+$/, '');
    const formatInfo = this.formats[format];
    
    if (!formatInfo) return src;
    
    return `${baseName}.${formatInfo.extension}?q=${quality}`;
  }

  private generateSrcSet(src: string, sizes: ImageSize[]): string {
    return sizes
      .map(size => `${this.resizeImage(src, size.width)} ${size.descriptor}`)
      .join(', ');
  }

  private resizeImage(src: string, width: number): string {
    // In a real implementation, this would integrate with an image resizing service
    const extension = this.getFileExtension(src);
    const baseName = src.replace(/\.[^/.]+$/, '');
    return `${baseName}_${width}w.${extension}`;
  }

  private getFileExtension(src: string): string {
    return src.split('.').pop()?.toLowerCase() || '';
  }

  private getFormatDistribution(metrics: ImageOptimizationMetrics[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    metrics.forEach(metric => {
      distribution[metric.formatUsed] = (distribution[metric.formatUsed] || 0) + 1;
    });
    
    return distribution;
  }

  private getGlobalRecommendations(metrics: ImageOptimizationMetrics[]): string[] {
    const recommendations: string[] = [];
    
    if (metrics.length === 0) {
      return ['No image optimization data available yet'];
    }

    const avgLoadTime = metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
    if (avgLoadTime > 1000) {
      recommendations.push('Average image load time is high - consider further optimization');
    }

    const avgCompressionRatio = this.averageCompressionRatio();
    if (avgCompressionRatio < 0.7) {
      recommendations.push('Low compression ratio - consider using more efficient formats');
    }

    const formatDistribution = this.getFormatDistribution(metrics);
    if (formatDistribution['jpeg'] > formatDistribution['webp'] + formatDistribution['avif']) {
      recommendations.push('Consider migrating more images to modern formats (WebP/AVIF)');
    }

    return recommendations;
  }
}