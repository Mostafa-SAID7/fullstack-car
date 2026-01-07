using System.ComponentModel.DataAnnotations;
using Domain.Base;

namespace Domain.Entities.Marketing;

public class SocialPlatform : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? DisplayName { get; set; }

    [MaxLength(200)]
    public string? IconUrl { get; set; }

    [MaxLength(500)]
    public string? ApiEndpoint { get; set; }

    public bool IsActive { get; set; } = true;

    // Platform-specific settings (JSON)
    public string? Settings { get; set; }

    // Analytics
    public long TotalFollowers { get; set; }
    public long TotalPosts { get; set; }
    public decimal AverageEngagementRate { get; set; }

    // Relationships
    public virtual ICollection<CampaignPlatform> CampaignPlatforms { get; set; } = new List<CampaignPlatform>();
    public virtual ICollection<ContentPlatform> ContentPlatforms { get; set; } = new List<ContentPlatform>();
    public virtual ICollection<PlatformAnalytics> Analytics { get; set; } = new List<PlatformAnalytics>();
}

public class CampaignPlatform : BaseEntity
{
    public Guid CampaignId { get; set; }
    public virtual Campaign Campaign { get; set; } = null!;

    public Guid PlatformId { get; set; }
    public virtual SocialPlatform Platform { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public decimal Budget { get; set; }
    public decimal SpentAmount { get; set; }

    // Platform-specific metrics
    public long Impressions { get; set; }
    public long Reach { get; set; }
    public long Engagement { get; set; }
    public long Clicks { get; set; }
}

public class ContentPlatform : BaseEntity
{
    public Guid ContentId { get; set; }
    public virtual CampaignContent Content { get; set; } = null!;

    public Guid PlatformId { get; set; }
    public virtual SocialPlatform Platform { get; set; } = null!;

    [MaxLength(500)]
    public string? PlatformPostId { get; set; }

    [MaxLength(500)]
    public string? PlatformUrl { get; set; }

    public DateTime? PublishedAt { get; set; }
    public ContentStatus Status { get; set; }

    // Platform-specific metrics
    public long Views { get; set; }
    public long Likes { get; set; }
    public long Shares { get; set; }
    public long Comments { get; set; }
    public long Clicks { get; set; }
}