using Application.Features.Admin.Analytics.Models;

namespace Application.Features.Admin.Analytics.Services
{
    public class UserAnalyticsService : IUserAnalyticsService
    {
        private readonly IApplicationDbContext _context;
        private readonly ILogger<UserAnalyticsService> _logger;

        public UserAnalyticsService(IApplicationDbContext context, ILogger<UserAnalyticsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<UserAnalytics> GetUserAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            var (start, end) = GetDateRange(startDate, endDate);
            var previousStart = GetPreviousStartDate(start, "week");

            try
            {
                var totalUsers = await _context.Users.CountAsync(cancellationToken);
                var activeUsers = await _context.Users.CountAsync(u => u.IsActive, cancellationToken);
                var newUsersToday = await _context.Users.CountAsync(u => u.CreatedAt.Date == DateTime.UtcNow.Date, cancellationToken);
                var newUsersThisWeek = await _context.Users.CountAsync(u => u.CreatedAt >= start, cancellationToken);
                var newUsersThisMonth = await _context.Users.CountAsync(u => u.CreatedAt >= DateTime.UtcNow.AddMonths(-1), cancellationToken);
                var newUsersPreviousPeriod = await _context.Users.CountAsync(u => u.CreatedAt >= previousStart && u.CreatedAt < start, cancellationToken);

                var userGrowthRate = newUsersPreviousPeriod == 0 ? 100.0 : ((double)(newUsersThisWeek - newUsersPreviousPeriod) / newUsersPreviousPeriod) * 100;
                var userRetentionRate = await CalculateUserRetentionRateAsync(cancellationToken);

                var demographics = await GetUserDemographicsAsync(cancellationToken);
                var activityTrends = await GetUserActivityTrendsAsync(start, end, cancellationToken);
                var topUsers = await GetTopUsersAsync(10, cancellationToken);

                return new UserAnalytics
                {
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    NewUsersToday = newUsersToday,
                    NewUsersThisWeek = newUsersThisWeek,
                    NewUsersThisMonth = newUsersThisMonth,
                    UserGrowthRate = Math.Round(userGrowthRate, 2),
                    UserRetentionRate = Math.Round(userRetentionRate, 2),
                    Demographics = demographics,
                    ActivityTrends = activityTrends,
                    TopUsers = topUsers
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user analytics");
                throw;
            }
        }

        public async Task<List<UserTrendData>> GetUserTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default)
        {
            var trends = new List<UserTrendData>();
            var currentDate = startDate.Date;
            var increment = granularity.ToLower() == "hour" ? TimeSpan.FromHours(1) : TimeSpan.FromDays(1);

            while (currentDate <= endDate.Date)
            {
                var nextDate = currentDate.Add(increment);
                
                var newUsers = await _context.Users.CountAsync(u => u.CreatedAt >= currentDate && u.CreatedAt < nextDate, cancellationToken);
                var activeUsers = await _context.Users.CountAsync(u => u.LastLoginAt >= currentDate && u.LastLoginAt < nextDate, cancellationToken);
                var returnedUsers = activeUsers - newUsers;

                var retentionRate = newUsers == 0 ? 0 : ((double)returnedUsers / newUsers) * 100;

                trends.Add(new UserTrendData
                {
                    Date = currentDate,
                    NewUsers = newUsers,
                    ActiveUsers = activeUsers,
                    ReturnedUsers = Math.Max(0, returnedUsers),
                    RetentionRate = Math.Round(retentionRate, 2)
                });

                currentDate = nextDate;
            }

            return trends;
        }

        public async Task<List<UserDemographic>> GetUserDemographicsAsync(CancellationToken cancellationToken = default)
        {
            var demographics = new List<UserDemographic>();

            // Age demographics (based on created date as proxy)
            var totalUsers = await _context.Users.CountAsync(cancellationToken);
            if (totalUsers > 0)
            {
                var newUsers = await _context.Users.CountAsync(u => u.CreatedAt >= DateTime.UtcNow.AddMonths(-6), cancellationToken);
                var establishedUsers = await _context.Users.CountAsync(u => u.CreatedAt < DateTime.UtcNow.AddMonths(-6) && u.CreatedAt >= DateTime.UtcNow.AddYears(-2), cancellationToken);
                var veteranUsers = await _context.Users.CountAsync(u => u.CreatedAt < DateTime.UtcNow.AddYears(-2), cancellationToken);

                demographics.AddRange(new[]
                {
                    new UserDemographic { Category = "User Type", Value = "New (< 6 months)", Count = newUsers, Percentage = Math.Round((double)newUsers / totalUsers * 100, 1) },
                    new UserDemographic { Category = "User Type", Value = "Established (6m - 2y)", Count = establishedUsers, Percentage = Math.Round((double)establishedUsers / totalUsers * 100, 1) },
                    new UserDemographic { Category = "User Type", Value = "Veteran (> 2 years)", Count = veteranUsers, Percentage = Math.Round((double)veteranUsers / totalUsers * 100, 1) }
                });
            }

            return demographics;
        }

        public async Task<List<UserActivityTrend>> GetUserActivityTrendsAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
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
                    ReturnedUsers = Math.Max(0, activeUsers - newUsers)
                });

                currentDate = nextDate;
            }

            return trends;
        }

        public async Task<List<TopUser>> GetTopUsersAsync(int limit, CancellationToken cancellationToken = default)
        {
            return await _context.Users
                .Where(u => u.IsActive)
                .Select(u => new TopUser
                {
                    UserId = u.Id.ToString(),
                    Name = $"{u.FirstName} {u.LastName}",
                    Email = u.Email ?? "",
                    PostCount = u.Posts.Count(),
                    LikeCount = u.PostLikes.Count(),
                    CommentCount = u.Comments.Count(),
                    EngagementScore = u.Posts.Count() + u.PostLikes.Count() + u.Comments.Count()
                })
                .OrderByDescending(u => u.EngagementScore)
                .Take(limit)
                .ToListAsync(cancellationToken);
        }

        public async Task<double> CalculateUserRetentionRateAsync(CancellationToken cancellationToken = default)
        {
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
            var usersThirtyDaysAgo = await _context.Users.CountAsync(u => u.CreatedAt <= thirtyDaysAgo, cancellationToken);
            var activeUsersFromThirtyDaysAgo = await _context.Users.CountAsync(u => u.CreatedAt <= thirtyDaysAgo && u.LastLoginAt >= thirtyDaysAgo, cancellationToken);

            return usersThirtyDaysAgo == 0 ? 0 : ((double)activeUsersFromThirtyDaysAgo / usersThirtyDaysAgo) * 100;
        }

        private static (DateTime startDate, DateTime endDate) GetDateRange(DateTime? startDate, DateTime? endDate)
        {
            if (startDate.HasValue && endDate.HasValue)
                return (startDate.Value, endDate.Value);

            var now = DateTime.UtcNow;
            return (now.AddDays(-7), now);
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
