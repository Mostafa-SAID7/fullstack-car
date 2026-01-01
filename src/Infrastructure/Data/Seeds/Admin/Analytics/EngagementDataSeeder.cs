using Domain.Entities.Community.Posts;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Admin.Analytics;

public class EngagementDataSeeder
{
    private readonly ILogger<EngagementDataSeeder> _logger;
    private readonly ApplicationDbContext _context;

    public EngagementDataSeeder(ILogger<EngagementDataSeeder> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Seeding Engagement Data...");

            await SeedCommentsAsync();
            await SeedLikesAsync();
            await SeedViewsAsync();

            _logger.LogInformation("Engagement Data seeded successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding Engagement Data.");
            throw;
        }
    }

    private async Task SeedCommentsAsync()
    {
        if (await _context.Comments.AnyAsync())
        {
            _logger.LogInformation("Comments already exist, skipping seeding");
            return;
        }

        var posts = await _context.Posts.ToListAsync();
        var users = await _context.Users.ToListAsync();
        
        if (!posts.Any() || !users.Any()) return;

        var comments = new List<Comment>();
        var commentTexts = GetCommentTexts();
        var random = new Random();

        foreach (var post in posts)
        {
            var commentCount = random.Next(0, 15);
            
            for (int i = 0; i < commentCount; i++)
            {
                var randomUser = users[random.Next(users.Count)];
                var commentDate = post.CreatedAt.AddMinutes(random.Next(30, 10080));

                var comment = new Comment
                {
                    Content = commentTexts[random.Next(commentTexts.Length)],
                    PostId = post.Id,
                    AuthorId = randomUser.Id,
                    CreatedAt = commentDate,
                    UpdatedAt = commentDate,
                    IsActive = true
                };

                comments.Add(comment);
            }
        }

        await _context.Comments.AddRangeAsync(comments);
        _logger.LogInformation($"Added {comments.Count} comments for engagement analytics.");
    }

    private async Task SeedLikesAsync()
    {
        if (await _context.PostLikes.AnyAsync())
        {
            _logger.LogInformation("Likes already exist, skipping seeding");
            return;
        }

        var posts = await _context.Posts.ToListAsync();
        var users = await _context.Users.ToListAsync();
        
        if (!posts.Any() || !users.Any()) return;

        var likes = new List<PostLike>();
        var random = new Random();

        foreach (var post in posts)
        {
            var likeCount = random.Next(0, Math.Min(25, users.Count));
            var likedUsers = users.OrderBy(x => random.Next()).Take(likeCount);
            
            foreach (var user in likedUsers)
            {
                var likeDate = post.CreatedAt.AddMinutes(random.Next(5, 10080));

                var like = new PostLike
                {
                    PostId = post.Id,
                    UserId = user.Id,
                    CreatedAt = likeDate
                };

                likes.Add(like);
            }
        }

        await _context.PostLikes.AddRangeAsync(likes);
        _logger.LogInformation($"Added {likes.Count} likes for engagement analytics.");
    }

    private async Task SeedViewsAsync()
    {
        if (await _context.PostViews.AnyAsync())
        {
            _logger.LogInformation("Views already exist, skipping seeding");
            return;
        }

        var posts = await _context.Posts.ToListAsync();
        var users = await _context.Users.ToListAsync();
        
        if (!posts.Any() || !users.Any()) return;

        var views = new List<PostView>();
        var random = new Random();

        foreach (var post in posts)
        {
            var viewCount = random.Next(10, Math.Min(100, users.Count * 3));
            
            for (int i = 0; i < viewCount; i++)
            {
                var randomUser = users[random.Next(users.Count)];
                var viewDate = post.CreatedAt.AddMinutes(random.Next(1, 10080));

                var view = new PostView
                {
                    PostId = post.Id,
                    UserId = randomUser.Id,
                    ViewedAt = viewDate,
                    IpAddress = GenerateRandomIpAddress(random),
                    UserAgent = GenerateUserAgent(random)
                };

                views.Add(view);
            }
        }

        await _context.PostViews.AddRangeAsync(views);
        _logger.LogInformation($"Added {views.Count} views for engagement analytics.");
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

    private string[] GetCommentTexts()
    {
        return new[]
        {
            "Great post! Very informative and well-written.",
            "I completely agree with your points here.",
            "Thanks for sharing this valuable information.",
            "This is exactly what I was looking for!",
            "Excellent advice, will definitely try this approach.",
            "I had a similar experience with my car recently.",
            "Could you provide more details about this topic?",
            "This helped me solve my problem, thank you so much!",
            "Very well written and easy to understand.",
            "This saved me a lot of money, thanks for the tip!",
            "I disagree with some points, but overall great post.",
            "Looking forward to more content like this from you.",
            "Perfect timing for this post, exactly what I needed!",
            "Can you recommend any specific brands for this?",
            "This is a common issue, great solution provided.",
            "I'll definitely share this with my friends.",
            "Bookmarked for future reference, very helpful.",
            "Great photos and detailed explanations.",
            "This community is so helpful and knowledgeable!",
            "Amazing insights, learned something new today."
        };
    }
}