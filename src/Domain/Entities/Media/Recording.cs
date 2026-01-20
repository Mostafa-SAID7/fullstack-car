using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Media;

public class Recording : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty; // audio, video
    public long FileSize { get; set; }
    public TimeSpan Duration { get; set; }
    public string Quality { get; set; } = string.Empty; // HD, SD, etc.
    public bool IsProcessed { get; set; } = false;
    public DateTime? ProcessedAt { get; set; }

    // Foreign Keys
    public Guid UserId { get; set; }

    // Navigation Properties
    public virtual ApplicationUser User { get; set; } = null!;
}