using Domain.Base;

namespace Domain.Entities
{
    public class PostLike : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid PostId { get; set; }
        
        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Post Post { get; set; } = null!;
    }
}