using Application.Features.Admin.Analytics.Models.Demographics;
using Application.Features.Admin.Analytics.Models.Trends;
using Application.Features.Admin.Analytics.Models.TopItems;

namespace Application.Features.Admin.Analytics.Models.Analytics
{
    public class UserAnalytics
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int NewUsersToday { get; set; }
        public int NewUsersThisWeek { get; set; }
        public int NewUsersThisMonth { get; set; }
        public double UserGrowthRate { get; set; }
        public double UserRetentionRate { get; set; }
        public List<UserDemographic> Demographics { get; set; } = new();
        public List<UserActivityTrend> ActivityTrends { get; set; } = new();
        public List<TopUser> TopUsers { get; set; } = new();
    }
}