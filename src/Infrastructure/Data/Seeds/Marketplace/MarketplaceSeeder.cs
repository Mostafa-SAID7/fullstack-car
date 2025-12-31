using Infrastructure.Data.Seeds.Marketplace.Providers;
using Infrastructure.Data.Seeds.Marketplace.Services;
using Infrastructure.Data.Seeds.Marketplace.Bookings;

using Domain.Entities.Marketplace;

namespace Infrastructure.Data.Seeds.Marketplace;

public class MarketplaceSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<MarketplaceSeeder> _logger;

    public MarketplaceSeeder(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<MarketplaceSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Starting marketplace data seeding...");

            // Seed in dependency order
            await SeedServiceProvidersAsync();
            await SeedServicesAsync();
            await SeedBookingsAsync();
            await SeedReviewsAsync();
            await SeedPaymentsAsync();
            
            _logger.LogInformation("Marketplace seed data created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding marketplace data");
            throw;
        }
    }

    private async Task SeedServiceProvidersAsync()
    {
        var seeder = new ServiceProvidersSeeder(_context, _userManager, _logger);
        await seeder.SeedAsync();
    }

    private async Task SeedServicesAsync()
    {
        var seeder = new ServicesSeeder(_context, _userManager, _logger);
        await seeder.SeedAsync();
    }

    private async Task SeedBookingsAsync()
    {
        var seeder = new BookingsSeeder(_context, _userManager, _logger);
        await seeder.SeedAsync();
    }

    private async Task SeedReviewsAsync()
    {
        var users = await _context.Users.ToListAsync();
        var serviceProviders = await _context.ServiceProviders.ToListAsync();
        
        if (!users.Any() || !serviceProviders.Any()) return;

        var reviews = new List<ServiceReview>();
        var random = new Random();

        foreach (var provider in serviceProviders)
        {
            var reviewCount = random.Next(3, 15);
            var reviewers = users.OrderBy(x => random.Next()).Take(reviewCount);

            foreach (var reviewer in reviewers)
            {
                var reviewDate = GetRandomDateInRange(provider.CreatedAt.AddDays(7), DateTime.UtcNow);
                
                var review = new ServiceReview
                {
                    ServiceProviderId = provider.Id,
                    ReviewerId = reviewer.Id,
                    Rating = random.Next(3, 6), // 3 to 5 stars
                    Comment = GenerateReviewComment(),
                    CreatedAt = reviewDate,
                    UpdatedAt = reviewDate,
                    IsVerified = random.NextDouble() > 0.2 // 80% verified
                };

                reviews.Add(review);
            }
        }

        await _context.ServiceReviews.AddRangeAsync(reviews);
        await _context.SaveChangesAsync();
    }

    private async Task SeedPaymentsAsync()
    {
        var payments = new List<PaymentTransaction>();
        var startDate = DateTime.UtcNow.AddMonths(-6);
        var random = new Random();

        for (int i = 0; i < 250; i++)
        {
            var transactionDate = GetRandomDateInRange(startDate, 180);
            
            var payment = new PaymentTransaction
            {
                TransactionId = Guid.NewGuid().ToString(),
                Amount = GeneratePaymentAmount(),
                Currency = "USD",
                PaymentMethod = GetPaymentMethod(),
                Status = GetTransactionStatus(),
                ProcessedAt = transactionDate,
                CreatedAt = transactionDate,
                UpdatedAt = transactionDate
            };

            payments.Add(payment);
        }

        await _context.PaymentTransactions.AddRangeAsync(payments);
        await _context.SaveChangesAsync();
    }

    private DateTime GetRandomDateInRange(DateTime startDate, int daysRange)
    {
        var random = new Random();
        return startDate.AddDays(random.Next(0, daysRange));
    }

    private DateTime GetRandomDateInRange(DateTime startDate, DateTime endDate)
    {
        var random = new Random();
        var range = endDate - startDate;
        var randomDays = random.Next(0, (int)range.TotalDays);
        return startDate.AddDays(randomDays);
    }

    private string GenerateReviewComment()
    {
        var comments = new[]
        {
            "Excellent service! Very professional and quick.",
            "Great experience, will definitely come back.",
            "Fair pricing and quality work.",
            "Friendly staff and clean facility.",
            "Quick turnaround time, very satisfied.",
            "Professional service, highly recommended.",
            "Good value for money, quality service.",
            "Knowledgeable technicians, great work.",
            "Clean facility and honest pricing.",
            "Reliable service, always on time."
        };
        var random = new Random();
        return comments[random.Next(comments.Length)];
    }

    private decimal GeneratePaymentAmount()
    {
        var random = new Random();
        return random.Next(25, 600);
    }

    private string GetPaymentMethod()
    {
        var methods = new[] { "Credit Card", "Debit Card", "Cash", "PayPal", "Bank Transfer" };
        var random = new Random();
        return methods[random.Next(methods.Length)];
    }

    private string GetTransactionStatus()
    {
        var statuses = new[] { "Completed", "Completed", "Completed", "Pending", "Failed", "Refunded" };
        var random = new Random();
        return statuses[random.Next(statuses.Length)];
    }
}
