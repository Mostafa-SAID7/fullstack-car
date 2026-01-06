using Application.Features.Admin.Analytics.Models;

namespace Application.Features.Admin.Analytics.Services
{
    public class EngagementAnalyticsService : IEngagementAnalyticsService
    {
        private readonly IApplicationDbContext _context;
        private readonly ILogger<EngagementAnalyticsService> _logger;

        public EngagementAnalyticsService(IApplicationDbContext context, ILogger<EngagementAnalyticsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<EngagementAnalytics> GetEngagementAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            var (start, end) = GetDateRange(startDate, endDate);

            try
            {
                var totalLikes = await _context.PostLikes.CountAsync(cancellationToken);
                var totalViews = await _context.PostViews.CountAsync(cancellationToken);
                var totalComments = await _context.Comments.CountAsync(cancellationToken);

                // Calculate engagement rate
                var totalPosts = await _context.Posts.CountAsync(cancellationToken);
                var engagementRate = totalPosts == 0 ? 0 : ((double)(totalLikes + totalComments) / totalPosts) * 100;

                var engagementTrends = await GetEngagementTrendsDetailedAsync(start, end, cancellationToken);
                var topEngagedContent = await GetTopEngagedContentAsync(10, cancellationToken);

                return new EngagementAnalytics
                {
                    TotalLikes = totalLikes,
                    TotalShares = 0, // Implement when shares feature is added
                    TotalViews = totalViews,
                    EngagementRate = Math.Round(engagementRate, 2),
                    AverageSessionDuration = 0, // Implement when session tracking is added
                    EngagementTrends = engagementTrends,
                    TopEngagedContent = topEngagedContent
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting engagement analytics");
                throw;
            }
        }
        public async Task<List<EngagementTrendData>> GetEngagementTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default)
        {
            var trends = new List<EngagementTrendData>();
            var currentDate = startDate.Date;
            var increment = granularity.ToLower() == "hour" ? TimeSpan.FromHours(1) : TimeSpan.FromDays(1);

            while (currentDate <= endDate.Date)
            {
                var nextDate = currentDate.Add(increment);
                
                var likes = await _context.PostLikes.CountAsync(l => l.CreatedAt >= currentDate && l.CreatedAt < nextDate, cancellationToken);
                var comments = await _context.Comments.CountAsync(c => c.CreatedAt >= currentDate && c.CreatedAt < nextDate, cancellationToken);
                var views = await _context.PostViews.CountAsync(v => v.ViewedAt >= currentDate && v.ViewedAt < nextDate, cancellationToken);

                var engagementRate = views == 0 ? 0 : ((double)(likes + comments) / views) * 100;

                trends.Add(new EngagementTrendData
                {
                    Date = currentDate,
                    Likes = likes,
                    Comments = comments,
                    Shares = 0, // Implement when shares feature is added
                    Views = views,
                    EngagementRate = Math.Round(engagementRate, 2)
                });

                currentDate = nextDate;
            }

            return trends;
        }

        public async Task<List<EngagementTrendData>> GetEngagementTrendsDetailedAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
        {
            var trends = new List<EngagementTrendData>();
            var currentDate = startDate.Date;

            while (currentDate <= endDate.Date)
            {
                var nextDate = currentDate.AddDays(1);
                var likes = await _context.PostLikes.CountAsync(l => l.CreatedAt >= currentDate && l.CreatedAt < nextDate, cancellationToken);
                var comments = await _context.Comments.CountAsync(c => c.CreatedAt >= currentDate && c.CreatedAt < nextDate, cancellationToken);
                var views = await _context.PostViews.CountAsync(v => v.ViewedAt >= currentDate && v.ViewedAt < nextDate, cancellationToken);

                var engagementRate = views == 0 ? 0 : ((double)(likes + comments) / views) * 100;

                trends.Add(new EngagementTrendData
                {
                    Date = currentDate,
                    Likes = likes,
                    Comments = comments,
                    Shares = 0,
                    Views = views,
                    EngagementRate = Math.Round(engagementRate, 2)
                });

                currentDate = nextDate;
            }

            return trends;
        }

        public async Task<List<TopEngagedContent>> GetTopEngagedContentAsync(int limit, CancellationToken cancellationToken = default)
        {
            return await _context.Posts
                .Select(p => new TopEngagedContent
                {
                    Id = p.Id.ToString(),
                    Title = p.Title,
                    Author = $"{p.User.FirstName} {p.User.LastName}",
                    EngagementRate = p.Views.Count() == 0 ? 0 : ((double)(p.Likes.Count() + p.Comments.Count()) / p.Views.Count()) * 100,
                    TotalEngagements = p.Likes.Count() + p.Comments.Count() + p.Views.Count()
                })
                .OrderByDescending(p => p.TotalEngagements)
                .Take(limit)
                .ToListAsync(cancellationToken);
        }

        private static (DateTime startDate, DateTime endDate) GetDateRange(DateTime? startDate, DateTime? endDate)
        {
            if (startDate.HasValue && endDate.HasValue)
                return (startDate.Value, endDate.Value);

            var now = DateTime.UtcNow;
            return (now.AddDays(-7), now);
        }
    }
}
