// Component Props Types
import React from 'react';
import type { User } from './user';
import type { UserFilters } from './filters';

export interface UsersTableProps {
  users: User[];
  onUserAction: (action: string, userId: string) => void;
  loading?: boolean;
}

export interface UsersFiltersProps {
  filters: UserFilters;
  showFilters: boolean;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}

export interface UsersHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

export interface UsersEmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export interface UserModalProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  mode: 'create' | 'edit' | 'view';
}

export interface UserStatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color?: string;
}