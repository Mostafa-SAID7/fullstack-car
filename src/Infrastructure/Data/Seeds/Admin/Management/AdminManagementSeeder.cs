using Domain.Entities.Admin.Management;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Management;

public class AdminManagementSeeder
{
    private readonly ILogger<AdminManagementSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public AdminManagementSeeder(ILogger<AdminManagementSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Admin Management data...");

            await SeedRoleAssignmentsAsync();
            await SeedAdminActionsAsync();

            await _context.SaveChangesAsync();
            _logger.LogInformation("Admin Management data seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Admin Management data.");
            throw;
        }
    }

    private async Task SeedRoleAssignmentsAsync()
    {
        if (await _context.RoleAssignments.AnyAsync())
        {
            _logger.LogInformation("Role assignments already exist. Skipping seeding.");
            return;
        }

        // This will be populated after users and roles are created
        _logger.LogInformation("Role assignments will be created after user seeding.");
    }

    private async Task SeedAdminActionsAsync()
    {
        if (await _context.AdminActions.AnyAsync())
        {
            _logger.LogInformation("Admin actions already exist. Skipping seeding.");
            return;
        }

        var adminActions = new List<AdminAction>
        {
            new()
            {
                ActionType = "UserSuspension",
                Description = "User account suspended for policy violation",
                Reason = "Inappropriate content posting",
                Timestamp = DateTime.UtcNow.AddDays(-7),
                IsActive = true
            },
            new()
            {
                ActionType = "ContentModeration",
                Description = "Post removed for community guidelines violation",
                Reason = "Spam content detected",
                Timestamp = DateTime.UtcNow.AddDays(-5),
                IsActive = true
            },
            new()
            {
                ActionType = "SystemMaintenance",
                Description = "Scheduled system maintenance performed",
                Reason = "Database optimization and cleanup",
                Timestamp = DateTime.UtcNow.AddDays(-3),
                IsActive = true
            }
        };

        await _context.AdminActions.AddRangeAsync(adminActions);
        _logger.LogInformation($"Added {adminActions.Count} admin actions.");
    }
}