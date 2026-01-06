using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Maps
{
    public class CheckInComment : BaseAuditableEntity
    {
        public string Content { get; set; } = string.Empty;
        public new bool IsDeleted { get; set; } = false;
        public new DateTime? DeletedAt { get; set; }

        // Foreign Keys
        public Guid CheckInId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual CheckIn CheckIn { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
