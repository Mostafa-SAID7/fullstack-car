/**
 * ServiceList Component
 * Displays services in a responsive table with filtering, sorting, and bulk operations
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Wrench, Edit, Trash2, Eye, Star, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ResponsiveTable } from '../../../../components/shared/ResponsiveTable';
import { useServices } from '../../../../hooks/marketplace';
import { serviceManagementService } from '../../../../services/marketplace';
import type { ServiceDto, ServiceFilters, ServiceStatus } from '../../../../types/marketplace';

interface ServiceListProps {
  /** Optional filters to apply */
  filters?: ServiceFilters;
  /** Callback when a service is clicked */
  onServiceClick?: (service: ServiceDto) => void;
  /** Callback when edit is clicked */
  onEditService?: (service: ServiceDto) => void;
  /** Callback when delete is clicked */
  onDeleteService?: (service: ServiceDto) => void;
  /** Whether to show bulk actions */
  showBulkActions?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Format currency value
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

/**
 * Format duration in minutes to hours/minutes
 */
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Get status badge color
 */
const getStatusColor = (status: ServiceStatus): string => {
  const colors: Record<string, string> = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Suspended: 'bg-red-100 text-red-800',
    Archived: 'bg-orange-100 text-orange-800',
    Draft: 'bg-blue-100 text-blue-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status icon
 */
const getStatusIcon = (status: ServiceStatus) => {
  const icons: Record<string, React.ReactNode> = {
    Active: <CheckCircle className="w-4 h-4" />,
    Inactive: <XCircle className="w-4 h-4" />,
    Suspended: <AlertTriangle className="w-4 h-4" />,
    Archived: <XCircle className="w-4 h-4" />,
    Draft: <Edit className="w-4 h-4" />
  };
  return icons[status] || null;
};

/**
 * ServiceList Component
 */
export function ServiceList({
  filters,
  onServiceClick,
  onEditService,
  onDeleteService,
  showBulkActions = false,
  className = ''
}: ServiceListProps) {
  const { services, loading, error, refetch } = useServices({ 
    initialFilters: filters,
    autoFetch: true 
  });

  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle service selection
  const handleSelectService = useCallback((serviceId: string) => {
    setSelectedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  }, []);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (services && selectedServices.size === services.items.length) {
      setSelectedServices(new Set());
    } else if (services) {
      setSelectedServices(new Set(services.items.map(s => s.id)));
    }
  }, [services, selectedServices]);

  // Handle bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (selectedServices.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedServices.size} service(s)?`)) {
      return;
    }

    try {
      await serviceManagementService.bulkDelete(Array.from(selectedServices));
      setSelectedServices(new Set());
      await refetch();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Failed to delete services. Please try again.');
    }
  }, [selectedServices, refetch]);

  // Handle bulk status update
  const handleBulkStatusUpdate = useCallback(async (status: ServiceStatus) => {
    if (selectedServices.size === 0) return;

    try {
      await serviceManagementService.bulkUpdateStatus(Array.from(selectedServices), status);
      setSelectedServices(new Set());
      await refetch();
    } catch (error) {
      console.error('Bulk status update failed:', error);
      alert('Failed to update service status. Please try again.');
    }
  }, [selectedServices, refetch]);

  // Sort services
  const sortedServices = useMemo(() => {
    if (!services) return [];

    const sorted = [...services.items].sort((a, b) => {
      let aValue: any = a[sortBy as keyof ServiceDto];
      let bValue: any = b[sortBy as keyof ServiceDto];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [services, sortBy, sortDirection]);

  // Define table columns
  const columns = useMemo(() => [
    ...(showBulkActions ? [{
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={services ? selectedServices.size === services.items.length : false}
          onChange={handleSelectAll}
          className="rounded border-gray-300"
        />
      ),
      render: (service: ServiceDto) => (
        <input
          type="checkbox"
          checked={selectedServices.has(service.id)}
          onChange={() => handleSelectService(service.id)}
          className="rounded border-gray-300"
        />
      ),
      className: 'w-12'
    }] : []),
    {
      key: 'icon',
      header: 'Icon',
      render: () => (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-blue-600" />
        </div>
      ),
      hideOnMobile: true,
      className: 'w-16'
    },
    {
      key: 'name',
      header: 'Service Name',
      render: (service: ServiceDto) => (
        <div>
          <div className="font-medium text-foreground">{service.name}</div>
          <div className="text-xs text-muted-foreground">{service.serviceType}</div>
        </div>
      ),
      mobileRender: (service: ServiceDto) => (
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Wrench className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-foreground">{service.name}</div>
            <div className="text-xs text-muted-foreground">{service.serviceType}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (service: ServiceDto) => (
        <span className="text-sm text-foreground">{service.category}</span>
      )
    },
    {
      key: 'price',
      header: 'Price',
      render: (service: ServiceDto) => (
        <div>
          <div className="font-medium text-foreground">
            {formatCurrency(service.basePrice)}
            {service.maxPrice && service.maxPrice !== service.basePrice && (
              <span className="text-xs text-muted-foreground"> - {formatCurrency(service.maxPrice)}</span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (service: ServiceDto) => (
        <span className="text-sm text-foreground">
          {formatDuration(service.estimatedDuration)}
        </span>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (service: ServiceDto) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium text-foreground">
            {service.averageRating.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({service.totalReviews})
          </span>
        </div>
      )
    },
    {
      key: 'bookings',
      header: 'Bookings',
      render: (service: ServiceDto) => (
        <span className="text-sm font-medium text-foreground">
          {service.totalBookings}
        </span>
      ),
      hideOnMobile: true
    },
    {
      key: 'status',
      header: 'Status',
      render: (service: ServiceDto) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
          {getStatusIcon(service.status)}
          {service.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (service: ServiceDto) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onServiceClick?.(service);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditService?.(service);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteService?.(service);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ),
      hideOnMobile: true,
      className: 'w-32'
    }
  ], [showBulkActions, selectedServices, services, handleSelectAll, handleSelectService, onServiceClick, onEditService, onDeleteService]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading services</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Bulk Actions Bar */}
      {showBulkActions && selectedServices.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedServices.size} service(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusUpdate('Active' as ServiceStatus)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('Inactive' as ServiceStatus)}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Deactivate
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('Suspended' as ServiceStatus)}
              className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Suspend
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Services Table */}
      <ResponsiveTable
        data={sortedServices}
        columns={columns}
        keyExtractor={(service) => service.id}
        onRowClick={onServiceClick}
        loading={loading}
        emptyMessage="No services found"
        className={className}
      />
    </div>
  );
}
