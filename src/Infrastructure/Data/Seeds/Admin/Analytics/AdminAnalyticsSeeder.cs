using Infrastructure.Data;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Analytics;

public class AdminAnalyticsSeeder
{
    private readonly ILogger<AdminAnalyticsSeeder> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserActivitySeeder _userActivitySeeder;
    private readonly SystemMetricsSeeder _systemMetricsSeeder;
    private readonly ErrorLogsSeeder _errorLogsSeeder;
    private readonly PerformanceLogsSeeder _performanceLogsSeeder;
    private readonly ApiUsageLogsSeeder _apiUsageLogsSeeder;
    private readonly EngagementDataSeeder _engagementDataSeeder;
    private readonly SecurityLogsSeeder _securityLogsSeeder;

    public AdminAnalyticsSeeder(
        ILogger<AdminAnalyticsSeeder> logger, 
        ApplicationDbContext context,
        UserActivitySeeder userActivitySeeder,
        SystemMetricsSeeder systemMetricsSeeder,
        ErrorLogsSeeder errorLogsSeeder,
        PerformanceLogsSeeder performanceLogsSeeder,
        ApiUsageLogsSeeder apiUsageLogsSeeder,
        EngagementDataSeeder engagementDataSeeder,
        SecurityLogsSeeder securityLogsSeeder)
    {
        _logger = logger;
        _context = context;
        _userActivitySeeder = userActivitySeeder;
        _systemMetricsSeeder = systemMetricsSeeder;
        _errorLogsSeeder = errorLogsSeeder;
        _performanceLogsSeeder = performanceLogsSeeder;
        _apiUsageLogsSeeder = apiUsageLogsSeeder;
        _engagementDataSeeder = engagementDataSeeder;
        _securityLogsSeeder = securityLogsSeeder;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Admin Analytics data...");

            // Seed user activities first (sessions, activities, preferences)
            await _userActivitySeeder.SeedAsync();

            // Then seed system-level analytics
            await _systemMetricsSeeder.SeedAsync();
            await _errorLogsSeeder.SeedAsync();
            await _performanceLogsSeeder.SeedAsync();
            await _apiUsageLogsSeeder.SeedAsync();
            await _engagementDataSeeder.SeedAsync();
            await _securityLogsSeeder.SeedAsync();

            await _context.SaveChangesAsync();
            _logger.LogInformation("Admin Analytics data seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Admin Analytics data.");
            throw;
        }
    }
}