using Domain.Base;
using Domain.Enums.Community.Reviews;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Reviews
{
    public class ReviewComment : BaseAuditableEntity
    {
        public string Content { get; set; } = string.Empty;
        public CommentStatus Status { get; set; } = CommentStatus.Published;
        public int LikesCount { get; set; } = 0;
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        // Foreign Keys
        public Guid ReviewId { get; set; }
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual CommunityReview Review { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ICollection<ReviewCommentLike> Likes { get; set; } = new List<ReviewCommentLike>();
    }
}