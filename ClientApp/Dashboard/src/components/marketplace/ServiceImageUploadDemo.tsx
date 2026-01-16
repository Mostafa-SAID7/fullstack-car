/**
 * Service Image Upload Demo Component
 * Demonstrates how to use the ServiceImageUpload component
 */

import React, { useState } from 'react';
import { ServiceImageUpload } from './ServiceImageUpload';
import { type ImageUploadResult } from '../../services/marketplace/image-upload.service';
import { Card } from '../ui/Card';
import { Button } from '../forms/buttons/Button';

export const ServiceImageUploadDemo: React.FC = () => {
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

  const clearImages = () => {
    setImages([]);
    setPrimaryImageUrl('');
  };

  const toggleDisabled = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Service Image Upload Demo
        </h1>
        <p className="text-gray-600">
          Demonstrates the ServiceImageUpload component functionality
        </p>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            onClick={clearImages}
            disabled={images.length === 0}
          >
            Clear All Images
          </Button>
          <Button
            variant="outline"
            onClick={toggleDisabled}
          >
            {isDisabled ? 'Enable Upload' : 'Disable Upload'}
          </Button>
          <div className="text-sm text-gray-600">
            Status: {isDisabled ? 'Disabled' : 'Enabled'}
          </div>
        </div>
      </Card>

      {/* Image Upload Component */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Image Upload</h2>
        <ServiceImageUpload
          serviceId={undefined} // No serviceId for demo (will use preview mode)
          existingImages={[]}
          maxImages={5}
          onImagesChange={handleImagesChange}
          onPrimaryImageChange={handlePrimaryImageChange}
          disabled={isDisabled}
          uploadOptions={{
            maxSize: 5 * 1024 * 1024, // 5MB
            compress: true,
            quality: 0.8
          }}
        />
      </Card>

      {/* Current State Display */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Current State</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Primary Image URL:</h3>
            <div className="bg-gray-100 p-2 rounded text-sm font-mono">
              {primaryImageUrl || 'No primary image set'}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">All Images ({images.length}):</h3>
            <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
              {images.length > 0 ? (
                <div className="space-y-2">
                  {images.map((image, index) => (
                    <div key={index} className="text-sm border-b border-gray-200 pb-2">
                      <div>Filename: {image.filename}</div>
                      <div>Size: {(image.size / 1024).toFixed(1)} KB</div>
                      {image.dimensions && (
                        <div>
                          Dimensions: {image.dimensions.width} × {image.dimensions.height}
                        </div>
                      )}
                      <div>URL: {image.url || 'Preview URL'}</div>
                      <div>Uploaded: {image.uploadedAt || 'Preview mode'}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No images uploaded</div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Instructions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Usage Instructions</h2>
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Drag and drop images onto the upload area</li>
            <li>• Click "Select Images" to choose files from your computer</li>
            <li>• Maximum 5 images allowed (configurable)</li>
            <li>• Supported formats: JPEG, PNG, WebP, GIF</li>
            <li>• Maximum file size: 5MB per image</li>
            <li>• First uploaded image becomes the primary image</li>
            <li>• Click the star icon to set a different primary image</li>
            <li>• Click the X icon to remove an image</li>
            <li>• Images are automatically compressed and resized</li>
            <li>• In demo mode (no serviceId), images are only previewed</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ServiceImageUploadDemo;