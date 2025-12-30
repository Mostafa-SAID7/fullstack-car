using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Community.Posts
{
    public class PostsSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<PostsSeeder> _logger;

        public PostsSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<PostsSeeder> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            if (await _context.Posts.AnyAsync()) return;

            var admin = await _userManager.FindByEmailAsync("admin@localhost");
            var user = await _userManager.FindByEmailAsync("user@localhost");

            if (admin == null || user == null) return;

            var posts = new List<Post>
            {
                new Post
                {
                    Title = "Welcome to the new Platform!",
                    Content = "We are thrilled to have you here. This constitutes the beginning of a great community.",
                    UserId = admin.Id,
                    CreatedBy = admin.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Post
                {
                    Title = "My New Toyota GR86",
                    Content = "Just got delivery of my new GR86 manually. The handling is absolutely superb!",
                    UserId = user.Id,
                    CreatedBy = user.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                }
            };

            await _context.Posts.AddRangeAsync(posts);
            await _context.SaveChangesAsync();
            
            // Add comments
            var welcomePost = posts.First(p => p.Title == "Welcome to the new Platform!");
            _context.Comments.Add(new Comment
            {
                PostId = welcomePost.Id,
                UserId = user.Id, // Fixed mapping
                CreatedBy = user.Id.ToString(),
                Content = "Thanks! Happy to be part of this.",
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Seeded posts");
        }
    }
}
