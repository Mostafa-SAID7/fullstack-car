using Application.Features.Admin.Analytics.Models;

namespace Application.Features.Admin.Analytics.Services
{
    public class SystemAnalyticsService : ISystemAnalyticsService
    {
        private readonly IApplicationDbContext _context;
        private readonly ILogger<SystemAnalyticsService> _logger;

        public SystemAnalyticsService(IApplicationDbContext context, ILogger<SystemAnalyticsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<SystemAnalytics> GetSystemAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            try
            {
                // Get basic system metrics from database
                var activeConnections = await _context.Users.CountAsync(u => u.LastLoginAt >= DateTime.UtcNow.AddMinutes(-30), cancellationToken);
                var totalSessions = await _context.UserSessions.CountAsync(s => s.IsActive, cancellationToken);

                // Mock system metrics - replace with actual system monitoring integration
                return new SystemAnalytics
                {
                    CpuUsage = GetRandomMetric(20, 80),
                    MemoryUsage = GetRandomMetric(30, 70),
                    DiskUsage = GetRandomMetric(40, 60),
                    NetworkTraffic = GetRandomMetric(100, 1000),
                    ActiveConnections = activeConnections,
                    AverageResponseTime = GetRandomMetric(50, 200),
                    ErrorRate = GetRandomMetric(0, 5),
                    Alerts = await GetSystemAlertsAsync(cancellationToken)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system analytics");
                throw;
            }
        }

        public async Task<List<SystemTrendData>> GetSystemTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "hour", CancellationToken cancellationToken = default)
        {
            var trends = new List<SystemTrendData>();
            var currentDate = startDate;
            var increment = granularity.ToLower() == "hour" ? TimeSpan.FromHours(1) : TimeSpan.FromDays(1);

            while (currentDate <= endDate)
            {
                var nextDate = currentDate.Add(increment);
                
                var activeConnections = await _context.Users.CountAsync(u => u.LastLoginAt >= currentDate && u.LastLoginAt < nextDate, cancellationToken);

                trends.Add(new SystemTrendData
                {
                    Date = currentDate,
                    CpuUsage = GetRandomMetric(20, 80),
                    MemoryUsage = GetRandomMetric(30, 70),
                    ActiveConnections = activeConnections,
                    ResponseTime = GetRandomMetric(50, 200)
                });

                currentDate = nextDate;
            }

            return trends;
        }

        public async Task<List<SystemAlert>> GetSystemAlertsAsync(CancellationToken cancellationToken = default)
        {
            // Mock system alerts - replace with actual system monitoring
            return new List<SystemAlert>
            {
                new() { Id = Guid.NewGuid().ToString(), Type = "Performance", Message = "High CPU usage detected", Severity = "Warning", Timestamp = DateTime.UtcNow.AddMinutes(-15), IsResolved = false },
                new() { Id = Guid.NewGuid().ToString(), Type = "Database", Message = "Slow query detected", Severity = "Info", Timestamp = DateTime.UtcNow.AddHours(-2), IsResolved = true }
            };
        }

        private static double GetRandomMetric(double min, double max)
        {
            return Math.Round(Random.Shared.NextDouble() * (max - min) + min, 2);
        }
    }
}
