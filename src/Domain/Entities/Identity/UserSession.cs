using Domain.Base;

namespace Domain.Entities.Identity
{
    public class UserSession : BaseAuditableEntity
    {
        public Guid UserId { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public string? DeviceInfo { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? Location { get; set; }
        public DateTime LastActivity { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsRevoked { get; set; } = false;
        public DateTime? RevokedAt { get; set; }
        public string? RevokedReason { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;

        // Computed Properties
        public bool IsExpired => ExpiresAt.HasValue && ExpiresAt <= DateTime.UtcNow;
        public bool IsValid => IsActive && !IsRevoked && !IsExpired;
        public TimeSpan? TimeUntilExpiry => ExpiresAt?.Subtract(DateTime.UtcNow);
    }
}
