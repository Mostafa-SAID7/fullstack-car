# Product Image Upload Implementation

This document describes the implementation of image upload functionality for products in the Dashboard application.

## Overview

The image upload system provides a complete solution for managing product images, including:

- **Drag & Drop Upload**: Intuitive drag-and-drop interface
- **Multiple Image Support**: Upload up to 5 images per product
- **Image Processing**: Automatic compression and resizing
- **Primary Image Management**: Set and change primary product image
- **Progress Tracking**: Real-time upload progress indicators
- **Validation**: File type, size, and dimension validation
- **Error Handling**: Comprehensive error reporting and recovery

## Components

### 1. ProductImageUpload Component

The main component for handling product image uploads.

```tsx
import { ProductImageUpload } from './ProductImageUpload';

<ProductImageUpload
  productId="product-123"
  existingImages={existingImages}
  maxImages={5}
  onImagesChange={(images) => setImages(images)}
  onPrimaryImageChange={(url) => setPrimaryImage(url)}
  uploadOptions={{
    maxSize: 5 * 1024 * 1024, // 5MB
    compress: true,
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080
  }}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `productId` | `string?` | - | Product ID for backend uploads |
| `existingImages` | `ImageUploadResult[]` | `[]` | Pre-existing product images |
| `maxImages` | `number` | `5` | Maximum number of images allowed |
| `uploadOptions` | `ImageUploadOptions` | - | Upload configuration options |
| `onImagesChange` | `(images: ImageUploadResult[]) => void` | - | Callback when images change |
| `onPrimaryImageChange` | `(url: string) => void` | - | Callback when primary image changes |
| `disabled` | `boolean` | `false` | Whether upload is disabled |

### 2. Enhanced ProductForm Component

The ProductForm has been enhanced to include image upload functionality.

```tsx
import { ProductForm } from './ProductForm';

<ProductForm
  initialData={productData}
  existingImages={productImages}
  productId={productId}
  mode="edit"
  onSubmit={async (data, images) => {
    // Handle form submission with images
    await updateProduct(data);
    console.log('Uploaded images:', images);
  }}
/>
```

## Services

### 1. ImageUploadService

Handles all image upload operations and processing.

```typescript
import { imageUploadService } from '../../services/marketplace/image-upload.service';

// Upload single image
const result = await imageUploadService.uploadProductImage(
  productId,
  file,
  {
    maxSize: 5 * 1024 * 1024,
    compress: true,
    quality: 0.8
  },
  (progress) => console.log(`Upload progress: ${progress.progress}%`)
);

// Upload multiple images
const results = await imageUploadService.uploadProductImages(
  productId,
  files,
  uploadOptions,
  (progress) => console.log(`Overall progress: ${progress.progress}%`),
  (result, index) => console.log(`File ${index} uploaded:`, result)
);

// Delete image
await imageUploadService.deleteProductImage(productId, imageUrl);

// Set primary image
await imageUploadService.setPrimaryProductImage(productId, imageUrl);
```

#### Methods

- `validateImage(file, options)` - Validate image file
- `uploadProductImage(productId, file, options, onProgress)` - Upload single image
- `uploadProductImages(productId, files, options, onProgress, onFileComplete)` - Upload multiple images
- `deleteProductImage(productId, imageUrl)` - Delete image
- `getProductImages(productId)` - Get all product images
- `setPrimaryProductImage(productId, imageUrl)` - Set primary image

## Utilities

### Image Utilities

Helper functions for image processing and validation.

```typescript
import { 
  validateImage, 
  resizeImage, 
  generateThumbnail,
  formatFileSize 
} from '../../utils/image.utils';

// Validate image
const validation = await validateImage(file, {
  maxSize: 5 * 1024 * 1024,
  minWidth: 100,
  minHeight: 100,
  maxWidth: 4000,
  maxHeight: 4000,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp']
});

// Resize image
const resizedFile = await resizeImage(file, 1920, 1080, 0.8);

// Generate thumbnail
const thumbnail = await generateThumbnail(file, 150, 0.7);
```

## Backend Integration

### API Endpoints

The image upload system expects the following backend endpoints:

```
POST   /api/v6/marketplace/products/{id}/images        - Upload image
GET    /api/v6/marketplace/products/{id}/images        - Get all images
DELETE /api/v6/marketplace/products/{id}/images        - Delete image
PATCH  /api/v6/marketplace/products/{id}/images/primary - Set primary image
```

### Request/Response Format

#### Upload Request
```typescript
// FormData with:
// - file: File (the image file)
// - productId: string
// - type: 'product-image'
```

#### Upload Response
```typescript
interface ImageUploadResult {
  url: string;
  filename: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  uploadedAt: string;
}
```

## Configuration

### Upload Options

```typescript
interface ImageUploadOptions {
  maxSize?: number;           // Maximum file size (default: 5MB)
  allowedFormats?: string[];  // Allowed MIME types
  compress?: boolean;         // Enable compression (default: true)
  quality?: number;           // Compression quality 0-1 (default: 0.8)
  maxWidth?: number;          // Maximum width (default: 1920)
  maxHeight?: number;         // Maximum height (default: 1080)
}
```

### Default Settings

- **Maximum file size**: 5MB
- **Maximum images per product**: 5
- **Supported formats**: JPEG, PNG, WebP, GIF
- **Compression quality**: 80%
- **Maximum dimensions**: 1920×1080

## Usage Examples

### Basic Usage

```tsx
function ProductEditPage() {
  const [images, setImages] = useState<ImageUploadResult[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string>('');

  return (
    <ProductImageUpload
      productId="product-123"
      onImagesChange={setImages}
      onPrimaryImageChange={setPrimaryImage}
    />
  );
}
```

### With Form Integration

```tsx
function ProductForm() {
  const [formData, setFormData] = useState<CreateProductRequest>({});
  const [images, setImages] = useState<ImageUploadResult[]>([]);

  const handleSubmit = async (data: CreateProductRequest, uploadedImages?: ImageUploadResult[]) => {
    // Update form data with primary image URL
    const finalData = {
      ...data,
      imageUrl: uploadedImages?.[0]?.url
    };

    await createProduct(finalData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields */}
      
      <ProductImageUpload
        onImagesChange={setImages}
        onPrimaryImageChange={(url) => 
          setFormData(prev => ({ ...prev, imageUrl: url }))
        }
      />
    </form>
  );
}
```

### Preview Mode (No Backend)

```tsx
// When no productId is provided, component works in preview mode
<ProductImageUpload
  productId={undefined}
  onImagesChange={(images) => {
    // Images will have preview URLs instead of backend URLs
    console.log('Preview images:', images);
  }}
/>
```

## Error Handling

The system provides comprehensive error handling:

### Validation Errors
- File size exceeds limit
- Unsupported file format
- Invalid image dimensions
- Corrupted image files

### Upload Errors
- Network connectivity issues
- Server errors (4xx, 5xx)
- Timeout errors
- Authentication failures

### Error Display
- Visual error indicators on failed uploads
- Detailed error messages
- Retry mechanisms
- Graceful degradation

## Performance Considerations

### Image Processing
- Client-side compression reduces upload time
- Automatic resizing prevents oversized images
- Progressive JPEG encoding for better loading

### Upload Optimization
- Parallel uploads for multiple files
- Progress tracking for user feedback
- Automatic retry on transient failures
- Request cancellation support

### Memory Management
- Automatic cleanup of preview URLs
- Efficient canvas-based image processing
- Minimal memory footprint

## Testing

### Demo Component

Use the `ProductImageUploadDemo` component to test functionality:

```tsx
import { ProductImageUploadDemo } from './ProductImageUploadDemo';

// Renders a complete demo with controls and examples
<ProductImageUploadDemo />
```

### Manual Testing Checklist

- [ ] Drag and drop single image
- [ ] Drag and drop multiple images
- [ ] Click to select images
- [ ] Upload progress indication
- [ ] Primary image selection
- [ ] Image removal
- [ ] Error handling (oversized files, wrong formats)
- [ ] Maximum image limit enforcement
- [ ] Form integration
- [ ] Preview mode (no productId)

## Future Enhancements

### Planned Features
- [ ] Image cropping interface
- [ ] Bulk image operations
- [ ] Image metadata editing
- [ ] Advanced image filters
- [ ] CDN integration
- [ ] Image optimization service
- [ ] Batch upload from URLs
- [ ] Image gallery management

### Performance Improvements
- [ ] WebP format conversion
- [ ] Progressive image loading
- [ ] Image lazy loading
- [ ] Thumbnail generation
- [ ] Client-side caching

## Troubleshooting

### Common Issues

1. **Images not uploading**
   - Check network connectivity
   - Verify backend endpoint availability
   - Ensure proper authentication

2. **Large file upload failures**
   - Reduce image quality setting
   - Enable compression
   - Check server upload limits

3. **Preview images not showing**
   - Verify browser support for FileReader API
   - Check for CORS issues
   - Ensure proper file selection

4. **Memory issues with large images**
   - Enable image compression
   - Reduce maximum dimensions
   - Implement progressive loading

### Debug Mode

Enable debug logging:

```typescript
// Set in browser console
localStorage.setItem('DEBUG_IMAGE_UPLOAD', 'true');
```

This will log detailed information about:
- Image validation results
- Upload progress
- Error details
- Performance metrics

## Browser Support

### Required APIs
- File API
- FileReader API
- Canvas API
- XMLHttpRequest Level 2
- URL.createObjectURL

### Supported Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Fallbacks
- Basic file input for older browsers
- Server-side image processing fallback
- Progressive enhancement approach