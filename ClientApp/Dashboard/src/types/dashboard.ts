// Dashboard Related Types

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'custom';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: Record<string, any>;
  isVisible: boolean;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: string;
  color?: string;
  unit?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'doughnut';
  title: string;
  data: any[];
  options?: Record<string, any>;
  colors?: string[];
}

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