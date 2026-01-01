using Domain.Base;
using Domain.Enums.Community.News;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.News
{
    public class NewsComment : BaseAuditableEntity
    {
        public string Content { get; set; } = string.Empty;
        public CommentStatus Status { get; set; } = CommentStatus.Published;
        public int LikesCount { get; set; } = 0;
        public int RepliesCount { get; set; } = 0;
        public new bool IsDeleted { get; set; } = false;
        public new DateTime? DeletedAt { get; set; }
        public bool IsPinned { get; set; } = false;

        // Foreign Keys
        public Guid ArticleId { get; set; }
        public Guid UserId { get; set; }
        public Guid? ParentCommentId { get; set; }

        // Navigation Properties
        public virtual Article Article { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual NewsComment? ParentComment { get; set; }
        public virtual ICollection<NewsComment> Replies { get; set; } = new List<NewsComment>();
        public virtual ICollection<CommentLike> Likes { get; set; } = new List<CommentLike>();
    }
}