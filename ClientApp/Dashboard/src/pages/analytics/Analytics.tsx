import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Activity,
  Search,
  Settings,
  Zap,
  Eye,
  Globe,
  RefreshCw
} from 'lucide-react';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';
import { SiteAnalytics } from './SiteAnalytics';
import { PerformanceMonitoring } from './PerformanceMonitoring';
import { SEOAnalysis } from './SEOAnalysis';
import { OnePageAnalytics } from './OnePageAnalytics';
import { AnalyticsSettings } from './AnalyticsSettings';

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('site-analytics');

  const tabs = [
    {
      id: 'site-analytics',
      label: 'Site Analytics',
      icon: BarChart3,
      description: 'Google Analytics-like insights'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Activity,
      description: 'Core Web Vitals & monitoring'
    },
    {
      id: 'seo',
      label: 'SEO Analysis',
      icon: Search,
      description: 'Search engine optimization'
    },
    {
      id: 'onepage',
      label: 'OnePage Analytics',
      icon: Zap,
      description: 'Single-page application metrics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Configure analytics tools'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'site-analytics':
        return <SiteAnalytics />;
      case 'performance':
        return <PerformanceMonitoring />;
      case 'seo':
        return <SEOAnalysis />;
      case 'onepage':
        return <OnePageAnalytics />;
      case 'settings':
        return <AnalyticsSettings />;
      default:
        return <SiteAnalytics />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4">
          Analytics Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive website analytics, performance monitoring, SEO analysis, and real-time insights
        </p>
      </motion.div>

      {/* Quick Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Visitors</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">154.2K</p>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">+12.5% from last month</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Performance Score</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">87%</p>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">Core Web Vitals</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">SEO Score</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">82%</p>
              <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">Search rankings</p>
            </div>
            <Search className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Sessions</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">1,247</p>
              <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">Real-time users</p>
            </div>
            <RefreshCw className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TabContent activeTab={activeTab}>
          {renderTabContent()}
        </TabContent>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
      >
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg">
              <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Site Analytics</h3>
          </div>
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            Comprehensive website analytics with visitor tracking, page views, and conversion metrics.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Performance</h3>
          </div>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Monitor Core Web Vitals, loading times, and technical performance metrics.
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 p-6 rounded-2xl border border-rose-200 dark:border-rose-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 dark:bg-rose-800/50 rounded-lg">
              <Search className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-semibold text-rose-900 dark:text-rose-100">SEO Analysis</h3>
          </div>
          <p className="text-sm text-rose-700 dark:text-rose-300">
            Keyword rankings, backlink analysis, and comprehensive SEO optimization tools.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg">
              <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">OnePage Analytics</h3>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Specialized analytics for single-page applications with user journey tracking.
          </p>
        </div>
      </motion.div>
    </div>
  );
};