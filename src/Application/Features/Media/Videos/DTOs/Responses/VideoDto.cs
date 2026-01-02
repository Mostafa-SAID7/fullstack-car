using Domain.Enums.Media;

namespace Application.Features.Media.Videos.DTOs.Responses;

public class VideoDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public string? PreviewUrl { get; set; }
    public TimeSpan Duration { get; set; }
    public VideoQuality Quality { get; set; }
    public MediaStatus Status { get; set; }
    public long FileSize { get; set; }
    public string? Tags { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int DislikeCount { get; set; }
    public bool IsPublic { get; set; }
    public bool AllowComments { get; set; }
    public DateTime? PublishedAt { get; set; }
    public Guid CreatorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class VideoListDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public TimeSpan Duration { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public DateTime? PublishedAt { get; set; }
    public Guid CreatorId { get; set; }
}

public class VideoDetailsDto : VideoDto
{
    public List<VideoCommentDto> Comments { get; set; } = new();
    public bool IsLikedByUser { get; set; }
    public bool IsDislikedByUser { get; set; }
}

public class VideoCommentDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public Guid? ParentCommentId { get; set; }
    public int LikeCount { get; set; }
    public bool IsEdited { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? EditedAt { get; set; }
    public List<VideoCommentDto> Replies { get; set; } = new();
}