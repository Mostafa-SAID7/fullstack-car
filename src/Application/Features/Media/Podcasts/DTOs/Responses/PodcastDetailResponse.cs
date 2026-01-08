namespace Application.Features.Media.Podcasts.DTOs.Responses;

public class PodcastDetailResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? AudioUrl { get; set; }
    public TimeSpan? Duration { get; set; }
    public DateTime PublishedDate { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorId { get; set; } = string.Empty;
    public PodcastCategoryResponse Category { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public int ListenCount { get; set; }
    public int LikeCount { get; set; }
    public int SubscriberCount { get; set; }
    public bool IsSubscribed { get; set; }
    public bool IsLiked { get; set; }
    public bool IsPublic { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}