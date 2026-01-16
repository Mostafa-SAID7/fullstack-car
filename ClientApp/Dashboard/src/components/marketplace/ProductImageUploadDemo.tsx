/**
 * Product Image Upload Demo Component
 * Demonstrates how to use the ProductImageUpload component
 */

import React, { useState } from 'react';
import { ProductImageUpload } from './ProductImageUpload';
import { type ImageUploadResult } from '../../services/marketplace/image-upload.service';
import { Card } from '../ui/Card';
import { Button } from '../forms/buttons/Button';

export const ProductImageUploadDemo: React.FC = () => {
  const [images, setImages] = useState<ImageUploadResult[]>([]);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleImagesChange = (newImages: ImageUploadResult[]) => {
    setImages(newImages);
    console.log('Images changed:', newImages);
  };

  const handlePrimaryImageChange = (imageUrl: string) => {
    setPrimaryImageUrl(imageUrl);
    console.log('Primary image changed:', imageUrl);
  };

  const handleReset = () => {
    setImages([]);
    setPrimaryImageUrl('');
  };

  const handleToggleDisabled = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Product Image Upload Demo
        </h1>
        <p className="text-gray-600">
          Demonstrates the ProductImageUpload component functionality
        </p>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={images.length === 0}
          >
            Reset Images
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleDisabled}
          >
            {isDisabled ? 'Enable' : 'Disable'} Upload
          </Button>
          <div className="text-sm text-gray-600">
            Images: {images.length} | Primary: {primaryImageUrl ? 'Set' : 'None'}
          </div>
        </div>
      </Card>

      {/* Image Upload Component */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Image Upload</h2>
        <ProductImageUpload
          productId={undefined} // No productId for demo (will use preview mode)
          existingImages={[]}
          maxImages={5}
          onImagesChange={handleImagesChange}
          onPrimaryImageChange={handlePrimaryImageChange}
          disabled={isDisabled}
          uploadOptions={{
            maxSize: 5 * 1024 * 1024, // 5MB
            compress: true,
            quality: 0.8,
            maxWidth: 1920,
            maxHeight: 1080
          }}
        />
      </Card>

      {/* Image Data Display */}
      {images.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Image Data</h2>
          <div className="space-y-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {image.filename}
                      {primaryImageUrl === image.url && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Primary
                        </span>
                      )}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Size: {(image.size / 1024).toFixed(1)} KB</div>
                      {image.dimensions && (
                        <div>
                          Dimensions: {image.dimensions.width} × {image.dimensions.height}
                        </div>
                      )}
                      <div>URL: {image.url || 'Preview URL'}</div>
                      <div>Uploaded: {image.uploadedAt || 'Preview mode'}</div>
                    </div>
                  </div>
                  {image.url && (
                    <div className="flex justify-center">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="max-w-32 max-h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Usage Instructions</h2>
        <div className="prose prose-sm max-w-none">
          <h3>Basic Usage</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<ProductImageUpload
  productId="product-123"
  existingImages={existingImages}
  maxImages={5}
  onImagesChange={(images) => setImages(images)}
  onPrimaryImageChange={(url) => setPrimaryImage(url)}
  uploadOptions={{
    maxSize: 5 * 1024 * 1024, // 5MB
    compress: true,
    quality: 0.8
  }}
/>`}
          </pre>

          <h3>Features</h3>
          <ul>
            <li>Drag and drop image upload</li>
            <li>Multiple image selection</li>
            <li>Image compression and resizing</li>
            <li>Primary image selection</li>
            <li>Upload progress tracking</li>
            <li>Image preview and management</li>
            <li>Validation and error handling</li>
          </ul>

          <h3>Supported Formats</h3>
          <p>JPEG, PNG, WebP, GIF (up to 5MB each)</p>

          <h3>Integration Notes</h3>
          <ul>
            <li>When <code>productId</code> is provided, images are uploaded to the backend</li>
            <li>When <code>productId</code> is not provided, component works in preview mode</li>
            <li>Images are automatically compressed and resized based on upload options</li>
            <li>First uploaded image becomes the primary image by default</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ProductImageUploadDemo;