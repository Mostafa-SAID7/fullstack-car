namespace Infrastructure.Data.Seeds.Analytics
{
    public abstract class BaseAnalyticsSeeder
    {
        protected readonly ApplicationDbContext _context;
        protected readonly UserManager<ApplicationUser> _userManager;
        protected readonly ILogger _logger;
        protected readonly Random _random = new();

        protected BaseAnalyticsSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public abstract Task SeedAsync();

        protected string GenerateRandomIpAddress()
        {
            return $"{_random.Next(1, 255)}.{_random.Next(1, 255)}.{_random.Next(1, 255)}.{_random.Next(1, 255)}";
        }

        protected string GenerateUserAgent()
        {
            var userAgents = new[]
            {
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0"
            };
            return userAgents[_random.Next(userAgents.Length)];
        }

        protected DateTime GetRandomDateInRange(DateTime startDate, DateTime endDate)
        {
            var range = endDate - startDate;
            var randomDays = _random.Next(0, (int)range.TotalDays);
            return startDate.AddDays(randomDays);
        }

        protected DateTime GetRandomDateInRange(DateTime startDate, int daysRange)
        {
            return startDate.AddDays(_random.Next(0, daysRange));
        }
    }
}