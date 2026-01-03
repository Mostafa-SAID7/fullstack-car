import { motion, AnimatePresence } from 'framer-motion';
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
import { useAIAgent } from '../../hooks/useAIAgent';
import type { TabConfig, TabId } from '../../types/common';
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
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'training', label: 'Training', icon: Brain },
    { id: 'models', label: 'Models', icon: Database },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'datasets', label: 'Datasets', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agent Management</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive AI model training, monitoring, and configuration platform
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};