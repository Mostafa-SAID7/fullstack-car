using Infrastructure.Data;
using Infrastructure.Data.Seeds.Admin.Analytics;
using Infrastructure.Data.Seeds.Admin.Dashboard;
using Infrastructure.Data.Seeds.Admin.Management;
using Infrastructure.Data.Seeds.Admin.Moderation;
using Infrastructure.Data.Seeds.Admin.System;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin;

public class AdminSeeder
{
    private readonly ILogger<AdminSeeder> _logger;
    private readonly ApplicationDbContext _context;
    private readonly AdminAnalyticsSeeder _analyticsSeeder;
    private readonly AdminDashboardSeeder _dashboardSeeder;
    private readonly AdminManagementSeeder _managementSeeder;
    private readonly AdminModerationSeeder _moderationSeeder;
    private readonly AdminSystemSeeder _systemSeeder;

    public AdminSeeder(
        ILogger<AdminSeeder> logger,
        ApplicationDbContext context,
        AdminAnalyticsSeeder analyticsSeeder,
        AdminDashboardSeeder dashboardSeeder,
        AdminManagementSeeder managementSeeder,
        AdminModerationSeeder moderationSeeder,
        AdminSystemSeeder systemSeeder)
    {
        _logger = logger;
        _context = context;
        _analyticsSeeder = analyticsSeeder;
        _dashboardSeeder = dashboardSeeder;
        _managementSeeder = managementSeeder;
        _moderationSeeder = moderationSeeder;
        _systemSeeder = systemSeeder;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Starting Admin data seeding...");

            await _systemSeeder.SeedAsync();
            _logger.LogInformation("Admin System data seeded successfully.");

            await _managementSeeder.SeedAsync();
            _logger.LogInformation("Admin Management data seeded successfully.");

            await _moderationSeeder.SeedAsync();
            _logger.LogInformation("Admin Moderation data seeded successfully.");

            await _dashboardSeeder.SeedAsync();
            _logger.LogInformation("Admin Dashboard data seeded successfully.");

            await _analyticsSeeder.SeedAsync();
            _logger.LogInformation("Admin Analytics data seeded successfully.");

            _logger.LogInformation("Admin data seeding completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding Admin data.");
            throw;
        }
    }
}