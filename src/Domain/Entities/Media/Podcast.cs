using Domain.Base;
using Domain.Enums.Media;

namespace Domain.Entities.Media;

public class Podcast : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public string AudioUrl { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public MediaStatus Status { get; set; } = MediaStatus.Draft;
    public long FileSize { get; set; }
    public string? Tags { get; set; }
    public int PlayCount { get; set; } = 0;
    public int LikeCount { get; set; } = 0;
    public int DownloadCount { get; set; } = 0;
    public bool IsPublic { get; set; } = true;
    public bool AllowComments { get; set; } = true;
    public bool AllowDownload { get; set; } = false;
    public DateTime? PublishedAt { get; set; }
    public string? Transcript { get; set; }
    
    // Podcast specific
    public int EpisodeNumber { get; set; }
    public int SeasonNumber { get; set; } = 1;
    public Guid? SeriesId { get; set; }
    
    // Navigation properties
    public Guid CreatorId { get; set; }
    public virtual PodcastSeries? Series { get; set; }
    public virtual ICollection<PodcastComment> Comments { get; set; } = new List<PodcastComment>();
    public virtual ICollection<PodcastLike> Likes { get; set; } = new List<PodcastLike>();
    public virtual ICollection<PodcastPlay> Plays { get; set; } = new List<PodcastPlay>();
}