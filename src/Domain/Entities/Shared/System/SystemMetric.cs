namespace Domain.Entities.Shared.System;

public class SystemMetric : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public double Value { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Tags { get; set; }
    public DateTime MeasuredAt { get; set; } = DateTime.UtcNow;
    public string? Source { get; set; }
}