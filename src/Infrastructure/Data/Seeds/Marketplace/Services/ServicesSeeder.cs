using Domain.Entities.Marketplace;

namespace Infrastructure.Data.Seeds.Marketplace.Services;

public class ServicesSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<ServicesSeeder> _logger;
    private readonly Random _random = new();

    public ServicesSeeder(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<ServicesSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            var serviceProviders = await _context.ServiceProviders.ToListAsync();
            if (!serviceProviders.Any()) return;

            var services = new List<Service>();
            var serviceNames = GetServiceNames();

            foreach (var provider in serviceProviders)
            {
                var serviceCount = _random.Next(2, 8);
                
                for (int i = 0; i < serviceCount; i++)
                {
                    var serviceName = serviceNames[_random.Next(serviceNames.Length)];
                    
                    var service = new Service
                    {
                        ServiceProviderId = provider.Id,
                        Name = $"{serviceName} - {provider.BusinessName}",
                        Description = GenerateServiceDescription(serviceName),
                        Price = GenerateServicePrice(serviceName),
                        Duration = GenerateServiceDuration(serviceName),
                        Category = GetServiceCategory(serviceName),
                        IsActive = true,
                        CreatedAt = provider.CreatedAt.AddDays(_random.Next(1, 30)),
                        UpdatedAt = GetRandomDateInRange(DateTime.UtcNow.AddDays(-15), 15)
                    };

                    services.Add(service);
                }
            }

            await _context.Services.AddRangeAsync(services);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Services seed data created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding services data");
            throw;
        }
    }

    private DateTime GetRandomDateInRange(DateTime startDate, int daysRange)
    {
        return startDate.AddDays(_random.Next(0, daysRange));
    }

    private string[] GetServiceNames()
    {
        return new[]
        {
            "Oil Change", "Brake Inspection", "Tire Rotation", "Engine Diagnostic",
            "Car Wash", "Wax Service", "Interior Cleaning", "Battery Check",
            "Transmission Service", "Air Filter Replacement", "Spark Plug Replacement",
            "Coolant Flush", "Wheel Alignment", "Suspension Check"
        };
    }

    private string GenerateServiceDescription(string serviceName)
    {
        return $"Professional {serviceName.ToLower()} service performed by certified technicians. " +
               "We use high-quality materials and provide warranty on our work.";
    }

    private decimal GenerateServicePrice(string serviceName)
    {
        return serviceName switch
        {
            "Oil Change" => _random.Next(30, 80),
            "Brake Inspection" => _random.Next(50, 150),
            "Tire Rotation" => _random.Next(25, 60),
            "Engine Diagnostic" => _random.Next(100, 200),
            "Car Wash" => _random.Next(15, 40),
            "Transmission Service" => _random.Next(200, 500),
            _ => _random.Next(50, 200)
        };
    }

    private int GenerateServiceDuration(string serviceName)
    {
        return serviceName switch
        {
            "Oil Change" => _random.Next(30, 60),
            "Car Wash" => _random.Next(45, 90),
            "Brake Inspection" => _random.Next(60, 120),
            "Engine Diagnostic" => _random.Next(120, 240),
            "Transmission Service" => _random.Next(180, 360),
            _ => _random.Next(60, 180)
        };
    }

    private string GetServiceCategory(string serviceName)
    {
        return serviceName switch
        {
            "Oil Change" or "Air Filter Replacement" => "Maintenance",
            "Brake Inspection" or "Brake Service" => "Safety",
            "Car Wash" or "Wax Service" => "Detailing",
            "Engine Diagnostic" or "Transmission Service" => "Repair",
            _ => "General"
        };
    }
}