using Domain.Base;

namespace Domain.Entities.Media;

public class PodcastPlay : BaseEntity
{
    public Guid PodcastId { get; set; }
    public Guid? UserId { get; set; } // Nullable for anonymous plays
    public string? IpAddress { get; set; }
    public TimeSpan PlayDuration { get; set; }
    public bool IsCompleted { get; set; } = false;
    public string? UserAgent { get; set; }
    public string? Country { get; set; }
    
    // Navigation properties
    public virtual Podcast Podcast { get; set; } = null!;
}
