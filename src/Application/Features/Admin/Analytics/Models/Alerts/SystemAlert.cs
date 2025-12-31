namespace Application.Features.Admin.Analytics.Models.Alerts
{
    public class SystemAlert
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public bool IsResolved { get; set; }
    }
}