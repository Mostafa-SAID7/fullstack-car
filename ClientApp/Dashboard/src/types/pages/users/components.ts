// Users Page Component Types

import type { UserInfo } from '../../auth';

export interface UsersHeaderProps {
  title?: string;
  totalUsers?: number;
  activeUsers?: number;
  onCreateUser?: () => void;
  onExport?: () => void;
}

export interface UsersTableProps {
  users: UserInfo[];
  loading?: boolean;
  onUserAction: (action: string, userId: string) => void;
  onUserClick?: (user: UserInfo) => void;
  onUserEdit?: (user: UserInfo) => void;
  onUserDelete?: (userId: string) => void;
  onStatusChange?: (userId: string, status: UserInfo['status']) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export interface UsersFiltersProps {
  filters: {
    status?: string;
    role?: string;
    search?: string;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

export interface UsersEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
