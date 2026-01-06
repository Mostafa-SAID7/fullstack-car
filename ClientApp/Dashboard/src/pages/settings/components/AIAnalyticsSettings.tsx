import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Brain, TrendingUp, Zap, Settings as SettingsIcon } from 'lucide-react';

export const AIAnalyticsSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* AI Powered Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-50/50 to-pink-100/30 rounded-xl border border-pink-200/50 p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-pink-700">AI Powered Analytics</h2>
            <p className="text-sm text-gray-600">Smart insights and intelligent data analysis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 rounded-lg p-4 border border-pink-200/30">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-pink-700">Machine Learning</span>
            </div>
            <p className="text-xs text-gray-600">Advanced pattern recognition and predictive analytics</p>
          </div>
          
          <div className="bg-white/50 rounded-lg p-4 border border-pink-200/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-pink-700">Trend Analysis</span>
            </div>
            <p className="text-xs text-gray-600">Real-time trend detection and forecasting</p>
          </div>
          
          <div className="bg-white/50 rounded-lg p-4 border border-pink-200/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-pink-700">Auto Insights</span>
            </div>
            <p className="text-xs text-gray-600">Automated insights and recommendations</p>
          </div>
        </div>
      </motion.div>

      {/* Analytics Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Analytics Configuration</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">Real-time Analytics</h4>
              <p className="text-sm text-muted-foreground">Enable real-time data processing and insights</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">Predictive Modeling</h4>
              <p className="text-sm text-muted-foreground">Use AI to predict future trends and patterns</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">Automated Reports</h4>
              <p className="text-sm text-muted-foreground">Generate intelligent reports automatically</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">Smart Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive AI-powered alerts and insights</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">98.5%</div>
            <div className="text-sm text-blue-600">Accuracy Rate</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-700">2.3s</div>
            <div className="text-sm text-green-600">Avg Response</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="text-2xl font-bold text-purple-700">1.2M</div>
            <div className="text-sm text-purple-600">Data Points</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="text-2xl font-bold text-orange-700">24/7</div>
            <div className="text-sm text-orange-600">Monitoring</div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4"
      >
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Save Configuration
        </button>
        <button className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
          Reset to Defaults
        </button>
      </motion.div>
    </div>
  );
};