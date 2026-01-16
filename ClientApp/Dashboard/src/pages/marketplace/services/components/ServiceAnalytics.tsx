/**
 * ServiceAnalytics Component
 * Displays service analytics, statistics, and insights
 */

import React, { useState } from 'react';
import { 
  Wrench, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Users,
  Star,
  Download,
  AlertCircle
} from 'lucide-react';
import { useServiceAnalytics, usePopularServicesAnalytics, useEmergencyServices } from '../../../../hooks/marketplace';
import { serviceManagementService } from '../../../../services/marketplace';
import { LazyImage } from '../../../../components/shared/LazyImage';
import type { ServiceDto } from '../../../../types/marketplace';

interface ServiceAnalyticsProps {
  /** Optional date range for analytics */
  fromDate?: Date;
  toDate?: Date;
  /** Custom class name */
  className?: string;
}

/**
 * Format currency value
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format number with commas
 */
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
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
 * Stat Card Component
 */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  iconBgColor?: string;
}

function StatCard({ icon, label, value, change, changeType = 'neutral', iconBgColor = 'bg-blue-100' }: StatCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-2 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * Service Row Component
 */
interface ServiceRowProps {
  service: ServiceDto;
  rank?: number;
  showBookings?: boolean;
  showRating?: boolean;
}

function ServiceRow({ service, rank, showBookings = false, showRating = false }: ServiceRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      {rank && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">#{rank}</span>
        </div>
      )}
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <Wrench className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
        <p className="text-xs text-gray-500">{service.serviceType} • {formatDuration(service.estimatedDuration)}</p>
      </div>
      {showBookings && (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{formatNumber(service.totalBookings)} bookings</p>
          <p className="text-xs text-gray-500">{formatCurrency(service.basePrice * service.totalBookings)}</p>
        </div>
      )}
      {showRating && (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium text-gray-900">{service.averageRating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({service.totalReviews})</span>
        </div>
      )}
    </div>
  );
}

/**
 * ServiceAnalytics Component
 */
export function ServiceAnalytics({ fromDate, toDate, className = '' }: ServiceAnalyticsProps) {
  const { statistics, loading: statsLoading, error: statsError } = useServiceAnalytics({ 
    fromDate, 
    toDate,
    autoFetch: true 
  });
  
  const { services: popularServices, loading: popularLoading } = usePopularServicesAnalytics(10, '30d');
  const { services: emergencyServices, loading: emergencyLoading } = useEmergencyServices();

  const [exportingData, setExportingData] = useState(false);

  // Handle export
  const handleExport = async () => {
    setExportingData(true);
    try {
      await serviceManagementService.downloadServicesExport(
        undefined,
        `service-analytics-${new Date().toISOString().split('T')[0]}.csv`
      );
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExportingData(false);
    }
  };

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading analytics</p>
          <p className="text-sm text-gray-600">{statsError}</p>
        </div>
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Export Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive insights into service performance and bookings
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exportingData}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {exportingData ? 'Exporting...' : 'Export Data'}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Wrench className="w-6 h-6 text-blue-600" />}
          label="Total Services"
          value={formatNumber(statistics?.totalServices || 0)}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          label="Active Services"
          value={formatNumber(statistics?.activeServices || 0)}
          iconBgColor="bg-green-100"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-purple-600" />}
          label="Total Revenue"
          value={formatCurrency(statistics?.totalRevenue || 0)}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-orange-600" />}
          label="Total Bookings"
          value={formatNumber(statistics?.totalBookings || 0)}
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          label="Service Providers"
          value={formatNumber(statistics?.totalProviders || 0)}
          iconBgColor="bg-indigo-100"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-yellow-600" />}
          label="Average Rating"
          value={statistics?.averageRating?.toFixed(1) || '0.0'}
          iconBgColor="bg-yellow-100"
        />
        <StatCard
          icon={<AlertCircle className="w-5 h-5 text-red-600" />}
          label="Emergency Services"
          value={formatNumber(statistics?.emergencyServices || 0)}
          iconBgColor="bg-red-100"
        />
      </div>

      {/* Most Popular Services */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Most Popular Services</h3>
          </div>
          <span className="text-sm text-gray-500">Last 30 days</span>
        </div>
        
        {popularLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : popularServices.length > 0 ? (
          <div className="space-y-2">
            {popularServices.map((service, index) => (
              <ServiceRow
                key={service.id}
                service={service}
                rank={index + 1}
                showBookings
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No booking data available
          </div>
        )}
      </div>

      {/* Emergency Services */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Emergency Services</h3>
          </div>
          <span className="text-sm text-gray-500">{emergencyServices.length} services</span>
        </div>
        
        {emergencyLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : emergencyServices.length > 0 ? (
          <div className="space-y-2">
            {emergencyServices.slice(0, 10).map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                showRating
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No emergency services available</p>
          </div>
        )}
      </div>

      {/* Booking Trends Chart Placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>Chart visualization coming soon</p>
            <p className="text-xs mt-1">Integrate with chart library for trend visualization</p>
          </div>
        </div>
      </div>

      {/* Date Range Info */}
      {(fromDate || toDate) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div className="text-sm text-blue-900">
            <span className="font-medium">Date Range: </span>
            {fromDate && <span>{fromDate.toLocaleDateString()}</span>}
            {fromDate && toDate && <span> - </span>}
            {toDate && <span>{toDate.toLocaleDateString()}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
