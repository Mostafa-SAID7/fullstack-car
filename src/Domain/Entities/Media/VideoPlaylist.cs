using Domain.Base;

namespace Domain.Entities.Media;

public class VideoPlaylist : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublic { get; set; } = true;
    public Guid CreatorId { get; set; }
    
    // Navigation properties
    public virtual ICollection<VideoPlaylistItem> Items { get; set; } = new List<VideoPlaylistItem>();
}

public class VideoPlaylistItem : BaseEntity
{
    public Guid PlaylistId { get; set; }
    public Guid VideoId { get; set; }
    public int Order { get; set; }
    
    // Navigation properties
    public virtual VideoPlaylist Playlist { get; set; } = null!;
    public virtual Video Video { get; set; } = null!;
}
