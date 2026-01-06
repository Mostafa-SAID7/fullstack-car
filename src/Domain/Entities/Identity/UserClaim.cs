using Domain.Base;

namespace Domain.Entities.Identity
{
    public class UserClaim : BaseAuditableEntity
    {
        public Guid UserId { get; set; }
        public string ClaimType { get; set; } = string.Empty;
        public string ClaimValue { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;

        // Computed Properties
        public bool IsExpired => ExpiresAt.HasValue && ExpiresAt <= DateTime.UtcNow;
        public bool IsValid => IsActive && !IsExpired;
    }
}
