import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  Settings,
  Bot,
  BarChart3,
  Shield,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export const DashboardActions: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create a new user account',
      icon: Plus,
      color: 'blue',
      action: () => navigate('/users?action=create')
    },
    {
      title: 'Manage Content',
      description: 'Review and moderate posts',
      icon: FileText,
      color: 'green',
      action: () => navigate('/content')
    },
    {
      title: 'View Analytics',
      description: 'Detailed platform insights',
      icon: BarChart3,
      color: 'purple',
      action: () => navigate('/analytics')
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      color: 'orange',
      action: () => navigate('/settings')
    }
  ];

  const systemActions = [
    {
      title: 'AI Agent Status',
      description: 'Monitor AI performance',
      icon: Bot,
      color: 'pink',
      action: () => navigate('/ai-agent')
    },
    {
      title: 'Security Center',
      description: 'Review security logs',
      icon: Shield,
      color: 'red',
      action: () => navigate('/system?tab=security')
    },
    {
      title: 'Export Data',
      description: 'Download platform data',
      icon: Download,
      color: 'cyan',
      action: () => console.log('Export data')
    },
    {
      title: 'Refresh Cache',
      description: 'Clear system cache',
      icon: RefreshCw,
      color: 'emerald',
      action: () => console.log('Refresh cache')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
      green: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
      purple: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
      orange: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
      pink: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
      red: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
      cyan: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                onClick={action.action}
                className="bg-card rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 group border border-border/50 hover:border-border"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all",
                  getColorClasses(action.color)
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* System Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Settings className="w-4 h-4 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">System Management</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                onClick={action.action}
                className="bg-card rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 group border border-border/50 hover:border-border"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all",
                  getColorClasses(action.color)
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};