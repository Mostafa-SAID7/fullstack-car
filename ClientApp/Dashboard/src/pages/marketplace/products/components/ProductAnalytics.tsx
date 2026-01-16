/**
 * ProductAnalytics Component
 * Displays product analytics, statistics, and insights
 */

import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  ShoppingCart,
  Star,
  Download,
  Calendar
} from 'lucide-react';
import { useProductAnalytics, useTopSellingProducts, useLowStockProducts } from '../../../../hooks/marketplace';
import { productManagementService } from '../../../../services/marketplace';
import { LazyImage } from '../../../../components/shared/LazyImage';
import type { ProductDto } from '../../../../types/marketplace';

interface ProductAnalyticsProps {
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
 * Product Row Component
 */
interface ProductRowProps {
  product: ProductDto;
  rank?: number;
  showSales?: boolean;
  showStock?: boolean;
}

function ProductRow({ product, rank, showSales = false, showStock = false }: ProductRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      {rank && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">#{rank}</span>
        </div>
      )}
      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
        {product.imageUrl ? (
          <LazyImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
      </div>
      {showSales && (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{formatNumber(product.salesCount)} sales</p>
          <p className="text-xs text-gray-500">{formatCurrency(product.price * product.salesCount)}</p>
        </div>
      )}
      {showStock && (
        <div className="text-right">
          <p className={`text-sm font-medium ${
            product.stockQuantity <= product.minStockLevel ? 'text-red-600' : 'text-gray-900'
          }`}>
            {product.stockQuantity} units
          </p>
          <p className="text-xs text-gray-500">Min: {product.minStockLevel}</p>
        </div>
      )}
    </div>
  );
}

/**
 * ProductAnalytics Component
 */
export function ProductAnalytics({ fromDate, toDate, className = '' }: ProductAnalyticsProps) {
  const { statistics, loading: statsLoading, error: statsError } = useProductAnalytics({ 
    fromDate, 
    toDate,
    autoFetch: true 
  });
  
  const { products: topSelling, loading: topSellingLoading } = useTopSellingProducts(10, '30d');
  const { products: lowStock, loading: lowStockLoading } = useLowStockProducts();

  const [exportingData, setExportingData] = useState(false);

  // Handle export
  const handleExport = async () => {
    setExportingData(true);
    try {
      await productManagementService.downloadProductsExport(
        undefined,
        `product-analytics-${new Date().toISOString().split('T')[0]}.csv`
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
          <h2 className="text-2xl font-bold text-gray-900">Product Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive insights into product performance and inventory
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
          icon={<Package className="w-6 h-6 text-blue-600" />}
          label="Total Products"
          value={formatNumber(statistics?.totalProducts || 0)}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          label="Active Products"
          value={formatNumber(statistics?.activeProducts || 0)}
          iconBgColor="bg-green-100"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-purple-600" />}
          label="Total Revenue"
          value={formatCurrency(statistics?.totalRevenue || 0)}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          icon={<ShoppingCart className="w-6 h-6 text-orange-600" />}
          label="Total Sales"
          value={formatNumber(statistics?.totalSales || 0)}
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          label="Out of Stock"
          value={formatNumber(statistics?.outOfStockProducts || 0)}
          iconBgColor="bg-red-100"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-yellow-600" />}
          label="Low Stock"
          value={formatNumber(statistics?.lowStockProducts || 0)}
          iconBgColor="bg-yellow-100"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-yellow-600" />}
          label="Average Rating"
          value={statistics?.averageRating?.toFixed(1) || '0.0'}
          iconBgColor="bg-yellow-100"
        />
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
          </div>
          <span className="text-sm text-gray-500">Last 30 days</span>
        </div>
        
        {topSellingLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : topSelling.length > 0 ? (
          <div className="space-y-2">
            {topSelling.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                rank={index + 1}
                showSales
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No sales data available
          </div>
        )}
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
          </div>
          <span className="text-sm text-gray-500">{lowStock.length} products</span>
        </div>
        
        {lowStockLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : lowStock.length > 0 ? (
          <div className="space-y-2">
            {lowStock.slice(0, 10).map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                showStock
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>All products are well stocked</p>
          </div>
        )}
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
