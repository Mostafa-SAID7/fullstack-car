// Dashboard Filter Types

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface DateRange {
  start: string;
  end: string;
  preset?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days' | 'custom';
}

export interface DashboardFilters {
  dateRange: DateRange;
  categories: string[];
  status: string[];
  users: string[];
}

