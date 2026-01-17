export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  descriptor: string;
}

export interface ResponsiveImageConfig {
  breakpoints: ResponsiveBreakpoint[];
  defaultSize: string;
  aspectRatio?: number;
  maxWidth?: number;
  quality?: number;
}

export interface GeneratedImageSet {
  srcset: string;
  sizes: string;
  src: string;
  placeholder?: string;
}

/**
 * Responsive Image Utility
 * 
 * Generates responsive image configurations for optimal loading
 * across different screen sizes and device pixel ratios
 */
export class ResponsiveImageUtil {
  // Standard responsive breakpoints
  static readonly BREAKPOINTS: ResponsiveBreakpoint[] = [
    { name: 'xs', minWidth: 0, maxWidth: 575, descriptor: '320w' },
    { name: 'sm', minWidth: 576, maxWidth: 767, descriptor: '640w' },
    { name: 'md', minWidth: 768, maxWidth: 991, descriptor: '768w' },
    { name: 'lg', minWidth: 992, maxWidth: 1199, descriptor: '1024w' },
    { name: 'xl', minWidth: 1200, maxWidth: 1399, descriptor: '1280w' },
    { name: 'xxl', minWidth: 1400, descriptor: '1920w' }
  ];

  // Device pixel ratio multipliers
  static readonly DPR_MULTIPLIERS = [1, 1.5, 2, 3];

  /**
   * Generate responsive image set with srcset and sizes
   */
  static generateResponsiveImageSet(
    baseSrc: string,
    config: Partial<ResponsiveImageConfig> = {}
  ): GeneratedImageSet {
    const {
      breakpoints = this.BREAKPOINTS,
      defaultSize = '100vw',
      aspectRatio,
      maxWidth,
      quality = 80
    } = config;

    // Generate srcset with different sizes
    const srcsetEntries = breakpoints.map(bp => {
      const width = parseInt(bp.descriptor.replace('w', ''));
      const constrainedWidth = maxWidth ? Math.min(width, maxWidth) : width;
      const imageSrc = this.generateImageUrl(baseSrc, constrainedWidth, aspectRatio, quality);
      return `${imageSrc} ${constrainedWidth}w`;
    });

    // Add high-DPR variants for smaller sizes
    const highDprEntries = breakpoints
      .filter(bp => parseInt(bp.descriptor.replace('w', '')) <= 768) // Only for smaller images
      .flatMap(bp => {
        const baseWidth = parseInt(bp.descriptor.replace('w', ''));
        return this.DPR_MULTIPLIERS
          .filter(dpr => dpr > 1)
          .map(dpr => {
            const width = Math.round(baseWidth * dpr);
            const constrainedWidth = maxWidth ? Math.min(width, maxWidth) : width;
            const imageSrc = this.generateImageUrl(baseSrc, constrainedWidth, aspectRatio, quality);
            return `${imageSrc} ${dpr}x`;
          });
      });

    const srcset = [...srcsetEntries, ...highDprEntries].join(', ');

    // Generate sizes attribute
    const sizes = this.generateSizesAttribute(breakpoints, defaultSize);

    // Default src (fallback)
    const defaultWidth = 1024;
    const src = this.generateImageUrl(baseSrc, defaultWidth, aspectRatio, quality);

    return {
      srcset,
      sizes,
      src
    };
  }

  /**
   * Generate sizes attribute for responsive images
   */
  static generateSizesAttribute(
    breakpoints: ResponsiveBreakpoint[],
    defaultSize: string = '100vw'
  ): string {
    const sizeRules = breakpoints
      .filter(bp => bp.maxWidth) // Only breakpoints with max width
      .sort((a, b) => (b.maxWidth || 0) - (a.maxWidth || 0)) // Sort by max width descending
      .map(bp => {
        const mediaQuery = `(max-width: ${bp.maxWidth}px)`;
        const size = this.calculateOptimalSize(bp);
        return `${mediaQuery} ${size}`;
      });

    // Add default size
    sizeRules.push(defaultSize);

    return sizeRules.join(', ');
  }

  /**
   * Calculate optimal image size for a breakpoint
   */
  static calculateOptimalSize(breakpoint: ResponsiveBreakpoint): string {
    const width = parseInt(breakpoint.descriptor.replace('w', ''));
    
    // For very small screens, use full width
    if (width <= 320) return '100vw';
    
    // For small screens, use 90% to account for padding
    if (width <= 640) return '90vw';
    
    // For medium screens, use 80% for better layout
    if (width <= 1024) return '80vw';
    
    // For large screens, use fixed max width
    return '1200px';
  }

  /**
   * Generate optimized image URL with parameters
   */
  static generateImageUrl(
    baseSrc: string,
    width: number,
    aspectRatio?: number,
    quality: number = 80
  ): string {
    // Remove existing query parameters
    const baseUrl = baseSrc.split('?')[0];
    
    // Calculate height if aspect ratio is provided
    const height = aspectRatio ? Math.round(width / aspectRatio) : undefined;
    
    // Build query parameters for image optimization service
    const params = new URLSearchParams();
    params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('f', 'auto'); // Auto format selection
    params.set('fit', 'cover'); // Crop to fit dimensions
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate art direction responsive image set
   */
  static generateArtDirectionSet(
    images: { src: string; media: string; sizes?: string }[],
    fallbackSrc: string
  ): string {
    const sources = images.map(img => {
      const sizes = img.sizes || '100vw';
      return `<source media="${img.media}" srcset="${img.src}" sizes="${sizes}">`;
    }).join('\n');

    return `
      <picture>
        ${sources}
        <img src="${fallbackSrc}" alt="">
      </picture>
    `;
  }

  /**
   * Calculate image dimensions for container
   */
  static calculateImageDimensions(
    containerWidth: number,
    containerHeight: number,
    imageAspectRatio: number,
    fit: 'cover' | 'contain' | 'fill' = 'cover'
  ): { width: number; height: number } {
    const containerAspectRatio = containerWidth / containerHeight;

    switch (fit) {
      case 'cover':
        if (imageAspectRatio > containerAspectRatio) {
          // Image is wider than container
          return {
            width: Math.round(containerHeight * imageAspectRatio),
            height: containerHeight
          };
        } else {
          // Image is taller than container
          return {
            width: containerWidth,
            height: Math.round(containerWidth / imageAspectRatio)
          };
        }

      case 'contain':
        if (imageAspectRatio > containerAspectRatio) {
          // Image is wider than container
          return {
            width: containerWidth,
            height: Math.round(containerWidth / imageAspectRatio)
          };
        } else {
          // Image is taller than container
          return {
            width: Math.round(containerHeight * imageAspectRatio),
            height: containerHeight
          };
        }

      case 'fill':
        return {
          width: containerWidth,
          height: containerHeight
        };

      default:
        return { width: containerWidth, height: containerHeight };
    }
  }

  /**
   * Get optimal image format based on browser support
   */
  static getOptimalFormat(): 'avif' | 'webp' | 'jpeg' {
    // Test AVIF support
    if (this.supportsFormat('avif')) return 'avif';
    
    // Test WebP support
    if (this.supportsFormat('webp')) return 'webp';
    
    // Fallback to JPEG
    return 'jpeg';
  }

  /**
   * Test if browser supports a specific image format
   */
  static supportsFormat(format: string): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      const dataUrl = canvas.toDataURL(`image/${format}`);
      return dataUrl.indexOf(`data:image/${format}`) === 0;
    } catch {
      return false;
    }
  }

  /**
   * Generate placeholder image data URL
   */
  static generatePlaceholder(
    width: number,
    height: number,
    color: string = '#f0f0f0'
  ): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', 0.1);
  }

  /**
   * Calculate bandwidth-appropriate image quality
   */
  static calculateOptimalQuality(connectionType?: string): number {
    // Use Network Information API if available
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType || connectionType;
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 60; // Lower quality for slow connections
      case '3g':
        return 75; // Medium quality
      case '4g':
      case '5g':
      default:
        return 85; // High quality for fast connections
    }
  }

  /**
   * Preload critical images
   */
  static preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      
      if (priority === 'high') {
        link.setAttribute('fetchpriority', 'high');
      }
      
      link.onload = () => resolve();
      link.onerror = reject;
      
      document.head.appendChild(link);
    });
  }

  /**
   * Generate critical CSS for above-the-fold images
   */
  static generateCriticalImageCSS(
    selector: string,
    imageSrc: string,
    width: number,
    height: number
  ): string {
    return `
      ${selector} {
        width: ${width}px;
        height: ${height}px;
        background-image: url('${imageSrc}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    `;
  }
}