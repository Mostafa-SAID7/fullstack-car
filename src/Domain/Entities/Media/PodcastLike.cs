using Domain.Base;

namespace Domain.Entities.Media;

public class PodcastLike : BaseEntity
{
    public Guid PodcastId { get; set; }
    public Guid UserId { get; set; }
    
    // Navigation properties
    public virtual Podcast Podcast { get; set; } = null!;
}