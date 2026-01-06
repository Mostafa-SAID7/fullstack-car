import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Maximize2, Minimize2, MoreHorizontal } from 'lucide-react';

export interface CardAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export interface SharedCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  expandable?: boolean;
  actions?: CardAction[];
  loading?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footer?: React.ReactNode;
}

export const SharedCard: React.FC<SharedCardProps> = ({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultCollapsed = false,
  expandable = false,
  actions = [],
  loading = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
  footer
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  if (loading) {
    return (
      <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
        <div className="animate-pulse">
          {(title || subtitle) && (
            <div className="p-4 border-b border-border">
              <div className="h-5 bg-muted rounded mb-2"></div>
              {subtitle && <div className="h-4 bg-muted rounded w-2/3"></div>}
            </div>
          )}
          <div className="p-4">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={`bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        isExpanded ? 'fixed inset-4 z-50' : ''
      } ${className}`}
    >
      {/* Header */}
      {(title || subtitle || collapsible || expandable || actions.length > 0) && (
        <div className={`p-4 border-b border-border flex items-center justify-between ${headerClassName}`}>
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Expandable */}
            {expandable && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-muted rounded transition-colors"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Collapsible */}
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-muted rounded transition-colors"
                title={isCollapsed ? 'Expand' : 'Collapse'}
              >
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Actions Menu */}
            {actions.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-40"
                    >
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            action.onClick();
                            setShowActions(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                            action.variant === 'danger' ? 'text-destructive' : 'text-foreground'
                          }`}
                        >
                          {action.icon}
                          {action.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`overflow-hidden ${contentClassName}`}
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {footer && !isCollapsed && (
        <div className="p-4 border-t border-border bg-muted/25">
          {footer}
        </div>
      )}

      {/* Expanded overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </motion.div>
  );
};

export default SharedCard;