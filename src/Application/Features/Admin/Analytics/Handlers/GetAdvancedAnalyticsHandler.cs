using Application.Common.Interfaces.Data;
using Application.Common.Interfaces.Logging;
using Application.Features.Admin.Analytics.DTOs;
using Application.Features.Admin.Analytics.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Admin.Analytics.Handlers
{
    public class GetAdvancedAnalyticsHandler : IRequestHandler<GetAdvancedAnalyticsQuery, AdvancedAnalyticsDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IAdvancedLogger<GetAdvancedAnalyticsHandler> _logger;

        public GetAdvancedAnalyticsHandler(IApplicationDbContext context, IAdvancedLogger<GetAdvancedAnalyticsHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<AdvancedAnalyticsDto> Handle(GetAdvancedAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var startTime = DateTime.UtcNow;
            
            try
            {
                var (startDate, endDate) = GetDateRange(request.Period, request.StartDate, request.EndDate);
                var previousStartDate = GetPreviousStartDate(startDate, request.Period);

                var analytics = new AdvancedAnalyticsDto
                {
                    Users = await GetUserAnalytics(startDate, endDate, previousStartDate, cancellationToken),
                    Content = await GetContentAnalytics(startDate, endDate, previousStartDate, cancellationToken),
                    Engagement = await GetEngagementAnalytics(startDate, endDate, cancellationToken),
                    System = await GetSystemAnalytics(cancellationToken),
                    Security = await GetSecurityAnalytics(startDate, endDate, cancellationToken),
                    Performance = await GetPerformanceAnalytics(cancellationToken)
                };

                var duration = DateTime.UtcNow - startTime;
                _logger.LogPerformance("GetAdvancedAnalytics", duration, new { Period = request.Period, StartDate = startDate, EndDate = endDate });

                return analytics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting advanced analytics for period {Period}", request.Period);
                throw;
            }
        }

        private async Task<UserAnalytics> GetUserAnalytics(DateTime startDate, DateTime endDate, DateTime previousStartDate, CancellationToken cancellationToken)
        {
            var totalUsers = await _context.Users.CountAsync(cancellationToken);
            var activeUsers = await _context.Users.CountAsync(u => u.IsActive, cancellationToken);
            var newUsersToday = await _context.Users.CountAsync(u => u.CreatedAt.Date == DateTime.UtcNow.Date, cancellationToken);
            var newUsersThisWeek = await _context.Users.CountAsync(u => u.CreatedAt >= startDate, cancellationToken);
            var newUsersPreviousPeriod = await _context.Users.CountAsync(u => u.CreatedAt >= previousStartDate && u.CreatedAt < startDate, cancellationToken);

            var userGrowthRate = newUsersPreviousPeriod == 0 ? 100.0 : ((double)(newUsersThisWeek - newUsersPreviousPeriod) / newUsersPreviousPeriod) * 100;

            // Get user activity trends
            var activityTrends = await GetUserActivityTrends(startDate, endDate, cancellationToken);

            // Get top users
            var topUsers = await GetTopUsers(10, cancellationToken);

            return new UserAnalytics
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                NewUsersToday = newUsersToday,
                NewUsersThisWeek = newUsersThisWeek,
                NewUsersThisMonth = await _context.Users.CountAsync(u => u.CreatedAt >= DateTime.UtcNow.AddMonths(-1), cancellationToken),
                UserGrowthRate = Math.Round(userGrowthRate, 2),
                UserRetentionRate = await CalculateUserRetentionRate(cancellationToken),
                ActivityTrends = activityTrends,
                TopUsers = topUsers
            };
        }

        private async Task<ContentAnalytics> GetContentAnalytics(DateTime startDate, DateTime endDate, DateTime previousStartDate, CancellationToken cancellationToken)
        {
            var totalPosts = await _context.Posts.CountAsync(cancellationToken);
            var totalComments = await _context.Comments.CountAsync(cancellationToken);
            var totalGroups = await _context.Groups.CountAsync(cancellationToken);
            var postsThisWeek = await _context.Posts.CountAsync(p => p.CreatedAt >= startDate, cancellationToken);
            var postsPreviousPeriod = await _context.Posts.CountAsync(p => p.CreatedAt >= previousStartDate && p.CreatedAt < startDate, cancellationToken);

            var contentGrowthRate = postsPreviousPeriod == 0 ? 100.0 : ((double)(postsThisWeek - postsPreviousPeriod) / postsPreviousPeriod) * 100;

            // Get content trends
            var contentTrends = await GetContentTrends(startDate, endDate, cancellationToken);

            // Get popular content
            var popularContent = await GetPopularContent(10, cancellationToken);

            return new ContentAnalytics
            {
                TotalPosts = totalPosts,
                TotalComments = totalComments,
                TotalGroups = totalGroups,
                PostsToday = await _context.Posts.CountAsync(p => p.CreatedAt.Date == DateTime.UtcNow.Date, cancellationToken),
                PostsThisWeek = postsThisWeek,
                PostsThisMonth = await _context.Posts.CountAsync(p => p.CreatedAt >= DateTime.UtcNow.AddMonths(-1), cancellationToken),
                ContentGrowthRate = Math.Round(contentGrowthRate, 2),
                ContentTrends = contentTrends,
                PopularContent = popularContent
            };
        }

        private async Task<EngagementAnalytics> GetEngagementAnalytics(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
        {
            var totalLikes = await _context.PostLikes.CountAsync(cancellationToken);
            var totalViews = await _context.PostViews.CountAsync(cancellationToken);

            // Calculate engagement rate
            var totalPosts = await _context.Posts.CountAsync(cancellationToken);
            var engagementRate = totalPosts == 0 ? 0 : ((double)(totalLikes + await _context.Comments.CountAsync(cancellationToken)) / totalPosts) * 100;

            // Get engagement trends
            var engagementTrends = await GetEngagementTrends(startDate, endDate, cancellationToken);

            return new EngagementAnalytics
            {
                TotalLikes = totalLikes,
                TotalShares = 0, // Implement if you have shares
                TotalViews = totalViews,
                EngagementRate = Math.Round(engagementRate, 2),
                AverageSessionDuration = 0, // Implement session tracking
                EngagementTrends = engagementTrends
            };
        }

        private async Task<SystemAnalytics> GetSystemAnalytics(CancellationToken cancellationToken)
        {
            // Mock system metrics - replace with actual system monitoring
            return new SystemAnalytics
            {
                CpuUsage = Random.Shared.NextDouble() * 100,
                MemoryUsage = Random.Shared.NextDouble() * 100,
                DiskUsage = Random.Shared.NextDouble() * 100,
                NetworkTraffic = Random.Shared.NextDouble() * 1000,
                ActiveConnections = Random.Shared.Next(10, 100),
                AverageResponseTime = Random.Shared.NextDouble() * 500,
                ErrorRate = Random.Shared.NextDouble() * 5
            };
        }

        private async Task<SecurityAnalytics> GetSecurityAnalytics(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
        {
            // Mock security metrics - implement with actual security monitoring
            return new SecurityAnalytics
            {
                FailedLoginAttempts = Random.Shared.Next(0, 50),
                SuspiciousActivities = Random.Shared.Next(0, 10),
                BlockedIPs = Random.Shared.Next(0, 20),
                SecurityIncidents = Random.Shared.Next(0, 5)
            };
        }

        private async Task<PerformanceAnalytics> GetPerformanceAnalytics(CancellationToken cancellationToken)
        {
            // Mock performance metrics - implement with actual performance monitoring
            return new PerformanceAnalytics
            {
                DatabaseResponseTime = Random.Shared.NextDouble() * 100,
                CacheHitRate = Random.Shared.NextDouble() * 100,
                ApiResponseTime = Random.Shared.NextDouble() * 200,
                QueuedJobs = Random.Shared.Next(0, 100),
                FailedJobs = Random.Shared.Next(0, 10)
            };
        }

        private async Task<List<UserActivityTrend>> GetUserActivityTrends(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
        {
            var trends = new List<UserActivityTrend>();
            var currentDate = startDate.Date;

            while (currentDate <= endDate.Date)
            {
                var nextDate = currentDate.AddDays(1);
                var activeUsers = await _context.Users.CountAsync(u => u.LastLoginAt >= currentDate && u.LastLoginAt < nextDate, cancellationToken);
                var newUsers = await _context.Users.CountAsync(u => u.CreatedAt >= currentDate && u.CreatedAt < nextDate, cancellationToken);

                trends.Add(new UserActivityTrend
                {
                    Date = currentDate,
                    ActiveUsers = activeUsers,
                    NewUsers = newUsers,
                    ReturnedUsers = activeUsers - newUsers
                });

                currentDate = nextDate;
            }

            return trends;
        }

        private async Task<List<TopUser>> GetTopUsers(int limit, CancellationToken cancellationToken)
        {
            return await _context.Users
                .Select(u => new TopUser
                {
                    UserId = u.Id.ToString(),
                    Name = $"{u.FirstName} {u.LastName}",
                    Email = u.Email,
                    PostCount = u.Posts.Count(),
                    LikeCount = u.PostLikes.Count(),
                    CommentCount = u.Comments.Count(),
                    EngagementScore = u.Posts.Count() + u.PostLikes.Count() + u.Comments.Count()
                })
                .OrderByDescending(u => u.EngagementScore)
                .Take(limit)
                .ToListAsync(cancellationToken);
        }

        private async Task<List<ContentTrend>> GetContentTrends(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
        {
            var trends = new List<ContentTrend>();
            var currentDate = startDate.Date;

            while (currentDate <= endDate.Date)
            {
                var nextDate = currentDate.AddDays(1);
                var postCount = await _context.Posts.CountAsync(p => p.CreatedAt >= currentDate && p.CreatedAt < nextDate, cancellationToken);
                var commentCount = await _context.Comments.CountAsync(c => c.CreatedAt >= currentDate && c.CreatedAt < nextDate, cancellationToken);
                var viewCount = await _context.PostViews.CountAsync(v => v.ViewedAt >= currentDate && v.ViewedAt < nextDate, cancellationToken);

                trends.Add(new ContentTrend
                {
                    Date = currentDate,
                    PostCount = postCount,
                    CommentCount = commentCount,
                    ViewCount = viewCount
                });

                currentDate = nextDate;
            }

            return trends;
        }

        private async Task<List<PopularContent>> GetPopularContent(int limit, CancellationToken cancellationToken)
        {
            return await _context.Posts
                .Select(p => new PopularContent
                {
                    Id = p.Id.ToString(),
                    Title = p.Title,
                    Type = "Post",
                    Views = p.Views.Count(),
                    Likes = p.Likes.Count(),
                    Comments = p.Comments.Count(),
                    EngagementScore = p.Views.Count() + p.Likes.Count() + p.Comments.Count()
                })
                .OrderByDescending(p => p.EngagementScore)
                .Take(limit)
                .ToListAsync(cancellationToken);
        }

        private async Task<List<EngagementTrend>> GetEngagementTrends(DateTime startDate, DateTime endDate, CancellationToken cancellationToken)
        {
            var trends = new List<EngagementTrend>();
            var currentDate = startDate.Date;

            while (currentDate <= endDate.Date)
            {
                var nextDate = currentDate.AddDays(1);
                var likes = await _context.PostLikes.CountAsync(l => l.CreatedAt >= currentDate && l.CreatedAt < nextDate, cancellationToken);
                var comments = await _context.Comments.CountAsync(c => c.CreatedAt >= currentDate && c.CreatedAt < nextDate, cancellationToken);
                var views = await _context.PostViews.CountAsync(v => v.ViewedAt >= currentDate && v.ViewedAt < nextDate, cancellationToken);

                var engagementRate = views == 0 ? 0 : ((double)(likes + comments) / views) * 100;

                trends.Add(new EngagementTrend
                {
                    Date = currentDate,
                    Likes = likes,
                    Comments = comments,
                    Shares = 0, // Implement if you have shares
                    Views = views,
                    EngagementRate = Math.Round(engagementRate, 2)
                });

                currentDate = nextDate;
            }

            return trends;
        }

        private async Task<double> CalculateUserRetentionRate(CancellationToken cancellationToken)
        {
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
            var usersThirtyDaysAgo = await _context.Users.CountAsync(u => u.CreatedAt <= thirtyDaysAgo, cancellationToken);
            var activeUsersFromThirtyDaysAgo = await _context.Users.CountAsync(u => u.CreatedAt <= thirtyDaysAgo && u.LastLoginAt >= thirtyDaysAgo, cancellationToken);

            return usersThirtyDaysAgo == 0 ? 0 : Math.Round(((double)activeUsersFromThirtyDaysAgo / usersThirtyDaysAgo) * 100, 2);
        }

        private static (DateTime startDate, DateTime endDate) GetDateRange(string period, DateTime? startDate, DateTime? endDate)
        {
            if (startDate.HasValue && endDate.HasValue)
                return (startDate.Value, endDate.Value);

            var now = DateTime.UtcNow;
            return period.ToLower() switch
            {
                "day" => (now.AddDays(-1), now),
                "week" => (now.AddDays(-7), now),
                "month" => (now.AddMonths(-1), now),
                "year" => (now.AddYears(-1), now),
                _ => (now.AddDays(-7), now)
            };
        }

        private static DateTime GetPreviousStartDate(DateTime startDate, string period)
        {
            return period.ToLower() switch
            {
                "day" => startDate.AddDays(-1),
                "week" => startDate.AddDays(-7),
                "month" => startDate.AddMonths(-1),
                "year" => startDate.AddYears(-1),
                _ => startDate.AddDays(-7)
            };
        }
    }
}