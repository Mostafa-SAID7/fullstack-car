// Analytics Component - AI Agent Analytics Dashboard

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  RefreshCw,
  TrendingUp,
  MessageSquare,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import { analyticsService } from '../../../services/ai-agent';
import { useToast } from '../../../hooks';
import type { AnalyticsOverview } from '../../../types/ai-agent';
import { ConversationChart } from './ConversationChart';
import { AgentPerformanceChart } from './AgentPerformanceChart';
import { TopicAnalysis } from './TopicAnalysis';
import { SatisfactionTrendsChart } from './SatisfactionTrendsChart';

export const Analytics: React.FC = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const params = getDateRangeParams();
      const data = await analyticsService.getOverview(params);
      setOverview(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeParams = () => {
    const endDate = new Date().toISOString();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case 'all':
        return {};
    }
    
    return {
      startDate: startDate.toISOString(),
      endDate
    };
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setExporting(true);
      const params = getDateRangeParams();
      const blob = await analyticsService.exportAnalytics(format, params);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${dateRange}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast.error('Failed to export analytics');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">AI agent performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>

          {/* Export Dropdown */}
          <div className="relative group">
            <button
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left hover:bg-muted/50 rounded-t-lg transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left hover:bg-muted/50 rounded-b-lg transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>

          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold">{overview.totalConversations.toLocaleString()}</h3>
            </div>
            <p className="text-sm text-muted-foreground">Total Conversations</p>
            <p className="text-xs text-green-600 mt-1">
              {overview.activeConversations} active
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold">{overview.satisfactionScore.toFixed(1)}%</h3>
            </div>
            <p className="text-sm text-muted-foreground">Satisfaction Score</p>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.averageResponseTime.toFixed(0)}ms avg response
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold">${(overview.tokensUsed * 0.00001).toFixed(2)}</h3>
            </div>
            <p className="text-sm text-muted-foreground">Estimated Cost</p>
            <p className="text-xs text-muted-foreground mt-1">
              {overview.tokensUsed.toLocaleString()} tokens
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold">{overview.uptime.toFixed(1)}%</h3>
            </div>
            <p className="text-sm text-muted-foreground">System Uptime</p>
            <p className="text-xs text-red-600 mt-1">
              {overview.errorRate.toFixed(2)}% error rate
            </p>
          </motion.div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Trends */}
        <ConversationChart dateRange={dateRange} />

        {/* Agent Performance */}
        <AgentPerformanceChart dateRange={dateRange} />

        {/* Topic Analysis */}
        <TopicAnalysis dateRange={dateRange} />

        {/* Satisfaction Trends */}
        <SatisfactionTrendsChart dateRange={dateRange} />
      </div>
    </div>
  );
};
