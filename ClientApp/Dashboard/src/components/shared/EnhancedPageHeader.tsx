import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface StatusIndicator {
  label: string;
  status: 'online' | 'active' | 'processing' | 'offline';
  count?: number;
  icon?: React.ReactNode;
}

export interface FeatureBadge {
  label: string;
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
}

export interface EnhancedPageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconGradient: {
    from: string;
    to: string;
  };
  titleGradient: {
    from: string;
    to: string;
  };
  statusIndicators?: StatusIndicator[];
  featureBadges?: FeatureBadge[];
  actions?: Array<{
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant: 'primary' | 'secondary';
  }>;
  className?: string;
}

export const EnhancedPageHeader: React.FC<EnhancedPageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  iconGradient,
  titleGradient,
  statusIndicators = [],
  featureBadges = [],
  actions = [],
  className = ''
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'text-green-600 bg-green-500/10 border-green-500/20';
      case 'processing':
        return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'offline':
        return 'text-red-600 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-600 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getFeatureColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-500';
      case 'blue':
        return 'text-blue-500';
      case 'purple':
        return 'text-purple-500';
      case 'orange':
        return 'text-orange-500';
      case 'red':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-card border border-border p-4 sm:p-6 lg:p-8 shadow-lg ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="relative flex flex-col gap-4 sm:gap-6">
        {/* Main Header Section - Responsive Layout */}
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 sm:gap-6">
          
          {/* Left Part - Icon + Title + Status Indicators + Feature Badges */}
          <div className="flex-shrink-0 order-1 xl:order-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6 mb-3 sm:mb-4">
              
              {/* Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${iconGradient.from} ${iconGradient.to} rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl sm:shadow-2xl relative overflow-hidden flex-shrink-0`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl sm:rounded-3xl" />
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white relative z-10" />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-yellow-400 rounded-full animate-ping" />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-yellow-400 rounded-full" />
              </div>
              
              {/* Title and Status */}
              <div className="flex-1 min-w-0">
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r ${titleGradient.from} ${titleGradient.to} bg-clip-text text-transparent mb-1 sm:mb-2 break-words`}>
                  {title}
                </h1>
                <div className={`w-12 h-0.5 sm:w-16 sm:h-1 lg:w-20 bg-gradient-to-r ${titleGradient.from} ${titleGradient.to} rounded-full mb-2 sm:mb-3`} />
                
                {/* Status Indicators - Responsive Grid */}
                {statusIndicators.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {statusIndicators.map((indicator, index) => (
                      <div key={index} className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 border rounded-full ${getStatusColor(indicator.status)} text-xs sm:text-sm`}>
                        <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r ${indicator.status === 'online' || indicator.status === 'active' ? 'from-green-400 to-green-500' : indicator.status === 'processing' ? 'from-blue-400 to-blue-500' : 'from-red-400 to-red-500'} rounded-full animate-pulse shadow-sm flex-shrink-0`} />
                        <span className="font-semibold whitespace-nowrap">
                          {indicator.label}
                          {indicator.count !== undefined && (
                            <span className="ml-1 text-xs opacity-80">({indicator.count})</span>
                          )}
                        </span>
                        {indicator.icon && (
                          <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0">
                            {indicator.icon}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Feature Badges - Responsive Layout */}
            {featureBadges.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
                {featureBadges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    {badge.icon && (
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 ${getFeatureColor(badge.color || 'gray')} flex-shrink-0`}>
                        {badge.icon}
                      </div>
                    )}
                    <span className="whitespace-nowrap">{badge.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Part - Description Panel */}
          <div className="flex-1 order-2 xl:order-2 xl:max-w-md 2xl:max-w-lg">
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md backdrop-blur-sm mb-4">
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                {description}
              </p>
            </div>
            
            {/* Action Buttons Only */}
            {actions.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-start">
                {actions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-xs sm:text-sm min-h-[36px] sm:min-h-[40px] ${
                      action.variant === 'primary'
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border border-primary/20 hover:scale-105'
                        : 'bg-card border border-border/50 text-card-foreground hover:bg-muted/50'
                    }`}
                  >
                    <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};