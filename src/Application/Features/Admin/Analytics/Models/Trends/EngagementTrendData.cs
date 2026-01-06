namespace Application.Features.Admin.Analytics.Models.Trends
{
    public class EngagementTrendData
    {
        public DateTime Date { get; set; }
        public int Likes { get; set; }
        public int Comments { get; set; }
        public int Shares { get; set; }
        public int Views { get; set; }
        public double EngagementRate { get; set; }
    }
}
