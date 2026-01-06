import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface SimplePageAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  hideOnMobile?: boolean;
}

export interface SimplePageHeaderProps {
  title: string;
  description: string;
  actions: SimplePageAction[];
}

export const SimplePageHeader: React.FC<SimplePageHeaderProps> = ({
  title,
  description,
  actions
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              action.hideOnMobile ? 'hidden sm:flex' : 'flex'
            } ${
              action.variant === 'primary'
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <action.icon className="w-4 h-4" />
            <span className={action.hideOnMobile ? 'hidden sm:inline' : ''}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SimplePageHeader;