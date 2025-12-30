using Domain.Entities.Community.Reviews;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Community.Reviews
{
    public class ReviewsSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ReviewsSeeder> _logger;

        public ReviewsSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<ReviewsSeeder> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            if (await _context.Reviews.AnyAsync()) return;

            var user = await _userManager.FindByEmailAsync("user@localhost");
            if (user == null) return;

            var reviews = new List<Review>
            {
                new Review
                {
                    Title = "2024 Toyota Camry",
                    Content = "Reliable, fuel efficient, but a bit boring to drive. Perfect for daily commuting though.",
                    Rating = 4,
                    CarBrand = "Toyota",
                    CarModel = "Camry",
                    CarYear = 2024,
                    UserId = user.Id,
                    CreatedBy = user.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new Review
                {
                    Title = "2023 BMW M3 Competition",
                    Content = "An absolute beast on the track. The S58 engine is a masterpiece. Stiff ride for daily driving, but worth every penny for the performance.",
                    Rating = 5,
                    CarBrand = "BMW",
                    CarModel = "M3",
                    CarYear = 2023,
                    UserId = user.Id,
                    CreatedBy = user.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                }
            };

            // Additional Reviews from Community Users
            var mike = await _userManager.FindByEmailAsync("mike@fully2car.com");
            var yasmine = await _userManager.FindByEmailAsync("yasmine@fully2car.com");
            var laura = await _userManager.FindByEmailAsync("laura@fully2car.com");
            var khalid = await _userManager.FindByEmailAsync("khalid@fully2car.com");

            if (mike != null)
            {
                reviews.Add(new Review
                {
                    Title = "Porsche 911 GT3 (992)",
                    Content = "The most connected driving experience I've ever had. That 9000rpm redline is addictive. Not a fan of the new door handles though.",
                    Rating = 5,
                    CarBrand = "Porsche",
                    CarModel = "911 GT3",
                    CarYear = 2023,
                    UserId = mike.Id,
                    CreatedBy = mike.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                });
            }

            if (yasmine != null)
            {
                reviews.Add(new Review
                {
                    Title = "Tesla Model S Plaid",
                    Content = "Mind-bending acceleration. The tech is lightyears ahead, but build quality still has some small gaps. Still, it's the future.",
                    Rating = 4,
                    CarBrand = "Tesla",
                    CarModel = "Model S",
                    CarYear = 2024,
                    UserId = yasmine.Id,
                    CreatedBy = yasmine.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                });
            }

            if (laura != null)
            {
                reviews.Add(new Review
                {
                    Title = "Mercedes-Maybach S-Class",
                    Content = "The pinnacle of automotive luxury. It feels more like a private jet than a car. The rear seat experience is unmatched.",
                    Rating = 5,
                    CarBrand = "Mercedes-Maybach",
                    CarModel = "S-Class",
                    CarYear = 2024,
                    UserId = laura.Id,
                    CreatedBy = laura.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                });
            }

            if (khalid != null)
            {
                reviews.Add(new Review
                {
                    Title = "1967 Ford Mustang Fastback",
                    Content = "A true icon. The sound of the V8 is music to my ears. Handling is agricultural by modern standards, but the soul is unmatched.",
                    Rating = 5,
                    CarBrand = "Ford",
                    CarModel = "Mustang",
                    CarYear = 1967,
                    UserId = khalid.Id,
                    CreatedBy = khalid.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                });
            }

            await _context.Reviews.AddRangeAsync(reviews);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded reviews");
        }
    }
}
