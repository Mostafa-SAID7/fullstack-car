using Domain.Entities.Admin.Analytics;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Analytics;

public class SystemMetricsSeeder
{
    private readonly ILogger<SystemMetricsSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public SystemMetricsSeeder(ILogger<SystemMetricsSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Admin System Metrics...");

            await SeedAdminSystemMetricsAsync();

            _logger.LogInformation("Admin System Metrics seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Admin System Metrics.");
            throw;
        }
    }

    private async Task SeedAdminSystemMetricsAsync()
    {
        if (await _context.AdminSystemMetrics.AnyAsync())
        {
            _logger.LogInformation("Admin system metrics already exist. Skipping seeding.");
            return;
        }

        var metrics = new List<AdminSystemMetric>();
        var random = new Random();
        var categories = new[] { "Performance", "Security", "Usage", "System" };

        for (int i = 0; i < 50; i++)
        {
            var category = categories[random.Next(categories.Length)];
            metrics.Add(new AdminSystemMetric
            {
                MetricName = $"{category}_Metric_{i + 1}",
                Value = random.NextDouble() * 100,
                Unit = category == "Performance" ? "ms" : category == "Usage" ? "count" : "percent",
                Category = category,
                Timestamp = DateTime.UtcNow.AddDays(-random.Next(30)),
                Tags = $"environment:production,service:admin"
            });
        }

        await _context.AdminSystemMetrics.AddRangeAsync(metrics);
        _logger.LogInformation($"Added {metrics.Count} admin system metrics.");
    }
}