using Domain.Base;

namespace Domain.Entities
{
    public class CommentLike : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid CommentId { get; set; }
        
        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Comment Comment { get; set; } = null!;
    }
}