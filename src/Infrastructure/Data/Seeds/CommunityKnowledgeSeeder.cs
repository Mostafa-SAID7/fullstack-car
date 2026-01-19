using Domain.Entities.Community.QA;
using Domain.Entities.Community.News;
using Domain.Entities.Community.Guides;
using Domain.Entities.Community.Pages;
using Domain.Entities.Identity;
using Domain.Enums.Community.QA;
using Domain.Enums.Community.News;
using Domain.Enums.Community.Guides;
using Domain.Enums.Community.Pages;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds
{
    public class CommunityKnowledgeSeeder
    {
        private readonly ILogger<CommunityKnowledgeSeeder> _logger;
        private readonly ApplicationDbContext _context;

        public CommunityKnowledgeSeeder(ILogger<CommunityKnowledgeSeeder> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task SeedQAAsync()
        {
            _logger.LogInformation("Seeding QA...");

            var users = await _context.Users.ToListAsync();
            if (!users.Any()) return;

            if (!await _context.Categories.AnyAsync(c => c.ContentType == Domain.Enums.Common.ContentType.Question))
            {
                var categories = new[]
                {
                    new Domain.Entities.Common.Category { Name = "Engine & Transmission", Description = "Engine and gearbox issues", ContentType = Domain.Enums.Common.ContentType.Question, CreatedBy = "System" },
                    new Domain.Entities.Common.Category { Name = "Electrical & Electronics", Description = "Sensors, lights, and infotainment", ContentType = Domain.Enums.Common.ContentType.Question, CreatedBy = "System" },
                    new Domain.Entities.Common.Category { Name = "Brakes & Suspension", Description = "Handling and stopping", ContentType = Domain.Enums.Common.ContentType.Question, CreatedBy = "System" },
                    new Domain.Entities.Common.Category { Name = "General Maintenance", Description = "Oil changes, tires, etc.", ContentType = Domain.Enums.Common.ContentType.Question, CreatedBy = "System" }
                };
                _context.Categories.AddRange(categories);
                await _context.SaveChangesAsync();
            }

            var categoryIds = await _context.Categories.Where(c => c.ContentType == Domain.Enums.Common.ContentType.Question).Select(c => c.Id).ToListAsync();

            for (int i = 0; i < 15; i++)
            {
                var author = users[Random.Shared.Next(users.Count)];
                var question = new Question
                {
                    Title = $"Problem with my car #{i + 1}",
                    Content = "I've been hearing a strange noise coming from the front of the car whenever I turn the steering wheel. Any ideas what it could be?",
                    Status = QuestionStatus.Open,
                    Priority = QuestionPriority.Normal,
                    ViewsCount = Random.Shared.Next(10, 500),
                    UpvotesCount = Random.Shared.Next(0, 50),
                    UserId = author.Id,
                    CategoryId = categoryIds[Random.Shared.Next(categoryIds.Count)],
                    CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 30)),
                    CreatedBy = author.Id.ToString()
                };

                _context.Questions.Add(question);
                await _context.SaveChangesAsync();

                // Add Question Votes
                var voteCount = Random.Shared.Next(0, Math.Min(5, users.Count));
                var voters = users.OrderBy(x => Random.Shared.Next()).Take(voteCount);
                foreach (var voter in voters)
                {
                    _context.Votes.Add(new Domain.Entities.Common.Vote
                    {
                        ContentId = question.Id,
                        ContentType = Domain.Enums.Common.ContentType.Question,
                        UserId = voter.Id,
                        VoteType = Random.Shared.Next(10) > 2 ? Domain.Enums.Common.VoteType.Up : Domain.Enums.Common.VoteType.Down,
                        CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 10))
                    });
                }

                // Add an answer
                var responder = users[Random.Shared.Next(users.Count)];
                var answer = new Answer
                {
                    Content = "It sounds like it could be a worn out CV joint or potentially a power steering pump issue. You should have a mechanic check the suspension components.",
                    UserId = responder.Id,
                    QuestionId = question.Id,
                    UpvotesCount = Random.Shared.Next(1, 20),
                    CreatedAt = question.CreatedAt.AddHours(Random.Shared.Next(1, 24)),
                    CreatedBy = responder.Id.ToString()
                };
                _context.Answers.Add(answer);
                await _context.SaveChangesAsync();

                // Add Answer Comments
                var commentCount = Random.Shared.Next(0, 3);
                for (int c = 0; c < commentCount; c++)
                {
                    var commenter = users[Random.Shared.Next(users.Count)];
                    _context.Comments.Add(new Domain.Entities.Common.Comment
                    {
                        ContentId = answer.Id,
                        ContentType = Domain.Enums.Common.ContentType.Answer,
                        UserId = commenter.Id,
                        Content = "Thanks for the advice! I will check it out.",
                        CreatedBy = commenter.Id.ToString()
                    });
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task SeedNewsAsync()
        {
            _logger.LogInformation("Seeding News...");

            var users = await _context.Users.ToListAsync();
            if (!users.Any()) return;

            if (!await _context.NewsCategories.AnyAsync())
            {
                var categories = new[]
                {
                    new NewsCategory { Name = "Industry News", Description = "Global automotive industry updates", CreatedBy = "System" },
                    new NewsCategory { Name = "Local Events", Description = "UAE car meets and shows", CreatedBy = "System" },
                    new NewsCategory { Name = "New Launches", Description = "Latest car model reveals", CreatedBy = "System" }
                };
                _context.NewsCategories.AddRange(categories);
                await _context.SaveChangesAsync();
            }

            var categoryIds = await _context.NewsCategories.Select(c => c.Id).ToListAsync();

            for (int i = 0; i < 5; i++)
            {
                var article = new Article
                {
                    Title = $"Automotive Update #{i + 1}",
                    Slug = $"automotive-update-{i + 1}",
                    Content = "Big things are happening in the car world today. Major manufacturers are shifting towards electric vehicles faster than anticipated.",
                    Status = ArticleStatus.Published,
                    AuthorId = users[0].Id,
                    CategoryId = categoryIds[Random.Shared.Next(categoryIds.Count)],
                    PublishedAt = DateTime.UtcNow.AddDays(-i),
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    CreatedBy = "System"
                };
                _context.Articles.Add(article);
                await _context.SaveChangesAsync();

                // Add News Comments
                var commCount = Random.Shared.Next(1, 5);
                for (int c = 0; c < commCount; c++)
                {
                    var commenter = users[Random.Shared.Next(users.Count)];
                    _context.NewsComments.Add(new NewsComment
                    {
                        ArticleId = article.Id,
                        UserId = commenter.Id,
                        Content = "This is very interesting news. The future is definitely electric.",
                        Status = Domain.Enums.Community.News.CommentStatus.Published,
                        CreatedAt = article.PublishedAt?.AddHours(Random.Shared.Next(1, 10)) ?? DateTime.UtcNow,
                        CreatedBy = commenter.Id.ToString()
                    });
                }

                // Add Article Likes
                var likeCount = Random.Shared.Next(0, Math.Min(10, users.Count));
                var likers = users.OrderBy(x => Random.Shared.Next()).Take(likeCount);
                foreach (var liker in likers)
                {
                    _context.ArticleLikes.Add(new ArticleLike
                    {
                        ArticleId = article.Id,
                        UserId = liker.Id,
                        CreatedAt = article.PublishedAt?.AddHours(Random.Shared.Next(1, 12)) ?? DateTime.UtcNow
                    });
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task SeedGuidesAsync()
        {
            _logger.LogInformation("Seeding Guides...");

            var users = await _context.Users.ToListAsync();
            if (!users.Any()) return;

            for (int i = 0; i < 3; i++)
            {
                var guide = new Guide
                {
                    Title = $"How to Maintain Your Car - Part {i + 1}",
                    Summary = "A comprehensive guide on keeping your vehicle in top shape.",
                    Content = "Regular maintenance is key to longevity. Check your oil, tires, and brakes monthly.",
                    Category = GuideCategory.Maintenance,
                    Difficulty = GuideDifficulty.Beginner,
                    AuthorId = users[0].Id,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    CreatedBy = "System"
                };
                _context.Guides.Add(guide);
            }
            await _context.SaveChangesAsync();
        }

        public async Task SeedPagesAsync()
        {
            _logger.LogInformation("Seeding Community Pages...");

            var users = await _context.Users.ToListAsync();
            if (!users.Any()) return;

            if (await _context.Pages.AnyAsync()) return;

            var pages = new List<Page>
            {
                new Page
                {
                    Title = "About Our Community",
                    Slug = "about-us",
                    Content = "Welcome to Fully2Car, the ultimate destination for car enthusiasts. Our mission is to connect drivers, sharing knowledge and passion for everything on wheels.",
                    Excerpt = "Connecting car lovers across the globe.",
                    Status = PageStatus.Published,
                    Type = PageType.About,
                    AuthorId = users[0].Id,
                    PublishedAt = DateTime.UtcNow.AddYears(-1),
                    CreatedAt = DateTime.UtcNow.AddYears(-1),
                    CreatedBy = "System"
                },
                new Page
                {
                    Title = "Community Guidelines",
                    Slug = "guidelines",
                    Content = "Please be respectful, helpful, and keep it legal. No spamming, bullying, or misinformation.",
                    Excerpt = "Rules to keep our community safe and fun.",
                    Status = PageStatus.Published,
                    Type = PageType.Help,
                    AuthorId = users[0].Id,
                    PublishedAt = DateTime.UtcNow.AddMonths(-6),
                    CreatedAt = DateTime.UtcNow.AddMonths(-6),
                    CreatedBy = "System"
                }
            };

            _context.Pages.AddRange(pages);
            await _context.SaveChangesAsync();
        }
    }
}
