using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Infrastructure.Data;
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
                    Content = "We are thrilled to have you here. This constitutes the beginning of a great community. Fully2Car is built for performance lovers like you!",
                    UserId = admin.Id,
                    CreatedBy = admin.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new Post
                {
                    Title = "My New Toyota GR86",
                    Content = "Just got delivery of my new GR86 manually. The handling is absolutely superb! Planning to install some aftermarket coilovers next week. Any recommendations? 🏎️",
                    UserId = user.Id,
                    CreatedBy = user.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                }
            };

            // Enhanced Posts for New Users
            var sarah = await _userManager.FindByEmailAsync("sarah@fully2car.com");
            var mike = await _userManager.FindByEmailAsync("mike@fully2car.com");
            var elias = await _userManager.FindByEmailAsync("elias@fully2car.com");
            var yasmine = await _userManager.FindByEmailAsync("yasmine@fully2car.com");

            if (sarah != null)
            {
                posts.Add(new Post
                {
                    Title = "Drag Racing Night!",
                    Content = "Nothing beats the smell of burnt rubber at 2 AM. My Mustang clocked a personal best tonight! 🏁🔥",
                    UserId = sarah.Id,
                    CreatedBy = sarah.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                });
            }

            if (mike != null)
            {
                posts.Add(new Post
                {
                    Title = "German Engineering at its Peak",
                    Content = "Just finished a 500km road trip in the 911. The way it holds the curves is just... poetic. Perfection is real.",
                    UserId = mike.Id,
                    CreatedBy = mike.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddHours(-12)
                });
            }

            if (elias != null)
            {
                posts.Add(new Post
                {
                    Title = "Dune Bashing 101",
                    Content = "Low tire pressure is your best friend. Who's joining the desert convoy this Friday? 🏜️🚜",
                    UserId = elias.Id,
                    CreatedBy = elias.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                });
            }

            if (yasmine != null)
            {
                posts.Add(new Post
                {
                    Title = "The EV Revolution is here",
                    Content = "Just tested the new Plaid. The acceleration literally takes your breath away. No more gas stations for me! ⚡",
                    UserId = yasmine.Id,
                    CreatedBy = yasmine.Id.ToString(),
                    CreatedAt = DateTime.UtcNow.AddHours(-2)
                });
            }

            await _context.Posts.AddRangeAsync(posts);
            await _context.SaveChangesAsync();

            // Add rich comments
            var welcomePost = posts.First(p => p.Title == "Welcome to the new Platform!");
            var gr86Post = posts.First(p => p.Title == "My New Toyota GR86");
            var dunePost = posts.FirstOrDefault(p => p.Title == "Dune Bashing 101");

            _context.Comments.AddRange(new List<Comment>
            {
                new Comment
                {
                    PostId = welcomePost.Id,
                    UserId = user.Id,
                    CreatedBy = user.Id.ToString(),
                    Content = "Thanks! Happy to be part of this community.",
                    CreatedAt = DateTime.UtcNow.AddDays(-9)
                },
                new Comment
                {
                    PostId = gr86Post.Id,
                    UserId = admin.Id,
                    CreatedBy = admin.Id.ToString(),
                    Content = "Congrats on the GR86! Check out the KW Variant 3 coilovers, they are a game changer.",
                    CreatedAt = DateTime.UtcNow.AddDays(-4)
                }
            });

            if (dunePost != null && sarah != null)
            {
                _context.Comments.Add(new Comment
                {
                    PostId = dunePost.Id,
                    UserId = sarah.Id,
                    CreatedBy = sarah.Id.ToString(),
                    Content = "Count me in! I'll bring some extra recovery gear just in case. 😉",
                    CreatedAt = DateTime.UtcNow.AddHours(-5)
                });
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded enhanced posts and comments");
        }
    }
}
