/**
 * ProductForm Component
 * Form component for creating and editing products with validation and image upload
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useProductValidation } from '../../hooks/validation/useProductValidation';
import { ProductCategory, ProductStatus, type CreateProductRequest } from '../../types/marketplace/product.types';
import { ProductImageUpload } from './ProductImageUpload';
import { type ImageUploadResult } from '../../services/marketplace/image-upload.service';

export interface ProductFormProps {
  /** Initial product data for editing (optional) */
  initialData?: Partial<CreateProductRequest>;
  /** Existing product images */
  existingImages?: ImageUploadResult[];
  /** Product ID for image uploads (required for editing) */
  productId?: string;
  /** Form mode: create or edit */
  mode?: 'create' | 'edit';
  /** Callback when form is submitted successfully */
  onSubmit: (data: CreateProductRequest, images?: ImageUploadResult[]) => Promise<void>;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Whether the form is currently submitting */
  isSubmitting?: boolean;
}

/**
 * ProductForm Component
 * Demonstrates proper usage of product validation
 */
export function ProductForm({
  initialData,
  existingImages = [],
  productId,
  mode = 'create',
  onSubmit,
  onCancel,
  isSubmitting = false
}: ProductFormProps) {
  const {
    validateCreateProduct,
    validateField,
    errors,
    clearFieldError,
    hasFieldError,
    getFieldError
  } = useProductValidation();

  // Form state
  const [formData, setFormData] = useState<Partial<CreateProductRequest>>({
    name: '',
    description: '',
    sku: '',
    price: 0,
    stockQuantity: 0,
    minStockLevel: 0,
    category: ProductCategory.General,
    weight: 0,
    isFeatured: false,
    isDigital: false,
    ...initialData
  });

  // Image state
  const [productImages, setProductImages] = useState<ImageUploadResult[]>(existingImages);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>(
    existingImages.find(img => img.url)?.url || ''
  );

  // Handle field change with validation
  const handleFieldChange = useCallback(
    (fieldName: keyof CreateProductRequest, value: any) => {
      // Update form data
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value
      }));

      // Validate field on change
      validateField(fieldName, value, 'create');
    },
    [validateField]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate entire form
      const validationResult = await validateCreateProduct(formData);

      if (!validationResult.isValid) {
        // Show validation errors
        console.error('Validation errors:', validationResult.errors);
        return;
      }

      // Update form data with primary image URL
      const finalFormData = {
        ...formData,
        imageUrl: primaryImageUrl || undefined
      } as CreateProductRequest;

      // Submit form
      try {
        await onSubmit(finalFormData, productImages);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [formData, productImages, primaryImageUrl, validateCreateProduct, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          onBlur={() => validateField('name', formData.name, 'create')}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            hasFieldError('name')
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Enter product name"
          disabled={isSubmitting}
        />
        {hasFieldError('name') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          onBlur={() => validateField('description', formData.description, 'create')}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            hasFieldError('description')
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Enter product description"
          disabled={isSubmitting}
        />
        {hasFieldError('description') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('description')}</p>
        )}
      </div>

      {/* SKU */}
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
          SKU <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="sku"
          value={formData.sku}
          onChange={(e) => handleFieldChange('sku', e.target.value.toUpperCase())}
          onBlur={() => validateField('sku', formData.sku, 'create')}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            hasFieldError('sku')
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="e.g., PROD-12345"
          disabled={isSubmitting}
        />
        {hasFieldError('sku') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('sku')}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Use uppercase letters, numbers, and hyphens only
        </p>
      </div>

      {/* Price and Discount Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
              onBlur={() => validateField('price', formData.price, 'create')}
              step="0.01"
              min="0"
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                hasFieldError('price')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>
          {hasFieldError('price') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('price')}</p>
          )}
        </div>

        <div>
          <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Discount Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="discountPrice"
              value={formData.discountPrice || ''}
              onChange={(e) =>
                handleFieldChange('discountPrice', e.target.value ? parseFloat(e.target.value) : null)
              }
              onBlur={() => validateField('discountPrice', formData.discountPrice, 'create')}
              step="0.01"
              min="0"
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                hasFieldError('discountPrice')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>
          {hasFieldError('discountPrice') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('discountPrice')}</p>
          )}
        </div>
      </div>

      {/* Stock Quantity and Min Stock Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stockQuantity"
            value={formData.stockQuantity}
            onChange={(e) => handleFieldChange('stockQuantity', parseInt(e.target.value) || 0)}
            onBlur={() => validateField('stockQuantity', formData.stockQuantity, 'create')}
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              hasFieldError('stockQuantity')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="0"
            disabled={isSubmitting}
          />
          {hasFieldError('stockQuantity') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('stockQuantity')}</p>
          )}
        </div>

        <div>
          <label htmlFor="minStockLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Min Stock Level <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="minStockLevel"
            value={formData.minStockLevel}
            onChange={(e) => handleFieldChange('minStockLevel', parseInt(e.target.value) || 0)}
            onBlur={() => validateField('minStockLevel', formData.minStockLevel, 'create')}
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              hasFieldError('minStockLevel')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="0"
            disabled={isSubmitting}
          />
          {hasFieldError('minStockLevel') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('minStockLevel')}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleFieldChange('category', e.target.value as ProductCategory)}
          onBlur={() => validateField('category', formData.category, 'create')}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            hasFieldError('category')
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={isSubmitting}
        >
          {Object.values(ProductCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {hasFieldError('category') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('category')}</p>
        )}
      </div>

      {/* Weight */}
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
          Weight (kg) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="weight"
          value={formData.weight}
          onChange={(e) => handleFieldChange('weight', parseFloat(e.target.value) || 0)}
          onBlur={() => validateField('weight', formData.weight, 'create')}
          step="0.01"
          min="0"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            hasFieldError('weight')
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="0.00"
          disabled={isSubmitting}
        />
        {hasFieldError('weight') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('weight')}</p>
        )}
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            value={formData.brand || ''}
            onChange={(e) => handleFieldChange('brand', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter brand name"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            id="model"
            value={formData.model || ''}
            onChange={(e) => handleFieldChange('model', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter model"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => handleFieldChange('isFeatured', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <span className="text-sm font-medium text-gray-700">Featured Product</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isDigital}
            onChange={(e) => handleFieldChange('isDigital', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <span className="text-sm font-medium text-gray-700">Digital Product</span>
        </label>
      </div>

      {/* Product Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Product Images
        </label>
        <ProductImageUpload
          productId={productId}
          existingImages={existingImages}
          maxImages={5}
          onImagesChange={setProductImages}
          onPrimaryImageChange={setPrimaryImageUrl}
          disabled={isSubmitting}
          uploadOptions={{
            maxSize: 5 * 1024 * 1024, // 5MB
            compress: true,
            quality: 0.8,
            maxWidth: 1920,
            maxHeight: 1080
          }}
        />
        <p className="mt-2 text-xs text-gray-500">
          Upload up to 5 high-quality images. The first image will be used as the primary product image.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
        </button>
      </div>
    </form>
  );
}
