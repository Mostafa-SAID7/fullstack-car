using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity
{
    public class UserRole : IdentityUserRole<Guid>
    {
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
        public Guid? AssignedBy { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; } = true;
        public string? Notes { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ApplicationRole Role { get; set; } = null!;
        public virtual ApplicationUser? AssignedByUser { get; set; }

        // Computed Properties
        public bool IsExpired => ExpiresAt.HasValue && ExpiresAt <= DateTime.UtcNow;
        public bool IsValid => IsActive && !IsExpired;
    }
}