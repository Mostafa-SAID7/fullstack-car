namespace Application.Features.Admin.Analytics.Models.Trends
{
    public class UserActivityTrend
    {
        public DateTime Date { get; set; }
        public int ActiveUsers { get; set; }
        public int NewUsers { get; set; }
        public int ReturnedUsers { get; set; }
    }
}