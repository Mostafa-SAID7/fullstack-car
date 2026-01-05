// Analytics Page Component Props Types

export interface AnalyticsHeaderProps {
  title?: string;
  description?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  onDateRangeChange?: (range: { start: string; end: string }) => void;
}

export interface AnalyticsMetricsProps {
  metrics: any[];
  loading?: boolean;
  title?: string;
}

export interface AnalyticsOverviewProps {
  data?: any;
  loading?: boolean;
  period?: string;
}

export interface PerformanceScoreProps {
  score: number;
  label: string;
  maxScore?: number;
  color?: string;
}

export interface ScrollDepthChartProps {
  data: any[];
  loading?: boolean;
}

export interface SEOScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  color?: string;
  trend?: number;
}

export interface KeywordRankingProps {
  keyword: string;
  position: number;
  previousPosition?: number;
  searchVolume?: number;
  difficulty?: number;
}

export interface SettingSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}
