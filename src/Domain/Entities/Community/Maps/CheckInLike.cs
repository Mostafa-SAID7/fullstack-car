using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Maps
{
    public class CheckInLike : BaseEntity
    {
        public DateTime LikedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public Guid CheckInId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual CheckIn CheckIn { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
