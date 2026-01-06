using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Management.Users
{
    public class UserRolesSeeder
    {
        private readonly ILogger<UserRolesSeeder> _logger;
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public UserRolesSeeder(
            ILogger<UserRolesSeeder> logger,
            ApplicationDbContext context,
            RoleManager<ApplicationRole> roleManager)
        {
            _logger = logger;
            _context = context;
            _roleManager = roleManager;
        }

        public async Task SeedAdvancedRolesAsync()
        {
            _logger.LogInformation("Seeding advanced role system...");

            await SeedDepartmentRolesAsync();
            await SeedPermissionBasedRolesAsync();
            await SeedTemporaryRolesAsync();
            await SeedCustomRolesAsync();

            _logger.LogInformation("Advanced roles seeding completed.");
        }

        private async Task SeedDepartmentRolesAsync()
        {
            var departmentRoles = new[]
            {
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "HR_Manager",
                    NormalizedName = "HR_MANAGER",
                    Description = "Human Resources Manager with employee management privileges",
                    Priority = 85,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Marketing_Manager",
                    NormalizedName = "MARKETING_MANAGER",
                    Description = "Marketing Manager with campaign and content management privileges",
                    Priority = 82,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Sales_Manager",
                    NormalizedName = "SALES_MANAGER",
                    Description = "Sales Manager with customer relationship and sales analytics access",
                    Priority = 83,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Finance_Manager",
                    NormalizedName = "FINANCE_MANAGER",
                    Description = "Finance Manager with financial reporting and transaction oversight",
                    Priority = 84,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Operations_Manager",
                    NormalizedName = "OPERATIONS_MANAGER",
                    Description = "Operations Manager with system operations and maintenance access",
                    Priority = 86,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            };

            foreach (var role in departmentRoles)
            {
                if (!await _roleManager.RoleExistsAsync(role.Name))
                {
                    await _roleManager.CreateAsync(role);
                    _logger.LogInformation("Created department role: {RoleName}", role.Name);
                }
            }
        }

        private async Task SeedPermissionBasedRolesAsync()
        {
            var permissionRoles = new[]
            {
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Content_Creator",
                    NormalizedName = "CONTENT_CREATOR",
                    Description = "Content Creator with publishing and media management privileges",
                    Priority = 60,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Community_Leader",
                    NormalizedName = "COMMUNITY_LEADER",
                    Description = "Community Leader with group management and event organization privileges",
                    Priority = 65,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Technical_Writer",
                    NormalizedName = "TECHNICAL_WRITER",
                    Description = "Technical Writer with documentation and guide creation privileges",
                    Priority = 58,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Event_Organizer",
                    NormalizedName = "EVENT_ORGANIZER",
                    Description = "Event Organizer with event planning and management capabilities",
                    Priority = 62,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            };

            foreach (var role in permissionRoles)
            {
                if (!await _roleManager.RoleExistsAsync(role.Name))
                {
                    await _roleManager.CreateAsync(role);
                    _logger.LogInformation("Created permission-based role: {RoleName}", role.Name);
                }
            }
        }

        private async Task SeedTemporaryRolesAsync()
        {
            var temporaryRoles = new[]
            {
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Event_Volunteer",
                    NormalizedName = "EVENT_VOLUNTEER",
                    Description = "Temporary volunteer role for specific events (expires in 3 months)",
                    Priority = 40,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Contest_Judge",
                    NormalizedName = "CONTEST_JUDGE",
                    Description = "Temporary judge role for community contests and competitions (expires in 1 month)",
                    Priority = 42,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Beta_Coordinator",
                    NormalizedName = "BETA_COORDINATOR",
                    Description = "Temporary coordinator role for beta testing programs (expires in 6 months)",
                    Priority = 44,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            };

            foreach (var role in temporaryRoles)
            {
                if (!await _roleManager.RoleExistsAsync(role.Name))
                {
                    await _roleManager.CreateAsync(role);
                    _logger.LogInformation("Created temporary role: {RoleName}", role.Name);
                }
            }
        }

        private async Task SeedCustomRolesAsync()
        {
            var customRoles = new[]
            {
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Automotive_Expert",
                    NormalizedName = "AUTOMOTIVE_EXPERT",
                    Description = "Recognized automotive expert with advisory privileges",
                    Priority = 68,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Verified_Mechanic",
                    NormalizedName = "VERIFIED_MECHANIC",
                    Description = "Verified professional mechanic with technical advisory access",
                    Priority = 67,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Racing_Professional",
                    NormalizedName = "RACING_PROFESSIONAL",
                    Description = "Professional racing driver or team member",
                    Priority = 66,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Collector_Elite",
                    NormalizedName = "COLLECTOR_ELITE",
                    Description = "Elite car collector with extensive automotive knowledge",
                    Priority = 64,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            };

            foreach (var role in customRoles)
            {
                if (!await _roleManager.RoleExistsAsync(role.Name))
                {
                    await _roleManager.CreateAsync(role);
                    _logger.LogInformation("Created custom role: {RoleName}", role.Name);
                }
            }
        }
    }
}
