using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Enums.Community.Posts;

namespace Infrastructure.Data.Seeds.Community.Posts
{
    public class AnalyticsPostsSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AnalyticsPostsSeeder> _logger;
        private readonly Random _random = new();

        public AnalyticsPostsSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<AnalyticsPostsSeeder> logger)
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
                var groups = await _context.Groups.ToListAsync();
                
                if (!users.Any())
                {
                    _logger.LogWarning("No users found for analytics posts seeding");
                    return;
                }

                await SeedAnalyticsPostsAsync(users, groups);
                
                await _context.SaveChangesAsync();
                _logger.LogInformation("Analytics posts seed data created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding analytics posts data");
                throw;
            }
        }

        private async Task SeedAnalyticsPostsAsync(List<ApplicationUser> users, List<Group> groups)
        {
            var postTitles = GetPostTitles();
            var posts = new List<Post>();
            var startDate = DateTime.UtcNow.AddMonths(-6);

            for (int i = 0; i < 200; i++)
            {
                var randomUser = users[_random.Next(users.Count)];
                var randomGroup = groups.Any() ? groups[_random.Next(groups.Count)] : null;
                var randomTitle = postTitles[_random.Next(postTitles.Length)];
                var createdDate = GetRandomDateInRange(startDate, 180);

                var post = new Post
                {
                    Title = $"{randomTitle} #{i + 1}",
                    Content = GeneratePostContent(randomTitle),
                    UserId = randomUser.Id,
                    GroupId = randomGroup?.Id,
                    CreatedAt = createdDate,
                    UpdatedAt = createdDate,
                    Status = PostStatus.Published,
                    Type = PostType.General
                };

                posts.Add(post);
            }

            await _context.Posts.AddRangeAsync(posts);
        }

        private DateTime GetRandomDateInRange(DateTime startDate, int daysRange)
        {
            return startDate.AddDays(_random.Next(0, daysRange));
        }

        private string[] GetPostTitles()
        {
            return new[]
            {
                "Best Electric Cars for 2024",
                "Classic Muscle Car Restoration Tips",
                "How to Maintain Your Car Engine",
                "Top 10 Racing Cars of All Time",
                "Electric vs Hybrid: Which is Better?",
                "DIY Car Maintenance Guide",
                "Luxury Car Review: Mercedes S-Class",
                "Budget-Friendly Car Modifications",
                "Winter Driving Safety Tips",
                "Car Insurance: What You Need to Know",
                "The Future of Autonomous Vehicles",
                "Best Car Accessories for Road Trips",
                "Motorcycle vs Car: Pros and Cons",
                "How to Buy a Used Car",
                "Car Photography Tips and Tricks",
                "Environmental Impact of Electric Cars",
                "Track Day Preparation Guide",
                "Car Audio System Upgrades",
                "Fuel Efficiency Tips and Tricks",
                "Car Detailing: Professional vs DIY",
                "Best Sports Cars Under $50K",
                "Tesla Model S vs BMW i4",
                "Classic Car Investment Guide",
                "Turbocharging vs Supercharging",
                "Best Family SUVs for 2024",
                "Car Wrap vs Paint: Which is Better?",
                "Understanding Car Warranties",
                "Best Tires for Different Seasons",
                "Car Financing Options Explained",
                "Electric Car Charging Infrastructure"
            };
        }

        private string GeneratePostContent(string title)
        {
            var contentTemplates = new[]
            {
                $"In this comprehensive post about {title.ToLower()}, I want to share my extensive experience and valuable insights. This topic has been on my mind lately, and I believe it's worth discussing with our amazing community. Let me break down the key points and share what I've learned over the years.",
                $"Here's everything I've discovered about {title.ToLower()} through years of research and hands-on experience. These proven tips and tricks have helped me tremendously, and I'm confident they can help you achieve similar results. Feel free to ask questions in the comments!",
                $"Let's dive deep into the topic of {title.ToLower()}. This is an incredibly important subject that affects many of us in the automotive community, and I'd love to hear your thoughts, experiences, and any additional insights you might have to share.",
                $"I've been extensively researching {title.ToLower()} and wanted to share my detailed findings with everyone here. This information could be game-changing for many of you. Please feel free to add your own insights and experiences in the comments below!",
                $"Today I want to have an in-depth discussion about {title.ToLower()}. This has been a complete game-changer for me personally, and I think it could provide significant benefits to others in our community as well. Here's what you need to know...",
                $"After months of testing and research on {title.ToLower()}, I'm excited to share my findings with the community. This comprehensive guide covers everything you need to know, from basics to advanced techniques. Hope this helps everyone!"
            };

            return contentTemplates[_random.Next(contentTemplates.Length)];
        }
    }
}