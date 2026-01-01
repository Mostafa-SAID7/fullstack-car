using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Identity;
using Domain.Enums.Community.Posts;
using Domain.Enums.Community.Reviews;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class CommunityContentSeeder
    {
        private readonly ILogger<CommunityContentSeeder> _logger;
        private readonly ApplicationDbContext _context;

        public CommunityContentSeeder(ILogger<CommunityContentSeeder> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task SeedPostsAsync()
        {
            _logger.LogInformation("Seeding posts...");

            var users = await _context.Users.ToListAsync();
            var groups = await _context.Groups.ToListAsync();
            if (!users.Any()) return;

            var posts = new[]
            {
                new { Title = "Weekend Car Meet Success!", Content = "Amazing turnout at yesterday's car meet in Dubai Marina. Over 200 cars showed up! Thanks to everyone who participated. Looking forward to the next one.", Type = PostType.News },
                new { Title = "Tesla Model S Plaid Review", Content = "Just spent a week with the Model S Plaid. The acceleration is absolutely mind-blowing - 0-60 in under 2 seconds! The build quality has improved significantly. AMA about the experience.", Type = PostType.Review },
                new { Title = "Classic Mustang Restoration Update", Content = "Month 3 of my 1967 Mustang restoration project. Engine rebuild is complete, now working on the interior. The original seats were beyond saving, so going with custom leather.", Type = PostType.CarShowcase },
                new { Title = "Best Driving Roads in UAE", Content = "Compiled a list of the most scenic and fun driving roads in the UAE. Jebel Hafeet tops the list! What are your favorite driving destinations?", Type = PostType.Guide },
                new { Title = "Winter Tire Recommendations", Content = "Winter is coming! What are your go-to tire brands for the cooler months? Looking for recommendations for my BMW M3. Michelin vs Continental?", Type = PostType.Question },
                new { Title = "Track Day at Dubai Autodrome", Content = "Incredible day at Dubai Autodrome yesterday. The GP circuit never gets old! Here are some photos from the event. Next track day is scheduled for next month.", Type = PostType.News },
                new { Title = "DIY Oil Change Guide", Content = "Step-by-step guide for changing your oil at home. Save money and learn about your car! Always use the correct oil specification for your engine.", Type = PostType.Guide },
                new { Title = "Car Photography Tips", Content = "Sharing some techniques I've learned for automotive photography. Golden hour lighting is everything! Also, don't forget about the background composition.", Type = PostType.Guide },
                new { Title = "Electric vs Hybrid vs Gas", Content = "Comprehensive comparison of different powertrains available in the UAE market. What's best for your driving needs? Consider your daily commute and charging infrastructure.", Type = PostType.Guide },
                new { Title = "Supercar Spotting in Dubai Mall", Content = "Just returned from Dubai Mall. The number of supercars in the parking garage is absolutely insane! Spotted 3 Bugattis, 5 Lamborghinis, and countless Ferraris.", Type = PostType.CarShowcase },
                new { Title = "BMW M4 Competition Long-term Review", Content = "After 6 months and 15,000km with the M4 Competition, here's my honest review. The S58 engine is a masterpiece, but the grille still divides opinions.", Type = PostType.Review },
                new { Title = "Porsche 911 GT3 Track Experience", Content = "Finally got to drive the GT3 on track at Yas Marina Circuit. The naturally aspirated flat-six is pure music! The precision and feedback are unmatched.", Type = PostType.Review },
                new { Title = "Car Detailing Workshop Recommendations", Content = "Looking for the best car detailing workshops in Dubai and Abu Dhabi. Need paint correction and ceramic coating for my new car. Budget is not a concern.", Type = PostType.Question },
                new { Title = "Modified Nissan GTR R35 Build", Content = "My GTR build is finally complete! Stage 2+ tune, upgraded turbos, and full exhaust system. Making 650hp to the wheels now. Build thread inside.", Type = PostType.CarShowcase },
                new { Title = "Ferrari F8 Tributo First Impressions", Content = "Picked up my F8 Tributo yesterday from Al Tayer Motors. First Ferrari and I'm blown away by the attention to detail. The V8 turbo sounds incredible!", Type = PostType.CarShowcase },
                new { Title = "Maintenance Schedule for High-Mileage Cars", Content = "Tips for maintaining cars with over 100,000km. Regular oil changes are crucial, but don't forget about transmission fluid, brake fluid, and coolant.", Type = PostType.Maintenance },
                new { Title = "McLaren 720S vs Lamborghini Huracan", Content = "Had the chance to drive both back-to-back. The McLaren is more refined and faster, but the Lambo has more character and drama. Which would you choose?", Type = PostType.Review },
                new { Title = "Classic Car Show in Sharjah", Content = "Attended the classic car show in Sharjah Heritage Area. Some absolutely stunning vintage cars on display. The 1960s Jaguar E-Type stole the show!", Type = PostType.News },
                new { Title = "Tire Pressure Monitoring Importance", Content = "PSA: Check your tire pressures regularly! Proper inflation improves fuel economy, tire life, and safety. TPMS systems help but manual checks are still important.", Type = PostType.Maintenance },
                new { Title = "Audi RS6 Avant - The Perfect Daily?", Content = "The RS6 Avant might be the perfect daily driver supercar. 600hp, all-wheel drive, and practical wagon space. Just wish Audi would bring more colors to the UAE market.", Type = PostType.Review }
            };

            foreach (var postData in posts)
            {
                var author = users[Random.Shared.Next(users.Count)];
                var group = Random.Shared.Next(10) < 3 ? groups[Random.Shared.Next(groups.Count)] : null; // 30% chance of being in a group

                var post = new Post
                {
                    Title = postData.Title,
                    Content = postData.Content,
                    Type = postData.Type,
                    Status = PostStatus.Published,
                    UserId = author.Id,
                    GroupId = group?.Id,
                    ViewsCount = Random.Shared.Next(25, 1200),
                    LikesCount = Random.Shared.Next(2, 85),
                    CommentsCount = 0, // Will be updated as comments are seeded
                    CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
                    CreatedBy = author.Id.ToString()
                };

                _context.Posts.Add(post);
                _logger.LogInformation("Created post: {PostTitle}", post.Title);
            }
            await _context.SaveChangesAsync();
        }

        public async Task SeedCommentsAsync()
        {
            _logger.LogInformation("Seeding comments...");

            var users = await _context.Users.ToListAsync();
            var posts = await _context.Posts.ToListAsync();
            if (!users.Any() || !posts.Any()) return;

            var commentTexts = new[]
            {
                "Great post! Thanks for sharing your experience.",
                "I completely agree with your points here.",
                "This is exactly what I was looking for. Thank you!",
                "Interesting perspective. I hadn't thought of it that way.",
                "Do you have any more details about this?",
                "I had a similar experience with my car.",
                "Thanks for the detailed explanation!",
                "This is really helpful information.",
                "I disagree with some points, but overall good post.",
                "Can you recommend any specific brands or models?",
                "Where did you get this done? Looking for recommendations.",
                "How much did this cost you approximately?",
                "I've been considering this myself. Good to know!",
                "Excellent write-up! Very informative.",
                "This should be pinned for everyone to see."
            };

            foreach (var post in posts.Take(15)) // Add comments to first 15 posts
            {
                var commentCount = Random.Shared.Next(1, 8);
                post.CommentsCount = commentCount; // Update count in post
                
                for (int i = 0; i < commentCount; i++)
                {
                    var commenter = users[Random.Shared.Next(users.Count)];
                    var comment = new Comment
                    {
                        Content = commentTexts[Random.Shared.Next(commentTexts.Length)],
                        UserId = commenter.Id,
                        PostId = post.Id,
                        LikesCount = Random.Shared.Next(0, 12),
                        RepliesCount = 0,
                        CreatedAt = post.CreatedAt.AddHours(Random.Shared.Next(1, 48)),
                        CreatedBy = commenter.Id.ToString()
                    };

                    _context.Comments.Add(comment);
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task SeedLikesAsync()
        {
            _logger.LogInformation("Seeding likes...");

            var users = await _context.Users.ToListAsync();
            var posts = await _context.Posts.ToListAsync();
            var comments = await _context.Comments.ToListAsync();

            // Add post likes
            foreach (var post in posts)
            {
                var likeCount = Random.Shared.Next(1, Math.Min(15, users.Count));
                post.LikesCount = likeCount; // Match seeded likes

                var likers = users.OrderBy(x => Random.Shared.Next()).Take(likeCount);

                foreach (var liker in likers)
                {
                    var postLike = new PostLike
                    {
                        UserId = liker.Id,
                        PostId = post.Id,
                        CreatedAt = post.CreatedAt.AddHours(Random.Shared.Next(1, 72)),
                        CreatedBy = liker.Id.ToString()
                    };

                    _context.PostLikes.Add(postLike);
                }
            }

            // Add comment likes
            foreach (var comment in comments.Take(30)) // Like first 30 comments
            {
                var likeCount = Random.Shared.Next(0, Math.Min(8, users.Count));
                comment.LikesCount = likeCount; // Match seeded likes

                var likers = users.OrderBy(x => Random.Shared.Next()).Take(likeCount);

                foreach (var liker in likers)
                {
                    var commentLike = new Domain.Entities.Community.Posts.CommentLike
                    {
                        UserId = liker.Id,
                        CommentId = comment.Id,
                        CreatedAt = comment.CreatedAt.AddMinutes(Random.Shared.Next(10, 1440)),
                        CreatedBy = liker.Id.ToString()
                    };

                    _context.CommentLikes.Add(commentLike);
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task SeedReviewsAsync()
        {
            _logger.LogInformation("Seeding reviews...");

            var users = await _context.Users.ToListAsync();
            if (!users.Any()) return;

            // Seed Categories first if none exist
            if (!await _context.ReviewCategories.AnyAsync())
            {
                var categories = new[]
                {
                    new ReviewCategory { Name = "Cars", Description = "General car reviews", Color = "#FF5733", CreatedBy = "System" },
                    new ReviewCategory { Name = "Workshops", Description = "Car repair and maintenance services", Color = "#33FF57", CreatedBy = "System" },
                    new ReviewCategory { Name = "Spare Parts", Description = "Quality and pricing of parts", Color = "#3357FF", CreatedBy = "System" },
                    new ReviewCategory { Name = "Accessories", Description = "Car gadgets and add-ons", Color = "#F333FF", CreatedBy = "System" }
                };
                _context.ReviewCategories.AddRange(categories);
                await _context.SaveChangesAsync();
            }

            var categoryIds = await _context.ReviewCategories.Select(c => c.Id).ToListAsync();
            var carBrands = new[] { "Toyota", "BMW", "Mercedes-Benz", "Nissan", "Ford" };
            var carModels = new[] { "Camry", "M3", "C-Class", "Patrol", "Mustang" };

            for (int i = 0; i < 20; i++)
            {
                var user = users[Random.Shared.Next(users.Count)];
                var brandIndex = Random.Shared.Next(carBrands.Length);
                
                var review = new CommunityReview
                {
                    Title = $"{carBrands[brandIndex]} {carModels[brandIndex]} Experience",
                    Content = "This has been a great experience so far. The performance is top-notch and the fuel efficiency is better than expected.",
                    Rating = Random.Shared.Next(3, 6),
                    Type = CommunityReviewType.CarReview,
                    Status = Domain.Enums.Community.Reviews.ReviewStatus.Published,
                    UserId = user.Id,
                    CarBrand = carBrands[brandIndex],
                    CarModel = carModels[brandIndex],
                    CarYear = 2020 + Random.Shared.Next(0, 5),
                    CategoryId = categoryIds[Random.Shared.Next(categoryIds.Count)],
                    Pros = "[\"Reliable\", \"Efficient\"]",
                    Cons = "[\"Expensive parts\"]",
                    CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 100)),
                    CreatedBy = user.Id.ToString()
                };

                _context.CommunityReviews.Add(review);
            }
            await _context.SaveChangesAsync();
        }
    }
}
