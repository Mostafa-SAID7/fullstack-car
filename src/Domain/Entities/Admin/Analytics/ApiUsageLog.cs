namespace Domain.Entities.Admin.Analytics;

public class ApiUsageLog : BaseEntity
{
    public string ApiKey { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
    public int RequestCount { get; set; }
    public long DataTransferred { get; set; }
    public DateTime Timestamp { get; set; }
    public string ClientId { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
}