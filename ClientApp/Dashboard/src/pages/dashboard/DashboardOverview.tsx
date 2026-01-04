import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, BarChart3, TrendingUp, Brain, Zap, ChevronDown, PieChart, Activity, Users, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { DashboardCharts } from './components/DashboardCharts';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { DashboardActions } from './components/DashboardActions';
import { ModelTraining } from './components/ModelTraining';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';

export const DashboardOverview = () => {
  const { user } = useAuth();
  const {
    stats,
    userAnalytics,
    contentAnalytics,
    systemAnalytics,
    revenueAnalytics,
    loading
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('overview');
  const [chartView, setChartView] = useState('overview');
  const [showChartSelector, setShowChartSelector] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'ai-training', label: 'AI Training', icon: Brain },
    { id: 'actions', label: 'Actions', icon: Zap }
  ];

  const chartViews = [
    { id: 'overview', label: 'All Charts', icon: BarChart3, description: 'Complete dashboard overview' },
    { id: 'users', label: 'User Analytics', icon: Users, description: 'User growth and engagement' },
    { id: 'revenue', label: 'Revenue Focus', icon: DollarSign, description: 'Financial performance metrics' },
    { id: 'content', label: 'Content Metrics', icon: PieChart, description: 'Content creation and activity' },
    { id: 'system', label: 'System Health', icon: Activity, description: 'Server and performance data' }
  ];

  const currentChartView = chartViews.find(view => view.id === chartView);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <DashboardStats stats={stats} loading={loading} />

            {/* Chart View Selector */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Analytics Overview</h3>
                <p className="text-sm text-muted-foreground">Select a focus area to customize your dashboard view</p>
              </div>

              {/* Chart View Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowChartSelector(!showChartSelector)}
                  className="inline-flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-xl hover:bg-muted/50 transition-all"
                >
                  {currentChartView && <currentChartView.icon className="w-4 h-4 text-primary" />}
                  <span className="font-medium text-sm">{currentChartView?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showChartSelector ? 'rotate-180' : ''}`} />
                </button>

                {showChartSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {chartViews.map((view) => (
                      <button
                        key={view.id}
                        onClick={() => {
                          setChartView(view.id);
                          setShowChartSelector(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                          chartView === view.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <view.icon className="w-5 h-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm">{view.label}</div>
                          <div className="text-xs opacity-70 truncate">{view.description}</div>
                        </div>
                        {chartView === view.id && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Conditional Chart Rendering */}
            {chartView === 'overview' && (
              <DashboardCharts
                userAnalytics={userAnalytics}
                revenueAnalytics={revenueAnalytics}
                contentAnalytics={contentAnalytics}
                systemAnalytics={systemAnalytics}
                loading={loading}
              />
            )}

            {chartView === 'users' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <DashboardCharts
                    userAnalytics={userAnalytics}
                    revenueAnalytics={null}
                    contentAnalytics={null}
                    systemAnalytics={null}
                    loading={loading}
                  />
                </motion.div>
              </div>
            )}

            {chartView === 'revenue' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <DashboardCharts
                    userAnalytics={null}
                    revenueAnalytics={revenueAnalytics}
                    contentAnalytics={null}
                    systemAnalytics={null}
                    loading={loading}
                  />
                </motion.div>
              </div>
            )}

            {chartView === 'content' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <DashboardCharts
                    userAnalytics={null}
                    revenueAnalytics={null}
                    contentAnalytics={contentAnalytics}
                    systemAnalytics={null}
                    loading={loading}
                  />
                </motion.div>
              </div>
            )}

            {chartView === 'system' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <DashboardCharts
                    userAnalytics={null}
                    revenueAnalytics={null}
                    contentAnalytics={null}
                    systemAnalytics={systemAnalytics}
                    loading={loading}
                  />
                </motion.div>
              </div>
            )}
          </div>
        );
      case 'analytics':
        return (
          <DashboardAnalytics
            userAnalytics={userAnalytics}
            contentAnalytics={contentAnalytics}
            revenueAnalytics={revenueAnalytics}
            loading={loading}
          />
        );
      case 'ai-training':
        return <ModelTraining />;
      case 'actions':
        return <DashboardActions />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <DashboardHeader user={user} />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>
    </motion.div>
  );
};