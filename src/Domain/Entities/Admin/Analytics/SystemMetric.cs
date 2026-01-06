namespace Domain.Entities.Admin.Analytics;

public class AdminSystemMetric : BaseEntity
{
    public string MetricName { get; set; } = string.Empty;
    public double Value { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Tags { get; set; }
}
