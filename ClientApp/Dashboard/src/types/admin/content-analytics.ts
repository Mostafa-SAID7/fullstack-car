// Admin Content Analytics Types

export interface ContentAnalytics {
  totalContent: number;
  contentGrowthRate: number;
  topCategories: CategoryData[];
  contentTrends: ContentTrendData[];
}

export interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

export interface ContentTrendData {
  date: string;
  posts: number;
  comments: number;
  likes: number;
}



