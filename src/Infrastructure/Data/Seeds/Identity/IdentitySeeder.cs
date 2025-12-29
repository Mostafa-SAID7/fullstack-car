using Domain.Entities.Identity;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Identity
{
    public class IdentitySeeder
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly ILogger<IdentitySeeder> _logger;

        public IdentitySeeder(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<Guid>> roleManager,
            ILogger<IdentitySeeder> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
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
            var roles = new[] { "Admin", "Moderator", "User" };

            foreach (var roleName in roles)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    await _roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
                    _logger.LogInformation($"Seeded role: {roleName}");
                }
            }
        }

        private async Task SeedUsersAsync()
        {
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
                    IsActive = true
                };
                
                var result = await _userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(adminUser, "Admin");
                    _logger.LogInformation("Seeded admin user");
                }
            }

            // Standard User
            var userEmail = "user@localhost";
            var normalUser = await _userManager.FindByEmailAsync(userEmail);
            if (normalUser == null)
            {
                normalUser = new ApplicationUser
                {
                    UserName = userEmail,
                    Email = userEmail,
                    EmailConfirmed = true,
                    FirstName = "John",
                    LastName = "Doe",
                    IsActive = true
                };

                var result = await _userManager.CreateAsync(normalUser, "User123!");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(normalUser, "User");
                    _logger.LogInformation("Seeded standard user");
                }
            }
            
            // Moderator User
            var modEmail = "mod@localhost";
            var modUser = await _userManager.FindByEmailAsync(modEmail);
            if (modUser == null)
            {
                modUser = new ApplicationUser
                {
                    UserName = modEmail,
                    Email = modEmail,
                    EmailConfirmed = true,
                    FirstName = "Max",
                    LastName = "Moderator",
                    IsActive = true
                };

                var result = await _userManager.CreateAsync(modUser, "Mod1234!");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(modUser, "Moderator");
                    _logger.LogInformation("Seeded moderator user");
                }
            }
        }
    }
}
