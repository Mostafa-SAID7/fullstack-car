using Domain.Entities.Admin.Dashboard;
using Domain.Entities.Identity;
using Domain.Enums.Admin.Dashboard;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class AdminSeeder
    {
        private readonly ILogger<AdminSeeder> _logger;
        private readonly ApplicationDbContext _context;

        public AdminSeeder(ILogger<AdminSeeder> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task SeedAdminDashboardAsync()
        {
            _logger.LogInformation("Seeding Admin Dashboard...");

            var adminUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == "admin@communitycar.com");

            if (adminUser == null)
            {
                _logger.LogWarning("Admin user not found. Skipping Admin Dashboard seeding.");
                return;
            }

            if (await _context.DashboardLayouts.AnyAsync()) 
            {
                _logger.LogInformation("Admin Dashboard already seeded.");
                return;
            }

            var defaultLayout = new DashboardLayout
            {
                Name = "System Overview",
                Description = "Default dashboard for system administrators.",
                IsDefault = true,
                IsPublic = false,
                CreatedByUserId = adminUser.Id,
                Configuration = "{\"theme\": \"dark\", \"gap\": 10}",
                Columns = 12,
                Rows = 10,
                IsActive = true,
                RequiredRole = "Admin",
                CreatedBy = "System"
            };

            _context.DashboardLayouts.Add(defaultLayout);
            await _context.SaveChangesAsync();

            var widgets = new[]
            {
                new DashboardWidget 
                { 
                    Name = "User Statistics", 
                    Type = WidgetType.Metric, 
                    Position = 0, 
                    Width = 3, 
                    Height = 2, 
                    CreatedByUserId = adminUser.Id, 
                    DashboardLayoutId = defaultLayout.Id,
                    DataSource = "Identity.UserStats",
                    Configuration = "{\"icon\": \"users\", \"color\": \"blue\"}",
                    CreatedBy = "System"
                },
                new DashboardWidget 
                { 
                    Name = "Revenue Growth", 
                    Type = WidgetType.Chart, 
                    Position = 3, 
                    Width = 6, 
                    Height = 4, 
                    CreatedByUserId = adminUser.Id, 
                    DashboardLayoutId = defaultLayout.Id,
                    DataSource = "Marketplace.Revenue",
                    Configuration = "{\"chartType\": \"line\", \"interval\": \"monthly\"}",
                    CreatedBy = "System"
                },
                new DashboardWidget 
                { 
                    Name = "Community Growth", 
                    Type = WidgetType.Metric, 
                    Position = 9, 
                    Width = 3, 
                    Height = 2, 
                    CreatedByUserId = adminUser.Id, 
                    DashboardLayoutId = defaultLayout.Id,
                    DataSource = "Community.Growth",
                    Configuration = "{\"icon\": \"trending-up\", \"color\": \"green\"}",
                    CreatedBy = "System"
                },
                new DashboardWidget 
                { 
                    Name = "Recent Bookings", 
                    Type = WidgetType.Table, 
                    Position = 12, 
                    Width = 12, 
                    Height = 4, 
                    CreatedByUserId = adminUser.Id, 
                    DashboardLayoutId = defaultLayout.Id,
                    DataSource = "Marketplace.Bookings.Recent",
                    Configuration = "{\"pageSize\": 5}",
                    CreatedBy = "System"
                }
            };

            _context.DashboardWidgets.AddRange(widgets);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Admin Dashboard seeded successfully.");
        }
    }
}
