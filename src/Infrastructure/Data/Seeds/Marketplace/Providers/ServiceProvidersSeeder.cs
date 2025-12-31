namespace Infrastructure.Data.Seeds.Marketplace.Providers;

public class ServiceProvidersSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<ServiceProvidersSeeder> _logger;
    private readonly Random _random = new();

    public ServiceProvidersSeeder(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<ServiceProvidersSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            if (await _context.ServiceProviders.AnyAsync())
            {
                _logger.LogInformation("Service providers already exist, skipping seeding");
                return;
            }

            var users = await _context.Users.Take(20).ToListAsync();
            if (!users.Any()) return;

            var serviceProviders = new List<ServiceProvider>();
            var businessNames = GetBusinessNames();
            var serviceTypes = GetServiceTypes();

            for (int i = 0; i < Math.Min(15, users.Count); i++)
            {
                var user = users[i];
                var businessName = businessNames[_random.Next(businessNames.Length)];
                var serviceType = serviceTypes[_random.Next(serviceTypes.Length)];

                var serviceProvider = new ServiceProvider
                {
                    UserId = user.Id,
                    BusinessName = $"{businessName} #{i + 1}",
                    Description = GenerateBusinessDescription(businessName, serviceType),
                    ServiceType = serviceType,
                    Location = GenerateLocation(),
                    PhoneNumber = GeneratePhoneNumber(),
                    Email = $"business{i + 1}@example.com",
                    Website = $"https://www.{businessName.ToLower().Replace(" ", "")}{i + 1}.com",
                    IsVerified = _random.NextDouble() > 0.3, // 70% verified
                    IsActive = true,
                    Rating = Math.Round(_random.NextDouble() * 2 + 3, 1), // 3.0 to 5.0
                    TotalReviews = _random.Next(5, 100),
                    CreatedAt = GetRandomDateInRange(DateTime.UtcNow.AddMonths(-12), 365),
                    UpdatedAt = GetRandomDateInRange(DateTime.UtcNow.AddDays(-30), 30)
                };

                serviceProviders.Add(serviceProvider);
            }

            await _context.ServiceProviders.AddRangeAsync(serviceProviders);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Service providers seed data created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding service providers data");
            throw;
        }
    }

    private DateTime GetRandomDateInRange(DateTime startDate, int daysRange)
    {
        return startDate.AddDays(_random.Next(0, daysRange));
    }

    private string[] GetBusinessNames()
    {
        return new[]
        {
            "AutoCare Pro", "Elite Car Service", "Quick Fix Garage", "Premium Motors",
            "City Auto Repair", "Express Car Care", "Master Mechanics", "Reliable Auto",
            "Speed Service Center", "Professional Auto", "Quality Car Care", "Expert Motors",
            "Trusted Auto Shop", "Advanced Car Service", "Complete Auto Care"
        };
    }

    private string[] GetServiceTypes()
    {
        return new[]
        {
            "Automotive Repair", "Car Maintenance", "Auto Detailing", "Tire Service",
            "Oil Change", "Brake Service", "Engine Repair", "Transmission Service"
        };
    }

    private string GenerateBusinessDescription(string businessName, string serviceType)
    {
        return $"{businessName} specializes in {serviceType.ToLower()} with over 10 years of experience. " +
               "We provide high-quality services with certified technicians and use only premium parts. " +
               "Customer satisfaction is our top priority.";
    }

    private string GenerateLocation()
    {
        var cities = new[] { "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia" };
        var city = cities[_random.Next(cities.Length)];
        var street = $"{_random.Next(100, 9999)} Main St";
        return $"{street}, {city}";
    }

    private string GeneratePhoneNumber()
    {
        return $"({_random.Next(200, 999)}) {_random.Next(200, 999)}-{_random.Next(1000, 9999)}";
    }
}