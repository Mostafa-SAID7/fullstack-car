using Domain.Base;

namespace Domain.Entities.Media;

public class PodcastSeries : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Category { get; set; }
    public string? Language { get; set; } = "en";
    
    // Navigation properties
    public Guid CreatorId { get; set; }
    public virtual ICollection<Podcast> Episodes { get; set; } = new List<Podcast>();
}