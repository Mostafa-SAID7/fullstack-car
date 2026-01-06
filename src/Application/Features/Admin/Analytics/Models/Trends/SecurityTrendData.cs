namespace Application.Features.Admin.Analytics.Models.Trends
{
    public class SecurityTrendData
    {
        public DateTime Date { get; set; }
        public int FailedLogins { get; set; }
        public int SuspiciousActivities { get; set; }
        public int BlockedIPs { get; set; }
        public int SecurityIncidents { get; set; }
    }
}
