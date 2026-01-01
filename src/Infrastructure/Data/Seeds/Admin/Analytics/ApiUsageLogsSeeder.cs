using Domain.Entities.Admin.Analytics;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Analytics;

public class ApiUsageLogsSeeder
{
    private readonly ILogger<ApiUsageLogsSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public ApiUsageLogsSeeder(ILogger<ApiUsageLogsSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding API Usage Logs...");

            await SeedApiUsageLogsAsync();

            _logger.LogInformation("API Usage Logs seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding API Usage Logs.");
            throw;
        }
    }

    private async Task SeedApiUsageLogsAsync()
    {
        if (await _context.ApiUsageLogs.AnyAsync())
        {
            _logger.LogInformation("API usage logs already exist. Skipping seeding.");
            return;
        }

        var apiUsageLogs = new List<ApiUsageLog>();
        var random = new Random();
        var endpoints = new[] 
        { 
            "/api/posts", "/api/users", "/api/groups", "/api/auth/login", "/api/analytics",
            "/api/comments", "/api/marketplace", "/api/notifications", "/api/search"
        };
        var apiKeys = Enumerable.Range(1, 8).Select(i => $"api_key_{Guid.NewGuid().ToString("N")[..16]}").ToArray();

        for (int i = 0; i < 300; i++)
        {
            var endpoint = endpoints[random.Next(endpoints.Length)];
            var apiKey = apiKeys[random.Next(apiKeys.Length)];

            apiUsageLogs.Add(new ApiUsageLog
            {
                ApiKey = apiKey,
                Endpoint = endpoint,
                RequestCount = random.Next(1, 50),
                DataTransferred = random.Next(1000, 100000),
                Timestamp = DateTime.UtcNow.AddDays(-random.Next(30)),
                ClientId = Guid.NewGuid().ToString(),
                IpAddress = GenerateRandomIpAddress(random)
            });
        }

        await _context.ApiUsageLogs.AddRangeAsync(apiUsageLogs);
        _logger.LogInformation($"Added {apiUsageLogs.Count} API usage logs.");
    }

    private string GenerateRandomIpAddress(Random random)
    {
        return $"{random.Next(1, 255)}.{random.Next(1, 255)}.{random.Next(1, 255)}.{random.Next(1, 255)}";
    }
}