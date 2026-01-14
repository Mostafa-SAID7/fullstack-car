import React, { useState } from 'react';
import { Save, Key, Zap, Shield, DollarSign, Bell, Database, Settings as SettingsIcon } from 'lucide-react';
import type { AIAgentConfig } from '../../../types/config';

interface AIAgentSettingsProps {
  config: AIAgentConfig;
  onConfigUpdate: (updates: Partial<AIAgentConfig>) => void;
}

export const AIAgentSettings: React.FC<AIAgentSettingsProps> = ({
  config,
  onConfigUpdate
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'llm' | 'api' | 'cache' | 'cost' | 'notifications'>('general');
  const [showApiKey, setShowApiKey] = useState(false);

  const toggleSetting = (key: keyof AIAgentConfig) => {
    onConfigUpdate({ [key]: !config[key] });
  };

  const handleSave = () => {
    // Save settings logic
    console.log('Saving settings:', config);
  };

  const sections = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'llm', label: 'LLM Provider', icon: <Database className="w-4 h-4" /> },
    { id: 'api', label: 'API & Rate Limiting', icon: <Zap className="w-4 h-4" /> },
    { id: 'cache', label: 'Caching', icon: <Shield className="w-4 h-4" /> },
    { id: 'cost', label: 'Cost Limits', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">AI Agent Settings</h2>
          <p className="text-muted-foreground mt-1">
            Configure global AI agent behavior and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Section Navigation */}
      <div className="bg-card border border-border rounded-2xl p-2">
        <div className="flex gap-2 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeSection === 'general' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">General Settings</h3>
            <div className="space-y-4">
              {/* Enable AI Agent */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-card-foreground">Enable AI Agent</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Turn the AI agent on or off globally
                  </p>
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

              {/* Auto-Learning */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-card-foreground">Auto-Learning</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically improve responses based on user feedback
                  </p>
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

              {/* Debug Mode */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-card-foreground">Debug Mode</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable detailed logging for troubleshooting
                  </p>
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
          </div>
        </div>
      )}

      {/* LLM Provider Settings */}
      {activeSection === 'llm' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">LLM Provider Configuration</h3>
            <div className="space-y-4">
              {/* Primary Provider */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Primary Provider</label>
                <select
                  value={config.llmProvider || 'openai'}
                  onChange={(e) => onConfigUpdate({ llmProvider: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="openai">OpenAI (GPT-4)</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="local">Local Model</option>
                  <option value="huggingface">HuggingFace</option>
                </select>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Model</label>
                <select
                  value={config.model || 'gpt-4'}
                  onChange={(e) => onConfigUpdate({ model: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                </select>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Temperature: {config.temperature || 0.7}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.temperature || 0.7}
                  onChange={(e) => onConfigUpdate({ temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Lower values make responses more focused, higher values more creative
                </p>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Max Tokens</label>
                <input
                  type="number"
                  value={config.maxTokens || 2000}
                  onChange={(e) => onConfigUpdate({ maxTokens: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="100"
                  max="8000"
                />
              </div>

              {/* Fallback Provider */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Fallback Provider</label>
                <select
                  value={config.fallbackProvider || 'local'}
                  onChange={(e) => onConfigUpdate({ fallbackProvider: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="none">None</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="local">Local Model</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Used when primary provider is unavailable
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API & Rate Limiting */}
      {activeSection === 'api' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">API Configuration</h3>
            <div className="space-y-4">
              {/* API Endpoint */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">API Endpoint</label>
                <input
                  type="url"
                  value={config.apiEndpoint}
                  onChange={(e) => onConfigUpdate({ apiEndpoint: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://api.example.com/v1"
                />
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    defaultValue="sk-••••••••••••••••••••••••"
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-20"
                    placeholder="Enter your API key"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    {showApiKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key is encrypted and stored securely
                </p>
              </div>

              {/* Rate Limit */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Rate Limit (requests/minute)
                </label>
                <input
                  type="number"
                  value={config.rateLimit}
                  onChange={(e) => onConfigUpdate({ rateLimit: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                  max="1000"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of API requests per minute
                </p>
              </div>

              {/* Timeout */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Timeout (seconds)</label>
                <input
                  type="number"
                  value={config.timeout}
                  onChange={(e) => onConfigUpdate({ timeout: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                  max="300"
                />
              </div>

              {/* Retry Logic */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Max Retries</label>
                <input
                  type="number"
                  value={config.maxRetries || 3}
                  onChange={(e) => onConfigUpdate({ maxRetries: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                  max="10"
                />
                <p className="text-xs text-muted-foreground">
                  Number of retry attempts on API failure
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Caching Settings */}
      {activeSection === 'cache' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Caching Configuration</h3>
            <div className="space-y-4">
              {/* Enable Caching */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-card-foreground">Enable Response Caching</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cache identical prompts for faster responses
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting('enableCaching')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.enableCaching ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.enableCaching ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Cache TTL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Cache TTL (Time To Live)
                </label>
                <select
                  value={config.cacheTTL || 3600}
                  onChange={(e) => onConfigUpdate({ cacheTTL: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="300">5 minutes</option>
                  <option value="900">15 minutes</option>
                  <option value="1800">30 minutes</option>
                  <option value="3600">1 hour</option>
                  <option value="7200">2 hours</option>
                  <option value="86400">24 hours</option>
                  <option value="604800">7 days</option>
                </select>
              </div>

              {/* Cache Strategy */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Cache Strategy</label>
                <select
                  value={config.cacheStrategy || 'lru'}
                  onChange={(e) => onConfigUpdate({ cacheStrategy: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="lru">LRU (Least Recently Used)</option>
                  <option value="lfu">LFU (Least Frequently Used)</option>
                  <option value="fifo">FIFO (First In First Out)</option>
                </select>
              </div>

              {/* Max Cache Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Max Cache Size (MB)
                </label>
                <input
                  type="number"
                  value={config.maxCacheSize || 100}
                  onChange={(e) => onConfigUpdate({ maxCacheSize: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="10"
                  max="1000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Limits */}
      {activeSection === 'cost' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Cost Management</h3>
            <div className="space-y-4">
              {/* Enable Cost Limits */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-card-foreground">Enable Cost Limits</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Prevent excessive API usage costs
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting('enableCostLimits')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.enableCostLimits ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.enableCostLimits ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Daily Cost Limit */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Daily Cost Limit ($)
                </label>
                <input
                  type="number"
                  value={config.dailyCostLimit || 100}
                  onChange={(e) => onConfigUpdate({ dailyCostLimit: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                  step="0.01"
                />
              </div>

              {/* Monthly Cost Limit */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Monthly Cost Limit ($)
                </label>
                <input
                  type="number"
                  value={config.monthlyCostLimit || 1000}
                  onChange={(e) => onConfigUpdate({ monthlyCostLimit: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                  step="0.01"
                />
              </div>

              {/* Cost Alert Threshold */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Alert Threshold (%)
                </label>
                <input
                  type="number"
                  value={config.costAlertThreshold || 80}
                  onChange={(e) => onConfigUpdate({ costAlertThreshold: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                  max="100"
                />
                <p className="text-xs text-muted-foreground">
                  Send alert when reaching this percentage of limit
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeSection === 'notifications' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {/* Error Notifications */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-card-foreground">Error Notifications</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notified when errors occur
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting('notifyOnError')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.notifyOnError ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.notifyOnError ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Cost Limit Notifications */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-card-foreground">Cost Limit Alerts</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notified when approaching cost limits
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting('notifyOnCostLimit')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.notifyOnCostLimit ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.notifyOnCostLimit ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Training Complete Notifications */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <h4 className="font-medium text-card-foreground">Training Complete</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notified when training sessions complete
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting('notifyOnTrainingComplete')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.notifyOnTrainingComplete ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.notifyOnTrainingComplete ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notification Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Notification Email
                </label>
                <input
                  type="email"
                  value={config.notificationEmail || ''}
                  onChange={(e) => onConfigUpdate({ notificationEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
