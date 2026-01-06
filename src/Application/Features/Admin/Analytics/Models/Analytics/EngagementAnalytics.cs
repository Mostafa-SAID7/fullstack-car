using Application.Features.Admin.Analytics.Models.Trends;
using Application.Features.Admin.Analytics.Models.TopItems;

namespace Application.Features.Admin.Analytics.Models.Analytics
{
    public class EngagementAnalytics
    {
        public int TotalLikes { get; set; }
        public int TotalShares { get; set; }
        public int TotalViews { get; set; }
        public double EngagementRate { get; set; }
        public double AverageSessionDuration { get; set; }
        public List<EngagementTrendData> EngagementTrends { get; set; } = new();
        public List<TopEngagedContent> TopEngagedContent { get; set; } = new();
    }
}
