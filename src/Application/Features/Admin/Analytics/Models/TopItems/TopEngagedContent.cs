namespace Application.Features.Admin.Analytics.Models.TopItems
{
    public class TopEngagedContent
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public double EngagementRate { get; set; }
        public int TotalEngagements { get; set; }
    }
}