/**
 * Service Form Component
 * Form for creating and editing services with image upload support
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ServiceType, ServiceStatus, type CreateServiceRequest, type ServiceDto } from '../../types/marketplace/service.types';
import { ServiceImageUpload } from './ServiceImageUpload';
import { type ImageUploadResult } from '../../services/marketplace/image-upload.service';
import { Card } from '../ui/Card';
import { Button } from '../forms/buttons/Button';
import { Input } from '../forms/inputs/Input';
import { Textarea } from '../forms/inputs/Textarea';
import { Select } from '../forms/inputs/Select';
import { Label } from '../forms/inputs/Label';
import { Loader2 } from 'lucide-react';

// Form validation schema
const serviceFormSchema = z.object({
  serviceProviderId: z.string().min(1, 'Service provider is required'),
  name: z.string().min(1, 'Service name is required').max(100, 'Name must be less than 100 characters'),
  title: z.string().min(1, 'Service title is required').max(150, 'Title must be less than 150 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(300, 'Short description must be less than 300 characters'),
  basePrice: z.number().min(0, 'Base price must be positive'),
  maxPrice: z.number().optional(),
  estimatedDuration: z.number().min(1, 'Estimated duration must be at least 1 minute'),
  maxDuration: z.number().optional(),
  serviceType: z.nativeEnum(ServiceType),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  requirements: z.string().optional(),
  inclusions: z.string().optional(),
  exclusions: z.string().optional(),
  tags: z.string().optional(),
  requiresApproval: z.boolean().optional(),
  sortOrder: z.number().optional()
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

export interface ServiceFormProps {
  /** Existing service data for editing */
  service?: ServiceDto;
  /** Service providers for selection */
  serviceProviders?: Array<{ id: string; name: string }>;
  /** Service categories for selection */
  categories?: Array<{ id: string; name: string }>;
  /** Whether form is in loading state */
  loading?: boolean;
  /** Whether form is disabled */
  disabled?: boolean;
  /** Callback when form is submitted */
  onSubmit?: (data: CreateServiceRequest, images: ImageUploadResult[]) => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Custom CSS class */
  className?: string;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  serviceProviders = [],
  categories = [],
  loading = false,
  disabled = false,
  onSubmit,
  onCancel,
  className
}) => {
  const [images, setImages] = useState<ImageUploadResult[]>([]);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceProviderId: service?.serviceProviderId || '',
      name: service?.name || '',
      title: service?.title || '',
      description: service?.description || '',
      shortDescription: service?.shortDescription || '',
      basePrice: service?.basePrice || 0,
      maxPrice: service?.maxPrice || undefined,
      estimatedDuration: service?.estimatedDuration || 60,
      maxDuration: service?.maxDuration || undefined,
      serviceType: service?.serviceType || ServiceType.Maintenance,
      category: service?.category || '',
      subCategory: service?.subCategory || '',
      requirements: service?.requirements || '',
      inclusions: service?.inclusions || '',
      exclusions: service?.exclusions || '',
      tags: service?.tags || '',
      requiresApproval: service?.requiresApproval || false,
      sortOrder: service?.sortOrder || 0
    }
  });

  // Initialize images from existing service
  useEffect(() => {
    if (service?.images) {
      const existingImages: ImageUploadResult[] = service.images.map((url, index) => ({
        url,
        filename: `service-image-${index + 1}.jpg`,
        size: 0,
        uploadedAt: service.updatedAt || service.createdAt
      }));
      setImages(existingImages);
      if (service.imageUrl) {
        setPrimaryImageUrl(service.imageUrl);
      }
    }
  }, [service]);

  const handleFormSubmit = (data: ServiceFormData) => {
    if (onSubmit) {
      onSubmit(data, images);
    }
  };

  const handleImagesChange = (newImages: ImageUploadResult[]) => {
    setImages(newImages);
  };

  const handlePrimaryImageChange = (imageUrl: string) => {
    setPrimaryImageUrl(imageUrl);
  };

  const isFormDisabled = disabled || loading || isSubmitting;

  return (
    <div className={className}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Provider */}
            <div>
              <Label htmlFor="serviceProviderId">Service Provider *</Label>
              <Select
                id="serviceProviderId"
                {...register('serviceProviderId')}
                disabled={isFormDisabled}
                error={errors.serviceProviderId?.message}
              >
                <option value="">Select a service provider</option>
                {serviceProviders.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Service Type */}
            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select
                id="serviceType"
                {...register('serviceType')}
                disabled={isFormDisabled}
                error={errors.serviceType?.message}
              >
                {Object.values(ServiceType).map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                {...register('name')}
                disabled={isFormDisabled}
                error={errors.name?.message}
                placeholder="Enter service name"
              />
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                {...register('title')}
                disabled={isFormDisabled}
                error={errors.title?.message}
                placeholder="Enter service title"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                id="category"
                {...register('category')}
                disabled={isFormDisabled}
                error={errors.category?.message}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Sub Category */}
            <div>
              <Label htmlFor="subCategory">Sub Category</Label>
              <Input
                id="subCategory"
                {...register('subCategory')}
                disabled={isFormDisabled}
                error={errors.subCategory?.message}
                placeholder="Enter sub category"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="mt-4">
            <Label htmlFor="shortDescription">Short Description *</Label>
            <Textarea
              id="shortDescription"
              {...register('shortDescription')}
              disabled={isFormDisabled}
              error={errors.shortDescription?.message}
              placeholder="Brief description of the service"
              rows={2}
            />
          </div>

          {/* Full Description */}
          <div className="mt-4">
            <Label htmlFor="description">Full Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              disabled={isFormDisabled}
              error={errors.description?.message}
              placeholder="Detailed description of the service"
              rows={4}
            />
          </div>
        </Card>

        {/* Pricing & Duration */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pricing & Duration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Base Price */}
            <div>
              <Label htmlFor="basePrice">Base Price ($) *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0"
                {...register('basePrice', { valueAsNumber: true })}
                disabled={isFormDisabled}
                error={errors.basePrice?.message}
                placeholder="0.00"
              />
            </div>

            {/* Max Price */}
            <div>
              <Label htmlFor="maxPrice">Maximum Price ($)</Label>
              <Input
                id="maxPrice"
                type="number"
                step="0.01"
                min="0"
                {...register('maxPrice', { valueAsNumber: true })}
                disabled={isFormDisabled}
                error={errors.maxPrice?.message}
                placeholder="0.00"
              />
            </div>

            {/* Estimated Duration */}
            <div>
              <Label htmlFor="estimatedDuration">Estimated Duration (minutes) *</Label>
              <Input
                id="estimatedDuration"
                type="number"
                min="1"
                {...register('estimatedDuration', { valueAsNumber: true })}
                disabled={isFormDisabled}
                error={errors.estimatedDuration?.message}
                placeholder="60"
              />
            </div>

            {/* Max Duration */}
            <div>
              <Label htmlFor="maxDuration">Maximum Duration (minutes)</Label>
              <Input
                id="maxDuration"
                type="number"
                min="1"
                {...register('maxDuration', { valueAsNumber: true })}
                disabled={isFormDisabled}
                error={errors.maxDuration?.message}
                placeholder="120"
              />
            </div>
          </div>
        </Card>

        {/* Service Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Service Details</h3>
          
          <div className="space-y-4">
            {/* Requirements */}
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                {...register('requirements')}
                disabled={isFormDisabled}
                error={errors.requirements?.message}
                placeholder="What the customer needs to provide or prepare"
                rows={3}
              />
            </div>

            {/* Inclusions */}
            <div>
              <Label htmlFor="inclusions">What's Included</Label>
              <Textarea
                id="inclusions"
                {...register('inclusions')}
                disabled={isFormDisabled}
                error={errors.inclusions?.message}
                placeholder="What's included in the service"
                rows={3}
              />
            </div>

            {/* Exclusions */}
            <div>
              <Label htmlFor="exclusions">What's Not Included</Label>
              <Textarea
                id="exclusions"
                {...register('exclusions')}
                disabled={isFormDisabled}
                error={errors.exclusions?.message}
                placeholder="What's not included in the service"
                rows={3}
              />
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...register('tags')}
                disabled={isFormDisabled}
                error={errors.tags?.message}
                placeholder="Comma-separated tags (e.g., quick, mobile, emergency)"
              />
            </div>
          </div>
        </Card>

        {/* Service Images */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Service Images</h3>
          <ServiceImageUpload
            serviceId={service?.id}
            existingImages={images}
            maxImages={5}
            onImagesChange={handleImagesChange}
            onPrimaryImageChange={handlePrimaryImageChange}
            disabled={isFormDisabled}
            uploadOptions={{
              maxSize: 5 * 1024 * 1024, // 5MB
              compress: true,
              quality: 0.8
            }}
          />
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isFormDisabled}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isFormDisabled}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {service ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              service ? 'Update Service' : 'Create Service'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;