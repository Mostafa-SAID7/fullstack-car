using Domain.Entities.Admin.Moderation;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Moderation;

public class AdminModerationSeeder
{
    private readonly ILogger<AdminModerationSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public AdminModerationSeeder(ILogger<AdminModerationSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Admin Moderation data...");

            await SeedAutoModerationRulesAsync();
            await SeedModerationQueueAsync();

            await _context.SaveChangesAsync();
            _logger.LogInformation("Admin Moderation data seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Admin Moderation data.");
            throw;
        }
    }

    private async Task SeedAutoModerationRulesAsync()
    {
        if (await _context.AutoModerationRules.AnyAsync())
        {
            _logger.LogInformation("Auto moderation rules already exist. Skipping seeding.");
            return;
        }

        var rules = new List<AutoModerationRule>
        {
            new()
            {
                Name = "Spam Detection",
                Description = "Detects and flags potential spam content",
                Pattern = @"\b(buy now|click here|limited time|act fast)\b",
                Action = "Flag",
                Severity = "Medium",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new()
            {
                Name = "Profanity Filter",
                Description = "Filters inappropriate language",
                Pattern = @"\b(badword1|badword2|badword3)\b",
                Action = "Block",
                Severity = "High",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new()
            {
                Name = "URL Spam",
                Description = "Detects excessive URL posting",
                Pattern = @"(https?://[^\s]+.*){3,}",
                Action = "Flag",
                Severity = "Medium",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-25)
            },
            new()
            {
                Name = "Duplicate Content",
                Description = "Identifies duplicate or near-duplicate posts",
                Pattern = "",
                Action = "Flag",
                Severity = "Low",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            }
        };

        await _context.AutoModerationRules.AddRangeAsync(rules);
        _logger.LogInformation($"Added {rules.Count} auto moderation rules.");
    }

    private async Task SeedModerationQueueAsync()
    {
        if (await _context.ModerationQueues.AnyAsync())
        {
            _logger.LogInformation("Moderation queue items already exist. Skipping seeding.");
            return;
        }

        var queueItems = new List<ModerationQueue>
        {
            new()
            {
                ContentType = "Post",
                ContentId = Guid.NewGuid(),
                ReportReason = "Inappropriate content",
                Status = "Pending",
                Priority = "High",
                SubmittedAt = DateTime.UtcNow.AddHours(-2),
                IsActive = true
            },
            new()
            {
                ContentType = "Comment",
                ContentId = Guid.NewGuid(),
                ReportReason = "Spam",
                Status = "Pending",
                Priority = "Medium",
                SubmittedAt = DateTime.UtcNow.AddHours(-4),
                IsActive = true
            },
            new()
            {
                ContentType = "Post",
                ContentId = Guid.NewGuid(),
                ReportReason = "Harassment",
                Status = "Reviewed",
                Priority = "High",
                SubmittedAt = DateTime.UtcNow.AddDays(-1),
                ReviewedAt = DateTime.UtcNow.AddHours(-1),
                IsActive = false
            }
        };

        await _context.ModerationQueues.AddRangeAsync(queueItems);
        _logger.LogInformation($"Added {queueItems.Count} moderation queue items.");
    }
}