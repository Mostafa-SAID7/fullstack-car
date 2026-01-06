using Application.Features.Admin.Analytics.Models.Demographics;
using Application.Features.Admin.Analytics.Models.Trends;
using Application.Features.Admin.Analytics.Models.TopItems;

namespace Application.Features.Admin.Analytics.Models.Analytics
{
    public class ContentAnalytics
    {
        public int TotalPosts { get; set; }
        public int TotalComments { get; set; }
        public int TotalGroups { get; set; }
        public int PostsToday { get; set; }
        public int PostsThisWeek { get; set; }
        public int PostsThisMonth { get; set; }
        public double ContentGrowthRate { get; set; }
        public List<ContentCategory> TopCategories { get; set; } = new();
        public List<ContentTrendData> ContentTrends { get; set; } = new();
        public List<PopularContent> PopularContent { get; set; } = new();
    }
}
