// User Statistics Types
import type { UserSummary } from './user';

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  usersByMonth?: MonthlyUserData[];
  topActiveUsers?: UserSummary[];
}

export interface MonthlyUserData {
  month: string;
  year: number;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
}

export interface UserDashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  inactiveUsers: number;
  userGrowthRate: number;
  roleDistribution: Record<string, number>;
  activityOverview: {
    totalLogins: number;
    averageSessionTime: number;
    mostActiveHour: number;
    peakDayOfWeek: string;
  };
}