using Domain.Base;
using Domain.Enums.Community.Pages;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Pages
{
    public class PageComment : BaseAuditableEntity
    {
        public string Content { get; set; } = string.Empty;
        public CommentStatus Status { get; set; } = CommentStatus.Published;
        public int LikesCount { get; set; } = 0;
        public int RepliesCount { get; set; } = 0;
        public new bool IsDeleted { get; set; } = false;
        public new DateTime? DeletedAt { get; set; }

        // Foreign Keys
        public Guid PageId { get; set; }
        public Guid UserId { get; set; }
        public Guid? ParentCommentId { get; set; }

        // Navigation Properties
        public virtual Page Page { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual PageComment? ParentComment { get; set; }
        public virtual ICollection<PageComment> Replies { get; set; } = new List<PageComment>();
        public virtual ICollection<PageCommentLike> Likes { get; set; } = new List<PageCommentLike>();
    }
}
