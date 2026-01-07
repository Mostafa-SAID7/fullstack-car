namespace Application.Features.Marketing.Analytics.DTOs;

public class MarketingOverviewDto
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
    
    // Calculated Properties
    public decimal BudgetUtilization => TotalBudget > 0 ? (TotalSpent / TotalBudget) * 100 : 0;
    public decimal ClickThroughRate => TotalImpressions > 0 ? ((decimal)TotalClicks / TotalImpressions) * 100 : 0;
    public decimal EngagementRate => TotalReach > 0 ? ((decimal)TotalEngagement / TotalReach) * 100 : 0;
}

public class PlatformAnalyticsDto
{
    public Guid PlatformId { get; set; }
    public string PlatformName { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
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

public class CampaignAnalyticsDto
{
    public Guid CampaignId { get; set; }
    public string CampaignName { get; set; } = string.Empty;
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

public class MarketingPerformanceDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    public MarketingOverviewDto Overview { get; set; } = new();
    public List<PlatformAnalyticsDto> PlatformPerformance { get; set; } = new();
    public List<CampaignAnalyticsDto> CampaignPerformance { get; set; } = new();
    public List<TopPerformingContentDto> TopContent { get; set; } = new();
    public List<MarketingTrendDto> Trends { get; set; } = new();
}

public class TopPerformingContentDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public DateTime PublishedDate { get; set; }
    
    public long Views { get; set; }
    public long Likes { get; set; }
    public long Shares { get; set; }
    public long Comments { get; set; }
    public long Clicks { get; set; }
    
    public decimal EngagementRate { get; set; }
}

public class MarketingTrendDto
{
    public DateTime Date { get; set; }
    public long Impressions { get; set; }
    public long Reach { get; set; }
    public long Engagement { get; set; }
    public long Clicks { get; set; }
    public decimal EngagementRate { get; set; }
}