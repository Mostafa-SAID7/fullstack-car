using Domain.Base;

namespace Domain.Entities.Media;

public class VideoLike : BaseEntity
{
    public Guid VideoId { get; set; }
    public Guid UserId { get; set; }
    public bool IsLike { get; set; } = true; // true = like, false = dislike
    
    // Navigation properties
    public virtual Video Video { get; set; } = null!;
}
