using Domain.Base;
using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Domain.Enums.Community.Guides;

namespace Domain.Entities.Community.Guides;

public class Guide : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public GuideCategory Category { get; set; }
    public GuideDifficulty Difficulty { get; set; }
    public int EstimatedReadTime { get; set; } // in minutes
    public bool IsFeatured { get; set; }
    public bool IsPublished { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int BookmarkCount { get; set; }
    public string Tags { get; set; } = string.Empty; // JSON array of tags
    public string ThumbnailUrl { get; set; } = string.Empty;
    
    // Navigation properties
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    public Guid? PostId { get; set; }
    public Post? Post { get; set; }
    
    public ICollection<GuideStep> Steps { get; set; } = new List<GuideStep>();
    public ICollection<GuideRating> Ratings { get; set; } = new List<GuideRating>();
}
