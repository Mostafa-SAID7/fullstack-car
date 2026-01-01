using Domain.Entities.Admin.Analytics;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Analytics;

public class PerformanceLogsSeeder
{
    private readonly ILogger<PerformanceLogsSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public PerformanceLogsSeeder(ILogger<PerformanceLogsSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Performance Logs...");

            await SeedPerformanceLogsAsync();

            _logger.LogInformation("Performance Logs seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Performance Logs.");
            throw;
        }
    }

    private async Task SeedPerformanceLogsAsync()
    {
        if (await _context.PerformanceLogs.AnyAsync())
        {
            _logger.LogInformation("Performance logs already exist. Skipping seeding.");
            return;
        }

        var performanceLogs = new List<PerformanceLog>();
        var random = new Random();
        var operations = new[] 
        { 
            "GetUsers", "CreatePost", "UpdateProfile", "DeleteComment", "SearchContent",
            "GetPosts", "UpdatePost", "DeletePost", "GetGroups", "JoinGroup",
            "SendMessage", "UploadFile", "ProcessPayment", "GenerateReport"
        };

        for (int i = 0; i < 200; i++)
        {
            var operation = operations[random.Next(operations.Length)];
            performanceLogs.Add(new PerformanceLog
            {
                Operation = operation,
                Duration = random.Next(50, 2000),
                Timestamp = DateTime.UtcNow.AddDays(-random.Next(7)),
                RequestPath = $"/api/{operation.ToLower()}",
                StatusCode = GenerateStatusCode(random),
                MemoryUsage = random.Next(50, 500),
                CpuUsage = random.NextDouble() * 100
            });
        }

        await _context.PerformanceLogs.AddRangeAsync(performanceLogs);
        _logger.LogInformation($"Added {performanceLogs.Count} performance logs.");
    }

    private int GenerateStatusCode(Random random)
    {
        var statusCodes = new[] { 200, 200, 200, 200, 200, 201, 204, 400, 401, 404, 500 };
        return statusCodes[random.Next(statusCodes.Length)];
    }
}