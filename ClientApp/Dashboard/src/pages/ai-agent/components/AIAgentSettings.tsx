import { motion } from 'framer-motion';
import type { AIAgentConfig } from '../../../types/config';

interface AIAgentSettingsProps {
  config: AIAgentConfig;
  onConfigUpdate: (updates: Partial<AIAgentConfig>) => void;
}

export const AIAgentSettings: React.FC<AIAgentSettingsProps> = ({
  config,
  onConfigUpdate
}) => {
  const toggleSetting = (key: keyof AIAgentConfig) => {
    onConfigUpdate({ [key]: !config[key] });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-card rounded-3xl p-6"
      >
        <h3 className="font-bold text-lg mb-6">General Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable AI Agent</h4>
              <p className="text-sm text-muted-foreground">Turn the AI agent on or off globally</p>
            </div>
            <button
              onClick={() => toggleSetting('isEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.isEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-Learning</h4>
              <p className="text-sm text-muted-foreground">Automatically improve responses based on feedback</p>
            </div>
            <button
              onClick={() => toggleSetting('autoLearning')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.autoLearning ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.autoLearning ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Debug Mode</h4>
              <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
            </div>
            <button
              onClick={() => toggleSetting('debugMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.debugMode ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.debugMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="dashboard-card rounded-3xl p-6"
      >
        <h3 className="font-bold text-lg mb-6">API Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">API Endpoint</label>
              <input
                type="url"
                value={config.apiEndpoint}
                onChange={(e) => onConfigUpdate({ apiEndpoint: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input
                type="password"
                defaultValue="••••••••••••••••"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rate Limit (requests/min)</label>
              <input
                type="number"
                value={config.rateLimit}
                onChange={(e) => onConfigUpdate({ rateLimit: parseInt(e.target.value) })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Timeout (seconds)</label>
              <input
                type="number"
                value={config.timeout}
                onChange={(e) => onConfigUpdate({ timeout: parseInt(e.target.value) })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};