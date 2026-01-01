using Domain.Entities.Shared.Notifications;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class NotificationSeeder
    {
        private readonly ILogger<NotificationSeeder> _logger;
        private readonly ApplicationDbContext _context;

        public NotificationSeeder(ILogger<NotificationSeeder> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task SeedNotificationsAsync()
        {
            _logger.LogInformation("Seeding notifications...");

            var users = await _context.Users.ToListAsync();
            var posts = await _context.Posts.ToListAsync();
            if (!users.Any() || !posts.Any()) return;

            var notificationTypes = new[]
            {
                ("PostLike", "Someone liked your post", "Your post received a new like!"),
                ("CommentAdded", "New comment on your post", "Someone commented on your post"),
                ("GroupInvite", "Group invitation", "You've been invited to join a group"),
                ("FriendRequest", "Friend request", "Someone sent you a friend request"),
                ("PostMention", "You were mentioned", "Someone mentioned you in a post"),
                ("SystemUpdate", "System notification", "Important system update available")
            };

            foreach (var user in users.Take(8)) // Add notifications for first 8 users
            {
                var notificationCount = Random.Shared.Next(2, 8);
                for (int i = 0; i < notificationCount; i++)
                {
                    var (type, title, message) = notificationTypes[Random.Shared.Next(notificationTypes.Length)];
                    var sourceUser = users[Random.Shared.Next(users.Count)];
                    var relatedPost = posts[Random.Shared.Next(posts.Count)];

                    var notification = new Notification
                    {
                        UserId = user.Id,
                        Type = type,
                        Title = title,
                        Message = message,
                        Priority = Random.Shared.Next(10) < 2 ? "High" : "Normal",
                        Category = "Community",
                        IsRead = Random.Shared.Next(10) < 6, // 60% chance of being read
                        RelatedEntityId = relatedPost.Id,
                        RelatedEntityType = "Post",
                        SourceUserId = sourceUser.Id,
                        ReadAt = Random.Shared.Next(10) < 6 ? DateTime.UtcNow.AddHours(-Random.Shared.Next(1, 48)) : null,
                        CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 14)),
                        CreatedBy = "System"
                    };
                    
                    _context.Notifications.Add(notification);
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}
