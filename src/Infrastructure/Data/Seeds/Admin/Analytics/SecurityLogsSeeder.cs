using Domain.Entities.Identity;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Analytics;

public class SecurityLogsSeeder
{
    private readonly ILogger<SecurityLogsSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public SecurityLogsSeeder(ILogger<SecurityLogsSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Security Logs...");

            await SeedSecurityLogsAsync();

            _logger.LogInformation("Security Logs seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Security Logs.");
            throw;
        }
    }

    private async Task SeedSecurityLogsAsync()
    {
        if (await _context.SecurityLogs.AnyAsync())
        {
            _logger.LogInformation("Security logs already exist, skipping seeding");
            return;
        }

        var users = await _context.Users.ToListAsync();
        if (!users.Any()) return;

        var securityLogs = new List<SecurityLog>();
        var eventTypes = new[] 
        { 
            "Login", "Logout", "FailedLogin", "PasswordChange", "SuspiciousActivity",
            "AccountLocked", "PasswordReset", "TwoFactorEnabled", "TwoFactorDisabled",
            "ProfileUpdate", "EmailChange", "SessionExpired", "ConcurrentLogin"
        };
        var random = new Random();
        var startDate = DateTime.UtcNow.AddMonths(-2);

        for (int i = 0; i < 500; i++)
        {
            var randomUser = users[random.Next(users.Count)];
            var eventType = eventTypes[random.Next(eventTypes.Length)];
            var logDate = startDate.AddDays(random.Next(60));

            var securityLog = new SecurityLog
            {
                UserId = ShouldHaveUserId(eventType) ? randomUser.Id : Guid.Empty,
                EventType = eventType,
                Description = GenerateSecurityLogDetails(eventType),
                IpAddress = GenerateRandomIpAddress(random),
                UserAgent = GenerateUserAgent(random),
                Timestamp = logDate,
                IsSuccessful = !eventType.Contains("Failed") && !eventType.Contains("Suspicious") && !eventType.Contains("Locked"),
                AdditionalData = $"Severity:{GetSecurityLogSeverity(eventType)}"
            };

            securityLogs.Add(securityLog);
        }

        await _context.SecurityLogs.AddRangeAsync(securityLogs);
        _logger.LogInformation($"Added {securityLogs.Count} security logs.");
    }

    private bool ShouldHaveUserId(string eventType)
    {
        var eventsWithoutUser = new[] { "SuspiciousActivity" };
        return !eventsWithoutUser.Contains(eventType);
    }

    private string GenerateSecurityLogDetails(string eventType)
    {
        return eventType switch
        {
            "Login" => "User successfully logged in",
            "Logout" => "User logged out",
            "FailedLogin" => "Failed login attempt - incorrect password",
            "PasswordChange" => "User changed password successfully",
            "SuspiciousActivity" => "Multiple failed login attempts detected from same IP",
            "AccountLocked" => "Account locked due to multiple failed attempts",
            "PasswordReset" => "Password reset requested and completed",
            "TwoFactorEnabled" => "Two-factor authentication enabled",
            "TwoFactorDisabled" => "Two-factor authentication disabled",
            "ProfileUpdate" => "User profile information updated",
            "EmailChange" => "Email address changed",
            "SessionExpired" => "User session expired",
            "ConcurrentLogin" => "Multiple concurrent sessions detected",
            _ => "Security event logged"
        };
    }

    private string GetSecurityLogSeverity(string eventType)
    {
        return eventType switch
        {
            "Login" or "Logout" or "ProfileUpdate" => "Info",
            "PasswordChange" or "PasswordReset" or "TwoFactorEnabled" => "Info",
            "FailedLogin" or "SuspiciousActivity" or "AccountLocked" => "Warning",
            "ConcurrentLogin" or "TwoFactorDisabled" => "Warning",
            "SessionExpired" => "Info",
            _ => "Info"
        };
    }

    private string GenerateRandomIpAddress(Random random)
    {
        return $"{random.Next(1, 255)}.{random.Next(1, 255)}.{random.Next(1, 255)}.{random.Next(1, 255)}";
    }

    private string GenerateUserAgent(Random random)
    {
        var userAgents = new[]
        {
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
        };
        return userAgents[random.Next(userAgents.Length)];
    }
}