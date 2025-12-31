namespace Infrastructure.Data.Seeds.Analytics
{
    public class AnalyticsSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AnalyticsSeeder> _logger;
        private readonly IServiceProvider _serviceProvider;

        public AnalyticsSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<AnalyticsSeeder> logger,
            IServiceProvider serviceProvider)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        public async Task SeedAsync()
        {
            try
            {
                _logger.LogInformation("Starting comprehensive analytics data seeding...");

                // Seed in order of dependencies
                await SeedEngagementAsync();
                await SeedUserActivityAsync();
                await SeedSecurityDataAsync();
                await SeedSystemMetricsAsync();
                
                _logger.LogInformation("Analytics seed data created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding analytics data");
                throw;
            }
        }

        private async Task SeedEngagementAsync()
        {
            _logger.LogInformation("Seeding engagement data...");
            var engagementSeeder = new EngagementSeeder(_context, _userManager, _logger);
            await engagementSeeder.SeedAsync();
        }

        private async Task SeedUserActivityAsync()
        {
            _logger.LogInformation("Seeding user activity data...");
            var userActivitySeeder = new UserActivitySeeder(_context, _userManager, _logger);
            await userActivitySeeder.SeedAsync();
        }

        private async Task SeedSecurityDataAsync()
        {
            _logger.LogInformation("Seeding security data...");
            var securitySeeder = new SecuritySeeder(_context, _userManager, _logger);
            await securitySeeder.SeedAsync();
        }

        private async Task SeedSystemMetricsAsync()
        {
            _logger.LogInformation("Seeding system metrics data...");
            var systemMetricsSeeder = new SystemMetricsSeeder(_context, _userManager, _logger);
            await systemMetricsSeeder.SeedAsync();
        }
    }
}