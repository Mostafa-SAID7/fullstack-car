using System.ComponentModel.DataAnnotations;
using Domain.Base;

namespace Domain.Entities.Marketing;

public class CampaignContent : BaseEntity
{
    public Guid CampaignId { get; set; }
    public virtual Campaign Campaign { get; set; } = null!;

    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    public string? Content { get; set; }
    public ContentType Type { get; set; }

    [MaxLength(500)]
    public string? MediaUrl { get; set; }

    [MaxLength(200)]
    public string? ThumbnailUrl { get; set; }

    public DateTime? ScheduledDate { get; set; }
    public DateTime? PublishedDate { get; set; }

    public ContentStatus Status { get; set; }

    [MaxLength(100)]
    public string? Author { get; set; }

    public string? Tags { get; set; } // JSON array of tags

    // Analytics
    public long Views { get; set; }
    public long Likes { get; set; }
    public long Shares { get; set; }
    public long Comments { get; set; }
    public long Clicks { get; set; }

    // Relationships
    public virtual ICollection<ContentPlatform> Platforms { get; set; } = new List<ContentPlatform>();
}

public enum ContentType
{
    Text = 1,
    Image = 2,
    Video = 3,
    Blog = 4,
    Story = 5,
    Infographic = 6,
    Carousel = 7
}

public enum ContentStatus
{
    Draft = 1,
    InReview = 2,
    Approved = 3,
    Scheduled = 4,
    Published = 5,
    Archived = 6
}