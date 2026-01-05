// Chart Types

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'doughnut';
  title: string;
  data: any[];
  options?: Record<string, any>;
  colors?: string[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

