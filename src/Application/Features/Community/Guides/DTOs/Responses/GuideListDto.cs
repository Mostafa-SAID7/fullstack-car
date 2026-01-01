using Domain.Enums.Community.Guides;

namespace Application.Features.Community.Guides.DTOs.Responses;

public class GuideListDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public GuideCategory Category { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public GuideDifficulty Difficulty { get; set; }
    public string DifficultyName { get; set; } = string.Empty;
    public int EstimatedReadTime { get; set; }
    public bool IsFeatured { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int BookmarkCount { get; set; }
    public List<string> Tags { get; set; } = new();
    public string? ThumbnailUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Author info
    public string AuthorName { get; set; } = string.Empty;
    public string? AuthorAvatar { get; set; }
    
    // User interactions
    public bool IsBookmarked { get; set; }
    public double AverageRating { get; set; }
    public int RatingCount { get; set; }
}