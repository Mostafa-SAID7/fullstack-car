import React, { useState, useMemo } from 'react';
import { 
  Car, 
  RefreshCw,
  Download,
  Plus
} from 'lucide-react';

import { 
  EnhancedPageHeader,
  TabNavigation,
  SearchAndFilters,
  Pagination,
  DynamicModal,
  ErrorCard,
  TableSkeleton,
  type FilterField,
  type StatusIndicator,
  type FeatureBadge
} from '../../../components/shared';

import { useServices } from './hooks/useServices';
import { useModal } from '../../../hooks/useModal';
import { ServicesTable } from './components/ServicesTable';
import { ServicesCards } from './components/ServicesCards';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const { 
    services, 
    statistics, 
    isLoading, 
    error, 
    refetch,
    createService
  } = useServices({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    tab: activeTab
  });

  const handleCreateService = async (data: any) => {
    try {
      await createService(data);
      closeModal();
      refetch();
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };

  const { isOpen, openModal, closeModal } = useModal({
    type: 'service',
    fields: [
      {
        key: 'title',
        label: 'Service Title',
        type: 'text',
        required: true,
        placeholder: 'Enter service title'
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter service description'
      },
      {
        key: 'type',
        label: 'Service Type',
        type: 'select',
        required: true,
        options: [
          { value: '1', label: 'Maintenance' },
          { value: '2', label: 'Repair' },
          { value: '3', label: 'Inspection' },
          { value: '4', label: 'Cleaning' },
          { value: '5', label: 'Towing' }
        ]
      },
      {
        key: 'basePrice',
        label: 'Base Price',
        type: 'number',
        required: true,
        placeholder: '0.00'
      },
      {
        key: 'estimatedDurationMinutes',
        label: 'Duration (minutes)',
        type: 'number',
        required: true,
        placeholder: '60'
      }
    ],
    onSubmit: handleCreateService,
    title: 'Add New Service',
    submitLabel: 'Create Service'
  });

  // Filter configuration
  const filterFields: FilterField[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Statuses' },
        { value: '1', label: 'Active' },
        { value: '0', label: 'Draft' },
        { value: '2', label: 'Inactive' },
        { value: '3', label: 'Suspended' }
      ]
    },
    {
      key: 'type',
      label: 'Service Type',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Types' },
        { value: '1', label: 'Maintenance' },
        { value: '2', label: 'Repair' },
        { value: '3', label: 'Inspection' },
        { value: '4', label: 'Emergency' },
        { value: '5', label: 'Towing' }
      ]
    },
    {
      key: 'priceRange',
      label: 'Price Range',
      type: 'select' as const,
      options: [
        { value: '', label: 'All Prices' },
        { value: '0-50', label: '$0 - $50' },
        { value: '50-100', label: '$50 - $100' },
        { value: '100-200', label: '$100 - $200' },
        { value: '200+', label: '$200+' }
      ]
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
  };

  // Filter services based on active tab
  const filteredServices = useMemo(() => {
    if (!services?.data) return [];
    
    let filtered = services.data;

    // Apply tab filter
    switch (activeTab) {
      case 'active':
        filtered = filtered.filter(service => service.status === 1);
        break;
      case 'inactive':
        filtered = filtered.filter(service => service.status === 2);
        break;
      case 'draft':
        filtered = filtered.filter(service => service.status === 0);
        break;
      case 'emergency':
        filtered = filtered.filter(service => service.isEmergencyService);
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceProviderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply additional filters
    if (filterValues.status && filterValues.status !== '') {
      filtered = filtered.filter(service => service.status === parseInt(filterValues.status));
    }

    if (filterValues.type && filterValues.type !== '') {
      filtered = filtered.filter(service => service.type === parseInt(filterValues.type));
    }

    if (filterValues.priceRange && filterValues.priceRange !== '') {
      const [min, max] = filterValues.priceRange.split('-').map(v => v.replace('+', ''));
      if (max) {
        filtered = filtered.filter(service => 
          service.basePrice >= parseInt(min) && service.basePrice <= parseInt(max)
        );
      } else {
        filtered = filtered.filter(service => service.basePrice >= parseInt(min));
      }
    }

    return filtered;
  }, [services?.data, activeTab, searchTerm, filterValues]);

  const tabs = [
    { 
      id: 'all', 
      label: 'All Services', 
      count: statistics?.totalServices || 0 
    },
    { 
      id: 'active', 
      label: 'Active', 
      count: statistics?.activeServices || 0 
    },
    { 
      id: 'inactive', 
      label: 'Inactive', 
      count: statistics?.inactiveServices || 0 
    },
    { 
      id: 'draft', 
      label: 'Draft', 
      count: statistics?.draftServices || 0 
    },
    { 
      id: 'emergency', 
      label: 'Emergency', 
      count: statistics?.emergencyServices || 0 
    }
  ];

  const statusIndicators: StatusIndicator[] = [
    {
      label: 'System Online',
      status: 'online',
      count: 1,
      icon: (
        <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Services Active',
      status: 'active',
      count: statistics?.activeServices || 0,
      icon: (
        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const featureBadges: FeatureBadge[] = [
    {
      label: 'Real-time Booking',
      color: 'green',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Smart Matching',
      color: 'blue',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: 'Quality Assured',
      color: 'purple',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  ];

  const enhancedActions = [
    {
      label: 'Refresh',
      icon: RefreshCw,
      onClick: refetch,
      variant: 'secondary' as const
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export services'),
      variant: 'secondary' as const
    },
    {
      label: 'Add Service',
      icon: Plus,
      onClick: () => openModal(),
      variant: 'primary' as const
    }
  ];

  if (error) {
    return (
      <div className="p-6">
        <ErrorCard 
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <EnhancedPageHeader
        title="Services Management"
        description="Comprehensive marketplace services platform with real-time booking, smart provider matching, and advanced analytics for optimal service delivery and customer satisfaction"
        icon={Car}
        iconGradient={{
          from: 'from-blue-500',
          to: 'to-cyan-500'
        }}
        titleGradient={{
          from: 'from-blue-600',
          to: 'to-cyan-600'
        }}
        statusIndicators={statusIndicators}
        featureBadges={featureBadges}
        actions={enhancedActions}
      />

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fullWidth={true}
        className="w-full"
      />

      {/* Search and Filters */}
      <div className="mt-6">
        <SearchAndFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search services, providers, or descriptions..."
          showViewToggle={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showFiltersButton={true}
          filterFields={filterFields}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Data Display */}
      <div className="space-y-6">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            {viewMode === 'table' ? (
              <ServicesTable
                services={filteredServices}
                onEdit={(service) => console.log('Edit service:', service)}
                onDelete={(service) => console.log('Delete service:', service)}
                onView={(service) => console.log('View service:', service)}
              />
            ) : (
              <ServicesCards
                services={filteredServices}
                onEdit={(service) => console.log('Edit service:', service)}
                onDelete={(service) => console.log('Delete service:', service)}
                onView={(service) => console.log('View service:', service)}
              />
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={services?.totalCount || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        )}
      </div>

      {/* Add Service Modal */}
      <DynamicModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Service"
        type="service"
        fields={[
          {
            key: 'title',
            label: 'Service Title',
            type: 'text',
            required: true,
            placeholder: 'Enter service title'
          },
          {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Enter service description'
          },
          {
            key: 'type',
            label: 'Service Type',
            type: 'select',
            required: true,
            options: [
              { value: '1', label: 'Maintenance' },
              { value: '2', label: 'Repair' },
              { value: '3', label: 'Inspection' },
              { value: '4', label: 'Cleaning' },
              { value: '5', label: 'Towing' }
            ]
          },
          {
            key: 'basePrice',
            label: 'Base Price',
            type: 'number',
            required: true,
            placeholder: '0.00'
          },
          {
            key: 'estimatedDurationMinutes',
            label: 'Duration (minutes)',
            type: 'number',
            required: true,
            placeholder: '60'
          }
        ]}
        onSubmit={handleCreateService}
      />
    </div>
  );
};

export default Services;