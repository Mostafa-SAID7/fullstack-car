using Domain.Entities.Identity;
using Domain.Enums.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class IdentitySeeder
    {
        private readonly ILogger<IdentitySeeder> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public IdentitySeeder(
            ILogger<IdentitySeeder> logger,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedRolesAsync()
        {
            _logger.LogInformation("Seeding roles...");

            var roles = new[]
            {
                new ApplicationRole { Name = "Admin", Description = "System Administrator", Priority = 100, IsSystemRole = true },
                new ApplicationRole { Name = "Moderator", Description = "Community Moderator", Priority = 50, IsSystemRole = true },
                new ApplicationRole { Name = "User", Description = "Regular User", Priority = 1, IsSystemRole = true },
                new ApplicationRole { Name = "Premium", Description = "Premium User", Priority = 10, IsSystemRole = false }
            };

            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role.Name))
                {
                    await _roleManager.CreateAsync(role);
                    _logger.LogInformation("Created role: {RoleName}", role.Name);
                }
            }
        }

        public async Task SeedUsersAsync()
        {
            _logger.LogInformation("Seeding users...");

            var users = new[]
            {
                new { Email = "admin@communitycar.com", FirstName = "System", LastName = "Admin", Bio = "System Administrator", Role = "Admin" },
                new { Email = "moderator@communitycar.com", FirstName = "Community", LastName = "Moderator", Bio = "Community Moderator", Role = "Moderator" },
                new { Email = "ahmed.hassan@fully2car.com", FirstName = "Ahmed", LastName = "Hassan", Bio = "Motorsport photographer and racing enthusiast from Dubai.", Role = "User" },
                new { Email = "fatima.alzahra@fully2car.com", FirstName = "Fatima", LastName = "Al-Zahra", Bio = "Automotive engineer specializing in hybrid technology.", Role = "Premium" },
                new { Email = "omar.khalil@fully2car.com", FirstName = "Omar", LastName = "Khalil", Bio = "Professional race car driver and driving instructor.", Role = "User" },
                new { Email = "nadia.mansour@fully2car.com", FirstName = "Nadia", LastName = "Mansour", Bio = "Classic car restoration specialist and vintage car collector.", Role = "User" },
                new { Email = "hassan.rashid@fully2car.com", FirstName = "Hassan", LastName = "Al-Rashid", Bio = "Automotive journalist and car reviewer.", Role = "User" },
                new { Email = "sara.alqasimi@fully2car.com", FirstName = "Sara", LastName = "Al-Qasimi", Bio = "Car enthusiast and weekend track day participant.", Role = "User" },
                new { Email = "mohammed.bin.zayed@fully2car.com", FirstName = "Mohammed", LastName = "Bin Zayed", Bio = "Luxury car collector and automotive investor.", Role = "Premium" },
                new { Email = "layla.abdulla@fully2car.com", FirstName = "Layla", LastName = "Abdulla", Bio = "Electric vehicle advocate and sustainability expert.", Role = "User" },
                new { Email = "khalid.almaktoum@fully2car.com", FirstName = "Khalid", LastName = "Al-Maktoum", Bio = "Supercar owner and track day organizer.", Role = "Premium" },
                new { Email = "amina.alnuaimi@fully2car.com", FirstName = "Amina", LastName = "Al-Nuaimi", Bio = "Car modification enthusiast and tuning specialist.", Role = "User" }
            };

            foreach (var userData in users)
            {
                var existingUser = await _userManager.FindByEmailAsync(userData.Email);
                if (existingUser == null)
                {
                    var user = new ApplicationUser
                    {
                        UserName = userData.Email,
                        Email = userData.Email,
                        FirstName = userData.FirstName,
                        LastName = userData.LastName,
                        Bio = userData.Bio,
                        EmailConfirmed = true,
                        PhoneNumberConfirmed = false,
                        IsActive = true,
                        Status = UserStatus.Active,
                        CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 180))
                    };

                    var result = await _userManager.CreateAsync(user, "TempPassword123!");
                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(user, userData.Role);
                        _logger.LogInformation("Created user: {Email} with role: {Role}", userData.Email, userData.Role);
                    }
                    else
                    {
                        _logger.LogWarning("Failed to create user {Email}: {Errors}", userData.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
                    }
                }
            }
        }
    }
}
