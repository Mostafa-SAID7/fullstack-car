import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  Wrench, 
  TrendingUp, 
  DollarSign,
  Activity,
  AlertTriangle,
  Eye,
  Plus
} from 'lucide-react';
import { useMarketplace } from '../../hooks/marketplace';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/layout/cards/Card';
import { Button } from '../../components/forms/buttons/Button';
import { Badge } from '../../components/data-display/badges/Badge';

export const MarketplaceOverview = () => {
  const { getDashboard, getDashboardMetrics, loading, error } = useMarketplace();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    loadDashboardData();
    loadMetrics();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      const data = await getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await getDashboardMetrics(selectedPeriod);
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketplace Overview</h1>
          <p className="text-muted-foreground">Manage your customers, products, and services</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.revenue?.total || 0)}</div>
                <div className={`flex items-center text-xs ${getTrendColor(metrics.revenue?.trend)}`}>
                  {getTrendIcon(metrics.revenue?.trend)}
                  <span className="ml-1">
                    {metrics.revenue?.growth > 0 ? '+' : ''}{metrics.revenue?.growth?.toFixed(1)}% from last period
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(metrics.orders?.total || 0)}</div>
                <div className={`flex items-center text-xs ${getTrendColor(metrics.orders?.trend)}`}>
                  {getTrendIcon(metrics.orders?.trend)}
                  <span className="ml-1">
                    {metrics.orders?.growth > 0 ? '+' : ''}{metrics.orders?.growth?.toFixed(1)}% from last period
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(metrics.customers?.active || 0)}</div>
                <div className={`flex items-center text-xs ${getTrendColor(metrics.customers?.trend)}`}>
                  {getTrendIcon(metrics.customers?.trend)}
                  <span className="ml-1">
                    {metrics.customers?.new || 0} new this period
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products & Services</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber((metrics.products?.active || 0) + (metrics.services?.active || 0))}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{metrics.products?.active || 0} products, {metrics.services?.active || 0} services</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Products</span>
                <span className="font-semibold">{metrics?.products?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <Badge variant="secondary">{metrics?.products?.active || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Low Stock</span>
                <Badge variant={metrics?.products?.lowStock > 0 ? "destructive" : "secondary"}>
                  {metrics?.products?.lowStock || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Out of Stock</span>
                <Badge variant={metrics?.products?.outOfStock > 0 ? "destructive" : "secondary"}>
                  {metrics?.products?.outOfStock || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Overview */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Services</span>
                <span className="font-semibold">{metrics?.services?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <Badge variant="secondary">{metrics?.services?.active || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Booked Today</span>
                <Badge variant="default">{metrics?.services?.booked || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <Badge variant="secondary">{metrics?.services?.completed || 0}</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts & Issues */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alerts & Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData?.alerts ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Low Stock Items</span>
                    <Badge variant={dashboardData.alerts.lowStock?.length > 0 ? "destructive" : "secondary"}>
                      {dashboardData.alerts.lowStock?.length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending Orders</span>
                    <Badge variant={dashboardData.alerts.pendingOrders?.length > 0 ? "default" : "secondary"}>
                      {dashboardData.alerts.pendingOrders?.length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Customer Issues</span>
                    <Badge variant={dashboardData.alerts.customerIssues?.length > 0 ? "destructive" : "secondary"}>
                      {dashboardData.alerts.customerIssues?.length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Service Issues</span>
                    <Badge variant={dashboardData.alerts.serviceIssues?.length > 0 ? "destructive" : "secondary"}>
                      {dashboardData.alerts.serviceIssues?.length || 0}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No alerts at this time</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Users className="w-6 h-6 mb-2" />
                <span>Add Customer</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Package className="w-6 h-6 mb-2" />
                <span>Add Product</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Wrench className="w-6 h-6 mb-2" />
                <span>Add Service</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ShoppingCart className="w-6 h-6 mb-2" />
                <span>View Orders</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
};