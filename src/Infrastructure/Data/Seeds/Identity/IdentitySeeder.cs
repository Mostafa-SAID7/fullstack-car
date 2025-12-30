using Domain.Entities.Identity;
using Domain.Enums.Identity;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Identity
{
    public class IdentitySeeder
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<IdentitySeeder> _logger;

        public IdentitySeeder(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            ApplicationDbContext context,
            ILogger<IdentitySeeder> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                await SeedRolesAsync();
                await SeedUsersAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding identity data");
                throw;
            }
        }

        private async Task SeedRolesAsync()
        {
            var roles = new[]
            {
                new { Name = "SuperAdmin", Description = "Super Administrator with full system access", Priority = 1000, IsSystemRole = true },
                new { Name = "Admin", Description = "Administrator with management access", Priority = 900, IsSystemRole = true },
                new { Name = "Moderator", Description = "Content moderator", Priority = 500, IsSystemRole = true },
                new { Name = "User", Description = "Regular user", Priority = 100, IsSystemRole = true },
                new { Name = "Premium", Description = "Premium user with additional features", Priority = 200, IsSystemRole = false }
            };

            foreach (var roleInfo in roles)
            {
                if (!await _roleManager.RoleExistsAsync(roleInfo.Name))
                {
                    var role = new ApplicationRole
                    {
                        Name = roleInfo.Name,
                        Description = roleInfo.Description,
                        Priority = roleInfo.Priority,
                        IsSystemRole = roleInfo.IsSystemRole,
                        IsActive = true,
                        CreatedBy = "System"
                    };

                    var result = await _roleManager.CreateAsync(role);
                    if (result.Succeeded)
                    {
                        _logger.LogInformation($"Seeded role: {roleInfo.Name}");
                    }
                    else
                    {
                        _logger.LogError($"Failed to seed role {roleInfo.Name}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
            }
        }

        private async Task SeedUsersAsync()
        {
            // Super Admin User
            var superAdminEmail = "superadmin@localhost";
            var superAdmin = await _userManager.FindByEmailAsync(superAdminEmail);
            if (superAdmin == null)
            {
                superAdmin = new ApplicationUser
                {
                    UserName = superAdminEmail,
                    Email = superAdminEmail,
                    EmailConfirmed = true,
                    FirstName = "Super",
                    LastName = "Admin",
                    IsActive = true,
                    Status = UserStatus.Active,
                    IsEmailPublic = false,
                    AllowDirectMessages = false
                };

                var result = await _userManager.CreateAsync(superAdmin, "SuperAdmin123!");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(superAdmin, "SuperAdmin");
                    _logger.LogInformation($"Seeded super admin user: {superAdminEmail}");
                }
                else
                {
                    _logger.LogError($"Failed to seed super admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }

            // Admin User
            var adminEmail = "admin@localhost";
            var adminUser = await _userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FirstName = "System",
                    LastName = "Admin",
                    IsActive = true,
                    Status = UserStatus.Active
                };

                var result = await _userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(adminUser, "Admin");
                    _logger.LogInformation($"Seeded admin user: {adminEmail}");
                }
                else
                {
                    _logger.LogError($"Failed to seed admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }

            // Test User
            var testEmail = "user@localhost";
            var testUser = await _userManager.FindByEmailAsync(testEmail);
            if (testUser == null)
            {
                testUser = new ApplicationUser
                {
                    UserName = testEmail,
                    Email = testEmail,
                    EmailConfirmed = true,
                    FirstName = "Test",
                    LastName = "User",
                    IsActive = true,
                    Status = UserStatus.Active,
                    Bio = "This is a test user account for development purposes."
                };

                var result = await _userManager.CreateAsync(testUser, "User123!");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(testUser, "User");
                    _logger.LogInformation($"Seeded test user: {testEmail}");
                }
                else
                {
                    _logger.LogError($"Failed to seed test user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }
    }
}