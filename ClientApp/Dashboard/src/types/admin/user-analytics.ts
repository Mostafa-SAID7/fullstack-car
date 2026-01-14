// Admin User Analytics Types

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  userGrowthRate: number;
  userActivity: UserActivityData[];
  demographics: UserDemographics;
}

export interface UserActivityData {
  date: string;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
}

export interface UserDemographics {
  ageGroups: Record<string, number>;
  locations: Record<string, number>;
  devices: Record<string, number>;
}





