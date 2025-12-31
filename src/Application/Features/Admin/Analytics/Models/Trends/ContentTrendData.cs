namespace Application.Features.Admin.Analytics.Models.Trends
{
    public class ContentTrendData
    {
        public DateTime Date { get; set; }
        public int Posts { get; set; }
        public int Comments { get; set; }
        public int Views { get; set; }
        public int Engagement { get; set; }
        public int Groups { get; set; }
        public int Reviews { get; set; }
    }
}