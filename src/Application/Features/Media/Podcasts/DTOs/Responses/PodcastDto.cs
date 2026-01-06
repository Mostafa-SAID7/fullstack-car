using Domain.Enums.Media;

namespace Application.Features.Media.Podcasts.DTOs.Responses;

public class PodcastDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public string AudioUrl { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public MediaStatus Status { get; set; }
    public long FileSize { get; set; }
    public string? Tags { get; set; }
    public int PlayCount { get; set; }
    public int LikeCount { get; set; }
    public int DownloadCount { get; set; }
    public bool IsPublic { get; set; }
    public bool AllowComments { get; set; }
    public bool AllowDownload { get; set; }
    public DateTime? PublishedAt { get; set; }
    public string? Transcript { get; set; }
    public int EpisodeNumber { get; set; }
    public int SeasonNumber { get; set; }
    public Guid? SeriesId { get; set; }
    public Guid CreatorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class PodcastListDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public TimeSpan Duration { get; set; }
    public int PlayCount { get; set; }
    public int LikeCount { get; set; }
    public DateTime? PublishedAt { get; set; }
    public int EpisodeNumber { get; set; }
    public Guid CreatorId { get; set; }
}

public class PodcastDetailsDto : PodcastDto
{
    public PodcastSeriesDto? Series { get; set; }
    public List<PodcastCommentDto> Comments { get; set; } = new();
    public bool IsLikedByUser { get; set; }
}

public class PodcastSeriesDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public bool IsActive { get; set; }
    public string? Category { get; set; }
    public string Language { get; set; } = string.Empty;
    public Guid CreatorId { get; set; }
    public int EpisodeCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PodcastCommentDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public Guid? ParentCommentId { get; set; }
    public int LikeCount { get; set; }
    public bool IsEdited { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? EditedAt { get; set; }
    public List<PodcastCommentDto> Replies { get; set; } = new();
}
