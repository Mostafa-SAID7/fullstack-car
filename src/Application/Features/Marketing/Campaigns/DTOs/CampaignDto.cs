using Domain.Entities.Marketing;

namespace Application.Features.Marketing.Campaigns.DTOs;

public class CampaignDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public CampaignType Type { get; set; }
    public string TypeName => Type.ToString();
    public CampaignStatus Status { get; set; }
    public string StatusName => Status.ToString();
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal Budget { get; set; }
    public decimal SpentAmount { get; set; }
    public string? TargetAudience { get; set; }
    public List<string> Tags { get; set; } = new();
    
    // Analytics
    public long Impressions { get; set; }
    public long Reach { get; set; }
    public long Engagement { get; set; }
    public long Clicks { get; set; }
    public decimal EngagementRate { get; set; }
    public decimal ClickThroughRate { get; set; }
    
    // Related Data
    public List<CampaignContentDto> Contents { get; set; } = new();
    public List<CampaignPlatformDto> Platforms { get; set; } = new();
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CampaignContentDto
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public Domain.Entities.Marketing.ContentType Type { get; set; }
    public string TypeName => Type.ToString();
    public string? MediaUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public DateTime? PublishedDate { get; set; }
    public ContentStatus Status { get; set; }
    public string StatusName => Status.ToString();
    public string? Author { get; set; }
    public List<string> Tags { get; set; } = new();
    
    // Analytics
    public long Views { get; set; }
    public long Likes { get; set; }
    public long Shares { get; set; }
    public long Comments { get; set; }
    public long Clicks { get; set; }
    
    public List<ContentPlatformDto> Platforms { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CampaignPlatformDto
{
    public Guid Id { get; set; }
    public Guid CampaignId { get; set; }
    public Guid PlatformId { get; set; }
    public string PlatformName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public decimal Budget { get; set; }
    public decimal SpentAmount { get; set; }
    public long Impressions { get; set; }
    public long Reach { get; set; }
    public long Engagement { get; set; }
    public long Clicks { get; set; }
}

public class ContentPlatformDto
{
    public Guid Id { get; set; }
    public Guid ContentId { get; set; }
    public Guid PlatformId { get; set; }
    public string PlatformName { get; set; } = string.Empty;
    public string? PlatformPostId { get; set; }
    public string? PlatformUrl { get; set; }
    public DateTime? PublishedAt { get; set; }
    public ContentStatus Status { get; set; }
    public string StatusName => Status.ToString();
    public long Views { get; set; }
    public long Likes { get; set; }
    public long Shares { get; set; }
    public long Comments { get; set; }
    public long Clicks { get; set; }
}

public class SocialPlatformDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? IconUrl { get; set; }
    public bool IsActive { get; set; }
    public long TotalFollowers { get; set; }
    public long TotalPosts { get; set; }
    public decimal AverageEngagementRate { get; set; }
}