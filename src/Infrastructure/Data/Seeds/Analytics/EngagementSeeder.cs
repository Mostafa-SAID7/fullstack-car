using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Entities.Marketplace;

namespace Infrastructure.Data.Seeds.Analytics
{
    public class EngagementSeeder : BaseAnalyticsSeeder
    {
        public EngagementSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<EngagementSeeder> logger) : base(context, userManager, logger)
        {
        }

        public override async Task SeedAsync()
        {
            try
            {
                await SeedCommentsAsync();
                await SeedLikesAsync();
                await SeedViewsAsync();
                await SeedSharesAsync();
                
                await _context.SaveChangesAsync();
                _logger.LogInformation("Engagement seed data created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding engagement data");
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

            foreach (var post in posts)
            {
                var commentCount = _random.Next(0, 20);
                
                for (int i = 0; i < commentCount; i++)
                {
                    var randomUser = users[_random.Next(users.Count)];
                    var commentDate = post.CreatedAt.AddMinutes(_random.Next(30, 10080)); // 30 minutes to 7 days after post

                    var comment = new Comment
                    {
                        Content = commentTexts[_random.Next(commentTexts.Length)],
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

            foreach (var post in posts)
            {
                var likeCount = _random.Next(0, Math.Min(30, users.Count));
                var likedUsers = users.OrderBy(x => _random.Next()).Take(likeCount);
                
                foreach (var user in likedUsers)
                {
                    var likeDate = post.CreatedAt.AddMinutes(_random.Next(5, 10080)); // 5 minutes to 7 days after post

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

            foreach (var post in posts)
            {
                var viewCount = _random.Next(15, Math.Min(150, users.Count * 5)); // Users can view multiple times
                
                for (int i = 0; i < viewCount; i++)
                {
                    var randomUser = users[_random.Next(users.Count)];
                    var viewDate = post.CreatedAt.AddMinutes(_random.Next(1, 10080)); // 1 minute to 7 days after post

                    var view = new PostView
                    {
                        PostId = post.Id,
                        UserId = randomUser.Id,
                        ViewedAt = viewDate,
                        IpAddress = GenerateRandomIpAddress(),
                        UserAgent = GenerateUserAgent()
                    };

                    views.Add(view);
                }
            }

            await _context.PostViews.AddRangeAsync(views);
        }

        private async Task SeedSharesAsync()
        {
            // Add shares if PostShare entity exists
            var posts = await _context.Posts.ToListAsync();
            var users = await _context.Users.ToListAsync();
            
            if (!posts.Any() || !users.Any()) return;

            // This would be implemented when PostShare entity is added
            _logger.LogInformation("Shares seeding would be implemented when PostShare entity is available");
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
                "I disagree with some points, but overall great post.",
                "Looking forward to more content like this from you.",
                "Very well written and easy to understand.",
                "This saved me a lot of money, thanks for the tip!",
                "I wish I had known this information earlier.",
                "Perfect timing for this post, exactly what I needed!",
                "Can you recommend any specific brands for this?",
                "This is a common issue, great solution provided.",
                "I'll definitely share this with my friends.",
                "Bookmarked for future reference, very helpful.",
                "Great photos and detailed explanations.",
                "This community is so helpful and knowledgeable!",
                "Amazing insights, learned something new today.",
                "Your experience really shows in this post.",
                "This deserves more upvotes and visibility.",
                "Comprehensive guide, covers everything needed.",
                "Thanks for taking the time to write this up.",
                "This should be pinned for everyone to see.",
                "Brilliant explanation, makes perfect sense now.",
                "I've been struggling with this, your post helps a lot.",
                "Quality content as always, keep it up!",
                "This changed my perspective on the topic completely."
            };
        }
    }
}