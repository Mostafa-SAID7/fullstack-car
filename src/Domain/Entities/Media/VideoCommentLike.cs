using Domain.Base;

namespace Domain.Entities.Media;

public class VideoCommentLike : BaseEntity
{
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }
    
    // Navigation properties
    public virtual VideoComment Comment { get; set; } = null!;
}