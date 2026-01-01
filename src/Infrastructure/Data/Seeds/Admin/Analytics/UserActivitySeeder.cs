using Domain.Entities.Admin.Analytics;
using Domain.Entities.Community.Posts;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Analytics;

public class UserActivitySeeder
{
    private readonly ILogger<UserActivitySeeder> _logger;
    private readonly ApplicationDbContext _context;
    private readonly Random _random = new();

    public UserActivitySeeder(ILogger<UserActivitySeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding User Activity data...");

            await SeedUserSessionsAsync();
            await SeedUserActivitiesAsync();
            await SeedUserPreferencesAsync();
            
            await _context.SaveChangesAsync();
            _logger.LogInformation("User activity data seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding user activity data.");
            throw;
        }
    }

    private async Task SeedUserSessionsAsync()
    {
        if (await _context.UserSessions.AnyAsync())
        {
            _logger.LogInformation("User sessions already exist, skipping seeding");
            return;
        }

        var users = await _context.Users.ToListAsync();
        if (!users.Any()) return;

        var sessions = new List<UserSession>();
        var startDate = DateTime.UtcNow.AddDays(-60);

        foreach (var user in users)
        {
            var sessionCount = _random.Next(10, 35); // 10-35 sessions per user in last 60 days
            
            for (int i = 0; i < sessionCount; i++)
            {
                var sessionStart = GetRandomDateInRange(startDate, 60);
                var sessionDuration = _random.Next(5, 240); // 5 minutes to 4 hours
                var sessionEnd = sessionStart.AddMinutes(sessionDuration);
                var isActive = sessionEnd > DateTime.UtcNow.AddHours(-2); // Active if ended within last 2 hours

                var session = new UserSession
                {
                    UserId = user.Id,
                    SessionId = Guid.NewGuid().ToString(),
                    IpAddress = GenerateRandomIpAddress(),
                    UserAgent = GenerateUserAgent(),
                    CreatedAt = sessionStart,
                    LastActivity = sessionEnd,
                    ExpiresAt = sessionStart.AddHours(24),
                    IsActive = isActive
                };

                sessions.Add(session);
            }
        }

        await _context.UserSessions.AddRangeAsync(sessions);
        _logger.LogInformation($"Added {sessions.Count} user sessions.");
    }

    private async Task SeedUserActivitiesAsync()
    {
        if (await _context.UserActivities.AnyAsync())
        {
            _logger.LogInformation("User activities already exist, skipping seeding");
            return;
        }

        // Create user activity logs for analytics
        var users = await _context.Users.ToListAsync();
        var posts = await _context.Posts.ToListAsync();
        
        if (!users.Any()) return;

        var activities = new List<UserActivity>();
        var activityTypes = GetActivityTypes();
        var startDate = DateTime.UtcNow.AddDays(-30);

        foreach (var user in users)
        {
            var activityCount = _random.Next(20, 100);
            
            for (int i = 0; i < activityCount; i++)
            {
                var activityType = activityTypes[_random.Next(activityTypes.Length)];
                var activityDate = GetRandomDateInRange(startDate, 30);
                var relatedPost = posts.Any() ? posts[_random.Next(posts.Count)] : null;

                var activity = new UserActivity
                {
                    UserId = user.Id,
                    ActivityType = activityType,
                    Description = GenerateActivityDetails(activityType),
                    Timestamp = activityDate,
                    IpAddress = GenerateRandomIpAddress(),
                    UserAgent = GenerateUserAgent(),
                    AdditionalData = GetEntityId(activityType, relatedPost)?.ToString()
                };

                activities.Add(activity);
            }
        }

        await _context.UserActivities.AddRangeAsync(activities);
        _logger.LogInformation($"Added {activities.Count} user activities.");
    }

    private async Task SeedUserPreferencesAsync()
    {
        if (await _context.UserPreferences.AnyAsync())
        {
            _logger.LogInformation("User preferences already exist, skipping seeding");
            return;
        }

        var users = await _context.Users.ToListAsync();
        if (!users.Any()) return;

        var preferences = new List<UserPreference>();
        var preferenceTypes = GetPreferenceTypes();

        foreach (var user in users)
        {
            foreach (var prefType in preferenceTypes)
            {
                var preference = new UserPreference
                {
                    UserId = user.Id,
                    PreferenceKey = prefType.Key,
                    PreferenceValue = prefType.Value[_random.Next(prefType.Value.Length)],
                    Category = "User Settings",
                    CreatedAt = GetRandomDateInRange(DateTime.UtcNow.AddMonths(-6), 180),
                    UpdatedAt = GetRandomDateInRange(DateTime.UtcNow.AddDays(-30), 30)
                };

                preferences.Add(preference);
            }
        }

        await _context.UserPreferences.AddRangeAsync(preferences);
        _logger.LogInformation($"Added {preferences.Count} user preferences.");
    }

    private string GenerateRandomIpAddress()
    {
        return $"{_random.Next(1, 255)}.{_random.Next(1, 255)}.{_random.Next(1, 255)}.{_random.Next(1, 255)}";
    }

    private string GenerateUserAgent()
    {
        var userAgents = new[]
        {
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0"
        };
        return userAgents[_random.Next(userAgents.Length)];
    }

    private DateTime GetRandomDateInRange(DateTime startDate, int daysRange)
    {
        return startDate.AddDays(_random.Next(0, daysRange));
    }

    private string[] GetActivityTypes()
    {
        return new[]
        {
            "PostView", "PostLike", "PostComment", "PostShare",
            "GroupJoin", "GroupLeave", "GroupPost", "GroupComment",
            "ProfileView", "ProfileUpdate", "FollowUser", "UnfollowUser",
            "SearchPerformed", "FilterApplied", "PageVisit", "FeatureUsed",
            "NotificationRead", "MessageSent", "MessageRead", "FileUpload"
        };
    }

    private Guid? GetEntityId(string activityType, Post? relatedPost)
    {
        return activityType switch
        {
            "PostView" or "PostLike" or "PostComment" or "PostShare" => relatedPost?.Id,
            _ => null
        };
    }

    private string GenerateActivityDetails(string activityType)
    {
        return activityType switch
        {
            "PostView" => "User viewed a post",
            "PostLike" => "User liked a post",
            "PostComment" => "User commented on a post",
            "PostShare" => "User shared a post",
            "GroupJoin" => "User joined a group",
            "GroupLeave" => "User left a group",
            "ProfileView" => "User viewed a profile",
            "ProfileUpdate" => "User updated their profile",
            "SearchPerformed" => "User performed a search",
            "FilterApplied" => "User applied search filters",
            "NotificationRead" => "User read a notification",
            "MessageSent" => "User sent a message",
            "MessageRead" => "User read a message",
            _ => $"User performed {activityType.ToLower()}"
        };
    }

    private Dictionary<string, string[]> GetPreferenceTypes()
    {
        return new Dictionary<string, string[]>
        {
            { "Theme", new[] { "Light", "Dark", "Auto" } },
            { "Language", new[] { "English", "Arabic", "French", "Spanish" } },
            { "NotificationEmail", new[] { "All", "Important", "None" } },
            { "NotificationPush", new[] { "All", "Important", "None" } },
            { "Privacy", new[] { "Public", "Friends", "Private" } },
            { "ContentFilter", new[] { "All", "Moderate", "Strict" } },
            { "AutoPlay", new[] { "Always", "WiFiOnly", "Never" } },
            { "DataSaver", new[] { "Enabled", "Disabled" } }
        };
    }
}