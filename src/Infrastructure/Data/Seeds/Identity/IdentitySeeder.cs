using Domain.Entities.Identity;
using Domain.Enums.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Identity
{
    public class IdentitySeeder
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<IdentitySeeder> _logger;

        public IdentitySeeder(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<Guid>> roleManager,
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

                    // Create corresponding Domain User
                    var domainUser = new User
                    {
                        Id = adminUser.Id, // Same ID as ApplicationUser
                        FirstName = adminUser.FirstName,
                        LastName = adminUser.LastName,
                        Email = adminUser.Email,
                        PasswordHash = adminUser.PasswordHash ?? string.Empty,
                        PhoneNumber = adminUser.PhoneNumber ?? string.Empty,
                        ProfileImageUrl = adminUser.ProfileImageUrl,
                        Bio = adminUser.Bio,
                        Status = UserStatus.Active,
                        EmailVerified = adminUser.EmailConfirmed,
                        LastLoginAt = adminUser.LastLoginAt,
                        CreatedBy = adminUser.Id.ToString(),
                        CreatedAt = adminUser.CreatedAt
                    };

                    _context.DomainUsers.Add(domainUser);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Seeded admin user (Identity + Domain)");
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

                    // Create corresponding Domain User
                    var domainUser = new User
                    {
                        Id = normalUser.Id,
                        FirstName = normalUser.FirstName,
                        LastName = normalUser.LastName,
                        Email = normalUser.Email,
                        PasswordHash = normalUser.PasswordHash ?? string.Empty,
                        PhoneNumber = normalUser.PhoneNumber ?? string.Empty,
                        ProfileImageUrl = normalUser.ProfileImageUrl,
                        Bio = normalUser.Bio,
                        Status = UserStatus.Active,
                        EmailVerified = normalUser.EmailConfirmed,
                        LastLoginAt = normalUser.LastLoginAt,
                        CreatedBy = normalUser.Id.ToString(),
                        CreatedAt = normalUser.CreatedAt
                    };

                    _context.DomainUsers.Add(domainUser);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Seeded standard user (Identity + Domain)");
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

                    // Create corresponding Domain User
                    var domainUser = new User
                    {
                        Id = modUser.Id,
                        FirstName = modUser.FirstName,
                        LastName = modUser.LastName,
                        Email = modUser.Email,
                        PasswordHash = modUser.PasswordHash ?? string.Empty,
                        PhoneNumber = modUser.PhoneNumber ?? string.Empty,
                        ProfileImageUrl = modUser.ProfileImageUrl,
                        Bio = modUser.Bio,
                        Status = UserStatus.Active,
                        EmailVerified = modUser.EmailConfirmed,
                        LastLoginAt = modUser.LastLoginAt,
                        CreatedBy = modUser.Id.ToString(),
                        CreatedAt = modUser.CreatedAt
                    };

                    _context.DomainUsers.Add(domainUser);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Seeded moderator user (Identity + Domain)");
                }
            }
        }
    }
}
