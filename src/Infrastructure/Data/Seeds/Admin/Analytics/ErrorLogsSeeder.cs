using Domain.Entities.Admin.Analytics;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Analytics;

public class ErrorLogsSeeder
{
    private readonly ILogger<ErrorLogsSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public ErrorLogsSeeder(ILogger<ErrorLogsSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Application Error Logs...");

            await SeedApplicationErrorLogsAsync();

            _logger.LogInformation("Application Error Logs seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Application Error Logs.");
            throw;
        }
    }

    private async Task SeedApplicationErrorLogsAsync()
    {
        if (await _context.ApplicationErrorLogs.AnyAsync())
        {
            _logger.LogInformation("Application error logs already exist. Skipping seeding.");
            return;
        }

        var errorLogs = new List<ApplicationErrorLog>
        {
            new()
            {
                ErrorType = "NullReferenceException",
                Message = "Object reference not set to an instance of an object",
                StackTrace = "at Application.Services.UserService.GetUser(Guid id) in UserService.cs:line 45",
                Source = "Application.Services",
                Timestamp = DateTime.UtcNow.AddDays(-2),
                Severity = "High"
            },
            new()
            {
                ErrorType = "ValidationException",
                Message = "Email address is required",
                StackTrace = "at Application.Validators.UserValidator.Validate(User user) in UserValidator.cs:line 23",
                Source = "Application.Validators",
                Timestamp = DateTime.UtcNow.AddDays(-1),
                Severity = "Medium"
            },
            new()
            {
                ErrorType = "TimeoutException",
                Message = "Database connection timeout",
                StackTrace = "at Infrastructure.Data.Repository.GetAsync(Guid id) in Repository.cs:line 67",
                Source = "Infrastructure.Data",
                Timestamp = DateTime.UtcNow.AddHours(-6),
                Severity = "High"
            },
            new()
            {
                ErrorType = "ArgumentException",
                Message = "Invalid argument provided to method",
                StackTrace = "at Application.Services.PostService.CreatePost(CreatePostRequest request) in PostService.cs:line 89",
                Source = "Application.Services",
                Timestamp = DateTime.UtcNow.AddHours(-12),
                Severity = "Medium"
            },
            new()
            {
                ErrorType = "UnauthorizedAccessException",
                Message = "User does not have permission to access this resource",
                StackTrace = "at WebAPI.Controllers.AdminController.GetUsers() in AdminController.cs:line 34",
                Source = "WebAPI.Controllers",
                Timestamp = DateTime.UtcNow.AddHours(-18),
                Severity = "High"
            }
        };

        await _context.ApplicationErrorLogs.AddRangeAsync(errorLogs);
        _logger.LogInformation($"Added {errorLogs.Count} application error logs.");
    }
}