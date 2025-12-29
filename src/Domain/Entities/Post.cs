using Domain.Base;
using Domain.Enums;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Post : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public PostType Type { get; set; }
        public PostStatus Status { get; set; } = PostStatus.Published;
        public int ViewsCount { get; set; } = 0;
        public int LikesCount { get; set; } = 0;
        public int CommentsCount { get; set; } = 0;
        
        // Foreign Keys
        public Guid UserId { get; set; }
        public Guid? GroupId { get; set; }
        
        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Group? Group { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<PostLike> Likes { get; set; } = new List<PostLike>();
    }
}