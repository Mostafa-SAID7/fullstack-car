using Domain.Entities.Identity;
using Domain.Enums.Admin.System;

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

    // Additional properties expected by Infrastructure
    public string EntityName { get; set; } = string.Empty; // Alias for EntityType
    public string Changes { get; set; } = string.Empty; // Combined old/new values
    public string UserName { get; set; } = string.Empty; // User display name

    // Navigation properties
    public ApplicationUser? User { get; set; }
}
