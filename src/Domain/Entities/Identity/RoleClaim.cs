using Microsoft.AspNetCore.Identity;

namespace Domain.Entities.Identity
{
    public class RoleClaim : IdentityRoleClaim<Guid>
    {
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }

        // Navigation Properties
        public virtual ApplicationRole Role { get; set; } = null!;
    }
}
