using System.ComponentModel.DataAnnotations;
using Domain.Base;

namespace Domain.Entities.Marketing;

public class Campaign : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    public CampaignType Type { get; set; }
    public CampaignStatus Status { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public decimal Budget { get; set; }
    public decimal SpentAmount { get; set; }

    [MaxLength(500)]
    public string? TargetAudience { get; set; }

    public string? Tags { get; set; } // JSON array of tags

    // Analytics
    public long Impressions { get; set; }
    public long Reach { get; set; }
    public long Engagement { get; set; }
    public long Clicks { get; set; }
    public decimal EngagementRate { get; set; }
    public decimal ClickThroughRate { get; set; }

    // Relationships
    public virtual ICollection<CampaignContent> Contents { get; set; } = new List<CampaignContent>();
    public virtual ICollection<CampaignPlatform> Platforms { get; set; } = new List<CampaignPlatform>();
    public virtual ICollection<CampaignAnalytics> Analytics { get; set; } = new List<CampaignAnalytics>();
}

public enum CampaignType
{
    Social = 1,
    Email = 2,
    Display = 3,
    Search = 4,
    Video = 5,
    Influencer = 6,
    Content = 7
}

public enum CampaignStatus
{
    Draft = 1,
    Scheduled = 2,
    Active = 3,
    Paused = 4,
    Completed = 5,
    Cancelled = 6
}