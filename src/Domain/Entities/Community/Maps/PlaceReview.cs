using Domain.Base;
using Domain.Enums.Community.Maps;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Maps
{
    public class PlaceReview : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; } // 1-5 stars
        public Domain.Enums.Community.Maps.ReviewStatus Status { get; set; } = Domain.Enums.Community.Maps.ReviewStatus.Published;
        public string? ImageUrl { get; set; }
        public bool IsVerified { get; set; } = false;
        public int HelpfulCount { get; set; } = 0;
        public bool IsFlagged { get; set; } = false;
        public string? FlagReason { get; set; }
        public DateTime? VisitDate { get; set; }

        // Foreign Keys
        public Guid LocationId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual Location Location { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ICollection<ReviewHelpful> HelpfulVotes { get; set; } = new List<ReviewHelpful>();
        public virtual ICollection<ReviewImage> Images { get; set; } = new List<ReviewImage>();
    }
}
