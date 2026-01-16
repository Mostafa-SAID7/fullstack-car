/**
 * Product Image Upload Component
 * Specialized component for uploading and managing product images
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Star, 
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../forms/buttons/Button';
import { 
  imageUploadService, 
  type ImageUploadResult, 
  type ImageUploadProgress,
  type ImageUploadOptions 
} from '../../services/marketplace/image-upload.service';

export interface ProductImageUploadProps {
  /** Product ID for image association */
  productId?: string;
  /** Existing product images */
  existingImages?: ImageUploadResult[];
  /** Maximum number of images allowed */
  maxImages?: number;
  /** Upload options */
  uploadOptions?: Partial<ImageUploadOptions>;
  /** Callback when images change */
  onImagesChange?: (images: ImageUploadResult[]) => void;
  /** Callback when primary image changes */
  onPrimaryImageChange?: (imageUrl: string) => void;
  /** Whether upload is disabled */
  disabled?: boolean;
  /** Custom CSS class */
  className?: string;
}

interface ImageWithState extends ImageUploadResult {
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
  isPrimary?: boolean;
  previewUrl?: string;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  productId,
  existingImages = [],
  maxImages = 5,
  uploadOptions,
  onImagesChange,
  onPrimaryImageChange,
  disabled = false,
  className
}) => {
  const [images, setImages] = useState<ImageWithState[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize images from existing data
  useEffect(() => {
    if (existingImages.length > 0) {
      const imagesWithState = existingImages.map((img, index) => ({
        ...img,
        isPrimary: index === 0 // First image is primary by default
      }));
      setImages(imagesWithState);
    }
  }, [existingImages]);

  // Notify parent of image changes
  useEffect(() => {
    onImagesChange?.(images.filter(img => !img.error && !img.isUploading));
  }, [images, onImagesChange]);

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (disabled || !files.length) return;

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    setIsUploading(true);

    // Add files to state with uploading status
    const newImages: ImageWithState[] = filesToUpload.map(file => ({
      url: '',
      filename: file.name,
      size: file.size,
      uploadedAt: '',
      isUploading: true,
      uploadProgress: 0,
      previewUrl: imageUploadService.createPreviewUrl(file)
    }));

    setImages(prev => [...prev, ...newImages]);

    // Upload files
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const imageIndex = images.length + i;

      try {
        if (productId) {
          // Upload to backend if productId is available
          const result = await imageUploadService.uploadProductImage(
            productId,
            file,
            uploadOptions,
            (progress: ImageUploadProgress) => {
              setImages(prev => prev.map((img, idx) => 
                idx === imageIndex 
                  ? { ...img, uploadProgress: progress.progress }
                  : img
              ));
            }
          );

          // Update image with result
          setImages(prev => prev.map((img, idx) => 
            idx === imageIndex 
              ? { 
                  ...result, 
                  isUploading: false, 
                  isPrimary: prev.length === 1, // First image is primary
                  previewUrl: img.previewUrl
                }
              : img
          ));

          // Set as primary if it's the first image
          if (images.length === 0 && onPrimaryImageChange) {
            onPrimaryImageChange(result.url);
          }
        } else {
          // Mock upload for form preview (when no productId)
          setTimeout(() => {
            setImages(prev => prev.map((img, idx) => 
              idx === imageIndex 
                ? { 
                    ...img,
                    url: img.previewUrl || '',
                    uploadedAt: new Date().toISOString(),
                    isUploading: false,
                    isPrimary: prev.filter(i => !i.isUploading).length === 0
                  }
                : img
            ));
          }, 1000 + Math.random() * 2000); // Simulate upload time
        }
      } catch (error) {
        setImages(prev => prev.map((img, idx) => 
          idx === imageIndex 
            ? { 
                ...img, 
                isUploading: false, 
                error: error instanceof Error ? error.message : 'Upload failed' 
              }
            : img
        ));
      }
    }

    setIsUploading(false);
  }, [disabled, maxImages, images.length, productId, uploadOptions, onPrimaryImageChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [disabled, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeImage = useCallback(async (index: number) => {
    const image = images[index];
    
    try {
      // Delete from backend if it has a URL and productId
      if (image.url && productId && !image.previewUrl) {
        await imageUploadService.deleteProductImage(productId, image.url);
      }

      // Clean up preview URL
      if (image.previewUrl) {
        imageUploadService.revokePreviewUrl(image.previewUrl);
      }

      // Remove from state
      const newImages = images.filter((_, i) => i !== index);
      
      // If removed image was primary, make first image primary
      if (image.isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
        if (onPrimaryImageChange) {
          onPrimaryImageChange(newImages[0].url);
        }
      }
      
      setImages(newImages);
    } catch (error) {
      console.error('Failed to remove image:', error);
      alert('Failed to remove image. Please try again.');
    }
  }, [images, productId, onPrimaryImageChange]);

  const setPrimaryImage = useCallback(async (index: number) => {
    const image = images[index];
    
    try {
      // Update backend if productId is available
      if (productId && image.url) {
        await imageUploadService.setPrimaryProductImage(productId, image.url);
      }

      // Update state
      const newImages = images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }));
      
      setImages(newImages);
      
      if (onPrimaryImageChange) {
        onPrimaryImageChange(image.url);
      }
    } catch (error) {
      console.error('Failed to set primary image:', error);
      alert('Failed to set primary image. Please try again.');
    }
  }, [images, productId, onPrimaryImageChange]);

  const canUploadMore = images.length < maxImages && !isUploading;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {canUploadMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
            isDragOver && !disabled && 'border-primary bg-primary/5',
            !isDragOver && 'border-border hover:border-primary/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Upload className={cn(
            'w-8 h-8 mx-auto mb-3 transition-colors',
            isDragOver ? 'text-primary' : 'text-muted-foreground'
          )} />
          
          <h4 className="text-sm font-medium text-foreground mb-1">
            {isDragOver ? 'Drop images here' : 'Upload product images'}
          </h4>
          
          <p className="text-xs text-muted-foreground mb-3">
            Drag and drop images here, or click to select
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = true;
              input.onchange = (e) => {
                const files = Array.from((e.target as HTMLInputElement).files || []);
                handleFileSelect(files);
              };
              input.click();
            }}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Uploading...
              </>
            ) : (
              'Select Images'
            )}
          </Button>
          
          <div className="mt-3 text-xs text-muted-foreground">
            <p>Maximum 5MB per image • {maxImages - images.length} slots remaining</p>
            <p>Supported formats: JPEG, PNG, WebP, GIF</p>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={`${image.filename}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  'relative group aspect-square border rounded-lg overflow-hidden bg-card',
                  image.error && 'border-destructive',
                  image.isPrimary && 'ring-2 ring-primary'
                )}
              >
                {/* Image */}
                <div className="w-full h-full">
                  {image.previewUrl || image.url ? (
                    <img
                      src={image.previewUrl || image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                      <div className="text-xs">
                        {image.uploadProgress ? `${Math.round(image.uploadProgress)}%` : 'Uploading...'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {image.error && (
                  <div className="absolute inset-0 bg-destructive/90 flex items-center justify-center p-2">
                    <div className="text-center text-white">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-xs">{image.error}</div>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {!image.isUploading && !image.error && (
                  <>
                    {/* Primary Badge */}
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Primary
                      </div>
                    )}

                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        {!image.isPrimary && (
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => setPrimaryImage(index)}
                            className="h-6 w-6 p-0"
                            title="Set as primary"
                          >
                            <Star className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                          className="h-6 w-6 p-0"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-xs truncate">{image.filename}</div>
                      <div className="text-xs text-gray-300">
                        {(image.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No images uploaded yet</p>
          <p className="text-xs">Add images to showcase your product</p>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;