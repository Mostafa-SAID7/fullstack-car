using Domain.Entities.Identity;
using Domain.Enums.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class IdentitySeeder
    {
        private readonly ILogger<IdentitySeeder> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public IdentitySeeder(
            ILogger<IdentitySeeder> logger,
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedRolesAsync()
        {
            _logger.LogInformation("Seeding roles...");

            var roles = new[]
            {
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    Description = "System Administrator with full access",
                    Priority = 100,
                    IsSystemRole = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Moderator",
                    NormalizedName = "MODERATOR",
                    Description = "Content Moderator with moderation privileges",
                    Priority = 80,
                    IsSystemRole = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "User",
                    NormalizedName = "USER",
                    Description = "Regular User with standard access",
                    Priority = 50,
                    IsSystemRole = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Premium",
                    NormalizedName = "PREMIUM",
                    Description = "Premium User with enhanced features",
                    Priority = 60,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "ServiceProvider",
                    NormalizedName = "SERVICEPROVIDER",
                    Description = "Service Provider with marketplace access",
                    Priority = 70,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            };

            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role.Name))
                {
                    await _roleManager.CreateAsync(role);
                    _logger.LogInformation("Created role: {RoleName}", role.Name);
                }
            }

            _logger.LogInformation("Roles seeding completed.");
        }

        public async Task SeedUsersAsync()
        {
            _logger.LogInformation("Seeding users...");

            // Admin Users
            await CreateUserAsync("admin@fully2car.com", "Admin", "User", "Admin123!", "Admin", UserStatus.Active, true);
            await CreateUserAsync("superadmin@fully2car.com", "Super", "Admin", "SuperAdmin123!", "Admin", UserStatus.Active, true);

            // Moderators
            await CreateUserAsync("moderator1@fully2car.com", "John", "Moderator", "Moderator123!", "Moderator", UserStatus.Active, true);
            await CreateUserAsync("moderator2@fully2car.com", "Sarah", "Wilson", "Moderator123!", "Moderator", UserStatus.Active, true);

            // Service Providers
            var serviceProviders = new[]
            {
                ("provider1@fully2car.com", "Mike", "Johnson", "Provider123!", "ServiceProvider"),
                ("provider2@fully2car.com", "Lisa", "Anderson", "Provider123!", "ServiceProvider"),
                ("provider3@fully2car.com", "David", "Brown", "Provider123!", "ServiceProvider"),
                ("provider4@fully2car.com", "Emma", "Davis", "Provider123!", "ServiceProvider"),
                ("provider5@fully2car.com", "James", "Miller", "Provider123!", "ServiceProvider")
            };

            foreach (var (email, firstName, lastName, password, role) in serviceProviders)
            {
                await CreateUserAsync(email, firstName, lastName, password, role, UserStatus.Active, true);
            }

            // Premium Users
            var premiumUsers = new[]
            {
                ("premium1@fully2car.com", "Alex", "Thompson", "Premium123!", "Premium"),
                ("premium2@fully2car.com", "Maria", "Garcia", "Premium123!", "Premium"),
                ("premium3@fully2car.com", "Robert", "Lee", "Premium123!", "Premium"),
                ("premium4@fully2car.com", "Jennifer", "White", "Premium123!", "Premium"),
                ("premium5@fully2car.com", "Michael", "Taylor", "Premium123!", "Premium")
            };

            foreach (var (email, firstName, lastName, password, role) in premiumUsers)
            {
                await CreateUserAsync(email, firstName, lastName, password, role, UserStatus.Active, true);
            }

            // Regular Users (33 users to make total 50)
            var regularUsers = new[]
            {
                ("user1@fully2car.com", "John", "Smith", "User123!", "User"),
                ("user2@fully2car.com", "Jane", "Doe", "User123!", "User"),
                ("user3@fully2car.com", "Bob", "Wilson", "User123!", "User"),
                ("user4@fully2car.com", "Alice", "Johnson", "User123!", "User"),
                ("user5@fully2car.com", "Charlie", "Brown", "User123!", "User"),
                ("user6@fully2car.com", "Diana", "Davis", "User123!", "User"),
                ("user7@fully2car.com", "Edward", "Miller", "User123!", "User"),
                ("user8@fully2car.com", "Fiona", "Wilson", "User123!", "User"),
                ("user9@fully2car.com", "George", "Moore", "User123!", "User"),
                ("user10@fully2car.com", "Helen", "Taylor", "User123!", "User"),
                ("user11@fully2car.com", "Ian", "Anderson", "User123!", "User"),
                ("user12@fully2car.com", "Julia", "Thomas", "User123!", "User"),
                ("user13@fully2car.com", "Kevin", "Jackson", "User123!", "User"),
                ("user14@fully2car.com", "Laura", "White", "User123!", "User"),
                ("user15@fully2car.com", "Mark", "Harris", "User123!", "User"),
                ("user16@fully2car.com", "Nancy", "Martin", "User123!", "User"),
                ("user17@fully2car.com", "Oliver", "Garcia", "User123!", "User"),
                ("user18@fully2car.com", "Paula", "Rodriguez", "User123!", "User"),
                ("user19@fully2car.com", "Quinn", "Lewis", "User123!", "User"),
                ("user20@fully2car.com", "Rachel", "Lee", "User123!", "User"),
                ("user21@fully2car.com", "Steve", "Walker", "User123!", "User"),
                ("user22@fully2car.com", "Tina", "Hall", "User123!", "User"),
                ("user23@fully2car.com", "Victor", "Allen", "User123!", "User"),
                ("user24@fully2car.com", "Wendy", "Young", "User123!", "User"),
                ("user25@fully2car.com", "Xavier", "King", "User123!", "User"),
                ("user26@fully2car.com", "Yvonne", "Wright", "User123!", "User"),
                ("user27@fully2car.com", "Zachary", "Lopez", "User123!", "User"),
                ("user28@fully2car.com", "Amy", "Hill", "User123!", "User"),
                ("user29@fully2car.com", "Brian", "Scott", "User123!", "User"),
                ("user30@fully2car.com", "Carol", "Green", "User123!", "User"),
                ("user31@fully2car.com", "Daniel", "Adams", "User123!", "User"),
                ("user32@fully2car.com", "Eva", "Baker", "User123!", "User"),
                ("user33@fully2car.com", "Frank", "Nelson", "User123!", "User")
            };

            // Create active users (most recent)
            for (int i = 0; i < 25; i++)
            {
                var (email, firstName, lastName, password, role) = regularUsers[i];
                await CreateUserAsync(email, firstName, lastName, password, role, UserStatus.Active, true, DateTime.UtcNow.AddDays(-Random.Shared.Next(0, 30)));
            }

            // Create inactive users (older, no recent login)
            for (int i = 25; i < 33; i++)
            {
                var (email, firstName, lastName, password, role) = regularUsers[i];
                await CreateUserAsync(email, firstName, lastName, password, role, UserStatus.Active, false, DateTime.UtcNow.AddDays(-Random.Shared.Next(60, 180)));
            }

            _logger.LogInformation("Users seeding completed. Total users created: 50");
        }

        private async Task CreateUserAsync(
            string email, 
            string firstName, 
            string lastName, 
            string password, 
            string roleName, 
            UserStatus status = UserStatus.Active, 
            bool isActive = true,
            DateTime? lastLogin = null)
        {
            var existingUser = await _userManager.FindByEmailAsync(email);
            if (existingUser != null)
            {
                _logger.LogWarning("User {Email} already exists, skipping...", email);
                return;
            }

            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email,
                NormalizedUserName = email.ToUpper(),
                NormalizedEmail = email.ToUpper(),
                FirstName = firstName,
                LastName = lastName,
                EmailConfirmed = true,
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = false,
                AccessFailedCount = 0,
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 365)),
                LastLoginAt = lastLogin ?? (isActive ? DateTime.UtcNow.AddDays(-Random.Shared.Next(0, 7)) : null),
                IsActive = isActive,
                Status = status,
                Bio = $"Hello, I'm {firstName} {lastName}. Welcome to my profile!",
                IsEmailPublic = Random.Shared.NextDouble() > 0.5,
                AllowDirectMessages = Random.Shared.NextDouble() > 0.3,
                ShowOnlineStatus = Random.Shared.NextDouble() > 0.2
            };

            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, roleName);
                _logger.LogInformation("Created user: {Email} with role: {Role}", email, roleName);
            }
            else
            {
                _logger.LogError("Failed to create user {Email}: {Errors}", email, string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }
}