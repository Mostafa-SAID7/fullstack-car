import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Brain, Zap, ChevronDown, PieChart, Activity, Users, DollarSign } from 'lucide-react';
import { useAuth, useDashboard } from '../../hooks';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { DashboardCharts } from './components/DashboardCharts';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { DashboardActions } from './components/DashboardActions';
import { ModelTraining } from './components/ModelTraining';
import { TabNavigation, TabContent } from '../../components/layout/tabs/TabNavigation';
import { DashboardSkeleton } from '../../components/feedback/skeletons/DashboardSkeleton';

export const DashboardOverview = () => {
  const { t } = useTranslation('dashboard');
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
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'pie'>('line');
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [showChartTypeSelector, setShowChartTypeSelector] = useState(false);

  const tabs = [
    { id: 'overview', label: t('overview'), icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'analytics', label: t('analytics'), icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'ai-training', label: t('ai_training'), icon: <Brain className="w-4 h-4" /> },
    { id: 'actions', label: t('actions'), icon: <Zap className="w-4 h-4" /> }
  ];

  const chartViews = [
    { id: 'overview', label: t('all_charts'), icon: BarChart3, description: t('complete_dashboard') },
    { id: 'users', label: t('user_analytics'), icon: Users, description: t('user_growth_engagement') },
    { id: 'revenue', label: t('revenue_focus'), icon: DollarSign, description: t('financial_performance') },
    { id: 'content', label: t('content_metrics'), icon: PieChart, description: t('content_creation_activity') },
    { id: 'system', label: t('system_health'), icon: Activity, description: t('server_performance') }
  ];

  const currentChartView = chartViews.find(view => view.id === chartView);

  const chartTypeOptions = useMemo(() => [
    { id: 'line', label: t('line_chart'), icon: TrendingUp, description: t('trend_visualization') },
    { id: 'bar', label: t('bar_chart'), icon: BarChart3, description: t('comparison_view') },
    { id: 'area', label: t('area_chart'), icon: Activity, description: t('filled_trend_view') },
    { id: 'pie', label: t('pie_chart'), icon: PieChart, description: t('proportion_view') }
  ], [t]);

  const currentChartType = useMemo(() =>
    chartTypeOptions.find(option => option.id === chartType),
    [chartTypeOptions, chartType]
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <DashboardStats stats={stats} loading={loading} />

            {/* Compact Analytics Controls */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Title and Description */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{t('analytics_overview')}</h3>
                  <p className="text-sm text-muted-foreground">{t('analytics_description')}</p>
                </div>

                {/* Compact Dropdowns Container */}
                <div className="flex items-center gap-3">
                  {/* Chart View Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowChartSelector(!showChartSelector)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-muted/50 transition-all text-sm"
                    >
                      {currentChartView && <currentChartView.icon className="w-4 h-4 text-primary" />}
                      <span className="font-medium hidden sm:inline">{currentChartView?.label}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showChartSelector ? 'rotate-180' : ''}`} />
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
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${chartView === view.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
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

                  {/* Chart Type Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowChartTypeSelector(!showChartTypeSelector)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-muted/50 transition-all text-sm"
                    >
                      {currentChartType && <currentChartType.icon className="w-4 h-4 text-primary" />}
                      <span className="font-medium hidden sm:inline">{currentChartType?.label}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showChartTypeSelector ? 'rotate-180' : ''}`} />
                    </button>

                    {showChartTypeSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        {chartTypeOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setChartType(option.id as any);
                              setShowChartTypeSelector(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${chartType === option.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                              }`}
                          >
                            <option.icon className="w-5 h-5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm">{option.label}</div>
                              <div className="text-xs opacity-70 truncate">{option.description}</div>
                            </div>
                            {chartType === option.id && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
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
                    chartType={chartType}
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
                    chartType={chartType}
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
                    chartType={chartType}
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
                    chartType={chartType}
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
    return <DashboardSkeleton />;
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