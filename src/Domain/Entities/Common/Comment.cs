using Domain.Base;
using Domain.Enums.Common;
using Domain.Entities.Identity;

namespace Domain.Entities.Common
{
    public class Comment : BaseAuditableEntity
    {
        public string Content { get; set; } = string.Empty;
        public int LikesCount { get; set; } = 0;
        public int RepliesCount { get; set; } = 0;

        // Generic Content Reference
        public ContentType ContentType { get; set; }
        public Guid ContentId { get; set; }
        
        public Guid? ParentCommentId { get; set; }

        // Foreign Keys
        public Guid UserId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Comment? ParentComment { get; set; }
        public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();
        public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
    }
}
