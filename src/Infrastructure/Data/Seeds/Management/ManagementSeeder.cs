using Infrastructure.Data.Seeds.Management.Users;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Management
{
    public class ManagementSeeder
    {
        private readonly ILogger<ManagementSeeder> _logger;
        private readonly UserManagementSeeder _userManagementSeeder;
        private readonly UserRolesSeeder _userRolesSeeder;
        private readonly UserPermissionsSeeder _userPermissionsSeeder;

        public ManagementSeeder(
            ILogger<ManagementSeeder> logger,
            UserManagementSeeder userManagementSeeder,
            UserRolesSeeder userRolesSeeder,
            UserPermissionsSeeder userPermissionsSeeder)
        {
            _logger = logger;
            _userManagementSeeder = userManagementSeeder;
            _userRolesSeeder = userRolesSeeder;
            _userPermissionsSeeder = userPermissionsSeeder;
        }

        public async Task SeedAllManagementDataAsync()
        {
            _logger.LogInformation("Starting comprehensive management data seeding...");

            // Seed in proper order: roles first, then permissions, then users
            await _userRolesSeeder.SeedAdvancedRolesAsync();
            await _userPermissionsSeeder.SeedPermissionsAsync();
            await _userManagementSeeder.SeedAllAsync();

            _logger.LogInformation("Management data seeding completed successfully.");
        }
    }
}
