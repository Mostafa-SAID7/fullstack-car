import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MessageSquare,
  TrendingUp,
  RefreshCw,
  Shield,
  Database,
  Wifi,
  Search,
  Zap
} from 'lucide-react';

// Import existing dashboard components following established patterns
import { Card, CardContent, CardHeader, CardTitle } from '../layout/cards/Card';
import { MetricCard } from '../layout/cards/MetricCard';
import { StatsCards } from '../shared/StatsCards';
import { Alert, ErrorAlert } from '../feedback/alerts/Alert';
import { LineChart } from '../charts/line/LineChart';
import { AreaChart } from '../charts/area/AreaChart';
import { Button } from '../forms/buttons/Button';
import SkeletonLoader from '../shared/SkeletonLoader';
import { TabNavigation } from '../shared/TabNavigation';

// Types following existing patterns
interface QASystemHealth {
  status: string;
  timestamp: string;
  checkDurationMs: number;
  error?: string;
  metrics?: {
    totalQuestions: number;
    totalAnswers: number;
    activeUsers: number;
    recentQuestions24h: number;
    recentAnswers24h: number;
    recentVotes24h: number;
    responseRate: number;
    averageResponseTimeHours: number;
    activeConnections: number;
    connectionHealth: string;
  };
  dependencies?: {
    database: string;
    signalR: string;
    searchIndex: string;
    cache: string;
  };
}

interface QASystemAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  category: string;
  createdAt: string;
  isActive: boolean;
}

interface QAPerformanceMetrics {
  timestamp: string;
  questionTrends: Array<{ date: string; value: number }>;
  answerTrends: Array<{ date: string; value: number }>;
  voteTrends: Array<{ date: string; value: number }>;
  expertResponseRate: number;
  searchPerformance: {
    averageSearchTimeMs: number;
    searchesPerHour: number;
    searchSuccessRate: number;
  };
  systemLoad: {
    cpuUsagePercent: number;
    memoryUsageMB: number;
    activeThreads: number;
    databaseConnections: string;
  };
}

interface QAUserSatisfaction {
  timestamp: string;
  overallSatisfactionScore: number;
  answerAcceptanceRate: number;
  userEngagementRate: number;
  averageQuestionScore: number;
  averageAnswerScore: number;
  activeUsers30Days: number;
  totalUsers: number;
  satisfactionTrend: Array<{ date: string; value: number }>;
}

interface QAHealthDashboard {
  systemHealth: QASystemHealth;
  performanceMetrics: QAPerformanceMetrics;
  activeAlerts: QASystemAlert[];
  userSatisfaction: QAUserSatisfaction;
  lastUpdated: string;
  overallStatus: string;
}

export const QAHealthMonitoringComponent: React.FC = () => {
  const [healthData, setHealthData] = useState<QAHealthDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch health data following existing API patterns
  const fetchHealthData = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/v3/admin/qa/health/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setHealthData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching QA health data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch health data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh every 30 seconds following existing monitoring patterns
  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, [fetchHealthData]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchHealthData();
  };

  // Trigger manual health check
  const triggerHealthCheck = async () => {
    try {
      const response = await fetch('/api/v3/admin/qa/health/check', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh data after triggering check
        setTimeout(fetchHealthData, 2000);
      }
    } catch (err) {
      console.error('Error triggering health check:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">QA System Health</h1>
          <SkeletonLoader className="w-32 h-10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonLoader key={i} className="h-32" />
          ))}
        </div>
        <SkeletonLoader className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">QA System Health</h1>
        <ErrorAlert
          title="Failed to Load Health Data"
          description={error}
          action={
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!healthData) {
    return null;
  }

  // Prepare stats cards data following existing patterns
  const statsCards = [
    {
      label: 'System Status',
      value: healthData.overallStatus,
      icon: healthData.overallStatus === 'Healthy' ? CheckCircle : 
            healthData.overallStatus === 'Warning' ? AlertTriangle : AlertTriangle,
      color: healthData.overallStatus === 'Healthy' ? 'text-green-600' : 
             healthData.overallStatus === 'Warning' ? 'text-yellow-600' : 'text-red-600',
      change: `${healthData.activeAlerts.length} alerts`,
      changeType: healthData.activeAlerts.length === 0 ? 'positive' as const : 'negative' as const
    },
    {
      label: 'Total Questions',
      value: healthData.systemHealth.metrics?.totalQuestions.toLocaleString() || '0',
      icon: MessageSquare,
      color: 'text-blue-600',
      change: `+${healthData.systemHealth.metrics?.recentQuestions24h || 0} today`,
      changeType: 'positive' as const
    },
    {
      label: 'Response Rate',
      value: `${(healthData.systemHealth.metrics?.responseRate || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: (healthData.systemHealth.metrics?.responseRate || 0) >= 70 ? 'text-green-600' : 'text-yellow-600',
      change: 'vs 70% target',
      changeType: (healthData.systemHealth.metrics?.responseRate || 0) >= 70 ? 'positive' as const : 'negative' as const
    },
    {
      label: 'Active Users',
      value: healthData.systemHealth.metrics?.activeUsers.toLocaleString() || '0',
      icon: Users,
      color: 'text-purple-600',
      change: `${healthData.userSatisfaction.activeUsers30Days} in 30 days`,
      changeType: 'neutral' as const
    }
  ];

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Performance' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'satisfaction', label: 'User Satisfaction' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QA System Health Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Last updated: {new Date(healthData.lastUpdated).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={triggerHealthCheck}>
            <Shield className="w-4 h-4 mr-2" />
            Run Health Check
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {healthData.activeAlerts.some(alert => alert.severity === 'Critical') && (
        <ErrorAlert
          title="Critical System Alerts"
          description={`${healthData.activeAlerts.filter(a => a.severity === 'Critical').length} critical issues require immediate attention`}
          action={
            <Button onClick={() => setActiveTab('alerts')} size="sm">
              View Alerts
            </Button>
          }
        />
      )}

      {/* Stats Cards */}
      <StatsCards stats={statsCards} />

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <OverviewTab healthData={healthData} />
        )}
        {activeTab === 'performance' && (
          <PerformanceTab performanceData={healthData.performanceMetrics} />
        )}
        {activeTab === 'alerts' && (
          <AlertsTab alerts={healthData.activeAlerts} />
        )}
        {activeTab === 'satisfaction' && (
          <SatisfactionTab satisfactionData={healthData.userSatisfaction} />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ healthData: QAHealthDashboard }> = ({ healthData }) => {
  const { systemHealth } = healthData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* System Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Dependencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemHealth.dependencies && Object.entries(systemHealth.dependencies).map(([key, status]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {key === 'database' && <Database className="w-4 h-4" />}
                  {key === 'signalR' && <Wifi className="w-4 h-4" />}
                  {key === 'searchIndex' && <Search className="w-4 h-4" />}
                  {key === 'cache' && <Zap className="w-4 h-4" />}
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  status === 'Healthy' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MetricCard
              title="New Questions"
              value={systemHealth.metrics?.recentQuestions24h || 0}
              color="blue"
            />
            <MetricCard
              title="New Answers"
              value={systemHealth.metrics?.recentAnswers24h || 0}
              color="green"
            />
            <MetricCard
              title="Votes Cast"
              value={systemHealth.metrics?.recentVotes24h || 0}
              color="purple"
            />
            <MetricCard
              title="Active Connections"
              value={systemHealth.metrics?.activeConnections || 0}
              color="orange"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab: React.FC<{ performanceData: QAPerformanceMetrics }> = ({ performanceData }) => {
  return (
    <div className="space-y-6">
      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Question & Answer Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={performanceData.questionTrends.map((t, index) => ({
                x: new Date(t.date).toLocaleDateString(),
                y: t.value,
                label: index === 0 ? 'Questions' : 'Answers'
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Load Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <MetricCard
                title="Memory Usage"
                value={`${performanceData.systemLoad.memoryUsageMB} MB`}
                color="blue"
              />
              <MetricCard
                title="Active Threads"
                value={performanceData.systemLoad.activeThreads}
                color="green"
              />
              <MetricCard
                title="Expert Response Rate"
                value={`${performanceData.expertResponseRate.toFixed(1)}%`}
                color="purple"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Average Search Time"
              value={`${performanceData.searchPerformance.averageSearchTimeMs} ms`}
              color="blue"
            />
            <MetricCard
              title="Searches per Hour"
              value={performanceData.searchPerformance.searchesPerHour}
              color="green"
            />
            <MetricCard
              title="Success Rate"
              value={`${performanceData.searchPerformance.searchSuccessRate}%`}
              color="purple"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Alerts Tab Component
const AlertsTab: React.FC<{ alerts: QASystemAlert[] }> = ({ alerts }) => {
  const activeAlerts = alerts.filter(alert => alert.isActive);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'Critical');
  const warningAlerts = activeAlerts.filter(alert => alert.severity === 'Warning');

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Active Alerts"
          value={activeAlerts.length}
          color="blue"
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalAlerts.length}
          color="red"
          status={criticalAlerts.length > 0 ? 'critical' : 'good'}
        />
        <MetricCard
          title="Warning Alerts"
          value={warningAlerts.length}
          color="orange"
          status={warningAlerts.length > 0 ? 'warning' : 'good'}
        />
      </div>

      {/* Alert List */}
      <Card>
        <CardHeader>
          <CardTitle>Active System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Active Alerts</h3>
              <p className="text-gray-500 dark:text-gray-400">All systems are operating normally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  variant={alert.severity === 'Critical' ? 'destructive' : 'warning'}
                  title={alert.title}
                >
                  <div>
                    <p>{alert.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span>Category: {alert.category}</span>
                      <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Satisfaction Tab Component
const SatisfactionTab: React.FC<{ satisfactionData: QAUserSatisfaction }> = ({ satisfactionData }) => {
  return (
    <div className="space-y-6">
      {/* Satisfaction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Satisfaction"
          value={`${satisfactionData.overallSatisfactionScore.toFixed(1)}%`}
          color="blue"
          status={satisfactionData.overallSatisfactionScore >= 70 ? 'good' : 'warning'}
        />
        <MetricCard
          title="Answer Acceptance Rate"
          value={`${satisfactionData.answerAcceptanceRate.toFixed(1)}%`}
          color="green"
        />
        <MetricCard
          title="User Engagement"
          value={`${satisfactionData.userEngagementRate.toFixed(1)}%`}
          color="purple"
        />
        <MetricCard
          title="Active Users (30d)"
          value={satisfactionData.activeUsers30Days}
          color="orange"
        />
      </div>

      {/* Satisfaction Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Satisfaction Trend (7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart
            data={satisfactionData.satisfactionTrend.map(t => ({
              x: new Date(t.date).toLocaleDateString(),
              y: t.value
            }))}
          />
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <MetricCard
                title="Average Question Score"
                value={satisfactionData.averageQuestionScore.toFixed(1)}
                color="blue"
              />
              <MetricCard
                title="Average Answer Score"
                value={satisfactionData.averageAnswerScore.toFixed(1)}
                color="green"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <MetricCard
                title="Total Registered Users"
                value={satisfactionData.totalUsers}
                color="purple"
              />
              <MetricCard
                title="Engagement Rate"
                value={`${satisfactionData.userEngagementRate.toFixed(1)}%`}
                color="orange"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QAHealthMonitoringComponent;