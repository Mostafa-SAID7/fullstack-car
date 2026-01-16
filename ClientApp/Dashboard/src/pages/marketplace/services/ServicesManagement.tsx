/**
 * ServicesManagement Page
 * Main page for managing services with tabs, real-time updates, and comprehensive features
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Wrench, BarChart3, List, Plus, RefreshCw } from 'lucide-react';
import { ResponsiveTabs } from '../../../components/shared/ResponsiveTabs';
import { ServiceList } from './components/ServiceList';
import { ServiceAnalytics } from './components/ServiceAnalytics';
import { ServiceModal } from '../../../components/marketplace/ServiceModal';
import { useServices } from '../../../hooks/marketplace';
import { useSignalR } from '../../../hooks/useSignalR';
import { serviceCacheInvalidation } from '../../../services/marketplace';
import type { ServiceDto, ServiceFilters } from '../../../types/marketplace';

/**
 * ServicesManagement Page Component
 */
export function ServicesManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<ServiceFilters>({
    page: 1,
    pageSize: 20
  });
  const [selectedService, setSelectedService] = useState<ServiceDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDto | undefined>(undefined);

  const { services, loading, error, refetch } = useServices({
    initialFilters: filters,
    autoFetch: true
  });

  // SignalR connection for real-time updates
  const { connection, connectionState } = useSignalR();

  // Handle real-time service events
  useEffect(() => {
    if (!connection || connectionState !== 'Connected') return;

    const handleServiceCreated = (service: ServiceDto) => {
      console.log('Service created:', service);
      serviceCacheInvalidation.onServiceCreate();
      refetch();
    };

    const handleServiceUpdated = (service: ServiceDto) => {
      console.log('Service updated:', service);
      serviceCacheInvalidation.onServiceUpdate();
      refetch();
    };

    const handleServiceDeleted = (serviceId: string) => {
      console.log('Service deleted:', serviceId);
      serviceCacheInvalidation.onServiceDelete();
      refetch();
    };

    // Subscribe to SignalR events
    connection.on('ServiceCreated', handleServiceCreated);
    connection.on('ServiceUpdated', handleServiceUpdated);
    connection.on('ServiceDeleted', handleServiceDeleted);

    // Cleanup
    return () => {
      connection.off('ServiceCreated', handleServiceCreated);
      connection.off('ServiceUpdated', handleServiceUpdated);
      connection.off('ServiceDeleted', handleServiceDeleted);
    };
  }, [connection, connectionState, refetch]);

  // Handle service click
  const handleServiceClick = useCallback((service: ServiceDto) => {
    setSelectedService(service);
    console.log('Service clicked:', service);
    // TODO: Open service detail modal or navigate to detail page
  }, []);

  // Handle edit service
  const handleEditService = useCallback((service: ServiceDto) => {
    setEditingService(service);
    setIsModalOpen(true);
  }, []);

  // Handle delete service
  const handleDeleteService = useCallback(async (service: ServiceDto) => {
    if (!confirm(`Are you sure you want to delete "${service.name}"?`)) {
      return;
    }

    try {
      // TODO: Call delete API
      console.log('Delete service:', service);
      await refetch();
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service. Please try again.');
    }
  }, [refetch]);

  // Handle create service
  const handleCreateService = useCallback(() => {
    setEditingService(undefined);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingService(undefined);
  }, []);

  // Handle service save success
  const handleServiceSaveSuccess = useCallback((service: ServiceDto) => {
    console.log('Service saved successfully:', service);
    refetch(); // Refresh the services list
  }, [refetch]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Define tabs
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'all-services',
      label: 'All Services',
      icon: <List className="w-4 h-4" />,
      badge: services?.totalCount
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Services</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {services?.totalCount || 0}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Wrench className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Page</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {services?.page || 1} / {services?.totalPages || 1}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <List className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connection</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {connectionState}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    connectionState === 'Connected' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      connectionState === 'Connected' ? 'bg-green-600' : 'bg-gray-400'
                    }`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Services */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Services</h3>
              <ServiceList
                filters={{ ...filters, pageSize: 10 }}
                onServiceClick={handleServiceClick}
                onEditService={handleEditService}
                onDeleteService={handleDeleteService}
                showBulkActions={false}
              />
            </div>
          </div>
        );

      case 'all-services':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <ServiceList
              filters={filters}
              onServiceClick={handleServiceClick}
              onEditService={handleEditService}
              onDeleteService={handleDeleteService}
              showBulkActions={true}
            />
          </div>
        );

      case 'analytics':
        return <ServiceAnalytics />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your service catalog, bookings, and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleCreateService}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Tabs */}
      <ResponsiveTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Error loading services</p>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      {/* Real-time Status Indicator */}
      {connectionState === 'Connected' && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-900">Live Updates Active</span>
          </div>
        </div>
      )}

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        service={editingService}
        serviceProviders={[
          // TODO: Load actual service providers
          { id: '1', name: 'Sample Provider 1' },
          { id: '2', name: 'Sample Provider 2' }
        ]}
        categories={[
          // TODO: Load actual categories
          { id: '1', name: 'Maintenance' },
          { id: '2', name: 'Repair' },
          { id: '3', name: 'Inspection' }
        ]}
        onSuccess={handleServiceSaveSuccess}
      />
    </div>
  );
}
