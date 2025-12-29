using Domain.Base;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Comment : BaseAuditableEntity
    {
        public string Content { get; set; } = string.Empty;
        public int LikesCount { get; set; } = 0;
        public int RepliesCount { get; set; } = 0;
        
        // Foreign Keys
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        public Guid? ParentCommentId { get; set; }
        
        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Post Post { get; set; } = null!;
        public virtual Comment? ParentComment { get; set; }
        public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();
        public virtual ICollection<CommentLike> Likes { get; set; } = new List<CommentLike>();
    }
}