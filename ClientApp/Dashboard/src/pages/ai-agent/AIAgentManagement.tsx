import { TabNavigation, TabContent } from '../../components/layout/tabs/TabNavigation';
import {
  Save,
  RefreshCw,
  BarChart3,
  Brain,
  Database,
  Activity,
  FileText,
  Settings
} from 'lucide-react';
import { useAIAgent } from '../../hooks';
import type { TabConfig } from '../../types/common';
import { AIAgentOverview } from './components/AIAgentOverview';
import { AIAgentTraining } from './components/AIAgentTraining';
import { AIAgentModels } from './components/AIAgentModels';
import { AIAgentMonitoring } from './components/AIAgentMonitoring';
import { AIAgentDatasets } from './components/AIAgentDatasets';
import { AIAgentSettings } from './components/AIAgentSettings';

export const AIAgentManagement: React.FC = () => {
  const {
    config,
    updateConfig,
    metrics,
    trainingSessions,
    isTraining,
    startTraining,
    stopTraining,
    activeTab,
    setActiveTab
  } = useAIAgent();

  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 /> },
    { id: 'training', label: 'Training', icon: <Brain /> },
    { id: 'models', label: 'Models', icon: <Database /> },
    { id: 'monitoring', label: 'Monitoring', icon: <Activity /> },
    { id: 'datasets', label: 'Datasets', icon: <FileText /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <AIAgentOverview
            isAIEnabled={config.isEnabled}
            metrics={metrics}
          />
        );
      case 'training':
        return (
          <AIAgentTraining
            trainingSessions={trainingSessions}
            isTraining={isTraining}
            onStartTraining={startTraining}
            onStopTraining={stopTraining}
          />
        );
      case 'models':
        return (
          <AIAgentModels
            config={config}
            onConfigUpdate={updateConfig}
          />
        );
      case 'monitoring':
        return <AIAgentMonitoring />;
      case 'datasets':
        return <AIAgentDatasets />;
      case 'settings':
        return (
          <AIAgentSettings
            config={config}
            onConfigUpdate={updateConfig}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8 shadow-lg">
        {/* Background decoration */}

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 md:gap-6 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                <Brain className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10" />
                <div className="absolute -top-2 -right-2 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full animate-ping" />
                <div className="absolute -top-2 -right-2 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  AI Agent Management
                </h1>
                <div className="w-16 h-1 md:w-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-sm" />
                    <span className="text-sm font-semibold text-green-600">System Online</span>
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-blue-600">AI Active</span>
                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl font-medium">
              Comprehensive AI model training, monitoring, and configuration platform with advanced analytics, real-time insights, and intelligent automation capabilities
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Real-time Processing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Neural Networks</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Smart Learning</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 md:ml-8">
            <button className="flex items-center justify-center gap-3 px-4 md:px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-primary/20 text-sm md:text-base">
              <Save className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-4 md:px-6 py-3 bg-card border border-border/50 text-card-foreground rounded-2xl font-semibold hover:bg-muted/50 hover:shadow-lg transition-all duration-200 text-sm md:text-base">
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>
    </div>
  );
};