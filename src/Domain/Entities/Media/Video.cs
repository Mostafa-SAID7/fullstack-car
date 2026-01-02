using Domain.Base;
using Domain.Enums.Media;

namespace Domain.Entities.Media;

public class Video : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public string? PreviewUrl { get; set; }
    public TimeSpan Duration { get; set; }
    public VideoQuality Quality { get; set; } = VideoQuality.HD_720p;
    public MediaStatus Status { get; set; } = MediaStatus.Draft;
    public long FileSize { get; set; }
    public string? Tags { get; set; }
    public int ViewCount { get; set; } = 0;
    public int LikeCount { get; set; } = 0;
    public int DislikeCount { get; set; } = 0;
    public bool IsPublic { get; set; } = true;
    public bool AllowComments { get; set; } = true;
    public DateTime? PublishedAt { get; set; }
    
    // Navigation properties
    public Guid CreatorId { get; set; }
    public virtual ICollection<VideoComment> Comments { get; set; } = new List<VideoComment>();
    public virtual ICollection<VideoLike> Likes { get; set; } = new List<VideoLike>();
    public virtual ICollection<VideoView> Views { get; set; } = new List<VideoView>();
    public virtual ICollection<VideoPlaylist> Playlists { get; set; } = new List<VideoPlaylist>();
}