using Infrastructure.Data.Seeds.Community;
using Infrastructure.Data.Seeds.Identity;
using Infrastructure.Data.Seeds.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class ApplicationDbContextInitialiser
    {
        private readonly ILogger<ApplicationDbContextInitialiser> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IdentitySeeder _identitySeeder;
        private readonly CommunitySeeder _communitySeeder;
        private readonly SharedSeeder _sharedSeeder;

        public ApplicationDbContextInitialiser(
            ILogger<ApplicationDbContextInitialiser> logger,
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

        public async Task InitialiseAsync()
        {
            try
            {
                if (_context.Database.IsSqlServer())
                {
                    await _context.Database.MigrateAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initialising the database.");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                await TrySeedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }

        public async Task TrySeedAsync()
        {
            // Orhcestrate seeding order
            await _identitySeeder.SeedAsync();
            await _communitySeeder.SeedAsync();
            await _sharedSeeder.SeedAsync();
        }
    }
}
