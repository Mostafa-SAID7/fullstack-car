using Domain.Entities.Identity;
using ServiceProviderEntity = Domain.Entities.Marketplace.Providers.ServiceProvider;
using Domain.Entities.Marketplace.Services;
using Domain.Entities.Marketplace.Bookings;
using Domain.Entities.Marketplace.Reviews;
using Domain.Enums.Marketplace;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class MarketplaceSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<MarketplaceSeeder> _logger;

        public MarketplaceSeeder(ApplicationDbContext context, ILogger<MarketplaceSeeder> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SeedAllAsync()
        {
            await SeedProvidersAsync();
            await SeedServicesAsync();
            await SeedBookingsAsync();
            await SeedReviewsAsync();
        }

        public async Task SeedProvidersAsync()
        {
            _logger.LogInformation("Seeding Marketplace Providers...");
            
            var users = await _context.Users.ToListAsync();
            if (!users.Any()) return;

            if (await _context.ServiceProviders.AnyAsync()) return;

            var providers = new List<ServiceProviderEntity>
            {
                new ServiceProviderEntity
                {
                    BusinessName = "Elite Auto Care",
                    Description = "Premium car detailing and maintenance services.",
                    ContactEmail = "contact@eliteautocare.com",
                    ContactPhone = "+971501234567",
                    Address = "Al Quoz Industrial Area 3",
                    City = "Dubai",
                    Country = "UAE",
                    Latitude = 25.1324,
                    Longitude = 55.2289,
                    IsVerified = true,
                    OwnerId = users[0].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-6),
                    CreatedBy = "System"
                },
                new ServiceProviderEntity
                {
                    BusinessName = "Desert Garage",
                    Description = "Specialized in 4x4 tuning and off-road preparations.",
                    ContactEmail = "info@desertgarage.ae",
                    ContactPhone = "+971559876543",
                    Address = "Mussafah Industrial Area",
                    City = "Abu Dhabi",
                    Country = "UAE",
                    Latitude = 24.3512,
                    Longitude = 54.5123,
                    IsVerified = true,
                    OwnerId = users[1 % users.Count].Id,
                    CreatedAt = DateTime.UtcNow.AddMonths(-12),
                    CreatedBy = "System"
                }
            };

            _context.ServiceProviders.AddRange(providers);
            await _context.SaveChangesAsync();
        }

        public async Task SeedServicesAsync()
        {
            _logger.LogInformation("Seeding Marketplace Services...");

            var providers = await _context.ServiceProviders.ToListAsync();
            if (!providers.Any()) return;

            if (await _context.Services.AnyAsync()) return;

            foreach (var provider in providers)
            {
                var services = new List<Service>
                {
                    new Service
                    {
                        ServiceProviderId = provider.Id,
                        Name = "Full Ceramic Coating",
                        Title = "Premium Ceramic Protection",
                        Description = "Multi-layer ceramic coating for long-lasting paint protection.",
                        ShortDescription = "Long-lasting paint protection.",
                        BasePrice = 1500,
                        Price = 1500,
                        EstimatedDuration = 480,
                        Duration = 480,
                        Category = "Detailing",
                        ServiceType = ServiceType.Maintenance,
                        Type = ServiceType.Maintenance,
                        Status = ServiceStatus.Active,
                        IsActive = true
                    },
                    new Service
                    {
                        ServiceProviderId = provider.Id,
                        Name = "Advanced Diagnostics",
                        Title = "Computerized Engine Analysis",
                        Description = "Full computerized diagnostics to identify any electronic or mechanical issues.",
                        ShortDescription = "Full engine diagnostics.",
                        BasePrice = 250,
                        Price = 250,
                        EstimatedDuration = 60,
                        Duration = 60,
                        Category = "Repair",
                        ServiceType = ServiceType.Repair,
                        Type = ServiceType.Repair,
                        Status = ServiceStatus.Active,
                        IsActive = true
                    }
                };

                _context.Services.AddRange(services);
            }

            await _context.SaveChangesAsync();
        }

        public async Task SeedBookingsAsync()
        {
            _logger.LogInformation("Seeding Marketplace Bookings...");

            var users = await _context.Users.ToListAsync();
            var services = await _context.Services.Include(s => s.ServiceProvider).ToListAsync();
            
            if (users.Count < 2 || !services.Any()) return;
            if (await _context.ServiceBookings.AnyAsync()) return;

            for (int i = 0; i < 10; i++)
            {
                var service = services[Random.Shared.Next(services.Count)];
                var customer = users[Random.Shared.Next(users.Count)];

                var booking = new ServiceBooking
                {
                    BookingNumber = $"BK-{DateTime.UtcNow.Year}-{i:D4}",
                    CustomerId = customer.Id,
                    ServiceProviderId = service.ServiceProviderId,
                    ServiceId = service.Id,
                    ServiceName = service.Name,
                    BookingDate = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30)),
                    ScheduledDate = DateTime.UtcNow.AddDays(Random.Shared.Next(-10, 10)),
                    ServiceDate = DateTime.UtcNow.AddDays(Random.Shared.Next(-10, 10)),
                    ScheduledTime = new TimeSpan(9 + Random.Shared.Next(0, 8), 0, 0),
                    Status = (BookingStatus)Random.Shared.Next(1, 6),
                    PaymentStatus = (PaymentStatus)Random.Shared.Next(1, 4),
                    SubTotal = service.BasePrice,
                    TotalAmount = service.BasePrice * 1.05m,
                    Currency = "AED",
                    VehicleMake = "Toyota",
                    VehicleModel = "Land Cruiser",
                    VehicleYear = 2022
                };

                _context.ServiceBookings.Add(booking);
            }

            await _context.SaveChangesAsync();
        }

        public async Task SeedReviewsAsync()
        {
            _logger.LogInformation("Seeding Marketplace Reviews...");

            var completedBookings = await _context.ServiceBookings
                .Where(b => b.Status == BookingStatus.Completed)
                .ToListAsync();

            if (!completedBookings.Any()) return;
            if (await _context.ServiceReviews.AnyAsync()) return;

            foreach (var booking in completedBookings)
            {
                var review = new ServiceReview
                {
                    BookingId = booking.Id,
                    ServiceId = booking.ServiceId,
                    ServiceProviderId = booking.ServiceProviderId,
                    CustomerId = booking.CustomerId,
                    Rating = Random.Shared.Next(4, 6),
                    Comment = "Excellent service! Very professional and timely.",
                    Title = "Highly Recommended",
                    IsVerified = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = booking.CustomerId.ToString()
                };

                _context.ServiceReviews.Add(review);
            }

            await _context.SaveChangesAsync();
        }
    }
}
