using Domain.Entities.Community.Maps;
using Domain.Entities.Identity;
using Domain.Enums.Community.Maps;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class CommunityMapsSeeder
    {
        private readonly ILogger<CommunityMapsSeeder> _logger;
        private readonly ApplicationDbContext _context;

        public CommunityMapsSeeder(ILogger<CommunityMapsSeeder> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task SeedMapsAsync()
        {
            _logger.LogInformation("Seeding Maps...");

            var users = await _context.Users.ToListAsync();
            if (!users.Any()) return;

            if (!await _context.LocationCategories.AnyAsync())
            {
                var categories = new[]
                {
                    new LocationCategory { Name = "Garages", Description = "Repair shops", CreatedBy = "System" },
                    new LocationCategory { Name = "Petrol Stations", Description = "Fuel and snacks", CreatedBy = "System" },
                    new LocationCategory { Name = "Showrooms", Description = "Car dealers", CreatedBy = "System" },
                    new LocationCategory { Name = "Car Wash", Description = "Cleaning services", CreatedBy = "System" }
                };
                _context.LocationCategories.AddRange(categories);
                await _context.SaveChangesAsync();
            }

            var categoryIds = await _context.LocationCategories.Select(c => c.Id).ToListAsync();

            var locations = new[]
            {
                new { Name = "Grand Garage Dubai", City = "Dubai", Lat = 25.2048, Lng = 55.2708 },
                new { Name = "Abu Dhabi Elite Motors", City = "Abu Dhabi", Lat = 24.4539, Lng = 54.3773 },
                new { Name = "Sharjah Auto Mall", City = "Sharjah", Lat = 25.3463, Lng = 55.4209 }
            };

            foreach (var locData in locations)
            {
                var location = new Location
                {
                    Name = locData.Name,
                    Description = $"The best spot for car enthusiasts in {locData.City}.",
                    City = locData.City,
                    Country = "UAE",
                    Latitude = locData.Lat,
                    Longitude = locData.Lng,
                    Type = LocationType.ServiceCenter,
                    Status = LocationStatus.Active,
                    AverageRating = (decimal)(3.5 + Random.Shared.NextDouble() * 1.5),
                    UserId = users[0].Id,
                    CategoryId = categoryIds[Random.Shared.Next(categoryIds.Count)],
                    CreatedAt = DateTime.UtcNow.AddDays(-60),
                    CreatedBy = "System"
                };
                _context.Locations.Add(location);
                await _context.SaveChangesAsync();

                // Add Location Hours
                for (int day = 0; day < 7; day++)
                {
                    _context.LocationHours.Add(new LocationHour
                    {
                        LocationId = location.Id,
                        DayOfWeek = (System.DayOfWeek)day,
                        OpenTime = new TimeSpan(8, 0, 0),
                        CloseTime = new TimeSpan(20, 0, 0),
                        IsClosed = day == 5 // Closed on Fridays for example
                    });
                }

                // Add some Place Reviews
                var reviewCount = Random.Shared.Next(1, Math.Min(4, users.Count));
                var reviewers = users.OrderBy(x => Random.Shared.Next()).Take(reviewCount);
                foreach (var reviewer in reviewers)
                {
                    _context.PlaceReviews.Add(new PlaceReview
                    {
                        LocationId = location.Id,
                        UserId = reviewer.Id,
                        Title = "Great Service!",
                        Content = "Really professional staff and quick turnaround.",
                        Rating = Random.Shared.Next(4, 6),
                        VisitDate = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30)),
                        CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 40)),
                        CreatedBy = reviewer.Id.ToString()
                    });
                }

                // Add some Check-ins
                var checkInCount = Random.Shared.Next(2, Math.Min(6, users.Count));
                var checkers = users.OrderBy(x => Random.Shared.Next()).Take(checkInCount);
                foreach (var checker in checkers)
                {
                    _context.CheckIns.Add(new CheckIn
                    {
                        LocationId = location.Id,
                        UserId = checker.Id,
                        CheckInTime = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 50)),
                        Comment = "Just dropped off my car here! #Fully2Car",
                        CreatedBy = checker.Id.ToString()
                    });
                }
            }
            await _context.SaveChangesAsync();
        }
    }
}
