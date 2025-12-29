using Domain.Entities.Community.Reviews;
using Infrastructure.Identity;
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
                    Content = "An absolute beast on the track. The S58 engine is a masterpiece. Stiff ride for daily driving.",
                    Rating = 5,
                    CarBrand = "BMW",
                    CarModel = "M3",
                    CarYear = 2023,
                    UserId = user.Id,
                    CreatedBy = user.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                }
            };

            await _context.Reviews.AddRangeAsync(reviews);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded reviews");
        }
    }
}
