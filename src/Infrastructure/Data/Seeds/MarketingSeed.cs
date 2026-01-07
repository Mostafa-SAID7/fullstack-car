using Domain.Entities.Marketing;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Seeds;

public static class MarketingSeed
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Seed Social Platforms
        if (!await context.SocialPlatforms.AnyAsync())
        {
            var platforms = new List<SocialPlatform>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Facebook",
                    DisplayName = "Facebook",
                    IconUrl = "/icons/facebook.svg",
                    IsActive = true,
                    TotalFollowers = 12500,
                    TotalPosts = 156,
                    AverageEngagementRate = 5.2m,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Instagram",
                    DisplayName = "Instagram",
                    IconUrl = "/icons/instagram.svg",
                    IsActive = true,
                    TotalFollowers = 8900,
                    TotalPosts = 203,
                    AverageEngagementRate = 7.1m,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Twitter",
                    DisplayName = "Twitter",
                    IconUrl = "/icons/twitter.svg",
                    IsActive = true,
                    TotalFollowers = 6200,
                    TotalPosts = 287,
                    AverageEngagementRate = 3.8m,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "LinkedIn",
                    DisplayName = "LinkedIn",
                    IconUrl = "/icons/linkedin.svg",
                    IsActive = true,
                    TotalFollowers = 4100,
                    TotalPosts = 89,
                    AverageEngagementRate = 4.5m,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "YouTube",
                    DisplayName = "YouTube",
                    IconUrl = "/icons/youtube.svg",
                    IsActive = true,
                    TotalFollowers = 15600,
                    TotalPosts = 45,
                    AverageEngagementRate = 6.8m,
                    CreatedAt = DateTime.UtcNow
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "TikTok",
                    DisplayName = "TikTok",
                    IconUrl = "/icons/tiktok.svg",
                    IsActive = true,
                    TotalFollowers = 9800,
                    TotalPosts = 124,
                    AverageEngagementRate = 12.4m,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.SocialPlatforms.AddRange(platforms);
            await context.SaveChangesAsync();
        }

        // Seed Sample Campaigns
        if (!await context.Campaigns.AnyAsync())
        {
            var campaigns = new List<Campaign>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Summer Car Care Campaign",
                    Description = "Promote summer car maintenance services and tips",
                    Type = CampaignType.Social,
                    Status = CampaignStatus.Active,
                    StartDate = DateTime.UtcNow.AddDays(-30),
                    EndDate = DateTime.UtcNow.AddDays(30),
                    Budget = 15000,
                    SpentAmount = 8500,
                    TargetAudience = "Car owners aged 25-55",
                    Tags = "[\"summer\", \"maintenance\", \"car-care\", \"tips\"]",
                    Impressions = 125000,
                    Reach = 98000,
                    Engagement = 8200,
                    Clicks = 2100,
                    EngagementRate = 8.4m,
                    ClickThroughRate = 1.7m,
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Electric Vehicle Promotion",
                    Description = "Showcase latest electric vehicle models and benefits",
                    Type = CampaignType.Video,
                    Status = CampaignStatus.Active,
                    StartDate = DateTime.UtcNow.AddDays(-20),
                    EndDate = DateTime.UtcNow.AddDays(40),
                    Budget = 25000,
                    SpentAmount = 12300,
                    TargetAudience = "Environmentally conscious drivers",
                    Tags = "[\"electric\", \"eco-friendly\", \"vehicles\", \"future\"]",
                    Impressions = 98000,
                    Reach = 76000,
                    Engagement = 6800,
                    Clicks = 1800,
                    EngagementRate = 8.9m,
                    ClickThroughRate = 1.8m,
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = "Winter Preparation Guide",
                    Description = "Help customers prepare their vehicles for winter",
                    Type = CampaignType.Content,
                    Status = CampaignStatus.Scheduled,
                    StartDate = DateTime.UtcNow.AddDays(60),
                    EndDate = DateTime.UtcNow.AddDays(150),
                    Budget = 18000,
                    SpentAmount = 0,
                    TargetAudience = "Drivers in cold climate regions",
                    Tags = "[\"winter\", \"preparation\", \"safety\", \"maintenance\"]",
                    Impressions = 0,
                    Reach = 0,
                    Engagement = 0,
                    Clicks = 0,
                    EngagementRate = 0,
                    ClickThroughRate = 0,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                }
            };

            context.Campaigns.AddRange(campaigns);
            await context.SaveChangesAsync();
        }
    }
}