using Domain.Base;

namespace Domain.Entities.Media;

public class PodcastSubscription : BaseEntity
{
    public Guid PodcastId { get; set; }
    public Guid UserId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? UnsubscribedAt { get; set; }
    
    // Navigation properties
    public virtual Podcast Podcast { get; set; } = null!;
}