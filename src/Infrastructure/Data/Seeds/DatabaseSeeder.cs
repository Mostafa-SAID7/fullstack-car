using Infrastructure.Data.Seeds.Community;
using Infrastructure.Data.Seeds.Identity;
using Infrastructure.Data.Seeds.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class DatabaseSeeder
    {
        private readonly ILogger<DatabaseSeeder> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IdentitySeeder _identitySeeder;
        private readonly CommunitySeeder _communitySeeder;
        private readonly SharedSeeder _sharedSeeder;

        public DatabaseSeeder(
            ILogger<DatabaseSeeder> logger,
            ApplicationDbContext context,
            IdentitySeeder identitySeeder,
            CommunitySeeder communitySeeder,
            SharedSeeder sharedSeeder)
        {
            _logger = logger;
            _context = context;
            _identitySeeder = identitySeeder;
            _communitySeeder = communitySeeder;
            _sharedSeeder = sharedSeeder;
        }

        public async Task InitializeAsync()
        {
            try
            {
                _logger.LogInformation("Starting database initialization...");

                // Ensure database is created and apply any pending migrations
                if (_context.Database.IsSqlServer())
                {
                    _logger.LogInformation("Deleting existing database if it exists...");
                    await _context.Database.EnsureDeletedAsync();

                    _logger.LogInformation("Creating fresh database...");
                    await _context.Database.EnsureCreatedAsync();

                    _logger.LogInformation("Database created successfully.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initializing the database.");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                _logger.LogInformation("Starting database seeding...");

                // Seed in order: Identity -> Community -> Shared
                await _identitySeeder.SeedAsync();
                _logger.LogInformation("Identity data seeded successfully.");

                await _communitySeeder.SeedAsync();
                _logger.LogInformation("Community data seeded successfully.");

                await _sharedSeeder.SeedAsync();
                _logger.LogInformation("Shared data seeded successfully.");

                _logger.LogInformation("Database seeding completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }
    }
}
