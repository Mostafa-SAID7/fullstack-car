using Domain.Base;

namespace Domain.Entities.Media;

public class PodcastCommentLike : BaseEntity
{
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }
    
    // Navigation properties
    public virtual PodcastComment Comment { get; set; } = null!;
}