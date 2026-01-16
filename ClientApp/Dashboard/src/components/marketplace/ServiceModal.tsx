/**
 * Service Modal Component
 * Modal for creating and editing services with image upload support
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ServiceForm } from './ServiceForm';
import { type ServiceDto, type CreateServiceRequest } from '../../types/marketplace/service.types';
import { type ImageUploadResult } from '../../services/marketplace/image-upload.service';
import { serviceApiService } from '../../services/marketplace';
import { Modal } from '../layout/modals/Modal';
import { useToast } from '../feedback/toasts/ToastProvider';

export interface ServiceModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Existing service data for editing (undefined for creating) */
  service?: ServiceDto;
  /** Service providers for selection */
  serviceProviders?: Array<{ id: string; name: string }>;
  /** Service categories for selection */
  categories?: Array<{ id: string; name: string }>;
  /** Callback when service is successfully created/updated */
  onSuccess?: (service: ServiceDto) => void;
  /** Custom CSS class */
  className?: string;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  serviceProviders = [],
  categories = [],
  onSuccess,
  className
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (data: CreateServiceRequest, images: ImageUploadResult[]) => {
    setLoading(true);
    
    try {
      let result: ServiceDto;
      
      if (service) {
        // Update existing service
        result = await serviceApiService.updateService(service.id, {
          ...data,
          id: service.id
        });
        toast.success('Service updated successfully');
      } else {
        // Create new service
        result = await serviceApiService.createService(data);
        toast.success('Service created successfully');
      }

      // Handle image uploads if service was created/updated successfully
      if (images.length > 0 && result.id) {
        try {
          // Note: In a real implementation, you might want to upload images
          // as part of the service creation/update process, or handle them separately
          console.log('Service images to process:', images);
          
          // For now, we'll just log the images since the backend integration
          // for service images is still being developed
        } catch (imageError) {
          console.error('Failed to process service images:', imageError);
          toast.warning('Service saved but some images failed to upload');
        }
      }

      onSuccess?.(result);
      onClose();
    } catch (error) {
      console.error('Failed to save service:', error);
      toast.error(
        service 
          ? 'Failed to update service. Please try again.' 
          : 'Failed to create service. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) {
      return; // Prevent closing while saving
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={service ? 'Edit Service' : 'Create New Service'}
      size="xl"
      className={className}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        <ServiceForm
          service={service}
          serviceProviders={serviceProviders}
          categories={categories}
          loading={loading}
          disabled={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </Modal>
  );
};

export default ServiceModal;