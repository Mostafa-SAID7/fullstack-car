import React from 'react';
// import { useSystem } from '../../hooks/useSystem'; // TODO: Create this hook
import { SystemHeader } from './components/SystemHeader';
import { SystemOverview } from './components/SystemOverview';
import { SystemServices } from './components/SystemServices';
import { SystemMetrics } from './components/SystemMetrics';
import { SystemResources } from './components/SystemResources';
import { SystemChart } from './components/SystemChart';

export const System: React.FC = () => {
  const {
    systemInfo,
    performanceMetrics,
    loading,
    error,
    loadSystemData,
    formatBytes,
    getServiceStatus
  } = useSystem();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading system information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-800">{error}</span>
        </div>
        <button 
          onClick={loadSystemData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SystemHeader onRefresh={loadSystemData} />
      {systemInfo && <SystemOverview systemInfo={systemInfo} />}
      {systemInfo && <SystemServices systemInfo={systemInfo} getServiceStatus={getServiceStatus} />}
      {performanceMetrics && <SystemMetrics performanceMetrics={performanceMetrics} />}
      {systemInfo && <SystemResources systemInfo={systemInfo} formatBytes={formatBytes} />}
      {performanceMetrics && <SystemChart />}
    </div>
  );
};