using Domain.Entities.Shared.Notifications;

namespace Infrastructure.Data.Seeds.Shared;

public class NotificationSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<NotificationSeeder> _logger;
    private readonly Random _random = new();

    public NotificationSeeder(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<NotificationSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            await SeedNotificationsAsync();
            await SeedEmailLogsAsync();
            await SeedPushNotificationLogsAsync();
            await SeedNotificationPreferencesAsync();
            
            await _context.SaveChangesAsync();
            _logger.LogInformation("Notification seed data created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding notification data");
            throw;
        }
    }

    private async Task SeedNotificationsAsync()
    {
        var users = await _context.Users.ToListAsync();
        var posts = await _context.Posts.Take(50).ToListAsync();
        
        if (!users.Any()) return;

        var notifications = new List<Notification>();
        var notificationTypes = GetNotificationTypes();
        var startDate = DateTime.UtcNow.AddDays(-30);

        foreach (var user in users)
        {
            var notificationCount = _random.Next(10, 50);
            
            for (int i = 0; i < notificationCount; i++)
            {
                var notificationType = notificationTypes[_random.Next(notificationTypes.Length)];
                var createdDate = GetRandomDateInRange(startDate, 30);
                var relatedPost = posts.Any() ? posts[_random.Next(posts.Count)] : null;

                var notification = new Notification
                {
                    UserId = user.Id,
                    Type = notificationType.Type,
                    Title = notificationType.Title,
                    Message = GenerateNotificationMessage(notificationType.Type, user.FirstName),
                    IsRead = _random.NextDouble() > 0.4, // 60% read
                    Priority = notificationType.Priority,
                    Category = notificationType.Category,
                    RelatedEntityId = relatedPost?.Id,
                    RelatedEntityType = relatedPost != null ? "Post" : null,
                    CreatedAt = createdDate,
                    ReadAt = _random.NextDouble() > 0.4 ? createdDate.AddMinutes(_random.Next(5, 1440)) : null,
                    ExpiresAt = createdDate.AddDays(30)
                };

                notifications.Add(notification);
            }
        }

        await _context.Notifications.AddRangeAsync(notifications);
    }

    private async Task SeedEmailLogsAsync()
    {
        var users = await _context.Users.ToListAsync();
        if (!users.Any()) return;

        var emailLogs = new List<EmailLog>();
        var emailTypes = GetEmailTypes();
        var startDate = DateTime.UtcNow.AddDays(-60);

        for (int i = 0; i < 500; i++)
        {
            var recipient = users[_random.Next(users.Count)];
            var emailType = emailTypes[_random.Next(emailTypes.Length)];
            var sentDate = GetRandomDateInRange(startDate, 60);

            var emailLog = new EmailLog
            {
                RecipientEmail = recipient.Email!,
                RecipientName = $"{recipient.FirstName} {recipient.LastName}",
                Subject = emailType.Subject,
                EmailType = emailType.Type,
                Status = GetEmailStatus(),
                SentAt = sentDate,
                DeliveredAt = GetEmailDeliveryTime(sentDate),
                OpenedAt = GetEmailOpenTime(sentDate),
                ClickedAt = GetEmailClickTime(sentDate),
                Provider = GetEmailProvider(),
                TemplateId = emailType.TemplateId,
                CreatedAt = sentDate
            };

            emailLogs.Add(emailLog);
        }

        await _context.EmailLogs.AddRangeAsync(emailLogs);
    }

    private async Task SeedPushNotificationLogsAsync()
    {
        var users = await _context.Users.ToListAsync();
        if (!users.Any()) return;

        var pushLogs = new List<PushNotificationLog>();
        var pushTypes = GetPushNotificationTypes();
        var startDate = DateTime.UtcNow.AddDays(-30);

        for (int i = 0; i < 800; i++)
        {
            var recipient = users[_random.Next(users.Count)];
            var pushType = pushTypes[_random.Next(pushTypes.Length)];
            var sentDate = GetRandomDateInRange(startDate, 30);

            var pushLog = new PushNotificationLog
            {
                UserId = recipient.Id,
                DeviceToken = GenerateDeviceToken(),
                Title = pushType.Title,
                Message = pushType.Message,
                Type = pushType.Type,
                Status = GetPushStatus(),
                Platform = GetDevicePlatform(),
                SentAt = sentDate,
                DeliveredAt = GetPushDeliveryTime(sentDate),
                ClickedAt = GetPushClickTime(sentDate),
                CreatedAt = sentDate
            };

            pushLogs.Add(pushLog);
        }

        await _context.PushNotificationLogs.AddRangeAsync(pushLogs);
    }

    private async Task SeedNotificationPreferencesAsync()
    {
        var users = await _context.Users.ToListAsync();
        if (!users.Any()) return;

        var preferences = new List<NotificationPreference>();
        var preferenceTypes = GetNotificationPreferenceTypes();

        foreach (var user in users)
        {
            foreach (var prefType in preferenceTypes)
            {
                var preference = new NotificationPreference
                {
                    UserId = user.Id,
                    NotificationType = prefType.Type,
                    EmailEnabled = _random.NextDouble() > 0.3, // 70% enabled
                    PushEnabled = _random.NextDouble() > 0.2, // 80% enabled
                    SmsEnabled = _random.NextDouble() > 0.7, // 30% enabled
                    InAppEnabled = _random.NextDouble() > 0.1, // 90% enabled
                    Frequency = prefType.DefaultFrequency,
                    CreatedAt = GetRandomDateInRange(DateTime.UtcNow.AddMonths(-6), 180),
                    UpdatedAt = GetRandomDateInRange(DateTime.UtcNow.AddDays(-30), 30)
                };

                preferences.Add(preference);
            }
        }

        await _context.NotificationPreferences.AddRangeAsync(preferences);
    }

    private DateTime GetRandomDateInRange(DateTime startDate, int daysRange)
    {
        return startDate.AddDays(_random.Next(0, daysRange));
    }

    private (string Type, string Title, string Priority, string Category)[] GetNotificationTypes()
    {
        return new[]
        {
            ("PostLike", "New Like", "Low", "Social"),
            ("PostComment", "New Comment", "Medium", "Social"),
            ("PostShare", "Post Shared", "Low", "Social"),
            ("GroupInvite", "Group Invitation", "Medium", "Social"),
            ("FriendRequest", "Friend Request", "Medium", "Social"),
            ("MessageReceived", "New Message", "High", "Communication"),
            ("BookingConfirmed", "Booking Confirmed", "High", "Booking"),
            ("BookingReminder", "Booking Reminder", "High", "Booking"),
            ("PaymentReceived", "Payment Received", "High", "Payment"),
            ("SystemMaintenance", "System Maintenance", "Medium", "System"),
            ("SecurityAlert", "Security Alert", "High", "Security"),
            ("WeeklyDigest", "Weekly Digest", "Low", "Digest"),
            ("PromotionalOffer", "Special Offer", "Low", "Marketing")
        };
    }

    private string GenerateNotificationMessage(string type, string userName)
    {
        return type switch
        {
            "PostLike" => $"Someone liked your post!",
            "PostComment" => $"Someone commented on your post.",
            "PostShare" => $"Your post was shared by another user.",
            "GroupInvite" => $"You've been invited to join a group.",
            "FriendRequest" => $"You have a new friend request.",
            "MessageReceived" => $"You have a new message.",
            "BookingConfirmed" => $"Your booking has been confirmed.",
            "BookingReminder" => $"Reminder: You have a booking tomorrow.",
            "PaymentReceived" => $"Payment received successfully.",
            "SystemMaintenance" => $"Scheduled maintenance tonight from 2-4 AM.",
            "SecurityAlert" => $"Unusual login activity detected.",
            "WeeklyDigest" => $"Here's your weekly activity summary.",
            "PromotionalOffer" => $"Special discount available for premium services!",
            _ => $"You have a new notification."
        };
    }

    private (string Type, string Subject, string TemplateId)[] GetEmailTypes()
    {
        return new[]
        {
            ("Welcome", "Welcome to Our Platform!", "welcome-001"),
            ("PasswordReset", "Reset Your Password", "password-reset-001"),
            ("EmailVerification", "Verify Your Email Address", "email-verify-001"),
            ("BookingConfirmation", "Booking Confirmation", "booking-confirm-001"),
            ("PaymentReceipt", "Payment Receipt", "payment-receipt-001"),
            ("WeeklyNewsletter", "Weekly Newsletter", "newsletter-001"),
            ("SecurityAlert", "Security Alert", "security-alert-001"),
            ("AccountSuspension", "Account Suspended", "account-suspend-001"),
            ("PromotionalOffer", "Special Offer Just for You!", "promo-001"),
            ("SystemUpdate", "System Update Notification", "system-update-001")
        };
    }

    private (string Type, string Title, string Message)[] GetPushNotificationTypes()
    {
        return new[]
        {
            ("PostLike", "New Like", "Someone liked your post!"),
            ("PostComment", "New Comment", "New comment on your post"),
            ("MessageReceived", "New Message", "You have a new message"),
            ("BookingReminder", "Booking Reminder", "Your appointment is tomorrow"),
            ("PaymentReceived", "Payment Received", "Payment processed successfully"),
            ("FriendRequest", "Friend Request", "New friend request received"),
            ("GroupInvite", "Group Invitation", "You're invited to join a group"),
            ("SecurityAlert", "Security Alert", "Unusual account activity detected"),
            ("PromotionalOffer", "Special Offer", "Limited time discount available!"),
            ("SystemUpdate", "App Update", "New features available in latest update")
        };
    }

    private (string Type, string DefaultFrequency)[] GetNotificationPreferenceTypes()
    {
        return new[]
        {
            ("PostLike", "Immediate"),
            ("PostComment", "Immediate"),
            ("MessageReceived", "Immediate"),
            ("BookingReminder", "Immediate"),
            ("PaymentReceived", "Immediate"),
            ("FriendRequest", "Immediate"),
            ("GroupInvite", "Immediate"),
            ("SecurityAlert", "Immediate"),
            ("WeeklyDigest", "Weekly"),
            ("PromotionalOffer", "Daily"),
            ("SystemUpdate", "Weekly")
        };
    }

    private string GetEmailStatus()
    {
        var statuses = new[] { "Sent", "Sent", "Sent", "Delivered", "Delivered", "Bounced", "Failed" };
        return statuses[_random.Next(statuses.Length)];
    }

    private DateTime? GetEmailDeliveryTime(DateTime sentDate)
    {
        return _random.NextDouble() > 0.1 ? sentDate.AddMinutes(_random.Next(1, 30)) : null;
    }

    private DateTime? GetEmailOpenTime(DateTime sentDate)
    {
        return _random.NextDouble() > 0.6 ? sentDate.AddMinutes(_random.Next(30, 1440)) : null;
    }

    private DateTime? GetEmailClickTime(DateTime sentDate)
    {
        return _random.NextDouble() > 0.8 ? sentDate.AddMinutes(_random.Next(60, 1440)) : null;
    }

    private string GetEmailProvider()
    {
        var providers = new[] { "SendGrid", "Mailgun", "Amazon SES", "Postmark" };
        return providers[_random.Next(providers.Length)];
    }

    private string GetPushStatus()
    {
        var statuses = new[] { "Sent", "Sent", "Delivered", "Delivered", "Failed", "Expired" };
        return statuses[_random.Next(statuses.Length)];
    }

    private string GetDevicePlatform()
    {
        var platforms = new[] { "iOS", "Android", "Web" };
        return platforms[_random.Next(platforms.Length)];
    }

    private string GenerateDeviceToken()
    {
        return Guid.NewGuid().ToString("N");
    }

    private DateTime? GetPushDeliveryTime(DateTime sentDate)
    {
        return _random.NextDouble() > 0.05 ? sentDate.AddSeconds(_random.Next(1, 300)) : null;
    }

    private DateTime? GetPushClickTime(DateTime sentDate)
    {
        return _random.NextDouble() > 0.7 ? sentDate.AddMinutes(_random.Next(1, 60)) : null;
    }
}