import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { MoreVertical, MoreHorizontal } from 'lucide-react';
import { useIsMobile, useIsTouchDevice } from '../../hooks/useResponsive';

interface Action {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'primary';
  disabled?: boolean;
}

interface ResponsiveActionMenuProps {
  actions: Action[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

/**
 * Responsive Action Menu Component
 * Touch-friendly dropdown menu for actions
 */
export const ResponsiveActionMenu: React.FC<ResponsiveActionMenuProps> = ({
  actions,
  orientation = 'vertical',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isTouchDevice = useIsTouchDevice();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleActionClick = (action: Action) => {
    if (!action.disabled) {
      action.onClick();
      setIsOpen(false);
    }
  };

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive hover:bg-destructive/10';
      case 'primary':
        return 'text-primary hover:bg-primary/10';
      default:
        return 'text-foreground hover:bg-muted';
    }
  };

  // Use larger touch targets on mobile/touch devices
  const buttonSize = isMobile || isTouchDevice ? 'h-10 w-10' : 'h-8 w-8';
  const menuItemPadding = isMobile || isTouchDevice ? 'px-4 py-3' : 'px-3 py-2';

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonSize} flex items-center justify-center rounded-lg hover:bg-muted transition-colors`}
        aria-label="Actions"
      >
        {orientation === 'vertical' ? (
          <MoreVertical className="w-5 h-5" />
        ) : (
          <MoreHorizontal className="w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Menu */}
          <div
            className={`
              absolute right-0 mt-2 min-w-[200px] bg-card border border-border rounded-lg shadow-lg z-50
              ${isMobile ? 'fixed bottom-0 left-0 right-0 mt-0 rounded-t-lg rounded-b-none' : ''}
            `}
          >
            <div className={isMobile ? 'max-h-[50vh] overflow-y-auto' : ''}>
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled}
                  className={`
                    w-full flex items-center gap-3 ${menuItemPadding} text-left text-sm transition-colors
                    ${getVariantClasses(action.variant)}
                    ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${index === 0 ? 'rounded-t-lg' : ''}
                    ${index === actions.length - 1 ? 'rounded-b-lg' : 'border-b border-border'}
                  `}
                >
                  {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                  <span className="flex-1">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Responsive Button Group
 * Shows buttons inline on desktop, dropdown on mobile
 */
export const ResponsiveButtonGroup: React.FC<{
  actions: Action[];
  className?: string;
}> = ({
  actions,
  className = ''
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ResponsiveActionMenu actions={actions} className={className} />;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${action.variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' :
              action.variant === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
              'bg-secondary text-secondary-foreground hover:bg-secondary/90'}
            ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};
