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
    <div className="space-y-8">
      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-card border border-border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl p-8"
      >
        {/* Background decoration */}

        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">General Settings</h3>
                <p className="text-muted-foreground mt-1">Configure core AI agent behavior and preferences</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Setting
            </motion.button>
          </div>

          <div className="space-y-8">
            {/* Enable AI Agent */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border border-border/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground mb-1">Enable AI Agent</h4>
                  <p className="text-muted-foreground leading-relaxed">Turn the AI agent on or off globally. When disabled, all AI features will be suspended.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      config.isEnabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${config.isEnabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      {config.isEnabled ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleSetting('isEnabled')}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 shadow-lg ${
                  config.isEnabled
                    ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/25'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all ${
                    config.isEnabled ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </motion.div>

            {/* Auto-Learning */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border border-border/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground mb-1">Auto-Learning</h4>
                  <p className="text-muted-foreground leading-relaxed">Automatically improve responses based on user feedback and interaction patterns.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      config.autoLearning
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${config.autoLearning ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
                      {config.autoLearning ? 'Learning Enabled' : 'Learning Disabled'}
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleSetting('autoLearning')}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 shadow-lg ${
                  config.autoLearning
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/25'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all ${
                    config.autoLearning ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </motion.div>

            {/* Debug Mode */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border border-border/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground mb-1">Debug Mode</h4>
                  <p className="text-muted-foreground leading-relaxed">Enable detailed logging for troubleshooting and performance monitoring.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      config.debugMode
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${config.debugMode ? 'bg-orange-500 animate-pulse' : 'bg-gray-400'}`} />
                      {config.debugMode ? 'Debug Active' : 'Debug Inactive'}
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleSetting('debugMode')}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 shadow-lg ${
                  config.debugMode
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/25'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all ${
                    config.debugMode ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden bg-card border border-border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl p-8"
      >
        {/* Background decoration */}

        <div className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">API Configuration</h3>
              <p className="text-muted-foreground mt-1">Configure external API connections and performance settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-3"
              >
                <label className="block text-sm font-semibold text-foreground">API Endpoint</label>
                <input
                  type="url"
                  value={config.apiEndpoint}
                  onChange={(e) => onConfigUpdate({ apiEndpoint: e.target.value })}
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 transition-all duration-200 placeholder:text-muted-foreground/50"
                  placeholder="https://api.example.com/v1"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-3"
              >
                <label className="block text-sm font-semibold text-foreground">API Key</label>
                <input
                  type="password"
                  defaultValue="••••••••••••••••"
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 transition-all duration-200 placeholder:text-muted-foreground/50"
                  placeholder="Enter your API key"
                />
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-3"
              >
                <label className="block text-sm font-semibold text-foreground">Rate Limit (requests/min)</label>
                <input
                  type="number"
                  value={config.rateLimit}
                  onChange={(e) => onConfigUpdate({ rateLimit: parseInt(e.target.value) })}
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 transition-all duration-200"
                  min="1"
                  max="1000"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="space-y-3"
              >
                <label className="block text-sm font-semibold text-foreground">Timeout (seconds)</label>
                <input
                  type="number"
                  value={config.timeout}
                  onChange={(e) => onConfigUpdate({ timeout: parseInt(e.target.value) })}
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 transition-all duration-200"
                  min="1"
                  max="300"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};