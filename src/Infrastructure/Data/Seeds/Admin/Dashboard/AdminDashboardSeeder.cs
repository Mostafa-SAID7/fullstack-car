using Domain.Entities.Admin.Dashboard;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Dashboard;

public class AdminDashboardSeeder
{
    private readonly ILogger<AdminDashboardSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public AdminDashboardSeeder(ILogger<AdminDashboardSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Admin Dashboard data...");

            await SeedDashboardWidgetsAsync();
            await SeedDashboardLayoutsAsync();

            await _context.SaveChangesAsync();
            _logger.LogInformation("Admin Dashboard data seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Admin Dashboard data.");
            throw;
        }
    }

    private async Task SeedDashboardWidgetsAsync()
    {
        if (await _context.DashboardWidgets.AnyAsync())
        {
            _logger.LogInformation("Dashboard widgets already exist. Skipping seeding.");
            return;
        }

        var widgets = new List<DashboardWidget>
        {
            new()
            {
                Name = "User Statistics",
                Type = "chart",
                Configuration = """{"chartType": "line", "dataSource": "users", "timeRange": "30d"}""",
                Position = 1,
                Size = "medium",
                IsActive = true,
                RequiredPermissions = "ViewUserAnalytics"
            },
            new()
            {
                Name = "System Health",
                Type = "status",
                Configuration = """{"metrics": ["cpu", "memory", "disk"], "refreshInterval": 30}""",
                Position = 2,
                Size = "small",
                IsActive = true,
                RequiredPermissions = "ViewSystemHealth"
            },
            new()
            {
                Name = "Recent Activities",
                Type = "list",
                Configuration = """{"itemCount": 10, "showTimestamp": true}""",
                Position = 3,
                Size = "large",
                IsActive = true,
                RequiredPermissions = "ViewAuditLogs"
            },
            new()
            {
                Name = "Content Moderation Queue",
                Type = "counter",
                Configuration = """{"showPending": true, "showProcessed": false}""",
                Position = 4,
                Size = "small",
                IsActive = true,
                RequiredPermissions = "ViewModerationQueue"
            }
        };

        await _context.DashboardWidgets.AddRangeAsync(widgets);
        _logger.LogInformation($"Added {widgets.Count} dashboard widgets.");
    }

    private async Task SeedDashboardLayoutsAsync()
    {
        if (await _context.DashboardLayouts.AnyAsync())
        {
            _logger.LogInformation("Dashboard layouts already exist. Skipping seeding.");
            return;
        }

        var layouts = new List<DashboardLayout>
        {
            new()
            {
                Name = "Default Admin Layout",
                Configuration = """
                {
                    "columns": 3,
                    "widgets": [
                        {"id": 1, "x": 0, "y": 0, "w": 1, "h": 2},
                        {"id": 2, "x": 1, "y": 0, "w": 1, "h": 1},
                        {"id": 3, "x": 2, "y": 0, "w": 1, "h": 3},
                        {"id": 4, "x": 1, "y": 1, "w": 1, "h": 1}
                    ]
                }
                """,
                IsDefault = true,
                IsActive = true,
                RequiredRole = "Administrator"
            },
            new()
            {
                Name = "Moderator Layout",
                Configuration = """
                {
                    "columns": 2,
                    "widgets": [
                        {"id": 3, "x": 0, "y": 0, "w": 1, "h": 2},
                        {"id": 4, "x": 1, "y": 0, "w": 1, "h": 1}
                    ]
                }
                """,
                IsDefault = false,
                IsActive = true,
                RequiredRole = "Moderator"
            }
        };

        await _context.DashboardLayouts.AddRangeAsync(layouts);
        _logger.LogInformation($"Added {layouts.Count} dashboard layouts.");
    }
}