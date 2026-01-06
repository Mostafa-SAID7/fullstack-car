namespace Application.Features.Admin.Analytics.Models.TopItems
{
    public class PopularContent
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Views { get; set; }
        public int Likes { get; set; }
        public int Comments { get; set; }
        public double EngagementScore { get; set; }
    }
}
