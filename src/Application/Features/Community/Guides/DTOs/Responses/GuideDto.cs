using Domain.Enums.Community.Guides;

namespace Application.Features.Community.Guides.DTOs.Responses;

public class GuideDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public GuideCategory Category { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public GuideDifficulty Difficulty { get; set; }
    public string DifficultyName { get; set; } = string.Empty;
    public int EstimatedReadTime { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsPublished { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int BookmarkCount { get; set; }
    public List<string> Tags { get; set; } = new();
    public string? ThumbnailUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Author info
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string? AuthorAvatar { get; set; }
    
    // Steps
    public List<GuideStepDto> Steps { get; set; } = new();
    
    // User interactions
    public bool IsBookmarked { get; set; }
    public int? UserRating { get; set; }
    public double AverageRating { get; set; }
    public int RatingCount { get; set; }
}

public class GuideStepDto
{
    public Guid Id { get; set; }
    public int StepNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public bool IsRequired { get; set; }
    public string? Tips { get; set; }
    public string? WarningNotes { get; set; }
    public int EstimatedTime { get; set; }
}
