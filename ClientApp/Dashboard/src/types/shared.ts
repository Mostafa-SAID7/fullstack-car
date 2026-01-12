// Shared Types for Components

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'date' | 'checkbox' | 'multiselect';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  action: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning';
}

export interface StatsCard {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
}

export interface ModalConfig {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  submitLabel: string;
  iconColor: string;
  iconBg: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}

export interface SearchCriteria {
  query?: string;
  filters?: Record<string, any>;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}