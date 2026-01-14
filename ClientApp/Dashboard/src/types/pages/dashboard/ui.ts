// Dashboard UI Component Props Types

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
  loading?: boolean;
}

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export interface AIAssistantProps {
  isEnabled?: boolean;
  className?: string;
}






