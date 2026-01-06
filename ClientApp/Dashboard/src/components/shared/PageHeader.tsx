import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface PageStat {
  label: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative';
  color?: string;
}

export interface PageAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  hideOnMobile?: boolean;
}

export interface PageHeaderProps {
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
  stats: PageStat[];
  actions: PageAction[];
  activeIndicator?: {
    value: string;
    label: string;
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  iconGradient,
  titleGradient,
  stats,
  actions,
  activeIndicator
}) => {
  // Get button styles based on variant and theme
  const getButtonStyles = (variant: string) => {
    const baseStyles = "inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-2xl font-semibold text-sm md:text-base transition-all duration-200";
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r ${iconGradient.from} ${iconGradient.to} text-white hover:shadow-xl`;
      
      case 'secondary':
        // Theme-aware secondary buttons with gradient hover
        if (iconGradient.from.includes('blue')) {
          return `${baseStyles} bg-transparent border-2 border-blue-300 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:border-blue-500 hover:text-white hover:shadow-md`;
        } else if (iconGradient.from.includes('indigo')) {
          return `${baseStyles} bg-transparent border-2 border-indigo-300 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-600 hover:border-indigo-500 hover:text-white hover:shadow-md`;
        } else if (iconGradient.from.includes('green')) {
          return `${baseStyles} bg-transparent border-2 border-green-300 text-green-600 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:border-green-500 hover:text-white hover:shadow-md`;
        } else {
          return `${baseStyles} bg-transparent border-2 border-blue-300 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:border-blue-500 hover:text-white hover:shadow-md`;
        }
      
      case 'outline':
        // Theme-aware outline buttons with gradient hover
        if (iconGradient.from.includes('blue')) {
          return `${baseStyles} bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border-2 border-blue-300 hover:border-blue-500 hover:text-white`;
        } else if (iconGradient.from.includes('indigo')) {
          return `${baseStyles} bg-white text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-600 border-2 border-indigo-300 hover:border-indigo-500 hover:text-white`;
        } else if (iconGradient.from.includes('green')) {
          return `${baseStyles} bg-white text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 border-2 border-green-300 hover:border-green-500 hover:text-white`;
        } else {
          return `${baseStyles} bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border-2 border-blue-300 hover:border-blue-500 hover:text-white`;
        }
      
      default:
        return `${baseStyles} text-muted-foreground hover:text-foreground hover:bg-muted`;
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8 shadow-lg">
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${iconGradient.from} ${iconGradient.to} rounded-3xl flex items-center justify-center shadow-xl`}>
              <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r ${titleGradient.from} ${titleGradient.to} bg-clip-text text-transparent mb-2`}>
                {title}
              </h1>
              <div className={`w-16 h-1 md:w-24 bg-gradient-to-r ${iconGradient.from} to-cyan-500 rounded-full mb-3`} />
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {description}
              </p>
              {activeIndicator && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground font-medium">
                    {activeIndicator.value} {activeIndicator.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {actions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`${getButtonStyles(action.variant || 'ghost')} ${
                  action.hideOnMobile ? 'hidden sm:inline-flex' : 'inline-flex'
                }`}
              >
                <action.icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className={action.hideOnMobile ? 'hidden sm:inline' : ''}>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === 'positive'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className={`p-4 bg-gradient-to-br ${stat.color || iconGradient.from}/10 ${stat.color || iconGradient.to}/10 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-7 h-7 ${stat.color || 'text-indigo-600'}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PageHeader;