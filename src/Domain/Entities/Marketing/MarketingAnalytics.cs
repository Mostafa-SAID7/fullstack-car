using System.ComponentModel.DataAnnotations;
using Domain.Base;

namespace Domain.Entities.Marketing;

public class CampaignAnalytics : BaseEntity
{
    public Guid CampaignId { get; set; }
    public virtual Campaign Campaign { get; set; } = null!;

    public DateTime Date { get; set; }

    // Core Metrics
    public long Impressions { get; set; }
    public long Reach { get; set; }
    public long Engagement { get; set; }
    public long Clicks { get; set; }
    public long Conversions { get; set; }

    // Calculated Metrics
    public decimal EngagementRate { get; set; }
    public decimal ClickThroughRate { get; set; }
    public decimal ConversionRate { get; set; }
    public decimal CostPerClick { get; set; }
    public decimal CostPerConversion { get; set; }

    // Spend
    public decimal AmountSpent { get; set; }
}

public class PlatformAnalytics : BaseEntity
{
    public Guid PlatformId { get; set; }
    public virtual SocialPlatform Platform { get; set; } = null!;

    public DateTime Date { get; set; }

    // Follower Metrics
    public long Followers { get; set; }
    public long NewFollowers { get; set; }
    public long UnfollowersCount { get; set; }

    // Content Metrics
    public long PostsCount { get; set; }
    public long TotalImpressions { get; set; }
    public long TotalReach { get; set; }
    public long TotalEngagement { get; set; }
    public long TotalClicks { get; set; }

    // Engagement Breakdown
    public long Likes { get; set; }
    public long Comments { get; set; }
    public long Shares { get; set; }
    public long Saves { get; set; }

    // Calculated Metrics
    public decimal EngagementRate { get; set; }
    public decimal ReachRate { get; set; }
    public decimal GrowthRate { get; set; }
}

public class MarketingOverview : BaseEntity
{
    public DateTime Date { get; set; }

    // Overall Metrics
    public long TotalImpressions { get; set; }
    public long TotalReach { get; set; }
    public long TotalEngagement { get; set; }
    public long TotalClicks { get; set; }
    public long TotalFollowers { get; set; }
    public long NewFollowers { get; set; }

    // Campaign Metrics
    public int ActiveCampaigns { get; set; }
    public int ScheduledCampaigns { get; set; }
    public int CompletedCampaigns { get; set; }

    // Content Metrics
    public int PublishedContent { get; set; }
    public int ScheduledContent { get; set; }
    public int DraftContent { get; set; }

    // Financial Metrics
    public decimal TotalBudget { get; set; }
    public decimal TotalSpent { get; set; }
    public decimal AverageCostPerClick { get; set; }
    public decimal AverageEngagementRate { get; set; }
}