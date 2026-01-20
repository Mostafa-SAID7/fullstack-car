using Domain.Entities.Identity;
using Infrastructure.Data.Seeds.Management;
using Infrastructure.Data.Seeds.Management.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class DatabaseSeeder
    {
        private readonly ILogger<DatabaseSeeder> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IdentitySeeder _identitySeeder;
        private readonly UserManagementSeeder _userManagementSeeder;
        private readonly UserRolesSeeder _userRolesSeeder;
        private readonly UserPermissionsSeeder _userPermissionsSeeder;

        public DatabaseSeeder(
            ILogger<DatabaseSeeder> logger,
            ApplicationDbContext context,
            IdentitySeeder identitySeeder,
            UserManagementSeeder userManagementSeeder,
            UserRolesSeeder userRolesSeeder,
            UserPermissionsSeeder userPermissionsSeeder)
        {
            _logger = logger;
            _context = context;
            _identitySeeder = identitySeeder;
            _userManagementSeeder = userManagementSeeder;
            _userRolesSeeder = userRolesSeeder;
            _userPermissionsSeeder = userPermissionsSeeder;
        }

        public async Task InitializeAsync()
        {
            try
            {
                _logger.LogInformation("Starting database initialization...");

                if (_context.Database.IsSqlServer())
                {
                    var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();
                    if (pendingMigrations.Any())
                    {
                        _logger.LogInformation("Applying {Count} pending migrations...", pendingMigrations.Count());
                        await _context.Database.MigrateAsync();
                        _logger.LogInformation("Database migrations applied successfully.");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initializing the database: {Message}", ex.Message);
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                _logger.LogInformation("Starting identity-only database seeding...");

                await ClearExistingDataAsync();

                // Seed identity in dependency order
                await _identitySeeder.SeedRolesAsync();
                await _identitySeeder.SeedUsersAsync();
                
                // Seed complex management data (roles, permissions, users)
                await _userRolesSeeder.SeedAdvancedRolesAsync();
                await _userPermissionsSeeder.SeedPermissionsAsync();
                await _userManagementSeeder.SeedAllAsync();

                await _context.SaveChangesAsync();
                _logger.LogInformation("Identity database seeding completed successfully.");

                await LogStatisticsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database: {Message}", ex.Message);
                throw;
            }
        }

        private async Task ClearExistingDataAsync()
        {
            _logger.LogInformation("Clearing existing identity seed data...");

            var seededUsers = await _context.Users
                .Where(u => u.Email!.Contains("@fully2car.com") || u.Email!.Contains("@communitycar.com"))
                .ToListAsync();

            if (seededUsers.Any())
            {
                var seededUserIds = seededUsers.Select(u => u.Id).ToList();
                
                var refreshTokens = await _context.RefreshTokens.Where(rt => seededUserIds.Contains(rt.UserId)).ToListAsync();
                _context.RefreshTokens.RemoveRange(refreshTokens);

                var userActivities = await _context.UserActivities.Where(ua => seededUserIds.Contains(ua.UserId)).ToListAsync();
                _context.UserActivities.RemoveRange(userActivities);

                var userRoles = await _context.UserRoles.Where(ur => seededUserIds.Contains(ur.UserId)).ToListAsync();
                _context.UserRoles.RemoveRange(userRoles);

                var userClaims = await _context.UserClaims.Where(uc => seededUserIds.Contains(uc.UserId)).ToListAsync();
                _context.UserClaims.RemoveRange(userClaims);

                var userLogins = await _context.UserLogins.Where(ul => seededUserIds.Contains(ul.UserId)).ToListAsync();
                _context.UserLogins.RemoveRange(userLogins);

                var userTokens = await _context.UserTokens.Where(ut => seededUserIds.Contains(ut.UserId)).ToListAsync();
                _context.UserTokens.RemoveRange(userTokens);

                await _context.SaveChangesAsync();
                _context.Users.RemoveRange(seededUsers);
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("Identity seed data cleared successfully.");
        }

        private async Task LogStatisticsAsync()
        {
            var userCount = await _context.Users.CountAsync();
            var userRoleCount = await _context.UserRoles.CountAsync();
            var roleCount = await _context.Roles.CountAsync();

            _logger.LogInformation("📊 Identity Seeding Statistics:");
            _logger.LogInformation("================================");
            _logger.LogInformation("  Users: {UserCount:N0}", userCount);
            _logger.LogInformation("  Roles: {RoleCount:N0}", roleCount);
            _logger.LogInformation("  User-Role Assignments: {UserRoleCount:N0}", userRoleCount);
            _logger.LogInformation("================================");
        }
    }
}

