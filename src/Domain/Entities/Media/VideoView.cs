using Domain.Base;

namespace Domain.Entities.Media;

public class VideoView : BaseEntity
{
    public Guid VideoId { get; set; }
    public Guid? UserId { get; set; } // Nullable for anonymous views
    public string? IpAddress { get; set; }
    public TimeSpan WatchDuration { get; set; }
    public bool IsCompleted { get; set; } = false;
    public string? UserAgent { get; set; }
    public string? Country { get; set; }
    
    // Navigation properties
    public virtual Video Video { get; set; } = null!;
}