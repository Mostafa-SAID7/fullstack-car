using Domain.Enums.Media;

namespace Application.Features.Media.Discovery.DTOs;

public class MediaSearchResultDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public string? CoverImage { get; set; } // For podcasts
    public MediaType MediaType { get; set; }
    public TimeSpan Duration { get; set; }
    public int ViewCount { get; set; }
    public int PlayCount { get; set; } // For podcasts
    public int LikeCount { get; set; }
    public DateTime? PublishedAt { get; set; }
    public Guid CreatorId { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public string? Category { get; set; }
    public VideoQuality? Quality { get; set; } // For videos
    public double RelevanceScore { get; set; } // For search ranking
    public bool IsPublic { get; set; }
    public MediaStatus Status { get; set; }
}