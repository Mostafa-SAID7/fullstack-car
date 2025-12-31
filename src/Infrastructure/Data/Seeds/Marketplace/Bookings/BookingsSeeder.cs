using Domain.Entities.Marketplace;

namespace Infrastructure.Data.Seeds.Marketplace.Bookings;

public class BookingsSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<BookingsSeeder> _logger;
    private readonly Random _random = new();

    public BookingsSeeder(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<BookingsSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            var users = await _context.Users.ToListAsync();
            var serviceProviders = await _context.ServiceProviders.ToListAsync();
            
            if (!users.Any() || !serviceProviders.Any()) return;

            var bookings = new List<ServiceBooking>();
            var startDate = DateTime.UtcNow.AddMonths(-6);

            for (int i = 0; i < 300; i++)
            {
                var customer = users[_random.Next(users.Count)];
                var provider = serviceProviders[_random.Next(serviceProviders.Count)];
                var bookingDate = GetRandomDateInRange(startDate, 180);
                var serviceDate = bookingDate.AddDays(_random.Next(1, 30));

                var booking = new ServiceBooking
                {
                    BookingNumber = $"BK{DateTime.UtcNow.Year}{i + 1:D6}",
                    CustomerId = customer.Id,
                    ServiceProviderId = provider.Id,
                    ServiceName = GetRandomServiceName(),
                    BookingDate = bookingDate,
                    ScheduledDate = serviceDate.Date,
                    ScheduledTime = new TimeSpan(_random.Next(8, 18), 0, 0),
                    ServiceDate = serviceDate,
                    Status = GetBookingStatus(serviceDate),
                    TotalAmount = GenerateBookingAmount(),
                    Currency = "USD",
                    PaymentStatus = GetPaymentStatus(),
                    Notes = GenerateBookingNotes(),
                    CreatedAt = bookingDate,
                    UpdatedAt = GetRandomDateInRange(bookingDate, (DateTime.UtcNow - bookingDate).Days)
                };

                bookings.Add(booking);
            }

            await _context.ServiceBookings.AddRangeAsync(bookings);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Bookings seed data created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding bookings data");
            throw;
        }
    }

    private DateTime GetRandomDateInRange(DateTime startDate, int daysRange)
    {
        return startDate.AddDays(_random.Next(0, daysRange));
    }

    private string GetRandomServiceName()
    {
        var services = new[] { "Oil Change", "Brake Inspection", "Tire Rotation", "Engine Diagnostic", "Car Wash" };
        return services[_random.Next(services.Length)];
    }

    private Domain.Enums.Marketplace.BookingStatus GetBookingStatus(DateTime serviceDate)
    {
        if (serviceDate > DateTime.UtcNow)
            return Domain.Enums.Marketplace.BookingStatus.Pending;
        
        var statuses = new[] { 
            Domain.Enums.Marketplace.BookingStatus.Completed, 
            Domain.Enums.Marketplace.BookingStatus.Completed, 
            Domain.Enums.Marketplace.BookingStatus.Completed, 
            Domain.Enums.Marketplace.BookingStatus.Cancelled 
        };
        return statuses[_random.Next(statuses.Length)];
    }

    private decimal GenerateBookingAmount()
    {
        return _random.Next(50, 500);
    }

    private string GetPaymentStatus()
    {
        var statuses = new[] { "Paid", "Paid", "Paid", "Pending", "Failed" };
        return statuses[_random.Next(statuses.Length)];
    }

    private string GenerateBookingNotes()
    {
        var notes = new[]
        {
            "Customer requested early morning appointment",
            "Vehicle needs special attention",
            "Regular customer - VIP service",
            "First time customer",
            "Urgent repair needed",
            "Routine maintenance service"
        };
        return notes[_random.Next(notes.Length)];
    }
}