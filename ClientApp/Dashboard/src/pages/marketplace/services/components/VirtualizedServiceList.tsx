/**
 * VirtualizedServiceList Component
 * High-performance service list using virtual scrolling for large datasets
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Wrench, Edit, Trash2, Eye, Star, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { VirtualList } from '../../../../components/shared/VirtualList';
import { useServices } from '../../../../hooks/marketplace';
import { serviceManagementService } from '../../../../services/marketplace';
import { useIsMobile } from '../../../../hooks/useResponsive';
import type { ServiceDto, ServiceFilters, ServiceStatus } from '../../../../types/marketplace';

interface VirtualizedServiceListProps {
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
  /** Container height for virtual scrolling */
  containerHeight?: number;
  /** Item height for virtual scrolling */
  itemHeight?: number;
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
 * Service Row Component for Desktop Table View
 */
interface ServiceRowProps {
  service: ServiceDto;
  isSelected: boolean;
  showBulkActions: boolean;
  onSelect: (serviceId: string) => void;
  onServiceClick?: (service: ServiceDto) => void;
  onEditService?: (service: ServiceDto) => void;
  onDeleteService?: (service: ServiceDto) => void;
}

const ServiceRow: React.FC<ServiceRowProps> = ({
  service,
  isSelected,
  showBulkActions,
  onSelect,
  onServiceClick,
  onEditService,
  onDeleteService
}) => (
  <div
    className={`flex items-center border-b border-border hover:bg-muted/50 ${
      onServiceClick ? 'cursor-pointer' : ''
    }`}
    onClick={() => onServiceClick?.(service)}
  >
    {/* Selection Checkbox */}
    {showBulkActions && (
      <div className="w-12 px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(service.id);
          }}
          className="rounded border-gray-300"
        />
      </div>
    )}

    {/* Service Icon */}
    <div className="w-20 px-4 py-3">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
        <Wrench className="w-6 h-6 text-blue-600" />
      </div>
    </div>

    {/* Service Name & Type */}
    <div className="flex-1 px-4 py-3">
      <div className="font-medium text-foreground">{service.name}</div>
      <div className="text-xs text-muted-foreground">{service.serviceType}</div>
    </div>

    {/* Category */}
    <div className="w-32 px-4 py-3">
      <span className="text-sm text-foreground">{service.category}</span>
    </div>

    {/* Price */}
    <div className="w-32 px-4 py-3">
      <div className="font-medium text-foreground">
        {formatCurrency(service.basePrice)}
        {service.maxPrice && service.maxPrice !== service.basePrice && (
          <span className="text-xs text-muted-foreground"> - {formatCurrency(service.maxPrice)}</span>
        )}
      </div>
    </div>

    {/* Duration */}
    <div className="w-24 px-4 py-3">
      <span className="text-sm text-foreground">
        {formatDuration(service.estimatedDuration)}
      </span>
    </div>

    {/* Rating */}
    <div className="w-28 px-4 py-3">
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-medium text-foreground">
          {service.averageRating.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">
          ({service.totalReviews})
        </span>
      </div>
    </div>

    {/* Bookings */}
    <div className="w-24 px-4 py-3">
      <span className="text-sm font-medium text-foreground">
        {service.totalBookings}
      </span>
    </div>

    {/* Status */}
    <div className="w-32 px-4 py-3">
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
        {getStatusIcon(service.status)}
        {service.status}
      </span>
    </div>

    {/* Actions */}
    <div className="w-32 px-4 py-3">
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
    </div>
  </div>
);

/**
 * Service Card Component for Mobile View
 */
interface ServiceCardProps {
  service: ServiceDto;
  isSelected: boolean;
  showBulkActions: boolean;
  onSelect: (serviceId: string) => void;
  onServiceClick?: (service: ServiceDto) => void;
  onEditService?: (service: ServiceDto) => void;
  onDeleteService?: (service: ServiceDto) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  showBulkActions,
  onSelect,
  onServiceClick,
  onEditService,
  onDeleteService
}) => (
  <div
    className={`card ${onServiceClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    onClick={() => onServiceClick?.(service)}
  >
    <div className="card-body space-y-3">
      {/* Header with icon and selection */}
      <div className="flex items-start gap-3">
        {showBulkActions && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(service.id);
            }}
            className="rounded border-gray-300 mt-1"
          />
        )}
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Wrench className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-foreground">{service.name}</div>
          <div className="text-xs text-muted-foreground">{service.serviceType}</div>
        </div>
      </div>

      {/* Service Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-xs font-medium text-muted-foreground">Category</span>
          <div className="text-foreground">{service.category}</div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">Price</span>
          <div className="text-foreground font-medium">
            {formatCurrency(service.basePrice)}
            {service.maxPrice && service.maxPrice !== service.basePrice && (
              <span className="text-xs text-muted-foreground"> - {formatCurrency(service.maxPrice)}</span>
            )}
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">Duration</span>
          <div className="text-foreground">
            {formatDuration(service.estimatedDuration)}
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">Rating</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-foreground">
              {service.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({service.totalReviews})
            </span>
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">Bookings</span>
          <div className="text-foreground font-medium">{service.totalBookings}</div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <div>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
              {getStatusIcon(service.status)}
              {service.status}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onServiceClick?.(service);
          }}
          className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditService?.(service);
          }}
          className="flex-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteService?.(service);
          }}
          className="flex-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  </div>
);

/**
 * VirtualizedServiceList Component
 */
export function VirtualizedServiceList({
  filters,
  onServiceClick,
  onEditService,
  onDeleteService,
  showBulkActions = false,
  className = '',
  containerHeight = 600,
  itemHeight
}: VirtualizedServiceListProps) {
  const isMobile = useIsMobile();
  const { services, loading, error, refetch } = useServices({ 
    initialFilters: filters,
    autoFetch: true 
  });

  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Calculate item height based on device type
  const calculatedItemHeight = itemHeight || (isMobile ? 220 : 80);

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

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [services, sortBy, sortDirection]);

  // Render item function for VirtualList
  const renderItem = useCallback((service: ServiceDto, index: number) => {
    const isSelected = selectedServices.has(service.id);

    if (isMobile) {
      return (
        <ServiceCard
          key={service.id}
          service={service}
          isSelected={isSelected}
          showBulkActions={showBulkActions}
          onSelect={handleSelectService}
          onServiceClick={onServiceClick}
          onEditService={onEditService}
          onDeleteService={onDeleteService}
        />
      );
    }

    return (
      <ServiceRow
        key={service.id}
        service={service}
        isSelected={isSelected}
        showBulkActions={showBulkActions}
        onSelect={handleSelectService}
        onServiceClick={onServiceClick}
        onEditService={onEditService}
        onDeleteService={onDeleteService}
      />
    );
  }, [
    selectedServices,
    isMobile,
    showBulkActions,
    handleSelectService,
    onServiceClick,
    onEditService,
    onDeleteService
  ]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!services || services.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No services found</p>
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

      {/* Table Header (Desktop only) */}
      {!isMobile && (
        <div className="bg-muted/30 border-b border-border">
          <div className="flex items-center">
            {showBulkActions && (
              <div className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedServices.size === sortedServices.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </div>
            )}
            <div className="w-20 px-4 py-3 text-sm font-medium text-muted-foreground">Icon</div>
            <div className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground">Service Name</div>
            <div className="w-32 px-4 py-3 text-sm font-medium text-muted-foreground">Category</div>
            <div className="w-32 px-4 py-3 text-sm font-medium text-muted-foreground">Price</div>
            <div className="w-24 px-4 py-3 text-sm font-medium text-muted-foreground">Duration</div>
            <div className="w-28 px-4 py-3 text-sm font-medium text-muted-foreground">Rating</div>
            <div className="w-24 px-4 py-3 text-sm font-medium text-muted-foreground">Bookings</div>
            <div className="w-32 px-4 py-3 text-sm font-medium text-muted-foreground">Status</div>
            <div className="w-32 px-4 py-3 text-sm font-medium text-muted-foreground">Actions</div>
          </div>
        </div>
      )}

      {/* Virtualized List */}
      <VirtualList
        items={sortedServices}
        itemHeight={calculatedItemHeight}
        containerHeight={containerHeight}
        renderItem={renderItem}
        overscan={5}
        className="border border-border rounded-lg overflow-hidden"
      />

      {/* Performance Info (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground mt-2">
          Virtual scrolling enabled: {sortedServices.length} items, {calculatedItemHeight}px per item
        </div>
      )}
    </div>
  );
}
