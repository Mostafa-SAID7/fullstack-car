using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Maps
{
    public class ReviewHelpful : BaseEntity
    {
        public bool IsHelpful { get; set; } = true;
        public DateTime VotedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public Guid ReviewId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual PlaceReview Review { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
