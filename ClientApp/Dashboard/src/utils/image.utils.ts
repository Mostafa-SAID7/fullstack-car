/**
 * Image Utilities
 * Helper functions for image processing, validation, and management
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageValidationOptions {
  maxSize?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  allowedFormats?: string[];
  aspectRatio?: number;
  aspectRatioTolerance?: number;
}

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dimensions?: ImageDimensions;
}

/**
 * Validate image file and dimensions
 */
export async function validateImage(
  file: File,
  options: ImageValidationOptions = {}
): Promise<ImageValidationResult> {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    minWidth = 100,
    minHeight = 100,
    maxWidth = 4000,
    maxHeight = 4000,
    allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    aspectRatio,
    aspectRatioTolerance = 0.1
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];

  // File size validation
  if (file.size > maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`);
  }

  // File type validation
  if (!allowedFormats.includes(file.type)) {
    errors.push(`File type ${file.type} is not supported. Allowed formats: ${allowedFormats.join(', ')}`);
  }

  // Get image dimensions
  let dimensions: ImageDimensions | undefined;
  try {
    dimensions = await getImageDimensions(file);
  } catch (error) {
    errors.push('Unable to read image dimensions. File may be corrupted.');
    return { isValid: false, errors, warnings };
  }

  // Dimension validation
  if (dimensions.width < minWidth) {
    errors.push(`Image width (${dimensions.width}px) is below minimum required width (${minWidth}px)`);
  }

  if (dimensions.height < minHeight) {
    errors.push(`Image height (${dimensions.height}px) is below minimum required height (${minHeight}px)`);
  }

  if (dimensions.width > maxWidth) {
    warnings.push(`Image width (${dimensions.width}px) exceeds recommended maximum (${maxWidth}px). Image will be resized.`);
  }

  if (dimensions.height > maxHeight) {
    warnings.push(`Image height (${dimensions.height}px) exceeds recommended maximum (${maxHeight}px). Image will be resized.`);
  }

  // Aspect ratio validation
  if (aspectRatio) {
    const imageAspectRatio = dimensions.width / dimensions.height;
    const difference = Math.abs(imageAspectRatio - aspectRatio);
    
    if (difference > aspectRatioTolerance) {
      warnings.push(`Image aspect ratio (${imageAspectRatio.toFixed(2)}) differs from recommended ratio (${aspectRatio.toFixed(2)})`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    dimensions
  };
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Resize image to fit within maximum dimensions
 */
export function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw image
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert image to different format
 */
export function convertImageFormat(
  file: File,
  targetFormat: string,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Fill white background for JPEG
      if (targetFormat === 'image/jpeg') {
        ctx!.fillStyle = '#FFFFFF';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const extension = targetFormat.split('/')[1];
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
            const convertedFile = new File([blob], `${nameWithoutExt}.${extension}`, {
              type: targetFormat,
              lastModified: Date.now()
            });
            resolve(convertedFile);
          } else {
            resolve(file);
          }
        },
        targetFormat,
        quality
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate image thumbnail
 */
export function generateThumbnail(
  file: File,
  size: number = 150,
  quality: number = 0.7
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate square crop
      const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
      const x = (img.naturalWidth - minDimension) / 2;
      const y = (img.naturalHeight - minDimension) / 2;

      canvas.width = size;
      canvas.height = size;
      
      ctx?.drawImage(img, x, y, minDimension, minDimension, 0, 0, size, size);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], `thumb_${file.name}`, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(thumbnailFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Get image file extension from MIME type
 */
export function getImageExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/svg+xml': 'svg'
  };
  
  return extensions[mimeType] || 'jpg';
}

/**
 * Create image preview URL
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke image preview URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Batch process images
 */
export async function batchProcessImages(
  files: File[],
  processor: (file: File) => Promise<File>
): Promise<File[]> {
  const processedFiles: File[] = [];
  
  for (const file of files) {
    try {
      const processed = await processor(file);
      processedFiles.push(processed);
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
      processedFiles.push(file); // Use original file if processing fails
    }
  }
  
  return processedFiles;
}

/**
 * Extract EXIF data from image (basic implementation)
 */
export function extractImageMetadata(file: File): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const metadata = {
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        name: file.name
      };
      
      resolve(metadata);
    };
    
    img.onerror = () => resolve({});
    img.src = URL.createObjectURL(file);
  });
}