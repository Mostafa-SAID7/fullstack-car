using Domain.Base;
using Domain.Enums.Community.Reviews;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Reviews
{
    public class CommunityReview : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; } // 1-5 stars
        public CommunityReviewType Type { get; set; }
        public Domain.Enums.Community.Reviews.ReviewStatus Status { get; set; } = Domain.Enums.Community.Reviews.ReviewStatus.Published;
        public string? ImageUrl { get; set; }
        public bool IsVerified { get; set; } = false;
        public int HelpfulCount { get; set; } = 0;
        public int UnhelpfulCount { get; set; } = 0;
        public bool IsFlagged { get; set; } = false;
        public string? FlagReason { get; set; }
        public string? PurchaseProof { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? Pros { get; set; } // JSON array
        public string? Cons { get; set; } // JSON array

        // Foreign Keys
        public Guid UserId { get; set; }
        public string? CarModel { get; set; }
        public string? CarBrand { get; set; }
        public int? CarYear { get; set; }
        public Guid? CategoryId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ReviewCategory? Category { get; set; }
        public virtual ICollection<ReviewHelpfulness> HelpfulnessVotes { get; set; } = new List<ReviewHelpfulness>();
        public virtual ICollection<ReviewComment> Comments { get; set; } = new List<ReviewComment>();
        public virtual ICollection<ReviewImage> Images { get; set; } = new List<ReviewImage>();
    }
}
