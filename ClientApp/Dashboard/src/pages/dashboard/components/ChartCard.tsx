import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={cn("dashboard-card rounded-2xl p-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 bg-muted rounded w-48 mb-2"></div>
              {description && <div className="h-4 bg-muted rounded w-32"></div>}
            </div>
            <div className="h-8 w-8 bg-muted rounded-lg"></div>
          </div>
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  const handleAIInsight = () => {
    window.dispatchEvent(new CustomEvent('ai-insight', {
      detail: { 
        prompt: `Can you analyze the "${title}" chart for me? ${description ? `It shows ${description}.` : ''}` 
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("dashboard-card rounded-2xl p-6", className)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        <button
          onClick={handleAIInsight}
          className="ml-4 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 group flex items-center gap-2"
          title="Get AI Insights"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity">
            AI Insight
          </span>
        </button>
      </div>

      {/* Chart Content */}
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
};