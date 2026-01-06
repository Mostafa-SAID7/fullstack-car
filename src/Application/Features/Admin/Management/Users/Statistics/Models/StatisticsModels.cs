namespace Application.Features.Admin.Management.Users.Statistics.Models
{
    public class UserStatistics
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int SuspendedUsers { get; set; }
        public int BannedUsers { get; set; }
        public int NewUsersThisMonth { get; set; }
        public double UserGrowthRate { get; set; }
        public int VerifiedUsers { get; set; }
        public int UnverifiedUsers { get; set; }
        public Dictionary<string, int> UsersByRole { get; set; } = new();
        public Dictionary<string, int> UsersByStatus { get; set; } = new();
    }

    public class UserOverviewStatistics
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int NewUsersToday { get; set; }
        public int NewUsersThisWeek { get; set; }
        public int NewUsersThisMonth { get; set; }
        public double UserGrowthRate { get; set; }
        public double ActiveUserPercentage { get; set; }
        public Dictionary<string, int> UsersByStatus { get; set; } = new();
    }

    public class UserGrowthStatistics
    {
        public List<GrowthDataPoint> GrowthData { get; set; } = new();
        public double GrowthRate { get; set; }
        public int TotalNewUsers { get; set; }
        public string Period { get; set; } = string.Empty;
    }

    public class GrowthDataPoint
    {
        public DateTime Date { get; set; }
        public int NewUsers { get; set; }
        public int TotalUsers { get; set; }
    }

    public class UserEngagementStatistics
    {
        public double AverageSessionDuration { get; set; }
        public double AveragePostsPerUser { get; set; }
        public double AverageCommentsPerUser { get; set; }
        public int DailyActiveUsers { get; set; }
        public int WeeklyActiveUsers { get; set; }
        public int MonthlyActiveUsers { get; set; }
        public Dictionary<string, double> EngagementByFeature { get; set; } = new();
    }

    public class UserDemographics
    {
        public Dictionary<string, int> UsersByCountry { get; set; } = new();
        public Dictionary<string, int> UsersByAge { get; set; } = new();
        public Dictionary<string, int> UsersByRole { get; set; } = new();
        public Dictionary<string, int> UsersByRegistrationSource { get; set; } = new();
    }

    public class UserRetentionStatistics
    {
        public double Day1Retention { get; set; }
        public double Day7Retention { get; set; }
        public double Day30Retention { get; set; }
        public List<RetentionCohort> RetentionCohorts { get; set; } = new();
    }

    public class RetentionCohort
    {
        public DateTime CohortDate { get; set; }
        public int InitialUsers { get; set; }
        public Dictionary<int, double> RetentionRates { get; set; } = new();
    }

    public class ExportResult
    {
        public byte[] FileContent { get; set; } = Array.Empty<byte>();
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
    }
}