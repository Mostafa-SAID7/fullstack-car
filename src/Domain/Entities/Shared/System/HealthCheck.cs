namespace Domain.Entities.Shared.System;

public class HealthCheck : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Healthy, Degraded, Unhealthy
    public string? Description { get; set; }
    public TimeSpan Duration { get; set; }
    public string? Data { get; set; } // JSON
    public string? Exception { get; set; }
    public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
    public string? Tags { get; set; }
}