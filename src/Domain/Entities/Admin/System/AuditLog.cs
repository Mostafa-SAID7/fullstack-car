using Domain.Entities.Identity;

namespace Domain.Entities.Admin.System;

public class AuditLog : BaseEntity
{
    public Guid? UserId { get; set; }
    public AuditActionType Action { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? AdditionalData { get; set; }

    // Navigation properties
    public ApplicationUser? User { get; set; }
}