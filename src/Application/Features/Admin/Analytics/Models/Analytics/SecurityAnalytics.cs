using Application.Features.Admin.Analytics.Models.Alerts;
using Application.Features.Admin.Analytics.Models.Events;

namespace Application.Features.Admin.Analytics.Models.Analytics
{
    public class SecurityAnalytics
    {
        public int FailedLoginAttempts { get; set; }
        public int SuspiciousActivities { get; set; }
        public int BlockedIPs { get; set; }
        public int SecurityIncidents { get; set; }
        public List<SecurityThreat> RecentThreats { get; set; } = new();
        public List<SecurityEvent> SecurityEvents { get; set; } = new();
    }
}